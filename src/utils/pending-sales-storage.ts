import type { PendingSale } from "../types/pending-sale";
import { ensureOrderItemsHaveImages } from "./product-utils";
import { LocalStorageManager, STORAGE_KEYS } from "./storage";

/**
 * Retorna todas as vendas pendentes
 */
export function getAllPendingSales(): PendingSale[] {
  const sales = LocalStorageManager.get<PendingSale[]>(
    STORAGE_KEYS.PENDING_SALES,
    [],
  );

  // Garante que todos os items das vendas pendentes tenham imagem (compatibilidade com dados antigos)
  return sales.map((sale) => ({
    ...sale,
    items: ensureOrderItemsHaveImages(sale.items),
  }));
}

/**
 * Salva uma venda pendente
 */
export function savePendingSale(sale: PendingSale): void {
  const sales = getAllPendingSales();
  const existingIndex = sales.findIndex((s) => s.id === sale.id);

  if (existingIndex >= 0) {
    sales[existingIndex] = sale;
  } else {
    sales.push(sale);
  }

  LocalStorageManager.set(STORAGE_KEYS.PENDING_SALES, sales);
}

/**
 * Retorna uma venda pendente específica por ID
 */
export function getPendingSaleById(id: string): PendingSale | null {
  const sales = getAllPendingSales();
  return sales.find((s) => s.id === id) || null;
}

/**
 * Remove uma venda pendente por ID
 */
export function removePendingSale(id: string): void {
  const sales = getAllPendingSales();
  const filtered = sales.filter((s) => s.id !== id);
  LocalStorageManager.set(STORAGE_KEYS.PENDING_SALES, filtered);
}

/**
 * Remove todas as vendas pendentes
 */
export function clearPendingSales(): void {
  LocalStorageManager.remove(STORAGE_KEYS.PENDING_SALES);
}

/**
 * Retorna o número de vendas pendentes
 */
export function countPendingSales(): number {
  return getAllPendingSales().length;
}

/**
 * @deprecated Use as funções individuais ao invés da classe. Esta classe será removida em versões futuras.
 * Mantido para compatibilidade com código existente
 */
export const PendingSalesStorage = {
  save: savePendingSale,
  getAll: getAllPendingSales,
  getById: getPendingSaleById,
  remove: removePendingSale,
  clear: clearPendingSales,
  count: countPendingSales,
} as const;
