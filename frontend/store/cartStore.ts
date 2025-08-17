"use client";

import { create, type StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const creator: StateCreator<CartState> = (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item: Omit<CartItem, "quantity">) =>
        set((state: CartState) => {
          const existing = state.items.find((i: CartItem) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i: CartItem) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (id: number) => set((state: CartState) => ({ items: state.items.filter((i: CartItem) => i.id !== id) })),
      incrementItem: (id: number) =>
        set((state: CartState) => ({
          items: state.items.map((i: CartItem) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
        })),
      decrementItem: (id: number) =>
        set((state: CartState) => ({
          items: state.items
            .map((i: CartItem) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i: CartItem) => i.quantity > 0),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
});

export const useCartStore = create<CartState>()(
  persist(creator, {
    name: "cart-store",
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ items: state.items, isOpen: state.isOpen }),
  })
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity * item.price, 0);


