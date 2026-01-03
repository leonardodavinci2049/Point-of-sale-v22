/**
 * Custom hook for PDV business logic handlers
 * Centralizes all handler functions to keep PDVContainer clean
 */

import { useCallback } from "react";
import { toast } from "sonner";
import { finalizeSale } from "@/app/pdv/actions/sale-actions";
import type { Budget } from "@/types/budget";
import { generateBudgetId } from "@/types/budget";
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";
import type { OrderItem } from "@/types/order";
import { BudgetStorage } from "@/utils/budget-storage";

interface CartStore {
  items: OrderItem[];
  discount: {
    type: "percentage" | "fixed" | null;
    value: number;
  };
  addItem: (product: { id: string; name: string; price: number; image?: string }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setDiscount: (type: "percentage" | "fixed", value: number) => void;
  clearDiscount: () => void;
  clearCart: () => void;
  loadFromBudget: (items: OrderItem[], discount: { type: "percentage" | "fixed" | null; value: number }) => void;
}

interface CustomerStore {
  selectedCustomer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  clearCustomer: () => void;
}

interface ModalStore {
  searchProduct: boolean;
  searchCustomer: boolean;
  addCustomer: boolean;
  discount: boolean;
  budget: boolean;
  pendingSales: boolean;
  keyboardHelp: boolean;
  openModal: (modal: "searchProduct" | "searchCustomer" | "addCustomer" | "discount" | "budget" | "pendingSales" | "keyboardHelp") => void;
  closeModal: (modal: "searchProduct" | "searchCustomer" | "addCustomer" | "discount" | "budget" | "pendingSales" | "keyboardHelp") => void;
  toggleModal: (modal: "searchProduct" | "searchCustomer" | "addCustomer" | "discount" | "budget" | "pendingSales" | "keyboardHelp") => void;
  closeAllModals: () => void;
}

interface UsePDVHandlersParams {
  cartStore: CartStore;
  customerStore: CustomerStore;
  modalStore: ModalStore;
  hasItems: boolean;
  subtotal: number;
  total: number;
  discountType: "percentage" | "fixed" | null;
  discountValue: number | null;
}

export function usePDVHandlers({
  cartStore,
  customerStore,
  modalStore,
  hasItems,
  subtotal,
  total,
  discountType,
  discountValue,
}: UsePDVHandlersParams) {
  // Product handlers
  const handleSelectProduct = useCallback(
    (product: Product) => {
      cartStore.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      toast.success(`${product.name} adicionado ao carrinho.`);
    },
    [cartStore],
  );

  const handleUpdateQuantity = useCallback(
    (productId: string, quantity: number) => {
      cartStore.updateQuantity(productId, quantity);
    },
    [cartStore],
  );

  const handleRemoveItem = useCallback(
    (productId: string) => {
      cartStore.removeItem(productId);
      toast.warning("Item removido do carrinho.");
    },
    [cartStore],
  );

  // Customer handlers
  const handleSelectCustomer = useCallback(
    (customer: Customer) => {
      customerStore.setCustomer(customer);
      toast.success(`Cliente ${customer.name} selecionado.`);
    },
    [customerStore],
  );

  const handleAddNewCustomer = useCallback(
    (customer: Customer) => {
      customerStore.setCustomer(customer);
      toast.success(`Cliente ${customer.name} adicionado.`);
    },
    [customerStore],
  );

  // Discount handlers
  const handleApplyDiscount = useCallback(
    (type: "percentage" | "fixed", value: number) => {
      cartStore.setDiscount(type, value);
      toast.success(
        `Desconto de ${
          type === "percentage" ? `${value}%` : `R$ ${value.toFixed(2)}`
        } aplicado.`,
      );
    },
    [cartStore],
  );

  const handleOpenDiscountModal = useCallback(() => {
    if (!hasItems) {
      toast.error("Adicione itens ao carrinho antes de aplicar desconto.");
      return;
    }
    modalStore.openModal("discount");
  }, [hasItems, modalStore]);

  // Sale handlers
  const handleFinalizeSale = useCallback(async () => {
    if (!hasItems) {
      toast.error("Não é possível finalizar uma venda sem itens no carrinho.");
      return;
    }
    if (!customerStore.selectedCustomer) {
      toast.error("Selecione um cliente para finalizar a venda.");
      return;
    }

    const result = await finalizeSale({
      items: cartStore.items,
      customer: customerStore.selectedCustomer,
      discount: {
        type: discountType ?? "fixed",
        value: discountValue ?? 0,
      },
      subtotal,
      total,
      paymentMethod: "cash", // TODO: implement payment method selection
    });

    if (result.success) {
      toast.success("Venda finalizada com sucesso!");
      cartStore.clearCart();
      customerStore.clearCustomer();
    } else {
      toast.error(result.error);
    }
  }, [
    hasItems,
    customerStore,
    cartStore,
    discountType,
    discountValue,
    subtotal,
    total,
  ]);

  // Budget handlers
  const handleSaveBudget = useCallback(() => {
    if (!hasItems) {
      toast.error("Não há itens no carrinho para salvar.");
      return;
    }

    const budget: Budget = {
      id: generateBudgetId(),
      date: new Date(),
      customer: customerStore.selectedCustomer,
      items: cartStore.items,
      discount: {
        type: discountType ?? "fixed",
        value: discountValue ?? 0,
      },
      subtotal,
      total,
    };

    BudgetStorage.save(budget);
    toast.success("Orçamento salvo com sucesso!");
    cartStore.clearCart();
    customerStore.clearCustomer();
  }, [
    hasItems,
    customerStore,
    cartStore,
    discountType,
    discountValue,
    subtotal,
    total,
  ]);

  const handleLoadBudget = useCallback(
    (budget: Budget) => {
      cartStore.loadFromBudget(budget.items, budget.discount);
      customerStore.setCustomer(budget.customer);
      BudgetStorage.remove(budget.id);
      toast.success("Orçamento carregado.");
    },
    [cartStore, customerStore],
  );

  const handleSelectPaymentMethod = useCallback((method: string) => {
    toast.info(`Forma de pagamento selecionada: ${method}`);
  }, []);

  return {
    handleSelectProduct,
    handleUpdateQuantity,
    handleRemoveItem,
    handleSelectCustomer,
    handleAddNewCustomer,
    handleApplyDiscount,
    handleOpenDiscountModal,
    handleFinalizeSale,
    handleSaveBudget,
    handleLoadBudget,
    handleSelectPaymentMethod,
  };
}
