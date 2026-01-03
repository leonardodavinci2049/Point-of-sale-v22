export interface Customer {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  phone: string;
  cpf_cnpj?: string;
  type: "individual" | "business";
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  totalOrders?: number;
  totalSpent?: number;
}

/**
 * Utility type for creating a new customer (without auto-generated fields)
 */
export type CustomerCreateData = Omit<Customer, "id" | "createdAt" | "avatar">;

/**
 * Utility type for updating a customer (all fields optional)
 */
export type CustomerUpdateData = Partial<Omit<Customer, "id" | "createdAt">>;

/**
 * Utility type for customer display (minimal fields)
 */
export type CustomerSummary = Pick<
  Customer,
  "id" | "name" | "avatar" | "phone" | "type"
>;
