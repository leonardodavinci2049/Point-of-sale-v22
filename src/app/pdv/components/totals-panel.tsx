import { Tag } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TotalsPanelProps {
  subtotal: number;
  discount: number;
  shipping?: number;
  total: number;
  onAddDiscount?: () => void;
}

const TotalsPanel: React.FC<TotalsPanelProps> = ({
  subtotal,
  discount,
  shipping = 0,
  total,
  onAddDiscount,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Resumo do Pedido
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Desconto:</span>
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary-600 dark:text-primary-400">
              - R$ {discount.toFixed(2)}
            </span>
            {onAddDiscount && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onAddDiscount}
                title="Adicionar desconto"
              >
                <Tag className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        {shipping > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frete:</span>
            <span className="font-medium">R$ {shipping.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalsPanel;
