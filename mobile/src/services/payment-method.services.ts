import { apiClient } from "./client";
import { ApiResponse, PaymentMethodDTO, PaymentMethodType } from "@/types";

export const paymentMethodService = {
  getAll: async (): Promise<ApiResponse<PaymentMethodDTO[]>> => {
    const response = await apiClient.get<ApiResponse<PaymentMethodDTO[]>>("/payment-methods");
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<PaymentMethodDTO>> => {
    const response = await apiClient.get<ApiResponse<PaymentMethodDTO>>(`/payment-methods/${id}`);
    return response.data;
  },

  create: async (data: {
    type: PaymentMethodType;
    label: string;
    details: Record<string, unknown>;
  }): Promise<ApiResponse<PaymentMethodDTO>> => {
    const response = await apiClient.post<ApiResponse<PaymentMethodDTO>>("/payment-methods", data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<PaymentMethodDTO>
  ): Promise<ApiResponse<PaymentMethodDTO>> => {
    const response = await apiClient.put<ApiResponse<PaymentMethodDTO>>(`/payment-methods/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/payment-methods/${id}`);
    return response.data;
  },

  setDefault: async (id: number): Promise<ApiResponse<PaymentMethodDTO>> => {
    const response = await apiClient.patch<ApiResponse<PaymentMethodDTO>>(`/payment-methods/${id}/default`);
    return response.data;
  },
};
