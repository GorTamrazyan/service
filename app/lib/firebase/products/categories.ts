import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { Category } from "./types";

// Преобразование Firestore документа в Category объект
export const firestoreToCategory = (doc: DocumentSnapshot<DocumentData>): Category | null => {
  if (!doc.exists()) return null;

  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    parentCategoryId: data.parentCategoryId,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  };
};

// Преобразование Category объекта для Firestore
export const categoryToFirestore = (category: Omit<Category, 'id'>): DocumentData => {
  return {
    name: category.name,
    description: category.description || null,
    parentCategoryId: category.parentCategoryId || null,
    createdAt: category.createdAt ? Timestamp.fromDate(category.createdAt) : Timestamp.now(),
    updatedAt: category.updatedAt ? Timestamp.fromDate(category.updatedAt) : Timestamp.now()
  };
};

// Получить все категории
export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, orderBy('name', 'asc'));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    return querySnapshot.docs
      .map(doc => firestoreToCategory(doc))
      .filter((category): category is Category => category !== null);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    throw error;
  }
};

// Получить категорию по ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const categoryRef = doc(db, 'categories', id);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(categoryRef);
    return firestoreToCategory(docSnap);
  } catch (error) {
    console.error('Ошибка при получении категории:', error);
    throw error;
  }
};

// Получить подкатегории
export const getSubCategories = async (parentCategoryId: string): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('parentCategoryId', '==', parentCategoryId));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    return querySnapshot.docs
      .map(doc => firestoreToCategory(doc))
      .filter((category): category is Category => category !== null);
  } catch (error) {
    console.error('Ошибка при получении подкатегорий:', error);
    throw error;
  }
};

// Получить главные категории (без родителя)
export const getRootCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('parentCategoryId', '==', null));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    return querySnapshot.docs
      .map(doc => firestoreToCategory(doc))
      .filter((category): category is Category => category !== null);
  } catch (error) {
    console.error('Ошибка при получении главных категорий:', error);
    throw error;
  }
};

// Создать новую категорию
export const createCategory = async (
  category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const now = new Date();
    const categoryData: Omit<Category, 'id'> = {
      ...category,
      createdAt: now,
      updatedAt: now
    };

    const categoriesRef = collection(db, 'categories');
    const docRef = await addDoc(categoriesRef, categoryToFirestore(categoryData));
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при создании категории:', error);
    throw error;
  }
};

// Обновить категорию
export const updateCategory = async (
  id: string,
  category: Partial<Omit<Category, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const categoryRef = doc(db, 'categories', id);
    const updateData = {
      ...category,
      updatedAt: Timestamp.fromDate(new Date())
    };

    await updateDoc(categoryRef, updateData);
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
    throw error;
  }
};

// Удалить категорию
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    const categoryRef = doc(db, 'categories', id);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    throw error;
  }
};
