import { create } from "zustand";
import type { Customer } from "@/types/customer";

interface CustomerState {
  selectedCustomer: Customer | null;
}

interface CustomerActions {
  setCustomer: (customer: Customer | null) => void;
  clearCustomer: () => void;
}

export const useCustomerStore = create<CustomerState & CustomerActions>(
  (set) => ({
    selectedCustomer: null,

    setCustomer: (customer) => set({ selectedCustomer: customer }),

    clearCustomer: () => set({ selectedCustomer: null }),
  }),
);

// Selector hooks for optimized re-renders
export const useSelectedCustomer = () =>
  useCustomerStore((state) => state.selectedCustomer);
