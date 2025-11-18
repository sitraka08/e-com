import { create } from "zustand";
import { AuthTokens, UserDTO, SellerDTO } from "@/types";
import { secureStorage } from "@/utils/secure-storage";

interface AuthState {
  user: UserDTO | null;
  tokens: AuthTokens | null;
  seller: SellerDTO | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAuth: (
    user: UserDTO,
    tokens: AuthTokens,
    seller?: SellerDTO
  ) => Promise<void>;
  clearAuth: () => Promise<void>;
  setUser: (user: UserDTO) => Promise<void>;
  setSeller: (seller: SellerDTO | null) => Promise<void>;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tokens: null,
  seller: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, tokens, seller) => {
    try {
      await secureStorage.saveUser(user);
      await secureStorage.saveTokens(tokens);
      if (seller) {
        await secureStorage.saveSeller(seller);
      }
      set({
        user,
        tokens,
        seller: seller || null,
        isAuthenticated: true,
      });
    } catch (error) {
      throw error;
    }
  },

  clearAuth: async () => {
    try {
      await secureStorage.clearAll();
      set({
        user: null,
        tokens: null,
        seller: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Error clearing auth:", error);
      throw error;
    }
  },

  setUser: async (user) => {
    try {
      await secureStorage.saveUser(user);
      set({ user });
    } catch (error) {
      console.error("Error setting user:", error);
      throw error;
    }
  },

  setSeller: async (seller) => {
    try {
      if (seller) {
        await secureStorage.saveSeller(seller);
      } else {
        await secureStorage.removeSeller();
      }
      set({ seller });
    } catch (error) {
      console.error("Error setting seller:", error);
      throw error;
    }
  },

  initialize: async () => {
    try {
      set({ isLoading: true });
      const [user, tokens, seller] = await Promise.all([
        secureStorage.getUser(),
        secureStorage.getTokens(),
        secureStorage.getSeller(),
      ]);

      if (user && tokens) {
        set({
          user,
          tokens,
          seller,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          tokens: null,
          seller: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({
        user: null,
        tokens: null,
        seller: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
