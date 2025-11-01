import { IPaymentRepository, IOrderRepository } from '../repositories';
import { PaymentDTO, CreatePaymentDTO, ProcessPaymentDTO } from '../types';

export class PaymentService {
  constructor(
    private paymentRepository: IPaymentRepository,
    private orderRepository: IOrderRepository
  ) {}

  async processPayment(data: ProcessPaymentDTO): Promise<PaymentDTO[]> {
    const order = await this.orderRepository.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const totalPaymentAmount = data.payments.reduce((sum, p) => sum + p.amount, 0);
    const orderBalance = Number(order.total) - Number(order.totalPaid);

    if (totalPaymentAmount > orderBalance) {
      throw new Error('Payment amount exceeds order balance');
    }

    const createdPayments: any[] = [];

    for (const paymentData of data.payments) {
      const payment = await this.paymentRepository.create({
        orderId: data.orderId,
        paymentMethodId: paymentData.paymentMethodId,
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
      });

      await this.paymentRepository.updateStatus(payment.id, 'COMPLETED');
      await this.orderRepository.updateTotalPaid(data.orderId, paymentData.amount);

      createdPayments.push(payment);
    }

    const updatedOrder = await this.orderRepository.findById(data.orderId);
    if (updatedOrder && Number(updatedOrder.totalPaid) >= Number(updatedOrder.total)) {
      await this.orderRepository.update(data.orderId, { status: 'CONFIRMED' });
    }

    return createdPayments.map((p) => this.mapToDTO(p));
  }

  async getOrderPayments(orderId: number): Promise<PaymentDTO[]> {
    const payments = await this.paymentRepository.findByOrderId(orderId);
    return payments.map((p) => this.mapToDTO(p));
  }

  async getAllPayments(): Promise<PaymentDTO[]> {
    const payments = await this.paymentRepository.findAll();
    return payments.map((p) => this.mapToDTO(p));
  }

  async getPaymentById(id: number): Promise<PaymentDTO> {
    const payment = await this.paymentRepository.findById(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return this.mapToDTO(payment);
  }

  private mapToDTO(payment: any): PaymentDTO {
    return {
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
    };
  }
}
