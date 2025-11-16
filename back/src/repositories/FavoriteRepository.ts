import { PrismaClient } from '@prisma/client';
import { IFavoriteRepository } from './IFavoriteRepository';
import { Favorite } from '../types';

export class FavoriteRepository implements IFavoriteRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: number, productId: number): Promise<Favorite> {
    return this.prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async findByUserId(userId: number): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            seller: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUserAndProduct(userId: number, productId: number): Promise<Favorite | null> {
    return this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async delete(userId: number, productId: number): Promise<void> {
    await this.prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.prisma.favorite.delete({
      where: { id },
    });
  }
}
