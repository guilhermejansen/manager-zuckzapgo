# 📋 Sistema de Campanhas - Guia de Desenvolvimento

## 📚 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Editor de Workflow](#editor-de-workflow)
- [Tipos de Nós](#tipos-de-nós)
- [Best Practices React Flow](#best-practices-react-flow)
- [Correções Aplicadas](#correções-aplicadas)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema de campanhas permite criar fluxos automatizados de mensagens WhatsApp através de um editor visual baseado em nós (estilo n8n/Node-RED).

### Tecnologias Principais

- **React 19.2.0** - Framework UI
- **Next.js 16.0.1** - Framework fullstack
- **React Flow 11.11.4** - Editor de fluxo visual
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização

### Estrutura de Arquivos

```
components/campaign/
├── workflow-editor-v2.tsx       # Editor principal (React Flow controlado)
├── workflow-toolbar.tsx         # Toolbar + ações de fullscreen/export
├── workflow-sidebar.tsx         # Drawer com catálogo de nós
├── workflow-definitions.ts      # Metadados e config padrão dos nós
├── workflow-types.ts            # Tipagens compartilhadas
├── input-mapper.tsx             # UI para mapear dados entre nós
├── placeholder-menu.tsx         # Menu de placeholders dinâmicos
├── nodes/                       # Implementações individuais de nós
│   ├── base-node.tsx            # Layout base + validações
│   ├── start-node.tsx           # Nó inicial
│   ├── text-message-node.tsx    # Mensagem de texto
│   ├── media-message-node.tsx   # Mensagem de mídia
│   ├── interactive-node.tsx     # Mensagem interativa
│   ├── delay-node.tsx           # Delay/Jitter com inputs numéricos
│   ├── http-request-node.tsx    # Requisição HTTP com headers/body
│   └── end-node.tsx             # Nó final
└── contexts/
    └── campaign-workflow-context.tsx # WorkflowProvider (useNodesState/useEdgesState)
```

---

## 🏗️ Arquitetura

### Fluxo de Dados

```
┌─────────────────┐
│  Page (new.tsx) │
│                 │
│  • Gerencia     │
│    estado do    │
│    formulário   │
│                 │
│  • Converte     │
│    dados para   │
│    formato      │
│    editor       │
└────────┬────────┘
         │
         ▼
┌───────────────────────────────────────┐
│  WorkflowEditorV2                     │
│                                       │
│  • ReactFlowProvider wrapper          │
│  • Instancia WorkflowProvider         │
│  • Envia handlers estáveis para nodes │
└────────┬──────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────┐
│  WorkflowProvider                     │
│                                       │
│  • useNodesState / useEdgesState      │
│  • updateNode(nodeId, patch|fn)       │
│  • Sanitiza dados (remove handlers)   │
└────────┬──────────────────────────────┘
         │
         ▼
┌─────────────────┬────────────────────┬──────────────────┐
│ React Flow Core │ enrichNodeWithDef  │ Serialization    │
│                 │ (memoizado)        │ (serialize/      │
│                 │                    │  deserialize)    │
└─────────────────┴────────────────────┴──────────────────┘
```

### Sistema de Placeholders

O sistema oferece 4 categorias de placeholders:

1. **Contact** - Dados do contato (JID, nome, pushName, campos custom)
2. **Campaign** - Dados da campanha (ID, nome, tipo, status)
3. **System** - Contexto de execução (timestamp, batchIndex, instanceId)
4. **Previous Nodes** - Outputs de nós anteriores no fluxo

### Sistema de Inputs/Outputs

Cada nó pode:
- **Receber inputs** mapeados de outputs de nós anteriores
- **Gerar outputs** que podem ser usados por nós seguintes

Exemplo:
```typescript
// HTTP Request Node gera outputs
outputs: [
  { name: "statusCode", description: "HTTP status code" },
  { name: "body", description: "Response body" },
  { name: "headers", description: "Response headers" }
]

// Nó seguinte pode usar: {{nodes.http-123.statusCode}}
```

---

## 🎨 Editor de Workflow

### Componente Principal: `WorkflowEditorV2`

**Local**: `components/campaign/workflow-editor-v2.tsx`

#### Props Interface

```typescript
interface WorkflowEditorV2Props {
  className?: string
  onExitFullscreen?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  onChange?: (workflow: WorkflowFormData) => void
  initialWorkflow?: WorkflowFormData
  readOnly?: boolean
}
```

#### Fluxo Interno

1. `WorkflowEditorV2` cria um `ReactFlowProvider`.
2. No interior, o `WorkflowProvider` fornece estado controlado de nós/arestas com `useNodesState`/`useEdgesState`.
3. `WorkflowEditorContent` consome o contexto via `useWorkflow()`:
   ```typescript
   const {
     nodes,
     edges,
     setNodes,
     setEdges,
     onNodesChange,
     onEdgesChange,
     updateNode,
     duplicateNode,
     removeNode,
   } = useWorkflow()
   ```
4. Mudanças são serializadas com `serializeWorkflow(nodes, edges)` e entregues ao formulário pai via `onChange` (debounce de 500 ms).

#### WorkflowProvider (`contexts/campaign-workflow-context.tsx`)

- `updateNode(nodeId, patch)` aceita objeto ou função para merges incrementais:
  ```typescript
  updateNode(id, (current) => ({
    config: {
      ...(current?.config ?? {}),
      delayMs: Number(value) || 0,
    },
  }))
  ```
- Sanitiza dados persistidos removendo `actions`, `onConfigChange` e `onInputsChange`.
- `duplicateNode` gera IDs determinísticos (`generateDeterministicId("node")`) e reposiciona o clone com offset.

#### Enriquecimento de Nós

- `NODE_TYPES`/`EDGE_TYPES` são constantes no escopo do módulo para evitar recriações.
- `enrichNodeWithDefinition(node, handlers)` injeta:
  - `data.actions.onDuplicate` / `onDelete`
  - `data.onConfigChange(patch)` para merges imutáveis
  - `data.onInputsChange(inputs)` para o `InputMapper`
  - Metadados (`label`, `icon`, `theme`, etc.) vindos de `NODE_DEFINITIONS`.
- Nodes com tipo desconhecido são logados e renderizados como vieram (sem perder dados).

#### Convenções para Componentes de Nó

- Leia `const { config } = data` e encaminhe alterações com `data.onConfigChange?.({ campo: valor })`.
- Para coleções:
  ```typescript
  data.onConfigChange?.({
    headers: config.headers.map((row) =>
      row.id === rowId ? { ...row, value: event.target.value } : row
    ),
  })
  ```
- `InputMapper` recebe `data.onInputsChange?.(inputsAtualizados)`.
- Marque blocos interativos com `className="nodrag nopan"` e intercepte `onPointerDown`/`onWheel` para evitar que o canvas capture o evento.
- Exportar todos os nodes com `export default memo(NodeComponent)` garante renderizações previsíveis.

> Referências: [useNodesState](https://reactflow.dev/learn/state/use-nodes-state), [Hooks React Flow](https://reactflow.dev/api-reference/hooks), [Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes).

---

## 🧩 Tipos de Nós

### 1. Start Node (`trigger.start`)

**Descrição**: Nó inicial que define o começo do fluxo

**Configuração**:
- Não possui inputs
- Sempre tem 1 output padrão

**Exemplo de uso**:
```json
{
  "id": "start-1",
  "type": "trigger.start",
  "position": { "x": 0, "y": 0 },
  "data": {
    "label": "Início",
    "active": true,
    "config": {}
  }
}
```

### 2. Text Message Node (`message.text`)

**Descrição**: Envia mensagem de texto simples

**Configuração**:
```typescript
{
  text: string  // Suporta placeholders
}
```

**Placeholders suportados**: Todos (contact, campaign, system, previous nodes)

**Exemplo**:
```json
{
  "config": {
    "text": "Olá {{contact.name}}, bem-vindo à campanha {{campaign.name}}!"
  }
}
```

### 3. Media Message Node (`message.media`)

**Descrição**: Envia mídia (imagem, vídeo, documento, áudio)

**Configuração**:
```typescript
{
  mediaType: "image" | "video" | "document" | "audio"
  mediaUrl: string
  caption?: string  // Opcional, suporta placeholders
  filename?: string // Para documentos
}
```

**Exemplo**:
```json
{
  "config": {
    "mediaType": "image",
    "mediaUrl": "https://example.com/image.jpg",
    "caption": "Confira nossa promoção, {{contact.name}}!"
  }
}
```

### 4. Interactive Node (`message.interactive`)

**Descrição**: Mensagens interativas (botões, listas, produtos)

**Configuração**:
```typescript
{
  interactiveType: "button" | "list" | "product"
  text: string
  footer?: string
  buttons?: Array<{ id: string, text: string }>
  sections?: Array<{ title: string, rows: Array<{ id: string, title: string }> }>
}
```

**Exemplo - Botões**:
```json
{
  "config": {
    "interactiveType": "button",
    "text": "Escolha uma opção:",
    "buttons": [
      { "id": "opt1", "text": "Opção 1" },
      { "id": "opt2", "text": "Opção 2" }
    ]
  }
}
```

### 5. Delay Node (`control.delay`)

**Descrição**: Adiciona atraso entre nós

**Configuração**:
```typescript
{
  delayType: "fixed" | "random"
  duration: number        // Segundos
  maxDuration?: number   // Para random
}
```

**Exemplo**:
```json
{
  "config": {
    "delayType": "random",
    "duration": 5,
    "maxDuration": 15
  }
}
```

### 6. HTTP Request Node (`integration.http`)

**Descrição**: Faz requisição HTTP externa

**Configuração**:
```typescript
{
  method: "GET" | "POST" | "PUT" | "DELETE"
  url: string            // Suporta placeholders
  headers?: Record<string, string>
  body?: string         // JSON string, suporta placeholders
}
```

**Outputs gerados**:
- `statusCode` - HTTP status code
- `body` - Response body
- `headers` - Response headers

**Exemplo**:
```json
{
  "config": {
    "method": "POST",
    "url": "https://api.example.com/webhook",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": "{\"contact\": \"{{contact.jid}}\"}"
  }
}
```

### 7. End Node (`control.end`)

**Descrição**: Marca o fim do fluxo

**Configuração**: Nenhuma

---

## ✅ Best Practices React Flow

### 1. Performance - Memoização

**Regra de Ouro**: Todo objeto/função usado em React Flow deve ser memoizado ou estável.

#### ✅ DO - Correto

```typescript
// Callbacks estabilizados ANTES de nodeTypes
const stableCallback = useCallback(
  (id: string) => handleSomething(id),
  [handleSomething]
)

// nodeTypes memoizado com TODAS as dependências
const nodeTypes = useMemo(() => ({
  "my-node": (props) => <MyNode onAction={stableCallback} />
}), [stableCallback])

// edgeTypes memoizado
const edgeTypes = useMemo(() => ({
  default: CustomEdge
}), [])

// defaultEdgeOptions memoizado
const defaultEdgeOptions = useMemo(() => ({
  animated: true,
  type: 'smoothstep'
}), [])
```

#### ❌ DON'T - Errado

```typescript
// ❌ Callback inline (nova referência a cada render)
const nodeTypes = useMemo(() => ({
  "my-node": (props) => <MyNode onAction={() => handleSomething(props.id)} />
}), [])

// ❌ nodeTypes sem memoização
const nodeTypes = {
  "my-node": MyNodeComponent
}

// ❌ Dependências incompletas
const nodeTypes = useMemo(() => ({
  // usa handleSomething mas não está nas deps
}), [readOnly])  // ❌ Falta handleSomething

// ❌ Objeto não memoizado
const defaultEdgeOptions = {
  animated: true  // Nova referência a cada render!
}
```

### 2. Container Dimensions

React Flow PRECISA de dimensões explícitas:

```typescript
// ✅ CORRETO
<div style={{ width: "100%", height: "100%" }}>
  <ReactFlow ... />
</div>

// ❌ ERRADO - Sem height
<div style={{ minHeight: "500px" }}>
  <ReactFlow ... />
</div>
```

### 3. Node Data Patterns

#### Padrão Recomendado

```typescript
interface MyNodeData extends BaseNodeData {
  config: {
    myField: string
  }
  onConfigChange?: (config: Record<string, unknown>) => void
  actions?: {
    onExecute?: () => void
    onDuplicate?: () => void
    onDelete?: () => void
  }
}

// No componente do nó
function MyNode({ data }: NodeProps<MyNodeData>) {
  return (
    <BaseNode data={data}>
      <input 
        value={data.config.myField}
        onChange={(e) => data.onConfigChange?.({ myField: e.target.value })}
      />
    </BaseNode>
  )
}
```

### 4. Evitar Re-renders

```typescript
// ✅ Use React.memo para node components
export const MyNode = React.memo(({ data, ...props }: NodeProps<MyNodeData>) => {
  // ...
})

// ✅ Extraia lógica pesada para fora do render
const processedData = useMemo(() => heavyCalculation(data), [data])

// ✅ Use useCallback para event handlers
const handleChange = useCallback((value: string) => {
  data.onConfigChange?.({ myField: value })
}, [data.onConfigChange])
```

### 5. Updates e Performance

```typescript
// ✅ CORRETO - Update específico
setNodes((nodes) =>
  nodes.map((node) =>
    node.id === targetId
      ? { ...node, data: { ...node.data, config: newConfig } }
      : node
  )
)

// ❌ EVITE - Update de tudo
setNodes([...newCompleteNodeArray])  // Re-renderiza todos os nós!
```

---

## 🔧 Correções Aplicadas

### Problema 1: Loop Infinito (Maximum Update Depth)

**Causa Raiz**: `nodeTypes` useMemo com dependências incompletas

**Linha afetada**: `workflow-editor.tsx:636`

**Antes**:
```typescript
const nodeTypes = useMemo(() => {
  // ... código
}, [readOnly])  // ❌ Dependências incompletas!
```

**Depois**:
```typescript
// Callbacks estabilizados ANTES
const stableHandleInputsChange = useCallback(
  (nodeId: string, next: WorkflowNodeInput[]) => handleInputsChange(nodeId, next),
  [handleInputsChange]
)
// ... outros callbacks

const nodeTypes = useMemo(() => {
  // ... código usa os callbacks estabilizados
}, [
  readOnly,
  placeholderMap,
  availableSourcesMap,
  stableHandleInputsChange,
  stableHandleNodeConfigChange,
  stableHandleExecuteNode,
  stableHandleDuplicateNode,
  stableHandleDeleteNode,
  stableHandleToggleActive,
])  // ✅ TODAS as dependências!
```

**Resultado**: Elimina o loop infinito de re-renders

---

### Problema 2: Container sem Dimensões

**Causa Raiz**: ReactFlow container sem `height` explícito

**Linha afetada**: `workflow-editor.tsx:751`

**Antes**:
```typescript
<div
  ref={reactFlowWrapper}
  className="relative flex-1 overflow-hidden rounded-3xl"
  style={{ minHeight: "500px" }}  // ❌ Só minHeight
>
```

**Depois**:
```typescript
<div
  ref={reactFlowWrapper}
  className="relative flex-1 overflow-hidden rounded-3xl"
  style={{ minHeight: "500px", height: "100%" }}  // ✅ Height explícito
>
```

**Resultado**: Elimina warning e garante renderização correta do grafo

---

### Problema 3: Callbacks Inline Causando Re-renders

**Causa Raiz**: Callbacks criados inline em `nodeTypes` geravam novas referências

**Linhas afetadas**: `workflow-editor.tsx:690-830`

**Antes**:
```typescript
data={buildData(props, {
  onConfigChange: (patch) => handleNodeConfigChange(props.id, patch),  // ❌ Inline
  actions: {
    onExecute: () => handleExecuteNode(props.id),     // ❌ Inline
    onDuplicate: () => handleDuplicateNode(props.id), // ❌ Inline
    // ...
  }
})}
```

**Depois**:
```typescript
data={buildData(props, {
  onConfigChange: (patch) => stableHandleNodeConfigChange(props.id, patch),  // ✅ Estável
  actions: {
    onExecute: () => stableHandleExecuteNode(props.id),     // ✅ Estável
    onDuplicate: () => stableHandleDuplicateNode(props.id), // ✅ Estável
    // ...
  }
})}
```

**Resultado**: Props estáveis, sem re-renders desnecessários

## 🧩 Arquitetura do Workflow Editor V2 (2025-02)

- `WorkflowEditorV2` vive em `components/campaign/workflow-editor-v2.tsx` e depende do `WorkflowProvider` (`contexts/campaign-workflow-context.tsx`).
- O `WorkflowProvider` controla `nodes` e `edges` via `useNodesState`/`useEdgesState` e expõe `updateNode(nodeId, patch)` que aceita objetos ou funções para merges incrementais.
- Cada node é enriquecido por `enrichNodeWithDefinition`, que injeta handlers estáveis:
  - `data.actions.onDuplicate` / `onDelete`
  - `data.onConfigChange(patch)` para merges imutáveis do objeto `config`
  - `data.onInputsChange(inputs)` para o `InputMapper`
- Componentes de node DEVEM encaminhar mudanças usando esses handlers; atualizar `data` diretamente quebra a sincronização.
- Todo bloco interativo precisa impedir propagação para o canvas: envolva inputs em wrappers com `className="nodrag nopan"` e chame `event.stopPropagation()` em `onPointerDown`/`onWheel`.
- Para criar novos nodes:
  1. Defina `config` padrão em `NODE_DEFINITIONS` e no switch `defaultConfigs` do drop handler.
  2. No componente, leia `const { config } = data` e chame `data.onConfigChange?.({ campo: valor })`.
  3. Se expuser inputs, garanta estilos consistentes (`bg-secondary/50`, etc.) e sem side-effects no render.

> Referência oficial: [useNodesState](https://reactflow.dev/learn/state/use-nodes-state) e [Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes).

---

## 🐛 Troubleshooting

### Erro: "Maximum update depth exceeded"

**Sintoma**: Console mostra loop infinito de re-renders

**Causas possíveis**:
1. `nodeTypes` sem memoização ou com deps incompletas
2. Callbacks inline em node props
3. Objetos não memoizados passados para React Flow

**Solução**:
1. Verificar `useMemo` de `nodeTypes` tem TODAS as deps
2. Estabilizar callbacks com `useCallback`
3. Memoizar todos os objetos: `edgeTypes`, `defaultEdgeOptions`, etc.

---

### Warning: "It looks like you've created a new nodeTypes"

**Sintoma**: Warning no console do React Flow

**Causa**: `nodeTypes` está sendo recriado a cada render

**Solução**:
```typescript
// ✅ SEMPRE memoize nodeTypes
const nodeTypes = useMemo(() => ({
  // ...
}), [/* deps completas */])
```

---

### Warning: "Container needs width and height"

**Sintoma**: Grafo não renderiza corretamente

**Causa**: Container sem dimensões explícitas

**Solução**:
```typescript
<div style={{ width: "100%", height: "100%" }}>  {/* ✅ Explicit dimensions */}
  <ReactFlow ... />
</div>
```

---

### Nós não aparecem ou aparecem cortados

**Causas possíveis**:
1. Container sem height
2. `fitView` não configurado
3. Positions dos nós fora da viewport

**Solução**:
```typescript
<ReactFlow
  fitView
  fitViewOptions={{ padding: 0.2 }}  // ✅ Auto-fit com padding
  // ...
/>
```

---

### Performance ruim com muitos nós

**Sintomas**: Interface lenta, travamentos

**Soluções**:

1. **Memoize node components**:
```typescript
export const MyNode = React.memo(({ data, ...props }) => {
  // ...
})
```

2. **Use onlyRenderVisibleElements**:
```typescript
<ReactFlow
  onlyRenderVisibleElements={true}  // ✅ Renderiza só o visível
  // ...
/>
```

3. **Evite cálculos pesados no render**:
```typescript
// ✅ Compute outside render
const processedData = useMemo(() => 
  heavyCalculation(data), 
  [data]
)
```

---

## 📚 Recursos Adicionais

### Documentação Oficial

- [React Flow Docs](https://reactflow.dev/learn)
- [React Flow Examples](https://reactflow.dev/examples)
- [React Flow API](https://reactflow.dev/api-reference)

### Guias Específicos

- [React Flow Performance](https://reactflow.dev/learn/advanced-use/performance)
- [Custom Nodes](https://reactflow.dev/learn/customization/custom-nodes)
- [Node Types](https://reactflow.dev/api-reference/types/node)

### Repositório do Projeto

- GitHub: [xyflow/xyflow](https://github.com/xyflow/xyflow)

---

## 🎓 Checklist de Desenvolvimento

Ao criar/modificar componentes do workflow editor:

- [ ] Todos os callbacks estabilizados com `useCallback`
- [ ] `nodeTypes` memoizado com deps completas
- [ ] Container tem `width` e `height` explícitos
- [ ] Node components usam `React.memo`
- [ ] Objetos de config memoizados (`useMemo`)
- [ ] Sem callbacks inline em props de nós
- [ ] Testado com 10+ nós conectados
- [ ] Sem warnings no console
- [ ] Performance fluida (60fps)

---

**Última atualização**: 2025-02-11  
**Versão do React Flow**: 11.11.4  
**Versão do React**: 19.2.0  
**Versão do Next.js**: 16.0.1
