import { z } from "zod";

/**
 * Zod schema for discount form validation.
 * Validates discount type and value with business rules.
 */
export const discountSchema = z
  .object({
    type: z.enum(["percentage", "fixed"], {
      required_error: "Selecione o tipo de desconto",
    }),
    value: z
      .number({
        required_error: "Informe o valor do desconto",
        invalid_type_error: "Valor deve ser um número",
      })
      .positive("Valor deve ser positivo"),
  })
  .refine((data) => data.type !== "percentage" || data.value <= 100, {
    message: "Percentual não pode exceder 100%",
    path: ["value"],
  });

/**
 * Type inferred from the discount schema.
 */
export type DiscountFormData = z.infer<typeof discountSchema>;

/**
 * Schema for discount state (allows null type for no discount)
 */
export const discountStateSchema = z.object({
  type: z.enum(["percentage", "fixed"]).nullable(),
  value: z.number().min(0),
});

export type DiscountState = z.infer<typeof discountStateSchema>;
