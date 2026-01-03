"use client";

import { DollarSign, Percent } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (type: "percentage" | "fixed", value: number) => void;
  subtotal: number;
}

export default function DiscountModal({
  isOpen,
  onClose,
  onApplyDiscount,
  subtotal,
}: DiscountModalProps) {
  const discountInputId = useId();
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [discountValue, setDiscountValue] = useState<string>("");

  const handleApply = () => {
    const value = parseFloat(discountValue);
    if (Number.isNaN(value) || value <= 0) {
      return;
    }

    if (discountType === "percentage" && value > 100) {
      return;
    }

    if (discountType === "fixed" && value > subtotal) {
      return;
    }

    onApplyDiscount(discountType, value);
    setDiscountValue("");
    onClose();
  };

  const calculatePreview = () => {
    const value = parseFloat(discountValue);
    if (Number.isNaN(value) || value <= 0) return 0;

    if (discountType === "percentage") {
      return (subtotal * value) / 100;
    }
    return value;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aplicar Desconto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={discountType === "percentage" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setDiscountType("percentage")}
            >
              <Percent className="mr-2 h-4 w-4" />
              Percentual
            </Button>
            <Button
              variant={discountType === "fixed" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setDiscountType("fixed")}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Valor Fixo
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor={discountInputId}>
              {discountType === "percentage" ? "Percentual (%)" : "Valor (R$)"}
            </Label>
            <Input
              id={discountInputId}
              type="number"
              placeholder={discountType === "percentage" ? "0" : "0.00"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              min="0"
              max={discountType === "percentage" ? "100" : subtotal.toString()}
              step={discountType === "percentage" ? "1" : "0.01"}
            />
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-primary-600 dark:text-primary-400">
              <span>Desconto:</span>
              <span>- R$ {calculatePreview().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total:</span>
              <span>R$ {(subtotal - calculatePreview()).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Aplicar Desconto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
