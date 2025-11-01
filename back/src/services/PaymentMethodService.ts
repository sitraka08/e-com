import { IPaymentMethodRepository } from '../repositories';
import { PaymentMethodDTO, CreatePaymentMethodDTO, UpdatePaymentMethodDTO } from '../types';

export class PaymentMethodService {
  constructor(private paymentMethodRepository: IPaymentMethodRepository) {}

  async createPaymentMethod(data: CreatePaymentMethodDTO): Promise<PaymentMethodDTO> {
    const paymentMethod = await this.paymentMethodRepository.create(data);
    return this.mapToDTO(paymentMethod);
  }

  async getUserPaymentMethods(userId: number): Promise<PaymentMethodDTO[]> {
    const methods = await this.paymentMethodRepository.findByUserId(userId);
    return methods.map((m) => this.mapToDTO(m));
  }

  async getPaymentMethodById(id: number): Promise<PaymentMethodDTO> {
    const method = await this.paymentMethodRepository.findById(id);
    if (!method) {
      throw new Error('Payment method not found');
    }
    return this.mapToDTO(method);
  }

  async updatePaymentMethod(id: number, data: UpdatePaymentMethodDTO): Promise<PaymentMethodDTO> {
    const method = await this.paymentMethodRepository.update(id, data);
    return this.mapToDTO(method);
  }

  async deletePaymentMethod(id: number): Promise<void> {
    await this.paymentMethodRepository.delete(id);
  }

  async setDefaultPaymentMethod(userId: number, paymentMethodId: number): Promise<PaymentMethodDTO> {
    const method = await this.paymentMethodRepository.setAsDefault(userId, paymentMethodId);
    return this.mapToDTO(method);
  }

  private mapToDTO(method: any): PaymentMethodDTO {
    const details = typeof method.details === 'string' ? JSON.parse(method.details) : method.details;

    return {
      id: method.id,
      type: method.type,
      label: method.label,
      details,
      isDefault: method.isDefault,
    };
  }
}
