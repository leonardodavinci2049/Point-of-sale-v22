"use server";

import type { ActionResult } from "@/types/action-result";
import type { Customer } from "@/types/customer";
import type { OrderItem } from "@/types/order";

interface SaleData {
  items: OrderItem[];
  customer: Customer;
  discount: {
    type: "percentage" | "fixed" | null;
    value: number;
  };
  subtotal: number;
  total: number;
  paymentMethod: "cash" | "credit" | "debit" | "pix" | "multiple";
  notes?: string;
}

interface Sale extends SaleData {
  id: string;
  orderNumber: string;
  date: Date;
  status: "completed";
}

/**
 * Generate a unique order number
 */
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `PDV-${year}-${random}`;
}

/**
 * Server Action to finalize a sale.
 * Validates cart and customer before processing.
 */
export async function finalizeSale(
  data: SaleData,
): Promise<ActionResult<Sale>> {
  // Validate cart has items
  if (!data.items || data.items.length === 0) {
    return {
      success: false,
      error: "Venda deve ter pelo menos um item.",
    };
  }

  // Validate customer is selected
  if (!data.customer) {
    return {
      success: false,
      error: "Selecione um cliente para finalizar a venda.",
    };
  }

  // Validate total is positive
  if (data.total <= 0) {
    return {
      success: false,
      error: "Total da venda deve ser maior que zero.",
    };
  }

  try {
    const sale: Sale = {
      ...data,
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      date: new Date(),
      status: "completed",
    };

    // In production: save to database
    // For now, just return the sale
    console.log("Sale finalized:", sale);

    return { success: true, data: sale };
  } catch (error) {
    console.error("Error finalizing sale:", error);
    return {
      success: false,
      error: "Erro ao finalizar venda. Tente novamente.",
    };
  }
}
