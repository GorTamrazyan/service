// lib/firebase/orders.ts
import {
    collection,
    doc,
    getDocs,
    getDoc,
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
} from "firebase/firestore";
import { db } from "./firebase";
import { createOrderNotification } from "./notifications";

export interface Product {
    id: string;
    name: string;
    price: string;
    quantity: number;
}

export interface ConsultationInfo {
    consultationType: string;
    duration: number;
    price: number;
    scheduledDate?: Date;
    googleCalendarUrl?: string;
}

export interface ServiceInfo {
    serviceType: "delivery" | "installation" | "assembly" | "other";
    serviceName: string;
    description: string;
    price: number;
}

export interface Order {
    id?: string;
    userId: string;
    type: "product" | "consultation" | "service"; // Новое поле для типа заказа
    products: {
        id: string;
        name: string;
        price: string;
        quantity: number;
    }[];
    consultation?: ConsultationInfo; // Информация о консультации
    services?: ServiceInfo[]; // Информация об услугах
    totalPrice: string;
    status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "scheduled"
        | "completed";
    customerInfo: {
        name: string;
        email: string;
        phone?: string;
        address: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

// Преобразование Firestore документа в Order объект
export const firestoreToOrder = (
    doc: DocumentSnapshot<DocumentData>,
): Order | null => {
    if (!doc.exists()) return null;

    const data = doc.data();
    return {
        id: doc.id,
        userId: data.userId,
        type: data.type || "product", // По умолчанию 'product' для обратной совместимости
        products: data.products || [],
        consultation: data.consultation
            ? {
                  consultationType: data.consultation.consultationType,
                  duration: data.consultation.duration,
                  price: data.consultation.price,
                  scheduledDate: data.consultation.scheduledDate?.toDate(),
                  googleCalendarUrl: data.consultation.googleCalendarUrl,
              }
            : undefined,
        services: data.services
            ? data.services.map((service: any) => ({
                  serviceType: service.serviceType,
                  serviceName: service.serviceName,
                  description: service.description,
                  price: service.price,
              }))
            : undefined,
        totalPrice: data.totalPrice,
        status: data.status || "pending",
        customerInfo: data.customerInfo,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

// Преобразование Order объекта для Firestore
export const orderToFirestore = (order: Omit<Order, "id">): DocumentData => {
    const data: DocumentData = {
        userId: order.userId,
        type: order.type,
        products: order.products,
        totalPrice: order.totalPrice,
        status: order.status,
        customerInfo: order.customerInfo,
        createdAt: Timestamp.fromDate(order.createdAt),
        updatedAt: Timestamp.fromDate(order.updatedAt),
    };

    // Добавляем consultation если это консультация
    if (order.consultation) {
        data.consultation = {
            consultationType: order.consultation.consultationType,
            duration: order.consultation.duration,
            price: order.consultation.price,
            googleCalendarUrl: order.consultation.googleCalendarUrl,
        };

        if (order.consultation.scheduledDate) {
            data.consultation.scheduledDate = Timestamp.fromDate(
                order.consultation.scheduledDate,
            );
        }
    }

    // Добавляем services если они есть
    if (order.services && order.services.length > 0) {
        data.services = order.services.map((service) => ({
            serviceType: service.serviceType,
            serviceName: service.serviceName,
            description: service.description,
            price: service.price,
        }));
    }

    return data;
};

// Создать новый заказ
export const createOrder = async (
    order: Omit<Order, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
    try {
        const now = new Date();
        const orderData: Omit<Order, "id"> = {
            ...order,
            createdAt: now,
            updatedAt: now,
        };

        const ordersRef = collection(db, "orders");
        const docRef = await addDoc(ordersRef, orderToFirestore(orderData));

        const orderId = docRef.id;

        // Создаем уведомление только для заказов продуктов или услуг (НЕ для консультаций)
        if (order.type === "product" || order.type === "service") {
            console.log(`✅ Creating notification for ${order.type} order`);
            await createOrderNotification(orderId, order.customerInfo.name);
        } else {
            console.log(`ℹ️ Skipping notification for consultation order`);
        }

        return orderId;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

// Получить все заказы (только продукты и услуги, БЕЗ консультаций)
export const getAllOrders = async (): Promise<Order[]> => {
    try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        return querySnapshot.docs
            .map((doc) => firestoreToOrder(doc))
            .filter((order): order is Order => order !== null)
            .filter((order) => order.type !== "consultation"); // Исключаем консультации
    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
        throw error;
    }
};

// Получить заказы пользователя
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    try {
        console.log("getUserOrders: Fetching orders for user:", userId);
        const ordersRef = collection(db, "orders");
        const q = query(
            ordersRef,
            where("userId", "==", userId),
            orderBy("createdAt", "desc"),
        );
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        console.log("getUserOrders: Found orders:", querySnapshot.docs.length);

        return querySnapshot.docs
            .map((doc) => firestoreToOrder(doc))
            .filter((order): order is Order => order !== null);
    } catch (error) {
        console.error("Ошибка при получении заказов пользователя:", error);
        throw error;
    }
};

// Получить заказ по ID
export const getOrderById = async (id: string): Promise<Order | null> => {
    try {
        const orderRef = doc(db, "orders", id);
        const docSnap: DocumentSnapshot<DocumentData> = await getDoc(orderRef);
        return firestoreToOrder(docSnap);
    } catch (error) {
        console.error("Ошибка при получении заказа:", error);
        throw error;
    }
};

// Обновить статус заказа
export const updateOrderStatus = async (
    id: string,
    status: Order["status"],
): Promise<void> => {
    try {
        const orderRef = doc(db, "orders", id);
        await updateDoc(orderRef, {
            status: status,
            updatedAt: Timestamp.fromDate(new Date()),
        });
    } catch (error) {
        console.error("Ошибка при обновлении статуса заказа:", error);
        throw error;
    }
};

// Обновить заказ
export const updateOrder = async (
    id: string,
    order: Partial<Omit<Order, "id" | "createdAt">>,
): Promise<void> => {
    try {
        const orderRef = doc(db, "orders", id);
        const updateData = {
            ...order,
            updatedAt: Timestamp.fromDate(new Date()),
        };

        await updateDoc(orderRef, updateData);
    } catch (error) {
        console.error("Ошибка при обновлении заказа:", error);
        throw error;
    }
};

// Удалить заказ
export const deleteOrder = async (id: string): Promise<void> => {
    try {
        const orderRef = doc(db, "orders", id);
        await deleteDoc(orderRef);
    } catch (error) {
        console.error("Ошибка при удалении заказа:", error);
        throw error;
    }
};

// Создать заказ консультации
export const createConsultationOrder = async (
    userId: string,
    consultation: ConsultationInfo,
    customerInfo: {
        name: string;
        email: string;
        phone?: string;
    },
): Promise<string> => {
    try {
        const order: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
            userId,
            type: "consultation",
            products: [],
            consultation,
            totalPrice: consultation.price.toString(),
            status: "scheduled",
            customerInfo: {
                ...customerInfo,
                address: "Online Consultation", 
            },
        };

        return await createOrder(order);
    } catch (error) {
        console.error("Error creating consultation order:", error);
        throw error;
    }
};
