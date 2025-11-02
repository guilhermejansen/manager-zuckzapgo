# 📊 Padrão de Tabelas Responsivas - ZuckZapGo Manager

## 📋 Visão Geral

Este documento estabelece o padrão unificado para implementação de tabelas responsivas em todo o sistema ZuckZapGo Manager. O padrão foi desenvolvido com base na implementação de referência da página **Archive** (`/admin/archive`).

### Objetivos
- ✅ Experiência consistente em todos os tamanhos de tela
- ✅ Performance otimizada com dual-layout
- ✅ Acessibilidade e usabilidade em mobile
- ✅ Código reutilizável e manutenível
- ✅ Paginação unificada e funcional
- ✅ Filtros responsivos e intuitivos

---

## 🏗️ Arquitetura de Componentes

### 1. Estrutura de Página Principal

```tsx
export default function PageWithTable() {
  return (
    <div className="space-y-6">
      {/* Header com Título + Ações */}
      <PageHeader />
      
      {/* Cards de Estatísticas (opcional) */}
      <StatsCards />
      
      {/* Tabs (opcional) */}
      <Tabs>
        {/* Tab de Eventos/Dados */}
        <EventsTab />
      </Tabs>
    </div>
  )
}
```

### 2. Componente de Tab com Dados

```tsx
export function EventsTab({ data, filters, onFilterChange, totalCount }) {
  return (
    <Card>
      <CardHeader>
        {/* Título + Filtros */}
        <FilterSection />
      </CardHeader>
      
      <CardContent>
        {/* Dual Layout: Tabela + Cards */}
        <DesktopTable />  {/* hidden md:block */}
        <MobileCards />   {/* md:hidden */}
        
        {/* Paginação Unificada */}
        <Pagination />
      </CardContent>
    </Card>
  )
}
```

---

## 🎨 Sistema de Filtros Responsivos

### Implementação de Filtros

```tsx
const selectedEventType: SupportedEvent =
  filters.event_type && SUPPORTED_EVENTS.includes(filters.event_type as SupportedEvent)
    ? (filters.event_type as SupportedEvent)
    : "All"

const [transportValue, setTransportValue] = useState(filters.transport ?? "")
const [userIdValue, setUserIdValue] = useState(filters.user_id ?? "")
const [transportOpen, setTransportOpen] = useState(false)

const filtersRef = useRef(filters)
const debounceRef = useRef<NodeJS.Timeout | null>(null)
const isInitialUserSync = useRef(true)

useEffect(() => {
  filtersRef.current = filters
}, [filters])

useEffect(() => {
  setTransportValue(filters.transport ?? "")
}, [filters.transport])

useEffect(() => {
  setUserIdValue(filters.user_id ?? "")
}, [filters.user_id])

useEffect(() => {
  if (isInitialUserSync.current) {
    isInitialUserSync.current = false
    return
  }

  if (userIdValue === (filtersRef.current.user_id ?? "")) {
    return
  }

  if (debounceRef.current) clearTimeout(debounceRef.current)
  debounceRef.current = setTimeout(() => {
    onFilterChange({
      ...filtersRef.current,
      user_id: userIdValue,
      offset: 0,
    })
  }, 400)

  return () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
  }
}, [userIdValue, onFilterChange])

const transportOptions = useMemo(() => {
  const unique = new Set<string>()
  availableTransports.forEach((transport) => transport && unique.add(transport))
  events.forEach((event) => event.transport && unique.add(event.transport))

  return Array.from(unique)
    .sort((a, b) => formatTransportLabel(a).localeCompare(formatTransportLabel(b), "pt-BR"))
    .map((value) => ({ value, label: formatTransportLabel(value) }))
}, [availableTransports, events])

const handleSelectTransport = (value: string) => {
  const normalized = value === "all" ? "" : value
  setTransportValue(normalized)
  setTransportOpen(false)
  onFilterChange({
    ...filtersRef.current,
    transport: normalized,
    user_id: userIdValue,
    offset: 0,
  })
}

// Helper centralizado para exibir labels amigáveis
const formatTransportLabel = (transport: string) => {
  if (!transport) return "Todos os transportes"
  let scopeLabel = ""
  let base = transport

  if (transport.startsWith("global-")) {
    base = transport.slice(7)
    scopeLabel = "Global"
  } else if (transport.includes(":")) {
    const [prefix, identifier] = transport.split(":")
    base = prefix
    const truncated = identifier.length > 6 ? `${identifier.slice(0, 6)}…` : identifier
    scopeLabel = `Usuário ${truncated}`
  }

  const pretty = base.replace(/[-_]/g, " ")
  return scopeLabel
    ? `${pretty.charAt(0).toUpperCase()}${pretty.slice(1)} (${scopeLabel})`
    : `${pretty.charAt(0).toUpperCase()}${pretty.slice(1)}`
}

// availableTransports = Object.keys(stats.by_transport)
// events = dados da página atual

<CardHeader>
  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
    {/* Título e Descrição */}
    <div>
      <CardTitle>Eventos Arquivados</CardTitle>
      <CardDescription>{totalCount.toLocaleString()} eventos</CardDescription>
    </div>

    {/* Filtros em Grid Responsivo */}
    <div className="flex flex-wrap gap-3">
      {/* Status Filter */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="status-filter" className="text-xs">Status</Label>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFilterChange({
              ...filters,
              transport: transportValue,
              user_id: userIdValue,
              status: value === "all" ? "" : (value as "dlq" | "success"),
              offset: 0,
            })
          }
        >
          <SelectTrigger id="status-filter" className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="dlq">DLQ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transport Filter */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="transport-filter" className="text-xs">Transport</Label>
        <Popover open={transportOpen} onOpenChange={setTransportOpen}>
      <PopoverTrigger asChild>
        <Button
          id="transport-filter"
          variant="outline"
          role="combobox"
          aria-expanded={transportOpen}
          className="w-[240px] justify-between gap-2"
          title={transportValue ? formatTransportLabel(transportValue) : "Todos os transportes"}
        >
          <span className="flex-1 truncate text-left">
            {transportValue ? formatTransportLabel(transportValue) : "Todos os transportes"}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
          <PopoverContent className="w-[260px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar transport..." />
              <CommandList>
                <CommandEmpty>Nenhum transport encontrado.</CommandEmpty>
                <CommandGroup>
          <CommandItem value="all" onSelect={handleSelectTransport}>
            <Check className={cn("mr-2 h-4 w-4", transportValue === "" ? "opacity-100" : "opacity-0")} />
            <span className="truncate">Todos os transportes</span>
          </CommandItem>
          {transportOptions.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={handleSelectTransport}
              title={option.label}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  transportValue === option.value ? "opacity-100" : "opacity-0"
                )}
              />
              <span className="truncate">{option.label}</span>
            </CommandItem>
          ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* User Filter */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="user-filter" className="text-xs">User ID</Label>
        <Input
          id="user-filter"
          placeholder="user123..."
          value={filters.user_id || ""}
          onChange={(e) => onFilterChange({ ...filters, user_id: e.target.value, offset: 0 })}
          className="w-[120px]"
        />
      </div>

      {/* Event Type Filter */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="event-type-filter" className="text-xs">Event Type</Label>
        <Select
          value={selectedEventType}
          onValueChange={(value) => {
            const nextValue = value as SupportedEvent
            onFilterChange({
              ...filters,
              transport: transportValue,
              user_id: userIdValue,
              event_type: nextValue === "All" ? undefined : nextValue,
              offset: 0,
            })
          }}
        >
          <SelectTrigger id="event-type-filter" className="w-[240px]">
            <SelectValue placeholder="Todos os eventos" />
          </SelectTrigger>
          <SelectContent className="max-h-64">
            {SUPPORTED_EVENTS.map((event) => (
              <SelectItem key={event} value={event}>
                {EVENT_LABELS[event]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  </div>
</CardHeader>
```

### Regras de Filtros
- **Labels**: Sempre usar `<Label>` com `htmlFor` e `text-xs`
- **Larguras Fixas**: `w-[140px]`, `w-[160px]`, `w-[240px]` para consistência entre campos
- **Reset de Offset**: Sempre `offset: 0` ao mudar qualquer filtro
- **Estado Centralizado**: Filtros controlados por `useState` na página pai
- **Catálogo Oficial**: Mapear `SUPPORTED_EVENTS` + `EVENT_LABELS` para o seletor de evento
- **Valor Global**: Converter `"All"` para `undefined` antes de enviar para a API (remove o query param)
- **Importação**: `import { EVENT_LABELS, SUPPORTED_EVENTS, type SupportedEvent } from "@/types/constants"`
- **Transport Combobox**: Usar `Popover` + `Command` para listar `availableTransports` (stats) + itens carregados
- **Debounce**: Campo de `User ID` usa ~400 ms antes de refazer o fetch (evita piscar enquanto digita)
- **Utilitário**: `cn` de `@/lib/utils` garante visibilidade dos ícones selecionados
- **Truncamento**: Envolver labels longas em `<span className="truncate">` e usar `title` para tooltip

---

## 🖥️ Tabela Desktop (≥768px)

### Estrutura Base

```tsx
{/* Hidden em mobile, visível em desktop */}
<div className="hidden md:block rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[80px]">ID</TableHead>
        <TableHead className="w-[100px]">Status</TableHead>
        <TableHead>Transport</TableHead>
        <TableHead>User ID</TableHead>
        <TableHead>Event Type</TableHead>
        <TableHead className="w-[80px] text-center">Attempts</TableHead>
        <TableHead>Archived At</TableHead>
        <TableHead className="w-[180px] text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id}>
          <TableCell className="font-mono text-sm">{item.id}</TableCell>
          <TableCell>
            <Badge>{item.status}</Badge>
          </TableCell>
          <TableCell className="font-mono text-xs">{item.transport}</TableCell>
          <TableCell className="font-mono text-xs truncate max-w-[120px]">
            {item.user_id}
          </TableCell>
          <TableCell>{item.event_type}</TableCell>
          <TableCell className="text-center">
            <Badge variant="outline">{item.attempts}</Badge>
          </TableCell>
          <TableCell className="text-sm text-muted-foreground">
            {formatDate(item.archived_at)}
          </TableCell>
          <TableCell className="text-right">
            <ActionButtons item={item} />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### Boas Práticas Desktop
- ✅ Larguras fixas para colunas de ID e Actions
- ✅ `truncate max-w-[120px]` para textos longos
- ✅ `text-center` ou `text-right` para alinhamento
- ✅ `font-mono text-xs` para dados técnicos
- ✅ Badges para status e contadores
- ✅ Botões de ação agrupados no final

---

## 📱 Cards Mobile (<768px)

### Estrutura Base

```tsx
{/* Visível em mobile, hidden em desktop */}
<div className="md:hidden space-y-4">
  {data.map((item) => (
    <div key={item.id} className="rounded-lg border bg-card p-4 space-y-3">
      {/* Header do Card */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">ID</span>
            <span className="font-mono text-sm font-bold">{item.id}</span>
          </div>
          <Badge>{item.status}</Badge>
        </div>
        <Badge variant="outline">{item.attempts} tentativas</Badge>
      </div>

      {/* Informações do Item */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Transport:</span>
          <span className="font-mono text-xs">{item.transport}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Event Type:</span>
          <span className="font-medium">{item.event_type}</span>
        </div>
        {item.user_id && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">User ID:</span>
            <span className="font-mono text-xs truncate max-w-[150px]">
              {item.user_id}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Arquivado em:</span>
          <span className="text-xs">{formatDate(item.archived_at)}</span>
        </div>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t">
        <Button variant="outline" size="sm" className="flex-1">
          <Eye className="mr-2 h-4 w-4" />
          Detalhes
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <PlayCircle className="mr-2 h-4 w-4" />
          Replay
        </Button>
        <Button variant="outline" size="sm" className="text-red-600">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ))}
</div>
```

### Boas Práticas Mobile
- ✅ `space-y-4` entre cards
- ✅ `p-4` de padding interno
- ✅ Informações organizadas por prioridade
- ✅ Header com ID + Status destacados
- ✅ Grid de informações com `justify-between`
- ✅ Ações em footer com `flex-1` para botões principais
- ✅ Border-top separando ações

---

## 🔢 Paginação Unificada

### Implementação

```tsx
const showPagination =
  !loading && totalCount > 0 && (totalPages > 1 || currentPage > 1 || canGoNext || canGoPrevious)

{showPagination && (
  <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-center md:justify-between">
    <div className="text-sm text-muted-foreground">
      Página {currentPage} de {totalPages} ({totalCount.toLocaleString()} eventos)
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousPage}
        disabled={!canGoPrevious || loading}
      >
        Anterior
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onNextPage}
        disabled={!canGoNext || loading}
      >
        Próxima
      </Button>
    </div>
  </div>
)}
```

### Lógica de Paginação

#### Offset (Archive / DLQ)

```tsx
const currentPage = Math.floor((filters.offset || 0) / (filters.limit || 50)) + 1
const totalPages = Math.ceil(totalCount / (filters.limit || 50))

const handlePageChange = (page: number) => {
  onFilterChange({
    ...filters,
    offset: (page - 1) * (filters.limit || 50),
  })
}
```

#### Cursor `since_id` (Monitoring)

```tsx
const [historyPage, setHistoryPage] = useState(1)
const historyCursorStack = useRef<(number | null)[]>([])

const handleHistoryNextPage = () => {
  if (!hasMore || !nextId) return
  historyCursorStack.current.push(filters.since_id ?? null)
  onFiltersChange({
    ...filters,
    since_id: nextId,
  })
  setHistoryPage((prev) => prev + 1)
}

const handleHistoryPreviousPage = () => {
  if (historyCursorStack.current.length === 0) return
  const previousCursor = historyCursorStack.current.pop()
  onFiltersChange({
    ...filters,
    since_id: previousCursor ?? undefined,
  })
  setHistoryPage((prev) => Math.max(1, prev - 1))
}

const resetHistoryPagination = () => {
  historyCursorStack.current = []
  setHistoryPage(1)
}
```

### Regras de Paginação
- **Limit Padrão**: 50 itens por página
- **Offset Inicial (Archive/DLQ)**: `offset = 0`
- **Cursor Inicial (Monitoring)**: `since_id = undefined`
- **Cálculo de Páginas**: `Math.ceil(totalCount / limit)` (usar `Math.max(1, ...)` quando necessário)
- **Resumo**: Exibir `Página {current} de {total}` acompanhado de `({exibidos} eventos • {total} no total)` e usar o `stats.events.by_status` para o total quando os filtros padrão estão ativos
- **Persistência**: Guardar `historyCursorStack` para permitir navegação `Anterior`
- **Reset**: Limpar stack + `currentPage` ao alterar qualquer filtro (exceto `since_id` manual)
- **Responsivo**: Info à esquerda, botões à direita (`flex-col` em mobile)
- **Estados**: Desabilitar botões enquanto `loading` ou quando não houver página
- **Indicador**: Mostrar badge “Paginação via since_id” quando a API retorna `has_more`

---

## 🔍 Modal de Detalhes Responsivo

### Implementação Completa

```tsx
export function EventDetailsDialog({ event, onClose }: Props) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        {/* Header com Border */}
        <DialogHeader className="flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
          <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 pr-8">
            <span className="text-sm sm:text-base font-semibold">
              Event Details - ID {event.id}
            </span>
            <Badge>{event.status}</Badge>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Detalhes completos do evento
          </DialogDescription>
        </DialogHeader>

        {/* Conteúdo com Scroll Customizado */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 custom-scrollbar">
          <div className="space-y-4">
            {/* Metadata Grid */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Metadata</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs block">Transport:</span>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-xs break-all">{event.transport}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => copyToClipboard(event.transport, "Transport")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {/* Outros campos com mesmo padrão */}
              </div>
            </div>

            {/* Payload Section */}
            <Separator />
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h4 className="text-sm font-semibold">Event Payload</h4>
                <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">
                  <Copy className="mr-2 h-3 w-3" />
                  Copy JSON
                </Button>
              </div>
              <div className="rounded-md bg-muted/50 p-3 border">
                <div className="overflow-x-auto custom-scrollbar">
                  <pre className="text-[10px] leading-relaxed font-mono">
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com Background */}
        <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-t bg-muted/30">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```
```tsx
const metadataItems = [
  { label: "Transport", value: event.transport, copyValue: event.transport, mono: true },
  // ...demais campos
]
```

```tsx
<div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-4 sm:px-6">
  <div className="space-y-4 sm:space-y-6 pb-4">
    <section className="space-y-3">
      <h4 className="text-sm font-semibold">Metadata</h4>
      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        {metadataItems.map((item) => (
          <div key={item.label} className="space-y-1.5 sm:space-y-2">
            <span className="text-[10px] font-semibold uppercase text-muted-foreground sm:text-xs">
              {item.label}
            </span>
            <div className="flex items-start justify-between gap-2">
              <p
                className={cn(
                  "text-xs sm:text-sm break-all",             // texto sempre quebra
                  item.mono ? "font-mono" : undefined,
                  item.className ?? "text-muted-foreground"
                )}
              >
                {item.value ?? "—"}
              </p>
              {item.copyValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => copyToClipboard(item.copyValue, item.label)}
                  aria-label={`Copiar ${item.label.toLowerCase()}`}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>

    <Separator />

    <section className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h4 className="text-sm font-semibold">Event Payload</h4>
        <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0" onClick={copyPayload}>
          <Copy className="mr-2 h-3.5 w-3.5" />
          Copy JSON
        </Button>
      </div>
      <div className="rounded-md border bg-muted/50 p-3 sm:p-4">
        <div className="custom-scrollbar overflow-x-auto">
          <pre className="text-[10px] leading-relaxed text-foreground sm:text-xs">
            <code className="block whitespace-pre">{formattedPayload}</code>
          </pre>
        </div>
      </div>
    </section>
  </div>
</div>
```


### Regras do Modal
- **Container**: `p-0 gap-0` para controle manual de padding
- **Largura**: `max-w-[calc(100vw-2rem)] sm:max-w-4xl` (margem mínima de 1rem em cada lado)
- **Altura**: `max-h-[90vh]` (garante visibilidade)
- **Layout**: `flex flex-col` com `flex-shrink-0` no header/footer
- **Header**: `px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b` (padding manual + borda)
- **Scroll Vertical**: `overflow-y-auto custom-scrollbar` (scroll customizado do tema)
- **Scroll Horizontal**: `overflow-x-auto custom-scrollbar` (para JSON payload)
- **Content**: `px-4 sm:px-6 py-4` (padding consistente)
- **Grid Metadata**: `grid-cols-1 sm:grid-cols-2 gap-3` com `space-y-1` nos itens
- **Labels**: `text-xs block` para empilhar
- **Valores**: `text-xs break-words` para textos longos
- **Payload JSON**: `text-[10px] leading-relaxed font-mono` com container `overflow-x-auto custom-scrollbar`
- **Footer**: `px-4 sm:px-6 py-4 border-t bg-muted/30` (destaque visual)
- **Botões**: `w-full sm:w-auto shrink-0` para responsividade

### Classe Custom Scrollbar (globals.css)
A classe `.custom-scrollbar` está definida no `app/globals.css` e fornece um scroll estilizado que segue o tema:

```css
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-muted/30 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-muted-foreground/30 rounded-full hover:bg-muted-foreground/50;
}
```

**Uso**: Sempre adicionar `custom-scrollbar` em elementos com `overflow-y-auto` ou `overflow-x-auto` para manter consistência visual.

---

## 📦 Componentes Base Necessários

### Imports Padrão

```tsx
// UI Components
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

// Icons
import { Check, ChevronsUpDown, Eye, PlayCircle, Trash2, RefreshCw, Search } from "lucide-react"

// Utils
import { toast } from "sonner"
import { cn } from "@/lib/utils"
```

---

## 🎨 Classes Tailwind Essenciais

### Breakpoints (Mobile-First)
```css
/* Mobile: padrão (< 768px) */
/* Tablet: sm: (≥ 640px) */
/* Desktop: md: (≥ 768px) */
/* Large: lg: (≥ 1024px) */
/* XL: xl: (≥ 1280px) */
```

### Layout Responsivo
```tsx
// Dual Layout
hidden md:block        // Tabela (desktop only)
md:hidden              // Cards (mobile only)

// Stacking
flex-col sm:flex-row   // Vertical → Horizontal
space-y-4 sm:space-y-0 sm:space-x-4

// Larguras
w-full sm:w-auto       // Full width → Auto
max-w-[95vw] sm:max-w-3xl
```

### Grid System
```tsx
// Colunas Responsivas
grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
grid-cols-1 sm:grid-cols-2

// Gaps
gap-2 sm:gap-4
gap-1.5 sm:gap-3
```

### Tipografia
```tsx
// Tamanhos Adaptativos
text-xs sm:text-sm
text-sm sm:text-base
text-base sm:text-lg

// Overflow Control
truncate max-w-[120px]
break-all
overflow-x-auto
whitespace-pre-wrap
```

### Spacing
```tsx
// Padding Responsivo
p-2 sm:p-4
px-2 sm:px-4
pr-2 sm:pr-4

// Margin
mt-4 sm:mt-6
gap-2 sm:gap-4
```

---

## 🚀 Exemplo de Implementação Completa

### Estrutura de Arquivo

```
/admin/[feature]/
├── page.tsx                    # Página principal
├── _components/
│   ├── events-tab.tsx          # Tab com tabela/cards
│   ├── event-details-dialog.tsx # Modal de detalhes
│   ├── overview-tab.tsx        # Stats cards (opcional)
│   └── maintenance-tab.tsx     # Outras tabs (opcional)
```

### Referência Completa
Ver implementação em: `app/admin/archive/`

---

## ✅ Checklist de Implementação

### Página Principal
- [ ] Header com título e descrição
- [ ] Botões de ação responsivos (`w-full sm:w-auto`)
- [ ] Auto-refresh opcional
- [ ] Loading states com Skeleton
- [ ] Estados vazios informativos

### Filtros
- [ ] Labels com `htmlFor` e `text-xs`
- [ ] Larguras fixas consistentes
- [ ] Reset de `offset` ao mudar filtros
- [ ] Flex-wrap para responsividade

### Tabela Desktop
- [ ] `hidden md:block`
- [ ] Larguras fixas em colunas chave
- [ ] `truncate` em textos longos
- [ ] Badges para status
- [ ] Actions column alinhada à direita

### Cards Mobile
- [ ] `md:hidden`
- [ ] `space-y-4` entre cards
- [ ] Header com info prioritária
- [ ] Grid de informações com `justify-between`
- [ ] Ações em footer com border-top
- [ ] Botões com `flex-1`

### Paginação
- [ ] Unificada para table + cards
- [ ] Info de página atual/total
- [ ] Botões prev/next com disabled
- [ ] Condicional `totalPages > 1`

### Modal de Detalhes
- [ ] `max-w-[95vw] sm:max-w-3xl`
- [ ] `max-h-[95vh]`
- [ ] `flex flex-col` layout
- [ ] ScrollArea com altura adaptativa
- [ ] Grid metadata `grid-cols-1 sm:grid-cols-2`
- [ ] Payload com overflow control
- [ ] Botões responsivos

### Estados e UX
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Confirmações de ações destrutivas

---

## 📋 Páginas a Padronizar

### Status de Implementação

| Página | Status | Prioridade | Notas |
|--------|--------|------------|-------|
| `/admin/archive` | ✅ Completo | - | **REFERÊNCIA** |
| `/admin/dlq` | ⏳ Pendente | Alta | Similar ao Archive |
| `/admin/monitoring` | ⏳ Pendente | Alta | Eventos em tempo real |
| `/admin/instances` | ⏳ Pendente | Média | Já tem dual-layout |
| `/admin/campaigns` | ⏳ Pendente | Média | Tabela de campanhas |
| `/admin/campaigns/contacts` | ⏳ Pendente | Baixa | Lista de contatos |

### Ordem de Implementação Sugerida
1. **DLQ** - Estrutura idêntica ao Archive
2. **Monitoring** - Adaptar para tempo real
3. **Instances** - Refinar dual-layout existente
4. **Campaigns** - Nova implementação
5. **Contacts** - Nova implementação

---

## 🎨 Melhorias de UX Futuras

### Opcionais (Não Obrigatórias)
- [ ] Animações suaves de transição
- [ ] Skeleton loading com shimmer effect
- [ ] Infinite scroll como alternativa à paginação
- [ ] Filtros avançados com drawer lateral
- [ ] Exportação de dados (CSV, JSON)
- [ ] Seleção múltipla com bulk actions
- [ ] Ordenação de colunas (sortable)
- [ ] Busca global com highlight

---

## 🔧 Manutenção e Evolução

### Regras de Atualização
1. **Archive como Referência**: Sempre manter `app/admin/archive/` atualizado
2. **Documentação Sincronizada**: Atualizar este documento quando mudar o padrão
3. **Versionamento**: Criar versões do padrão se houver breaking changes
4. **Consistência**: Aplicar mudanças em todas as páginas padronizadas

### Contato
Para dúvidas ou sugestões sobre este padrão, contate a equipe de desenvolvimento.

---

**Versão**: 1.0  
**Data**: Janeiro 2025  
**Última Atualização**: Implementação inicial baseada em Archive page
