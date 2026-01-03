# Implementation Plan: Modernização PDV Next.js 16

## Overview

Este plano implementa a modernização do sistema PDV em etapas incrementais, começando pela infraestrutura (stores, services) e progredindo para refatoração de componentes. Cada tarefa é independente e testável.

## Tasks

- [x] 1. Configurar dependências e estrutura base
  - Instalar Zustand, Zod e dependências de teste
  - Criar estrutura de pastas `features/pdv/`, `lib/services/`, `shared/schemas/`
  - Configurar Vitest com fast-check
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 2. Implementar camada de serviços
  - [x] 2.1 Criar ProductService com getAll, getById, search
    - Mover lógica de mock-products para serviço
    - Retornar Promise para simular async
    - _Requirements: 2.1, 2.2_
  - [x] 2.2 Criar CustomerService com getAll, getById, search, create
    - Mover lógica de mock-customers para serviço
    - _Requirements: 2.1, 2.2_
  - [x] 2.3 Criar BudgetService com getAll, save, remove
    - Mover lógica de budget-storage para serviço
    - _Requirements: 2.1, 2.2_
  - [ ]* 2.4 Escrever teste de propriedade para Service Layer
    - **Property 1: Service Layer Data Format Consistency**
    - **Validates: Requirements 2.1**

- [x] 3. Implementar schemas de validação Zod
  - [x] 3.1 Criar customerSchema em shared/schemas/
    - Validar name (min 3 chars), phone, email opcional
    - Exportar tipo CustomerFormData
    - _Requirements: 8.1_
  - [x] 3.2 Criar discountSchema em shared/schemas/
    - Validar type (percentage/fixed), value positivo
    - Rejeitar percentage > 100
    - _Requirements: 8.2_
  - [ ]* 3.3 Escrever teste de propriedade para schemas Zod
    - **Property 8: Zod Schema Validation**
    - **Validates: Requirements 8.1, 8.2**

- [ ] 4. Checkpoint - Validar infraestrutura base
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implementar Zustand Stores
  - [x] 5.1 Criar Cart Store com persist middleware
    - Estado: items, discount
    - Actions: addItem, updateQuantity, removeItem, setDiscount, clearDiscount, clearCart
    - Persistir no localStorage com versioning
    - _Requirements: 4.1, 4.5, 9.4_
  - [x] 5.2 Criar Customer Store
    - Estado: selectedCustomer
    - Actions: setCustomer, clearCustomer
    - _Requirements: 4.2_
  - [x] 5.3 Criar Modal Store
    - Estado: searchProduct, searchCustomer, addCustomer, discount, budget
    - Actions: openModal, closeModal, closeAllModals
    - _Requirements: 4.4_
  - [ ]* 5.4 Escrever teste de propriedade para Cart Store invariante
    - **Property 5: Cart Store Subtotal Invariant**
    - **Validates: Requirements 4.1**
  - [ ]* 5.5 Escrever teste de propriedade para Store actions
    - **Property 6: Store Actions Consistency**
    - **Validates: Requirements 4.2, 4.3, 4.4**
  - [ ]* 5.6 Escrever teste de propriedade para localStorage round-trip
    - **Property 7: LocalStorage Persistence Round-Trip**
    - **Validates: Requirements 4.5, 4.6**

- [ ] 6. Checkpoint - Validar stores
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implementar tipos e ActionResult
  - [x] 7.1 Criar tipo ActionResult discriminado
    - Definir `{ success: true, data: T } | { success: false, error: string }`
    - Exportar de types/action-result.ts
    - _Requirements: 7.3_
  - [x] 7.2 Atualizar tipos existentes com utility types
    - Criar CustomerFormData usando Omit
    - Criar CustomerUpdateData usando Partial
    - _Requirements: 7.1, 7.2_

- [x] 8. Implementar Server Actions
  - [x] 8.1 Criar createCustomer action
    - Validar com customerSchema
    - Chamar CustomerService.create
    - Retornar ActionResult<Customer>
    - _Requirements: 3.1, 3.4_
  - [x] 8.2 Criar saveBudget action
    - Validar dados do orçamento
    - Chamar BudgetService.save
    - Retornar ActionResult<Budget>
    - _Requirements: 3.2, 3.4_
  - [x] 8.3 Criar finalizeSale action
    - Validar carrinho não vazio e cliente selecionado
    - Processar venda
    - Retornar ActionResult<Sale>
    - _Requirements: 3.3, 3.4_
  - [ ]* 8.4 Escrever teste de propriedade para Server Actions
    - **Property 2: Server Actions Process Valid Data Successfully**
    - **Property 3: Server Actions Return Discriminated Union**
    - **Validates: Requirements 3.1, 3.3, 3.4**
  - [ ]* 8.5 Escrever teste de propriedade para Budget round-trip
    - **Property 4: Budget Save/Load Round-Trip**
    - **Validates: Requirements 3.2**

- [ ] 9. Checkpoint - Validar Server Actions
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Refatorar página principal para Server Component
  - [x] 10.1 Modificar app/page.tsx para Server Component
    - Remover "use client" (já é server por padrão)
    - Buscar dados iniciais via ProductService e CustomerService
    - Passar dados como props para PDVClient
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 10.2 Criar PDVClient como Client Component
    - Receber initialProducts e initialCustomers como props
    - Usar stores Zustand para estado
    - _Requirements: 1.4, 5.2_

- [ ] 11. Refatorar componentes do PDV
  - [ ] 11.1 Criar CartSection usando Cart Store
    - Extrair lógica de carrinho do MainLayout
    - Usar useCartStore para estado
    - Usar useMemo para cálculos
    - _Requirements: 5.1, 5.2, 10.1_
  - [ ] 11.2 Criar CustomerSection usando Customer Store
    - Extrair lógica de cliente do MainLayout
    - Usar useCustomerStore para estado
    - _Requirements: 5.1, 5.2_
  - [ ] 11.3 Criar PaymentSection
    - Extrair lógica de pagamento do MainLayout
    - Integrar com finalizeSale action
    - _Requirements: 5.1_
  - [ ] 11.4 Criar TotalsSection com cálculos memoizados
    - Usar useMemo para subtotal, discount, total
    - Usar useCallback para handlers
    - _Requirements: 10.1, 10.2_

- [ ] 12. Refatorar modais com lazy loading
  - [ ] 12.1 Converter modais para dynamic imports
    - Usar next/dynamic para SearchProductModal
    - Usar next/dynamic para SearchCustomerModal
    - Usar next/dynamic para AddCustomerModal
    - Usar next/dynamic para DiscountModal
    - Usar next/dynamic para BudgetModal
    - _Requirements: 5.4, 10.3_
  - [ ] 12.2 Integrar modais com Modal Store
    - Usar useModalStore para controle de abertura/fechamento
    - _Requirements: 4.4_
  - [ ] 12.3 Integrar AddCustomerModal com Server Action
    - Usar createCustomer action
    - Validar com customerSchema
    - Exibir erros de validação
    - _Requirements: 3.1, 8.1, 8.3_
  - [ ] 12.4 Integrar DiscountModal com validação Zod
    - Validar com discountSchema
    - Exibir erros de validação
    - _Requirements: 8.2, 8.3_

- [ ] 13. Checkpoint - Validar refatoração de componentes
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implementar migração de dados
  - [ ] 14.1 Adicionar versioning ao Cart Store persist
    - Definir version: 1
    - Implementar função migrate
    - _Requirements: 9.4_
  - [ ]* 14.2 Escrever teste de propriedade para migração
    - **Property 9: Data Migration Preservation**
    - **Validates: Requirements 9.4**

- [-] 15. Limpeza e finalização
  - [x] 15.1 Remover MainLayout antigo
    - Substituir por nova estrutura de componentes
    - _Requirements: 5.1_
  - [ ] 15.2 Remover arquivos de utils não utilizados
    - Consolidar em services ou stores
    - _Requirements: 6.1_
  - [ ] 15.3 Atualizar imports em toda a aplicação
    - Usar novos paths de features/
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 16. Checkpoint Final - Validar aplicação completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- A ordem das tarefas garante que dependências são implementadas primeiro
- Stores e Services são implementados antes dos componentes que os utilizam
