"use client";

import CartList from "@/app/pdv/components/cart/cart-list";
import CustomerPanel from "@/app/pdv/components/customer/customer-panel";
import PaymentMethods from "@/app/pdv/components/payment-methods/payment-methods";
import TotalsPanel from "@/app/pdv/components/totals-panel";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/types/customer";
import type { OrderItem } from "@/types/order";

interface PDVContentProps {
  // Customer
  selectedCustomer: Customer | null;
  onSearchCustomer: () => void;
  onAddCustomer: () => void;

  // Cart
  cartItems: OrderItem[];
  onAddProduct: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;

  // Totals
  subtotal: number;
  discount: number;
  total: number;
  onAddDiscount: () => void;

  // Payment
  onSelectPaymentMethod: (method: string) => void;

  // Actions
  onSaveBudget: () => void;
  onFinalizeSale: () => void;
}

/**
 * Main content area of PDV
 * Separated from container for better organization
 */
export function PDVContent({
  selectedCustomer,
  onSearchCustomer,
  onAddCustomer,
  cartItems,
  onAddProduct,
  onUpdateQuantity,
  onRemoveItem,
  subtotal,
  discount,
  total,
  onAddDiscount,
  onSelectPaymentMethod,
  onSaveBudget,
  onFinalizeSale,
}: PDVContentProps) {
  return (
    <main className="min-w-0 flex-1 overflow-x-hidden p-4 lg:p-6">
      <div className="grid max-w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        {/* Left column: Customer + Cart */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2 lg:gap-6">
          <CustomerPanel
            customer={selectedCustomer}
            onSearchCustomer={onSearchCustomer}
            onAddCustomer={onAddCustomer}
          />
          <CartList
            items={cartItems}
            onAddProduct={onAddProduct}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        </div>

        {/* Right column: Totals + Payment */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-1 lg:gap-6">
          <TotalsPanel
            subtotal={subtotal}
            discount={discount}
            shipping={0}
            total={total}
            onAddDiscount={onAddDiscount}
          />
          <PaymentMethods onSelectPaymentMethod={onSelectPaymentMethod} />
          <div className="mt-auto flex flex-col gap-2">
            <Button variant="outline" className="w-full" onClick={onSaveBudget}>
              Salvar Orçamento
            </Button>
            <Button className="w-full py-6 text-lg" onClick={onFinalizeSale}>
              Finalizar Venda
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
