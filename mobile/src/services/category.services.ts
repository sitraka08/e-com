import { apiClient } from './client';
import {
  ApiResponse,
  CategoryDTO,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '@/types';

export const categoryService = {
  async getAll(): Promise<ApiResponse<CategoryDTO[]>> {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<CategoryDTO>> {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  async getBySlug(slug: string): Promise<ApiResponse<CategoryDTO>> {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data;
  },

  async create(data: CreateCategoryDTO): Promise<ApiResponse<CategoryDTO>> {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  async update(id: number, data: UpdateCategoryDTO): Promise<ApiResponse<CategoryDTO>> {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};
