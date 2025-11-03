import * as SecureStore from 'expo-secure-store';
import { AuthTokens, UserDTO } from '@/types';

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
};

export const secureStorage = {
  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, tokens.accessToken);
      await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, tokens.refreshToken);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  },

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const accessToken = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
      const refreshToken = await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);

      if (!accessToken || !refreshToken) {
        return null;
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
      await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },

  async saveUser(user: UserDTO): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async getUser(): Promise<UserDTO | null> {
    try {
      const userString = await SecureStore.getItemAsync(KEYS.USER);
      if (!userString) {
        return null;
      }
      return JSON.parse(userString) as UserDTO;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async clearUser(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.USER);
    } catch (error) {
      console.error('Error clearing user:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    await this.clearTokens();
    await this.clearUser();
  },
};
