import axios, { AxiosInstance } from "axios";

export const IP_URL = "https://localhost:3000";
export const API_BASE_URL = `${IP_URL}/api`;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
