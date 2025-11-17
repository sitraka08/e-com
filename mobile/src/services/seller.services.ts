import { apiClient } from './client';
import type {
  ApiResponse,
  SellerDTO,
  SellerWithUserDTO,
  CreateSellerRequestDTO,
  UpdateSellerDTO,
  SellerRequestDTO,
  SellerStatsDTO,
  ProductDTO,
  PaginatedResponse,
  OrderDTO,
} from '@/types/api.types';
import type { UpdateOrderStatusDTO } from '@/types/order.types';

export const sellerServices = {
  async submitSellerRequest(data: CreateSellerRequestDTO): Promise<ApiResponse<SellerRequestDTO>> {
    const response = await apiClient.post('/sellers/request', data);
    return response.data;
  },

  async getSellerProfile(): Promise<ApiResponse<SellerWithUserDTO>> {
    const response = await apiClient.get('/sellers/me');
    return response.data;
  },

  async updateSellerProfile(data: UpdateSellerDTO): Promise<ApiResponse<SellerDTO>> {
    const response = await apiClient.put('/sellers/me', data);
    return response.data;
  },

  async getSellerStats(): Promise<ApiResponse<SellerStatsDTO>> {
    const response = await apiClient.get('/sellers/me/stats');
    return response.data;
  },

  async getSellerProducts(): Promise<ApiResponse<PaginatedResponse<ProductDTO>>> {
    const response = await apiClient.get('/sellers/me/products');
    return response.data;
  },

  async getSellerRequestStatus(): Promise<ApiResponse<SellerRequestDTO | null>> {
    try {
      const response = await apiClient.get('/sellers/request/me');
      return response.data;
    } catch (error) {
      return { success: false, data: null };
    }
  },

  async getSellerOrders(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<PaginatedResponse<OrderDTO>>> {
    const response = await apiClient.get('/sellers/me/orders', { params });
    return response.data;
  },

  async getSellerOrder(orderId: number): Promise<ApiResponse<OrderDTO>> {
    const response = await apiClient.get(`/sellers/me/orders/${orderId}`);
    return response.data;
  },

  async updateOrderStatus(orderId: number, data: UpdateOrderStatusDTO): Promise<ApiResponse<OrderDTO>> {
    const response = await apiClient.patch(`/sellers/me/orders/${orderId}/status`, data);
    return response.data;
  },
};
