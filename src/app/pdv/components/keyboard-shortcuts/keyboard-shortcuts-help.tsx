import { Keyboard } from "lucide-react";

/**
 * Componente Server Component para exibir os atalhos de teclado disponíveis
 * Pode ser usado em tooltips, modais de ajuda ou documentação
 */
export default function KeyboardShortcutsHelp() {
  const shortcuts = [
    { key: "F2", description: "Buscar cliente" },
    { key: "F3", description: "Adicionar produto" },
    { key: "F4", description: "Aplicar desconto" },
    { key: "F5", description: "Finalizar venda" },
    { key: "Ctrl+S", description: "Salvar venda pendente" },
    { key: "Esc", description: "Fechar modais" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
        <Keyboard className="h-4 w-4" />
        <span>Atalhos de Teclado</span>
      </div>
      <div className="grid gap-2">
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.key}
            className="flex items-center justify-between text-sm"
          >
            <span className="text-muted-foreground">
              {shortcut.description}
            </span>
            <kbd className="px-2 py-1 text-xs font-semibold bg-neutral-200 dark:bg-neutral-700 rounded">
              {shortcut.key}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  );
}
