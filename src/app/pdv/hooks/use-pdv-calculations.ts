import { useMemo } from "react";
import { useCartStore } from "../stores/cart-store";

/**
 * Hook for memoized PDV calculations.
 * Centralizes subtotal, discount, and total calculations.
 */
export function usePDVCalculations() {
  const items = useCartStore((state) => state.items);
  const discountState = useCartStore((state) => state.discount);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.subtotal, 0),
    [items],
  );

  const discount = useMemo(() => {
    if (!discountState.type || discountState.value === 0) return 0;

    if (discountState.type === "percentage") {
      return (subtotal * discountState.value) / 100;
    }

    return Math.min(discountState.value, subtotal);
  }, [subtotal, discountState]);

  const total = useMemo(
    () => Math.max(0, subtotal - discount),
    [subtotal, discount],
  );

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items],
  );

  return {
    subtotal,
    discount,
    total,
    itemCount,
    hasItems: items.length > 0,
    discountType: discountState.type,
    discountValue: discountState.value,
  };
}
