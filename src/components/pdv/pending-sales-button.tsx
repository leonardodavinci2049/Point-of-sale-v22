"use client";

import { Clock } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PendingSalesStorage } from "@/utils/pending-sales-storage";

interface PendingSalesButtonProps {
  onClick: () => void;
}

/**
 * Componente Client Component para o botão de vendas pendentes
 * Mostra o número de vendas pendentes e permite abrir o modal
 */
export default function PendingSalesButton({
  onClick,
}: PendingSalesButtonProps) {
  const [count, setCount] = useState(0);

  const updateCount = useCallback(() => {
    setCount(PendingSalesStorage.count());
  }, []);

  useEffect(() => {
    // Atualizar contagem ao montar
    updateCount();

    // Atualizar contagem periodicamente
    const interval = setInterval(updateCount, 2000);

    return () => clearInterval(interval);
  }, [updateCount]);

  return (
    <Button variant="outline" size="sm" onClick={onClick} className="relative">
      <Clock className="h-4 w-4 mr-2" />
      Vendas Pendentes
      {count > 0 && (
        <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
          {count}
        </span>
      )}
    </Button>
  );
}
