import { PrismaClient } from '@prisma/client';
import { IPaymentRepository } from './IPaymentRepository';
import { Payment, CreatePaymentDTO } from '../types';

export class PaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreatePaymentDTO): Promise<Payment> {
    const paymentData: any = {
      orderId: data.orderId,
      paymentMethodId: data.paymentMethodId,
      amount: data.amount,
      transactionId: data.transactionId,
      status: 'PENDING',
    };

    if (data.metadata) {
      paymentData.metadata = JSON.stringify(data.metadata);
    }

    return this.prisma.payment.create({ data: paymentData });
  }

  async findById(id: number): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { paymentMethod: true, order: true },
    });
  }

  async findByOrderId(orderId: number): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { orderId },
      include: { paymentMethod: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      include: {
        paymentMethod: true,
        order: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: string): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: { status: status as any },
      include: { paymentMethod: true, order: true },
    });
  }
}
