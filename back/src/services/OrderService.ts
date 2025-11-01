import { IOrderRepository, IPaymentRepository, IPaymentMethodRepository, IAddressRepository } from '../repositories';
import { OrderDTO, CreateOrderDTO, UpdateOrderStatusDTO, OrderFilters, PaginationParams, PaginatedResponse, OrderStatsDTO, OrderItemDTO, PaymentDTO } from '../types';

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
    private paymentRepository: IPaymentRepository,
    private paymentMethodRepository: IPaymentMethodRepository,
    private addressRepository: IAddressRepository
  ) {}

  async createOrder(data: CreateOrderDTO): Promise<OrderDTO> {
    const order: any = await this.orderRepository.create(data);
    return this.mapToDTO(order);
  }

  async getAllOrders(filters?: OrderFilters, pagination?: PaginationParams): Promise<PaginatedResponse<OrderDTO>> {
    const result = await this.orderRepository.findAll(filters, pagination);

    const ordersDTO = result.data.map((order: any) => this.mapToDTO(order));

    return {
      data: ordersDTO,
      pagination: result.pagination,
    };
  }

  async getOrderById(id: number): Promise<OrderDTO> {
    const order: any = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return this.mapToDTO(order);
  }

  async getOrderByNumber(orderNumber: string): Promise<OrderDTO> {
    const order: any = await this.orderRepository.findByOrderNumber(orderNumber);
    if (!order) {
      throw new Error('Order not found');
    }
    return this.mapToDTO(order);
  }

  async updateOrderStatus(id: number, data: UpdateOrderStatusDTO): Promise<OrderDTO> {
    const order: any = await this.orderRepository.update(id, data);
    return this.mapToDTO(order);
  }

  async cancelOrder(id: number): Promise<OrderDTO> {
    const order: any = await this.orderRepository.cancel(id);
    return this.mapToDTO(order);
  }

  async getStats(): Promise<OrderStatsDTO> {
    return this.orderRepository.getStats();
  }

  async getUnpaidOrders(): Promise<OrderDTO[]> {
    const orders: any[] = await this.orderRepository.getUnpaidOrders();
    return orders.map((order) => this.mapToDTO(order));
  }

  private mapToDTO(order: any): OrderDTO {
    const items: OrderItemDTO[] = order.items?.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      priceAtPurchase: Number(item.priceAtPurchase),
      subtotal: Number(item.subtotal),
    })) || [];

    const payments: PaymentDTO[] = order.payments?.map((payment: any) => ({
      id: payment.id,
      orderId: payment.orderId,
      paymentMethod: {
        id: payment.paymentMethod.id,
        type: payment.paymentMethod.type,
        label: payment.paymentMethod.label,
        details: typeof payment.paymentMethod.details === 'string'
          ? JSON.parse(payment.paymentMethod.details)
          : payment.paymentMethod.details,
        isDefault: payment.paymentMethod.isDefault,
      },
      amount: Number(payment.amount),
      status: payment.status,
      transactionId: payment.transactionId,
      metadata: payment.metadata ? (typeof payment.metadata === 'string' ? JSON.parse(payment.metadata) : payment.metadata) : null,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    })) || [];

    const address = order.address ? {
      id: order.address.id,
      label: order.address.label,
      fullName: order.address.fullName,
      phone: order.address.phone,
      street: order.address.street,
      city: order.address.city,
      region: order.address.region,
      postalCode: order.address.postalCode,
      isDefault: order.address.isDefault,
    } : null;

    const total = Number(order.total);
    const totalPaid = Number(order.totalPaid);
    const balance = total - totalPaid;

    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      status: order.status,
      address: address!,
      items,
      payments,
      subtotal: Number(order.subtotal),
      deliveryFee: Number(order.deliveryFee),
      total,
      totalPaid,
      balance,
      estimatedDelivery: order.estimatedDelivery,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
