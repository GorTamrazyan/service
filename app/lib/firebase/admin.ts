// lib/firebase/admin.ts
import { collection, doc, getDoc, getDocs, setDoc, query, where, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface AdminUser {
    id: string;
    email: string;
    username: string;
    role: 'super_admin' | 'admin' | 'moderator';
    permissions: string[];
    createdAt: Date | any; // Firestore Timestamp or Date
    lastLoginAt?: Date | any; // Firestore Timestamp or Date
    isActive: boolean;
}

export interface AdminSession {
    adminId: string;
    sessionToken: string;
    createdAt: Date | any; // Firestore Timestamp or Date
    expiresAt: Date | any; // Firestore Timestamp or Date
    isActive: boolean;
}

// Admin collection name
const ADMIN_COLLECTION = "admins";
const ADMIN_SESSIONS_COLLECTION = "admin_sessions";

// Create an admin user (только Firestore, без Firebase Auth)
export const createAdminUser = async (
    email: string,
    password: string,
    username: string,
    role: AdminUser['role'] = 'admin'
): Promise<AdminUser> => {
    try {
        // Create admin document in Firestore (без Firebase Auth)
        const adminData = {
            email,
            username,
            password, // В продакшене используйте bcrypt!
            role,
            permissions: getPermissionsForRole(role),
            createdAt: new Date(),
            isActive: true
        };

        const adminDocRef = await addDoc(collection(db, ADMIN_COLLECTION), adminData);

        console.log("✅ Admin user created successfully:", adminData);

        return {
            id: adminDocRef.id,
            email: adminData.email,
            username: adminData.username,
            role: adminData.role,
            permissions: adminData.permissions,
            createdAt: adminData.createdAt,
            isActive: adminData.isActive
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

// Login admin user (без Firebase Auth, только Firestore)
export const loginAdmin = async (email: string, password: string): Promise<{
    admin: AdminUser;
    sessionToken: string;
}> => {
    try {
        // Find admin by email in Firestore
        const adminsRef = collection(db, ADMIN_COLLECTION);
        const adminQuery = query(adminsRef, where("email", "==", email));
        const adminSnapshot = await getDocs(adminQuery);

        if (adminSnapshot.empty) {
            throw new Error("Admin account not found");
        }

        const adminDoc = adminSnapshot.docs[0];
        const adminData = adminDoc.data() as Omit<AdminUser, 'id'> & { password: string };

        // Verify password (in production, use bcrypt!)
        if (adminData.password !== password) {
            throw new Error("Invalid password");
        }

        if (!adminData.isActive) {
            throw new Error("Admin account is deactivated");
        }

        const admin: AdminUser = {
            id: adminDoc.id,
            email: adminData.email,
            username: adminData.username,
            role: adminData.role,
            permissions: adminData.permissions,
            createdAt: adminData.createdAt,
            lastLoginAt: adminData.lastLoginAt,
            isActive: adminData.isActive
        };

        // Update last login time
        await setDoc(doc(db, ADMIN_COLLECTION, adminDoc.id), {
            ...adminData,
            lastLoginAt: new Date()
        });

        // Create session
        const sessionToken = generateSessionToken();
        const session: Omit<AdminSession, 'id'> = {
            adminId: adminDoc.id,
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
        const expiresAt = toDate(sessionData.expiresAt);
        if (new Date() > expiresAt) {
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

// Logout admin (без Firebase Auth)
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

// Helper function to convert Firestore Timestamp to Date
const toDate = (dateField: Date | any): Date => {
    if (dateField instanceof Date) {
        return dateField;
    }
    if (dateField && typeof dateField.toDate === 'function') {
        return dateField.toDate();
    }
    // Fallback to current date if conversion fails
    console.warn('Could not convert date field, using current date');
    return new Date();
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
                "gor.tamrazyan5@mail.ru",
                "123321",
                "admin",
                "super_admin"
            );
            console.log("✅ Default admin created successfully!");
            console.log("📧 Email: gor.tamrazyan5@mail.ru");
            console.log("🔑 Password: 123321");
        } else {
            console.log("ℹ️ Admin users already exist");
        }
    } catch (error) {
        console.error("❌ Error initializing default admin:", error);
    }
};