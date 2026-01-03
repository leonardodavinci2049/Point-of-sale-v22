import { mockProducts } from "@/data/mock-products";
import type { Product } from "@/types/product";

/**
 * Service layer for product data access.
 * Abstracts data source to facilitate future API integration.
 */
export const ProductService = {
  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockProducts;
  },

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const product = mockProducts.find((p) => p.id === id);
    return product || null;
  },

  /**
   * Search products by name or code
   */
  async search(query: string): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.code.toLowerCase().includes(lowerQuery),
    );
  },

  /**
   * Get products by category
   */
  async getByCategory(category: Product["category"]): Promise<Product[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return mockProducts.filter((p) => p.category === category);
  },
};
