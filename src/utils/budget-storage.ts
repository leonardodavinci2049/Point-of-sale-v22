import type { Budget } from "../types/budget";
import { ensureOrderItemsHaveImages } from "./product-utils";
import { LocalStorageManager, STORAGE_KEYS } from "./storage";

/**
 * Retorna todos os orçamentos
 */
export function getAllBudgets(): Budget[] {
  const budgets = LocalStorageManager.get<Budget[]>(STORAGE_KEYS.BUDGETS, []);

  // Garante que todos os items dos orçamentos tenham imagem (compatibilidade com dados antigos)
  return budgets.map((budget) => ({
    ...budget,
    items: ensureOrderItemsHaveImages(budget.items),
  }));
}

/**
 * Salva um orçamento
 */
export function saveBudget(budget: Budget): void {
  const budgets = getAllBudgets();
  const existingIndex = budgets.findIndex((b) => b.id === budget.id);

  if (existingIndex >= 0) {
    budgets[existingIndex] = budget;
  } else {
    budgets.push(budget);
  }

  LocalStorageManager.set(STORAGE_KEYS.BUDGETS, budgets);
}

/**
 * Retorna um orçamento específico por ID
 */
export function getBudgetById(id: string): Budget | null {
  const budgets = getAllBudgets();
  return budgets.find((b) => b.id === id) || null;
}

/**
 * Remove um orçamento por ID
 */
export function removeBudget(id: string): void {
  const budgets = getAllBudgets();
  const filtered = budgets.filter((b) => b.id !== id);
  LocalStorageManager.set(STORAGE_KEYS.BUDGETS, filtered);
}

/**
 * Remove todos os orçamentos
 */
export function clearBudgets(): void {
  LocalStorageManager.remove(STORAGE_KEYS.BUDGETS);
}

/**
 * Retorna o número de orçamentos
 */
export function countBudgets(): number {
  return getAllBudgets().length;
}

/**
 * @deprecated Use as funções individuais ao invés da classe. Esta classe será removida em versões futuras.
 * Mantido para compatibilidade com código existente
 */
export const BudgetStorage = {
  save: saveBudget,
  getAll: getAllBudgets,
  getById: getBudgetById,
  remove: removeBudget,
  clear: clearBudgets,
  count: countBudgets,
} as const;
