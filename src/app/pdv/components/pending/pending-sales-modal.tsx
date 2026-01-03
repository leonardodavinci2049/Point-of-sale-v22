"use client";

import { Clock, ShoppingCart, Trash2 } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PendingSale } from "@/types/pending-sale";
import { PendingSalesStorage } from "@/utils/pending-sales-storage";

interface PendingSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSale: (sale: PendingSale) => void;
}

export default function PendingSalesModal({
  isOpen,
  onClose,
  onLoadSale,
}: PendingSalesModalProps) {
  const [pendingSales, setPendingSales] = useState<PendingSale[]>([]);

  const loadPendingSales = useCallback(() => {
    const sales = PendingSalesStorage.getAll();
    setPendingSales(sales);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadPendingSales();
    }
  }, [isOpen, loadPendingSales]);

  const handleLoadSale = (sale: PendingSale) => {
    onLoadSale(sale);
    onClose();
    toast.success("Venda pendente carregada com sucesso!");
  };

  const handleDeleteSale = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    PendingSalesStorage.remove(id);
    loadPendingSales();
    toast.success("Venda pendente excluída.");
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Vendas Pendentes
          </DialogTitle>
        </DialogHeader>

        {pendingSales.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma venda pendente encontrada.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingSales.map((sale) => (
              <div
                key={sale.id}
                className="relative border rounded-lg p-4 hover:bg-accent transition-colors group"
              >
                <button
                  type="button"
                  className="absolute inset-0 w-full h-full cursor-pointer z-0"
                  onClick={() => handleLoadSale(sale)}
                  aria-label={`Carregar venda de ${sale.customer?.name || "Cliente não identificado"}`}
                />
                <div className="flex items-start justify-between relative z-10 pointer-events-none">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {formatDate(sale.date)}
                      </span>
                    </div>

                    {sale.customer && (
                      <p className="font-medium mb-1">{sale.customer.name}</p>
                    )}

                    <p className="text-sm text-muted-foreground mb-2">
                      {sale.items.length}{" "}
                      {sale.items.length === 1 ? "item" : "itens"}
                    </p>

                    <div className="flex items-center gap-4">
                      <span className="text-lg font-semibold">
                        R$ {sale.total.toFixed(2)}
                      </span>
                      {sale.discount.value > 0 && (
                        <span className="text-sm text-green-600">
                          Desconto:{" "}
                          {sale.discount.type === "percentage"
                            ? `${sale.discount.value}%`
                            : `R$ ${sale.discount.value.toFixed(2)}`}
                        </span>
                      )}
                    </div>

                    {sale.notes && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        {sale.notes}
                      </p>
                    )}
                  </div>

                  <div className="pointer-events-auto">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={(e) => handleDeleteSale(sale.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
