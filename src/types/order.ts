import type { Customer } from "@/data/mock-customers";

export interface Order {
  id: string;
  orderNumber: string; // Ex: "PDV-2025-0001"
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: "cash" | "credit" | "debit" | "pix" | "multiple";
  paymentDetails?: {
    methods: Array<{
      type: string;
      amount: number;
    }>;
  };
  status: "pending" | "completed" | "cancelled" | "refunded";
  seller: string; // Nome do vendedor
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  variant?: {
    size?: string;
    color?: string;
  };
  subtotal: number;
}
