import { apiClient } from './client';
import {
  ApiResponse,
  UserDTO,
  UpdateUserDTO,
} from '@/types';

export const userService = {
  async getAll(): Promise<ApiResponse<UserDTO[]>> {
    const response = await apiClient.get('/users');
    return response.data;
  },

  async getById(id: number): Promise<ApiResponse<UserDTO>> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async update(id: number, data: UpdateUserDTO): Promise<ApiResponse<UserDTO>> {
    const response = await apiClient.put(`/users/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  async validate(id: number): Promise<ApiResponse<UserDTO>> {
    const response = await apiClient.patch(`/users/${id}/validate`);
    return response.data;
  },

  async suspend(id: number): Promise<ApiResponse<UserDTO>> {
    const response = await apiClient.patch(`/users/${id}/suspend`);
    return response.data;
  },

  async activate(id: number): Promise<ApiResponse<UserDTO>> {
    const response = await apiClient.patch(`/users/${id}/activate`);
    return response.data;
  },
};
