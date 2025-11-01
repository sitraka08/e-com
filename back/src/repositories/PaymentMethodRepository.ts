import { PrismaClient } from '@prisma/client';
import { IPaymentMethodRepository } from './IPaymentMethodRepository';
import { PaymentMethod, CreatePaymentMethodDTO, UpdatePaymentMethodDTO } from '../types';

export class PaymentMethodRepository implements IPaymentMethodRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePaymentMethodDTO): Promise<PaymentMethod> {
    const dataToCreate: any = {
      ...data,
      details: JSON.stringify(data.details),
    };

    if (data.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: data.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.paymentMethod.create({ data: dataToCreate });
  }

  async findById(id: number): Promise<PaymentMethod | null> {
    return this.prisma.paymentMethod.findUnique({ where: { id } });
  }

  async findByUserId(userId: number): Promise<PaymentMethod[]> {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async update(id: number, data: UpdatePaymentMethodDTO): Promise<PaymentMethod> {
    const paymentMethod = await this.prisma.paymentMethod.findUnique({ where: { id } });
    if (!paymentMethod) throw new Error('Payment method not found');

    const updateData: any = { ...data };
    if (data.details) {
      updateData.details = JSON.stringify(data.details);
    }

    if (data.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: paymentMethod.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.paymentMethod.update({ where: { id }, data: updateData });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.paymentMethod.delete({ where: { id } });
  }

  async setAsDefault(userId: number, paymentMethodId: number): Promise<PaymentMethod> {
    await this.prisma.paymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    return this.prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true },
    });
  }

  async findDefault(userId: number): Promise<PaymentMethod | null> {
    return this.prisma.paymentMethod.findFirst({
      where: { userId, isDefault: true },
    });
  }
}
