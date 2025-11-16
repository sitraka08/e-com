import { apiClient } from "./client";
import { ApiResponse, CategoryDTO } from "@/types";

export const categoryService = {
  getAll: async (): Promise<ApiResponse<CategoryDTO[]>> => {
    const response = await apiClient.get<ApiResponse<CategoryDTO[]>>("/categories");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<CategoryDTO>> => {
    const response = await apiClient.get<ApiResponse<CategoryDTO>>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    slug: string;
    description?: string;
  }): Promise<ApiResponse<CategoryDTO>> => {
    const response = await apiClient.post<ApiResponse<CategoryDTO>>("/categories", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<CategoryDTO>
  ): Promise<ApiResponse<CategoryDTO>> => {
    const response = await apiClient.put<ApiResponse<CategoryDTO>>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/categories/${id}`);
    return response.data;
  },
};
