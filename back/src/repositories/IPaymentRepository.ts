import { Payment, CreatePaymentDTO } from '../types';

export interface IPaymentRepository {
  create(data: CreatePaymentDTO): Promise<Payment>;
  findById(id: number): Promise<Payment | null>;
  findByOrderId(orderId: number): Promise<Payment[]>;
  findAll(): Promise<Payment[]>;
  updateStatus(id: number, status: string): Promise<Payment>;
}
