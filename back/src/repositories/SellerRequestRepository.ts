import { PrismaClient } from '@prisma/client';
import { ISellerRequestRepository } from './ISellerRequestRepository';
import { SellerRequest, CreateSellerRequestDTO, SellerRequestStatus } from '../types';

export class SellerRequestRepository implements ISellerRequestRepository {
  constructor(private prisma: PrismaClient) {}

  async create(userId: number, data: CreateSellerRequestDTO): Promise<SellerRequest> {
    return this.prisma.sellerRequest.create({
      data: {
        userId,
        storeName: data.storeName,
        storeDescription: data.storeDescription,
        businessRegistration: data.businessRegistration || null,
      },
    });
  }

  async findById(id: number): Promise<SellerRequest | null> {
    return this.prisma.sellerRequest.findUnique({
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

  async findByUserId(userId: number): Promise<SellerRequest[]> {
    return this.prisma.sellerRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(filters?: { status?: SellerRequestStatus }): Promise<SellerRequest[]> {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.sellerRequest.findMany({
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

  async updateStatus(
    id: number,
    status: SellerRequestStatus,
    reviewedBy: number,
    rejectionReason?: string
  ): Promise<SellerRequest> {
    return this.prisma.sellerRequest.update({
      where: { id },
      data: {
        status,
        reviewedBy,
        reviewedAt: new Date(),
        rejectionReason: rejectionReason || null,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.sellerRequest.delete({ where: { id } });
  }
}
