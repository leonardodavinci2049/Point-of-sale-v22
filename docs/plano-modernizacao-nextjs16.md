# Plano de Modernização PDV - Next.js 16

**Data:** 03 de Janeiro de 2026  
**Versão do Next.js:** 16.1.1  
**Objetivo:** Modernizar o projeto PDV para arquitetura pronta para produção

---

## Resumo Executivo

Este plano transforma o PDV de uma prova de conceito client-side para uma aplicação híbrida seguindo as melhores práticas do Next.js 16:

- **Server Components** para carregamento de dados
- **Server Actions** para mutações
- **Zustand** para gerenciamento de estado
- **Service Layer** para abstração de dados

---

## Tarefas de Implementação

### Tarefa 1: Configurar Dependências e Estrutura

**Objetivo:** Preparar o projeto com as dependências necessárias e nova estrutura de pastas.

**Ações:**
```bash
pnpm add zustand zod
pnpm add -D vitest @vitest/ui fast-check @testing-library/react
```

**Estrutura de pastas a criar:**
```
src/
├── features/
│   └── pdv/
│       ├── components/
│       ├── stores/
│       ├── actions/
│       └── hooks/
├── lib/
│   └── services/
└── shared/
    └── schemas/
```

---

### Tarefa 2: Implementar Camada de Serviços

**Objetivo:** Criar serviços que abstraem o acesso a dados, facilitando troca de mock por API real.

**Arquivos a criar:**

**`lib/services/product-service.ts`**
```typescript
import { mockProducts } from '@/data/mock-products';
import type { Product } from '@/types/product';

export const ProductService = {
  async getAll(): Promise<Product[]> {
    // Simula delay de API
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts;
  },

  async getById(id: string): Promise<Product | null> {
    const product = mockProducts.find(p => p.id === id);
    return product || null;
  },

  async search(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(lowerQuery)
    );
  },
};
```

**`lib/services/customer-service.ts`**
```typescript
import { mockCustomers } from '@/data/mock-customers';
import type { Customer } from '@/types/customer';

export const CustomerService = {
  async getAll(): Promise<Customer[]> {
    return mockCustomers;
  },

  async search(query: string): Promise<Customer[]> {
    const lowerQuery = query.toLowerCase();
    return mockCustomers.filter(c => 
      c.name.toLowerCase().includes(lowerQuery) ||
      c.phone.includes(query)
    );
  },

  async create(data: Omit<Customer, 'id'>): Promise<Customer> {
    const newCustomer: Customer = {
      ...data,
      id: crypto.randomUUID(),
    };
    // Em produção: salvar no banco
    return newCustomer;
  },
};
```

**`lib/services/budget-service.ts`**
```typescript
import type { Budget } from '@/types/budget';

const STORAGE_KEY = 'pdv:budgets';

export const BudgetService = {
  async getAll(): Promise<Budget[]> {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async save(budget: Budget): Promise<Budget> {
    const budgets = await this.getAll();
    budgets.push(budget);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    return budget;
  },

  async remove(id: string): Promise<void> {
    const budgets = await this.getAll();
    const filtered = budgets.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  },
};
```

---

### Tarefa 3: Implementar Schemas de Validação Zod

**Objetivo:** Criar schemas reutilizáveis para validação de formulários.

**`shared/schemas/customer-schema.ts`**
```typescript
import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos'),
  cpf_cnpj: z.string().optional(),
  type: z.enum(['individual', 'business']).default('individual'),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
```

**`shared/schemas/discount-schema.ts`**
```typescript
import { z } from 'zod';

export const discountSchema = z.object({
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive('Valor deve ser positivo'),
}).refine(
  (data) => data.type !== 'percentage' || data.value <= 100,
  { message: 'Percentual não pode exceder 100%', path: ['value'] }
);

export type DiscountFormData = z.infer<typeof discountSchema>;
```

---

### Tarefa 4: Implementar Zustand Stores

**Objetivo:** Centralizar estado da aplicação em stores otimizadas.

**`features/pdv/stores/cart-store.ts`**
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { OrderItem } from '@/types/order';

interface CartState {
  items: OrderItem[];
  discount: { type: 'percentage' | 'fixed' | null; value: number };
}

interface CartActions {
  addItem: (product: { id: string; name: string; price: number; image?: string }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setDiscount: (type: 'percentage' | 'fixed', value: number) => void;
  clearDiscount: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      items: [],
      discount: { type: null, value: 0 },

      addItem: (product) => set((state) => {
        const existing = state.items.find(i => i.productId === product.id);
        if (existing) {
          return {
            items: state.items.map(i =>
              i.productId === product.id
                ? { ...i, quantity: i.quantity + 1, subtotal: (i.quantity + 1) * i.unitPrice }
                : i
            ),
          };
        }
        return {
          items: [...state.items, {
            productId: product.id,
            name: product.name,
            image: product.image,
            quantity: 1,
            unitPrice: product.price,
            subtotal: product.price,
          }],
        };
      }),

      updateQuantity: (productId, quantity) => set((state) => ({
        items: quantity > 0
          ? state.items.map(i =>
              i.productId === productId
                ? { ...i, quantity, subtotal: quantity * i.unitPrice }
                : i
            )
          : state.items.filter(i => i.productId !== productId),
      })),

      removeItem: (productId) => set((state) => ({
        items: state.items.filter(i => i.productId !== productId),
      })),

      setDiscount: (type, value) => set({ discount: { type, value } }),
      clearDiscount: () => set({ discount: { type: null, value: 0 } }),
      clearCart: () => set({ items: [], discount: { type: null, value: 0 } }),
    }),
    {
      name: 'pdv-cart',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);
```

**`features/pdv/stores/customer-store.ts`**
```typescript
import { create } from 'zustand';
import type { Customer } from '@/types/customer';

interface CustomerState {
  selectedCustomer: Customer | null;
}

interface CustomerActions {
  setCustomer: (customer: Customer | null) => void;
  clearCustomer: () => void;
}

export const useCustomerStore = create<CustomerState & CustomerActions>((set) => ({
  selectedCustomer: null,
  setCustomer: (customer) => set({ selectedCustomer: customer }),
  clearCustomer: () => set({ selectedCustomer: null }),
}));
```

**`features/pdv/stores/modal-store.ts`**
```typescript
import { create } from 'zustand';

interface ModalState {
  searchProduct: boolean;
  searchCustomer: boolean;
  addCustomer: boolean;
  discount: boolean;
  budget: boolean;
}

interface ModalActions {
  openModal: (modal: keyof ModalState) => void;
  closeModal: (modal: keyof ModalState) => void;
  closeAllModals: () => void;
}

const initialState: ModalState = {
  searchProduct: false,
  searchCustomer: false,
  addCustomer: false,
  discount: false,
  budget: false,
};

export const useModalStore = create<ModalState & ModalActions>((set) => ({
  ...initialState,
  openModal: (modal) => set({ [modal]: true }),
  closeModal: (modal) => set({ [modal]: false }),
  closeAllModals: () => set(initialState),
}));
```

---

### Tarefa 5: Criar Tipo ActionResult

**Objetivo:** Padronizar retorno de Server Actions.

**`types/action-result.ts`**
```typescript
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
```

---

### Tarefa 6: Implementar Server Actions

**Objetivo:** Criar actions para mutações no servidor.

**`features/pdv/actions/customer-actions.ts`**
```typescript
'use server';

import { CustomerService } from '@/lib/services/customer-service';
import { customerSchema, type CustomerFormData } from '@/shared/schemas/customer-schema';
import type { ActionResult } from '@/types/action-result';
import type { Customer } from '@/types/customer';

export async function createCustomer(
  formData: CustomerFormData
): Promise<ActionResult<Customer>> {
  const validated = customerSchema.safeParse(formData);
  
  if (!validated.success) {
    return {
      success: false,
      error: validated.error.errors[0].message,
    };
  }

  try {
    const customer = await CustomerService.create(validated.data);
    return { success: true, data: customer };
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao criar cliente. Tente novamente.',
    };
  }
}
```

**`features/pdv/actions/budget-actions.ts`**
```typescript
'use server';

import { BudgetService } from '@/lib/services/budget-service';
import type { ActionResult } from '@/types/action-result';
import type { Budget } from '@/types/budget';

export async function saveBudget(budget: Budget): Promise<ActionResult<Budget>> {
  if (!budget.items || budget.items.length === 0) {
    return { success: false, error: 'Orçamento deve ter pelo menos um item.' };
  }

  try {
    const saved = await BudgetService.save(budget);
    return { success: true, data: saved };
  } catch (error) {
    return { success: false, error: 'Erro ao salvar orçamento.' };
  }
}

export async function removeBudget(id: string): Promise<ActionResult<void>> {
  try {
    await BudgetService.remove(id);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: 'Erro ao remover orçamento.' };
  }
}
```

**`features/pdv/actions/sale-actions.ts`**
```typescript
'use server';

import type { ActionResult } from '@/types/action-result';
import type { OrderItem } from '@/types/order';
import type { Customer } from '@/types/customer';

interface SaleData {
  items: OrderItem[];
  customer: Customer;
  discount: { type: 'percentage' | 'fixed' | null; value: number };
  total: number;
}

interface Sale extends SaleData {
  id: string;
  date: Date;
}

export async function finalizeSale(data: SaleData): Promise<ActionResult<Sale>> {
  if (!data.items || data.items.length === 0) {
    return { success: false, error: 'Venda deve ter pelo menos um item.' };
  }

  if (!data.customer) {
    return { success: false, error: 'Selecione um cliente para finalizar.' };
  }

  try {
    const sale: Sale = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date(),
    };
    // Em produção: salvar no banco
    return { success: true, data: sale };
  } catch (error) {
    return { success: false, error: 'Erro ao finalizar venda.' };
  }
}
```

---

### Tarefa 7: Refatorar Página Principal

**Objetivo:** Converter page.tsx para Server Component que carrega dados.

**`app/page.tsx`**
```typescript
import { ProductService } from '@/lib/services/product-service';
import { CustomerService } from '@/lib/services/customer-service';
import { PDVClient } from '@/features/pdv/components/pdv-client';

export default async function HomePage() {
  // Carregar dados no servidor
  const [products, customers] = await Promise.all([
    ProductService.getAll(),
    CustomerService.getAll(),
  ]);

  return (
    <PDVClient 
      initialProducts={products} 
      initialCustomers={customers} 
    />
  );
}
```

---

### Tarefa 8: Criar PDVClient Component

**Objetivo:** Criar componente client-side que gerencia interatividade.

**`features/pdv/components/pdv-client.tsx`**
```typescript
'use client';

import dynamic from 'next/dynamic';
import { useCartStore } from '../stores/cart-store';
import { useCustomerStore } from '../stores/customer-store';
import { useModalStore } from '../stores/modal-store';
import { usePDVCalculations } from '../hooks/use-pdv-calculations';
import Header from '@/shared/components/layout/header';
import Sidebar from '@/shared/components/layout/sidebar';
import { CartSection } from './cart/cart-section';
import { CustomerSection } from './customer/customer-section';
import { PaymentSection } from './payment/payment-section';
import type { Product } from '@/types/product';
import type { Customer } from '@/types/customer';

// Lazy load modals
const SearchProductModal = dynamic(() => import('./modals/search-product-modal'));
const SearchCustomerModal = dynamic(() => import('./modals/search-customer-modal'));
const AddCustomerModal = dynamic(() => import('./modals/add-customer-modal'));
const DiscountModal = dynamic(() => import('./modals/discount-modal'));
const BudgetModal = dynamic(() => import('./modals/budget-modal'));

interface PDVClientProps {
  initialProducts: Product[];
  initialCustomers: Customer[];
}

export function PDVClient({ initialProducts, initialCustomers }: PDVClientProps) {
  const modals = useModalStore();
  const { subtotal, discount, total } = usePDVCalculations();

  return (
    <div className="flex min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header onOpenBudgets={() => modals.openModal('budget')} />
        <main className="flex-1 p-4 lg:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
            <div className="flex flex-col gap-4 lg:col-span-2">
              <CustomerSection customers={initialCustomers} />
              <CartSection products={initialProducts} />
            </div>
            <div className="flex flex-col gap-4">
              <PaymentSection 
                subtotal={subtotal} 
                discount={discount} 
                total={total} 
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals com lazy loading */}
      {modals.searchProduct && (
        <SearchProductModal 
          products={initialProducts}
          onClose={() => modals.closeModal('searchProduct')} 
        />
      )}
      {modals.searchCustomer && (
        <SearchCustomerModal 
          customers={initialCustomers}
          onClose={() => modals.closeModal('searchCustomer')} 
        />
      )}
      {modals.addCustomer && (
        <AddCustomerModal onClose={() => modals.closeModal('addCustomer')} />
      )}
      {modals.discount && (
        <DiscountModal 
          subtotal={subtotal}
          onClose={() => modals.closeModal('discount')} 
        />
      )}
      {modals.budget && (
        <BudgetModal onClose={() => modals.closeModal('budget')} />
      )}
    </div>
  );
}
```

---

### Tarefa 9: Criar Hook de Cálculos

**Objetivo:** Centralizar cálculos com memoização.

**`features/pdv/hooks/use-pdv-calculations.ts`**
```typescript
import { useMemo } from 'react';
import { useCartStore } from '../stores/cart-store';

export function usePDVCalculations() {
  const items = useCartStore((state) => state.items);
  const discountState = useCartStore((state) => state.discount);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.subtotal, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!discountState.type || discountState.value === 0) return 0;
    if (discountState.type === 'percentage') {
      return (subtotal * discountState.value) / 100;
    }
    return discountState.value;
  }, [subtotal, discountState]);

  const total = useMemo(
    () => Math.max(0, subtotal - discount),
    [subtotal, discount]
  );

  return { subtotal, discount, total };
}
```

---

### Tarefa 10: Refatorar Componentes de Seção

**Objetivo:** Dividir MainLayout em componentes menores.

Os componentes CartSection, CustomerSection e PaymentSection devem:
- Usar stores Zustand para estado
- Usar useCallback para handlers
- Ter menos de 150 linhas cada

---

### Tarefa 11: Integrar Modais com Server Actions

**Objetivo:** Conectar modais com validação Zod e Server Actions.

**Exemplo: AddCustomerModal**
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema, type CustomerFormData } from '@/shared/schemas/customer-schema';
import { createCustomer } from '@/features/pdv/actions/customer-actions';
import { useCustomerStore } from '@/features/pdv/stores/customer-store';
import { toast } from 'sonner';

export default function AddCustomerModal({ onClose }: { onClose: () => void }) {
  const setCustomer = useCustomerStore((state) => state.setCustomer);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormData) => {
    const result = await createCustomer(data);
    
    if (result.success) {
      setCustomer(result.data);
      toast.success('Cliente adicionado!');
      onClose();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Campos do formulário com erros de validação */}
    </form>
  );
}
```

---

### Tarefa 12: Limpeza Final

**Objetivo:** Remover código antigo e consolidar estrutura.

**Ações:**
1. Remover `src/components/layout/main-layout.tsx`
2. Mover componentes de `src/components/pdv/` para `src/features/pdv/components/`
3. Mover hooks de `src/hooks/` para `src/features/pdv/hooks/`
4. Remover utils não utilizados
5. Atualizar todos os imports

---

## Checklist de Validação

- [ ] Página carrega dados no servidor (verificar Network tab)
- [ ] Carrinho persiste no localStorage
- [ ] Modais carregam sob demanda (verificar bundle)
- [ ] Validação Zod funciona em formulários
- [ ] Server Actions retornam ActionResult
- [ ] Sem erros de hidratação no console
- [ ] Stores Zustand funcionam corretamente

---

## Próximos Passos (Pós-Modernização)

1. **Integração com API real** - Substituir mocks por chamadas HTTP
2. **Autenticação** - Implementar login com middleware
3. **Cache Components** - Usar `use cache` do Next.js 16
4. **PWA** - Adicionar manifest e service worker
