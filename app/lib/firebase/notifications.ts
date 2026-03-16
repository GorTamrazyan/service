import {
    collection,
    doc,
    getDocs,
    addDoc,
    query,
    orderBy,
    where,
    updateDoc,
    deleteDoc,
    Timestamp,
    DocumentData,
    QuerySnapshot,
    DocumentSnapshot,
    writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { Order } from "./orders";

export interface Notification {
    id?: string;
    type: "order";
    message: string;
    order_id: string;
    read: boolean;
    created_at: Timestamp;
}

export const firestoreToNotification = (
    doc: DocumentSnapshot<DocumentData>
): Notification | null => {
    if (!doc.exists()) return null;

    const data = doc.data();
    return {
        id: doc.id,
        type: data.type,
        message: data.message,
        order_id: data.order_id,
        read: data.read || false,
        created_at: data.created_at || Timestamp.now(),
    };
};

export const createOrderNotification = async (
    orderId: string,
    customerName: string
): Promise<string> => {
    try {
        const notificationData: Omit<Notification, "id"> = {
            type: "order",
            message: `New order #${orderId.slice(-8)} from ${customerName}`,
            order_id: orderId,
            read: false,
            created_at: Timestamp.now(),
        };

        const notificationsRef = collection(db, "notifications");
        const docRef = await addDoc(notificationsRef, notificationData);
        return docRef.id;
    } catch (error) {
        console.error("Ошибка при создании уведомления:", error);
        throw error;
    }
};

export const getAllNotifications = async (): Promise<Notification[]> => {
    try {
        const notificationsRef = collection(db, "notifications");
        const q = query(notificationsRef, orderBy("created_at", "desc"));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        const notifications = querySnapshot.docs
            .map((doc) => firestoreToNotification(doc))
            .filter(
                (notification): notification is Notification =>
                    notification !== null
            );

        console.log("Fetched notifications:", notifications.length);
        return notifications;
    } catch (error) {
        console.error("Ошибка при получении уведомлений:", error);
        throw error;
    }
};

export const getUnreadNotifications = async (): Promise<Notification[]> => {
    try {
        const notificationsRef = collection(db, "notifications");
        const q = query(
            notificationsRef,
            where("read", "==", false),
            orderBy("created_at", "desc")
        );
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        return querySnapshot.docs
            .map((doc) => firestoreToNotification(doc))
            .filter(
                (notification): notification is Notification =>
                    notification !== null
            );
    } catch (error) {
        console.error("Ошибка при получении непрочитанных уведомлений:", error);
        throw error;
    }
};

export const markNotificationAsRead = async (
    notificationId: string
): Promise<void> => {
    try {
        console.log("Marking notification as read:", notificationId);
        const notificationRef = doc(db, "notifications", notificationId);
        await updateDoc(notificationRef, {
            read: true,
        });
        console.log("Notification marked as read successfully");
    } catch (error) {
        console.error(
            "Ошибка при пометке уведомления как прочитанного:",
            error
        );
        throw error;
    }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    try {
        console.log("🔄 Starting to mark all notifications as read");

        const notificationsRef = collection(db, "notifications");
        const q = query(notificationsRef, where("read", "==", false));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("✅ No unread notifications to mark");
            return;
        }

        console.log(`📝 Found ${querySnapshot.size} unread notifications`);

        const batch = writeBatch(db);

        querySnapshot.docs.forEach((document) => {
            const notificationRef = doc(db, "notifications", document.id);
            batch.update(notificationRef, { read: true });
            console.log(`  ✓ Added to batch: ${document.id}`);
        });

        await batch.commit();
        console.log("✅ All notifications marked as read successfully");
    } catch (error) {
        console.error("❌ Error marking all notifications as read:", error);
        throw error;
    }
};

export const deleteNotification = async (
    notificationId: string
): Promise<void> => {
    try {
        console.log("Deleting notification:", notificationId);
        const notificationRef = doc(db, "notifications", notificationId);
        await deleteDoc(notificationRef);
        console.log("Notification deleted successfully");
    } catch (error) {
        console.error("Ошибка при удалении уведомления:", error);
        throw error;
    }
};
