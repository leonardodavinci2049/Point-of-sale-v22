import { z } from "zod";

/**
 * Zod schema for customer form validation.
 * Used in both client-side forms and server-side validation.
 */
export const customerSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .max(20, "Telefone deve ter no máximo 20 caracteres"),
  cpf_cnpj: z.string().optional().or(z.literal("")),
  type: z.enum(["individual", "business"]).default("individual"),
});

/**
 * Type inferred from the customer schema.
 * Use this for form data typing.
 */
export type CustomerFormData = z.infer<typeof customerSchema>;

/**
 * Schema for updating customer (all fields optional)
 */
export const customerUpdateSchema = customerSchema.partial();

export type CustomerUpdateData = z.infer<typeof customerUpdateSchema>;
