import { mockCustomers } from "@/data/mock-customers";
import type { Customer } from "@/types/customer";

/**
 * Service layer for customer data access.
 * Abstracts data source to facilitate future API integration.
 */
export const CustomerService = {
  /**
   * Get all customers
   */
  async getAll(): Promise<Customer[]> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockCustomers;
  },

  /**
   * Get customer by ID
   */
  async getById(id: string): Promise<Customer | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const customer = mockCustomers.find((c) => c.id === id);
    return customer || null;
  },

  /**
   * Search customers by name, phone, or email
   */
  async search(query: string): Promise<Customer[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const lowerQuery = query.toLowerCase();
    return mockCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.phone.includes(query) ||
        c.email?.toLowerCase().includes(lowerQuery),
    );
  },

  /**
   * Create a new customer
   */
  async create(
    data: Omit<Customer, "id" | "createdAt" | "avatar">,
  ): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const newCustomer: Customer = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random&color=fff&size=128&rounded=true&bold=true`,
    };

    // In production: save to database
    // For now, just return the new customer
    return newCustomer;
  },

  /**
   * Get customers by type
   */
  async getByType(type: Customer["type"]): Promise<Customer[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockCustomers.filter((c) => c.type === type);
  },
};
