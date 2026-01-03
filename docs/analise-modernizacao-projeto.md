# Análise de Modernização - PDV System v2

**Data da Análise:** 09 de Outubro de 2025  
**Versão do Projeto:** 0.1.0 (MVP)  
**Objetivo:** Avaliar arquitetura, identificar pontos de melhoria e propor modernizações para garantir escalabilidade

---

## 📋 Sumário Executivo

O projeto **Point of Sale v2** é uma interface de PDV (Ponto de Venda) construída com Next.js 15, React 19 e TypeScript. A análise revela um projeto bem estruturado que utiliza **recursos modernos**, mas com **oportunidades significativas de melhoria** antes de escalar para produção.

### Pontos Fortes ✅
- ✅ Uso do **Next.js 15** (versão mais recente)
- ✅ **React 19** e **React Compiler** (turbopack)
- ✅ **TypeScript** com tipagem consistente
- ✅ **Tailwind CSS v4** (mais recente)
- ✅ Componentes baseados em **Radix UI** (acessibilidade)
- ✅ **Biome** para linting/formatação (mais rápido que ESLint)
- ✅ Estrutura de pastas organizada

### Pontos Críticos de Atenção ⚠️
- ⚠️ **Componentes Client-Side massivos** (MainLayout com 350+ linhas)
- ⚠️ **Falta de Server Components** (tudo é "use client")
- ⚠️ **Estado local não otimizado** (15+ useState no MainLayout)
- ⚠️ **Sem gerenciamento de estado** (Zustand, Jotai, etc.)
- ⚠️ **Sem validação de formulários** (Zod, React Hook Form)
- ⚠️ **localStorage sem SSR safety**
- ⚠️ **Sem API Routes** (preparação para backend)

---

## 🔍 Análise Detalhada por Categoria

### 1. Arquitetura e Estrutura do Next.js

#### ✅ O que está BOM:
```
✓ Next.js 15.5.4 (versão estável mais recente)
✓ App Router (src/app/) - arquitetura moderna
✓ TypeScript configurado corretamente
✓ Turbopack habilitado (--turbopack em dev e build)
```

#### ⚠️ Problemas Identificados:

**1.1. Ausência de Server Components**
```tsx
// src/app/page.tsx - Poderia ser Server Component
import MainLayout from "@/components/layout/main-layout";

export default function HomePage() {
  return <MainLayout />; // ❌ MainLayout é "use client"
}
```

**Impacto:**
- Perda de performance (bundle JavaScript maior)
- Sem streaming SSR
- Sem benefícios de React Server Components (RSC)

**Recomendação:**
```tsx
// ✅ Estrutura recomendada:
// app/page.tsx (Server Component)
export default async function HomePage() {
  // Buscar dados mockados aqui (preparar para API futura)
  const initialProducts = await getProducts();
  const initialCustomers = await getCustomers();
  
  return <PDVClient initialProducts={initialProducts} initialCustomers={initialCustomers} />;
}

// components/pdv/pdv-client.tsx ("use client")
// Apenas o necessário no cliente
```

**1.2. Falta de Layouts Hierárquicos**
```
Estrutura atual:
src/app/
  layout.tsx (Root Layout)
  page.tsx (HomePage)
  
❌ Não há layouts por seção
❌ Não há nested routing
```

**Recomendação:**
```
src/app/
  (dashboard)/          # Route group para dashboard
    layout.tsx          # Layout compartilhado do dashboard
    pdv/
      page.tsx          # /pdv
    vendas/
      page.tsx          # /vendas
    clientes/
      page.tsx          # /clientes
  (auth)/              # Route group para autenticação
    login/
      page.tsx          # /login
```

**1.3. Configuração do Next.js Básica Demais**
```typescript
// next.config.ts atual
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [/* ... */],
  },
}
```

**Recomendação - Adicionar:**
```typescript
const nextConfig: NextConfig = {
  // Performance
  reactStrictMode: true,
  
  // Compilação
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Expermental features do React 19
  experimental: {
    reactCompiler: true, // React Compiler
    ppr: true, // Partial Prerendering
  },
  
  // Otimização de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [/* ... */],
  },
  
  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false };
    }
    return config;
  },
}
```

---

### 2. Gerenciamento de Estado

#### ⚠️ Problema Crítico: Component Bloat

**MainLayout.tsx: 350+ linhas, 15+ useState**
```tsx
// ❌ Estado atual - MUITO PESADO
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const [isMobile, setIsMobile] = useState(false);
const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
const [cartItems, setCartItems] = useState<OrderItem[]>([]);
const [isInitialized, setIsInitialized] = useState(false);
const [isSearchCustomerModalOpen, setIsSearchCustomerModalOpen] = useState(false);
const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
const [isSearchProductModalOpen, setIsSearchProductModalOpen] = useState(false);
const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
const [isBudgetsModalOpen, setIsBudgetsModalOpen] = useState(false);
const [discountType, setDiscountType] = useState<"percentage" | "fixed" | null>(null);
const [discountValue, setDiscountValue] = useState<number>(0);
```

**Impacto:**
- Re-renders excessivos
- Difícil manutenção
- Dificuldade para testar
- Performance ruim em dispositivos móveis

#### ✅ Solução Recomendada: Zustand

**Opção 1: Zustand (Recomendado para PDV)**
```typescript
// lib/stores/pdv-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PDVStore {
  // Cart
  cartItems: OrderItem[];
  addItem: (item: OrderItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  
  // Customer
  selectedCustomer: Customer | null;
  setCustomer: (customer: Customer | null) => void;
  
  // Discount
  discount: { type: 'percentage' | 'fixed' | null; value: number };
  setDiscount: (type: 'percentage' | 'fixed', value: number) => void;
  clearDiscount: () => void;
  
  // Modals
  modals: {
    searchCustomer: boolean;
    addCustomer: boolean;
    searchProduct: boolean;
    discount: boolean;
    budgets: boolean;
  };
  openModal: (modal: keyof PDVStore['modals']) => void;
  closeModal: (modal: keyof PDVStore['modals']) => void;
  closeAllModals: () => void;
}

export const usePDVStore = create<PDVStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      cartItems: [],
      selectedCustomer: null,
      discount: { type: null, value: 0 },
      modals: {
        searchCustomer: false,
        addCustomer: false,
        searchProduct: false,
        discount: false,
        budgets: false,
      },
      
      // Actions
      addItem: (item) => set((state) => ({
        cartItems: [...state.cartItems, item]
      })),
      
      // ... outras actions
    }),
    {
      name: 'pdv-storage',
      partialize: (state) => ({ 
        cartItems: state.cartItems,
        selectedCustomer: state.selectedCustomer,
        discount: state.discount,
      }),
    }
  )
);
```

**Uso no componente:**
```tsx
// ✅ MainLayout simplificado
"use client";

export default function MainLayout() {
  const { cartItems, addItem, selectedCustomer } = usePDVStore();
  
  // Apenas lógica de negócio, sem 15 useState!
}
```

**Opção 2: Jotai (Para projetos menores)**
```typescript
// lib/atoms/pdv-atoms.ts
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const cartItemsAtom = atomWithStorage<OrderItem[]>('cart', []);
export const selectedCustomerAtom = atomWithStorage<Customer | null>('customer', null);
export const discountAtom = atomWithStorage('discount', { type: null, value: 0 });

// Computed atoms
export const subtotalAtom = atom((get) => {
  const items = get(cartItemsAtom);
  return items.reduce((acc, item) => acc + item.subtotal, 0);
});
```

#### 📊 Comparação de Soluções:

| Solução | Prós | Contras | Recomendação |
|---------|------|---------|--------------|
| **Zustand** | ✅ Simples, performático, DevTools | ⚠️ +1 dependência | ⭐ **IDEAL PARA PDV** |
| **Jotai** | ✅ Atômico, granular | ⚠️ Curva de aprendizado | Projetos menores |
| **Redux Toolkit** | ✅ Maduro, DevTools | ❌ Boilerplate, complexo | ❌ Overkill para PDV |
| **Context API** | ✅ Nativo | ❌ Performance ruim | ❌ Não usar para PDV |

---

### 3. Validação e Formulários

#### ⚠️ Problema: Sem validação estruturada

```tsx
// add-customer-modal.tsx - provavelmente algo assim:
const handleSubmit = () => {
  // ❌ Validação manual, inconsistente
  if (!name) {
    toast.error("Nome é obrigatório");
    return;
  }
  if (!phone) {
    toast.error("Telefone é obrigatório");
    return;
  }
  // ...
}
```

#### ✅ Solução: React Hook Form + Zod

**Instalação:**
```bash
pnpm add react-hook-form zod @hookform/resolvers
```

**Implementação:**
```typescript
// lib/schemas/customer-schema.ts
import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().regex(/^\(\d{2}\) 9\d{4}-\d{4}$/, 'Telefone inválido'),
  cpf_cnpj: z.string().optional(),
  type: z.enum(['individual', 'business']),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
```

```tsx
// components/pdv/add-customer-modal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type CustomerFormData } from '@/lib/schemas/customer-schema';

export default function AddCustomerModal() {
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });
  
  const onSubmit = (data: CustomerFormData) => {
    // ✅ Dados já validados!
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input {...register('phone')} />
      {errors.phone && <span>{errors.phone.message}</span>}
      
      <button type="submit">Salvar</button>
    </form>
  );
}
```

**Benefícios:**
- ✅ Validação tipada e reutilizável
- ✅ Mensagens de erro consistentes
- ✅ Performance (re-renders otimizados)
- ✅ Fácil testar schemas isoladamente

---

### 4. Persistência de Dados

#### ⚠️ Problemas Atuais:

**4.1. localStorage sem SSR Safety**
```typescript
// lib/utils/storage.ts
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  // ❌ Vai quebrar no servidor (SSR)
  const item = localStorage.getItem(key);
  // ...
}
```

**4.2. Sem migração de dados**
```typescript
// ❌ Se a estrutura mudar, dados antigos quebram
const savedCart = localStorage.getItem('pdv:cart');
```

#### ✅ Soluções Recomendadas:

**Opção 1: Zustand com Persist (Recomendado)**
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const usePDVStore = create<PDVStore>()(
  persist(
    (set, get) => ({
      // Estado
    }),
    {
      name: 'pdv-storage',
      storage: createJSONStorage(() => localStorage), // SSR-safe
      version: 1, // ✅ Versioning
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Migração de v0 para v1
          return {
            ...persistedState,
            newField: 'default',
          };
        }
        return persistedState;
      },
    }
  )
);
```

**Opção 2: Custom Hook SSR-Safe**
```typescript
// lib/hooks/use-local-storage.ts
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // ✅ State inicializa com valor padrão (SSR-safe)
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key]);
  
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isClient) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue, isClient] as const;
}
```

**Opção 3: IndexedDB para grandes volumes (Futuro)**
```bash
pnpm add dexie dexie-react-hooks
```

```typescript
// lib/db/pdv-db.ts
import Dexie, { Table } from 'dexie';

interface Order {
  id: string;
  date: Date;
  items: OrderItem[];
  total: number;
}

class PDVDatabase extends Dexie {
  orders!: Table<Order>;
  customers!: Table<Customer>;
  
  constructor() {
    super('PDVDatabase');
    this.version(1).stores({
      orders: 'id, date, total',
      customers: 'id, name, phone',
    });
  }
}

export const db = new PDVDatabase();
```

---

### 5. Performance e Otimizações

#### ⚠️ Problemas Identificados:

**5.1. Componentes sem Memoization**
```tsx
// MainLayout.tsx
const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
const discount = calculateDiscount(); // ❌ Recalculado a cada render
const total = subtotal - discount + shipping;
```

**5.2. Handlers sem useCallback**
```tsx
// ❌ Nova função criada a cada render
const handleSelectCustomer = (customer: Customer) => {
  setSelectedCustomer(customer);
  toast.success(`Cliente ${customer.name} selecionado.`);
};
```

**5.3. Sem Code Splitting**
```tsx
// ❌ Todos os modais carregam de uma vez
import AddCustomerModal from "@/components/pdv/add-customer-modal";
import BudgetModal from "@/components/pdv/budget-modal";
import SearchCustomerModal from "@/components/pdv/search-customer-modal";
// ...
```

#### ✅ Soluções:

**5.1. Memoization de Cálculos**
```tsx
import { useMemo } from 'react';

// ✅ Só recalcula quando cartItems muda
const subtotal = useMemo(
  () => cartItems.reduce((acc, item) => acc + item.subtotal, 0),
  [cartItems]
);

const discount = useMemo(
  () => calculateDiscount(subtotal, discountType, discountValue),
  [subtotal, discountType, discountValue]
);

const total = useMemo(
  () => subtotal - discount + shipping,
  [subtotal, discount, shipping]
);
```

**5.2. useCallback para Handlers**
```tsx
import { useCallback } from 'react';

const handleSelectCustomer = useCallback((customer: Customer) => {
  setSelectedCustomer(customer);
  toast.success(`Cliente ${customer.name} selecionado.`);
}, []); // ✅ Função estável
```

**5.3. Lazy Loading de Modais**
```tsx
import dynamic from 'next/dynamic';

// ✅ Carrega apenas quando necessário
const AddCustomerModal = dynamic(() => import('@/components/pdv/add-customer-modal'));
const BudgetModal = dynamic(() => import('@/components/pdv/budget-modal'));
const SearchCustomerModal = dynamic(() => import('@/components/pdv/search-customer-modal'));
```

**5.4. React 19 - useTransition para operações pesadas**
```tsx
import { useTransition } from 'react';

const [isPending, startTransition] = useTransition();

const handleSearch = (query: string) => {
  startTransition(() => {
    // ✅ Operação pesada não bloqueia a UI
    const results = searchProducts(query);
    setSearchResults(results);
  });
};
```

---

### 6. TypeScript e Tipagem

#### ✅ O que está BOM:
- TypeScript 5.x configurado
- Interfaces bem definidas
- Uso de `type` para unions

#### ⚠️ Pode Melhorar:

**6.1. Falta de Utility Types**
```typescript
// ❌ Duplicação de código
interface CustomerFormData {
  name: string;
  email?: string;
  phone: string;
  // ... mesmos campos de Customer
}
```

**Recomendação:**
```typescript
// ✅ Reutilizar tipos
type CustomerFormData = Omit<Customer, 'id' | 'createdAt' | 'avatar'>;
type CustomerUpdateData = Partial<CustomerFormData>;
type CustomerCreateData = Required<Pick<Customer, 'name' | 'phone'>>;
```

**6.2. Enums vs Union Types**
```typescript
// ❌ Atualmente
type DiscountType = "percentage" | "fixed" | null;

// ✅ Considerar enums para melhor autocompletar
enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

// Ou const assertions
const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;

type DiscountType = typeof DISCOUNT_TYPES[keyof typeof DISCOUNT_TYPES];
```

**6.3. Branded Types para IDs**
```typescript
// lib/types/branded.ts
declare const brand: unique symbol;
type Brand<T, TBrand> = T & { [brand]: TBrand };

export type ProductId = Brand<string, 'ProductId'>;
export type CustomerId = Brand<string, 'CustomerId'>;
export type OrderId = Brand<string, 'OrderId'>;

// Uso
function getProduct(id: ProductId) {
  // ✅ Impossível passar CustomerId por engano
}
```

---

### 7. Estrutura de Componentes

#### ⚠️ Problemas:

**7.1. MainLayout é um "God Component"**
- 350+ linhas
- 15+ estados
- 20+ funções
- Múltiplas responsabilidades

**7.2. Falta de Composition**
```tsx
// ❌ Tudo em um componente
<MainLayout>
  {/* 350 linhas de lógica */}
</MainLayout>
```

#### ✅ Solução: Atomic Design + Feature-Based Structure

**Nova Estrutura Recomendada:**
```
src/
  features/                    # ✅ Organização por feature
    pdv/
      components/
        cart/
          cart-list.tsx
          cart-item.tsx
          cart-summary.tsx
        customer/
          customer-panel.tsx
          customer-selector.tsx
        modals/
          search-product-modal.tsx
          add-customer-modal.tsx
      hooks/
        use-cart.ts
        use-customer.ts
      stores/
        pdv-store.ts
      utils/
        calculations.ts
    vendas/
      components/
      hooks/
    clientes/
      components/
      hooks/
  shared/                      # ✅ Código compartilhado
    components/
      ui/                      # Componentes base (shadcn)
      layout/                  # Layouts compartilhados
    hooks/
      use-media-query.ts
      use-local-storage.ts
    utils/
      cn.ts
      format.ts
```

**Exemplo de Refatoração:**
```tsx
// ❌ Antes: MainLayout (350 linhas)
export default function MainLayout() {
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  // ... 15 states
  // ... 20 funções
  return (/* 200 linhas de JSX */);
}

// ✅ Depois: Composição
export default function PDVPage() {
  return (
    <PDVProvider> {/* Context ou Zustand */}
      <PDVLayout>
        <PDVSidebar />
        <PDVMain>
          <CustomerSection />
          <CartSection />
          <PaymentSection />
        </PDVMain>
      </PDVLayout>
    </PDVProvider>
  );
}

// Cada componente tem ~50-100 linhas, única responsabilidade
```

---

### 8. Preparação para Backend

#### ⚠️ Problema: Dados mockados misturados com lógica

```tsx
// ❌ Dados mockados importados direto nos componentes
import { mockProducts } from '@/data/mock-products';
import { mockCustomers } from '@/data/mock-customers';
```

#### ✅ Solução: Camada de Serviços

**Estrutura Recomendada:**
```
src/
  lib/
    api/                       # ✅ Camada de API
      client.ts                # Fetch wrapper
      services/
        products.service.ts
        customers.service.ts
        orders.service.ts
```

**Implementação:**
```typescript
// lib/api/client.ts
class APIClient {
  private baseURL: string;
  
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }
  
  async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`);
    if (!res.ok) throw new Error('API Error');
    return res.json();
  }
  
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const res = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('API Error');
    return res.json();
  }
  
  // ... put, delete
}

export const apiClient = new APIClient();
```

```typescript
// lib/api/services/products.service.ts
import { apiClient } from '../client';
import { mockProducts } from '@/data/mock-products'; // Fallback

export class ProductsService {
  private static USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';
  
  static async getProducts(): Promise<Product[]> {
    if (this.USE_MOCK) {
      // ✅ Mock para desenvolvimento
      return Promise.resolve(mockProducts);
    }
    // ✅ API real em produção
    return apiClient.get<Product[]>('/products');
  }
  
  static async getProductById(id: string): Promise<Product> {
    if (this.USE_MOCK) {
      const product = mockProducts.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return Promise.resolve(product);
    }
    return apiClient.get<Product>(`/products/${id}`);
  }
  
  static async searchProducts(query: string): Promise<Product[]> {
    if (this.USE_MOCK) {
      return Promise.resolve(
        mockProducts.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
    return apiClient.get<Product[]>(`/products/search?q=${query}`);
  }
}
```

**Uso no componente:**
```tsx
// ✅ Uso consistente, fácil trocar mock por API real
import { ProductsService } from '@/lib/api/services/products.service';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    ProductsService.getProducts().then(setProducts);
  }, []);
  
  // ...
}
```

**Next.js API Routes (preparação):**
```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // ✅ Futuramente conectar com backend real
  // const products = await db.products.findMany();
  
  // Por enquanto, retorna mock
  return NextResponse.json(mockProducts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Validar com Zod
  // Salvar no banco
  return NextResponse.json({ success: true });
}
```

---


### 10. Acessibilidade (A11y)

#### ✅ O que está BOM:
- Radix UI (acessível por padrão)
- Semantic HTML em alguns lugares

#### ⚠️ Pode Melhorar:

**10.1. Falta de ARIA labels**
```tsx
// ❌ Botão sem label acessível
<Button onClick={handleRemove}>
  <Trash2 />
</Button>

// ✅ Com aria-label
<Button onClick={handleRemove} aria-label="Remover item do carrinho">
  <Trash2 />
</Button>
```

**10.2. Atalhos de teclado não documentados**
```tsx
// ✅ Adicionar help modal
<KeyboardShortcutsHelp />

// Documentar:
// F2 - Buscar cliente
// F3 - Adicionar produto
// F4 - Aplicar desconto
// F5 - Finalizar venda
```

**10.3. Sem skip links**
```tsx
// app/layout.tsx
<body>
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Pular para conteúdo principal
  </a>
  <main id="main-content">
    {children}
  </main>
</body>
```

**10.4. Contraste de cores**
- Verificar com ferramenta: https://webaim.org/resources/contrastchecker/
- Tailwind: usar escala de cores acessível

---



```typescript
// app/layout.tsx
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'PDV System - Ponto de Venda Moderno',
    template: '%s | PDV System',
  },
  description: 'Sistema completo de Ponto de Venda com gestão de clientes, produtos e vendas',
  keywords: ['PDV', 'Ponto de Venda', 'Gestão', 'Vendas', 'E-commerce'],
  authors: [{ name: 'Sua Empresa' }],
  creator: 'Sua Empresa',
  publisher: 'Sua Empresa',
  applicationName: 'PDV System',
  generator: 'Next.js',
  metadataBase: new URL('https://seu-dominio.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: false, // ❗ PDV não deve ser indexado
    follow: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // ❗ Impedir zoom em PDV
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};
```

**PWA Manifest (manifest.json):**
```json
{
  "name": "PDV System",
  "short_name": "PDV",
  "description": "Sistema de Ponto de Venda",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### 12. Segurança

#### ⚠️ Pontos de Atenção:

**12.1. Dados sensíveis no localStorage**
```typescript
// ❌ Cliente com CPF no localStorage (sem criptografia)
localStorage.setItem('customer', JSON.stringify(customer));
```

**Recomendação:**
- Não armazenar CPF/CNPJ completo no cliente
- Usar hash ou ID
- Implementar criptografia para dados sensíveis

**12.2. Sem autenticação**
```typescript
// app/layout.tsx
// ❌ Qualquer um acessa o PDV
```

**Recomendação:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/pdv/:path*', '/vendas/:path*', '/clientes/:path*'],
};
```

**12.3. CSP (Content Security Policy)**
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' data: https:; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

---

### 13. Monitoramento e Observabilidade

#### ⚠️ Problema: Sem monitoramento

**Recomendações:**

**13.1. Error Boundary**
```tsx
// components/error-boundary.tsx
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // ✅ Enviar para Sentry, LogRocket, etc.
    console.error('Error caught:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Algo deu errado.</h1>;
    }
    
    return this.props.children;
  }
}
```

**13.2. Logging Estruturado**
```typescript
// lib/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }
  
  private log(level: LogLevel, message: string, data?: unknown) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      context: this.context,
      message,
      data,
    };
    
    // ✅ Produção: enviar para serviço (Datadog, New Relic)
    if (process.env.NODE_ENV === 'production') {
      // sendToLoggingService(logData);
    }
    
    console[level](JSON.stringify(logData));
  }
  
  debug(message: string, data?: unknown) {
    this.log('debug', message, data);
  }
  
  info(message: string, data?: unknown) {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: unknown) {
    this.log('warn', message, data);
  }
  
  error(message: string, data?: unknown) {
    this.log('error', message, data);
  }
}

export const logger = (context: string) => new Logger(context);
```

**13.3. Analytics**
```typescript
// lib/analytics.ts
export const analytics = {
  track(event: string, properties?: Record<string, unknown>) {
    // ✅ Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, properties);
    }
  },
  
  page(name: string) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: name,
        page_path: window.location.pathname,
      });
    }
  },
};

// Uso
analytics.track('product_added', { productId: '123', quantity: 2 });
analytics.track('sale_completed', { total: 150.00, items: 3 });
```

---
