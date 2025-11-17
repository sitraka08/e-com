import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

export const IP_URL = "http://192.168.1.117:3000";
export const API_BASE_URL = `${IP_URL}/api`;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { tokens } = useAuthStore.getState();

    if (tokens?.accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Laisser passer les erreurs réseau (pas de response) pour que les composants puissent les gérer
    if (!error.response) {
      console.warn("Erreur réseau - Backend inaccessible:", error.message);
      return Promise.reject(error);
    }

    // Si 401, déconnecter l'utilisateur (token expiré après 24h)
    if (error.response?.status === 401) {
      const { tokens, clearAuth } = useAuthStore.getState();

      // Si l'utilisateur est authentifié, le déconnecter
      if (tokens?.accessToken) {
        console.warn("Token expiré - Déconnexion");
        await clearAuth();
      }
    }

    return Promise.reject(error);
  }
);
