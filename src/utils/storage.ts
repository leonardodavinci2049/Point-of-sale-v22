/**
 * Utilitário type-safe para gerenciar LocalStorage
 * Fornece funções para salvar, carregar e remover dados do navegador
 */

/**
 * Salva um valor no LocalStorage
 * @param key - Chave para armazenar o valor
 * @param value - Valor a ser armazenado (será convertido para JSON)
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Erro ao salvar no LocalStorage (${key}):`, error);
  }
}

/**
 * Carrega um valor do LocalStorage
 * @param key - Chave do valor a ser carregado
 * @param defaultValue - Valor padrão caso a chave não exista
 * @returns O valor armazenado ou o valor padrão
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Erro ao carregar do LocalStorage (${key}):`, error);
    return defaultValue;
  }
}

/**
 * Remove um valor do LocalStorage
 * @param key - Chave do valor a ser removido
 */
export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Erro ao remover do LocalStorage (${key}):`, error);
  }
}

/**
 * Limpa todo o LocalStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Erro ao limpar LocalStorage:", error);
  }
}

/**
 * Verifica se uma chave existe no LocalStorage
 * @param key - Chave a ser verificada
 * @returns true se a chave existe, false caso contrário
 */
export function hasLocalStorage(key: string): boolean {
  return localStorage.getItem(key) !== null;
}

// Mantido para compatibilidade com código existente
// @deprecated Use as funções individuais ao invés da classe
export const LocalStorageManager = {
  set: setLocalStorage,
  get: getLocalStorage,
  remove: removeLocalStorage,
  clear: clearLocalStorage,
  has: hasLocalStorage,
} as const;

/**
 * Chaves do LocalStorage usadas no sistema PDV
 */
export const STORAGE_KEYS = {
  CART: "pdv:cart",
  CUSTOMER: "pdv:customer",
  DISCOUNT: "pdv:discount",
  BUDGETS: "pdv:budgets",
  PENDING_SALES: "pdv:pending-sales",
  THEME: "pdv:theme",
  LAST_SALE: "pdv:last-sale",
} as const;
