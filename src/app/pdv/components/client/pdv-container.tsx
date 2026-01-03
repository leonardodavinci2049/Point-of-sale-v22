"use client";

import { Toaster } from "sonner";
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";
import { usePDVCalculations } from "../../hooks/use-pdv-calculations";
import { useCartStore, useCustomerStore, useModalStore } from "../../stores";
import { usePDVHandlers } from "./pdv-handlers";
import { PDVLayout } from "./pdv-layout";
import { PDVContent } from "./pdv-content";
import { PDVModals } from "./pdv-modals";

interface PDVContainerProps {
  initialProducts: Product[];
  initialCustomers: Customer[];
}

export function PDVContainer({
  initialProducts,
  initialCustomers,
}: PDVContainerProps) {
  // Zustand stores
  const cartStore = useCartStore();
  const customerStore = useCustomerStore();
  const modalStore = useModalStore();

  // Memoized calculations
  const { subtotal, discount, total, hasItems, discountType, discountValue } =
    usePDVCalculations();

  // All business logic handlers in a custom hook
  const handlers = usePDVHandlers({
    cartStore,
    customerStore,
    modalStore,
    hasItems,
    subtotal,
    total,
    discountType,
    discountValue,
  });

  return (
    <>
      <PDVLayout onOpenBudgets={() => modalStore.openModal("budget")}>
        <PDVContent
          selectedCustomer={customerStore.selectedCustomer}
          onSearchCustomer={() => modalStore.openModal("searchCustomer")}
          onAddCustomer={() => modalStore.openModal("addCustomer")}
          cartItems={cartStore.items}
          onAddProduct={() => modalStore.openModal("searchProduct")}
          onUpdateQuantity={handlers.handleUpdateQuantity}
          onRemoveItem={handlers.handleRemoveItem}
          subtotal={subtotal}
          discount={discount}
          total={total}
          onAddDiscount={handlers.handleOpenDiscountModal}
          onSelectPaymentMethod={handlers.handleSelectPaymentMethod}
          onSaveBudget={handlers.handleSaveBudget}
          onFinalizeSale={handlers.handleFinalizeSale}
        />
      </PDVLayout>

      <PDVModals
        isSearchProductOpen={modalStore.searchProduct}
        isSearchCustomerOpen={modalStore.searchCustomer}
        isAddCustomerOpen={modalStore.addCustomer}
        isDiscountOpen={modalStore.discount}
        isBudgetOpen={modalStore.budget}
        onCloseSearchProduct={() => modalStore.closeModal("searchProduct")}
        onCloseSearchCustomer={() => modalStore.closeModal("searchCustomer")}
        onCloseAddCustomer={() => modalStore.closeModal("addCustomer")}
        onCloseDiscount={() => modalStore.closeModal("discount")}
        onCloseBudget={() => modalStore.closeModal("budget")}
        onSelectProduct={handlers.handleSelectProduct}
        onSelectCustomer={handlers.handleSelectCustomer}
        onAddCustomer={handlers.handleAddNewCustomer}
        onApplyDiscount={handlers.handleApplyDiscount}
        onLoadBudget={handlers.handleLoadBudget}
        products={initialProducts}
        customers={initialCustomers}
        subtotal={subtotal}
      />

      <Toaster position="top-right" />
    </>
  );
}
