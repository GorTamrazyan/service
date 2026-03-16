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
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { TypeOfProduct } from "./types";

export const firestoreToTypeOfProduct = (doc: DocumentSnapshot<DocumentData>): TypeOfProduct | null => {
  if (!doc.exists()) return null;

  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate()
  };
};

export const typeOfProductToFirestore = (typeOfProduct: Omit<TypeOfProduct, 'id'>): DocumentData => {
  return {
    name: typeOfProduct.name,
    description: typeOfProduct.description || null,
    createdAt: typeOfProduct.createdAt ? Timestamp.fromDate(typeOfProduct.createdAt) : Timestamp.now(),
    updatedAt: typeOfProduct.updatedAt ? Timestamp.fromDate(typeOfProduct.updatedAt) : Timestamp.now()
  };
};

export const getAllTypeOfProducts = async (): Promise<TypeOfProduct[]> => {
  try {
    const typeOfProductsRef = collection(db, 'typeOfProducts');
    const q = query(typeOfProductsRef, orderBy('name', 'asc'));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    return querySnapshot.docs
      .map(doc => firestoreToTypeOfProduct(doc))
      .filter((typeOfProduct): typeOfProduct is TypeOfProduct => typeOfProduct !== null);
  } catch (error) {
    console.error('Ошибка при получении типов продуктов:', error);
    throw error;
  }
};

export const getTypeOfProductById = async (id: string): Promise<TypeOfProduct | null> => {
  try {
    const typeOfProductRef = doc(db, 'typeOfProducts', id);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(typeOfProductRef);
    return firestoreToTypeOfProduct(docSnap);
  } catch (error) {
    console.error('Ошибка при получении типа продукта:', error);
    throw error;
  }
};

export const createTypeOfProduct = async (
  typeOfProduct: Omit<TypeOfProduct, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    const now = new Date();
    const typeOfProductData: Omit<TypeOfProduct, 'id'> = {
      ...typeOfProduct,
      createdAt: now,
      updatedAt: now
    };

    const typeOfProductsRef = collection(db, 'typeOfProducts');
    const docRef = await addDoc(typeOfProductsRef, typeOfProductToFirestore(typeOfProductData));
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при создании типа продукта:', error);
    throw error;
  }
};

export const updateTypeOfProduct = async (
  id: string,
  typeOfProduct: Partial<Omit<TypeOfProduct, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const typeOfProductRef = doc(db, 'typeOfProducts', id);
    const updateData = {
      ...typeOfProduct,
      updatedAt: Timestamp.fromDate(new Date())
    };

    await updateDoc(typeOfProductRef, updateData);
  } catch (error) {
    console.error('Ошибка при обновлении типа продукта:', error);
    throw error;
  }
};

export const deleteTypeOfProduct = async (id: string): Promise<void> => {
  try {
    const typeOfProductRef = doc(db, 'typeOfProducts', id);
    await deleteDoc(typeOfProductRef);
  } catch (error) {
    console.error('Ошибка при удалении типа продукта:', error);
    throw error;
  }
};
