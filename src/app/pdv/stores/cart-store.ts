import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OrderItem } from "@/types/order";

interface CartState {
  items: OrderItem[];
  discount: {
    type: "percentage" | "fixed" | null;
    value: number;
  };
}

interface CartActions {
  addItem: (product: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setDiscount: (type: "percentage" | "fixed", value: number) => void;
  clearDiscount: () => void;
  clearCart: () => void;
  loadFromBudget: (items: OrderItem[], discount: CartState["discount"]) => void;
}

const initialState: CartState = {
  items: [],
  discount: { type: null, value: 0 },
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set) => ({
      ...initialState,

      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id
                  ? {
                      ...i,
                      quantity: i.quantity + 1,
                      subtotal: (i.quantity + 1) * i.unitPrice,
                    }
                  : i,
              ),
            };
          }

          const newItem: OrderItem = {
            productId: product.id,
            name: product.name,
            image: product.image || "",
            quantity: 1,
            unitPrice: product.price,
            subtotal: product.price,
          };

          return { items: [...state.items, newItem] };
        }),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity > 0
              ? state.items.map((i) =>
                  i.productId === productId
                    ? { ...i, quantity, subtotal: quantity * i.unitPrice }
                    : i,
                )
              : state.items.filter((i) => i.productId !== productId),
        })),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),

      setDiscount: (type, value) => set({ discount: { type, value } }),

      clearDiscount: () => set({ discount: { type: null, value: 0 } }),

      clearCart: () => set(initialState),

      loadFromBudget: (items, discount) => set({ items, discount }),
    }),
    {
      name: "pdv-cart",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState, version) => {
        // Handle future migrations here
        if (version === 0) {
          // Migration from version 0 to 1
          return persistedState as CartState & CartActions;
        }
        return persistedState as CartState & CartActions;
      },
    },
  ),
);

// Selector hooks for optimized re-renders
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartDiscount = () => useCartStore((state) => state.discount);
export const useCartItemCount = () =>
  useCartStore((state) => state.items.reduce((acc, i) => acc + i.quantity, 0));
