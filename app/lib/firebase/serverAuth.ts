import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth, DecodedIdToken } from "firebase-admin/auth";

// Server-side request authentication.
// Verifying ID tokens needs only the project ID (no service account credentials).
// Firestore reads on behalf of the caller go through the REST API with the caller's
// own ID token, so the same Security Rules apply as in the browser.

const PROJECT_ID = "mywebsiteauth-c45cd";
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

const adminApp = getApps().length ? getApps()[0] : initializeApp({ projectId: PROJECT_ID });

export interface AuthContext {
    token: string;
    user: DecodedIdToken;
}

export class AuthError extends Error {
    constructor(message: string, public status: 401 | 403) {
        super(message);
    }
}

export const requireUser = async (request: Request): Promise<AuthContext> => {
    const header = request.headers.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) {
        throw new AuthError("Authentication required", 401);
    }
    try {
        const user = await getAuth(adminApp).verifyIdToken(token);
        return { token, user };
    } catch {
        throw new AuthError("Invalid or expired token", 401);
    }
};

// Keep in sync with ADMIN_SESSION_MS in admin.ts and firestore.rules
const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

export const requireAdmin = async (request: Request): Promise<AuthContext> => {
    const ctx = await requireUser(request);
    if (!ctx.user.email_verified) {
        throw new AuthError("Admin access required", 403);
    }
    if (Date.now() / 1000 - ctx.user.auth_time > ADMIN_SESSION_SECONDS) {
        throw new AuthError("Admin session expired, please sign in again", 401);
    }
    const admin = await getDocumentAsUser(`admins/${ctx.user.uid}`, ctx.token);
    if (!admin || admin.isActive !== true) {
        throw new AuthError("Admin access required", 403);
    }
    return ctx;
};

export const authErrorResponse = (error: unknown): Response | null => {
    if (error instanceof AuthError) {
        return Response.json({ success: false, error: error.message }, { status: error.status });
    }
    return null;
};

type FirestoreValue = Record<string, any>;

const fromFirestoreValue = (value: FirestoreValue): any => {
    if ("stringValue" in value) return value.stringValue;
    if ("booleanValue" in value) return value.booleanValue;
    if ("integerValue" in value) return Number(value.integerValue);
    if ("doubleValue" in value) return value.doubleValue;
    if ("timestampValue" in value) return value.timestampValue;
    if ("nullValue" in value) return null;
    if ("arrayValue" in value) return (value.arrayValue.values || []).map(fromFirestoreValue);
    if ("mapValue" in value) return fromFirestoreFields(value.mapValue.fields || {});
    return undefined;
};

const fromFirestoreFields = (fields: Record<string, FirestoreValue>) =>
    Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, fromFirestoreValue(v)]));

// Reads a document as the calling user; returns null if missing or denied by rules
export const getDocumentAsUser = async (path: string, token: string): Promise<Record<string, any> | null> => {
    const res = await fetch(`${FIRESTORE_URL}/${path}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) return null;
    const doc = await res.json();
    return fromFirestoreFields(doc.fields || {});
};

// Runs an equality query as the calling user; throws if denied by rules
export const queryAsUser = async (
    collectionId: string,
    field: string,
    value: string,
    token: string
): Promise<Record<string, any>[]> => {
    const res = await fetch(`${FIRESTORE_URL}:runQuery`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            structuredQuery: {
                from: [{ collectionId }],
                where: { fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value: { stringValue: value } } },
            },
        }),
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error(`Firestore query failed: ${res.status}`);
    }
    const rows: Array<{ document?: { fields?: Record<string, FirestoreValue> } }> = await res.json();
    return rows.filter((r) => r.document).map((r) => fromFirestoreFields(r.document!.fields || {}));
};

const guard = async (request: Request, check: (request: Request) => Promise<AuthContext>): Promise<Response | null> => {
    try {
        await check(request);
        return null;
    } catch (error) {
        console.error("Auth check failed:", error);
        return authErrorResponse(error) ?? Response.json({ success: false, error: "Auth check failed" }, { status: 500 });
    }
};

// Usage in a route handler: const denied = await guardAdmin(request); if (denied) return denied;
export const guardAdmin = (request: Request) => guard(request, requireAdmin);
export const guardUser = (request: Request) => guard(request, requireUser);

const toFirestoreValue = (value: unknown): FirestoreValue => {
    if (value === null || value === undefined) return { nullValue: null };
    if (value instanceof Date) return { timestampValue: value.toISOString() };
    if (typeof value === "string") return { stringValue: value };
    if (typeof value === "boolean") return { booleanValue: value };
    if (typeof value === "number") {
        return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
    }
    if (Array.isArray(value)) return { arrayValue: { values: value.map(toFirestoreValue) } };
    if (typeof value === "object") return { mapValue: { fields: toFirestoreFields(value as Record<string, unknown>) } };
    throw new Error(`Unsupported Firestore value: ${typeof value}`);
};

const toFirestoreFields = (data: Record<string, unknown>) =>
    Object.fromEntries(
        Object.entries(data)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, toFirestoreValue(v)])
    );

const writeAsUser = async (url: string, method: string, token: string, data?: Record<string, unknown>) => {
    const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: data ? JSON.stringify({ fields: toFirestoreFields(data) }) : undefined,
        cache: "no-store",
    });
    if (!res.ok) {
        throw new Error(`Firestore ${method} failed: ${res.status}`);
    }
    return res.status === 204 ? null : res.json();
};

// Write helpers that act as the calling user, so Firestore Security Rules apply
export const createDocumentAsUser = async (collectionId: string, data: Record<string, unknown>, token: string) => {
    const doc = await writeAsUser(`${FIRESTORE_URL}/${collectionId}`, "POST", token, data);
    return (doc.name as string).split("/").pop()!;
};

export const updateDocumentAsUser = async (path: string, data: Record<string, unknown>, token: string) => {
    const mask = Object.keys(data)
        .filter((k) => data[k] !== undefined)
        .map((k) => `updateMask.fieldPaths=${encodeURIComponent(k)}`)
        .join("&");
    // currentDocument.exists=true makes this an update, never an upsert
    await writeAsUser(`${FIRESTORE_URL}/${path}?${mask}&currentDocument.exists=true`, "PATCH", token, data);
};

export const deleteDocumentAsUser = async (path: string, token: string) => {
    await writeAsUser(`${FIRESTORE_URL}/${path}`, "DELETE", token);
};
