import { create } from 'zustand';
import { AuthTokens, UserDTO, SellerRequestInfo } from '@/types';
import { secureStorage } from '@/utils/secure-storage';

interface AuthState {
  user: UserDTO | null;
  tokens: AuthTokens | null;
  sellerRequest: SellerRequestInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (user: UserDTO, tokens: AuthTokens, sellerRequest?: SellerRequestInfo) => Promise<void>;
  clearAuth: () => Promise<void>;
  setUser: (user: UserDTO) => Promise<void>;
  setSellerRequest: (sellerRequest: SellerRequestInfo | null) => Promise<void>;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tokens: null,
  sellerRequest: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, tokens, sellerRequest) => {
    try {
      await secureStorage.saveUser(user);
      await secureStorage.saveTokens(tokens);
      if (sellerRequest) {
        await secureStorage.saveSellerRequest(sellerRequest);
      }
      set({
        user,
        tokens,
        sellerRequest: sellerRequest || null,
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
        sellerRequest: null,
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

  setSellerRequest: async (sellerRequest) => {
    try {
      if (sellerRequest) {
        await secureStorage.saveSellerRequest(sellerRequest);
      } else {
        await secureStorage.removeSellerRequest();
      }
      set({ sellerRequest });
    } catch (error) {
      console.error('Error setting seller request:', error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      const [user, tokens, sellerRequest] = await Promise.all([
        secureStorage.getUser(),
        secureStorage.getTokens(),
        secureStorage.getSellerRequest(),
      ]);

      if (user && tokens) {
        set({
          user,
          tokens,
          sellerRequest,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          tokens: null,
          sellerRequest: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        user: null,
        tokens: null,
        sellerRequest: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
