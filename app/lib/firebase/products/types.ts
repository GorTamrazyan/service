export interface TypeOfProduct {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Material {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  id?: string;
  name: string;
  description?: string;
  parentCategoryId?: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Color {
  id?: string;
  name: string;
  hexCode: string; 
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Image {
  id?: string;
  url: string;
  alt?: string;
  productId: string; 
  isPrimary?: boolean; 
  order?: number; 
  createdAt?: Date;
}

export interface Product {
  id?: string;
  name: string;
  description?: string;
  colorPrices: Record<string, number>;

  categoryId?: string;
  typeOfProductId?: string;
  materialId?: string;
  colorIds?: string[]; 

  dimensions?: {
    height?: number;
    width?: number;
    length?: number;
    unit?: string; 
  };

  weight?: number;

  tags?: string[];
  featured?: boolean; 
  discount?: number; 

  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
    id: string;
    icon: string;
    title: string;
    description: string;
    features: string[]; 
    price: string;
    createdAt: Date;
    updatedAt: Date;
}

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