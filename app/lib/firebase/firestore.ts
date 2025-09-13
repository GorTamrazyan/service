// lib/firebase/firestore.ts

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
  Timestamp,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";

// Типы данных для продукта
export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: string;
  imageUrl?: string;
  category?: string;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Преобразование Firestore документа в Product объект
export const firestoreToProduct = (doc: DocumentSnapshot<DocumentData>): Product | null => {
  if (!doc.exists()) return null;
  
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl: data.imageUrl,
    category: data.category,
    inStock: data.inStock || true,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date()
  };
};

// Преобразование Product объекта для Firestore
export const productToFirestore = (product: Omit<Product, 'id'>): DocumentData => {
  return {
    name: product.name,
    description: product.description || null,
    price: product.price,
    imageUrl: product.imageUrl || null,
    category: product.category || null,
    inStock: product.inStock,
    createdAt: Timestamp.fromDate(product.createdAt),
    updatedAt: Timestamp.fromDate(product.updatedAt)
  };
};

// Получить все продукты
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('name', 'asc'));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    
    return querySnapshot.docs
      .map(doc => firestoreToProduct(doc))
      .filter((product): product is Product => product !== null);
  } catch (error) {
    console.error('Ошибка при получении продуктов:', error);
    throw error;
  }
};

// Получить продукты с фильтрацией
export const getFilteredProducts = async (filters: {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
}): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    let q: any;

    // Фильтр по категории (только если категория указана и не 'all')
    if (filters.category && filters.category !== 'all') {
      q = query(productsRef, where('category', '==', filters.category));
    } else {
      q = query(productsRef);
    }

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    let products = querySnapshot.docs
      .map(doc => firestoreToProduct(doc))
      .filter((product): product is Product => product !== null);

    // Фильтрация по цене (на клиенте)
    if (filters.minPrice || filters.maxPrice) {
      products = products.filter(product => {
        const price = parseFloat(product.price);
        const min = filters.minPrice ? parseFloat(filters.minPrice) : 0;
        const max = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
        return price >= min && price <= max;
      });
    }

    // Сортируем по имени на клиенте
    products.sort((a, b) => a.name.localeCompare(b.name));

    return products;
  } catch (error) {
    console.error('Ошибка при получении отфильтрованных продуктов:', error);
    throw error;
  }
};

// Получить продукт по ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, 'products', id);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(productRef);
    return firestoreToProduct(docSnap);
  } catch (error) {
    console.error('Ошибка при получении продукта:', error);
    throw error;
  }
};

// Создать новый продукт
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date();
    const productData: Omit<Product, 'id'> = {
      ...product,
      createdAt: now,
      updatedAt: now
    };

    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, productToFirestore(productData));
    return docRef.id;
  } catch (error) {
    console.error('Ошибка при создании продукта:', error);
    throw error;
  }
};

// Обновить продукт
export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const productRef = doc(db, 'products', id);
    const updateData = {
      ...product,
      updatedAt: Timestamp.fromDate(new Date())
    };
    
    await updateDoc(productRef, updateData);
  } catch (error) {
    console.error('Ошибка при обновлении продукта:', error);
    throw error;
  }
};

// Удалить продукт
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Ошибка при удалении продукта:', error);
    throw error;
  }
};

// Получить все категории
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const productsRef = collection(db, 'products');
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(productsRef);
    
    const categoriesSet = new Set<string>();
    
    querySnapshot.docs.forEach(doc => {
      const category = doc.data().category;
      if (category && typeof category === 'string') {
        categoriesSet.add(category);
      }
    });

    return Array.from(categoriesSet).sort();
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    throw error;
  }
};

// Пакетное создание продуктов (для миграции)
export const batchCreateProducts = async (products: Omit<Product, 'id'>[]): Promise<void> => {
  try {
    const batch = writeBatch(db);
    const productsRef = collection(db, 'products');

    products.forEach(product => {
      const docRef = doc(productsRef);
      batch.set(docRef, productToFirestore(product));
    });

    await batch.commit();
  } catch (error) {
    console.error('Ошибка при пакетном создании продуктов:', error);
    throw error;
  }
};