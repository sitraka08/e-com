import { apiClient } from './client';
import type { ApiResponse, FavoriteWithProductDTO, AddFavoriteDTO } from '@/types/api.types';

export const favoriteServices = {
  async addFavorite(productId: number): Promise<ApiResponse<FavoriteWithProductDTO>> {
    const data: AddFavoriteDTO = { productId };
    const response = await apiClient.post(`/favorites/${productId}`, data);
    return response.data;
  },

  async removeFavorite(productId: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/favorites/${productId}`);
    return response.data;
  },

  async getUserFavorites(): Promise<ApiResponse<FavoriteWithProductDTO[]>> {
    const response = await apiClient.get('/favorites');
    return response.data;
  },

  async checkFavorite(productId: number): Promise<ApiResponse<boolean>> {
    const response = await apiClient.get(`/favorites/${productId}/check`);
    return response.data;
  },
};
