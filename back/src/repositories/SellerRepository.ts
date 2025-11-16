import { PrismaClient } from '@prisma/client';
import { ISellerRepository } from './ISellerRepository';
import { Seller, UpdateSellerDTO, UpdateCommissionRateDTO } from '../types';

export class SellerRepository implements ISellerRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: number, storeName: string, storeDescription: string): Promise<Seller> {
    return this.prisma.seller.create({
      data: {
        userId,
        storeName,
        storeDescription,
        isApproved: true, // Auto-approved after admin approval of request
      },
    });
  }

  async findById(id: number): Promise<Seller | null> {
    return this.prisma.seller.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: number): Promise<Seller | null> {
    return this.prisma.seller.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  async findAll(filters?: { isApproved?: boolean }): Promise<Seller[]> {
    const where: any = {};

    if (filters?.isApproved !== undefined) {
      where.isApproved = filters.isApproved;
    }

    return this.prisma.seller.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, data: UpdateSellerDTO): Promise<Seller> {
    return this.prisma.seller.update({
      where: { id },
      data,
    });
  }

  async updateCommissionRate(id: number, data: UpdateCommissionRateDTO): Promise<Seller> {
    return this.prisma.seller.update({
      where: { id },
      data: { commissionRate: data.commissionRate },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.seller.delete({ where: { id } });
  }
}
