import { apiClient } from './client';
import {
  ApiResponse,
  OrderDTO,
  UpdateOrderStatusDTO,
} from '@/types';

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export const orderService = {
  async getAll(): Promise<ApiResponse<OrderDTO[]>> {
    const response = await apiClient.get('/orders');
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<OrderDTO>> {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  },

  async getByNumber(orderNumber: string): Promise<ApiResponse<OrderDTO>> {
    const response = await apiClient.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  async updateStatus(id: number, data: UpdateOrderStatusDTO): Promise<ApiResponse<OrderDTO>> {
    const response = await apiClient.patch(`/orders/${id}/status`, data);
    return response.data;
  },

  async getStats(): Promise<ApiResponse<OrderStats>> {
    const response = await apiClient.get('/orders/stats');
    return response.data;
  },

  async getUnpaid(): Promise<ApiResponse<OrderDTO[]>> {
    const response = await apiClient.get('/orders/unpaid');
    return response.data;
  },
};
