import { HelpCircle, Menu, Settings } from "lucide-react";
import React from "react";
import BudgetButton from "@/components/pdv/budget-button";
import ModeToggle from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  sellerName: string;
  onMenuToggle: () => void;
  onOpenBudgets?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  sellerName,
  onMenuToggle,
  onOpenBudgets,
}) => {
  const [currentDateTime, setCurrentDateTime] = React.useState(new Date());
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = currentDateTime.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="flex min-w-0 items-center justify-between bg-slate-800 p-4 shadow-md dark:bg-slate-900">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 text-white hover:bg-slate-700 hover:text-white"
          onClick={onMenuToggle}
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
        <div className="truncate text-lg font-bold text-white sm:text-xl">
          <span className="sm:hidden">PDV</span>
          <span className="hidden sm:inline">Sistema PDV</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
        <span className="hidden text-sm text-white md:block lg:text-base">
          👤 {sellerName}
        </span>
        <span className="hidden text-sm text-white md:block lg:text-base">
          🕐 {mounted ? `${formattedTime} ${formattedDate}` : ""}
        </span>
        {onOpenBudgets && <BudgetButton onClick={onOpenBudgets} />}
        <ModeToggle />
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-slate-700 hover:text-white"
        >
          <Settings className="h-5 w-5 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden text-white hover:bg-slate-700 hover:text-white sm:flex"
        >
          <HelpCircle className="h-5 w-5 text-white" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
