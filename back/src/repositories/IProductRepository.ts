import { Product } from '../types';

/**
 * Interface Repository pour les produits (Principe D - Dependency Inversion)
 * Les contrôleurs/services dépendent de cette abstraction, pas de l'implémentation
 */
export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
  create(product: Omit<Product, 'id'>): Promise<Product>;
  update(id: number, product: Partial<Product>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
}
