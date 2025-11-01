import { PrismaClient, OrderStatus } from '@prisma/client';
import { IOrderRepository } from './IOrderRepository';
import { Order, CreateOrderDTO, UpdateOrderStatusDTO, OrderFilters, PaginationParams, PaginatedResponse, OrderStatsDTO } from '../types';
import { generateOrderNumber } from '../utils';

export class OrderRepository implements IOrderRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateOrderDTO): Promise<Order> {
    const orderNumber = generateOrderNumber();

    const items = await Promise.all(
      data.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const priceAtPurchase = product.price;
        const subtotal = Number(priceAtPurchase) * item.quantity;

        return {
          productId: item.productId,
          productName: product.name,
          productImage: JSON.parse(product.images)[0] || '',
          quantity: item.quantity,
          priceAtPurchase,
          subtotal,
        };
      })
    );

    const subtotal = items.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const total = subtotal + data.deliveryFee;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        addressId: data.addressId,
        subtotal,
        deliveryFee: data.deliveryFee,
        total,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        address: true,
      },
    });

    for (const item of data.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    if (data.paymentDetails && data.paymentDetails.length > 0) {
      for (const payment of data.paymentDetails) {
        await this.prisma.payment.create({
          data: {
            orderId: order.id,
            paymentMethodId: payment.paymentMethodId,
            amount: payment.amount,
            transactionId: payment.transactionId,
            status: 'COMPLETED',
          },
        });

        await this.updateTotalPaid(order.id, payment.amount);
      }
    }

    return order;
  }

  async findById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        address: true,
        payments: { include: { paymentMethod: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        address: true,
        payments: { include: { paymentMethod: true } },
      },
    });
  }

  async findAll(filters?: OrderFilters, pagination?: PaginationParams): Promise<PaginatedResponse<Order>> {
    const where: any = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.status) where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: true,
          address: true,
          payments: { include: { paymentMethod: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
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

  async update(id: number, data: UpdateOrderStatusDTO): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        items: true,
        address: true,
        payments: { include: { paymentMethod: true } },
      },
    });
  }

  async cancel(id: number): Promise<Order> {
    const order = await this.findById(id);
    if (!order) throw new Error('Order not found');
    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      throw new Error('Cannot cancel order that has been shipped or delivered');
    }

    for (const item of order.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        items: true,
        address: true,
        payments: { include: { paymentMethod: true } },
      },
    });
  }

  async updateTotalPaid(id: number, amount: number): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { totalPaid: { increment: amount } },
    });
  }

  async getStats(): Promise<OrderStatsDTO> {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      revenueResult,
      unpaidOrdersCount,
      unpaidAmountResult,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      this.prisma.order.count({ where: { status: 'CONFIRMED' } }),
      this.prisma.order.count({ where: { status: 'SHIPPED' } }),
      this.prisma.order.count({ where: { status: 'DELIVERED' } }),
      this.prisma.order.count({ where: { status: 'CANCELLED' } }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { notIn: ['CANCELLED'] } },
      }),
      this.prisma.order.count({
        where: {
          totalPaid: { lt: this.prisma.order.fields.total },
          status: { notIn: ['CANCELLED'] },
        },
      }),
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: {
          totalPaid: { lt: this.prisma.order.fields.total },
          status: { notIn: ['CANCELLED'] },
        },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: Number(revenueResult._sum.total || 0),
      unpaidOrders: unpaidOrdersCount,
      unpaidAmount: Number(unpaidAmountResult._sum.total || 0),
    };
  }

  async getUnpaidOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: {
        status: { notIn: ['CANCELLED'] },
      },
      include: {
        items: true,
        address: true,
        payments: { include: { paymentMethod: true } },
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
