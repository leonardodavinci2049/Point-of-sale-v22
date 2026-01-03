"use server";

import { CustomerService } from "@/lib/services/customer-service";
import {
  type CustomerFormData,
  customerSchema,
} from "@/shared/schemas/customer-schema";
import type { ActionResult } from "@/types/action-result";
import type { Customer } from "@/types/customer";

/**
 * Server Action to create a new customer.
 * Validates input with Zod schema before creating.
 */
export async function createCustomer(
  formData: CustomerFormData,
): Promise<ActionResult<Customer>> {
  // Validate input with Zod
  const validated = customerSchema.safeParse(formData);

  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  try {
    const customer = await CustomerService.create(validated.data);
    return { success: true, data: customer };
  } catch (error) {
    console.error("Error creating customer:", error);
    return {
      success: false,
      error: "Erro ao criar cliente. Tente novamente.",
    };
  }
}

/**
 * Server Action to search customers.
 */
export async function searchCustomers(
  query: string,
): Promise<ActionResult<Customer[]>> {
  try {
    const customers = await CustomerService.search(query);
    return { success: true, data: customers };
  } catch (error) {
    console.error("Error searching customers:", error);
    return {
      success: false,
      error: "Erro ao buscar clientes.",
    };
  }
}
