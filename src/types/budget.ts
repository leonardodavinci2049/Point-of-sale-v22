import type { Customer } from "@/data/mock-customers";
import type { OrderItem } from "./order";

/**
 * Interface para representar um orçamento
 */
export interface Budget {
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
 * Função auxiliar para gerar um ID único para orçamentos
 */
export function generateBudgetId(): string {
  return `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
