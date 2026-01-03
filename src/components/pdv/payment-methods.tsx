import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentMethodsProps {
  onSelectPaymentMethod: (method: string) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  onSelectPaymentMethod,
}) => {
  const methods = [
    { name: "Dinheiro", icon: "💵" },
    { name: "Cartão de Crédito", icon: "💳" },
    { name: "Cartão de Débito", icon: "💳" },
    { name: "Pix", icon: "📱" },
    { name: "Cheque", icon: "✍️" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Formas de Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {methods.map((method) => (
          <Button
            key={method.name}
            variant="outline"
            className="flex flex-col h-16 justify-center items-center text-sm"
            onClick={() => onSelectPaymentMethod(method.name)}
          >
            <span className="text-xl mb-1">{method.icon}</span>
            <span className="text-xs">{method.name}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default PaymentMethods;
