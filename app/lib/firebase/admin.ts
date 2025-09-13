// lib/firebase/admin.ts
import { collection, doc, getDoc, getDocs, setDoc, query, where, addDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export interface AdminUser {
    id: string;
    email: string;
    username: string;
    role: 'super_admin' | 'admin' | 'moderator';
    permissions: string[];
    createdAt: Date;
    lastLoginAt?: Date;
    isActive: boolean;
}

export interface AdminSession {
    adminId: string;
    sessionToken: string;
    createdAt: Date;
    expiresAt: Date;
    isActive: boolean;
}

// Admin collection name
const ADMIN_COLLECTION = "admins";
const ADMIN_SESSIONS_COLLECTION = "admin_sessions";

// Create an admin user (only for initial setup)
export const createAdminUser = async (
    email: string, 
    password: string, 
    username: string, 
    role: AdminUser['role'] = 'admin'
): Promise<AdminUser> => {
    try {
        // Create Firebase Auth user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Create admin document in Firestore
        const adminData: Omit<AdminUser, 'id'> = {
            email,
            username,
            role,
            permissions: getPermissionsForRole(role),
            createdAt: new Date(),
            isActive: true
        };

        const adminDocRef = doc(db, ADMIN_COLLECTION, firebaseUser.uid);
        await setDoc(adminDocRef, adminData);

        console.log("✅ Admin user created successfully:", adminData);

        return {
            id: firebaseUser.uid,
            ...adminData
        };
    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        throw error;
    }
};

// Get permissions based on role
const getPermissionsForRole = (role: AdminUser['role']): string[] => {
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

// Login admin user
export const loginAdmin = async (email: string, password: string): Promise<{
    admin: AdminUser;
    sessionToken: string;
}> => {
    try {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Get admin data from Firestore
        const adminDocRef = doc(db, ADMIN_COLLECTION, firebaseUser.uid);
        const adminDoc = await getDoc(adminDocRef);

        if (!adminDoc.exists()) {
            throw new Error("Admin account not found");
        }

        const adminData = adminDoc.data() as Omit<AdminUser, 'id'>;
        
        if (!adminData.isActive) {
            throw new Error("Admin account is deactivated");
        }

        const admin: AdminUser = {
            id: firebaseUser.uid,
            ...adminData
        };

        // Update last login time
        await setDoc(adminDocRef, {
            ...adminData,
            lastLoginAt: new Date()
        });

        // Create session
        const sessionToken = generateSessionToken();
        const session: Omit<AdminSession, 'id'> = {
            adminId: firebaseUser.uid,
            sessionToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
            isActive: true
        };

        const sessionRef = await addDoc(collection(db, ADMIN_SESSIONS_COLLECTION), session);
        console.log("✅ Admin session created:", sessionRef.id);

        return {
            admin,
            sessionToken
        };
    } catch (error: any) {
        console.error("❌ Admin login error:", error);
        throw new Error(error.message || "Login failed");
    }
};

// Verify admin session
export const verifyAdminSession = async (sessionToken: string): Promise<AdminUser | null> => {
    try {
        // Find session in database
        const sessionsRef = collection(db, ADMIN_SESSIONS_COLLECTION);
        const sessionQuery = query(
            sessionsRef, 
            where("sessionToken", "==", sessionToken),
            where("isActive", "==", true)
        );
        
        const sessionSnapshot = await getDocs(sessionQuery);
        
        if (sessionSnapshot.empty) {
            return null;
        }

        const sessionDoc = sessionSnapshot.docs[0];
        const sessionData = sessionDoc.data() as AdminSession;

        // Check if session is expired
        if (new Date() > sessionData.expiresAt.toDate()) {
            // Deactivate expired session
            await setDoc(doc(db, ADMIN_SESSIONS_COLLECTION, sessionDoc.id), {
                ...sessionData,
                isActive: false
            });
            return null;
        }

        // Get admin data
        const adminDocRef = doc(db, ADMIN_COLLECTION, sessionData.adminId);
        const adminDoc = await getDoc(adminDocRef);

        if (!adminDoc.exists()) {
            return null;
        }

        const adminData = adminDoc.data() as Omit<AdminUser, 'id'>;
        
        if (!adminData.isActive) {
            return null;
        }

        return {
            id: sessionData.adminId,
            ...adminData
        };
    } catch (error) {
        console.error("❌ Error verifying admin session:", error);
        return null;
    }
};

// Logout admin
export const logoutAdmin = async (sessionToken: string): Promise<void> => {
    try {
        // Find and deactivate session
        const sessionsRef = collection(db, ADMIN_SESSIONS_COLLECTION);
        const sessionQuery = query(
            sessionsRef, 
            where("sessionToken", "==", sessionToken),
            where("isActive", "==", true)
        );
        
        const sessionSnapshot = await getDocs(sessionQuery);
        
        for (const sessionDoc of sessionSnapshot.docs) {
            await setDoc(doc(db, ADMIN_SESSIONS_COLLECTION, sessionDoc.id), {
                ...sessionDoc.data(),
                isActive: false
            });
        }

        // Sign out from Firebase Auth
        await auth.signOut();
        
        console.log("✅ Admin logged out successfully");
    } catch (error) {
        console.error("❌ Error logging out admin:", error);
        throw error;
    }
};

// Get all admins (only for super_admin)
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

// Generate random session token
const generateSessionToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) + 
           Date.now().toString(36);
};

// Initialize default admin (run once)
export const initializeDefaultAdmin = async () => {
    try {
        const adminsRef = collection(db, ADMIN_COLLECTION);
        const adminsSnapshot = await getDocs(adminsRef);
        
        if (adminsSnapshot.empty) {
            console.log("🔧 No admins found, creating default admin...");
            await createAdminUser(
                "admin@oniksvinyl.com",
                "admin123456",
                "admin",
                "super_admin"
            );
            console.log("✅ Default admin created successfully!");
            console.log("📧 Email: admin@oniksvinyl.com");
            console.log("🔑 Password: admin123456");
        } else {
            console.log("ℹ️ Admin users already exist");
        }
    } catch (error) {
        console.error("❌ Error initializing default admin:", error);
    }
};