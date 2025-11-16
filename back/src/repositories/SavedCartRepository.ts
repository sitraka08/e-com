import { PrismaClient } from '@prisma/client';
import { ISavedCartRepository } from './ISavedCartRepository';
import { SavedCart } from '../types';

export class SavedCartRepository implements ISavedCartRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: number, name: string, items: string): Promise<SavedCart> {
    return this.prisma.savedCart.create({
      data: {
        userId,
        name,
        items,
      },
    });
  }

  async findById(id: number): Promise<SavedCart | null> {
    return this.prisma.savedCart.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: number): Promise<SavedCart[]> {
    return this.prisma.savedCart.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, data: { name?: string; items?: string }): Promise<SavedCart> {
    return this.prisma.savedCart.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.savedCart.delete({
      where: { id },
    });
  }
}
