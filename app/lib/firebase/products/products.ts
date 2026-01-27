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
import { db } from "../firebase";
import { Product, Material, Color } from "./types";
import { getMaterialById } from "./materials";
import { getColorById } from "./colors";
import { getImagesByProductId, getPrimaryImageByProductId } from "./images";
import type { Image } from "./types";

// Преобразование Firestore документа в Product объект
export const firestoreToProduct = (doc: DocumentSnapshot<DocumentData>): Product | null => {
  if (!doc.exists()) return null;

  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    categoryId: data.categoryId,
    typeOfProductId: data.typeOfProductId,
    materialId: data.materialId,
    colorIds: data.colorIds || [],
    dimensions: data.dimensions,
    weight: data.weight,
    tags: data.tags || [],
    featured: data.featured || false,
    discount: data.discount,
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
    categoryId: product.categoryId || null,
    typeOfProductId: product.typeOfProductId || null,
    materialId: product.materialId || null,
    colorIds: product.colorIds || [],
    dimensions: product.dimensions || null,
    weight: product.weight || null,
    tags: product.tags || [],
    featured: product.featured || false,
    discount: product.discount || null,
    createdAt: Timestamp.fromDate(product.createdAt),
    updatedAt: Timestamp.fromDate(product.updatedAt)
  };
};

// Получить все продукты
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
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
  categoryId?: string;
  typeOfProductId?: string;
  materialId?: string;
  colorId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  tags?: string[];
}): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef);

    // Применяем фильтры
    if (filters.categoryId) {
      q = query(q, where('categoryId', '==', filters.categoryId));
    }
    if (filters.typeOfProductId) {
      q = query(q, where('typeOfProductId', '==', filters.typeOfProductId));
    }
    if (filters.materialId) {
      q = query(q, where('materialId', '==', filters.materialId));
    }
    if (filters.featured !== undefined) {
      q = query(q, where('featured', '==', filters.featured));
    }

    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    let products = querySnapshot.docs
      .map(doc => firestoreToProduct(doc))
      .filter((product): product is Product => product !== null);

    // Фильтрация по цене (на клиенте)
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      products = products.filter(product => {
        const price = product.price;
        const min = filters.minPrice ?? 0;
        const max = filters.maxPrice ?? Infinity;
        return price >= min && price <= max;
      });
    }

    // Фильтрация по цвету (на клиенте)
    if (filters.colorId) {
      products = products.filter(product =>
        product.colorIds?.includes(filters.colorId!)
      );
    }

    // Фильтрация по тегам (на клиенте)
    if (filters.tags && filters.tags.length > 0) {
      products = products.filter(product =>
        filters.tags!.some(tag => product.tags?.includes(tag))
      );
    }

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
export const createProduct = async (
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
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
export const updateProduct = async (
  id: string,
  product: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<void> => {
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

// Получить избранные продукты
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('featured', '==', true));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

    return querySnapshot.docs
      .map(doc => firestoreToProduct(doc))
      .filter((product): product is Product => product !== null);
  } catch (error) {
    console.error('Ошибка при получении избранных продуктов:', error);
    throw error;
  }
};

// Пакетное создание продуктов
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

// ============================================
// ФУНКЦИИ ДЛЯ ОБОГАЩЕНИЯ ПРОДУКТОВ
// ============================================

// Расширенный интерфейс продукта с полными данными
export interface EnrichedProduct extends Omit<Product, 'materialId' | 'colorIds'> {
  materialId?: string;
  material?: Material;
  colorIds?: string[];
  colors?: Color[];
  images?: Image[];
  imageUrl?: string | null;
}

// Обогащение одного продукта данными материала, цветов и изображений
export const enrichProduct = async (product: Product): Promise<EnrichedProduct> => {
  try {
    const enriched: EnrichedProduct = { ...product, imageUrl: null };

    // Загружаем материал, если есть materialId
    if (product.materialId) {
      const material = await getMaterialById(product.materialId);
      if (material) {
        enriched.material = material;
      }
    }

    // Загружаем цвета, если есть colorIds
    if (product.colorIds && product.colorIds.length > 0) {
      const colorsPromises = product.colorIds.map(colorId => getColorById(colorId));
      const colorsResults = await Promise.all(colorsPromises);
      enriched.colors = colorsResults.filter((color): color is Color => color !== null);
    }

    // Загружаем изображения продукта
    if (product.id) {
      const images = await getImagesByProductId(product.id);
      enriched.images = images;

      // Устанавливаем основное изображение
      const primaryImage = images.find(img => img.isPrimary);
      enriched.imageUrl = primaryImage?.url || images[0]?.url || null;
    }

    return enriched;
  } catch (error) {
    console.error('Ошибка при обогащении продукта:', error);
    return { ...product, imageUrl: null };
  }
};

// Обогащение массива продуктов
export const enrichProducts = async (products: Product[]): Promise<EnrichedProduct[]> => {
  try {
    const enrichedPromises = products.map(product => enrichProduct(product));
    return await Promise.all(enrichedPromises);
  } catch (error) {
    console.error('Ошибка при обогащении продуктов:', error);
    throw error;
  }
};

// Получить все продукты с полными данными
export const getAllProductsEnriched = async (): Promise<EnrichedProduct[]> => {
  const products = await getAllProducts();
  return enrichProducts(products);
};

// Получить продукт по ID с полными данными
export const getProductByIdEnriched = async (id: string): Promise<EnrichedProduct | null> => {
  const product = await getProductById(id);
  if (!product) return null;
  return enrichProduct(product);
};

// Получить отфильтрованные продукты с полными данными
export const getFilteredProductsEnriched = async (filters: {
  categoryId?: string;
  typeOfProductId?: string;
  materialId?: string;
  colorId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  tags?: string[];
}): Promise<EnrichedProduct[]> => {
  const products = await getFilteredProducts(filters);
  return enrichProducts(products);
};
