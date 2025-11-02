# REGRAS DE DESENVOLVIMENTO - MÓDULO DE CAMPANHAS

> **Versão**: 1.0  
> **Última Atualização**: 2025-11-01  
> **Status**: ATIVO

Este documento consolida todas as regras de desenvolvimento para o módulo de campanhas do ZuckZapGo Manager. Estas regras são **obrigatórias** e devem ser seguidas por todos os desenvolvedores.

---

## 📋 ÍNDICE

1. [Regras de Logging](#regras-de-logging)
2. [Regras de Autenticação](#regras-de-autenticação)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Padrões de UI](#padrões-de-ui)
5. [Validação de Dados](#validação-de-dados)
6. [Revalidação de Cache](#revalidação-de-cache)
7. [Type Safety](#type-safety)
8. [React Flow - Boas Práticas](#react-flow---boas-práticas)
9. [Tratamento de Erros](#tratamento-de-erros)
10. [Padrões Next.js 16](#padrões-nextjs-16)
11. [Performance](#performance)
12. [Segurança](#segurança)

---

## 1. REGRAS DE LOGGING

### ❌ NUNCA FAÇA ISSO:

```typescript
console.log("Debug info")
console.error("Error occurred")
console.warn("Warning message")
```

### ✅ SEMPRE FAÇA ISSO:

```typescript
import { logger } from "@/lib/logger"

logger.info("Debug info", { context: "campaign-creation" })
logger.error("Error occurred", { error, campaignId })
logger.warn("Warning message", { userId, action: "delete-campaign" })
```

### Níveis de Log Disponíveis:

- `logger.debug()` - Informações de debug detalhadas
- `logger.info()` - Informações gerais de operação
- `logger.warn()` - Avisos que não interrompem a operação
- `logger.error()` - Erros que precisam atenção
- `logger.fatal()` - Erros críticos que param a aplicação

### Contexto Obrigatório:

Sempre inclua contexto relevante no segundo parâmetro:

```typescript
logger.info("Campaign created successfully", {
  campaignId: campaign.id,
  userId: user.id,
  instanceId: instance.id,
  messageCount: workflow.nodes.length,
})
```

---

## 2. REGRAS DE AUTENTICAÇÃO

### Server Actions - Validação Obrigatória:

```typescript
"use server"

import { auth } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function createCampaign(data: CreateCampaignInput) {
  // 1. SEMPRE validar autenticação
  const session = await auth()
  if (!session?.user?.id) {
    logger.warn("Unauthorized campaign creation attempt")
    throw new Error("Não autorizado")
  }

  // 2. SEMPRE validar permissões
  const hasPermission = await checkUserPermission(session.user.id, "campaigns:create")
  if (!hasPermission) {
    logger.warn("Insufficient permissions", { userId: session.user.id, action: "create-campaign" })
    throw new Error("Permissão insuficiente")
  }

  // 3. Prosseguir com a lógica
  // ...
}
```

### Client Components - Validação de Estado:

```typescript
"use client"

import { useSession } from "next-auth/react"

export function CampaignEditor() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <LoadingSpinner />
  }

  if (status === "unauthenticated") {
    return <AccessDenied />
  }

  // Componente protegido
  return <CampaignEditorForm />
}
```

---

## 3. ESTRUTURA DE ARQUIVOS

### Organização Obrigatória:

```
manager-zuckzapgo/
├── app/
│   ├── admin/
│   │   └── campaigns/
│   │       ├── page.tsx              # Lista de campanhas
│   │       ├── [id]/
│   │       │   ├── page.tsx          # Detalhes da campanha
│   │       │   └── edit/
│   │       │       └── page.tsx      # Edição de campanha
│   │       ├── analytics/
│   │       │   └── page.tsx          # Analytics
│   │       └── schedule/
│   │           └── page.tsx          # Agendamento
│   └── api/
│       └── campaigns/
│           ├── route.ts              # CRUD básico
│           ├── export/
│           │   └── route.ts          # Export de dados
│           └── stats/
│               └── route.ts          # Estatísticas
├── components/
│   └── campaign/
│       ├── workflow-editor.tsx       # Editor de workflow
│       ├── calendar-view.tsx         # Visualização de calendário
│       ├── stats-dashboard.tsx       # Dashboard de stats
│       └── charts/                   # Gráficos (Recharts)
├── lib/
│   └── actions/
│       └── campaign.actions.ts       # Server Actions
└── types/
    └── campaign.ts                   # TypeScript types
```

### Convenções de Nomenclatura:

- **Pages**: `page.tsx` (sempre lowercase)
- **Components**: `PascalCase.tsx` (ex: `WorkflowEditor.tsx`)
- **Server Actions**: `*.actions.ts` (ex: `campaign.actions.ts`)
- **API Routes**: `route.ts`
- **Types**: `*.ts` (ex: `campaign.ts`)
- **Utils**: `*.utils.ts` (ex: `campaign.utils.ts`)

---

## 4. PADRÕES DE UI

### ✅ SEMPRE use shadcn/ui:

```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
```

### ❌ NUNCA crie componentes UI customizados sem necessidade:

```typescript
// ERRADO - Não crie botões customizados
function MyCustomButton() {
  return <button className="my-custom-styles">Click</button>
}

// CORRETO - Use shadcn/ui com variantes
<Button variant="default" size="lg">Click</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

### Tailwind CSS - Padrões:

```typescript
// ✅ CORRETO - Classes utilitárias
<div className="flex items-center gap-4 rounded-lg border p-4">

// ❌ ERRADO - Estilos inline
<div style={{ display: "flex", gap: "16px" }}>
```

---

## 5. VALIDAÇÃO DE DADOS

### Zod Schema - Sempre Defina:

```typescript
import { z } from "zod"

export const createCampaignSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().optional(),
  instanceId: z.string().uuid("ID de instância inválido"),
  workflow: z.object({
    nodes: z.array(z.any()),
    edges: z.array(z.any()),
  }),
  schedule: z
    .object({
      enabled: z.boolean(),
      cronExpression: z.string().optional(),
      timezone: z.string().optional(),
    })
    .optional(),
})

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>
```

### Validação em Server Actions:

```typescript
"use server"

export async function createCampaign(data: unknown) {
  // SEMPRE valide com Zod
  const validatedData = createCampaignSchema.parse(data)

  // Prossiga com dados validados
  const campaign = await prisma.campaign.create({
    data: validatedData,
  })

  return campaign
}
```

### Validação em React Hook Form:

```typescript
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const form = useForm<CreateCampaignInput>({
  resolver: zodResolver(createCampaignSchema),
  defaultValues: {
    name: "",
    instanceId: "",
  },
})
```

---

## 6. REVALIDAÇÃO DE CACHE

### SEMPRE revalide após mutações:

```typescript
"use server"

import { revalidatePath } from "next/cache"

export async function createCampaign(data: CreateCampaignInput) {
  const campaign = await prisma.campaign.create({ data })

  // Revalida a lista de campanhas
  revalidatePath("/admin/campaigns")

  // Revalida a página de detalhes
  revalidatePath(`/admin/campaigns/${campaign.id}`)

  return campaign
}

export async function updateCampaign(id: string, data: UpdateCampaignInput) {
  const campaign = await prisma.campaign.update({
    where: { id },
    data,
  })

  // Revalida múltiplos paths
  revalidatePath("/admin/campaigns")
  revalidatePath(`/admin/campaigns/${id}`)
  revalidatePath(`/admin/campaigns/${id}/edit`)

  return campaign
}
```

### Tag-based Revalidation (Preferido):

```typescript
import { revalidateTag } from "next/cache"

export async function createCampaign(data: CreateCampaignInput) {
  const campaign = await prisma.campaign.create({ data })

  // Revalida todas as páginas com essa tag
  revalidateTag("campaigns")

  return campaign
}

// Em fetch com cache
const campaigns = await fetch("/api/campaigns", {
  next: {
    tags: ["campaigns"],
  },
})
```

---

## 7. TYPE SAFETY

### ❌ NUNCA use `as any`:

```typescript
// ERRADO
const data = JSON.parse(jsonString) as any
const result = apiResponse as any
```

### ✅ SEMPRE defina tipos apropriados:

```typescript
// CORRETO
import { type Resolver } from "react-hook-form"

const resolver: Resolver<CreateCampaignInput> = zodResolver(createCampaignSchema)

// CORRETO - Type guard
function isCampaign(data: unknown): data is Campaign {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "name" in data &&
    "instanceId" in data
  )
}

// CORRETO - Zod inference
const parsedData = campaignSchema.parse(unknownData) // Type-safe
```

### Tipos Compartilhados:

```typescript
// types/campaign.ts
export interface Campaign {
  id: string
  name: string
  description?: string
  instanceId: string
  workflow: WorkflowDefinition
  schedule?: ScheduleConfig
  status: CampaignStatus
  createdAt: Date
  updatedAt: Date
}

export type CampaignStatus = "draft" | "scheduled" | "running" | "paused" | "completed" | "failed"

export interface WorkflowDefinition {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}
```

---

## 8. REACT FLOW - BOAS PRÁTICAS

### ❌ ERRADO - nodeTypes dentro do componente:

```typescript
function WorkflowEditor() {
  // Recriado em cada render!
  const nodeTypes = {
    start: StartNode,
    textMessage: TextMessageNode,
  }

  return <ReactFlow nodeTypes={nodeTypes} />
}
```

### ✅ CORRETO - nodeTypes fora do componente:

```typescript
// Definido UMA VEZ, antes do componente
const nodeTypes = {
  start: StartNode,
  textMessage: TextMessageNode,
  mediaMessage: MediaMessageNode,
  delay: DelayNode,
  interactive: InteractiveNode,
  end: EndNode,
}

function WorkflowEditor() {
  return <ReactFlow nodeTypes={nodeTypes} />
}
```

### Evite Infinite Loops:

```typescript
// ❌ ERRADO - Dependency circular
useEffect(() => {
  onChange({ nodes, edges })
}, [nodes, edges, onChange]) // Loop infinito!

// ✅ CORRETO - Monitor apenas mudanças estruturais
useEffect(() => {
  onChange({ nodes, edges })
}, [nodes.length, edges.length, onChange])

// ✅ CORRETO - Use callbacks com setTimeout
const handleNodeChange = useCallback(
  (nodeId: string, updates: any) => {
    setNodes((nds) => {
      const updated = nds.map((n) =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
      )

      // Evita update durante render
      setTimeout(() => {
        onChange({ nodes: updated, edges })
      }, 0)

      return updated
    })
  },
  [setNodes, edges, onChange]
)
```

---

## 9. TRATAMENTO DE ERROS

### Server Actions - Tratamento Completo:

```typescript
"use server"

import { logger } from "@/lib/logger"

export async function createCampaign(data: CreateCampaignInput) {
  try {
    // 1. Validação
    const validatedData = createCampaignSchema.parse(data)

    // 2. Autenticação
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("Não autorizado")
    }

    // 3. Lógica de negócio
    const campaign = await prisma.campaign.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    })

    // 4. Log de sucesso
    logger.info("Campaign created successfully", {
      campaignId: campaign.id,
      userId: session.user.id,
    })

    // 5. Revalidação
    revalidatePath("/admin/campaigns")

    return { success: true, data: campaign }
  } catch (error) {
    // Log do erro
    logger.error("Failed to create campaign", {
      error,
      data,
    })

    // Retorno de erro user-friendly
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Dados inválidos: " + error.errors.map((e) => e.message).join(", "),
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar campanha",
    }
  }
}
```

### Client Components - Error Boundaries:

```typescript
"use client"

import { useEffect } from "react"
import { logger } from "@/lib/logger"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    logger.error("Campaign page error", { error })
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-xl font-bold">Algo deu errado!</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-4">
        Tentar novamente
      </Button>
    </div>
  )
}
```

---

## 10. PADRÕES NEXT.JS 16

### Server Components (Padrão):

```typescript
// app/admin/campaigns/page.tsx
// Sem "use client" = Server Component

import { prisma } from "@/lib/prisma"

export default async function CampaignsPage() {
  // Fetch direto no componente
  const campaigns = await prisma.campaign.findMany({
    include: { instance: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <h1>Campanhas</h1>
      <CampaignList campaigns={campaigns} />
    </div>
  )
}
```

### Client Components (Quando Necessário):

```typescript
"use client"

// Use APENAS quando precisar de:
// - useState, useEffect, useReducer
// - Event handlers (onClick, onChange)
// - Browser APIs (localStorage, window)
// - Third-party libraries que precisam de client

import { useState } from "react"

export function CampaignEditor() {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])

  return <ReactFlow nodes={nodes} edges={edges} />
}
```

### Server Actions:

```typescript
// lib/actions/campaign.actions.ts
"use server"

// SEMPRE no topo do arquivo
// Apenas async functions exportadas

export async function createCampaign(data: CreateCampaignInput) {
  // Lógica server-side
}

export async function updateCampaign(id: string, data: UpdateCampaignInput) {
  // Lógica server-side
}
```

### Dynamic Routes:

```typescript
// app/admin/campaigns/[id]/page.tsx

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { instance: true },
  })

  if (!campaign) {
    notFound()
  }

  return <CampaignDetails campaign={campaign} />
}
```

---

## 11. PERFORMANCE

### Otimizações Obrigatórias:

#### 1. React Flow - nodeTypes Estável

```typescript
// ✅ CORRETO
const nodeTypes = { start: StartNode, text: TextNode }

function Editor() {
  return <ReactFlow nodeTypes={nodeTypes} />
}
```

#### 2. Memoização de Componentes Pesados

```typescript
import { memo } from "react"

export const CampaignCard = memo(function CampaignCard({ campaign }: { campaign: Campaign }) {
  return <Card>{/* ... */}</Card>
})
```

#### 3. Lazy Loading de Componentes

```typescript
import dynamic from "next/dynamic"

const WorkflowEditor = dynamic(() => import("@/components/campaign/workflow-editor"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
})
```

#### 4. Paginação em Listas Grandes

```typescript
// Server Component com pagination
export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page = "1" } = await searchParams
  const pageNumber = parseInt(page)
  const pageSize = 20

  const campaigns = await prisma.campaign.findMany({
    skip: (pageNumber - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  })

  return <CampaignList campaigns={campaigns} page={pageNumber} />
}
```

#### 5. Debounce em Inputs de Busca

```typescript
import { useDebouncedCallback } from "use-debounce"

const debouncedSearch = useDebouncedCallback((value: string) => {
  setSearchTerm(value)
}, 500)
```

---

## 12. SEGURANÇA

### Sanitização de Inputs:

```typescript
import DOMPurify from "isomorphic-dompurify"

// Antes de exibir HTML user-generated
const sanitizedHtml = DOMPurify.sanitize(userInput)
```

### Validação de Permissões:

```typescript
export async function deleteCampaign(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verifica se a campanha pertence ao usuário
  const campaign = await prisma.campaign.findUnique({
    where: { id },
  })

  if (campaign?.userId !== session.user.id) {
    logger.warn("Unauthorized campaign deletion attempt", {
      userId: session.user.id,
      campaignId: id,
      ownerId: campaign?.userId,
    })
    throw new Error("Você não tem permissão para deletar esta campanha")
  }

  await prisma.campaign.delete({ where: { id } })
}
```

### Rate Limiting (API Routes):

```typescript
import { ratelimit } from "@/lib/redis"

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"

  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return new Response("Too Many Requests", { status: 429 })
  }

  // Prosseguir com a requisição
}
```

### Environment Variables:

```typescript
// ❌ NUNCA exponha secrets no client
"use client"

// const apiKey = process.env.NEXT_PUBLIC_API_KEY // ERRADO se for secret!

// ✅ CORRETO - Use Server Actions
"use server"

const apiKey = process.env.API_KEY // Seguro - nunca exposto ao client
```

---

## 📚 CHECKLIST DE REVISÃO DE CÓDIGO

Antes de fazer commit, verifique:

- [ ] ✅ Não uso `console.*` - apenas `logger.*`
- [ ] ✅ Server Actions validam autenticação e permissões
- [ ] ✅ Todos os dados são validados com Zod
- [ ] ✅ Paths são revalidados após mutações
- [ ] ✅ Não uso `as any` - tipos apropriados definidos
- [ ] ✅ nodeTypes do React Flow está fora do componente
- [ ] ✅ Erros são tratados e logados corretamente
- [ ] ✅ Componentes UI usam shadcn/ui
- [ ] ✅ "use client" apenas quando necessário
- [ ] ✅ Code formatado com Prettier (`npm run format`)
- [ ] ✅ Lint passou sem erros (`npm run lint`)
- [ ] ✅ Build passou sem erros (`npm run build`)

---

## 🔗 REFERÊNCIAS

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [React Flow Best Practices](https://reactflow.dev/learn)
- [Zod Documentation](https://zod.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [SuperClaude Logging System](./lib/logger.ts)

---

**FIM DO DOCUMENTO**
