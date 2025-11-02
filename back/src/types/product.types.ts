import { Decimal } from '@prisma/client/runtime/library';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: Decimal;
  stock: number;
  images: string;
  categoryId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDTO {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: number;
  categoryName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: string[]; // Optionnel, peut venir de l'upload de fichiers
  categoryId: number;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  images?: string[]; // Optionnel, peut venir de l'upload de fichiers
  categoryId?: number;
  isActive?: boolean;
}

// Type pour les requêtes avec upload de fichiers
export interface ProductFormData {
  name: string;
  description: string;
  price: string; // Vient en string du FormData
  stock: string; // Vient en string du FormData
  categoryId: string; // Vient en string du FormData
}

export interface ProductFilters {
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive?: boolean;
}

export interface UpdateStockDTO {
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
}
