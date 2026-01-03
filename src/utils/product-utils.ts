import { mockProducts, type Product } from "@/data/mock-products";
import type { OrderItem } from "../types/order";

/**
 * Encontra um produto pelo ID
 */
export function findProductById(productId: string): Product | undefined {
  return mockProducts.find((product) => product.id === productId);
}

/**
 * Corrige dados de OrderItem que podem não ter imagem (dados antigos)
 * Busca a imagem do produto original se não estiver presente
 */
export function ensureOrderItemHasImage(item: OrderItem): OrderItem {
  // Se o item já tem imagem, retorna como está
  if (item.image) {
    return item;
  }

  // Busca o produto original para obter a imagem
  const product = findProductById(item.productId);

  if (product) {
    return {
      ...item,
      image: product.image,
    };
  }

  // Se não encontrar o produto, usa uma imagem padrão
  return {
    ...item,
    image: "https://picsum.photos/200/200?random=default",
  };
}

/**
 * Corrige uma lista de OrderItems garantindo que todos tenham imagem
 */
export function ensureOrderItemsHaveImages(items: OrderItem[]): OrderItem[] {
  return items.map(ensureOrderItemHasImage);
}
