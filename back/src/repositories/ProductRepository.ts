import { PrismaClient } from '@prisma/client';
import { IProductRepository } from './IProductRepository';
import { Product, CreateProductDTO, UpdateProductDTO, ProductFilters, PaginationParams, PaginatedResponse } from '../types';

export class ProductRepository implements IProductRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProductDTO): Promise<Product> {
    return this.prisma.product.create({
      data: {
        ...data,
        images: JSON.stringify(data.images),
      },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async findAll(filters?: ProductFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Product>> {
    const where: any = {};

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }
    if (filters?.minPrice || filters?.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async search(query: string, pagination?: PaginationParams): Promise<PaginatedResponse<Product>> {
    return this.findAll({ search: query, isActive: true }, pagination);
  }

  async update(id: number, data: UpdateProductDTO): Promise<Product> {
    const updateData: any = { ...data };
    if (data.images) {
      updateData.images = JSON.stringify(data.images);
    }
    return this.prisma.product.update({ where: { id }, data: updateData });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { stock: quantity },
    });
  }

  async getLowStock(threshold: number = 10): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        stock: { lte: threshold },
        isActive: true,
      },
      include: { category: true },
      orderBy: { stock: 'asc' },
    });
  }
}
