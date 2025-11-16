import { ProductDTO } from "@/types";
import { create } from "zustand";

// Configuration des frais de livraison (en Ariary)
export const DELIVERY_FEE = 3000;

type CartItem = ProductDTO & { quantity: number };

type State = {
  cart: CartItem[];
  addItem: (v: ProductDTO) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalPayd: () => number;
  incrementQuantity: (id: number) => void;
  decrementQuantity: (id: number) => void;
  getTotalCart: () => number;
};

const useCartStore = create<State>((set, get) => ({
  cart: [],

  addItem: (product: ProductDTO) =>
    set((state) => {
      const exists = state.cart.some((item) => item.id === product.id);
      return exists
        ? {
            cart: state.cart.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }
        : { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),

  clearCart: () => set({ cart: [] }),

  getTotal: () => {
    const total = get().cart.reduce(
      (acc, item) => acc + +item.price * +item.quantity,
      0
    );
    return Number(total.toFixed(2));
  },
  getTotalPayd: () => {
    const total = get().cart.reduce(
      (acc, item) => acc + +item.price * +item.quantity,
      0
    );
    return Number((total + DELIVERY_FEE).toFixed(2));
  },
  incrementQuantity: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ),
    })),

  decrementQuantity: (id) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0),
    })),
  getTotalCart: () => get().cart.length,
}));

export default useCartStore;
