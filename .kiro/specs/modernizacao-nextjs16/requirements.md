# Requirements Document

## Introduction

Este documento define os requisitos para modernização do sistema PDV (Point of Sale) v2, transformando-o de uma prova de conceito com dados mockados para uma arquitetura pronta para produção, seguindo as melhores práticas do Next.js 16.

O projeto atual utiliza Next.js 16.1.1, React 19.2.3 e TypeScript, mas apresenta problemas arquiteturais como componentes client-side massivos, ausência de Server Components, estado local não otimizado e falta de preparação para integração com backend real.

## Glossary

- **PDV_System**: Sistema de Ponto de Venda que gerencia vendas, clientes, produtos e orçamentos
- **Server_Component**: Componente React que executa no servidor, reduzindo JavaScript no cliente
- **Client_Component**: Componente React que executa no navegador, necessário para interatividade
- **Server_Action**: Função assíncrona que executa no servidor para mutações de dados
- **Service_Layer**: Camada de serviços que abstrai o acesso a fontes de dados
- **Zustand_Store**: Store de gerenciamento de estado global usando a biblioteca Zustand
- **Cart**: Carrinho de compras contendo itens selecionados para venda
- **Budget**: Orçamento salvo para consulta posterior
- **MainLayout**: Componente principal atual que contém toda a lógica do PDV

## Requirements

### Requirement 1: Arquitetura de Server Components

**User Story:** Como desenvolvedor, quero que a página principal do PDV utilize Server Components para carregar dados iniciais, para que o bundle JavaScript seja menor e a performance inicial seja melhor.

#### Acceptance Criteria

1. WHEN a página do PDV é carregada, THE Server_Component SHALL buscar dados iniciais de produtos e clientes no servidor
2. WHEN dados são carregados no servidor, THE PDV_System SHALL passar os dados como props para componentes client-side
3. THE Server_Component SHALL renderizar o layout base sem diretiva "use client"
4. WHEN interatividade é necessária, THE PDV_System SHALL delegar para Client_Components específicos e menores

### Requirement 2: Camada de Serviços para Acesso a Dados

**User Story:** Como desenvolvedor, quero uma camada de serviços que abstraia o acesso aos dados, para que seja fácil trocar dados mockados por APIs reais no futuro.

#### Acceptance Criteria

1. THE Service_Layer SHALL expor funções assíncronas para buscar produtos, clientes e orçamentos
2. WHEN um serviço é chamado, THE Service_Layer SHALL retornar dados mockados durante desenvolvimento
3. THE Service_Layer SHALL ser importável apenas em Server Components ou Server Actions
4. WHEN a estrutura de dados mudar, THE Service_Layer SHALL manter a interface pública estável

### Requirement 3: Server Actions para Mutações

**User Story:** Como desenvolvedor, quero usar Server Actions para todas as operações de mutação de dados, para que a lógica de negócio execute no servidor de forma segura.

#### Acceptance Criteria

1. WHEN um cliente é adicionado, THE Server_Action SHALL processar a criação no servidor
2. WHEN um orçamento é salvo, THE Server_Action SHALL persistir os dados via serviço
3. WHEN uma venda é finalizada, THE Server_Action SHALL processar a transação no servidor
4. THE Server_Action SHALL retornar resultado de sucesso ou erro para o cliente
5. IF uma Server_Action falhar, THEN THE PDV_System SHALL exibir mensagem de erro apropriada

### Requirement 4: Gerenciamento de Estado com Zustand

**User Story:** Como desenvolvedor, quero centralizar o estado do PDV em stores Zustand, para que o código seja mais organizado e os re-renders sejam otimizados.

#### Acceptance Criteria

1. THE Zustand_Store SHALL gerenciar o estado do carrinho (itens, quantidades, subtotais)
2. THE Zustand_Store SHALL gerenciar o estado do cliente selecionado
3. THE Zustand_Store SHALL gerenciar o estado de descontos aplicados
4. THE Zustand_Store SHALL gerenciar o estado de modais (aberto/fechado)
5. WHEN o estado do carrinho mudar, THE Zustand_Store SHALL persistir automaticamente no localStorage
6. WHEN a página recarregar, THE Zustand_Store SHALL restaurar o estado do localStorage

### Requirement 5: Refatoração do MainLayout

**User Story:** Como desenvolvedor, quero que o MainLayout seja dividido em componentes menores e especializados, para que o código seja mais manutenível e testável.

#### Acceptance Criteria

1. THE PDV_System SHALL dividir o MainLayout em componentes com responsabilidade única
2. WHEN um componente precisar de estado, THE PDV_System SHALL usar hooks do Zustand_Store
3. THE PDV_System SHALL manter cada componente com menos de 150 linhas de código
4. WHEN modais forem necessários, THE PDV_System SHALL usar lazy loading com dynamic imports

### Requirement 6: Estrutura de Pastas por Feature

**User Story:** Como desenvolvedor, quero organizar o código por features ao invés de por tipo de arquivo, para que seja mais fácil encontrar e manter código relacionado.

#### Acceptance Criteria

1. THE PDV_System SHALL organizar código em pasta `features/pdv/` para funcionalidades do PDV
2. THE PDV_System SHALL manter componentes compartilhados em `shared/components/`
3. THE PDV_System SHALL colocar stores Zustand em `features/pdv/stores/`
4. THE PDV_System SHALL colocar Server Actions em `features/pdv/actions/`
5. THE PDV_System SHALL colocar serviços em `lib/services/`

### Requirement 7: Tipagem TypeScript Aprimorada

**User Story:** Como desenvolvedor, quero tipos TypeScript mais robustos e reutilizáveis, para que erros sejam detectados em tempo de compilação.

#### Acceptance Criteria

1. THE PDV_System SHALL usar utility types (Omit, Pick, Partial) para derivar tipos
2. THE PDV_System SHALL definir tipos para todas as respostas de Server Actions
3. THE PDV_System SHALL usar tipos discriminados para estados de loading/error/success
4. WHEN um tipo for compartilhado, THE PDV_System SHALL exportá-lo de arquivo centralizado

### Requirement 8: Validação de Formulários com Zod

**User Story:** Como desenvolvedor, quero validar formulários com schemas Zod, para que a validação seja consistente e tipada.

#### Acceptance Criteria

1. WHEN um cliente for adicionado, THE PDV_System SHALL validar dados com schema Zod
2. WHEN um desconto for aplicado, THE PDV_System SHALL validar valor com schema Zod
3. THE PDV_System SHALL exibir mensagens de erro de validação específicas por campo
4. THE PDV_System SHALL reutilizar schemas entre cliente e servidor

### Requirement 9: Persistência SSR-Safe

**User Story:** Como desenvolvedor, quero que a persistência no localStorage seja segura para SSR, para que não ocorram erros de hidratação.

#### Acceptance Criteria

1. WHEN o Zustand_Store acessar localStorage, THE PDV_System SHALL verificar se está no cliente
2. THE PDV_System SHALL usar middleware persist do Zustand com createJSONStorage
3. WHEN houver diferença entre servidor e cliente, THE PDV_System SHALL hidratar corretamente sem erros
4. THE PDV_System SHALL versionar dados persistidos para permitir migrações futuras

### Requirement 10: Otimização de Performance

**User Story:** Como desenvolvedor, quero que cálculos e handlers sejam otimizados, para que a interface seja responsiva mesmo com muitos itens.

#### Acceptance Criteria

1. WHEN cálculos de totais forem necessários, THE PDV_System SHALL usar useMemo para memoização
2. WHEN handlers forem passados como props, THE PDV_System SHALL usar useCallback para estabilidade
3. WHEN modais forem carregados, THE PDV_System SHALL usar dynamic imports com lazy loading
4. THE PDV_System SHALL evitar re-renders desnecessários usando seletores granulares do Zustand
