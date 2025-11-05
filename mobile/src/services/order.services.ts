import { apiClient } from './client';
import {
  ApiResponse,
  OrderDTO,
  UpdateOrderStatusDTO,
  PaginatedResponse,
  OrderStatsDTO,
  CreateOrderDTO,
} from '@/types';

export interface QueryParams {
  page?: string;
  search?: string;
  limit?: string;
}

export const orderService = {
  async create(data: CreateOrderDTO): Promise<ApiResponse<OrderDTO>> {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  async getAll(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<OrderDTO>>> {
    const queryString = params
      ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
      : "";
    const response = await apiClient.get(`/orders${queryString}`);
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

  async getStats(): Promise<ApiResponse<OrderStatsDTO>> {
    const response = await apiClient.get('/orders/stats');
    return response.data;
  },

  async getUnpaid(): Promise<ApiResponse<OrderDTO[]>> {
    const response = await apiClient.get('/orders/unpaid');
    return response.data;
  },
};
