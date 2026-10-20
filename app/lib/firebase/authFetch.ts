import { auth } from "./firebase";

// fetch() that attaches the signed-in user's Firebase ID token for protected API routes
export const authFetch = async (input: string, init: RequestInit = {}): Promise<Response> => {
    const user = auth.currentUser;
    const headers = new Headers(init.headers);
    if (user) {
        headers.set("Authorization", `Bearer ${await user.getIdToken()}`);
    }
    return fetch(input, { ...init, headers });
};
