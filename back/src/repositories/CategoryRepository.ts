import { PrismaClient } from '@prisma/client';
import { ICategoryRepository } from './ICategoryRepository';
import { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateCategoryDTO): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async findById(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { slug } });
  }

  async findAll(isActive?: boolean): Promise<Category[]> {
    const where = isActive !== undefined ? { isActive } : {};
    return this.prisma.category.findMany({ where, orderBy: { name: 'asc' } });
  }

  async update(id: number, data: UpdateCategoryDTO): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}
