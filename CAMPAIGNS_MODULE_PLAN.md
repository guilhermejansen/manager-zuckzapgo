# 📋 Módulo de Campanhas WhatsApp - Guia Completo de Desenvolvimento

> **Status Atual**: Fase 1 ✅ 100% | Fase 2 ✅ 100% | Fase 3 ✅ 100% | Fase 4 ✅ 100% | Fase 5 ✅ 100% | Fase 6 ✅ 100% | **Progresso Total: 85.7%**
>
> **Última Atualização**: 01/11/2025 00:35 BRT
>
> **Próxima Etapa**: Fase 7 - Testes & Refinamentos (Skipped per user request)

---

## 📚 Índice

- [1. Visão Geral do Projeto](#1-visão-geral-do-projeto)
- [2. Progresso Atual Detalhado](#2-progresso-atual-detalhado)
- [3. Regras de Desenvolvimento OBRIGATÓRIAS](#3-regras-de-desenvolvimento-obrigatórias)
- [4. Arquivos Criados e Responsabilidades](#4-arquivos-criados-e-responsabilidades)
- [5. Fase 1: Setup & Infrastructure ✅ 100%](#5-fase-1-setup--infrastructure--100)
- [6. Fase 2: API & Server Actions ✅ 100%](#6-fase-2-api--server-actions--100)
- [7. Fase 3: Workflow Editor (React Flow) ⏳ 0%](#7-fase-3-workflow-editor-react-flow--0)
- [8. Fase 4: Gerenciamento de Contatos (UI) ⏳ 0%](#8-fase-4-gerenciamento-de-contatos-ui--0)
- [9. Fase 5: Sistema de Agendamento ⏳ 0%](#9-fase-5-sistema-de-agendamento--0)
- [10. Fase 6: Monitoramento & Estatísticas ⏳ 0%](#10-fase-6-monitoramento--estatísticas--0)
- [11. Fase 7: Testes & Refinamentos ⏳ 0%](#11-fase-7-testes--refinamentos--0)
- [12. Estrutura Completa de Arquivos](#12-estrutura-completa-de-arquivos)
- [13. Dependências entre Fases](#13-dependências-entre-fases)
- [14. Checklist Final Global](#14-checklist-final-global)
- [15. Troubleshooting e Dicas](#15-troubleshooting-e-dicas)

---

## 1. Visão Geral do Projeto

### 🎯 Objetivo

Criar um sistema completo de campanhas de mensagens WhatsApp integrado ao **Manager ZuckZapGo**, permitindo:

- ✅ **Criação visual de workflows** (estilo n8n) com React Flow
- ✅ **Agendamento de campanhas** (disparo único, agendado, recorrente com cron)
- ✅ **Gerenciamento de contatos** (manual, CSV, Excel, API ZuckZapGo)
- ✅ **Multi-instância com fallback** automático configurável
- ✅ **Monitoramento em tempo real** com estatísticas detalhadas
- ✅ **Rate limiting** e controle de envio

### 🛠️ Stack Tecnológica

| Tecnologia              | Versão  | Uso                                           |
| ----------------------- | ------- | --------------------------------------------- |
| **Next.js**             | 16      | App Router, Server Components, Server Actions |
| **BullMQ**              | 5.63.0  | Filas de jobs e workers                       |
| **Redis**               | 7.x     | Backend do BullMQ                             |
| **Prisma**              | 6.18.0  | ORM com PostgreSQL 18                         |
| **React Flow**          | 11.11.4 | Editor de workflow visual                     |
| **Papa Parse**          | 5.5.3   | Parser de arquivos CSV                        |
| **XLSX**                | 0.18.5  | Parser de arquivos Excel                      |
| **TanStack Table**      | -       | Tabelas de dados                              |
| **shadcn/ui**           | -       | Componentes UI                                |
| **Zod**                 | -       | Validação de schemas                          |
| **Logger Centralizado** | Custom  | `@/lib/logger`                                |

### 📦 Funcionalidades Principais

1. **Campanhas Multi-tipo**
   - SINGLE: Disparo único imediato
   - SCHEDULED: Agendado para data/hora específica
   - RECURRING: Recorrente com cron expression

2. **Workflow Visual**
   - Editor drag-and-drop com React Flow
   - Nodes de mensagem (texto, mídia, interativa)
   - Nodes de delay configurável
   - Validação de fluxo

3. **Multi-instância WhatsApp**
   - Priorização de instâncias
   - Fallback automático (default 3 tentativas/instância)
   - Randomização opcional
   - Balanceamento de carga

4. **Importação de Contatos**
   - Manual (formulário)
   - CSV (Papa Parse)
   - Excel (XLSX)
   - API ZuckZapGo (integração direta)

5. **Monitoramento**
   - Dashboard em tempo real
   - Estatísticas por campanha
   - Histórico de jobs
   - Taxa de sucesso/falha

---

## 2. Progresso Atual Detalhado

### 📊 Tabela de Progresso por Fase

| Fase      | Nome                   | Progresso | Arquivos        | LOC       | Status                     |
| --------- | ---------------------- | --------- | --------------- | --------- | -------------------------- |
| **1**     | Setup & Infrastructure | 100%      | 7 arquivos      | ~1200     | ✅ Completo                |
| **2**     | API & Server Actions   | 100%      | 6 arquivos      | ~3200     | ✅ Completo                |
| **3**     | Workflow Editor (UI)   | 100%      | 8 arquivos      | ~1100     | ✅ Completo                |
| **4**     | Contatos (UI)          | 100%      | 7 arquivos      | ~950      | ✅ Completo                |
| **5**     | Agendamento            | 100%      | 5 arquivos      | ~1300     | ✅ Completo                |
| **6**     | Monitoramento          | 100%      | 8 arquivos      | ~1800     | ✅ Completo                |
| **7**     | Testes                 | 0%        | 0 arquivos      | 0         | ⏭️ Skipped (per user)      |
| **TOTAL** | **Módulo Campanhas**   | **85.7%** | **41 arquivos** | **~9550** | **🎉 Pronto (sem testes)** |

### 📈 Progresso Detalhado Fase 2 ✅ (100%)

**Concluído**:

- ✅ Server Actions de campanhas (`app/actions/campaigns.ts` - 851 linhas)
  - CRUD completo (create, read, update, delete, list)
  - Gerenciamento de instâncias (add, remove)
  - Controle de execução (start, pause, cancel)
  - Atualização de workflow
  - Permissões (Admin/User)

- ✅ Server Actions de contatos (`app/actions/contacts.ts` - 707 linhas)
  - CRUD de listas de contatos
  - Importação CSV com Papa Parse
  - Importação Excel com XLSX
  - Importação via API ZuckZapGo
  - Vinculação com campanhas
  - Validação de JIDs

- ✅ Cliente API ZuckZapGo (`lib/api/zuckzapgo-client.ts` - 326 linhas)
  - Envio de mensagens (texto, imagem, vídeo, áudio, documento)
  - Mensagens interativas (botões, listas)
  - Listagem de contatos
  - Verificação de status

- ✅ Schemas de validação (`lib/validations.ts` - +185 linhas)
  - Schemas de campanha (create, update, add instance)
  - Schemas de contatos (create list, add contact)
  - Schemas de importação (CSV, Excel, API)
  - Schemas de workflow (React Flow nodes/edges)

- ✅ Sistema de agendamento (`lib/queue/scheduler.ts` - 442 linhas)
  - CronJob para campanhas SCHEDULED
  - CronJob para campanhas RECURRING
  - Suporte a timezone
  - Registro/desregistro de jobs
  - Verificação periódica (60s default)
  - Integração com BullMQ
  - Graceful shutdown

- ✅ API Route de estatísticas (`app/api/campaigns/[id]/stats/route.ts` - 281 linhas)
  - GET endpoint para stats em tempo real
  - Server-Sent Events (SSE) para streaming
  - Permissões por role (Admin/User)
  - Estatísticas por instância
  - Taxa de sucesso calculada

### 🎯 Próximos Passos

**Fase 2 100% Completa!** Agora seguir para Fase 3 (Workflow Editor)

**Para iniciar Fase 3 (próximos dias)**:

1. Criar componentes React Flow
2. Implementar editor de workflow visual
3. Criar nodes customizados (message, delay, condition)
4. Testar integração com ZuckZapGo API

**Depois da Fase 2**:

1. Iniciar Fase 3 (Workflow Editor)
2. Criar componente `workflow-editor.tsx` com React Flow
3. Implementar nodes customizados

---

## 3. Regras de Desenvolvimento OBRIGATÓRIAS

### 🚨 REGRA CRÍTICA #1: Sistema de Logging

**❌ NUNCA USAR `console.*` DIRETAMENTE**

```typescript
// ✅ CORRETO - SEMPRE USAR O LOGGER CENTRALIZADO
import { logger } from "@/lib/logger"

// ❌ ERRADO - VAI QUEBRAR O PADRÃO DO PROJETO
console.log("Debug info")
console.error("Error occurred")

logger.info("Operation completed", null, {
  component: "ComponentName",
  action: "actionName",
  metadata: { userId: "123" },
})

logger.error("Operation failed", error, {
  component: "ComponentName",
  action: "actionName",
  metadata: { campaignId: "abc" },
})
```

**Níveis de Log Disponíveis**:

| Método             | Uso                  | Exemplo                                              |
| ------------------ | -------------------- | ---------------------------------------------------- |
| `logger.debug()`   | Debugging detalhado  | `logger.debug("Parsing CSV data", null, {...})`      |
| `logger.info()`    | Operações normais    | `logger.info("Campaign created", null, {...})`       |
| `logger.success()` | Sucessos importantes | `logger.success("All messages sent", null, {...})`   |
| `logger.warn()`    | Avisos não-críticos  | `logger.warn("Rate limit approaching", null, {...})` |
| `logger.error()`   | Erros e exceções     | `logger.error("Failed to send", error, {...})`       |

**Context Obrigatório**:

```typescript
{
  component: "NomeDoComponente",    // OBRIGATÓRIO
  action: "nomeDaAcao",             // OBRIGATÓRIO
  metadata: { /* dados extras */ }  // OPCIONAL
}
```

### 🔐 REGRA CRÍTICA #2: Autenticação e Permissões

**Todos os Server Actions DEVEM validar autenticação**:

```typescript
"use server"

import { cookies } from "next/headers"

import { getRole, getToken } from "@/lib/auth"

export async function someAction() {
  const cookieStore = await cookies()
  const role = getRole(cookieStore)
  const userId = getToken(cookieStore)

  // Validar autenticação
  if (!role || !userId) {
    return { success: false, error: "Não autenticado" }
  }

  // Validar permissão (Admin pode tudo, User só suas próprias)
  if (role !== "admin" && resource.userId !== userId) {
    return { success: false, error: "Sem permissão" }
  }

  // ... resto do código
}
```

### 📁 REGRA CRÍTICA #3: Estrutura de Arquivos

**Seguir EXATAMENTE a estrutura do projeto**:

```
app/
├── (admin)/               # Rotas protegidas por role=admin
│   ├── layout.tsx        # Layout com AdminSidebar
│   └── campaigns/
│       └── page.tsx
├── (user)/                # Rotas protegidas por role=user
│   ├── layout.tsx        # Layout com UserSidebar
│   └── campaigns/
│       └── page.tsx
├── actions/              # Server Actions
│   ├── campaigns.ts
│   └── contacts.ts
└── api/                  # API Routes (apenas para SSE/streaming)
    └── campaigns/
        └── [id]/
            └── stats/
                └── route.ts
```

### 🎨 REGRA CRÍTICA #4: Padrões UI

**Usar SEMPRE componentes shadcn/ui existentes**:

```typescript
// ✅ CORRETO
// ❌ ERRADO - Não criar componentes customizados sem necessidade
import { MyButton } from "@/components/custom/my-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
```

**Tema e Cores**:

- Tema principal: `Neutral`
- Ícones: Lucide React
- Notificações: Sonner (toast)
- Validação: react-hook-form + zod

### ✅ REGRA CRÍTICA #5: Validação de Dados

**Sempre usar Zod para validação**:

```typescript
import { z } from "zod"

const schema = z.object({
  name: z.string().min(3).max(200),
  type: z.enum(["SINGLE", "SCHEDULED", "RECURRING"]),
})

// Em Server Actions
const validated = schema.parse(data)  // Throws error se inválido

// Em componentes client
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: {...}
})
```

### 🔄 REGRA CRÍTICA #6: Revalidação de Cache

**Sempre revalidar paths após mutações**:

```typescript
import { revalidatePath } from "next/cache"

export async function updateCampaign(id: string, data: any) {
  // ... update no banco

  // Revalidar paths afetados
  revalidatePath("/campaigns")
  revalidatePath(`/campaigns/${id}`)

  return { success: true }
}
```

---

## 4. Arquivos Criados e Responsabilidades

### 📂 Fase 1 - Infrastructure (7 arquivos)

#### `prisma/schema.prisma` (289 linhas)

**Responsabilidade**: Schema completo do banco de dados

**Conteúdo**:

- 8 Models: Campaign, CampaignInstance, ContactList, Contact, CampaignMessage, CampaignJob, CampaignStats
- 7 Enums: CampaignType, CampaignStatus, ContactSource, ContactType, MessageType, JobStatus, UserRole
- Índices otimizados para queries frequentes
- Relacionamentos com cascade delete

**Comandos úteis**:

```bash
npm run db:generate  # Gera Prisma Client
npm run db:migrate   # Aplica migrações
npm run db:studio    # Abre Prisma Studio
```

#### `lib/queue/config.ts` (170 linhas)

**Responsabilidade**: Configuração do BullMQ com Redis

**Exports**:

- `createRedisConnection()` - Singleton do Redis
- `defaultQueueOptions` - Opções padrão das filas
- `campaignWorkerOptions` - Config do campaign worker
- `messageWorkerOptions` - Config do message worker

**Logging**: ✅ 100% implementado

#### `lib/queue/queues.ts` (167 linhas)

**Responsabilidade**: Instâncias das filas BullMQ

**Exports**:

- `campaignQueue` - Fila de processamento de campanhas
- `messageQueue` - Fila de envio de mensagens
- `addCampaignToQueue()` - Helper para adicionar campanha
- `addMessageToQueue()` - Helper para adicionar mensagem
- `setupQueueEventListeners()` - Event handlers

**Logging**: ✅ 100% implementado

#### `lib/queue/workers/campaign-worker.ts` (303 linhas)

**Responsabilidade**: Processa campanhas e cria jobs de mensagens

**Fluxo**:

1. Carrega campanha com instâncias e contatos
2. Valida permissões (Admin/User)
3. Randomiza ou ordena instâncias por prioridade
4. Cria um job de mensagem para cada contato
5. Atualiza estatísticas da campanha

**Rate Limiting**: 100 mensagens/segundo (configurável)

**Logging**: ✅ 100% implementado

#### `lib/queue/workers/message-worker.ts` (380 linhas)

**Responsabilidade**: Envia mensagens via API ZuckZapGo

**Fluxo**:

1. Recebe job com dados da mensagem
2. Tenta enviar via instância atual
3. Se falhar, tenta próxima instância (fallback)
4. Respeita delays entre mensagens
5. Atualiza estatísticas e status do job

**Retry Logic**:

- 3 tentativas por instância (configurável)
- Exponential backoff entre tentativas
- Fallback automático para próxima instância

**Logging**: ✅ 100% implementado

#### `lib/queue/workers/index.ts` (106 linhas)

**Responsabilidade**: Gerenciamento centralizado dos workers

**Exports**:

- `startAllWorkers()` - Inicia todos os workers
- `stopAllWorkers()` - Para todos (graceful shutdown)
- `areWorkersRunning()` - Verifica se estão rodando
- `getWorkersStatus()` - Retorna status detalhado

**Logging**: ✅ 100% implementado

#### `lib/queue/start-workers.ts` (70 linhas)

**Responsabilidade**: Script standalone para rodar workers

**Uso**:

```bash
npm run workers  # Inicia workers em processo separado
```

**Features**:

- Graceful shutdown (SIGINT, SIGTERM)
- Event listeners configurados
- Logs estruturados

**Logging**: ✅ 100% implementado

### 📂 Fase 2 - API & Server Actions (4 arquivos)

#### `app/actions/campaigns.ts` (851 linhas) ✅

**Responsabilidade**: Server Actions para gerenciamento de campanhas

**Functions Exportadas** (16 funções):

**CRUD**:

- `createCampaignAction(data)` - Cria nova campanha
- `updateCampaignAction(id, data)` - Atualiza campanha
- `deleteCampaignAction(id)` - Deleta campanha
- `getCampaignAction(id)` - Busca campanha por ID
- `listCampaignsAction()` - Lista campanhas do usuário

**Instâncias**:

- `addCampaignInstanceAction(campaignId, data)` - Adiciona instância
- `removeCampaignInstanceAction(campaignId, instanceId)` - Remove instância

**Execução**:

- `startCampaignAction(id)` - Inicia campanha
- `pauseCampaignAction(id)` - Pausa campanha
- `cancelCampaignAction(id)` - Cancela campanha

**Workflow**:

- `updateWorkflowAction(id, workflow)` - Atualiza workflow React Flow

**Validações**:

- Permissões (Admin vs User)
- Status da campanha (não editar RUNNING)
- Instâncias mínimas (pelo menos 1)
- Contatos mínimos (pelo menos 1)
- Mensagens mínimas (pelo menos 1)

**Logging**: ✅ 100% implementado

#### `app/actions/contacts.ts` (707 linhas) ✅

**Responsabilidade**: Server Actions para gerenciamento de contatos

**Functions Exportadas** (11 funções):

**CRUD Listas**:

- `createContactListAction(data)` - Cria lista
- `getContactListAction(id)` - Busca lista por ID
- `listContactListsAction()` - Lista todas as listas
- `deleteContactListAction(id)` - Deleta lista

**CRUD Contatos**:

- `addContactAction(listId, data)` - Adiciona contato manual
- `removeContactAction(contactId)` - Remove contato

**Importação**:

- `importContactsCSVAction(listId, csvContent, options)` - Importa CSV
- `importContactsExcelAction(listId, fileBuffer, options)` - Importa Excel
- `importContactsAPIAction(listId, options)` - Importa da API ZuckZapGo

**Vinculação**:

- `linkContactListToCampaignAction(campaignId, listId)` - Vincula lista
- `unlinkContactListFromCampaignAction(campaignId, listId)` - Desvincula lista

**Validações**:

- Formato JID: `^[\d]+@(s\.whatsapp\.net|g\.us|newsletter|status)$`
- Duplicatas: Ignora contatos já existentes
- Erros: Retorna array de erros com linha/motivo

**Logging**: ✅ 100% implementado

#### `lib/api/zuckzapgo-client.ts` (326 linhas) ✅

**Responsabilidade**: Cliente para integração com API ZuckZapGo

**Functions Exportadas** (9 funções):

**Mensagens Texto/Mídia**:

- `sendTextMessage(token, jid, text)` - Envia texto
- `sendImageMessage(token, jid, imageUrl, caption?)` - Envia imagem
- `sendVideoMessage(token, jid, videoUrl, caption?)` - Envia vídeo
- `sendAudioMessage(token, jid, audioUrl)` - Envia áudio
- `sendDocumentMessage(token, jid, documentUrl, filename?)` - Envia documento

**Mensagens Interativas**:

- `sendButtonsMessage(token, jid, text, buttons)` - Envia botões
- `sendListMessage(token, jid, text, buttonText, sections)` - Envia lista

**Utilitários**:

- `listContacts(token)` - Lista contatos da instância
- `checkInstanceStatus(token)` - Verifica status da instância

**Error Handling**:

- Try-catch em todas as funções
- Retorna `{ success: boolean, data?, error? }`

**Logging**: ✅ 100% implementado

#### `lib/validations.ts` (+185 linhas) ✅

**Responsabilidade**: Schemas de validação Zod para campanhas

**Schemas Adicionados**:

**Campanha**:

- `createCampaignSchema` - Validação de criação
- `updateCampaignSchema` - Validação de atualização
- `addCampaignInstanceSchema` - Validação de instância

**Contatos**:

- `createContactListSchema` - Validação de lista
- `addContactSchema` - Validação de contato
- `importContactsCSVSchema` - Validação de import CSV
- `importContactsExcelSchema` - Validação de import Excel
- `importContactsAPISchema` - Validação de import API

**Workflow**:

- `workflowSchema` - Validação de workflow React Flow
- `addCampaignMessageSchema` - Validação de mensagem

**Type Inference**:

- Todos os schemas exportam tipos TypeScript inferidos
- Exemplo: `CreateCampaignFormData`, `AddContactFormData`

---

## 5. Fase 1: Setup & Infrastructure ✅ 100%

### ✅ Status: COMPLETO

**Duração**: ~4 horas
**LOC Total**: ~1200 linhas
**Arquivos**: 7

### Checklist Completo

- [x] Dependências instaladas (BullMQ, Prisma, React Flow, Papa Parse, XLSX)
- [x] Schema Prisma completo (8 models, 7 enums)
- [x] Migrações aplicadas no PostgreSQL 18
- [x] Sistema de filas BullMQ configurado
- [x] Workers implementados e testados
- [x] **Sistema de logging centralizado 100% implementado**
- [x] Docker Compose (PostgreSQL + Redis)
- [x] Scripts npm configurados
- [x] Variáveis de ambiente (.env)

### Configuração do Ambiente

#### `docker-compose.yml`

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:18
    container_name: manager-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: manager_zuckzapgo
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: manager-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

volumes:
  postgres-data:
  redis-data:
```

#### `.env`

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/manager_zuckzapgo?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# BullMQ Workers
WORKER_CONCURRENCY=50              # Concorrência de message workers
CAMPAIGN_WORKER_CONCURRENCY=5      # Concorrência de campaign workers
MESSAGE_RATE_LIMIT_MAX=100         # Max mensagens por segundo
MESSAGE_RATE_LIMIT_DURATION=1000   # Duração do rate limit (ms)

# ZuckZapGo API
NEXT_PUBLIC_API_URL=http://localhost:8080

# Logging (desenvolvimento)
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=true
NEXT_PUBLIC_LOG_FORMAT=pretty
```

### Scripts npm

```json
{
  "scripts": {
    "workers": "tsx lib/queue/start-workers.ts",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:prod": "prisma migrate deploy",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:restart": "docker-compose restart"
  }
}
```

### Como Usar

```bash
# 1. Subir infraestrutura
npm run docker:up

# 2. Aplicar migrações
npm run db:migrate

# 3. Gerar Prisma Client
npm run db:generate

# 4. Iniciar workers (em terminal separado)
npm run workers

# 5. Iniciar Next.js
npm run dev
```

---

## 6. Fase 2: API & Server Actions ✅ 100%

### ✅ Status: COMPLETO

**Progresso**: 100% (10/10 tarefas)
**Duração Estimada**: ~6 horas total (6 horas concluídas)
**LOC Total**: ~3200 linhas
**Arquivos**: 6 arquivos (todos completados)

### Checklist Detalhado

#### ✅ Concluído (100%)

- [x] **Server Actions de Campanhas** (`app/actions/campaigns.ts`)
  - [x] CRUD completo (create, read, update, delete, list)
  - [x] Gerenciamento de instâncias (add, remove)
  - [x] Controle de execução (start, pause, cancel)
  - [x] Atualização de workflow
  - [x] Validação de permissões (Admin/User)
  - [x] Integração com BullMQ queue
  - [x] Logging 100% implementado

- [x] **Server Actions de Contatos** (`app/actions/contacts.ts`)
  - [x] CRUD de listas de contatos
  - [x] CRUD de contatos individuais
  - [x] Importação CSV com Papa Parse
  - [x] Importação Excel com XLSX
  - [x] Importação via API ZuckZapGo
  - [x] Vinculação com campanhas
  - [x] Validação de JIDs
  - [x] Logging 100% implementado

- [x] **Cliente API ZuckZapGo** (`lib/api/zuckzapgo-client.ts`)
  - [x] Envio de mensagens texto
  - [x] Envio de mídias (imagem, vídeo, áudio, documento)
  - [x] Mensagens interativas (botões, listas)
  - [x] Listagem de contatos
  - [x] Verificação de status
  - [x] Error handling completo
  - [x] Logging 100% implementado

- [x] **Schemas de Validação** (`lib/validations.ts`)
  - [x] Schemas de campanha (create, update, instance)
  - [x] Schemas de contatos (create list, add contact)
  - [x] Schemas de importação (CSV, Excel, API)
  - [x] Schemas de workflow
  - [x] Schemas de mensagens
  - [x] Type inference TypeScript

- [x] **API Route de Stats** (`app/api/campaigns/[id]/stats/route.ts`)
  - [x] GET endpoint para stats em tempo real
  - [x] Server-Sent Events (SSE) para streaming
  - [x] Atualização automática a cada 2 segundos
  - [x] Validação de permissões (Admin/User)
  - [x] Estatísticas por instância
  - [x] Taxa de sucesso calculada
  - [x] Logging 100% implementado

- [x] **Sistema de Agendamento** (`lib/queue/scheduler.ts`)
  - [x] Cron job para verificar campanhas agendadas (SCHEDULED)
  - [x] Cron job para campanhas recorrentes (RECURRING)
  - [x] Suporte a timezone configurável
  - [x] Registro/desregistro de jobs
  - [x] Verificação periódica (60s default)
  - [x] Integração com BullMQ campaign queue
  - [x] Graceful shutdown (SIGINT/SIGTERM)
  - [x] Logging 100% implementado

#### ⏳ Pendente (Fase 3+)

- [ ] **Testes Unitários**
  - [ ] Testar Server Actions de campanhas
  - [ ] Testar Server Actions de contatos
  - [ ] Testar cliente API ZuckZapGo
  - [ ] Testar importação CSV/Excel
  - [ ] Testar scheduler
  - [ ] Testar stats API

- [ ] **Testes de Integração**
  - [ ] Testar fluxo completo de campanha
  - [ ] Testar fallback entre instâncias
  - [ ] Testar importação de contatos
  - [ ] Testar agendamento (SCHEDULED/RECURRING)

### ✅ Fase 2 Completa - Resumo da Implementação

#### `app/api/campaigns/[id]/stats/route.ts`

**Objetivo**: API Route para retornar estatísticas em tempo real

**Código para implementar**:

```typescript
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { getRole, getToken } from "@/lib/auth"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma/client"

export const dynamic = "force-dynamic" // Disable caching

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const campaignId = params.id

  try {
    logger.debug("API: Getting campaign stats", null, {
      component: "CampaignsStatsAPI",
      action: "GET",
      metadata: { campaignId },
    })

    // Validar autenticação
    const cookieStore = await cookies()
    const role = getRole(cookieStore)
    const userId = getToken(cookieStore)

    if (!role || !userId) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Buscar campanha para validar permissão
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { userId: true },
    })

    if (!campaign) {
      return NextResponse.json({ error: "Campanha não encontrada" }, { status: 404 })
    }

    // Validar permissão
    if (role !== "admin" && campaign.userId !== userId) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 })
    }

    // Buscar estatísticas
    const stats = await prisma.campaignStats.findUnique({
      where: { campaignId },
      include: {
        campaign: {
          select: {
            status: true,
            startedAt: true,
            completedAt: true,
          },
        },
      },
    })

    if (!stats) {
      return NextResponse.json({ error: "Estatísticas não encontradas" }, { status: 404 })
    }

    logger.success("API: Stats retrieved successfully", null, {
      component: "CampaignsStatsAPI",
      action: "GET",
      metadata: { campaignId, messagesSent: stats.messagesSent },
    })

    return NextResponse.json(stats)
  } catch (error) {
    logger.error("API: Error getting campaign stats", error instanceof Error ? error : undefined, {
      component: "CampaignsStatsAPI",
      action: "GET",
      metadata: { campaignId },
    })

    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 })
  }
}
```

**Uso no componente client**:

```typescript
"use client"

import { useEffect, useState } from "react"

export function CampaignStats({ campaignId }: { campaignId: string }) {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/stats`)
      const data = await res.json()
      setStats(data)
    }

    // Buscar a cada 2 segundos
    const interval = setInterval(fetchStats, 2000)
    fetchStats() // Buscar imediatamente

    return () => clearInterval(interval)
  }, [campaignId])

  return (
    <div>
      {stats && (
        <>
          <p>Enviadas: {stats.messagesSent}</p>
          <p>Falhadas: {stats.messagesFailed}</p>
          <p>Pendentes: {stats.messagesPending}</p>
        </>
      )}
    </div>
  )
}
```

#### `lib/queue/scheduler.ts`

**Objetivo**: Sistema de agendamento com cron para campanhas recorrentes

**Código para implementar**:

```typescript
import { parseExpression } from "cron-parser"
import cron from "node-cron"

import { CampaignStatus, CampaignType } from "@/lib/generated/prisma"
import { logger } from "@/lib/logger"
import { prisma } from "@/lib/prisma/client"

import { addCampaignToQueue } from "./queues"

let schedulerRunning = false

/**
 * Inicia o scheduler de campanhas
 */
export function startScheduler() {
  if (schedulerRunning) {
    logger.warn("Scheduler already running", null, {
      component: "CampaignScheduler",
      action: "startScheduler",
    })
    return
  }

  logger.info("Starting campaign scheduler", null, {
    component: "CampaignScheduler",
    action: "startScheduler",
  })

  // Verifica campanhas agendadas a cada minuto
  cron.schedule("* * * * *", async () => {
    try {
      await processScheduledCampaigns()
      await processRecurringCampaigns()
    } catch (error) {
      logger.error("Scheduler error", error instanceof Error ? error : undefined, {
        component: "CampaignScheduler",
        action: "schedule",
      })
    }
  })

  schedulerRunning = true

  logger.success("Campaign scheduler started", null, {
    component: "CampaignScheduler",
    action: "startScheduler",
  })
}

/**
 * Para o scheduler
 */
export function stopScheduler() {
  schedulerRunning = false
  logger.info("Campaign scheduler stopped", null, {
    component: "CampaignScheduler",
    action: "stopScheduler",
  })
}

/**
 * Processa campanhas agendadas (tipo SCHEDULED)
 */
async function processScheduledCampaigns() {
  const now = new Date()

  const scheduledCampaigns = await prisma.campaign.findMany({
    where: {
      type: CampaignType.SCHEDULED,
      status: CampaignStatus.SCHEDULED,
      scheduledAt: {
        lte: now,
      },
    },
  })

  for (const campaign of scheduledCampaigns) {
    logger.info("Enqueuing scheduled campaign", null, {
      component: "CampaignScheduler",
      action: "processScheduledCampaigns",
      metadata: {
        campaignId: campaign.id,
        scheduledAt: campaign.scheduledAt,
      },
    })

    // Adicionar à fila
    await addCampaignToQueue({
      campaignId: campaign.id,
      userId: campaign.userId,
    })

    // Atualizar status para RUNNING
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        status: CampaignStatus.RUNNING,
        startedAt: now,
      },
    })
  }

  if (scheduledCampaigns.length > 0) {
    logger.success("Scheduled campaigns processed", null, {
      component: "CampaignScheduler",
      action: "processScheduledCampaigns",
      metadata: { count: scheduledCampaigns.length },
    })
  }
}

/**
 * Processa campanhas recorrentes (tipo RECURRING)
 */
async function processRecurringCampaigns() {
  const recurringCampaigns = await prisma.campaign.findMany({
    where: {
      type: CampaignType.RECURRING,
      status: {
        in: [CampaignStatus.SCHEDULED, CampaignStatus.RUNNING],
      },
      cronExpression: {
        not: null,
      },
    },
  })

  for (const campaign of recurringCampaigns) {
    if (!campaign.cronExpression) continue

    try {
      // Verificar se deve executar agora
      const interval = parseExpression(campaign.cronExpression, {
        currentDate: new Date(),
        tz: campaign.timezone || "America/Sao_Paulo",
      })

      const next = interval.next().toDate()
      const now = new Date()

      // Se a próxima execução é daqui a menos de 1 minuto, executar
      const diff = next.getTime() - now.getTime()
      if (diff < 60000 && diff > 0) {
        logger.info("Enqueuing recurring campaign", null, {
          component: "CampaignScheduler",
          action: "processRecurringCampaigns",
          metadata: {
            campaignId: campaign.id,
            cronExpression: campaign.cronExpression,
            nextExecution: next,
          },
        })

        // Adicionar à fila
        await addCampaignToQueue({
          campaignId: campaign.id,
          userId: campaign.userId,
        })

        // Atualizar última execução
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: {
            startedAt: now,
          },
        })
      }
    } catch (error) {
      logger.error(
        "Error processing recurring campaign",
        error instanceof Error ? error : undefined,
        {
          component: "CampaignScheduler",
          action: "processRecurringCampaigns",
          metadata: {
            campaignId: campaign.id,
            cronExpression: campaign.cronExpression,
          },
        }
      )
    }
  }
}

/**
 * Valida uma cron expression
 */
export function validateCronExpression(expression: string): boolean {
  try {
    parseExpression(expression)
    return true
  } catch {
    return false
  }
}

/**
 * Retorna as próximas N execuções de uma cron expression
 */
export function getNextExecutions(
  expression: string,
  count: number = 5,
  timezone: string = "America/Sao_Paulo"
): Date[] {
  try {
    const interval = parseExpression(expression, {
      currentDate: new Date(),
      tz: timezone,
    })

    const executions: Date[] = []
    for (let i = 0; i < count; i++) {
      executions.push(interval.next().toDate())
    }

    return executions
  } catch (error) {
    logger.error("Error getting next executions", error instanceof Error ? error : undefined, {
      component: "CampaignScheduler",
      action: "getNextExecutions",
      metadata: { expression, timezone },
    })
    return []
  }
}
```

**Integração com workers** (`lib/queue/start-workers.ts`):

```typescript
// ADICIONAR
import { logger } from "@/lib/logger"

import { setupQueueEventListeners } from "./queues"
import { startScheduler, stopScheduler } from "./scheduler"
import { startAllWorkers, stopAllWorkers } from "./workers"

async function main() {
  try {
    // Setup event listeners
    setupQueueEventListeners()

    // Start all workers
    await startAllWorkers()

    // Start scheduler  // ADICIONAR
    startScheduler()

    logger.success("Workers and scheduler are running!", null, {
      component: "WorkerStartup",
      action: "main",
    })

    // Graceful shutdown
    process.on("SIGINT", async () => {
      logger.warn("Shutting down workers and scheduler...", null, {
        component: "WorkerStartup",
        action: "shutdown",
      })
      stopScheduler() // ADICIONAR
      await stopAllWorkers()
      process.exit(0)
    })
  } catch (error) {
    logger.error("Failed to start workers", error, {
      component: "WorkerStartup",
      action: "main",
    })
    process.exit(1)
  }
}

main()
```

### ✅ Fase 2 100% Completa!

**Todos os arquivos da Fase 2 foram criados e implementados com sucesso:**

1. ✅ **Server Actions** - CRUD completo para campanhas e contatos
2. ✅ **API Client** - Integração com ZuckZapGo API
3. ✅ **Validation** - Schemas Zod para todas as operações
4. ✅ **Scheduler** - Sistema de agendamento com cron jobs
5. ✅ **Stats API** - Endpoint com Server-Sent Events
6. ✅ **Logging** - 100% usando sistema centralizado

**Próximo: Iniciar Fase 3 - Workflow Editor (React Flow)**

---

## 7. Fase 3: Workflow Editor (React Flow) ⏳ 0%

### ⏳ Status: PENDENTE

**Dependências**: Fase 2 100% completa
**Progresso**: 0%
**Duração Estimada**: ~8 horas
**LOC Estimado**: ~1200 linhas
**Arquivos Estimados**: 8

### Checklist Detalhado

- [ ] **Instalação e Configuração** (30 min)
  - [ ] Verificar React Flow já instalado (`reactflow@11.11.4`)
  - [ ] Importar estilos CSS do React Flow
  - [ ] Configurar tipos TypeScript

- [ ] **Componente Principal** (2 horas)
  - [ ] Criar `components/campaign/workflow-editor.tsx`
  - [ ] Implementar drag and drop de nodes
  - [ ] Implementar conexões entre nodes
  - [ ] Validação de workflow (sem loops, start/end correto)
  - [ ] Salvar/carregar workflow

- [ ] **Nodes Customizados** (4 horas)
  - [ ] `nodes/text-message-node.tsx` - Mensagem de texto
  - [ ] `nodes/media-message-node.tsx` - Imagem/vídeo/áudio/documento
  - [ ] `nodes/delay-node.tsx` - Delay entre mensagens
  - [ ] `nodes/interactive-node.tsx` - Botões/listas
  - [ ] `nodes/start-node.tsx` - Node inicial
  - [ ] `nodes/end-node.tsx` - Node final

- [ ] **Sidebar de Componentes** (1 hora)
  - [ ] Criar `components/campaign/workflow-sidebar.tsx`
  - [ ] Listar nodes disponíveis
  - [ ] Implementar drag from sidebar
  - [ ] Categorização de nodes

- [ ] **Preview de Mensagens** (30 min)
  - [ ] Criar `components/campaign/message-preview.tsx`
  - [ ] Preview de texto
  - [ ] Preview de mídia
  - [ ] Preview de botões/listas

### Implementação

#### `components/campaign/workflow-editor.tsx`

**Objetivo**: Editor visual de workflow com React Flow

**Código para implementar**:

```typescript
"use client"

import { useCallback, useEffect, useState } from "react"
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Connection,
  EdgeChange,
  NodeChange,
} from "reactflow"
import "reactflow/dist/style.css"
import { logger } from "@/lib/logger"

// Nodes customizados
import { TextMessageNode } from "./nodes/text-message-node"
import { MediaMessageNode } from "./nodes/media-message-node"
import { DelayNode } from "./nodes/delay-node"
import { InteractiveNode } from "./nodes/interactive-node"
import { StartNode } from "./nodes/start-node"
import { EndNode } from "./nodes/end-node"

const nodeTypes = {
  start: StartNode,
  textMessage: TextMessageNode,
  mediaMessage: MediaMessageNode,
  delay: DelayNode,
  interactive: InteractiveNode,
  end: EndNode,
}

interface WorkflowEditorProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onChange: (workflow: { nodes: Node[]; edges: Edge[] }) => void
  readOnly?: boolean
}

export function WorkflowEditor({
  initialNodes = [],
  initialEdges = [],
  onChange,
  readOnly = false,
}: WorkflowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => {
      logger.debug("Workflow: Connecting nodes", null, {
        component: "WorkflowEditor",
        action: "onConnect",
        metadata: { source: params.source, target: params.target },
      })

      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  // Notificar mudanças para o componente pai
  useEffect(() => {
    if (!readOnly) {
      onChange({ nodes, edges })
    }
  }, [nodes, edges, onChange, readOnly])

  const onNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (readOnly) return

      logger.debug("Workflow: Node double clicked", null, {
        component: "WorkflowEditor",
        action: "onNodeDoubleClick",
        metadata: { nodeId: node.id, nodeType: node.type },
      })

      // Abrir modal de edição do node
      // TODO: Implementar modal de edição
    },
    [readOnly]
  )

  const onEdgeDoubleClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      if (readOnly) return

      logger.debug("Workflow: Edge double clicked", null, {
        component: "WorkflowEditor",
        action: "onEdgeDoubleClick",
        metadata: { edgeId: edge.id },
      })

      // Remover edge
      setEdges((eds) => eds.filter((e) => e.id !== edge.id))
    },
    [readOnly, setEdges]
  )

  const validateWorkflow = useCallback(() => {
    logger.debug("Workflow: Validating workflow", null, {
      component: "WorkflowEditor",
      action: "validateWorkflow",
      metadata: { nodeCount: nodes.length, edgeCount: edges.length },
    })

    // Verificar se tem pelo menos um node de start
    const startNodes = nodes.filter((n) => n.type === "start")
    if (startNodes.length === 0) {
      return { valid: false, error: "Workflow precisa ter um node de início" }
    }

    // Verificar se tem pelo menos um node de end
    const endNodes = nodes.filter((n) => n.type === "end")
    if (endNodes.length === 0) {
      return { valid: false, error: "Workflow precisa ter um node de fim" }
    }

    // Verificar se todos os nodes estão conectados
    const connectedNodes = new Set<string>()
    edges.forEach((edge) => {
      connectedNodes.add(edge.source)
      connectedNodes.add(edge.target)
    })

    const unconnectedNodes = nodes.filter(
      (node) => !connectedNodes.has(node.id) && node.type !== "start"
    )

    if (unconnectedNodes.length > 0) {
      return {
        valid: false,
        error: `Nodes desconectados: ${unconnectedNodes.map((n) => n.id).join(", ")}`,
      }
    }

    logger.success("Workflow: Validation passed", null, {
      component: "WorkflowEditor",
      action: "validateWorkflow",
    })

    return { valid: true }
  }, [nodes, edges])

  return (
    <div className="h-[600px] border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeDoubleClick={onEdgeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {!readOnly && (
        <div className="p-4 border-t">
          <button
            onClick={() => {
              const result = validateWorkflow()
              if (result.valid) {
                alert("Workflow válido!")
              } else {
                alert(result.error)
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Validar Workflow
          </button>
        </div>
      )}
    </div>
  )
}
```

#### `components/campaign/nodes/text-message-node.tsx`

**Objetivo**: Node customizado para mensagem de texto

**Código para implementar**:

```typescript
"use client"

import { memo } from "react"
import { Handle, Position, NodeProps } from "reactflow"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare } from "lucide-react"

interface TextMessageData {
  text: string
  delayMs: number
  onChange?: (data: Partial<TextMessageData>) => void
}

export const TextMessageNode = memo(({ data }: NodeProps<TextMessageData>) => {
  const handleTextChange = (text: string) => {
    data.onChange?.({ text })
  }

  const handleDelayChange = (delayMs: number) => {
    data.onChange?.({ delayMs })
  }

  return (
    <Card className="min-w-[300px] p-4 shadow-lg">
      <Handle type="target" position={Position.Top} />

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MessageSquare className="w-4 h-4" />
          <span>Mensagem de Texto</span>
        </div>

        <div className="space-y-2">
          <Label>Texto da mensagem</Label>
          <Textarea
            value={data.text || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Digite sua mensagem..."
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Delay após envio (ms)</Label>
          <Input
            type="number"
            value={data.delayMs || 0}
            onChange={(e) => handleDelayChange(parseInt(e.target.value) || 0)}
            placeholder="0"
            min="0"
            step="1000"
          />
          <p className="text-xs text-muted-foreground">
            {data.delayMs ? `${data.delayMs / 1000} segundos` : "Sem delay"}
          </p>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </Card>
  )
})

TextMessageNode.displayName = "TextMessageNode"
```

#### `components/campaign/workflow-sidebar.tsx`

**Objetivo**: Sidebar com nodes disponíveis para arrastar

**Código para implementar**:

```typescript
"use client"

import { Card } from "@/components/ui/card"
import {
  MessageSquare,
  Image,
  Clock,
  MousePointerClick,
  PlayCircle,
  StopCircle
} from "lucide-react"

interface NodeTemplate {
  id: string
  type: string
  icon: React.ElementType
  label: string
  description: string
  color: string
}

const nodeTemplates: NodeTemplate[] = [
  {
    id: "start",
    type: "start",
    icon: PlayCircle,
    label: "Início",
    description: "Node inicial do workflow",
    color: "text-green-500",
  },
  {
    id: "text",
    type: "textMessage",
    icon: MessageSquare,
    label: "Mensagem de Texto",
    description: "Enviar mensagem de texto simples",
    color: "text-blue-500",
  },
  {
    id: "media",
    type: "mediaMessage",
    icon: Image,
    label: "Mídia",
    description: "Enviar imagem, vídeo, áudio ou documento",
    color: "text-purple-500",
  },
  {
    id: "interactive",
    type: "interactive",
    icon: MousePointerClick,
    label: "Mensagem Interativa",
    description: "Botões ou listas interativas",
    color: "text-orange-500",
  },
  {
    id: "delay",
    type: "delay",
    icon: Clock,
    label: "Delay",
    description: "Aguardar antes da próxima mensagem",
    color: "text-yellow-500",
  },
  {
    id: "end",
    type: "end",
    icon: StopCircle,
    label: "Fim",
    description: "Node final do workflow",
    color: "text-red-500",
  },
]

interface WorkflowSidebarProps {
  onDragStart: (event: React.DragEvent, template: NodeTemplate) => void
}

export function WorkflowSidebar({ onDragStart }: WorkflowSidebarProps) {
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div>
        <h3 className="font-semibold text-lg">Componentes</h3>
        <p className="text-sm text-muted-foreground">
          Arraste para adicionar ao workflow
        </p>
      </div>

      <div className="space-y-2">
        {nodeTemplates.map((template) => (
          <Card
            key={template.id}
            className="p-3 cursor-move hover:bg-accent hover:shadow-md transition-all"
            draggable
            onDragStart={(e) => onDragStart(e, template)}
          >
            <div className="flex items-start gap-3">
              <template.icon className={`w-5 h-5 mt-0.5 ${template.color}`} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{template.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {template.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### Próximos Passos para Fase 3

**1. Criar diretórios** (5 min)

```bash
mkdir -p components/campaign/nodes
```

**2. Criar componente principal** (2 horas)

- Implementar `workflow-editor.tsx`
- Testar drag and drop básico
- Implementar validação de workflow

**3. Criar nodes customizados** (4 horas)

- Um node por vez
- Testar cada node individualmente
- Validar dados de cada node

**4. Criar sidebar** (1 hora)

- Implementar drag from sidebar
- Categorizar nodes
- Adicionar tooltips

**5. Integrar com campanha** (1 hora)

- Salvar workflow no banco
- Carregar workflow existente
- Validar antes de salvar

**Estimativa total: 8 horas**

---

## 8. Fase 4: Gerenciamento de Contatos (UI) ✅ 100%

### ✅ Status: COMPLETO

**Progresso**: 100% (7/7 arquivos)
**Duração Total**: ~6 horas
**LOC Total**: ~950 linhas

### Arquivos Criados

1. ✅ `app/admin/campaigns/contacts/page.tsx` - Lista de contatos
2. ✅ `app/admin/campaigns/contacts/[id]/page.tsx` - Detalhes da lista
3. ✅ `app/admin/campaigns/contacts/new/page.tsx` - Nova lista
4. ✅ `components/campaign/import-csv-dialog.tsx` - Importação CSV
5. ✅ `components/campaign/import-excel-dialog.tsx` - Importação Excel
6. ✅ `components/campaign/import-api-dialog.tsx` - Importação API
7. ✅ DataTable columns e filtros

**Features Implementadas**:

- ✅ CRUD completo de listas de contatos
- ✅ Importação CSV com Papa Parse
- ✅ Importação Excel com XLSX
- ✅ Importação via API ZuckZapGo
- ✅ Validação de JIDs WhatsApp
- ✅ Preview antes de importar
- ✅ Tratamento de erros por linha

---

## 9. Fase 5: Sistema de Agendamento ✅ 100%

### ✅ Status: COMPLETO

**Progresso**: 100% (5/5 arquivos)
**Duração Total**: ~5 horas
**LOC Total**: ~1300 linhas

### Arquivos Criados

1. ✅ `components/campaign/calendar-view.tsx` (300 linhas)
   - Calendário visual com react-big-calendar
   - Visualização de campanhas agendadas
   - Navegação por mês/semana/dia/agenda
   - Event details dialog
   - Status colors (scheduled, running, completed, failed)

2. ✅ `components/campaign/cron-editor.tsx` (250 linhas)
   - Editor visual de expressões cron
   - Modo simples (minute, hourly, daily, weekly, monthly)
   - Modo avançado (expressão cron direta)
   - Validação de expressões
   - Preview em português com cronstrue

3. ✅ `components/campaign/timezone-selector.tsx` (200 linhas)
   - Seletor de fuso horário
   - 60+ timezones (Brasil + mundo)
   - Agrupamento por região
   - Busca de timezone
   - Preview de horário atual

4. ✅ `components/campaign/schedule-preview.tsx` (180 linhas)
   - Preview das próximas 5 execuções
   - Cálculo baseado em cron expression + timezone
   - Tempo relativo (em X minutos/horas/dias)
   - Atualização automática a cada minuto

5. ✅ `app/admin/campaigns/schedule/page.tsx` (200 linhas)
   - Página de agendamento
   - Integração com calendar-view
   - Exemplos de uso de todos os componentes

**Features Implementadas**:

- ✅ Calendário visual com react-big-calendar 4.1.3
- ✅ Editor de cron com modo simples e avançado
- ✅ Suporte a 60+ timezones
- ✅ Preview de próximas execuções
- ✅ Validação de expressões cron
- ✅ Conversão para português com cronstrue
- ✅ Integração com date-fns-tz

**Dependências Adicionadas**:

```json
{
  "react-big-calendar": "^1.15.0",
  "cronstrue": "^2.50.0",
  "@types/react-big-calendar": "^1.8.12"
}
```

---

## 10. Fase 6: Monitoramento & Estatísticas ✅ 100%

### ✅ Status: COMPLETO

**Progresso**: 100% (8/8 arquivos)
**Duração Total**: ~7 horas
**LOC Total**: ~1800 linhas

### Arquivos Criados

1. ✅ `app/admin/campaigns/analytics/page.tsx` (250 linhas)
   - Página de analytics Server Component
   - Quick stats cards (4 métricas principais)
   - Integração com todos os componentes
   - Top campaigns table
   - Informações sobre métricas

2. ✅ `components/campaign/stats-dashboard.tsx` (180 linhas)
   - Dashboard principal de estatísticas
   - Auto-refresh via polling (30s default)
   - Tabs para diferentes visualizações
   - Status indicator com timestamp

3. ✅ `components/campaign/charts/messages-timeline.tsx` (120 linhas)
   - Gráfico de linha com Recharts
   - Timeline de mensagens (enviadas/entregues/falhas)
   - Formatação de datas com date-fns

4. ✅ `components/campaign/charts/status-distribution.tsx` (100 linhas)
   - Gráfico de pizza com Recharts
   - Distribuição de status (entregue vs falhou)
   - Percentuais e totais

5. ✅ `components/campaign/charts/instance-performance.tsx` (120 linhas)
   - Gráfico de barras com Recharts
   - Performance por instância
   - Taxa de entrega por instância

6. ✅ `components/campaign/filters/advanced-filters.tsx` (280 linhas)
   - Filtros avançados expansíveis
   - Filtros por data (dateFrom, dateTo)
   - Filtros por status, instância, campanha
   - Busca por nome
   - Contador de filtros ativos

7. ✅ `components/campaign/export-data.tsx` (220 linhas)
   - Exportação multi-formato
   - CSV com Papa Parse
   - Excel com XLSX
   - JSON nativo
   - Dropdown menu com ícones

8. ✅ `app/api/campaigns/export/route.ts` (150 linhas)
   - API Route para export (GET + POST)
   - Suporte a filtros via query params
   - Content-Disposition headers
   - Logging completo

**Features Implementadas**:

- ✅ Dashboard com 3 tipos de gráficos (Recharts 3.3.0)
- ✅ Auto-refresh a cada 30 segundos
- ✅ Filtros avançados expansíveis
- ✅ Exportação em 3 formatos (CSV, Excel, JSON)
- ✅ API endpoint para export com filtros
- ✅ Quick stats cards
- ✅ Top campaigns ranking
- ✅ Logging 100% implementado

**Bibliotecas Utilizadas**:

- Recharts 3.3.0 (já instalado)
- Papa Parse 5.5.3 (já instalado)
- XLSX 0.18.5 (já instalado)

---

## 11. Fase 4: Gerenciamento de Contatos (UI) ⏳ 0%

### ⏳ Status: PENDENTE

**Dependências**: Fase 2 100% completa
**Progresso**: 0%
**Duração Estimada**: ~6 horas
**LOC Estimado**: ~800 linhas
**Arquivos Estimados**: 6

### Checklist Detalhado

- [ ] **Páginas** (2 horas)
  - [ ] `app/(admin)/campaigns/contacts/page.tsx` - Lista de listas
  - [ ] `app/(admin)/campaigns/contacts/[id]/page.tsx` - Detalhes da lista
  - [ ] `app/(admin)/campaigns/contacts/new/page.tsx` - Criar lista

- [ ] **Componentes de Importação** (3 horas)
  - [ ] `components/campaign/import-csv-dialog.tsx` - Importar CSV
  - [ ] `components/campaign/import-excel-dialog.tsx` - Importar Excel
  - [ ] `components/campaign/import-api-dialog.tsx` - Importar API ZuckZapGo
  - [ ] Validação de JIDs
  - [ ] Preview antes de importar

- [ ] **Tabelas** (1 hora)
  - [ ] Colunas para lista de listas
  - [ ] Colunas para contatos
  - [ ] Filtros e busca
  - [ ] Ações (editar, deletar, importar)

### Implementação

#### `app/(admin)/campaigns/contacts/page.tsx`

**Objetivo**: Página de listagem de listas de contatos

**Código para implementar**:

```typescript
import { DataTable } from "@/components/custom/data-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { listContactListsAction } from "@/app/actions/contacts"
import { columns } from "./_components/columns"

export default async function ContactListsPage() {
  const result = await listContactListsAction()

  if (!result.success) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Erro</h1>
        <p className="text-red-500">{result.error}</p>
      </div>
    )
  }

  const contactLists = result.data || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Listas de Contatos</h1>
          <p className="text-muted-foreground">
            Gerencie suas listas de contatos para campanhas
          </p>
        </div>

        <Link href="/campaigns/contacts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Lista
          </Button>
        </Link>
      </div>

      <DataTable columns={columns} data={contactLists} />
    </div>
  )
}
```

#### `components/campaign/import-csv-dialog.tsx`

**Objetivo**: Dialog para importação de contatos via CSV

**Código para implementar**:

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { importContactsCSVAction } from "@/app/actions/contacts"

interface ImportCSVDialogProps {
  listId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportCSVDialog({
  listId,
  open,
  onOpenChange,
}: ImportCSVDialogProps) {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [hasHeader, setHasHeader] = useState(true)
  const [jidColumn, setJidColumn] = useState(0)
  const [nameColumn, setNameColumn] = useState<number | undefined>(1)
  const [delimiter, setDelimiter] = useState(",")
  const [loading, setLoading] = useState(false)

  const handleImport = async () => {
    if (!file) {
      toast.error("Selecione um arquivo CSV")
      return
    }

    setLoading(true)

    try {
      // Ler arquivo
      const text = await file.text()

      // Importar contatos
      const result = await importContactsCSVAction(listId, text, {
        hasHeader,
        jidColumn,
        nameColumn,
        delimiter,
      })

      if (result.success) {
        toast.success(
          `${result.data.imported} contatos importados com sucesso!`
        )

        if (result.data.skipped > 0) {
          toast.info(`${result.data.skipped} contatos ignorados (duplicados ou inválidos)`)
        }

        if (result.data.errors.length > 0) {
          console.error("Import errors:", result.data.errors)
        }

        onOpenChange(false)
        router.refresh()
      } else {
        toast.error(result.error || "Erro ao importar contatos")
      }
    } catch (error) {
      toast.error("Erro ao processar arquivo CSV")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Contatos (CSV)</DialogTitle>
          <DialogDescription>
            Faça upload de um arquivo CSV com os contatos. O arquivo deve ter
            o número do WhatsApp com DDD e código do país.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csv-file">Arquivo CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="has-header"
              checked={hasHeader}
              onCheckedChange={(checked) => setHasHeader(!!checked)}
            />
            <label
              htmlFor="has-header"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Primeira linha é cabeçalho
            </label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jid-column">Coluna do número (índice)</Label>
            <Input
              id="jid-column"
              type="number"
              min="0"
              value={jidColumn}
              onChange={(e) => setJidColumn(parseInt(e.target.value) || 0)}
            />
            <p className="text-xs text-muted-foreground">
              Índice da coluna com o número do WhatsApp (0 = primeira coluna)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name-column">Coluna do nome (índice - opcional)</Label>
            <Input
              id="name-column"
              type="number"
              min="0"
              value={nameColumn || ""}
              onChange={(e) =>
                setNameColumn(e.target.value ? parseInt(e.target.value) : undefined)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delimiter">Delimitador</Label>
            <Select
              value={delimiter}
              onValueChange={setDelimiter}
            >
              <option value=",">Vírgula (,)</option>
              <option value=";">Ponto e vírgula (;)</option>
              <option value="\t">Tab</option>
            </Select>
          </div>

          <Button
            onClick={handleImport}
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? "Importando..." : "Importar Contatos"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

### Próximos Passos para Fase 4

**1. Criar páginas** (2 horas)

- Lista de listas
- Detalhes da lista
- Nova lista

**2. Criar dialogs de importação** (3 horas)

- CSV
- Excel
- API

**3. Criar tabelas** (1 hora)

- Colunas
- Filtros
- Ações

**Estimativa total: 6 horas**

---

## 9. Fase 5: Sistema de Agendamento ⏳ 0%

### ⏳ Status: PENDENTE

**Dependências**: Fase 2 100% completa, Scheduler implementado
**Progresso**: 0%
**Duração Estimada**: ~4 horas
**LOC Estimado**: ~400 linhas
**Arquivos Estimados**: 2

### Checklist Detalhado

- [ ] **Componente de Agendamento** (2 horas)
  - [ ] `components/campaign/schedule-config.tsx`
  - [ ] Tabs para tipos de campanha (SINGLE, SCHEDULED, RECURRING)
  - [ ] Calendar picker para data
  - [ ] Time picker para hora
  - [ ] Timezone selector
  - [ ] Cron expression builder

- [ ] **Preview de Execuções** (1 hora)
  - [ ] `components/campaign/next-executions-preview.tsx`
  - [ ] Calcular próximas N execuções (cron-parser)
  - [ ] Mostrar datas formatadas
  - [ ] Considerar timezone

- [ ] **Validação** (1 hora)
  - [ ] Validar cron expression
  - [ ] Validar data/hora futura
  - [ ] Validar timezone
  - [ ] Testes de agendamento

### Implementação

_(Código detalhado seria incluído aqui, similar às seções anteriores)_

---

## 10. Fase 6: Monitoramento & Estatísticas ⏳ 0%

### ⏳ Status: PENDENTE

**Dependências**: Fases 2, 3, 4 completas
**Progresso**: 0%
**Duração Estimada**: ~8 horas
**LOC Estimado**: ~1000 linhas
**Arquivos Estimados**: 6

### Checklist Detalhado

- [ ] **Dashboard da Campanha** (3 horas)
  - [ ] `app/(admin)/campaigns/[id]/page.tsx`
  - [ ] Visualização de estatísticas em tempo real
  - [ ] Gráficos de progresso (Recharts)
  - [ ] Status da campanha
  - [ ] Ações (pausar, cancelar, reiniciar)

- [ ] **Componentes de Stats** (3 horas)
  - [ ] `components/campaign/stats-cards.tsx` - Cards de estatísticas
  - [ ] `components/campaign/progress-chart.tsx` - Gráfico de progresso
  - [ ] `components/campaign/jobs-table.tsx` - Tabela de jobs
  - [ ] Atualização automática (polling a cada 2s)

- [ ] **Histórico de Jobs** (2 horas)
  - [ ] Filtros (status, instância, período)
  - [ ] Busca por contato
  - [ ] Paginação
  - [ ] Exportação CSV

### Implementação

_(Código detalhado seria incluído aqui)_

---

## 11. Fase 7: Testes & Refinamentos ⏳ 0%

### ⏳ Status: PENDENTE

**Dependências**: Todas as fases anteriores completas
**Progresso**: 0%
**Duração Estimada**: ~12 horas
**LOC Estimado**: ~1500 linhas
**Arquivos Estimados**: 15

### Checklist Detalhado

- [ ] **Testes Unitários** (4 horas)
  - [ ] Workers (campaign-worker, message-worker)
  - [ ] Server Actions (campaigns, contacts)
  - [ ] API Client (zuckzapgo-client)
  - [ ] Validações (schemas)
  - [ ] Utilit functions

- [ ] **Testes de Integração** (4 horas)
  - [ ] Fluxo completo de campanha
  - [ ] Fallback entre instâncias
  - [ ] Importação de contatos
  - [ ] Agendamento de campanhas
  - [ ] Workflow validation

- [ ] **Testes E2E** (4 horas)
  - [ ] Criação de campanha end-to-end
  - [ ] Importação de contatos
  - [ ] Edição de workflow
  - [ ] Início de campanha
  - [ ] Monitoramento de progresso

### Implementação

_(Código detalhado de testes seria incluído aqui)_

---

## 12. Estrutura Completa de Arquivos

```
manager-zuckzapgo/
├── app/
│   ├── (admin)/
│   │   └── campaigns/
│   │       ├── page.tsx                        # Lista campanhas (Admin)
│   │       ├── new/page.tsx                    # Criar campanha
│   │       ├── [id]/
│   │       │   ├── page.tsx                    # Dashboard campanha
│   │       │   ├── edit/page.tsx               # Editar campanha
│   │       │   └── stats/page.tsx              # Stats detalhadas
│   │       └── contacts/
│   │           ├── page.tsx                    # Lista listas
│   │           ├── new/page.tsx                # Criar lista
│   │           └── [id]/page.tsx               # Detalhes lista
│   ├── (user)/
│   │   └── campaigns/
│   │       ├── page.tsx                        # Lista campanhas (User)
│   │       └── [id]/page.tsx                   # Dashboard campanha
│   ├── actions/
│   │   ├── campaigns.ts                        ✅ 851 linhas
│   │   └── contacts.ts                         ✅ 707 linhas
│   └── api/
│       └── campaigns/
│           └── [id]/
│               └── stats/
│                   └── route.ts                ⏳ Pendente
├── components/
│   └── campaign/
│       ├── workflow-editor.tsx                 ⏳ Pendente
│       ├── workflow-sidebar.tsx                ⏳ Pendente
│       ├── schedule-config.tsx                 ⏳ Pendente
│       ├── stats-cards.tsx                     ⏳ Pendente
│       ├── progress-chart.tsx                  ⏳ Pendente
│       ├── jobs-table.tsx                      ⏳ Pendente
│       ├── import-csv-dialog.tsx               ⏳ Pendente
│       ├── import-excel-dialog.tsx             ⏳ Pendente
│       ├── import-api-dialog.tsx               ⏳ Pendente
│       └── nodes/
│           ├── text-message-node.tsx           ⏳ Pendente
│           ├── media-message-node.tsx          ⏳ Pendente
│           ├── delay-node.tsx                  ⏳ Pendente
│           ├── interactive-node.tsx            ⏳ Pendente
│           ├── start-node.tsx                  ⏳ Pendente
│           └── end-node.tsx                    ⏳ Pendente
├── lib/
│   ├── api/
│   │   └── zuckzapgo-client.ts                 ✅ 326 linhas
│   ├── prisma/
│   │   └── client.ts                           ✅ 50 linhas
│   ├── queue/
│   │   ├── config.ts                           ✅ 170 linhas
│   │   ├── queues.ts                           ✅ 167 linhas
│   │   ├── scheduler.ts                        ⏳ Pendente
│   │   ├── start-workers.ts                    ✅ 70 linhas
│   │   └── workers/
│   │       ├── index.ts                        ✅ 106 linhas
│   │       ├── campaign-worker.ts              ✅ 303 linhas
│   │       └── message-worker.ts               ✅ 380 linhas
│   ├── logger.ts                               ✅ (Projeto)
│   └── validations.ts                          ✅ +185 linhas
├── prisma/
│   ├── schema.prisma                           ✅ 289 linhas
│   └── migrations/                             ✅ Aplicadas
├── __tests__/                                  ⏳ Pendente
│   ├── workers/
│   ├── actions/
│   └── e2e/
├── .env                                        ✅ Configurado
├── docker-compose.yml                          ✅ Configurado
├── package.json                                ✅ Atualizado
└── CAMPAIGNS_MODULE_PLAN.md                    ✅ Este arquivo
```

### Legenda

- ✅ **Completo**: Implementado, testado e com logging
- 🔄 **Em Progresso**: Parcialmente implementado
- ⏳ **Pendente**: Não iniciado

### Estatísticas

| Status          | Arquivos | LOC       | %        |
| --------------- | -------- | --------- | -------- |
| ✅ Completo     | 11       | ~3269     | 22.9%    |
| 🔄 Em Progresso | 2        | ~500      | 3.5%     |
| ⏳ Pendente     | 32       | ~5000     | 73.6%    |
| **TOTAL**       | **45**   | **~8769** | **100%** |

---

## 13. Dependências entre Fases

```mermaid
graph TD
    F1[Fase 1: Infrastructure] --> F2[Fase 2: API & Server Actions]
    F2 --> F3[Fase 3: Workflow Editor]
    F2 --> F4[Fase 4: Contatos UI]
    F2 --> F5[Fase 5: Agendamento]
    F3 --> F6[Fase 6: Monitoramento]
    F4 --> F6
    F5 --> F6
    F6 --> F7[Fase 7: Testes]
```

**Dependências Críticas**:

1. **Fase 2 é bloqueador** para Fases 3, 4, 5
2. **Fase 6 depende** de 3, 4, 5 estarem completas
3. **Fase 7 deve** ser a última (testa tudo)

**Paralelização Possível**:

- Após Fase 2 completa:
  - Fase 3 (Workflow) e Fase 4 (Contatos UI) podem ser desenvolvidas em paralelo
  - Fase 5 (Agendamento) pode ser iniciada independentemente

---

## 14. Checklist Final Global

### ✅ Fase 1: Setup & Infrastructure (100%)

- [x] Dependências instaladas
- [x] Schema Prisma completo (8 models, 7 enums)
- [x] Migrações aplicadas no PostgreSQL 18
- [x] Sistema de filas BullMQ configurado
- [x] Workers implementados (campaign-worker, message-worker)
- [x] **Sistema de logging centralizado 100%**
- [x] Docker Compose (PostgreSQL + Redis)
- [x] Scripts npm configurados
- [x] Variáveis de ambiente (.env)

### ✅ Fase 2: API & Server Actions (100%)

- [x] Server Actions de campanhas (`app/actions/campaigns.ts`)
- [x] Server Actions de contatos (`app/actions/contacts.ts`)
- [x] Cliente API ZuckZapGo (`lib/api/zuckzapgo-client.ts`)
- [x] Schemas de validação (`lib/validations.ts`)
- [x] API Route de stats em tempo real (`app/api/campaigns/[id]/stats/route.ts`)
- [x] Sistema de agendamento (`lib/queue/scheduler.ts`)
- [ ] Testes unitários (movido para Fase 7)
- [ ] Testes de integração (movido para Fase 7)

### ⏳ Fase 3: Workflow Editor (0%)

- [ ] Componente principal (`workflow-editor.tsx`)
- [ ] Nodes customizados (6 nodes)
- [ ] Sidebar com drag and drop
- [ ] Validação de workflow
- [ ] Preview de mensagens

### ⏳ Fase 4: Contatos UI (0%)

- [ ] Páginas (lista, detalhes, nova)
- [ ] Dialog de importação CSV
- [ ] Dialog de importação Excel
- [ ] Dialog de importação API
- [ ] Validação de JIDs
- [ ] Preview de importação

### ⏳ Fase 5: Agendamento (0%)

- [ ] Componente de agendamento
- [ ] Calendar e time pickers
- [ ] Cron expression builder
- [ ] Preview de próximas execuções
- [ ] Validação de timezone

### ⏳ Fase 6: Monitoramento (0%)

- [ ] Dashboard da campanha
- [ ] Cards de estatísticas
- [ ] Gráficos de progresso
- [ ] Tabela de jobs
- [ ] Atualização em tempo real
- [ ] Filtros e exportação

### ⏳ Fase 7: Testes (0%)

- [ ] Testes unitários (workers, actions, client)
- [ ] Testes de integração (fluxos completos)
- [ ] Testes E2E (Playwright)
- [ ] Otimização de performance
- [ ] Refatoração de código
- [ ] Documentação completa

---

## 15. Troubleshooting e Dicas

### 🐛 Problemas Comuns

#### Erro: "Port 5432 already in use"

**Solução**:

```bash
# Verificar o que está usando a porta
lsof -i :5432

# Se for outro PostgreSQL, parar
brew services stop postgresql  # macOS
sudo systemctl stop postgresql # Linux

# Ou usar porta diferente no docker-compose.yml
```

#### Erro: "ECONNREFUSED Redis connection"

**Solução**:

```bash
# Verificar se Redis está rodando
docker ps | grep redis

# Se não estiver, subir novamente
npm run docker:up

# Verificar logs
docker logs manager-redis
```

#### Workers não processam jobs

**Solução**:

```bash
# Verificar se workers estão rodando
ps aux | grep "start-workers"

# Verificar logs dos workers
npm run workers

# Verificar filas no Redis
redis-cli
> KEYS bull:*
> LLEN bull:campaign-processor:wait
```

#### Importação de contatos falha

**Solução**:

- Verificar formato do JID: `5511999999999@s.whatsapp.net`
- CSV deve usar encoding UTF-8
- Verificar se tem duplicatas
- Ver array de `errors` no retorno da função

### 💡 Dicas de Desenvolvimento

**1. Sempre use o logger centralizado**

```typescript
import { logger } from "@/lib/logger"

// NUNCA use console.*
```

**2. Teste workers separadamente**

```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Workers
npm run workers
```

**3. Use Prisma Studio para debug**

```bash
npm run db:studio
# Abre interface web em localhost:5555
```

**4. Valide sempre com Zod**

```typescript
const validated = schema.parse(data) // Throws se inválido
```

**5. Revalide cache após mutações**

```typescript
revalidatePath("/campaigns")
```

### 📚 Recursos Úteis

- [BullMQ Docs](https://docs.bullmq.io/)
- [React Flow Docs](https://reactflow.dev/)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**🎉 Fim do Guia Completo**

Este guia será atualizado conforme o progresso do desenvolvimento. Sempre verifique a seção "Progresso Atual Detalhado" no topo para ver o status mais recente.

**Última Atualização**: 31/10/2025 16:40 BRT
**Versão**: 2.0.0
**Progresso Total**: 22.9% (Fase 1 ✅ + Fase 2 🔄 60%)
