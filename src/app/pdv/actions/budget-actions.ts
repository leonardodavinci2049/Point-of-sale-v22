"use server";

import { BudgetService } from "@/lib/services/budget-service";
import type { ActionResult } from "@/types/action-result";
import type { Budget } from "@/types/budget";

/**
 * Server Action to save a budget.
 * Validates that budget has at least one item.
 */
export async function saveBudget(
  budget: Budget,
): Promise<ActionResult<Budget>> {
  // Validate budget has items
  if (!budget.items || budget.items.length === 0) {
    return {
      success: false,
      error: "Orçamento deve ter pelo menos um item.",
    };
  }

  try {
    const saved = await BudgetService.save(budget);
    return { success: true, data: saved };
  } catch (error) {
    console.error("Error saving budget:", error);
    return {
      success: false,
      error: "Erro ao salvar orçamento.",
    };
  }
}

/**
 * Server Action to remove a budget.
 */
export async function removeBudget(id: string): Promise<ActionResult<void>> {
  if (!id) {
    return {
      success: false,
      error: "ID do orçamento é obrigatório.",
    };
  }

  try {
    await BudgetService.remove(id);
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Error removing budget:", error);
    return {
      success: false,
      error: "Erro ao remover orçamento.",
    };
  }
}

/**
 * Server Action to get all budgets.
 */
export async function getBudgets(): Promise<ActionResult<Budget[]>> {
  try {
    const budgets = await BudgetService.getAll();
    return { success: true, data: budgets };
  } catch (error) {
    console.error("Error getting budgets:", error);
    return {
      success: false,
      error: "Erro ao carregar orçamentos.",
    };
  }
}
