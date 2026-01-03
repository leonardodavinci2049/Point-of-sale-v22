import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderItem } from "@/types/order";

interface CartListProps {
  items: OrderItem[];
  onAddProduct: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

const CartList: React.FC<CartListProps> = ({
  items,
  onAddProduct,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start justify-between gap-2 space-y-0 pb-2 sm:flex-row sm:items-center sm:gap-0">
        <CardTitle className="text-sm font-medium">Itens do Pedido</CardTitle>
        <Button onClick={onAddProduct} className="w-full sm:w-auto">
          + Adicionar Produto
        </Button>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Nenhum item no carrinho.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex flex-col items-start gap-3 border-b pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="h-12 w-12 flex-shrink-0 rounded-md object-cover sm:h-16 sm:w-16"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    {item.variant && (
                      <p className="text-muted-foreground truncate text-sm">
                        {item.variant.size && `Tam: ${item.variant.size}`}
                        {item.variant.color &&
                          (item.variant.size
                            ? ` / Cor: ${item.variant.color}`
                            : `Cor: ${item.variant.color}`)}
                      </p>
                    )}
                    <p className="text-muted-foreground text-sm">
                      R$ {item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        onUpdateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="min-w-[2ch] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        onUpdateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onRemoveItem(item.productId)}
                    >
                      <Trash2 className="text-danger h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {item.subtotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartList;
