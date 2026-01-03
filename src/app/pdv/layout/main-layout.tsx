"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import CustomerPanel from "@/app/pdv/components/customer/customer-panel";
import SearchCustomerModal from "@/app/pdv/components/search/search-customer-modal";
import Header from "@/app/pdv/layout/header";
import Sidebar from "@/app/pdv/layout/sidebar";
import AddCustomerModal from "@/components/pdv/add-customer-modal";
import BudgetModal from "@/components/pdv/budget-modal";
import CartList from "@/components/pdv/cart-list";
import DiscountModal from "@/components/pdv/discount-modal";
import PaymentMethods from "@/components/pdv/payment-methods";
import SearchProductModal from "@/components/pdv/search-product-modal";
import TotalsPanel from "@/components/pdv/totals-panel";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/data/mock-customers";
import type { Product } from "@/data/mock-products";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useOrderPersistence } from "@/hooks/useOrderPersistence";
import { type Budget, generateBudgetId } from "@/types/budget";
import type { OrderItem } from "@/types/order";
import { BudgetStorage } from "@/utils/budget-storage";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Hook para detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      // Sidebar sempre inicia fechado (contraído)
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Hook de persistência
  const { saveCart, loadCart, clearCart } = useOrderPersistence();

  const [isSearchCustomerModalOpen, setIsSearchCustomerModalOpen] =
    useState(false);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isSearchProductModalOpen, setIsSearchProductModalOpen] =
    useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [isBudgetsModalOpen, setIsBudgetsModalOpen] = useState(false);
  const [discountType, setDiscountType] = useState<
    "percentage" | "fixed" | null
  >(null);
  const [discountValue, setDiscountValue] = useState<number>(0);

  const handleSearchCustomer = () => {
    setIsSearchCustomerModalOpen(true);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    toast.success(`Cliente ${customer.name} selecionado.`);
  };

  const handleAddCustomer = () => {
    setIsAddCustomerModalOpen(true);
  };

  const handleAddNewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  const handleAddProduct = () => {
    setIsSearchProductModalOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    const existingItem = cartItems.find(
      (item) => item.productId === product.id,
    );

    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                subtotal: (item.quantity + 1) * item.unitPrice,
              }
            : item,
        ),
      );
      toast.success(`Quantidade de ${product.name} atualizada.`);
    } else {
      const newItem: OrderItem = {
        productId: product.id,
        name: product.name,
        image: product.image,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price,
        variant: product.variants
          ? {
              size: product.variants.size?.[0],
              color: product.variants.color?.[0],
            }
          : undefined,
      };
      setCartItems((prevItems) => [...prevItems, newItem]);
      toast.success(`Produto ${product.name} adicionado ao carrinho.`);
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: quantity,
                  subtotal: quantity * item.unitPrice,
                }
              : item,
          )
          .filter((item) => item.quantity > 0), // Remove if quantity becomes 0 or less
    );
    toast.info("Quantidade do item atualizada.");
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId),
    );
    toast.warning("Item removido do carrinho.");
  };

  const handleSelectPaymentMethod = (method: string) => {
    toast.info(`Forma de pagamento selecionada: ${method}`);
    // Lógica para gerenciar a forma de pagamento
  };

  const handleFinalizeSale = () => {
    if (cartItems.length === 0) {
      toast.error("Não é possível finalizar uma venda sem itens no carrinho.");
      return;
    }
    if (!selectedCustomer) {
      toast.error("Selecione um cliente para finalizar a venda.");
      return;
    }
    toast.success("Venda finalizada com sucesso!");
    // Limpar carrinho e persistência
    setCartItems([]);
    setSelectedCustomer(null);
    setDiscountType(null);
    setDiscountValue(0);
    clearCart();
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

  const calculateDiscount = () => {
    if (!discountType || discountValue === 0) return 0;
    if (discountType === "percentage") {
      return (subtotal * discountValue) / 100;
    }
    return discountValue;
  };

  const discount = calculateDiscount();
  const shipping = 0; // Implementar lógica de frete
  const total = subtotal - discount + shipping;

  const handleApplyDiscount = (type: "percentage" | "fixed", value: number) => {
    setDiscountType(type);
    setDiscountValue(value);
    toast.success(
      `Desconto de ${type === "percentage" ? `${value}%` : `R$ ${value.toFixed(2)}`} aplicado.`,
    );
  };

  const handleOpenDiscountModal = () => {
    if (cartItems.length === 0) {
      toast.error("Adicione itens ao carrinho antes de aplicar desconto.");
      return;
    }
    setIsDiscountModalOpen(true);
  };

  const handleCloseAllModals = () => {
    setIsSearchCustomerModalOpen(false);
    setIsAddCustomerModalOpen(false);
    setIsSearchProductModalOpen(false);
    setIsDiscountModalOpen(false);
  };

  const handleSaveBudget = () => {
    if (cartItems.length === 0) {
      toast.error("Não há itens no carrinho para salvar.");
      return;
    }

    const budget: Budget = {
      id: generateBudgetId(),
      date: new Date(),
      customer: selectedCustomer,
      items: cartItems,
      discount: {
        type: discountType,
        value: discountValue,
      },
      subtotal,
      total,
    };

    BudgetStorage.save(budget);
    toast.success("Orçamento salvo com sucesso!");

    // Limpar carrinho após salvar
    setCartItems([]);
    setSelectedCustomer(null);
    setDiscountType(null);
    setDiscountValue(0);
    clearCart();
  };

  const handleLoadBudget = (sale: Budget) => {
    setCartItems(sale.items);
    setSelectedCustomer(sale.customer);
    setDiscountType(sale.discount.type);
    setDiscountValue(sale.discount.value);

    // Remover da lista de pendentes
    BudgetStorage.remove(sale.id);
  };

  const handleOpenBudgets = () => {
    setIsBudgetsModalOpen(true);
  };

  // Carregar carrinho salvo ao inicializar
  useEffect(() => {
    if (!isInitialized) {
      const savedCart = loadCart();
      if (savedCart && savedCart.items.length > 0) {
        setCartItems(savedCart.items);
        setSelectedCustomer(savedCart.customer);
        setDiscountType(savedCart.discount.type);
        setDiscountValue(savedCart.discount.value);
        toast.success("Carrinho anterior recuperado!");
      }
      setIsInitialized(true);
    }
  }, [isInitialized, loadCart]);

  // Salvar carrinho automaticamente quando houver mudanças
  useEffect(() => {
    if (isInitialized) {
      saveCart({
        items: cartItems,
        customer: selectedCustomer,
        discount: {
          type: discountType,
          value: discountValue,
        },
      });
    }
  }, [
    cartItems,
    selectedCustomer,
    discountType,
    discountValue,
    isInitialized,
    saveCart,
  ]);

  // Configurar atalhos de teclado
  useKeyboardShortcuts({
    onSearchCustomer: handleSearchCustomer,
    onSearchProduct: handleAddProduct,
    onApplyDiscount: handleOpenDiscountModal,
    onFinalizeSale: handleFinalizeSale,
    onSaveBudget: handleSaveBudget,
    onCloseModal: handleCloseAllModals,
  });

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
          onOpenBudgets={handleOpenBudgets}
        />
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 lg:p-6">
          <div className="grid max-w-full grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <div className="flex min-w-0 flex-col gap-4 lg:col-span-2 lg:gap-6">
              <CustomerPanel
                customer={selectedCustomer}
                onSearchCustomer={handleSearchCustomer}
                onAddCustomer={handleAddCustomer}
              />
              <CartList
                items={cartItems}
                onAddProduct={handleAddProduct}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
              />
            </div>

            <div className="flex min-w-0 flex-col gap-4 lg:col-span-1 lg:gap-6">
              <TotalsPanel
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                total={total}
                onAddDiscount={handleOpenDiscountModal}
              />
              <PaymentMethods
                onSelectPaymentMethod={handleSelectPaymentMethod}
              />
              <Button
                className="mt-auto w-full py-6 text-lg"
                onClick={handleFinalizeSale}
              >
                Finalizar Venda
              </Button>
            </div>
          </div>
        </main>
      </div>
      <SearchCustomerModal
        isOpen={isSearchCustomerModalOpen}
        onClose={() => setIsSearchCustomerModalOpen(false)}
        onSelectCustomer={handleSelectCustomer}
      />
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onClose={() => setIsAddCustomerModalOpen(false)}
        onAddCustomer={handleAddNewCustomer}
      />
      <SearchProductModal
        isOpen={isSearchProductModalOpen}
        onClose={() => setIsSearchProductModalOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
      <DiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => setIsDiscountModalOpen(false)}
        onApplyDiscount={handleApplyDiscount}
        subtotal={subtotal}
      />
      <BudgetModal
        isOpen={isBudgetsModalOpen}
        onClose={() => setIsBudgetsModalOpen(false)}
        onLoadSale={handleLoadBudget}
      />
      <Toaster position="top-right" />
    </div>
  );
}
