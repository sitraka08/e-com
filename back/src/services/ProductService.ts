import { Product } from '../types';
import { IProductRepository } from '../repositories/IProductRepository';

/**
 * Service pour la logique métier des produits (Principe S - Single Responsibility)
 * Ce service ne gère QUE la logique métier des produits
 */
export class ProductService {
  constructor(private productRepository: IProductRepository) {}

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }

  async getProductById(id: number): Promise<Product | null> {
    if (id <= 0) {
      throw new Error('ID du produit invalide');
    }
    return await this.productRepository.findById(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (!category || category.trim() === '') {
      throw new Error('Catégorie invalide');
    }
    return await this.productRepository.findByCategory(category);
  }

  async searchProducts(query: string): Promise<Product[]> {
    if (!query || query.trim() === '') {
      return await this.getAllProducts();
    }
    return await this.productRepository.search(query);
  }

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    // Validation métier
    if (!productData.name || productData.price <= 0) {
      throw new Error('Données du produit invalides');
    }
    return await this.productRepository.create(productData);
  }

  async updateProduct(
    id: number,
    productData: Partial<Product>
  ): Promise<Product | null> {
    if (id <= 0) {
      throw new Error('ID du produit invalide');
    }
    return await this.productRepository.update(id, productData);
  }

  async deleteProduct(id: number): Promise<boolean> {
    if (id <= 0) {
      throw new Error('ID du produit invalide');
    }
    return await this.productRepository.delete(id);
  }
}
