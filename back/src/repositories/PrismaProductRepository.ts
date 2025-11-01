import { PrismaClient } from '../generated/prisma';
import { Product } from '../types';
import { IProductRepository } from './IProductRepository';

/**
 * Implémentation Prisma du repository de produits
 * Remplace InMemoryProductRepository avec une vraie base de données
 */
export class PrismaProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return products.map(this.mapToProduct);
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return product ? this.mapToProduct(product) : null;
  }

  async findByCategory(category: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { category },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return products.map(this.mapToProduct);
  }

  async search(query: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { category: { contains: query } },
        ],
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return products.map(this.mapToProduct);
  }

  async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const product = await this.prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: productData.image,
        category: productData.category,
        stock: productData.stock || 0,
        sellerId: (productData as any).sellerId || 1, // Default seller ID
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return this.mapToProduct(product);
  }

  async update(id: number, productData: Partial<Product>): Promise<Product | null> {
    try {
      const product = await this.prisma.product.update({
        where: { id },
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          category: productData.category,
          stock: productData.stock,
        },
        include: {
          seller: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      return this.mapToProduct(product);
    } catch (error) {
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper pour mapper les données Prisma vers le type Product
  private mapToProduct(prismaProduct: any): Product {
    return {
      id: prismaProduct.id,
      name: prismaProduct.name,
      description: prismaProduct.description,
      price: prismaProduct.price,
      image: prismaProduct.image,
      category: prismaProduct.category,
      stock: prismaProduct.stock,
    };
  }
}
