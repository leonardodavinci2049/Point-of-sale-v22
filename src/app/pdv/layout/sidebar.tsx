"use client";

import {
  BarChart,
  Home,
  LogOut,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, isMobile }) => {
  const menuItems = [
    { icon: ShoppingCart, label: "Nova Venda", href: "#", badge: "1" },
    { icon: Home, label: "Últimos Pedidos", href: "#", badge: "2" },
    { icon: Users, label: "Clientes", href: "#", badge: "1" },
    { icon: BarChart, label: "Relatórios", href: "#", badge: "4" },
    { icon: Settings, label: "Configurações", href: "#", badge: "5" },
    { icon: LogOut, label: "Sair", href: "#", badge: "6" },
  ];

  const sidebarClasses = isMobile
    ? `fixed inset-y-0 left-0 z-50 bg-gray-800 dark:bg-gray-900 text-white transition-transform duration-300 ease-in-out w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
    : `fixed inset-y-0 left-0 bg-gray-800 dark:bg-gray-900 text-white transition-all duration-300 ease-in-out z-30 ${isOpen ? "w-64" : "w-16"}`;

  // Fechar sidebar ao clicar em um item no mobile
  const handleItemClick = () => {
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <>
      {isMobile && isOpen && (
        <button
          type="button"
          className="bg-opacity-50 fixed inset-0 z-40 w-full h-full bg-black border-none"
          onClick={onToggle}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
              onToggle();
            }
          }}
          aria-label="Fechar menu"
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <h2
              className={`text-2xl font-bold transition-opacity duration-300 ${isOpen ? "opacity-100" : "w-0 opacity-0"}`}
            >
              PDV Menu
            </h2>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="hover:bg-gray-700 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>

          <nav className="flex-1 px-2">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === 0;
                const itemKey = `${item.label}-${item.href}-${index}`;

                return (
                  <li key={itemKey}>
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        onClick={handleItemClick}
                        className={`w-full ${isOpen ? "justify-start" : "justify-center"} ${
                          isActive
                            ? "bg-primary-600 hover:bg-primary-700 text-white"
                            : "hover:bg-gray-700 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="relative">
                          <Icon className={`h-5 w-5 ${isOpen ? "mr-3" : ""}`} />
                          {!isOpen && (
                            <span className="bg-primary-500 absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span
                          className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "w-0 opacity-0"}`}
                        >
                          {item.label}
                        </span>
                      </Button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
