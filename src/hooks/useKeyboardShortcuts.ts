import { useEffect } from "react";

interface KeyboardShortcutHandlers {
  onSearchCustomer?: () => void;
  onSearchProduct?: () => void;
  onApplyDiscount?: () => void;
  onFinalizeSale?: () => void;
  onSaveBudget?: () => void;
  onCloseModal?: () => void;
}

/**
 * Hook customizado para gerenciar atalhos de teclado do PDV
 *
 * Atalhos disponíveis:
 * - F2: Buscar cliente
 * - F3: Adicionar produto
 * - F4: Aplicar desconto
 * - F5: Finalizar venda
 * - Ctrl+S: Salvar venda pendente
 * - Esc: Fechar modais
 */
export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignora atalhos quando estiver digitando em inputs/textareas
      const target = e.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // F2 = Buscar Cliente
      if (e.key === "F2") {
        e.preventDefault();
        handlers.onSearchCustomer?.();
      }

      // F3 = Adicionar Produto
      if (e.key === "F3") {
        e.preventDefault();
        handlers.onSearchProduct?.();
      }

      // F4 = Aplicar Desconto
      if (e.key === "F4") {
        e.preventDefault();
        handlers.onApplyDiscount?.();
      }

      // F5 = Finalizar Venda (sobrescreve o refresh padrão do navegador)
      if (e.key === "F5") {
        e.preventDefault();
        handlers.onFinalizeSale?.();
      }

      // Ctrl+S = Salvar Venda Pendente
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && !isInputField) {
        e.preventDefault();
        handlers.onSaveBudget?.();
      }

      // Esc = Fechar Modais
      if (e.key === "Escape") {
        handlers.onCloseModal?.();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handlers]);
}
