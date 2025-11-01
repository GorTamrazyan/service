import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firebase";

/**
 * Загрузить изображение продукта в Firebase Storage
 * @param file - файл изображения
 * @param productId - ID продукта
 * @param index - порядковый номер изображения
 * @returns URL загруженного изображения
 */
export const uploadProductImage = async (
  file: File,
  productId: string,
  index: number
): Promise<string> => {
  try {
    // Создаём уникальное имя файла
    const timestamp = Date.now();
    const fileName = `${productId}_${index}_${timestamp}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, `products/${productId}/${fileName}`);

    // Загружаем файл
    const snapshot = await uploadBytes(storageRef, file);

    // Получаем URL загруженного файла
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    throw error;
  }
};

/**
 * Загрузить несколько изображений продукта
 * @param files - массив файлов
 * @param productId - ID продукта
 * @returns массив URL загруженных изображений
 */
export const uploadProductImages = async (
  files: File[],
  productId: string
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) =>
      uploadProductImage(file, productId, index)
    );

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Ошибка при загрузке изображений:', error);
    throw error;
  }
};

/**
 * Удалить изображение из Firebase Storage по URL
 * @param imageUrl - URL изображения
 */
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    // Извлекаем путь из URL
    const urlParts = imageUrl.split('/o/');
    if (urlParts.length < 2) {
      throw new Error('Invalid image URL');
    }

    const pathPart = urlParts[1].split('?')[0];
    const path = decodeURIComponent(pathPart);

    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Ошибка при удалении изображения:', error);
    throw error;
  }
};

/**
 * Удалить все изображения продукта из Storage
 * @param imageUrls - массив URL изображений
 */
export const deleteProductImages = async (imageUrls: string[]): Promise<void> => {
  try {
    const deletePromises = imageUrls.map(url => deleteProductImage(url));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Ошибка при удалении изображений:', error);
    throw error;
  }
};
