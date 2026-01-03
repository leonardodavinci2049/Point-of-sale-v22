"use client";

import { Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BudgetStorage } from "@/utils/budget-storage";

interface BudgetsButtonProps {
  onClick: () => void;
}

/**
 * Componente Client Component para o botão de orçamentos
 * Mostra o número de orçamentos e permite abrir o modal
 */
export default function BudgetsButton({ onClick }: BudgetsButtonProps) {
  const [count, setCount] = useState(0);

  const updateCount = useCallback(() => {
    setCount(BudgetStorage.count());
  }, []);

  useEffect(() => {
    // Atualizar contagem ao montar
    updateCount();

    // Atualizar contagem periodicamente
    const interval = setInterval(updateCount, 2000);

    return () => clearInterval(interval);
  }, [updateCount]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="relative border border-white/20 text-white hover:border-white/30 hover:bg-slate-700 hover:text-white"
    >
      <Clock className="mr-2 h-4 w-4 text-white" />
      <span className="text-white">Orçamento</span>
      {count > 0 && (
        <span className="text-primary-700 ml-2 rounded-full bg-white px-2 py-0.5 text-xs font-semibold">
          {count}
        </span>
      )}
    </Button>
  );
}
