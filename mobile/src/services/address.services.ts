import { apiClient } from "./client";
import { ApiResponse, AddressDTO } from "@/types";

export const addressService = {
  getAll: async (): Promise<ApiResponse<AddressDTO[]>> => {
    const response = await apiClient.get<ApiResponse<AddressDTO[]>>("/addresses");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<AddressDTO>> => {
    const response = await apiClient.get<ApiResponse<AddressDTO>>(`/addresses/${id}`);
    return response.data;
  },

  create: async (data: Omit<AddressDTO, "id" | "userId" | "createdAt" | "updatedAt" | "isDefault">): Promise<ApiResponse<AddressDTO>> => {
    const response = await apiClient.post<ApiResponse<AddressDTO>>("/addresses", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<AddressDTO>
  ): Promise<ApiResponse<AddressDTO>> => {
    const response = await apiClient.put<ApiResponse<AddressDTO>>(`/addresses/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/addresses/${id}`);
    return response.data;
  },

  setDefault: async (id: number): Promise<ApiResponse<AddressDTO>> => {
    const response = await apiClient.patch<ApiResponse<AddressDTO>>(`/addresses/${id}/default`);
    return response.data;
  },
};
