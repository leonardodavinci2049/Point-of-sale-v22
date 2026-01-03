"use client";

import dynamic from "next/dynamic";
import type { Budget } from "@/types/budget";
import type { Customer } from "@/types/customer";
import type { Product } from "@/types/product";

// Lazy load modals for better performance
const SearchProductModal = dynamic(
  () => import("@/app/pdv/components/search/search-product-modal"),
  { ssr: false },
);
const SearchCustomerModal = dynamic(
  () => import("@/app/pdv/components/search/search-customer-modal"),
  { ssr: false },
);
const AddCustomerModal = dynamic(
  () => import("@/app/pdv/components/customer/add-customer-modal"),
  { ssr: false },
);
const DiscountModal = dynamic(
  () => import("@/app/pdv/components/discount/discount-modal"),
  { ssr: false },
);
const BudgetModal = dynamic(
  () => import("@/app/pdv/components/budget/budget-modal"),
  { ssr: false },
);

interface PDVModalsProps {
  // Modal states
  isSearchProductOpen: boolean;
  isSearchCustomerOpen: boolean;
  isAddCustomerOpen: boolean;
  isDiscountOpen: boolean;
  isBudgetOpen: boolean;

  // Close handlers
  onCloseSearchProduct: () => void;
  onCloseSearchCustomer: () => void;
  onCloseAddCustomer: () => void;
  onCloseDiscount: () => void;
  onCloseBudget: () => void;

  // Action handlers
  onSelectProduct: (product: Product) => void;
  onSelectCustomer: (customer: Customer) => void;
  onAddCustomer: (customer: Customer) => void;
  onApplyDiscount: (type: "percentage" | "fixed", value: number) => void;
  onLoadBudget: (budget: Budget) => void;

  // Data
  products: Product[];
  customers: Customer[];
  subtotal: number;
}

/**
 * Component that manages all PDV modals
 * Keeps modal logic separated from main container
 */
export function PDVModals({
  isSearchProductOpen,
  isSearchCustomerOpen,
  isAddCustomerOpen,
  isDiscountOpen,
  isBudgetOpen,
  onCloseSearchProduct,
  onCloseSearchCustomer,
  onCloseAddCustomer,
  onCloseDiscount,
  onCloseBudget,
  onSelectProduct,
  onSelectCustomer,
  onAddCustomer,
  onApplyDiscount,
  onLoadBudget,
  products,
  customers,
  subtotal,
}: PDVModalsProps) {
  return (
    <>
      {isSearchProductOpen && (
        <SearchProductModal
          isOpen={isSearchProductOpen}
          onClose={onCloseSearchProduct}
          onSelectProduct={onSelectProduct}
          products={products}
        />
      )}

      {isSearchCustomerOpen && (
        <SearchCustomerModal
          isOpen={isSearchCustomerOpen}
          onClose={onCloseSearchCustomer}
          onSelectCustomer={onSelectCustomer}
          customers={customers}
        />
      )}

      {isAddCustomerOpen && (
        <AddCustomerModal
          isOpen={isAddCustomerOpen}
          onClose={onCloseAddCustomer}
          onAddCustomer={onAddCustomer}
        />
      )}

      {isDiscountOpen && (
        <DiscountModal
          isOpen={isDiscountOpen}
          onClose={onCloseDiscount}
          onApplyDiscount={onApplyDiscount}
          subtotal={subtotal}
        />
      )}

      {isBudgetOpen && (
        <BudgetModal
          isOpen={isBudgetOpen}
          onClose={onCloseBudget}
          onLoadSale={onLoadBudget}
        />
      )}
    </>
  );
}
