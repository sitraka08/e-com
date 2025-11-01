import { Product } from '../types';
import { IProductRepository } from './IProductRepository';

/**
 * Implémentation en mémoire du repository de produits
 * Peut être facilement remplacée par une implémentation base de données
 */
export class InMemoryProductRepository implements IProductRepository {
  private products: Product[] = [
    {
      id: 1,
      name: 'Smartphone XYZ',
      image: 'https://via.placeholder.com/300',
      price: 299.99,
      description: 'Un excellent smartphone avec 128GB de stockage',
      category: 'Électronique',
      stock: 50,
    },
    {
      id: 2,
      name: 'Laptop Pro',
      image: 'https://via.placeholder.com/300',
      price: 999.99,
      description: 'Ordinateur portable haute performance',
      category: 'Électronique',
      stock: 30,
    },
    {
      id: 3,
      name: 'Casque Audio',
      image: 'https://via.placeholder.com/300',
      price: 79.99,
      description: 'Casque avec réduction de bruit',
      category: 'Audio',
      stock: 100,
    },
  ];

  private nextId = 4;

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findById(id: number): Promise<Product | null> {
    return this.products.find((p) => p.id === id) || null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    return this.products.filter((p) => p.category === category);
  }

  async search(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery)
    );
  }

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const product: Product = {
      ...productData,
      id: this.nextId++,
    };
    this.products.push(product);
    return product;
  }

  async update(id: number, productData: Partial<Product>): Promise<Product | null> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.products[index] = { ...this.products[index], ...productData };
    return this.products[index];
  }

  async delete(id: number): Promise<boolean> {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    return true;
  }
}
