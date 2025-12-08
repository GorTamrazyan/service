import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    DocumentData,
    QuerySnapshot,
    DocumentSnapshot,
    Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { Color } from "./types";

// Преобразование Firestore документа в Color объект
export const firestoreToColor = (
    doc: DocumentSnapshot<DocumentData>
): Color | null => {
    if (!doc.exists()) return null;

    const data = doc.data();

    // Обеспечиваем, что name всегда строка
    const name = Array.isArray(data.name)
        ? data.name[0] // Если массив, берем первый элемент
        : data.name || ""; // Если undefined, используем пустую строку

    return {
        id: doc.id,
        name: name,
        hexCode: data.hexCode || "",
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
    };
};

// Преобразование Color объекта для Firestore
export const colorToFirestore = (color: Omit<Color, "id">): DocumentData => {
    return {
        name: color.name, // Теперь это строка
        hexCode: color.hexCode,
        createdAt: color.createdAt
            ? Timestamp.fromDate(color.createdAt)
            : Timestamp.now(),
        updatedAt: color.updatedAt
            ? Timestamp.fromDate(color.updatedAt)
            : Timestamp.now(),
    };
};

// Получить все цвета
export const getAllColors = async (): Promise<Color[]> => {
    try {
        const colorsRef = collection(db, "colors");
        const q = query(colorsRef, orderBy("name", "asc"));
        const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

        return querySnapshot.docs
            .map((doc) => firestoreToColor(doc))
            .filter((color): color is Color => color !== null);
    } catch (error) {
        console.error("Ошибка при получении цветов:", error);
        throw error;
    }
};

// Получить цвет по ID
export const getColorById = async (id: string): Promise<Color | null> => {
    try {
        const colorRef = doc(db, "colors", id);
        const docSnap: DocumentSnapshot<DocumentData> = await getDoc(colorRef);
        return firestoreToColor(docSnap);
    } catch (error) {
        console.error("Ошибка при получении цвета:", error);
        throw error;
    }
};

// Создать новый цвет
export const createColor = async (
    color: Omit<Color, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
    try {
        const now = new Date();
        const colorData: Omit<Color, "id"> = {
            ...color,
            createdAt: now,
            updatedAt: now,
        };

        const colorsRef = collection(db, "colors");
        const docRef = await addDoc(colorsRef, colorToFirestore(colorData));
        return docRef.id;
    } catch (error) {
        console.error("Ошибка при создании цвета:", error);
        throw error;
    }
};

// Обновить цвет
export const updateColor = async (
    id: string,
    color: Partial<Omit<Color, "id" | "createdAt">>
): Promise<void> => {
    try {
        const colorRef = doc(db, "colors", id);
        const updateData = {
            ...color,
            updatedAt: Timestamp.fromDate(new Date()),
        };

        await updateDoc(colorRef, updateData);
    } catch (error) {
        console.error("Ошибка при обновлении цвета:", error);
        throw error;
    }
};

// Удалить цвет
export const deleteColor = async (id: string): Promise<void> => {
    try {
        const colorRef = doc(db, "colors", id);
        await deleteDoc(colorRef);
    } catch (error) {
        console.error("Ошибка при удалении цвета:", error);
        throw error;
    }
};
