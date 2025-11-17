import * as SecureStore from 'expo-secure-store';
import { AuthTokens, UserDTO, SellerDTO } from '@/types';

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  USER: 'user',
  SELLER: 'seller',
};

export const secureStorage = {
  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      if (!tokens?.accessToken) {
        throw new Error('Invalid tokens: accessToken must be provided');
      }

      const accessToken = String(tokens.accessToken);
      await SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, accessToken);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw error;
    }
  },

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const accessToken = await SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);

      if (!accessToken) {
        return null;
      }

      return { accessToken };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  },

  async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.ACCESS_TOKEN);
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

  async saveSeller(seller: SellerDTO): Promise<void> {
    try {
      await SecureStore.setItemAsync(KEYS.SELLER, JSON.stringify(seller));
    } catch (error) {
      console.error('Error saving seller:', error);
      throw error;
    }
  },

  async getSeller(): Promise<SellerDTO | null> {
    try {
      const sellerString = await SecureStore.getItemAsync(KEYS.SELLER);
      if (!sellerString) {
        return null;
      }
      return JSON.parse(sellerString) as SellerDTO;
    } catch (error) {
      console.error('Error getting seller:', error);
      return null;
    }
  },

  async removeSeller(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(KEYS.SELLER);
    } catch (error) {
      console.error('Error removing seller:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    await this.clearTokens();
    await this.clearUser();
    await this.removeSeller();
  },
};
