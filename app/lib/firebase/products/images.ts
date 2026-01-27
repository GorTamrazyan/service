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
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { Image } from "./types";

// Преобразование Firestore документа в Image объект
export const firestoreToImage = (doc: DocumentSnapshot<DocumentData>): Image | null => {
  if (!doc.exists()) return null;

  const data = doc.data();
  return {
    id: doc.id,
    url: data.url,
    alt: data.alt,
    productId: data.productId,
    isPrimary: data.isPrimary,
    order: data.order,
    createdAt: data.createdAt?.toDate()
  };
};

// Преобразование Image объекта для Firestore
export const imageToFirestore = (image: Omit<Image, 'id'>): DocumentData => {
  return {
    url: image.url,
    alt: image.alt || null,
    productId: image.productId,
    isPrimary: image.isPrimary || false,
    order: image.order || 0,
    createdAt: image.createdAt ? Timestamp.fromDate(image.createdAt) : Timestamp.now()
  };
};

// Получить все изображения продукта
export const getImagesByProductId = async (productId: string): Promise<Image[]> => {
  try {
    const imagesRef = collection(db, 'images');
    const q = query(
      imagesRef,
      where('productId', '==', productId)
    );
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    const images = querySnapshot.docs
      .map(doc => firestoreToImage(doc))
      .filter((image): image is Image => image !== null);

    // Сортируем на клиенте вместо Firestore (не требует индекса)
    return images.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error('Ошибка при получении изображений продукта:', error);
    throw error;
  }
};

// Получить основное изображение продукта
export const getPrimaryImageByProductId = async (productId: string): Promise<Image | null> => {
  try {
    // Получаем все изображения продукта и фильтруем на клиенте
    const images = await getImagesByProductId(productId);
    return images.find(img => img.isPrimary) || images[0] || null;
  } catch (error) {
    console.error('Ошибка при получении основного изображения:', error);
    throw error;
  }
};

// Получить изображение по ID
export const getImageById = async (id: string): Promise<Image | null> => {
  try {
    const imageRef = doc(db, 'images', id);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(imageRef);
    return firestoreToImage(docSnap);
  } catch (error) {
    console.error('Ошибка при получении изображения:', error);
    throw error;
  }
};

// Создать новое изображение
export const createImage = async (
  image: Omit<Image, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const now = new Date();
    const imageData: Omit<Image, 'id'> = {
      ...image,
      createdAt: now
    };

    const imagesRef = collection(db, 'images');
    const docRef = await addDoc(imagesRef, imageToFirestore(imageData));
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при создании изображения:', error);
    throw error;
  }
};

// Обновить изображение
export const updateImage = async (
  id: string,
  image: Partial<Omit<Image, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const imageRef = doc(db, 'images', id);
    await updateDoc(imageRef, image);
  } catch (error) {
    console.error('Ошибка при обновлении изображения:', error);
    throw error;
  }
};

// Удалить изображение
export const deleteImage = async (id: string): Promise<void> => {
  try {
    const imageRef = doc(db, 'images', id);
    await deleteDoc(imageRef);
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    throw error;
  }
};

// Удалить все изображения продукта
export const deleteImagesByProductId = async (productId: string): Promise<void> => {
  try {
    const images = await getImagesByProductId(productId);
    const deletePromises = images.map(image => deleteImage(image.id!));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Ошибка при удалении изображений продукта:', error);
    throw error;
  }
};

// Установить основное изображение (сбросить другие isPrimary)
export const setPrimaryImage = async (imageId: string, productId: string): Promise<void> => {
  try {
    // Сбросить isPrimary у всех изображений продукта
    const images = await getImagesByProductId(productId);
    const resetPromises = images.map(image =>
      updateImage(image.id!, { isPrimary: false })
    );
    await Promise.all(resetPromises);

    // Установить isPrimary для выбранного изображения
    await updateImage(imageId, { isPrimary: true });
  } catch (error) {
    console.error('Ошибка при установке основного изображения:', error);
    throw error;
  }
};
