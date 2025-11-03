import { apiClient } from "./client";
import {
  ApiResponse,
  AuthResponse,
  LoginDTO,
  RegisterDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  AuthTokens,
} from "@/types";

export const authService = {
  async login(data: LoginDTO): Promise<ApiResponse<AuthResponse>> {
    console.log(data, "login");
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  },

  async register(data: RegisterDTO): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  async logout(): Promise<ApiResponse<void>> {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    const response = await apiClient.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  async forgotPassword(
    data: ForgotPasswordDTO
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post("/auth/forgot-password", data);
    return response.data;
  },

  async resetPassword(
    data: ResetPasswordDTO
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },
};
