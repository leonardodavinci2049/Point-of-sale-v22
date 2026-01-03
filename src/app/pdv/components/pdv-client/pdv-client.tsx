"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { finalizeSale } from "@/app/pdv/actions/sale-actions";
import CustomerPanel from "@/app/pdv/components/customer/customer-panel";
import Header from "@/app/pdv/layout/header";
import Sidebar from "@/app/pdv/layout/sidebar";
import CartList from "@/components/pdv/cart-list";
import PaymentMethods from "@/components/pdv/payment-methods";
import TotalsPanel from "@/components/pdv/totals-panel";
import { Button } from "@/components/ui/button";
import type { Budget } from "@/types/budget";
import { generateBudgetId } from "@/types/budget";
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";
import { BudgetStorage } from "@/utils/budget-storage";
import { useCartStore, useCustomerStore, useModalStore } from "../../stores";
import { usePDVCalculations } from "../../hooks/use-pdv-calculations";


// Lazy load modals for better performance
const SearchProductModal = dynamic(
  () => import("@/components/pdv/search-product-modal"),
  { ssr: false },
);
const SearchCustomerModal = dynamic(
  () => import("@/app/pdv/components/search/search-customer-modal"),
  { ssr: false },
);
const AddCustomerModal = dynamic(
  () => import("@/components/pdv/add-customer-modal"),
  { ssr: false },
);
const DiscountModal = dynamic(() => import("@/components/pdv/discount-modal"), {
  ssr: false,
});
const BudgetModal = dynamic(() => import("@/components/pdv/budget-modal"), {
  ssr: false,
});

export function PDVClient() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Zustand stores
  const cartStore = useCartStore();
  const customerStore = useCustomerStore();
  const modalStore = useModalStore();

  // Memoized calculations
  const { subtotal, discount, total, hasItems, discountType, discountValue } =
    usePDVCalculations();

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

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
      discount: { type: discountType, value: discountValue },
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
      discount: { type: discountType, value: discountValue },
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

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-neutral-100 dark:bg-neutral-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
          !isMobile && isSidebarOpen ? "lg:ml-64" : !isMobile ? "lg:ml-16" : ""
        }`}
      >
        <Header
          sellerName="João Silva"
          onMenuToggle={toggleSidebar}
          onOpenBudgets={() => modalStore.openModal("budget")}
        />

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 lg:p-6">
          <div className="grid max-w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            {/* Left column: Customer + Cart */}
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-2 lg:gap-6">
              <CustomerPanel
                customer={customerStore.selectedCustomer}
                onSearchCustomer={() => modalStore.openModal("searchCustomer")}
                onAddCustomer={() => modalStore.openModal("addCustomer")}
              />
              <CartList
                items={cartStore.items}
                onAddProduct={() => modalStore.openModal("searchProduct")}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            {/* Right column: Totals + Payment */}
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-1 lg:gap-6">
              <TotalsPanel
                subtotal={subtotal}
                discount={discount}
                shipping={0}
                total={total}
                onAddDiscount={handleOpenDiscountModal}
              />
              <PaymentMethods
                onSelectPaymentMethod={handleSelectPaymentMethod}
              />
              <div className="mt-auto flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSaveBudget}
                >
                  Salvar Orçamento
                </Button>
                <Button
                  className="w-full py-6 text-lg"
                  onClick={handleFinalizeSale}
                >
                  Finalizar Venda
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Lazy-loaded modals */}
      {modalStore.searchProduct && (
        <SearchProductModal
          isOpen={modalStore.searchProduct}
          onClose={() => modalStore.closeModal("searchProduct")}
          onSelectProduct={handleSelectProduct}
        />
      )}

      {modalStore.searchCustomer && (
        <SearchCustomerModal
          isOpen={modalStore.searchCustomer}
          onClose={() => modalStore.closeModal("searchCustomer")}
          onSelectCustomer={handleSelectCustomer}
        />
      )}

      {modalStore.addCustomer && (
        <AddCustomerModal
          isOpen={modalStore.addCustomer}
          onClose={() => modalStore.closeModal("addCustomer")}
          onAddCustomer={handleAddNewCustomer}
        />
      )}

      {modalStore.discount && (
        <DiscountModal
          isOpen={modalStore.discount}
          onClose={() => modalStore.closeModal("discount")}
          onApplyDiscount={handleApplyDiscount}
          subtotal={subtotal}
        />
      )}

      {modalStore.budget && (
        <BudgetModal
          isOpen={modalStore.budget}
          onClose={() => modalStore.closeModal("budget")}
          onLoadSale={handleLoadBudget}
        />
      )}

      <Toaster position="top-right" />
    </div>
  );
}
