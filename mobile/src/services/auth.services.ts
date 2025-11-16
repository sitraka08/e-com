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
    try {
      console.log(data, "login");
      const response = await apiClient.post("/auth/login", data);
      return response.data;
    } catch (error: any) {
      // Si c'est une erreur HTTP avec réponse du backend
      if (error.response?.data) {
        return error.response.data; // Déjà au format ApiResponse
      }
      // Si c'est une erreur réseau (backend inaccessible)
      return {
        success: false,
        message: "Impossible de se connecter au serveur. Vérifiez votre connexion.",
        error: error.message,
      };
    }
  },

  async register(data: RegisterDTO): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Impossible de se connecter au serveur. Vérifiez votre connexion.",
        error: error.message,
      };
    }
  },

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Erreur lors de la déconnexion",
        error: error.message,
      };
    }
  },

  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
    try {
      const response = await apiClient.post("/auth/refresh", { refreshToken });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Erreur lors du rafraîchissement du token",
        error: error.message,
      };
    }
  },

  async forgotPassword(
    data: ForgotPasswordDTO
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.post("/auth/forgot-password", data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Impossible d'envoyer le code de réinitialisation",
        error: error.message,
      };
    }
  },

  async resetPassword(
    data: ResetPasswordDTO
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await apiClient.post("/auth/reset-password", data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Erreur lors de la réinitialisation du mot de passe",
        error: error.message,
      };
    }
  },
};
