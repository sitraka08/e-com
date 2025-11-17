import { apiClient } from './client';
import type {
  ApiResponse,
  SavedCartDTO,
  CreateSavedCartDTO,
  UpdateSavedCartDTO,
  CartItem,
} from '@/types/api.types';

export const savedCartServices = {
  async createSavedCart(name: string, items: CartItem[]): Promise<ApiResponse<SavedCartDTO>> {
    const data: CreateSavedCartDTO = { name, items };
    const response = await apiClient.post('/saved-carts', data);
    return response.data;
  },

  async getUserSavedCarts(): Promise<ApiResponse<SavedCartDTO[]>> {
    const response = await apiClient.get('/saved-carts');
    return response.data;
  },

  async getSavedCartById(id: number): Promise<ApiResponse<SavedCartDTO>> {
    const response = await apiClient.get(`/saved-carts/${id}`);
    return response.data;
  },

  async updateSavedCart(id: number, data: UpdateSavedCartDTO): Promise<ApiResponse<SavedCartDTO>> {
    const response = await apiClient.put(`/saved-carts/${id}`, data);
    return response.data;
  },

  async deleteSavedCart(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/saved-carts/${id}`);
    return response.data;
  },

  async restoreSavedCart(id: number): Promise<ApiResponse<{ items: CartItem[] }>> {
    const response = await apiClient.post(`/saved-carts/${id}/restore`);
    return response.data;
  },
};
