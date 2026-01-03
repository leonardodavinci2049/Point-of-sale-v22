import { create } from "zustand";

interface ModalState {
  searchProduct: boolean;
  searchCustomer: boolean;
  addCustomer: boolean;
  discount: boolean;
  budget: boolean;
  pendingSales: boolean;
  keyboardHelp: boolean;
}

interface ModalActions {
  openModal: (modal: keyof ModalState) => void;
  closeModal: (modal: keyof ModalState) => void;
  toggleModal: (modal: keyof ModalState) => void;
  closeAllModals: () => void;
}

const initialState: ModalState = {
  searchProduct: false,
  searchCustomer: false,
  addCustomer: false,
  discount: false,
  budget: false,
  pendingSales: false,
  keyboardHelp: false,
};

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  ...initialState,

  openModal: (modal) => set({ [modal]: true }),

  closeModal: (modal) => set({ [modal]: false }),

  toggleModal: (modal) => set((state) => ({ [modal]: !state[modal] })),

  closeAllModals: () => set(initialState),
}));

// Selector hooks for specific modals
export const useSearchProductModal = () =>
  useModalStore((state) => ({
    isOpen: state.searchProduct,
    open: () => state.openModal("searchProduct"),
    close: () => state.closeModal("searchProduct"),
  }));

export const useSearchCustomerModal = () =>
  useModalStore((state) => ({
    isOpen: state.searchCustomer,
    open: () => state.openModal("searchCustomer"),
    close: () => state.closeModal("searchCustomer"),
  }));

export const useAddCustomerModal = () =>
  useModalStore((state) => ({
    isOpen: state.addCustomer,
    open: () => state.openModal("addCustomer"),
    close: () => state.closeModal("addCustomer"),
  }));

export const useDiscountModal = () =>
  useModalStore((state) => ({
    isOpen: state.discount,
    open: () => state.openModal("discount"),
    close: () => state.closeModal("discount"),
  }));

export const useBudgetModal = () =>
  useModalStore((state) => ({
    isOpen: state.budget,
    open: () => state.openModal("budget"),
    close: () => state.closeModal("budget"),
  }));
