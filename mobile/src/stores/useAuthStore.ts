import { create } from 'zustand';
import { AuthTokens, UserDTO } from '@/types';
import { secureStorage } from '@/utils/secure-storage';

interface AuthState {
  user: UserDTO | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (user: UserDTO, tokens: AuthTokens) => Promise<void>;
  clearAuth: () => Promise<void>;
  setUser: (user: UserDTO) => Promise<void>;
  updateTokens: (tokens: AuthTokens) => Promise<void>;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, tokens) => {
    try {
      await secureStorage.saveUser(user);
      await secureStorage.saveTokens(tokens);
      set({
        user,
        tokens,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error('Error setting auth:', error);
      throw error;
    }
  },

  clearAuth: async () => {
    try {
      await secureStorage.clearAll();
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error clearing auth:', error);
      throw error;
    }
  },

  setUser: async (user) => {
    try {
      await secureStorage.saveUser(user);
      set({ user });
    } catch (error) {
      console.error('Error setting user:', error);
      throw error;
    }
  },

  updateTokens: async (tokens) => {
    try {
      await secureStorage.saveTokens(tokens);
      set({ tokens });
    } catch (error) {
      console.error('Error updating tokens:', error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      const [user, tokens] = await Promise.all([
        secureStorage.getUser(),
        secureStorage.getTokens(),
      ]);

      if (user && tokens) {
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
