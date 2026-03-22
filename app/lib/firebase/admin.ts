import { collection, doc, getDoc, getDocs, setDoc, query, where, addDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db, auth } from "./firebase";

export interface AdminUser {
    id: string;
    email: string;
    username: string;
    role: 'super_admin' | 'admin' | 'moderator';
    permissions: string[];
    createdAt: Date | any;
    lastLoginAt?: Date | any;
    isActive: boolean;
}

const ADMIN_COLLECTION = "admins";

export const loginAdmin = async (email: string, password: string): Promise<{ admin: AdminUser }> => {
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        if (!user.emailVerified) {
            await signOut(auth);
            throw new Error("Email not verified. Please check your inbox and verify your email before logging in.");
        }

        const adminDocRef = doc(db, ADMIN_COLLECTION, user.uid);
        const adminDoc = await getDoc(adminDocRef);

        if (!adminDoc.exists()) {
            await signOut(auth);
            throw new Error("Admin account not found");
        }

        const adminData = adminDoc.data() as Omit<AdminUser, 'id'>;

        if (!adminData.isActive) {
            await signOut(auth);
            throw new Error("Admin account is deactivated");
        }

        await setDoc(adminDocRef, { ...adminData, lastLoginAt: new Date() });

        return {
            admin: { id: user.uid, ...adminData }
        };
    } catch (error: any) {
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
            throw new Error("Invalid email or password");
        }
        if (error.code === 'auth/user-not-found') {
            throw new Error("Admin account not found");
        }
        if (error.code === 'auth/too-many-requests') {
            throw new Error("Too many failed attempts. Please try again later.");
        }
        throw new Error(error.message || "Login failed");
    }
};

export const logoutAdmin = async (): Promise<void> => {
    await signOut(auth);
};

export const getAllAdmins = async (): Promise<AdminUser[]> => {
    try {
        const adminsRef = collection(db, ADMIN_COLLECTION);
        const adminsSnapshot = await getDocs(adminsRef);

        const admins: AdminUser[] = [];
        adminsSnapshot.forEach((doc) => {
            admins.push({
                id: doc.id,
                ...doc.data() as Omit<AdminUser, 'id'>
            });
        });

        return admins;
    } catch (error) {
        console.error("❌ Error getting admins:", error);
        throw error;
    }
};

const FIREBASE_API_KEY = "AIzaSyDQh8gM-8gX4dbQ9MiBjN8WYO0dCJ6Gm1I";

export const createAdminUser = async (
    email: string,
    username: string,
    role: AdminUser['role'] = 'admin',
    password: string,
    permissions: string[]
): Promise<AdminUser> => {
    const signUpRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
        }
    );

    const signUpData = await signUpRes.json();
    if (signUpData.error) {
        const msg = signUpData.error.message;
        if (msg === 'EMAIL_EXISTS') throw new Error('Admin with this email already exists');
        throw new Error(msg);
    }

    const { localId: uid, idToken } = signUpData;

    await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${FIREBASE_API_KEY}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestType: 'VERIFY_EMAIL', idToken }),
        }
    );

    const adminData = {
        email,
        username,
        role,
        permissions,
        createdAt: new Date(),
        isActive: true,
    };

    await setDoc(doc(db, ADMIN_COLLECTION, uid), adminData);

    return { id: uid, ...adminData };
};

export const updateAdminPermissions = async (
    adminId: string,
    role: AdminUser['role'],
    permissions: string[]
): Promise<void> => {
    const adminDocRef = doc(db, ADMIN_COLLECTION, adminId);
    const adminDoc = await getDoc(adminDocRef);
    if (!adminDoc.exists()) throw new Error("Admin not found");

    await setDoc(adminDocRef, { ...adminDoc.data(), role, permissions });
};

export const toggleAdminStatus = async (
    adminId: string,
    isActive: boolean
): Promise<void> => {
    const adminDocRef = doc(db, ADMIN_COLLECTION, adminId);
    const adminDoc = await getDoc(adminDocRef);
    if (!adminDoc.exists()) throw new Error("Admin not found");

    await setDoc(adminDocRef, { ...adminDoc.data(), isActive });
};

export const getPermissionsForRole = (role: AdminUser['role']): string[] => {
    switch (role) {
        case 'super_admin':
            return [
                'manage_admins',
                'manage_products',
                'manage_orders',
                'manage_users',
                'view_analytics',
                'manage_settings',
                'delete_data'
            ];
        case 'admin':
            return [
                'manage_products',
                'manage_orders',
                'manage_users',
                'view_analytics'
            ];
        case 'moderator':
            return [
                'view_products',
                'manage_orders',
                'view_users'
            ];
        default:
            return [];
    }
};
