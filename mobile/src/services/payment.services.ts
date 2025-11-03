import { apiClient } from './client';
import { ApiResponse, PaymentDTO } from '@/types';

export const paymentService = {
  async getAll(): Promise<ApiResponse<PaymentDTO[]>> {
    const response = await apiClient.get('/payments');
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<PaymentDTO>> {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  async getByOrder(orderId: number): Promise<ApiResponse<PaymentDTO[]>> {
    const response = await apiClient.get(`/payments/order/${orderId}`);
    return response.data;
  },
};
