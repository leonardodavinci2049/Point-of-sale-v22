"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/app/pdv/layout-page/header";
import Sidebar from "@/app/pdv/layout-page/sidebar";

interface PDVLayoutProps {
  children: React.ReactNode;
  onOpenBudgets: () => void;
}

/**
 * Layout wrapper for PDV with sidebar and header
 * Manages sidebar state and responsive behavior
 */
export function PDVLayout({ children, onOpenBudgets }: PDVLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Screen size detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-neutral-100 dark:bg-neutral-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
          !isMobile && isSidebarOpen ? "lg:ml-64" : !isMobile ? "lg:ml-16" : ""
        }`}
      >
        <Header
          sellerName="João Silva"
          onMenuToggle={toggleSidebar}
          onOpenBudgets={onOpenBudgets}
        />

        {children}
      </div>
    </div>
  );
}
