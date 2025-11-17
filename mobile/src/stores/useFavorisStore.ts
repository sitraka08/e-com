import { ProductDTO } from "@/types";
import { create } from "zustand";

type FavoriteItem = ProductDTO;

type State = {
  favorites: FavoriteItem[];
  addFavorite: (product: ProductDTO) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
  getTotalFavorites: () => number;
};

const useFavorisStore = create<State>((set, get) => ({
  favorites: [],

  addFavorite: (product: ProductDTO) =>
    set((state) => {
      const exists = state.favorites.some((item) => item.id === product.id);
      return exists ? state : { favorites: [...state.favorites, product] };
    }),

  removeFavorite: (id: number) =>
    set((state) => ({
      favorites: state.favorites.filter((item) => item.id !== id),
    })),

  isFavorite: (id: number) => {
    return get().favorites.some((item) => item.id === id);
  },

  clearFavorites: () => set({ favorites: [] }),
  getTotalFavorites: () => get().favorites.length,
}));

export default useFavorisStore;
