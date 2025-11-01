import { PaymentMethod, CreatePaymentMethodDTO, UpdatePaymentMethodDTO } from '../types';

export interface IPaymentMethodRepository {
  create(data: CreatePaymentMethodDTO): Promise<PaymentMethod>;
  findById(id: number): Promise<PaymentMethod | null>;
  findByUserId(userId: number): Promise<PaymentMethod[]>;
  update(id: number, data: UpdatePaymentMethodDTO): Promise<PaymentMethod>;
  delete(id: number): Promise<void>;
  setAsDefault(userId: number, paymentMethodId: number): Promise<PaymentMethod>;
  findDefault(userId: number): Promise<PaymentMethod | null>;
}
