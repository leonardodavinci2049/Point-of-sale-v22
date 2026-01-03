import type { Order, OrderItem } from "../types/order";
import { mockCustomers } from "./mock-customers";
import { mockProducts } from "./mock-products";

const generateRandomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const generateRandomId = () => Math.random().toString(36).substring(2, 15);

const paymentMethods = ["cash", "credit", "debit", "pix", "multiple"];
const orderStatus = ["pending", "completed", "cancelled", "refunded"];
const sellers = ["João Silva", "Maria Oliveira", "Pedro Souza"];

const generateOrderItem = (): OrderItem => {
  const product =
    mockProducts[generateRandomNumber(0, mockProducts.length - 1)];
  const quantity = generateRandomNumber(1, 5);
  const unitPrice = product.price;
  const subtotal = unitPrice * quantity;

  let variant: { size?: string; color?: string } | undefined;
  if (product.variants) {
    const size = product.variants.size
      ? product.variants.size[
          generateRandomNumber(0, product.variants.size.length - 1)
        ]
      : undefined;
    const color = product.variants.color
      ? product.variants.color[
          generateRandomNumber(0, product.variants.color.length - 1)
        ]
      : undefined;
    variant = { size, color };
  }

  return {
    productId: product.id,
    name: product.name,
    image: product.image,
    quantity,
    unitPrice,
    variant,
    subtotal,
  };
};

export const mockOrders: Order[] = Array.from({ length: 30 }).map(
  (_, index) => {
    const customer =
      mockCustomers[generateRandomNumber(0, mockCustomers.length - 1)];
    const items = Array.from({ length: generateRandomNumber(1, 5) }).map(
      generateOrderItem,
    );
    const subtotal = parseFloat(
      items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
    );
    const discount =
      generateRandomNumber(0, 1) === 1
        ? parseFloat(
            (subtotal * (generateRandomNumber(5, 20) / 100)).toFixed(2),
          )
        : 0;
    const shipping =
      generateRandomNumber(0, 1) === 1
        ? parseFloat(generateRandomNumber(10, 50).toFixed(2))
        : 0;
    const total = parseFloat((subtotal - discount + shipping).toFixed(2));
    const paymentMethod = paymentMethods[
      generateRandomNumber(0, paymentMethods.length - 1)
    ] as "cash" | "credit" | "debit" | "pix" | "multiple";
    const status = orderStatus[
      generateRandomNumber(0, orderStatus.length - 1)
    ] as "pending" | "completed" | "cancelled" | "refunded";
    const createdAt = new Date(
      Date.now() - generateRandomNumber(0, 365 * 24 * 60 * 60 * 1000),
    );
    const completedAt =
      status === "completed"
        ? new Date(
            createdAt.getTime() + generateRandomNumber(1, 24 * 60 * 60 * 1000),
          )
        : undefined;

    return {
      id: generateRandomId(),
      orderNumber: `PDV-2025-${String(index + 1).padStart(4, "0")}`,
      customer,
      items,
      subtotal,
      discount,
      shipping,
      total,
      paymentMethod,
      paymentDetails:
        paymentMethod === "multiple"
          ? {
              methods: [
                { type: "credit", amount: total / 2 },
                { type: "cash", amount: total / 2 },
              ],
            }
          : undefined,
      status,
      seller: sellers[generateRandomNumber(0, sellers.length - 1)],
      createdAt,
      completedAt,
      notes:
        generateRandomNumber(0, 1) === 1
          ? "Alguma observação sobre o pedido."
          : undefined,
    };
  },
);
