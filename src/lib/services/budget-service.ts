import type { Budget } from "@/types/budget";

const STORAGE_KEY = "pdv:budgets";

/**
 * Service layer for budget data access.
 * Uses localStorage for persistence during development.
 */
export const BudgetService = {
  /**
   * Get all budgets from storage
   */
  async getAll(): Promise<Budget[]> {
    if (typeof window === "undefined") return [];

    await new Promise((resolve) => setTimeout(resolve, 50));
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) return [];

    try {
      const budgets = JSON.parse(data) as Budget[];
      // Convert date strings back to Date objects
      return budgets.map((b) => ({
        ...b,
        date: new Date(b.date),
      }));
    } catch {
      return [];
    }
  },

  /**
   * Get budget by ID
   */
  async getById(id: string): Promise<Budget | null> {
    const budgets = await this.getAll();
    return budgets.find((b) => b.id === id) || null;
  },

  /**
   * Save a new budget
   */
  async save(budget: Budget): Promise<Budget> {
    if (typeof window === "undefined") {
      throw new Error("Cannot save budget on server");
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const budgets = await this.getAll();
    const existingIndex = budgets.findIndex((b) => b.id === budget.id);

    if (existingIndex >= 0) {
      budgets[existingIndex] = budget;
    } else {
      budgets.push(budget);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    return budget;
  },

  /**
   * Remove a budget by ID
   */
  async remove(id: string): Promise<void> {
    if (typeof window === "undefined") {
      throw new Error("Cannot remove budget on server");
    }

    await new Promise((resolve) => setTimeout(resolve, 50));

    const budgets = await this.getAll();
    const filtered = budgets.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },

  /**
   * Clear all budgets
   */
  async clear(): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  },
};
