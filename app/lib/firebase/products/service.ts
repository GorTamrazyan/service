import { db } from "../firebase"; // Ваша инициализация Firestore
import { collection, getDocs } from "firebase/firestore";

// Типы для наших данных (это очень полезно в TypeScript!)
interface Service {
    id: string;
    icon: string;
    title: string;
    description: string;
    features: string[];
}

interface Consultation {
    id: string;
    title: string;
    description: string;
    price: string;
    features: string[];
}

/**
 * Асинхронная функция для получения всех услуг из коллекции 'services'.
 * @returns {Promise<Service[]>} Массив объектов услуг.
 */
export async function getAllServices(): Promise<Service[]> {
    try {
        const servicesCollection = collection(db, "services");
        const querySnapshot = await getDocs(servicesCollection);

        const servicesList: Service[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Service, "id">),
        }));

        return servicesList;
    } catch (error) {
        // Пробрасываем ошибку для обработки в Route Handler
        console.error("Firebase Error fetching services:", error);
        throw new Error(
            "Не удалось получить данные об услугах из базы данных."
        );
    }
}

/**
 * Асинхронная функция для получения всех консультаций из коллекции 'consultations'.
 * @returns {Promise<Consultation[]>} Массив объектов консультаций.
 */
export async function getAllConsultations(): Promise<Consultation[]> {
    try {
        const consultationsCollection = collection(db, "consultations");
        const querySnapshot = await getDocs(consultationsCollection);

        const consultationsList: Consultation[] = querySnapshot.docs.map(
            (doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Consultation, "id">),
            })
        );

        return consultationsList;
    } catch (error) {
        console.error("Firebase Error fetching consultations:", error);
        throw new Error(
            "Не удалось получить данные о консультациях из базы данных."
        );
    }
}
