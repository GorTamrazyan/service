// ============================================
// ИНТЕРФЕЙСЫ ДЛЯ БАЗЫ ДАННЫХ ПРОДУКТОВ
// ============================================

// 1. ТИПЫ ПРОДУКТОВ
export interface TypeOfProduct {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2. МАТЕРИАЛЫ
export interface Material {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// 3. КАТЕГОРИИ
export interface Category {
  id?: string;
  name: string;
  description?: string;
  parentCategoryId?: string; // для подкатегорий
  createdAt?: Date;
  updatedAt?: Date;
}

// 4. ЦВЕТА
export interface Color {
  id?: string;
  name: string;
  hexCode: string; // например: "#FF5733"
  createdAt?: Date;
  updatedAt?: Date;
}

// 5. ИЗОБРАЖЕНИЯ
export interface Image {
  id?: string;
  url: string;
  alt?: string;
  productId: string; // обязательная связь с продуктом
  isPrimary?: boolean; // основное изображение
  order?: number; // порядок отображения
  createdAt?: Date;
}

// 6. ПРОДУКТЫ
export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;

  // Связи с другими коллекциями
  categoryId?: string;
  typeOfProductId?: string;
  materialId?: string;
  colorIds?: string[]; // массив доступных цветов

  // Характеристики
  dimensions?: {
    height?: number;
    width?: number;
    length?: number;
    unit?: string; // "cm", "m", "inch"
  };

  weight?: number;

  // Мета-информация
  tags?: string[];
  featured?: boolean; // избранный товар
  discount?: number; // процент скидки

  // Временные метки
  createdAt: Date;
  updatedAt: Date;
}


export interface Service {
    id: string;
    icon: string;
    title: string;
    description: string;
    features: string[]; // Массив строк
    price: string;
    createdAt: Date;
    updatedAt: Date;
}

// Тип для консультаций (Consultation)
export interface Consultation {
    id: string;
    title: string;
    duration: number;
    description: string;
    price: number; 
    features: string[]; 
    createdAt: Date;
    updatedAt: Date;
}