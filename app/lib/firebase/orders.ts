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
    DocumentSnapshot
} from "firebase/firestore";
import { db } from "./firebase";
import { createOrderNotification } from "./notifications";

export interface Product {
    id: string;
    name: string;
    price: string;
    quantity: number;
}

export interface Order {
    id?: string;
    userId: string;
    products: {
        id: string;
        name: string;
        price: string;
        quantity: number;
    }[];
    totalPrice: string;
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
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
export const firestoreToOrder = (doc: DocumentSnapshot<DocumentData>): Order | null => {
    if (!doc.exists()) return null;

    const data = doc.data();
    return {
        id: doc.id,
        userId: data.userId,
        products: data.products || [],
        totalPrice: data.totalPrice,
        status: data.status || 'pending',
        customerInfo: data.customerInfo,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date()
    };
};

// Преобразование Order объекта для Firestore
export const orderToFirestore = (order: Omit<Order, 'id'>): DocumentData => {
    return {
        userId: order.userId,
        products: order.products,
        totalPrice: order.totalPrice,
        status: order.status,
        customerInfo: order.customerInfo,
        createdAt: Timestamp.fromDate(order.createdAt),
        updatedAt: Timestamp.fromDate(order.updatedAt)
    };
};

// Создать новый заказ
// В lib/firebase/orders.ts
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
        const now = new Date();
        const orderData: Omit<Order, 'id'> = {
            ...order,
            createdAt: now,
            updatedAt: now
        };

        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, orderToFirestore(orderData));
        
        const orderId = docRef.id;
        
        // Создаем простое уведомление
        await createOrderNotification(orderId, order.customerInfo.name);
        
        return orderId;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Получить все заказы
export const getAllOrders = async (): Promise<Order[]> => {
    try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        return querySnapshot.docs
            .map(doc => firestoreToOrder(doc))
            .filter((order): order is Order => order !== null);
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        throw error;
    }
};

// Получить заказы пользователя
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    try {
        console.log('getUserOrders: searching for userId =', userId);
        const ordersRef = collection(db, 'orders');
        // Временно убираем orderBy, чтобы избежать проблем с индексом
        const q = query(ordersRef, where('userId', '==', userId));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        console.log('getUserOrders: found', querySnapshot.docs.length, 'documents');

        // Проверим все заказы в коллекции для отладки
        const allOrdersRef = collection(db, 'orders');
        const allQuerySnapshot = await getDocs(allOrdersRef);
        console.log('getUserOrders: total orders in collection:', allQuerySnapshot.docs.length);

        allQuerySnapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log('Order in DB:', {
                id: doc.id,
                userId: data.userId,
                customerName: data.customerInfo?.name,
                totalPrice: data.totalPrice
            });
        });

        let orders = querySnapshot.docs
            .map(doc => firestoreToOrder(doc))
            .filter((order): order is Order => order !== null);

        // Сортируем на клиенте по дате создания (новые сверху)
        orders = orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        console.log('getUserOrders: returning', orders.length, 'orders for user');
        return orders;
    } catch (error) {
        console.error('Ошибка при получении заказов пользователя:', error);
        throw error;
    }
};

// Получить заказ по ID
export const getOrderById = async (id: string): Promise<Order | null> => {
    try {
        const orderRef = doc(db, 'orders', id);
        const docSnap: DocumentSnapshot<DocumentData> = await getDoc(orderRef);
        return firestoreToOrder(docSnap);
    } catch (error) {
        console.error('Ошибка при получении заказа:', error);
        throw error;
    }
};

// Обновить статус заказа
export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
    try {
        const orderRef = doc(db, 'orders', id);
        await updateDoc(orderRef, {
            status: status,
            updatedAt: Timestamp.fromDate(new Date())
        });
    } catch (error) {
        console.error('Ошибка при обновлении статуса заказа:', error);
        throw error;
    }
};

// Обновить заказ
export const updateOrder = async (id: string, order: Partial<Omit<Order, 'id' | 'createdAt'>>): Promise<void> => {
    try {
        const orderRef = doc(db, 'orders', id);
        const updateData = {
            ...order,
            updatedAt: Timestamp.fromDate(new Date())
        };

        await updateDoc(orderRef, updateData);
    } catch (error) {
        console.error('Ошибка при обновлении заказа:', error);
        throw error;
    }
};

// Удалить заказ
export const deleteOrder = async (id: string): Promise<void> => {
    try {
        const orderRef = doc(db, 'orders', id);
        await deleteDoc(orderRef);
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        throw error;
    }
};