import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    where,
    updateDoc,
    deleteDoc,
    Timestamp,
    DocumentData,
    QuerySnapshot,
    DocumentSnapshot
} from "firebase/firestore";
import { db } from "./firebase";

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: {
        street?: string;
        houseNumber?: string;
        apartmentNumber?: string;
        city?: string;
        zipCode?: string;
    };
    createdAt: Date;
    lastLoginAt?: Date;
    isActive: boolean;
    emailVerified: boolean;
    orderCount?: number;
    totalSpent?: number;
}

const USERS_COLLECTION = "users";

export const firestoreToUser = (doc: DocumentSnapshot<DocumentData>): User | null => {
    if (!doc.exists()) return null;
    
    const data = doc.data();
    return {
        id: doc.id,
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        address: data.address || {},
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLoginAt: data.lastLoginAt?.toDate(),
        isActive: data.isActive !== false, 
        emailVerified: data.emailVerified || false,
        orderCount: data.orderCount || 0,
        totalSpent: data.totalSpent || 0
    };
};

export const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersRef = collection(db, USERS_COLLECTION);
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
        
        return querySnapshot.docs
            .map(doc => firestoreToUser(doc))
            .filter((user): user is User => user !== null);
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

export const getUserById = async (id: string): Promise<User | null> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, id);
        const docSnap: DocumentSnapshot<DocumentData> = await getDoc(userRef);
        return firestoreToUser(docSnap);
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

export const updateUserStatus = async (userId: string, isActive: boolean): Promise<void> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        await updateDoc(userRef, { 
            isActive,
            updatedAt: Timestamp.fromDate(new Date())
        });
    } catch (error) {
        console.error('Error updating user status:', error);
        throw error;
    }
};

export const deleteUser = async (userId: string): Promise<void> => {
    try {
        const userRef = doc(db, USERS_COLLECTION, userId);
        await deleteDoc(userRef);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

export const searchUsers = async (searchTerm: string): Promise<User[]> => {
    try {
        const usersRef = collection(db, USERS_COLLECTION);
        const querySnapshot = await getDocs(usersRef);
        
        const users = querySnapshot.docs
            .map(doc => firestoreToUser(doc))
            .filter((user): user is User => user !== null);
        
        const filteredUsers = users.filter(user => {
            const searchLower = searchTerm.toLowerCase();
            return (
                user.email.toLowerCase().includes(searchLower) ||
                user.firstName?.toLowerCase().includes(searchLower) ||
                user.lastName?.toLowerCase().includes(searchLower) ||
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower)
            );
        });
        
        return filteredUsers;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

export const getUsersStats = async () => {
    try {
        const users = await getAllUsers();
        
        const totalUsers = users.length;
        const activeUsers = users.filter(user => user.isActive).length;
        const verifiedUsers = users.filter(user => user.emailVerified).length;
        const newUsersThisMonth = users.filter(user => {
            const now = new Date();
            const userDate = user.createdAt;
            return userDate.getMonth() === now.getMonth() && 
                   userDate.getFullYear() === now.getFullYear();
        }).length;
        
        return {
            totalUsers,
            activeUsers,
            verifiedUsers,
            newUsersThisMonth
        };
    } catch (error) {
        console.error('Error getting users stats:', error);
        throw error;
    }
};