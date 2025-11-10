📋 Plano Completo: Manager ZuckZapGo

---

## 📚 Índice de Documentação

**Guias Essenciais de Desenvolvimento:**

- **[CODE_STYLE.md](./CODE_STYLE.md)** - Padrões de código, convenções TypeScript/React, regras de logging
- **[LOGGER_GUIDE.md](./LOGGER_GUIDE.md)** - Sistema de logging nativo Next.js (completo, com exemplos)
- **[ADMIN_PAGES_IMPLEMENTATION.md](./ADMIN_PAGES_IMPLEMENTATION.md)** - Implementação das páginas administrativas
- **[types/README.md](./types/README.md)** - Documentação completa dos tipos TypeScript

**⚠️ LEITURA OBRIGATÓRIA ANTES DE DESENVOLVER:**

1. Leia `CODE_STYLE.md` para entender os padrões do projeto
2. Consulte `LOGGER_GUIDE.md` para usar o sistema de logging corretamente
3. Veja a seção "🔗 API Compatibility Reference" abaixo para integração com a API

---

🎯 Visão Geral

Sistema de gerenciamento web para instâncias WhatsApp do ZuckZapGo com dois níveis de
acesso:

- Admin: Gerencia todas as instâncias (CRUD completo)
- Usuário: Gerencia apenas sua própria instância (sem poder deletar)

Stack Tecnológica:

- Next.js 16 (App Router, SSR, Server Components)
- React 19
- TypeScript
- Tailwind CSS v4 (tema neutral)
- shadcn/ui
- Lucide React (ícones modernos)
- Sonner (toast notifications)
- react-hook-form + zod (validação)
- QRCode.react (exibição de QR)
- **Sistema de Logging Nativo** - Ver [LOGGER_GUIDE.md](./LOGGER_GUIDE.md)

---

📁 Estrutura de Arquivos (~45 arquivos)

/manager-zuckzapgo/
├── app/
│ ├── (auth)/
│ │ └── login/page.tsx # Login unificado Admin/User
│ ├── (admin)/
│ │ ├── layout.tsx # Layout com AdminSidebar
│ │ ├── dashboard/page.tsx # Dashboard com métricas
│ │ └── instances/
│ │ ├── page.tsx # Lista instâncias (DataTable)
│ │ └── [id]/page.tsx # Editar instância (6 tabs)
│ ├── (user)/
│ │ ├── layout.tsx # Layout com UserSidebar
│ │ ├── dashboard/page.tsx # Dashboard da instância
│ │ └── instance/
│ │ ├── connection/page.tsx # Gerenciar conexão/QR
│ │ ├── webhook/page.tsx # Config webhook
│ │ ├── s3/page.tsx # Config S3
│ │ ├── rabbitmq/page.tsx # Config RabbitMQ
│ │ └── settings/page.tsx # Skips e configs
│ ├── actions/auth.ts # Server Actions (login/logout)
│ ├── api/proxy/[...path]/route.ts # Proxy para API Go
│ ├── globals.css # Tema CSS v4
│ ├── layout.tsx # Root layout
│ └── page.tsx # Redirect to login
├── components/
│ ├── ui/ # shadcn components
│ ├── layout/
│ │ ├── admin-sidebar.tsx # Sidebar admin
│ │ ├── user-sidebar.tsx # Sidebar user
│ │ └── header.tsx # Header componente
│ ├── forms/
│ │ ├── instance-form.tsx # Form criar/editar
│ │ ├── webhook-form.tsx # Form webhook
│ │ ├── s3-form.tsx # Form S3
│ │ └── rabbitmq-form.tsx # Form RabbitMQ
│ └── custom/
│ ├── status-badge.tsx # Badge de status
│ ├── data-table.tsx # TanStack Table
│ ├── qrcode-display.tsx # QR Code display
│ ├── instance-card.tsx # Card de instância
│ ├── form-section.tsx # Wrapper seção
│ └── confirm-dialog.tsx # Dialog confirmação
├── lib/
│ ├── api.ts # Cliente API
│ ├── auth.ts # Helpers auth
│ └── utils.ts # Utilidades
├── types/index.ts # TypeScript types
├── middleware.ts # Route protection
├── .env.local # Env vars
├── next.config.js # Next.js config
├── tailwind.config.ts # Tailwind config
└── package.json # Dependencies

---

🔐 Sistema de Autenticação

Middleware (middleware.ts)

- Proteção de rotas baseada em cookies httpOnly
- Validação de token em cada request
- Redirecionamento automático por role
- Admin não acessa rotas /user
- User não acessa rotas /admin

Login Flow

1.  Usuário seleciona tipo (Admin/User) via Tabs
2.  Insere token no input
3.  Sistema valida contra API:

- Admin: GET /admin/users com Authorization: {token}
- User: GET /session/status com token: {token}

4.  Se válido: cria cookies + redireciona
5.  Se inválido: toast de erro

Server Actions (app/actions/auth.ts)

- loginAction(formData): Valida e autentica
- logoutAction(): Remove cookies e redireciona

---

📱 Páginas Detalhadas

1.  Login (/login)

Componentes: Tabs, Card, Input, Button, Label
Features:

- Toggle Admin/User
- Validação em tempo real
- Loading state no botão
- Toast feedback
- Dark mode support

2.  Dashboard Admin (/admin/dashboard)

Dados exibidos:

- Total de instâncias (card)
- Instâncias conectadas (card)
- Instâncias desconectadas (card)
- Gráfico de status por hora (recharts)
- Lista de instâncias recentes

API: GET /admin/users

3.  Lista de Instâncias (/admin/instances)

Funcionalidades:

- DataTable com colunas: ID, Nome, JID, Status, Token, Avatar, Ações
- Botão "Criar Instância" (abre Dialog)
- Ações: Editar, Deletar (com confirmação)
- Filtro e busca
- Paginação

Dialog Criar:

- Nome (required)
- Webhook URL (optional)
- Events (multiselect)
- Retorna token (mostrar em modal success)

API:

- GET /admin/users (listar)
- POST /admin/users (criar)
- DELETE /admin/users/{id} (deletar)

4.  Editar Instância (/admin/instances/[id])

6 Tabs:

1.  Info Básicas: Nome, Token, JID, Status, Avatar (readonly)
2.  Webhook: URL, Events, Timeout, Retries, Botão testar
3.  S3 Storage: Todos campos S3, Botão testar conexão
4.  RabbitMQ: URL, Exchange, Queue, Events, Botão testar
5.  Skip Configs: 6 switches (media, groups, newsletters, broadcasts, own, calls)
6.  Device Config: Platform, OS, Device info

API: GET /admin/users/{id} + PUTs específicos

5.  Dashboard Usuário (/user/dashboard)

Exibe:

- Card com status da conexão (badge verde/vermelho)
- JID, Nome da instância
- Botões: Ver QR Code, Desconectar
- QR Code (Dialog se não conectado)

API:

- GET /session/status
- GET /session/qr

6.  Conexão (/user/instance/connection)

Seções:

- Status detalhado (connected, jid, paired, device)
- QR Code (auto-refresh 30s)
- Pareamento por telefone (input + código)
- Configurar proxy (URL)
- Ações: Conectar, Desconectar, Logout, Refresh

API:

- GET /session/status
- GET /session/qr
- POST /session/connect
- POST /session/disconnect
- POST /session/logout
- POST /session/pairphone
- POST /session/proxy

7.  Webhook (/user/instance/webhook)

Form:

- Webhook URL
- Events (multiselect: All, Message, MessageEdit, etc.)
- Advanced: Timeout, Max Retries, Retry Delay, Backoff Factor
- Botões: Testar, Salvar, Remover
- Card com status atual + recent calls

API: GET/POST/PUT/DELETE /webhook

8.  S3 Storage (/user/instance/s3)

Form:

- Enable S3 (switch)
- Connection: Endpoint, Region, Bucket
- Credentials: Access Key, Secret Key (password)
- Advanced: Public URL, Path Style, Media Delivery, Retention Days, Disable ACL
- Botões: Testar Conexão, Salvar, Remover

API: GET/POST/DELETE /session/s3/config, POST /session/s3/test

9.  RabbitMQ (/user/instance/rabbitmq)

Form:

- Enable RabbitMQ (switch)
- Connection: RabbitMQ URL
- Exchange: Name, Type
- Queue: Name, Type, Routing Key
- Options: Durable, Auto Delete, Exclusive, No Wait
- Message: Delivery Mode, Events
- Performance: Pool Size, Workers, Buffer, Batch
- Botões: Testar, Salvar, Remover

API: GET/POST/DELETE /session/rabbitmq/config, POST /session/rabbitmq/test

10. Configurações (/user/instance/settings)

3 Tabs:

1.  Filtros: 6 switches (Skip Media, Groups, Newsletters, Broadcasts, Own Messages, Calls)
2.  Chamadas: Auto Reject, Reject Message, Reject Type
3.  Echo API: Switch para habilitar echo de mensagens da API

API: Múltiplos endpoints /session/skip\*/config

---

🎨 Design System

Tema Neutral (Tailwind CSS v4)

--color-background: oklch(100% 0 0)
--color-foreground: oklch(10% 0 0)
--color-primary: oklch(55% 0.15 260)
--radius-lg: 0.75rem

Dark Mode

- Nativo via prefers-color-scheme
- Toggle manual no sidebar
- CSS variables automaticamente ajustadas

Typography

- Font: Inter
- Sizes: 10px a 16px
- Weights: 400, 500, 600

Componentes Base (shadcn/ui)

- Sidebar com colapso
- Card com shadow-md
- Button com rounded-lg
- Input com border neutral
- Badge para status
- Dialog/AlertDialog
- Toast (Sonner)
- Tabs
- Switch
- Select/Combobox

---

🔌 Integração com API

Proxy API (/api/proxy/[...path]/route.ts)

Por quê?

- Evita CORS
- Centraliza autenticação
- Oculta URL backend
- Permite rate limiting

Implementação:

- GET, POST, PUT, DELETE handlers
- Lê cookies auth_token e auth_role
- Adiciona headers corretos (Authorization ou token)
- Forward request para API Go
- Retorna response

Client API (lib/api.ts)

export class ApiClient {
async get<T>(endpoint: string): Promise<T>
async post<T>(endpoint: string, data: any): Promise<T>
async put<T>(endpoint: string, data: any): Promise<T>
async delete<T>(endpoint: string): Promise<T>
}

Mapeamento de Endpoints

Admin:

- GET /admin/users → Lista usuários
- GET /admin/users/{id} → Busca usuário
- POST /admin/users → Cria usuário
- DELETE /admin/users/{id} → Deleta usuário
- GET /admin/global/stats → Estatísticas

User - Session:

- GET /session/status → Status conexão
- GET /session/qr → QR Code
- POST /session/connect → Conectar
- POST /session/disconnect → Desconectar
- POST /session/logout → Logout
- POST /session/pairphone → Parear telefone
- POST /session/proxy → Config proxy

User - Config:

- GET/POST/PUT/DELETE /webhook
- GET/POST/DELETE /session/s3/config
- POST /session/s3/test
- GET/POST/DELETE /session/rabbitmq/config
- POST /session/rabbitmq/test
- GET/POST /session/skip\*/config

---

🧩 Componentes Reutilizáveis

StatusBadge

Badge com indicador de status (verde/vermelho)

QRCodeDisplay

Card com QR Code + botão refresh

DataTable

TanStack Table com sorting, filtering, pagination

InstanceCard

Card resumido com avatar, nome, status, quick actions

FormSection

Wrapper para seções de formulário com título e descrição

ConfirmDialog

AlertDialog reutilizável para confirmações

---

📦 Dependências

{
"name": "manager-zuckzapgo",
"version": "0.1.0",
"private": true,
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "eslint"
},
"dependencies": {
"@tanstack/react-table": "^8.21.3",
"class-variance-authority": "^0.7.1",
"clsx": "^2.1.1",
"lucide-react": "^0.548.0",
"next": "16.0.1",
"qrcode.react": "^4.2.0",
"react": "19.2.0",
"react-dom": "19.2.0",
"react-hook-form": "^7.65.0",
"recharts": "^3.3.0",
"sonner": "^2.0.7",
"tailwind-merge": "^3.3.1",
"zod": "^4.1.12"
},
"devDependencies": {
"@tailwindcss/postcss": "^4",
"@types/node": "^20",
"@types/react": "^19",
"@types/react-dom": "^19",
"eslint": "^9",
"eslint-config-next": "16.0.1",
"tailwindcss": "^4",
"tw-animate-css": "^1.4.0",
"typescript": "^5"
}
}

Use o context7 para buscar as documentaçoes atuais para garantir os dados atuais!

---

🚀 Ordem de Implementação

Fase 1: Setup (30min)

1.  npx create-next-app@latest manager-zuckzapgo
2.  Instalar dependências
3.  npx shadcn@latest init
4.  Configurar Tailwind CSS v4
5.  Criar estrutura de pastas

Leia toda estrutura ja criada base ls -la e tree antes de começar a base

Ja instalados:
Using npm.

Initializing project with template: app-tw

Installing dependencies:

- react
- react-dom
- next

Installing devDependencies:

- typescript
- @types/node
- @types/react
- @types/react-dom
- @tailwindcss/postcss
- tailwindcss
- eslint
- eslint-config-next

❯ npx shadcn@latest init
✔ Preflight checks.
✔ Verifying framework. Found Next.js.
✔ Validating Tailwind CSS config. Found v4.
✔ Validating import alias.
✔ Which color would you like to use as the base color? › Neutral
✔ Writing components.json.
✔ Checking registry.
✔ Updating CSS variables in app/globals.css
✔ Installing dependencies.
✔ Created 1 file:

- lib/utils.ts

Fase 2: Autenticação

1.  middleware.ts
2.  lib/auth.ts
3.  app/actions/auth.ts
4.  app/api/proxy/[...path]/route.ts
5.  app/(auth)/login/page.tsx

Fase 3: Layouts

1.  app/layout.tsx (root)
2.  components/layout/admin-sidebar.tsx
3.  components/layout/user-sidebar.tsx
4.  app/(admin)/layout.tsx
5.  app/(user)/layout.tsx

Fase 4: Componentes UI

1.  StatusBadge, QRCodeDisplay
2.  DataTable, InstanceCard
3.  FormSection, ConfirmDialog
4.  Form components (webhook, s3, rabbitmq)

Fase 5: Admin Pages

1.  app/(admin)/dashboard/page.tsx
2.  app/(admin)/instances/page.tsx (lista + criar + deletar)
3.  app/(admin)/instances/[id]/page.tsx (editar com 6 tabs)

Fase 6: User Pages

1.  app/(user)/dashboard/page.tsx
2.  app/(user)/instance/connection/page.tsx
3.  app/(user)/instance/webhook/page.tsx
4.  app/(user)/instance/s3/page.tsx
5.  app/(user)/instance/rabbitmq/page.tsx
6.  app/(user)/instance/settings/page.tsx

Fase 7: Refinamento

1.  Responsividade mobile
2.  Animações e transições
3.  Loading states
4.  Error handling
5.  Validações

---

✅ Checklist de Requisitos

- ✓ Next.js 16 com App Router e SSR
- ✓ Server Components por padrão
- ✓ Tailwind CSS v4
- ✓ shadcn/ui components
- ✓ Dark mode nativo
- ✓ Toast notifications
- ✓ Responsivo mobile/desktop
- ✓ Idioma português
- ✓ Sem testes E2E
- ✓ Design moderno com ícones lucide-react
- ✓ Tema neutral
- ✓ Tudo arredondado (rounded-lg/xl)
- ✓ Login Admin/User separado
- ✓ Dashboard Admin com métricas
- ✓ CRUD completo de instâncias (Admin)
- ✓ Dashboard User com status
- ✓ Gerenciamento completo da instância (User)
- ✓ User não pode deletar instância
- ✓ Sidebar responsivo com colapso
- ✓ Baseado na API real do ZuckZapGo
- ✓ Documentação atualizada (Context7)

---

🎯 Próximos Passos

Após aprovação, vou implementar na seguinte ordem:

1.  Setup inicial do projeto
2.  Sistema de autenticação
3.  Layouts e sidebars
4.  Componentes reutilizáveis
5.  Páginas Admin
6.  Páginas User
7.  Refinamento

Cada fase é independente e pode ser validada incrementalmente.

📋 Plano Completo de Implementação: Manager ZuckZapGo

## 🎯 Visão Geral

Implementação completa de um sistema de gerenciamento web premium para instâncias WhatsApp do ZuckZapGo, com dois níveis de acesso (Admin/User), design moderno, e deploy otimizado para Docker/AWS.

---

## 📚 Stack Tecnológico Validado

### Core (Versões Confirmadas via Context7)

- **Next.js 16.0.1** - App Router, Server Components, Server Actions
- **React 19.2.0** - Novos hooks, Server Components
- **TypeScript 5** - Type-safety completo
- **Tailwind CSS v4** - Sistema de design OKLCH, dark mode nativo
- **shadcn/ui 3.2.1** - Componentes acessíveis baseados em Radix UI

### Dependências Principais

- **@tanstack/react-table 8.21.3** - DataTables com sorting/filtering/pagination
- **react-hook-form 7.65.0** - Gerenciamento de formulários
- **zod 4.1.12** - Validação de schemas TypeScript-first
- **lucide-react 0.548.0** - Ícones modernos consistentes
- **sonner 2.0.7** - Toast notifications premium
- **recharts 3.3.0** - Gráficos e métricas
- **qrcode.react 4.2.0** - Exibição de QR Codes

### Sistema de Logging

- **Logger Nativo Next.js** (zero dependências) - Sistema completo de logging com:
  - ✅ Cores ANSI para terminal (server-side)
  - ✅ Estilos CSS para browser console (client-side)
  - ✅ 5 níveis: debug, info, success, warn, error
  - ✅ Context-aware (componente, ação, metadata)
  - ✅ TypeScript type-safe
  - ✅ Performance <1ms overhead
  - 📖 **Documentação completa**: [LOGGER_GUIDE.md](./LOGGER_GUIDE.md)

---

## 🎨 Design System Premium (Definido pelo Agente Especialista)

### Características Principais

- **Paleta OKLCH** - Consistência perfeita entre displays
- **Micro-interações** - Animações spring e hover effects sofisticados
- **Glassmorphism sutil** - Cards com backdrop-blur
- **Elevação progressiva** - Sistema de sombras de 6 níveis
- **Dark mode nativo** - Toggle manual com paleta otimizada
- **Acessibilidade WCAG AA** - Contraste, foco visível, ARIA completo

### Tokens de Design

- **Spacing**: Base 4px (0.25rem a 5rem)
- **Radius**: 0.375rem a 1.5rem (arredondamentos suaves)
- **Typography**: Scale 1.25 (12px a 48px)
- **Transitions**: 150ms a 500ms com cubic-bezier otimizado
- **Shadows**: xs a 2xl + glow effects

---

## 📁 Estrutura de Arquivos (~60 arquivos)

### 📋 API Reference File (MANDATORY)

```
../static/api/spec.yml                      # ⚠️ SOURCE OF TRUTH - OpenAPI 3.0.0 Spec (8875 lines)
                                            # ALL types, forms, and API calls MUST match this file
                                            # See "API Compatibility Reference" section above
```

### 🏗️ Manager Application Structure

```
manager-zuckzapgo/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx                    # Login unificado Admin/User
│   ├── (admin)/
│   │   ├── layout.tsx                      # Layout AdminSidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # Dashboard métricas
│   │   └── instances/
│   │       ├── page.tsx                    # Lista DataTable + CRUD
│   │       └── [id]/
│   │           └── page.tsx                # Editor 6 tabs
│   ├── (user)/
│   │   ├── layout.tsx                      # Layout UserSidebar
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # Dashboard instância
│   │   └── instance/
│   │       ├── connection/page.tsx         # QR + Pairing
│   │       ├── webhook/page.tsx            # Config Webhook
│   │       ├── s3/page.tsx                 # Config S3
│   │       ├── rabbitmq/page.tsx           # Config RabbitMQ
│   │       └── settings/page.tsx           # Skips + Configs
│   ├── actions/
│   │   └── auth.ts                         # Server Actions (login/logout)
│   ├── api/
│   │   └── proxy/
│   │       └── [...path]/
│   │           └── route.ts                # Proxy API Go (CORS fix)
│   ├── globals.css                         # Design System + Tema
│   ├── layout.tsx                          # Root Layout
│   └── page.tsx                            # Redirect to /login
├── components/
│   ├── ui/                                 # shadcn components (30+)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── switch.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── admin-sidebar.tsx               # Sidebar colapsável Admin
│   │   ├── user-sidebar.tsx                # Sidebar User
│   │   └── header.tsx                      # Header componente
│   ├── forms/
│   │   ├── instance-form.tsx               # CRUD instância
│   │   ├── webhook-form.tsx                # Form webhook
│   │   ├── s3-form.tsx                     # Form S3
│   │   └── rabbitmq-form.tsx               # Form RabbitMQ
│   └── custom/
│       ├── status-badge.tsx                # Badge conectado/desconectado
│       ├── data-table.tsx                  # TanStack Table wrapper
│       ├── qrcode-display.tsx              # QR Code modal
│       ├── instance-card.tsx               # Card resumido instância
│       ├── metrics-card.tsx                # Card métricas dashboard
│       ├── form-section.tsx                # Section wrapper
│       ├── confirm-dialog.tsx              # Dialog confirmação
│       ├── loading-spinner.tsx             # Spinner premium
│       └── skeleton-loader.tsx             # Skeleton screens
├── lib/
│   ├── api.ts                              # Cliente API (fetch wrapper)
│   ├── auth.ts                             # Helpers autenticação
│   ├── utils.ts                            # cn() + utilidades
│   └── validations.ts                      # Schemas Zod
├── types/
│   └── index.ts                            # TypeScript types (API responses)
├── middleware.ts                           # Route protection + cookies
├── .env.local                              # NEXT_PUBLIC_API_URL
├── components.json                         # shadcn config
├── next.config.ts                          # Next.js config
├── tailwind.config.ts                      # Tailwind v4 config
├── tsconfig.json                           # TypeScript config
├── package.json                            # Dependencies
└── Dockerfile                              # Docker deployment
```

---

## 🔐 Sistema de Autenticação

### Middleware (`middleware.ts`)

- **Proteção de rotas** baseada em cookies httpOnly
- **Validação de token** em cada request
- **Redirecionamento automático** por role (admin/user)
- Admin não acessa `/user/*`, User não acessa `/admin/*`

### Login Flow (Next.js 15 Server Actions)

```typescript
// app/actions/auth.ts
"use server"

import { cookies } from "next/headers"

// app/actions/auth.ts

// app/actions/auth.ts

// app/actions/auth.ts

// app/actions/auth.ts

// app/actions/auth.ts

export async function loginAction(formData: FormData) {
  const token = formData.get("token")
  const role = formData.get("role") // 'admin' | 'user'

  // Validar contra API Go
  const isValid =
    role === "admin" ? await validateAdminToken(token) : await validateUserToken(token)

  if (isValid) {
    const cookieStore = await cookies()
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    })
    cookieStore.set("auth_role", role, { httpOnly: true })
    redirect(role === "admin" ? "/admin/dashboard" : "/user/dashboard")
  }

  return { error: "Token inválido" }
}
```

### Proxy API (`app/api/proxy/[...path]/route.ts`)

**Por quê?**

- Evita CORS issues
- Centraliza autenticação
- Oculta URL backend do cliente
- Permite rate limiting futuro

```typescript
// GET, POST, PUT, DELETE handlers
export async function GET(req: Request, { params }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const role = cookieStore.get("auth_role")?.value

  const headers = {
    ...(role === "admin" ? { Authorization: `${token}` } : { token: token }),
  }

  const response = await fetch(`${process.env.API_URL}/${params.path.join("/")}`, { headers })

  return Response.json(await response.json())
}
```

---

## 🔗 API Compatibility Reference

### ⚠️ MANDATORY: Read This Section FIRST Before Development

Esta seção é a **referência obrigatória** para garantir compatibilidade total entre o frontend Manager ZuckZapGo e a API backend real. **Toda** criação de types, forms, schemas e chamadas de API **DEVE** seguir exatamente as definições do arquivo de especificação oficial.

### 📋 Source of Truth

```
/Users/guilhermejansen/Developer/work/fullstack/zuckzapgo-private/static/api/spec.yml
```

**Hierarquia de Desenvolvimento**:

1. 📄 **spec.yml** → Definição oficial da API (8875 linhas, OpenAPI 3.0.0)
2. 🔷 **TypeScript Types** → Gerados a partir das definições do spec.yml
3. 📝 **Form Schemas (Zod)** → Validação baseada nos request bodies do spec.yml
4. 🌐 **API Calls** → Requests/responses exatamente como especificado

### 🔐 Authentication Schemes

A API utiliza **dois esquemas de autenticação** distintos:

#### 1. **ApiKeyAuth** (User Token)

```yaml
# spec.yml definition
ApiKeyAuth:
  type: apiKey
  in: header
  name: token
```

**Usage**:

- **Endpoints**: Todos os endpoints `/session/*`, `/webhook/*`, `/chat/*`, `/send/*`, `/group/*`, `/user/*`, etc.
- **Header**: `token: {user_token}`
- **Onde obter**: Campo `token` do usuário após criação via `/admin/users`

**TypeScript Example**:

```typescript
// lib/api-client.ts
export async function userApiCall(endpoint: string, token: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      token: token,
      "Content-Type": "application/json",
    },
  })
  return response.json()
}
```

#### 2. **AdminAuth** (Admin Token)

```yaml
# spec.yml definition
AdminAuth:
  type: apiKey
  in: header
  name: Authorization
```

**Usage**:

- **Endpoints**: Todos os endpoints `/admin/*`
- **Header**: `Authorization: {admin_token}`
- **Onde obter**: Variável de ambiente `ZUCKZAPGO_ADMIN_TOKEN` do backend

**TypeScript Example**:

```typescript
// lib/api-client.ts
export async function adminApiCall(endpoint: string, adminToken: string) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `${adminToken}`,
      "Content-Type": "application/json",
    },
  })
  return response.json()
}
```

### 📚 Complete API Endpoint Mapping (47+ Endpoints)

#### 🔧 Admin Endpoints (User Management)

| Endpoint                                 | Method | Auth      | Description           | Request Body                                              | Response                                      |
| ---------------------------------------- | ------ | --------- | --------------------- | --------------------------------------------------------- | --------------------------------------------- |
| `/admin/users`                           | GET    | AdminAuth | List all users        | -                                                         | `{code: int, data: User[], success: bool}`    |
| `/admin/users`                           | POST   | AdminAuth | Create user           | `{name: string, token: string}`                           | `{code: int, data: User, success: bool}`      |
| `/admin/users/{userID}`                  | GET    | AdminAuth | Get user details      | -                                                         | `{code: int, data: User, success: bool}`      |
| `/admin/users/{userID}`                  | PUT    | AdminAuth | Update user           | `{name?: string, webhook?: string, events?: string, ...}` | `{code: int, data: User, success: bool}`      |
| `/admin/users/{userID}`                  | DELETE | AdminAuth | Delete user           | -                                                         | `{code: int, message: string, success: bool}` |
| `/admin/users/{userID}/logout`           | POST   | AdminAuth | Logout user session   | -                                                         | `{code: int, message: string, success: bool}` |
| `/admin/users/{userID}/cache/invalidate` | POST   | AdminAuth | Invalidate user cache | -                                                         | `{code: int, message: string, success: bool}` |

**User Object Definition** (from spec.yml):

```typescript
// types/api.ts
export interface User {
  id: string
  name: string
  token: string
  connected: boolean
  loggedIn: boolean
  jid: string
  webhook: string
  events: string
  skip_media_download: boolean
  skip_groups: boolean
  skip_newsletters: boolean
  skip_broadcasts: boolean
  skip_own_messages: boolean
  skip_calls: boolean
  call_reject_message: string
  call_reject_type: "busy" | "declined" | "unavailable"
  proxy_config: ProxyConfig
  s3_config: S3Config
  rabbitmq_config: RabbitMQConfig
  whatsapp_config: WhatsAppConfig
  echo_api_messages: boolean
}
```

#### 🌐 Admin Global Endpoints (System Configuration)

| Endpoint                 | Method | Auth      | Description                | Request Body                                         | Response                                           |
| ------------------------ | ------ | --------- | -------------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| `/admin/global/webhook`  | GET    | AdminAuth | Get global webhook config  | -                                                    | `{code: int, data: GlobalWebhook, success: bool}`  |
| `/admin/global/webhook`  | POST   | AdminAuth | Set global webhook         | `{url: string, events?: string}`                     | `{code: int, data: GlobalWebhook, success: bool}`  |
| `/admin/global/webhook`  | DELETE | AdminAuth | Delete global webhook      | -                                                    | `{code: int, message: string, success: bool}`      |
| `/admin/global/rabbitmq` | GET    | AdminAuth | Get global RabbitMQ config | -                                                    | `{code: int, data: GlobalRabbitMQ, success: bool}` |
| `/admin/global/rabbitmq` | POST   | AdminAuth | Set global RabbitMQ        | `{rabbitmq_url: string, exchange_name: string, ...}` | `{code: int, data: GlobalRabbitMQ, success: bool}` |
| `/admin/global/rabbitmq` | DELETE | AdminAuth | Delete global RabbitMQ     | -                                                    | `{code: int, message: string, success: bool}`      |
| `/admin/global/test`     | POST   | AdminAuth | Test global systems        | -                                                    | `{code: int, message: string, success: bool}`      |

#### 💀 Admin DLQ Endpoints (Dead Letter Queue)

| Endpoint                            | Method | Auth      | Description           | Query Params               | Response                                                   |
| ----------------------------------- | ------ | --------- | --------------------- | -------------------------- | ---------------------------------------------------------- |
| `/admin/dlq/events`                 | GET    | AdminAuth | List DLQ events       | `userID?, limit?, offset?` | `{code: int, data: DLQEvent[], total: int, success: bool}` |
| `/admin/dlq/events/{eventID}`       | GET    | AdminAuth | Get DLQ event         | -                          | `{code: int, data: DLQEvent, success: bool}`               |
| `/admin/dlq/events/{eventID}/retry` | POST   | AdminAuth | Retry DLQ event       | -                          | `{code: int, message: string, success: bool}`              |
| `/admin/dlq/events/{eventID}`       | DELETE | AdminAuth | Delete DLQ event      | -                          | `{code: int, message: string, success: bool}`              |
| `/admin/dlq/events`                 | POST   | AdminAuth | Retry all DLQ events  | `{userID?: string}`        | `{code: int, message: string, success: bool}`              |
| `/admin/dlq/events`                 | DELETE | AdminAuth | Delete all DLQ events | `{userID?: string}`        | `{code: int, message: string, success: bool}`              |

#### 📡 Session Endpoints (Connection Management)

| Endpoint                  | Method | Auth       | Description           | Request Body                    | Response                                                       |
| ------------------------- | ------ | ---------- | --------------------- | ------------------------------- | -------------------------------------------------------------- |
| `/session/status`         | GET    | ApiKeyAuth | Get connection status | -                               | `{code: int, data: SessionStatus, success: bool}`              |
| `/session/qr`             | GET    | ApiKeyAuth | Get QR code           | -                               | `{code: int, data: {qr: string, timeout: int}, success: bool}` |
| `/session/connect`        | POST   | ApiKeyAuth | Connect session       | -                               | `{code: int, message: string, success: bool}`                  |
| `/session/disconnect`     | POST   | ApiKeyAuth | Disconnect session    | -                               | `{code: int, message: string, success: bool}`                  |
| `/session/logout`         | POST   | ApiKeyAuth | Logout session        | -                               | `{code: int, message: string, success: bool}`                  |
| `/session/pairphone`      | POST   | ApiKeyAuth | Pair with phone       | `{phone: string, code: string}` | `{code: int, message: string, success: bool}`                  |
| `/session/proxy`          | GET    | ApiKeyAuth | Get proxy config      | -                               | `{code: int, data: ProxyConfig, success: bool}`                |
| `/session/proxy`          | POST   | ApiKeyAuth | Set proxy config      | `{proxy_url: string}`           | `{code: int, data: ProxyConfig, success: bool}`                |
| `/session/proxy`          | DELETE | ApiKeyAuth | Delete proxy config   | -                               | `{code: int, message: string, success: bool}`                  |
| `/session/relink`         | POST   | ApiKeyAuth | Relink device         | -                               | `{code: int, message: string, success: bool}`                  |
| `/session/devices`        | GET    | ApiKeyAuth | List paired devices   | -                               | `{code: int, data: Device[], success: bool}`                   |
| `/session/devices/unlink` | POST   | ApiKeyAuth | Unlink device         | `{jid: string}`                 | `{code: int, message: string, success: bool}`                  |

**SessionStatus Object**:

```typescript
export interface SessionStatus {
  connected: boolean
  loggedIn: boolean
  jid: string
  paired: boolean
  device: {
    platform: string
    osVersion: string
    deviceModel: string
    pushName: string
  }
}
```

#### ⚙️ Session Config Endpoints

| Endpoint                   | Method | Auth       | Description         | Request Body                                            | Response                                                      |
| -------------------------- | ------ | ---------- | ------------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| `/session/s3/config`       | GET    | ApiKeyAuth | Get S3 config       | -                                                       | `{code: int, data: S3Config, success: bool}`                  |
| `/session/s3/config`       | POST   | ApiKeyAuth | Set S3 config       | `{endpoint: string, region: string, ...}`               | `{code: int, data: S3Config, success: bool}`                  |
| `/session/s3/config`       | DELETE | ApiKeyAuth | Delete S3 config    | -                                                       | `{code: int, message: string, success: bool}`                 |
| `/session/s3/test`         | POST   | ApiKeyAuth | Test S3 connection  | -                                                       | `{code: int, message: string, success: bool}`                 |
| `/session/rabbitmq/config` | GET    | ApiKeyAuth | Get RabbitMQ config | -                                                       | `{code: int, data: RabbitMQConfig, success: bool}`            |
| `/session/rabbitmq/config` | POST   | ApiKeyAuth | Set RabbitMQ config | `{rabbitmq_url: string, exchange_name: string, ...}`    | `{code: int, data: RabbitMQConfig, success: bool}`            |
| `/session/rabbitmq/config` | DELETE | ApiKeyAuth | Delete RabbitMQ     | -                                                       | `{code: int, message: string, success: bool}`                 |
| `/session/rabbitmq/test`   | POST   | ApiKeyAuth | Test RabbitMQ       | -                                                       | `{code: int, message: string, success: bool}`                 |
| `/session/skip/config`     | GET    | ApiKeyAuth | Get skip config     | -                                                       | `{code: int, data: SkipConfig, success: bool}`                |
| `/session/skip/config`     | POST   | ApiKeyAuth | Set skip config     | `{skip_media_download?: bool, skip_groups?: bool, ...}` | `{code: int, data: SkipConfig, success: bool}`                |
| `/session/echo/config`     | GET    | ApiKeyAuth | Get echo config     | -                                                       | `{code: int, data: {echo_api_messages: bool}, success: bool}` |
| `/session/echo/config`     | POST   | ApiKeyAuth | Set echo config     | `{echo_api_messages: bool}`                             | `{code: int, data: {echo_api_messages: bool}, success: bool}` |

**S3Config Object**:

```typescript
export interface S3Config {
  endpoint: string
  region: string
  bucket: string
  access_key_id: string
  secret_access_key: string
  public_url?: string
  path_style?: boolean
  media_delivery_mode?: "base64" | "url" | "both"
  retention_days?: number
  disable_acl?: boolean
}
```

**RabbitMQConfig Object**:

```typescript
export interface RabbitMQConfig {
  rabbitmq_url: string
  exchange_name: string
  exchange_type: "direct" | "topic" | "fanout" | "headers"
  queue_name: string
  queue_type: "classic" | "quorum" | "stream"
  routing_key?: string
  durable?: boolean
  auto_delete?: boolean
  exclusive?: boolean
  no_wait?: boolean
  delivery_mode?: 1 | 2
  events?: string
}
```

**SkipConfig Object**:

```typescript
export interface SkipConfig {
  skip_media_download: boolean
  skip_groups: boolean
  skip_newsletters: boolean
  skip_broadcasts: boolean
  skip_own_messages: boolean
  skip_calls: boolean
}
```

#### 👤 User Endpoints (Profile & Contacts)

| Endpoint                 | Method | Auth       | Description          | Query Params       | Response                                             |
| ------------------------ | ------ | ---------- | -------------------- | ------------------ | ---------------------------------------------------- |
| `/user/info`             | GET    | ApiKeyAuth | Get my profile       | -                  | `{code: int, data: UserInfo, success: bool}`         |
| `/user/avatar`           | GET    | ApiKeyAuth | Get avatar URL       | `jid: string`      | `{code: int, data: {url: string}, success: bool}`    |
| `/user/contacts`         | GET    | ApiKeyAuth | List contacts        | -                  | `{code: int, data: Contact[], success: bool}`        |
| `/user/photo`            | GET    | ApiKeyAuth | Get profile photo    | `jid: string`      | `{code: int, data: {url: string}, success: bool}`    |
| `/user/updatename`       | POST   | ApiKeyAuth | Update profile name  | `{name: string}`   | `{code: int, message: string, success: bool}`        |
| `/user/status/text`      | GET    | ApiKeyAuth | Get status text      | `jid: string`      | `{code: int, data: {status: string}, success: bool}` |
| `/user/check`            | POST   | ApiKeyAuth | Check if on WhatsApp | `{jids: string[]}` | `{code: int, data: CheckResponse[], success: bool}`  |
| `/user/business/profile` | GET    | ApiKeyAuth | Get business profile | `jid: string`      | `{code: int, data: BusinessProfile, success: bool}`  |

#### 🆔 User LID Endpoints (Link ID Mapping)

| Endpoint                     | Method | Auth       | Description          | Request Body      | Response                                          |
| ---------------------------- | ------ | ---------- | -------------------- | ----------------- | ------------------------------------------------- |
| `/user/lid/map`              | POST   | ApiKeyAuth | Map phone to LID     | `{phone: string}` | `{code: int, data: {lid: string}, success: bool}` |
| `/user/lid/resolve`          | POST   | ApiKeyAuth | Resolve LID to JID   | `{lid: string}`   | `{code: int, data: {jid: string}, success: bool}` |
| `/user/lid/resolve/business` | POST   | ApiKeyAuth | Resolve business LID | `{lid: string}`   | `{code: int, data: {jid: string}, success: bool}` |
| `/user/lid/unmap`            | POST   | ApiKeyAuth | Unmap LID            | `{lid: string}`   | `{code: int, message: string, success: bool}`     |

#### 🔔 Webhook Endpoints

| Endpoint   | Method | Auth       | Description        | Request Body                           | Response                                          |
| ---------- | ------ | ---------- | ------------------ | -------------------------------------- | ------------------------------------------------- |
| `/webhook` | GET    | ApiKeyAuth | Get webhook config | -                                      | `{code: int, data: WebhookConfig, success: bool}` |
| `/webhook` | POST   | ApiKeyAuth | Set webhook        | `{url: string, events?: string}`       | `{code: int, data: WebhookConfig, success: bool}` |
| `/webhook` | PUT    | ApiKeyAuth | Update webhook     | `{url?: string, events?: string, ...}` | `{code: int, data: WebhookConfig, success: bool}` |
| `/webhook` | DELETE | ApiKeyAuth | Delete webhook     | -                                      | `{code: int, message: string, success: bool}`     |

**WebhookConfig Object**:

```typescript
export interface WebhookConfig {
  url: string
  events: string
  timeout?: number
  max_retries?: number
  retry_delay?: number
  backoff_factor?: number
}
```

#### 💬 Chat Endpoints (Messages & Presence)

| Endpoint                   | Method | Auth       | Description        | Query Params                                       | Response                                                            |
| -------------------------- | ------ | ---------- | ------------------ | -------------------------------------------------- | ------------------------------------------------------------------- |
| `/chat/archive`            | POST   | ApiKeyAuth | Archive chat       | `{jid: string, archive: bool}`                     | `{code: int, message: string, success: bool}`                       |
| `/chat/mute`               | POST   | ApiKeyAuth | Mute chat          | `{jid: string, duration: int}`                     | `{code: int, message: string, success: bool}`                       |
| `/chat/unmute`             | POST   | ApiKeyAuth | Unmute chat        | `{jid: string}`                                    | `{code: int, message: string, success: bool}`                       |
| `/chat/pin`                | POST   | ApiKeyAuth | Pin chat           | `{jid: string}`                                    | `{code: int, message: string, success: bool}`                       |
| `/chat/unpin`              | POST   | ApiKeyAuth | Unpin chat         | `{jid: string}`                                    | `{code: int, message: string, success: bool}`                       |
| `/chat/delete`             | POST   | ApiKeyAuth | Delete chat        | `{jid: string}`                                    | `{code: int, message: string, success: bool}`                       |
| `/chat/presence/subscribe` | POST   | ApiKeyAuth | Subscribe presence | `{jid: string}`                                    | `{code: int, message: string, success: bool}`                       |
| `/chat/presence`           | POST   | ApiKeyAuth | Set presence       | `{jid: string, state: string}`                     | `{code: int, message: string, success: bool}`                       |
| `/chat/markread`           | POST   | ApiKeyAuth | Mark as read       | `{jid: string, message_ids: string[]}`             | `{code: int, message: string, success: bool}`                       |
| `/chat/reaction`           | POST   | ApiKeyAuth | Send reaction      | `{jid: string, message_id: string, emoji: string}` | `{code: int, message: string, success: bool}`                       |
| `/chat/message/revoke`     | POST   | ApiKeyAuth | Revoke message     | `{jid: string, message_id: string}`                | `{code: int, message: string, success: bool}`                       |
| `/chat/message/edit`       | POST   | ApiKeyAuth | Edit message       | `{jid: string, message_id: string, text: string}`  | `{code: int, message: string, success: bool}`                       |
| `/chat/download`           | POST   | ApiKeyAuth | Download media     | `{url: string}`                                    | Binary data or `{code: int, data: {base64: string}, success: bool}` |
| `/chat/typing`             | POST   | ApiKeyAuth | Send typing state  | `{jid: string, state: "composing"\|"paused"}`      | `{code: int, message: string, success: bool}`                       |

#### 📤 Send Endpoints (Message Types)

| Endpoint         | Method | Auth       | Description         | Request Body                                                            | Response                                         |
| ---------------- | ------ | ---------- | ------------------- | ----------------------------------------------------------------------- | ------------------------------------------------ |
| `/send/text`     | POST   | ApiKeyAuth | Send text           | `{jid: string, text: string, quoted_id?: string}`                       | `{code: int, data: SendResponse, success: bool}` |
| `/send/image`    | POST   | ApiKeyAuth | Send image          | `{jid: string, image: string(base64\|url), caption?: string, ...}`      | `{code: int, data: SendResponse, success: bool}` |
| `/send/video`    | POST   | ApiKeyAuth | Send video          | `{jid: string, video: string, caption?: string, ...}`                   | `{code: int, data: SendResponse, success: bool}` |
| `/send/audio`    | POST   | ApiKeyAuth | Send audio          | `{jid: string, audio: string, ptt?: bool}`                              | `{code: int, data: SendResponse, success: bool}` |
| `/send/document` | POST   | ApiKeyAuth | Send document       | `{jid: string, document: string, filename: string, ...}`                | `{code: int, data: SendResponse, success: bool}` |
| `/send/sticker`  | POST   | ApiKeyAuth | Send sticker        | `{jid: string, sticker: string}`                                        | `{code: int, data: SendResponse, success: bool}` |
| `/send/location` | POST   | ApiKeyAuth | Send location       | `{jid: string, latitude: float, longitude: float, name?: string}`       | `{code: int, data: SendResponse, success: bool}` |
| `/send/contact`  | POST   | ApiKeyAuth | Send contact        | `{jid: string, contact: ContactCard}`                                   | `{code: int, data: SendResponse, success: bool}` |
| `/send/poll`     | POST   | ApiKeyAuth | Send poll           | `{jid: string, name: string, options: string[], selectable: int}`       | `{code: int, data: SendResponse, success: bool}` |
| `/send/reaction` | POST   | ApiKeyAuth | Send reaction       | `{jid: string, message_id: string, emoji: string}`                      | `{code: int, message: string, success: bool}`    |
| `/send/buttons`  | POST   | ApiKeyAuth | Send buttons        | `{jid: string, text: string, buttons: Button[], ...}`                   | `{code: int, data: SendResponse, success: bool}` |
| `/send/list`     | POST   | ApiKeyAuth | Send list           | `{jid: string, text: string, button_text: string, sections: Section[]}` | `{code: int, data: SendResponse, success: bool}` |
| `/send/template` | POST   | ApiKeyAuth | Send template       | `{jid: string, template: TemplateMessage}`                              | `{code: int, data: SendResponse, success: bool}` |
| `/send/carousel` | POST   | ApiKeyAuth | Send carousel (ENT) | `{jid: string, cards: CarouselCard[]}`                                  | `{code: int, data: SendResponse, success: bool}` |
| `/send/flow`     | POST   | ApiKeyAuth | Send flow (ENT)     | `{jid: string, flow: FlowMessage}`                                      | `{code: int, data: SendResponse, success: bool}` |

**SendResponse Object**:

```typescript
export interface SendResponse {
  message_id: string
  timestamp: number
  jid: string
}
```

**Button Object**:

```typescript
export interface Button {
  id: string
  displayText: string
  type?: "quick_reply" | "url" | "call"
  url?: string
  phoneNumber?: string
}
```

**Section Object** (for lists):

```typescript
export interface Section {
  title: string
  rows: Row[]
}

export interface Row {
  id: string
  title: string
  description?: string
}
```

#### 🏷️ Label Endpoints

| Endpoint       | Method | Auth       | Description  | Request Body                      | Response                                      |
| -------------- | ------ | ---------- | ------------ | --------------------------------- | --------------------------------------------- |
| `/label/chats` | POST   | ApiKeyAuth | Label chat   | `{jid: string, label_id: string}` | `{code: int, message: string, success: bool}` |
| `/label/chats` | DELETE | ApiKeyAuth | Unlabel chat | `{jid: string, label_id: string}` | `{code: int, message: string, success: bool}` |
| `/label`       | GET    | ApiKeyAuth | List labels  | -                                 | `{code: int, data: Label[], success: bool}`   |

#### 👥 Group Endpoints

| Endpoint                   | Method | Auth       | Description         | Request Body                             | Response                                           |
| -------------------------- | ------ | ---------- | ------------------- | ---------------------------------------- | -------------------------------------------------- |
| `/group/list`              | GET    | ApiKeyAuth | List joined groups  | -                                        | `{code: int, data: GroupInfo[], success: bool}`    |
| `/group/create`            | POST   | ApiKeyAuth | Create group        | `{name: string, participants: string[]}` | `{code: int, data: {jid: string}, success: bool}`  |
| `/group/info`              | GET    | ApiKeyAuth | Get group info      | `jid: string`                            | `{code: int, data: GroupInfo, success: bool}`      |
| `/group/participants`      | POST   | ApiKeyAuth | Add participants    | `{jid: string, participants: string[]}`  | `{code: int, message: string, success: bool}`      |
| `/group/participants`      | DELETE | ApiKeyAuth | Remove participants | `{jid: string, participants: string[]}`  | `{code: int, message: string, success: bool}`      |
| `/group/promote`           | POST   | ApiKeyAuth | Promote to admin    | `{jid: string, participants: string[]}`  | `{code: int, message: string, success: bool}`      |
| `/group/demote`            | POST   | ApiKeyAuth | Demote admin        | `{jid: string, participants: string[]}`  | `{code: int, message: string, success: bool}`      |
| `/group/leave`             | POST   | ApiKeyAuth | Leave group         | `{jid: string}`                          | `{code: int, message: string, success: bool}`      |
| `/group/updatename`        | POST   | ApiKeyAuth | Update group name   | `{jid: string, name: string}`            | `{code: int, message: string, success: bool}`      |
| `/group/updatedescription` | POST   | ApiKeyAuth | Update description  | `{jid: string, description: string}`     | `{code: int, message: string, success: bool}`      |
| `/group/updatephoto`       | POST   | ApiKeyAuth | Update photo        | `{jid: string, image: string}`           | `{code: int, message: string, success: bool}`      |
| `/group/invitelink`        | GET    | ApiKeyAuth | Get invite link     | `jid: string`                            | `{code: int, data: {link: string}, success: bool}` |
| `/group/revokeinvite`      | POST   | ApiKeyAuth | Revoke invite link  | `{jid: string}`                          | `{code: int, data: {link: string}, success: bool}` |

**GroupInfo Object**:

```typescript
export interface GroupInfo {
  jid: string
  name: string
  owner: string
  creation: number
  participants: GroupParticipant[]
  description?: string
  announce?: boolean
  locked?: boolean
  ephemeral?: number
}

export interface GroupParticipant {
  jid: string
  isAdmin: boolean
  isSuperAdmin: boolean
}
```

#### 📢 Newsletter Endpoints

| Endpoint                        | Method | Auth       | Description         | Request Body                                        | Response                                             |
| ------------------------------- | ------ | ---------- | ------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| `/newsletter/list`              | GET    | ApiKeyAuth | List newsletters    | -                                                   | `{code: int, data: NewsletterInfo[], success: bool}` |
| `/newsletter/create`            | POST   | ApiKeyAuth | Create newsletter   | `{name: string, description?: string}`              | `{code: int, data: NewsletterInfo, success: bool}`   |
| `/newsletter/info`              | GET    | ApiKeyAuth | Get newsletter info | `jid: string`                                       | `{code: int, data: NewsletterInfo, success: bool}`   |
| `/newsletter/follow`            | POST   | ApiKeyAuth | Follow newsletter   | `{jid: string}`                                     | `{code: int, message: string, success: bool}`        |
| `/newsletter/unfollow`          | POST   | ApiKeyAuth | Unfollow newsletter | `{jid: string}`                                     | `{code: int, message: string, success: bool}`        |
| `/newsletter/mute`              | POST   | ApiKeyAuth | Mute newsletter     | `{jid: string}`                                     | `{code: int, message: string, success: bool}`        |
| `/newsletter/unmute`            | POST   | ApiKeyAuth | Unmute newsletter   | `{jid: string}`                                     | `{code: int, message: string, success: bool}`        |
| `/newsletter/updatename`        | POST   | ApiKeyAuth | Update name         | `{jid: string, name: string}`                       | `{code: int, message: string, success: bool}`        |
| `/newsletter/updatedescription` | POST   | ApiKeyAuth | Update description  | `{jid: string, description: string}`                | `{code: int, message: string, success: bool}`        |
| `/newsletter/updatephoto`       | POST   | ApiKeyAuth | Update photo        | `{jid: string, image: string}`                      | `{code: int, message: string, success: bool}`        |
| `/newsletter/admins`            | GET    | ApiKeyAuth | List admins         | `jid: string`                                       | `{code: int, data: string[], success: bool}`         |
| `/newsletter/messages`          | GET    | ApiKeyAuth | Get messages        | `jid: string, count?: int`                          | `{code: int, data: Message[], success: bool}`        |
| `/newsletter/react`             | POST   | ApiKeyAuth | React to message    | `{jid: string, message_id: string, emoji: string}`  | `{code: int, message: string, success: bool}`        |
| `/newsletter/send`              | POST   | ApiKeyAuth | Send message        | `{jid: string, text?: string, image?: string, ...}` | `{code: int, data: SendResponse, success: bool}`     |

#### 🏘️ Community Endpoints

| Endpoint                   | Method | Auth       | Description        | Request Body                           | Response                                            |
| -------------------------- | ------ | ---------- | ------------------ | -------------------------------------- | --------------------------------------------------- |
| `/community/list`          | GET    | ApiKeyAuth | List communities   | -                                      | `{code: int, data: CommunityInfo[], success: bool}` |
| `/community/create`        | POST   | ApiKeyAuth | Create community   | `{name: string, description?: string}` | `{code: int, data: CommunityInfo, success: bool}`   |
| `/community/info`          | GET    | ApiKeyAuth | Get community info | `jid: string`                          | `{code: int, data: CommunityInfo, success: bool}`   |
| `/community/groups`        | GET    | ApiKeyAuth | List groups        | `jid: string`                          | `{code: int, data: GroupInfo[], success: bool}`     |
| `/community/groups/link`   | POST   | ApiKeyAuth | Link group         | `{jid: string, group_jid: string}`     | `{code: int, message: string, success: bool}`       |
| `/community/groups/unlink` | POST   | ApiKeyAuth | Unlink group       | `{jid: string, group_jid: string}`     | `{code: int, message: string, success: bool}`       |
| `/community/leave`         | POST   | ApiKeyAuth | Leave community    | `{jid: string}`                        | `{code: int, message: string, success: bool}`       |
| `/community/updatename`    | POST   | ApiKeyAuth | Update name        | `{jid: string, name: string}`          | `{code: int, message: string, success: bool}`       |

#### 🏢 Business Endpoints

| Endpoint            | Method | Auth       | Description          | Query/Body                          | Response                                            |
| ------------------- | ------ | ---------- | -------------------- | ----------------------------------- | --------------------------------------------------- |
| `/business/profile` | GET    | ApiKeyAuth | Get business profile | `jid: string`                       | `{code: int, data: BusinessProfile, success: bool}` |
| `/business/catalog` | GET    | ApiKeyAuth | Get catalog          | `jid: string`                       | `{code: int, data: Product[], success: bool}`       |
| `/business/product` | GET    | ApiKeyAuth | Get product          | `jid: string, product_id: string`   | `{code: int, data: Product, success: bool}`         |
| `/business/order`   | POST   | ApiKeyAuth | Create order         | `{jid: string, items: OrderItem[]}` | `{code: int, data: SendResponse, success: bool}`    |
| `/business/bots`    | GET    | ApiKeyAuth | List bots            | -                                   | `{code: int, data: BotInfo[], success: bool}`       |

#### 📱 Device Endpoints

| Endpoint          | Method | Auth       | Description        | Response                                                             |
| ----------------- | ------ | ---------- | ------------------ | -------------------------------------------------------------------- |
| `/device/info`    | GET    | ApiKeyAuth | Get device info    | `{code: int, data: DeviceInfo, success: bool}`                       |
| `/device/battery` | GET    | ApiKeyAuth | Get battery status | `{code: int, data: {percentage: int, plugged: bool}, success: bool}` |
| `/device/status`  | GET    | ApiKeyAuth | Get device status  | `{code: int, data: SessionStatus, success: bool}`                    |
| `/device/props`   | GET    | ApiKeyAuth | Get device props   | `{code: int, data: DeviceProps, success: bool}`                      |

#### 🔒 Privacy Endpoints

| Endpoint             | Method | Auth       | Description          | Request Body                               | Response                                            |
| -------------------- | ------ | ---------- | -------------------- | ------------------------------------------ | --------------------------------------------------- |
| `/privacy/settings`  | GET    | ApiKeyAuth | Get privacy settings | -                                          | `{code: int, data: PrivacySettings, success: bool}` |
| `/privacy/settings`  | POST   | ApiKeyAuth | Update settings      | `{profile?: string, status?: string, ...}` | `{code: int, data: PrivacySettings, success: bool}` |
| `/privacy/blocklist` | GET    | ApiKeyAuth | Get blocklist        | -                                          | `{code: int, data: string[], success: bool}`        |
| `/privacy/block`     | POST   | ApiKeyAuth | Block contact        | `{jid: string}`                            | `{code: int, message: string, success: bool}`       |
| `/privacy/unblock`   | POST   | ApiKeyAuth | Unblock contact      | `{jid: string}`                            | `{code: int, message: string, success: bool}`       |

#### 📸 Status Endpoints

| Endpoint        | Method | Auth       | Description       | Request Body                          | Response                                         |
| --------------- | ------ | ---------- | ----------------- | ------------------------------------- | ------------------------------------------------ |
| `/status/text`  | POST   | ApiKeyAuth | Post text status  | `{text: string, background?: string}` | `{code: int, data: SendResponse, success: bool}` |
| `/status/image` | POST   | ApiKeyAuth | Post image status | `{image: string, caption?: string}`   | `{code: int, data: SendResponse, success: bool}` |
| `/status/video` | POST   | ApiKeyAuth | Post video status | `{video: string, caption?: string}`   | `{code: int, data: SendResponse, success: bool}` |
| `/status/list`  | GET    | ApiKeyAuth | List statuses     | -                                     | `{code: int, data: Status[], success: bool}`     |

#### 📞 Call Endpoints

| Endpoint       | Method | Auth       | Description           | Request Body                                                | Response                                      |
| -------------- | ------ | ---------- | --------------------- | ----------------------------------------------------------- | --------------------------------------------- |
| `/call/reject` | POST   | ApiKeyAuth | Configure call reject | `{call_reject_message?: string, call_reject_type?: string}` | `{code: int, message: string, success: bool}` |

#### 🔄 Sync Endpoints

| Endpoint         | Method | Auth       | Description    | Request Body                          | Response                                      |
| ---------------- | ------ | ---------- | -------------- | ------------------------------------- | --------------------------------------------- |
| `/sync/appstate` | POST   | ApiKeyAuth | Sync app state | `{name: string, version?: int}`       | `{code: int, message: string, success: bool}` |
| `/sync/history`  | POST   | ApiKeyAuth | Sync history   | `{jid: string, from_timestamp?: int}` | `{code: int, message: string, success: bool}` |
| `/sync/recent`   | POST   | ApiKeyAuth | Sync recent    | -                                     | `{code: int, message: string, success: bool}` |
| `/sync/full`     | POST   | ApiKeyAuth | Full sync      | -                                     | `{code: int, message: string, success: bool}` |

### 🛡️ MANDATORY DEVELOPMENT RULES

#### RULE 1: Type Creation from API Responses

**❌ NEVER DO THIS** (Creating types without checking spec.yml):

```typescript
// types/user.ts - WRONG!
export interface User {
  id: string
  name: string
  connected: boolean
  // Missing 20+ fields from real API!
}
```

**✅ ALWAYS DO THIS** (Match spec.yml exactly):

```typescript
// types/user.ts - CORRECT!
// Source: /static/api/spec.yml - definitions.User
export interface User {
  // Identity
  id: string
  name: string
  token: string

  // Connection Status
  connected: boolean
  loggedIn: boolean
  jid: string

  // Webhook Configuration
  webhook: string
  events: string

  // Skip Filters
  skip_media_download: boolean
  skip_groups: boolean
  skip_newsletters: boolean
  skip_broadcasts: boolean
  skip_own_messages: boolean
  skip_calls: boolean

  // Call Settings
  call_reject_message: string
  call_reject_type: "busy" | "declined" | "unavailable"

  // Nested Configurations
  proxy_config: ProxyConfig
  s3_config: S3Config
  rabbitmq_config: RabbitMQConfig
  whatsapp_config: WhatsAppConfig

  // Echo Configuration
  echo_api_messages: boolean
}

// Always reference spec.yml path in comments
// This ensures future developers know where to verify
```

#### RULE 2: Form Schemas Must Match API Request Bodies

**❌ NEVER DO THIS** (Creating Zod schemas without spec.yml):

```typescript
// lib/schemas.ts - WRONG!
export const createUserSchema = z.object({
  name: z.string(),
  token: z.string(),
  // Missing validation rules from API spec!
})
```

**✅ ALWAYS DO THIS** (Match request body from spec.yml):

```typescript
// lib/schemas.ts - CORRECT!
// Source: /static/api/spec.yml - paths./admin/users.post.parameters
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  token: z
    .string()
    .min(32, "Token must be at least 32 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Token contains invalid characters"),
})

// For updates, match PUT request body:
// Source: /static/api/spec.yml - paths./admin/users/{userID}.put.parameters
export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  webhook: z.string().url().optional(),
  events: z.string().optional(),
  skip_media_download: z.boolean().optional(),
  skip_groups: z.boolean().optional(),
  skip_newsletters: z.boolean().optional(),
  skip_broadcasts: z.boolean().optional(),
  skip_own_messages: z.boolean().optional(),
  skip_calls: z.boolean().optional(),
  call_reject_message: z.string().optional(),
  call_reject_type: z.enum(["busy", "declined", "unavailable"]).optional(),
  echo_api_messages: z.boolean().optional(),
})
```

#### RULE 3: API Proxy Pattern - Standardized API Calling

**❌ NEVER DO THIS** (Direct API calls from client components):

```typescript
// components/user-form.tsx - WRONG!
const handleSubmit = async (data: FormData) => {
  // Security risk: exposing backend URL and token handling
  const response = await fetch("http://backend:8080/admin/users", {
    headers: { Authorization: `${token}` },
  })
}
```

**✅ ALWAYS DO THIS** (Use API Proxy Pattern):

```typescript
// app/api/[...path]/route.ts - API Proxy
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const role = cookieStore.get("auth_role")?.value

  if (!token || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Correct header based on role (from spec.yml)
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(role === "admin"
      ? { Authorization: `${token}` } // AdminAuth
      : { token: token }), // ApiKeyAuth
  }

  try {
    const url = `${process.env.BACKEND_API_URL}/${params.path.join("/")}`
    const response = await fetch(url, { headers })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    return NextResponse.json({ error: "API request failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const role = cookieStore.get("auth_role")?.value

  if (!token || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(role === "admin" ? { Authorization: `${token}` } : { token: token }),
  }

  try {
    const url = `${process.env.BACKEND_API_URL}/${params.path.join("/")}`
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(error, { status: response.status })
    }

    return NextResponse.json(await response.json())
  } catch (error) {
    return NextResponse.json({ error: "API request failed" }, { status: 500 })
  }
}

// Implement PUT, DELETE similarly
```

**Client-side usage**:

```typescript
// lib/api-client.ts - Client helper
export async function apiCall(endpoint: string, options?: RequestInit) {
  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    credentials: "include", // Important for cookie-based auth
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// Usage in components:
const users = await apiCall("admin/users")
const user = await apiCall(`admin/users/${id}`)
await apiCall("admin/users", {
  method: "POST",
  body: JSON.stringify({ name, token }),
})
```

#### RULE 4: Error Handling Standards

**❌ NEVER DO THIS** (Inconsistent error handling):

```typescript
// WRONG - No standard error structure
try {
  await fetch("/api/admin/users")
} catch (e) {
  console.log("Error") // No context!
}
```

**✅ ALWAYS DO THIS** (Match API error structure):

```typescript
// types/api.ts
export interface ApiResponse<T = any> {
  code: number
  data?: T
  message?: string
  success: boolean
}

export interface ApiError {
  code: number
  error: string
  success: false
}

// lib/api-client.ts
export class ApiException extends Error {
  constructor(
    public code: number,
    public error: string,
    public response?: Response
  ) {
    super(error)
    this.name = "ApiException"
  }
}

export async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      ...options,
      credentials: "include",
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiException(
        data.code || response.status,
        data.error || data.message || "Request failed",
        response
      )
    }

    return data as ApiResponse<T>
  } catch (error) {
    if (error instanceof ApiException) {
      throw error
    }
    throw new ApiException(500, "Network error")
  }
}

// Usage in components:
try {
  const result = await apiCall<User[]>("admin/users")
  if (result.success) {
    setUsers(result.data)
  }
} catch (error) {
  if (error instanceof ApiException) {
    toast.error(`Error ${error.code}: ${error.error}`)
  }
}
```

#### RULE 5: Authentication Cookie Handling

**❌ NEVER DO THIS** (Client-side token storage):

```typescript
// WRONG - Tokens in localStorage/sessionStorage
localStorage.setItem("token", token) // Security risk!
```

**✅ ALWAYS DO THIS** (httpOnly cookies via Server Actions):

```typescript
// app/actions/auth.ts
"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// app/actions/auth.ts

// app/actions/auth.ts

// app/actions/auth.ts

// app/actions/auth.ts

// app/actions/auth.ts

export async function loginAction(formData: FormData) {
  const token = formData.get("token") as string
  const role = formData.get("role") as "admin" | "user"

  // Validate token against backend
  const isValid = await validateToken(token, role)

  if (!isValid) {
    return { error: "Invalid token" }
  }

  // Set httpOnly cookies (secure, not accessible via JS)
  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  cookieStore.set("auth_role", role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  redirect(role === "admin" ? "/admin/dashboard" : "/user/dashboard")
}

async function validateToken(token: string, role: string): Promise<boolean> {
  try {
    const endpoint = role === "admin" ? "/admin/users" : "/session/status"
    const headers = role === "admin" ? { Authorization: `${token}` } : { token: token }

    const response = await fetch(`${process.env.BACKEND_API_URL}${endpoint}`, { headers })

    return response.ok
  } catch {
    return false
  }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
  cookieStore.delete("auth_role")
  redirect("/login")
}
```

### 🔍 Core Data Structures Reference

#### User & Authentication

```typescript
// Complete User object from spec.yml
export interface User {
  id: string
  name: string
  token: string
  connected: boolean
  loggedIn: boolean
  jid: string
  webhook: string
  events: string
  skip_media_download: boolean
  skip_groups: boolean
  skip_newsletters: boolean
  skip_broadcasts: boolean
  skip_own_messages: boolean
  skip_calls: boolean
  call_reject_message: string
  call_reject_type: "busy" | "declined" | "unavailable"
  proxy_config: ProxyConfig
  s3_config: S3Config
  rabbitmq_config: RabbitMQConfig
  whatsapp_config: WhatsAppConfig
  echo_api_messages: boolean
}

export interface ProxyConfig {
  proxy_url: string
}

export interface S3Config {
  endpoint: string
  region: string
  bucket: string
  access_key_id: string
  secret_access_key: string
  public_url?: string
  path_style?: boolean
  media_delivery_mode?: "base64" | "url" | "both"
  retention_days?: number
  disable_acl?: boolean
}

export interface RabbitMQConfig {
  rabbitmq_url: string
  exchange_name: string
  exchange_type: "direct" | "topic" | "fanout" | "headers"
  queue_name: string
  queue_type: "classic" | "quorum" | "stream"
  routing_key?: string
  durable?: boolean
  auto_delete?: boolean
  exclusive?: boolean
  no_wait?: boolean
  delivery_mode?: 1 | 2
  events?: string
}
```

#### Session & Connection

```typescript
export interface SessionStatus {
  connected: boolean
  loggedIn: boolean
  jid: string
  paired: boolean
  device: DeviceInfo
}

export interface DeviceInfo {
  platform: string
  osVersion: string
  deviceModel: string
  pushName: string
}
```

#### Messages & Media

```typescript
export interface Message {
  message_id: string
  from: string
  to: string
  timestamp: number
  type: "text" | "image" | "video" | "audio" | "document" | "sticker" | "location" | "contact"
  text?: string
  caption?: string
  media_url?: string
  media_base64?: string
  media_mimetype?: string
  quoted?: QuotedMessage
}

export interface QuotedMessage {
  message_id: string
  from: string
  text?: string
}

export interface SendTextRequest {
  jid: string
  text: string
  quoted_id?: string
}

export interface SendImageRequest {
  jid: string
  image: string // base64 or URL
  caption?: string
  quoted_id?: string
  view_once?: boolean
}
```

#### Buttons & Interactive Messages

```typescript
export interface Button {
  id: string
  displayText: string
  type?: "quick_reply" | "url" | "call"
  url?: string
  phoneNumber?: string
}

export interface SendButtonsRequest {
  jid: string
  text: string
  footer?: string
  buttons: Button[]
  image?: string
  quoted_id?: string
}

export interface Section {
  title: string
  rows: Row[]
}

export interface Row {
  id: string
  title: string
  description?: string
}

export interface SendListRequest {
  jid: string
  text: string
  footer?: string
  button_text: string
  sections: Section[]
  quoted_id?: string
}
```

#### Groups & Communities

```typescript
export interface GroupInfo {
  jid: string
  name: string
  owner: string
  creation: number
  participants: GroupParticipant[]
  description?: string
  announce?: boolean
  locked?: boolean
  ephemeral?: number
}

export interface GroupParticipant {
  jid: string
  isAdmin: boolean
  isSuperAdmin: boolean
}

export interface CommunityInfo {
  jid: string
  name: string
  description?: string
}
```

#### Webhook & Events

```typescript
export interface WebhookConfig {
  url: string
  events: string
  timeout?: number
  max_retries?: number
  retry_delay?: number
  backoff_factor?: number
}

export interface GlobalWebhook {
  url: string
  events?: string
}

export interface GlobalRabbitMQ {
  rabbitmq_url: string
  exchange_name: string
  exchange_type: string
  queue_name: string
  events?: string
}
```

### 🎯 Implementation Patterns

#### Pattern 1: Server Action for Form Submissions

```typescript
// app/actions/users.ts
"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

// app/actions/users.ts

// app/actions/users.ts

// app/actions/users.ts

// app/actions/users.ts

// app/actions/users.ts

export async function createUserAction(formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  const response = await fetch(`${process.env.BACKEND_API_URL}/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: formData.get("name"),
      token: formData.get("token"),
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    return { error: error.error || "Failed to create user" }
  }

  const result = await response.json()
  revalidatePath("/admin/users")
  return { success: true, data: result.data }
}
```

#### Pattern 2: API Proxy Route Handler

```typescript
// app/api/admin/users/route.ts
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const role = cookieStore.get("auth_role")?.value

  if (role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const response = await fetch(`${process.env.BACKEND_API_URL}/admin/users`, {
    headers: { Authorization: `${token}` },
  })

  return NextResponse.json(await response.json())
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const body = await req.json()

  const response = await fetch(`${process.env.BACKEND_API_URL}/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  return NextResponse.json(await response.json())
}
```

#### Pattern 3: Type-Safe API Client

```typescript
// lib/api-client.ts
import { ApiException, ApiResponse } from "@/types/api"

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiException(data.code || response.status, data.error || "Request failed")
  }

  if (!data.success) {
    throw new ApiException(data.code, data.error || "API returned error")
  }

  return data.data as T
}

// Usage:
const users = await fetchApi<User[]>("admin/users")
const user = await fetchApi<User>("admin/users/123")
```

### ✅ API Compatibility Checklist

Before implementing ANY feature, verify:

- [ ] **spec.yml consulted** - Endpoint structure verified from `/static/api/spec.yml`
- [ ] **Authentication scheme correct** - AdminAuth (Bearer) vs ApiKeyAuth (token header)
- [ ] **TypeScript types match** - All fields from definitions section included
- [ ] **Request body validated** - Zod schema matches API request parameters
- [ ] **Response structure handled** - `{code, data, success}` pattern implemented
- [ ] **Error handling consistent** - ApiException with code/error fields
- [ ] **httpOnly cookies used** - No client-side token storage
- [ ] **API Proxy pattern** - Routes through `/api/[...path]/route.ts`
- [ ] **Required fields validated** - Form schemas enforce required fields
- [ ] **Enum values correct** - All enum values match spec.yml exactly
- [ ] **Nested objects complete** - Config objects (S3, RabbitMQ, Proxy) fully typed

### 📚 Practical Examples

#### Example 1: Complete User Management Flow

```typescript
// 1. Type Definition (from spec.yml)
// types/api.ts
export interface User {
  id: string
  name: string
  token: string
  connected: boolean
  loggedIn: boolean
  jid: string
  webhook: string
  events: string
  skip_media_download: boolean
  skip_groups: boolean
  skip_newsletters: boolean
  skip_broadcasts: boolean
  skip_own_messages: boolean
  skip_calls: boolean
  call_reject_message: string
  call_reject_type: "busy" | "declined" | "unavailable"
  proxy_config: ProxyConfig
  s3_config: S3Config
  rabbitmq_config: RabbitMQConfig
  whatsapp_config: WhatsAppConfig
  echo_api_messages: boolean
}

// 2. Form Schema (from spec.yml request body)
// lib/schemas.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1, "Name required"),
  token: z.string().min(32, "Token must be 32+ chars")
})

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  webhook: z.string().url().optional(),
  events: z.string().optional(),
  skip_media_download: z.boolean().optional(),
  skip_groups: z.boolean().optional(),
  skip_newsletters: z.boolean().optional(),
  skip_broadcasts: z.boolean().optional(),
  skip_own_messages: z.boolean().optional(),
  skip_calls: z.boolean().optional(),
  call_reject_message: z.string().optional(),
  call_reject_type: z.enum(["busy", "declined", "unavailable"]).optional(),
  echo_api_messages: z.boolean().optional()
})

// 3. API Proxy Route
// app/api/admin/users/route.ts
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/admin/users`,
    {
      headers: { 'Authorization': `${token}` }
    }
  )

  return NextResponse.json(await response.json())
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  const body = await req.json()

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/admin/users`,
    {
      method: 'POST',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  )

  return NextResponse.json(await response.json())
}

// 4. Server Action
// app/actions/users.ts
'use server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createUserSchema } from '@/lib/schemas'

export async function createUserAction(formData: FormData) {
  const parsed = createUserSchema.safeParse({
    name: formData.get('name'),
    token: formData.get('token')
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/admin/users`,
    {
      method: 'POST',
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(parsed.data)
    }
  )

  if (!response.ok) {
    const error = await response.json()
    return { error: error.error }
  }

  const result = await response.json()
  revalidatePath('/admin/users')
  return { success: true, data: result.data }
}

// 5. Client Component with Form
// components/user-create-form.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema } from '@/lib/schemas'
import { createUserAction } from '@/app/actions/users'

export function UserCreateForm() {
  const form = useForm({
    resolver: zodResolver(createUserSchema)
  })

  async function onSubmit(data: z.infer<typeof createUserSchema>) {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('token', data.token)

    const result = await createUserAction(formData)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User created!')
      form.reset()
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register('name')} placeholder="User name" />
      <Input {...form.register('token')} placeholder="User token" />
      <Button type="submit">Create</Button>
    </form>
  )
}
```

#### Example 2: Session Connection Flow

```typescript
// 1. Types (from spec.yml)
export interface SessionStatus {
  connected: boolean
  loggedIn: boolean
  jid: string
  paired: boolean
  device: DeviceInfo
}

export interface QRCode {
  qr: string
  timeout: number
}

// 2. API Route
// app/api/session/status/route.ts
export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  const response = await fetch(
    `${process.env.BACKEND_API_URL}/session/status`,
    {
      headers: { 'token': token } // ApiKeyAuth, not Bearer!
    }
  )

  return NextResponse.json(await response.json())
}

// 3. Client Component
// components/connection-status.tsx
'use client'
import { useEffect, useState } from 'react'
import { SessionStatus } from '@/types/api'

export function ConnectionStatus() {
  const [status, setStatus] = useState<SessionStatus>()

  useEffect(() => {
    async function fetchStatus() {
      const response = await fetch('/api/session/status')
      const data = await response.json()
      if (data.success) {
        setStatus(data.data)
      }
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 5000) // Poll every 5s
    return () => clearInterval(interval)
  }, [])

  if (!status) return <div>Loading...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <Badge variant={status.connected ? "success" : "destructive"}>
              {status.connected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          {status.jid && <p>JID: {status.jid}</p>}
          {status.device && (
            <div>
              <p>Device: {status.device.deviceModel}</p>
              <p>OS: {status.device.osVersion}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
```

#### Example 3: Send Message with Media

```typescript
// 1. Types (from spec.yml)
export interface SendImageRequest {
  jid: string
  image: string // base64 or URL
  caption?: string
  quoted_id?: string
  view_once?: boolean
}

export interface SendResponse {
  message_id: string
  timestamp: number
  jid: string
}

// 2. Schema
export const sendImageSchema = z.object({
  jid: z.string().regex(/^\d+@s\.whatsapp\.net$/, "Invalid JID format"),
  image: z.string().min(1, "Image required"),
  caption: z.string().optional(),
  quoted_id: z.string().optional(),
  view_once: z.boolean().optional(),
})

// 3. API Route
// app/api/send/image/route.ts
export async function POST(req: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  const body = await req.json()

  const response = await fetch(`${process.env.BACKEND_API_URL}/send/image`, {
    method: "POST",
    headers: {
      token: token, // ApiKeyAuth
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  return NextResponse.json(await response.json())
}

// 4. Server Action
export async function sendImageAction(data: SendImageRequest) {
  const parsed = sendImageSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const response = await fetch("/api/send/image", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(parsed.data),
  })

  const result = await response.json()

  if (!result.success) {
    return { error: result.error }
  }

  return { success: true, data: result.data as SendResponse }
}
```

---

## 📱 Páginas Detalhadas

### 1. Login (`/login`)

- **Componentes**: Tabs (Admin/User), Card Premium, Input com Label Flutuante
- **Validação**: Zod schema + react-hook-form
- **Features**: Loading state, toast feedback, dark mode toggle
- **API**: `GET /admin/users` (admin) ou `GET /session/status` (user)

### 2. Dashboard Admin (`/admin/dashboard`)

- **Métricas Cards**: Total instâncias, Conectadas, Desconectadas, Taxa de sucesso
- **Gráfico**: Recharts - Status por hora (line/bar chart)
- **Lista Recente**: 5 últimas instâncias com quick actions
- **API**: `GET /admin/users` + `GET /admin/global/stats`

### 3. Lista Instâncias (`/admin/instances`)

- **DataTable**: TanStack Table com sorting, filtering, pagination
- **Colunas**: Avatar, Nome, JID, Status (badge), Token (masked), Ações
- **Dialog Criar**: Form com validação Zod (Nome, Webhook, Events)
- **Ações**: Editar (→ /[id]), Deletar (com confirmação)
- **API**: `GET /admin/users`, `POST /admin/users`, `DELETE /admin/users/{id}`

### 4. Editor Instância (`/admin/instances/[id]`)

**6 Tabs Premium com Navegação Horizontal:**

#### Tab 1: Informações Básicas

- Nome, Token (readonly), JID (readonly), Status (badge), Avatar (display)
- API: `GET /admin/users/{id}`

#### Tab 2: Webhook

- URL, Events (multiselect), Timeout, Retries, Backoff Factor
- Botão "Testar Webhook" + status recent calls
- API: `GET/POST/PUT/DELETE /webhook`, `POST /webhook/test`

#### Tab 3: S3 Storage

- Connection: Endpoint, Region, Bucket, Access Key, Secret Key
- Advanced: Public URL, Path Style, Media Delivery, Retention Days, Disable ACL
- Botão "Testar Conexão"
- API: `GET/POST/DELETE /session/s3/config`, `POST /session/s3/test`

#### Tab 4: RabbitMQ

- Connection: URL, Exchange (name/type), Queue (name/type/routing key)
- Options: Durable, Auto Delete, Exclusive, No Wait
- Performance: Pool Size, Workers, Buffer, Batch
- Botão "Testar Conexão"
- API: `GET/POST/DELETE /session/rabbitmq/config`, `POST /session/rabbitmq/test`

#### Tab 5: Filtros (Skips)

- 6 Switches: Skip Media, Groups, Newsletters, Broadcasts, Own Messages, Calls
- API: `GET/POST /session/skip*/config` (múltiplos endpoints)

#### Tab 6: Device Config

- Platform, OS, Device Info (readonly após pareamento)
- API: Parte do `GET /session/status`

### 5. Dashboard User (`/user/dashboard`)

- **Status Card**: Badge grande (conectado/desconectado), JID, Nome
- **Quick Actions**: Ver QR Code (modal), Desconectar, Refresh
- **Stats Mini**: Mensagens enviadas (hoje/semana/mês)
- **API**: `GET /session/status`, `GET /session/qr`

### 6. Conexão (`/user/instance/connection`)

- **Status Detalhado**: Connected, JID, Paired, Device info
- **QR Code**: Auto-refresh 30s, Modal premium com bordas decorativas
- **Pareamento Telefone**: Input número + código
- **Proxy**: URL configuração
- **Ações**: Conectar, Desconectar, Logout, Refresh
- **API**: `GET /session/status`, `GET /session/qr`, `POST /session/connect`, `POST /session/disconnect`, `POST /session/logout`, `POST /session/pairphone`, `POST /session/proxy`

### 7-10. Páginas User Config

Mesma estrutura das tabs do Admin Editor, mas sem poder deletar instância.

---

## 🎨 Componentes Reutilizáveis Premium

### StatusBadge

```tsx
// Badge com pulse animation e cores semânticas
<Badge variant="connected">
  <div className="pulse-dot" />
  Conectado
</Badge>
```

### DataTable

```tsx
// TanStack Table com todas features
<DataTable
  columns={columns}
  data={instances}
  onRowClick={(row) => router.push(`/admin/instances/${row.id}`)}
  enableSorting
  enableFiltering
  enablePagination
/>
```

### QRCodeDisplay

```tsx
// Modal premium com decoração e auto-refresh
<QRCodeModal
  open={showQR}
  onClose={() => setShowQR(false)}
  value={qrCode}
  autoRefresh={30000} // 30s
/>
```

### FormSection

```tsx
// Wrapper para organização de forms
<FormSection
  title="Configuração de Webhook"
  description="Configure o endpoint para receber eventos"
>
  {/* campos */}
</FormSection>
```

### ConfirmDialog

```tsx
// Dialog reutilizável com animações
<ConfirmDialog
  open={confirmDelete}
  title="Deletar Instância"
  description="Esta ação não pode ser desfeita."
  onConfirm={handleDelete}
  onCancel={() => setConfirmDelete(false)}
  variant="destructive"
/>
```

---

## 🚀 Ordem de Implementação

### **Fase 1: Setup Base (2-3h)**

1. ✅ Projeto já criado com Next.js 15 + deps instaladas
2. Configurar `components.json` (shadcn/ui)
3. Configurar Tailwind v4 + Design System no `globals.css`
4. Criar estrutura de pastas completa
5. Configurar `.env.local` com API_URL

### **Fase 2: Autenticação (3-4h)**

1. `middleware.ts` - Route protection
2. `lib/auth.ts` - Helper functions
3. `app/actions/auth.ts` - Server Actions (login/logout)
4. `app/api/proxy/[...path]/route.ts` - Proxy API
5. `app/(auth)/login/page.tsx` - Login page premium

### **Fase 3: Layouts (2-3h)**

1. `app/layout.tsx` - Root layout com providers
2. `components/layout/admin-sidebar.tsx` - Sidebar colapsável
3. `components/layout/user-sidebar.tsx` - Sidebar simplificado
4. `app/(admin)/layout.tsx` - Admin layout
5. `app/(user)/layout.tsx` - User layout
6. `components/layout/header.tsx` - Header componente

### **Fase 4: shadcn/ui Components (2h)**

```bash
npx shadcn@latest add button card input label tabs table dialog badge switch select toast dropdown-menu popover separator skeleton
```

### **Fase 5: Componentes Custom (4-5h)**

1. `StatusBadge` - Badge com pulse animation
2. `DataTable` - TanStack Table wrapper
3. `QRCodeDisplay` - Modal QR Code premium
4. `InstanceCard` - Card resumido
5. `MetricsCard` - Card métricas
6. `FormSection` - Section wrapper
7. `ConfirmDialog` - Dialog confirmação
8. `LoadingSpinner` - Spinner premium
9. `SkeletonLoader` - Skeleton screens

### **Fase 6: API Client (2h)**

1. `lib/api.ts` - Cliente API com error handling
2. `types/index.ts` - TypeScript interfaces
3. `lib/validations.ts` - Schemas Zod para forms

### **Fase 7: Páginas Admin (6-8h)**

1. `app/(admin)/dashboard/page.tsx` - Dashboard com métricas
2. `app/(admin)/instances/page.tsx` - Lista + CRUD
3. `app/(admin)/instances/[id]/page.tsx` - Editor 6 tabs
4. Forms: `instance-form`, `webhook-form`, `s3-form`, `rabbitmq-form`

### **Fase 8: Páginas User (4-5h)**

1. `app/(user)/dashboard/page.tsx` - Dashboard instância
2. `app/(user)/instance/connection/page.tsx` - Conexão + QR
3. `app/(user)/instance/webhook/page.tsx` - Config webhook
4. `app/(user)/instance/s3/page.tsx` - Config S3
5. `app/(user)/instance/rabbitmq/page.tsx` - Config RabbitMQ
6. `app/(user)/instance/settings/page.tsx` - Skips + configs

### **Fase 9: Refinamento (3-4h)**

1. Responsividade mobile (breakpoints estratégicos)
2. Animações e transições (micro-interações)
3. Loading states e skeleton screens
4. Error handling e validações
5. Toast notifications (Sonner)
6. Dark mode toggle e persistência
7. Accessibility audit (contraste, foco, ARIA)

### **Fase 10: Docker Deploy (2-3h)**

1. `Dockerfile` - Build otimizado multi-stage
2. `docker-compose.yml` - Orquestração
3. `.dockerignore` - Exclusões build
4. Scripts de deploy AWS/EC2
5. Variáveis de ambiente para produção
6. Health checks e logs

---

## 🐳 Docker Configuration

### Dockerfile (Next.js Standalone)

```dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  manager:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://zuckzapgo-api:8080
      - NODE_ENV=production
    depends_on:
      - api
    networks:
      - zuckzapgo-network
    restart: unless-stopped

  api:
    image: zuckzapgo-api:latest
    ports:
      - "8080:8080"
    env_file:
      - .env.api
    networks:
      - zuckzapgo-network
    restart: unless-stopped

networks:
  zuckzapgo-network:
    driver: bridge
```

---

## ✅ Checklist de Requisitos

### Funcional

- ✅ Next.js 16 com App Router e SSR
- ✅ Server Components por padrão
- ✅ Tailwind CSS v4 com tema neutral
- ✅ shadcn/ui components
- ✅ Dark mode nativo + toggle manual
- ✅ Toast notifications (Sonner)
- ✅ Responsivo mobile/desktop
- ✅ Idioma português
- ✅ Sem testes E2E
- ✅ Design moderno com Lucide React
- ✅ Tudo arredondado (radius-lg/xl)
- ✅ Login Admin/User separado
- ✅ Dashboard Admin com métricas
- ✅ CRUD completo de instâncias (Admin)
- ✅ Dashboard User com status
- ✅ Gerenciamento completo da instância (User)
- ✅ User não pode deletar instância
- ✅ Sidebar responsivo com colapso
- ✅ Baseado na API real do ZuckZapGo
- ✅ Documentação atualizada (Context7)

### Técnico

- ✅ TypeScript strict mode
- ✅ ESLint configurado
- ✅ Validação com Zod
- ✅ Forms com react-hook-form
- ✅ DataTables com TanStack Table
- ✅ Server Actions para mutações
- ✅ Route protection com middleware
- ✅ API proxy para evitar CORS
- ✅ Docker deployment ready
- ✅ AWS/EC2 compatible

### API Compatibility (⚠️ MANDATORY)

- ✅ **spec.yml consultado** - Toda implementação baseada em `/static/api/spec.yml`
- ✅ **Types match API** - Todas interfaces TypeScript correspondem às definições do spec.yml
- ✅ **Zod schemas validados** - Form schemas correspondem aos request bodies da API
- ✅ **Auth schemes corretos** - AdminAuth (Bearer) vs ApiKeyAuth (token header)
- ✅ **Response structure** - `{code, data, success}` pattern implementado
- ✅ **Error handling** - ApiException com code/error fields
- ✅ **httpOnly cookies** - Autenticação via cookies seguros (não localStorage)
- ✅ **API Proxy pattern** - Todas chamadas através de `/api/[...path]/route.ts`
- ✅ **Enum values exatos** - Todos enums (call_reject_type, exchange_type, etc.) correspondem ao spec.yml
- ✅ **Nested configs completos** - S3Config, RabbitMQConfig, ProxyConfig, WhatsAppConfig com todos os campos
- ✅ **47+ endpoints mapeados** - Documentação completa de todas as categorias de endpoints
- ✅ **5 regras obrigatórias** - RULE 1-5 documentadas com exemplos práticos
- ✅ **Checklist de validação** - Checklist de compatibilidade documentado
- ✅ **Exemplos práticos** - 3 exemplos completos (User Management, Session, Send Message)

### Design Premium

- ✅ Sistema OKLCH colors
- ✅ 6 níveis de elevação (shadows)
- ✅ Micro-interações (hover, active, focus)
- ✅ Animações spring (cubic-bezier)
- ✅ Glassmorphism sutil
- ✅ Loading states premium (skeleton, spinner)
- ✅ Acessibilidade WCAG AA
- ✅ Focus visible para keyboard nav
- ✅ ARIA labels completos

---

## 🎯 Próximos Passos

Após aprovação, vou implementar na ordem definida, validando cada fase incrementalmente com você. Cada componente será criado seguindo as especificações do design system premium e as melhores práticas documentadas via Context7.
