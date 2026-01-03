import type { Customer } from "@/data/mock-customers";
import type { OrderItem } from "./order";

/**
 * Interface para representar uma venda pendente
 */
export interface PendingSale {
  id: string;
  date: Date;
  customer: Customer | null;
  items: OrderItem[];
  discount: {
    type: "percentage" | "fixed" | null;
    value: number;
  };
  subtotal: number;
  total: number;
  notes?: string;
}

/**
 * Função auxiliar para gerar um ID único para vendas pendentes
 */
export function generatePendingSaleId(): string {
  return `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
