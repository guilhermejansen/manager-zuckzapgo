# 🔄 ANÁLISE DE MIGRAÇÃO: nodes/ → nodes-v2/

**Data**: 03/11/2025 19:00 BRT  
**Objetivo**: Migração completa e segura de `components/campaign/nodes/` para `components/campaign/nodes-v2/`

---

## 📊 INVENTÁRIO COMPLETO

### nodes/ (Pasta Atual - 12 arquivos)

| Arquivo | LOC | Status | Descrição |
|---------|-----|--------|-----------|
| **base-node.tsx** | ~180 | ✅ Em uso | Componente base com visual estilo n8n |
| **start-node.tsx** | ~30 | ✅ Em uso | Node de início (sem input) |
| **end-node.tsx** | ~35 | ✅ Em uso | Node de fim (sem output) |
| **text-message-node.tsx** | ~150 | ✅ Em uso | Node de mensagem texto (com PlaceholderMenu + InputMapper) |
| **media-message-node.tsx** | ~180 | ✅ Em uso | Node de mensagem mídia (com PlaceholderMenu + InputMapper) |
| **interactive-node.tsx** | ~200 | ✅ Em uso | Node de mensagem interativa (com PlaceholderMenu + InputMapper) |
| **delay-node.tsx** | ~80 | ✅ Em uso | Node de delay/espera |
| **http-request-node.tsx** | ~150 | ✅ Em uso | Node de requisição HTTP (com InputMapper) |
| **trigger-start-node.tsx** | ~40 | ⚠️ Duplicado? | Parece ser duplicata de start-node |
| **text-message-node-simple.tsx** | ~100 | ⚠️ Versão simplificada | Versão sem PlaceholderMenu/InputMapper |
| **media-message-node-simple.tsx** | ~120 | ⚠️ Versão simplificada | Versão sem PlaceholderMenu/InputMapper |
| **interactive-node-simple.tsx** | ~140 | ⚠️ Versão simplificada | Versão sem PlaceholderMenu/InputMapper |

**Total**: ~1.405 LOC

### nodes-v2/ (Pasta Nova - 5 arquivos)

| Arquivo | LOC | Status | Descrição |
|---------|-----|--------|-----------|
| **text-message-node.tsx** | ~120 | ✅ Implementado | Versão simplificada SEM PlaceholderMenu/InputMapper |
| **media-message-node.tsx** | ~140 | ✅ Implementado | Versão simplificada SEM PlaceholderMenu/InputMapper |
| **interactive-node.tsx** | ~160 | ✅ Implementado | Versão simplificada SEM PlaceholderMenu/InputMapper |
| **delay-node.tsx** | ~80 | ✅ Implementado | Igual ao nodes/ |
| **http-request-node.tsx** | ~120 | ✅ Implementado | Versão simplificada SEM InputMapper |

**Total**: ~620 LOC

---

## 🔍 DIFERENÇAS CRÍTICAS IDENTIFICADAS

### 1. ❌ FALTANDO em nodes-v2/

#### A. Componentes Base
- **base-node.tsx** → nodes-v2/ importa de `../nodes/base-node` ❌
- **start-node.tsx** → Não existe em nodes-v2/ ❌
- **end-node.tsx** → Não existe em nodes-v2/ ❌

#### B. Features Avançadas
Todos os 5 nodes em `nodes-v2/` estão **sem**:
- ❌ **PlaceholderMenu** (menu de variáveis `{{contact.name}}`)
- ❌ **InputMapper** (mapeamento de inputs de nodes anteriores)
- ❌ **availableSources** (fontes de dados disponíveis)
- ❌ **inputs** (array de inputs mapeados)
- ❌ **placeholders** (grupos de placeholders disponíveis)

### 2. 🎯 O QUE nodes/ TEM e nodes-v2/ NÃO TEM

#### PlaceholderMenu (placeholder-menu.tsx)
```typescript
interface PlaceholderGroup {
  label: string
  icon?: any
  placeholders: Array<{
    label: string
    value: string // Ex: "{{contact.name}}"
    description?: string
  }>
}

// Uso nos nodes:
<PlaceholderMenu
  groups={data.placeholders ?? []}
  onInsert={handleInsertPlaceholder}
  disabled={data.readOnly}
  triggerLabel="Variáveis"
/>
```

**Funcionalidade**: 
- Dropdown com variáveis disponíveis organizadas por grupos
- Busca de variáveis
- Inserção na posição do cursor
- Suporte a grupos: contact, campaign, system, inputs, previous

#### InputMapper (input-mapper.tsx)
```typescript
interface WorkflowNodeInput {
  name: string
  sourceNodeId: string // ID do node origem
  sourceOutput: string // Nome do output
  required: boolean
}

interface WorkflowAvailableSource {
  nodeId: string
  label: string
  outputs: string[]
}

// Uso nos nodes:
<InputMapper
  value={data.inputs ?? []}
  sources={data.availableSources ?? []}
  onChange={handleInputsChange}
  disabled={data.readOnly}
/>
```

**Funcionalidade**:
- Mapear outputs de nodes anteriores como inputs do node atual
- Collapsible com lista de inputs
- Adicionar/remover inputs dinamicamente
- Selecionar source node + output
- Marcar inputs como required

---

## 📋 PLANO DE MIGRAÇÃO COMPLETA

### FASE 2.1: Copiar Componentes Base ✅

**Arquivos a copiar para nodes-v2/**:

1. **base-node.tsx** (180 LOC)
   - Copiar de `nodes/` para `nodes-v2/`
   - Manter funcionalidades completas
   - Visual estilo n8n

2. **start-node.tsx** (30 LOC)
   - Copiar de `nodes/` para `nodes-v2/`
   - Node de início sem input

3. **end-node.tsx** (35 LOC)
   - Copiar de `nodes/` para `nodes-v2/`
   - Node de fim sem output

**Tempo estimado**: 30 minutos

---

### FASE 2.2: Adicionar Features Avançadas ✅

**Para CADA node em nodes-v2/** (text, media, interactive, http-request):

1. **Adicionar PlaceholderMenu** (onde aplicável)
   - text-message-node ✅
   - media-message-node ✅ (caption)
   - interactive-node ✅ (body, footer)
   - http-request-node ❌ (não precisa)
   - delay-node ❌ (não precisa)

2. **Adicionar InputMapper** (todos precisam)
   - text-message-node ✅
   - media-message-node ✅
   - interactive-node ✅
   - http-request-node ✅
   - delay-node ✅

3. **Atualizar BaseNodeData interface**
   ```typescript
   export interface BaseNodeData {
     // ... existing fields
     inputs?: WorkflowNodeInput[]
     availableSources?: WorkflowAvailableSource[]
     placeholders?: PlaceholderGroup[]
     onInputsChange?: (inputs: WorkflowNodeInput[]) => void
     readOnly?: boolean
   }
   ```

**Tempo estimado**: 4-5 horas

---

### FASE 2.3: Atualizar workflow-editor.tsx ✅

**Mudanças necessárias**:

```typescript
// ❌ ANTES (importa de nodes/)
import StartNode from "./nodes/start-node"
import EndNode from "./nodes/end-node"
import TextMessageNode from "./nodes/text-message-node"
import MediaMessageNode from "./nodes/media-message-node"
import InteractiveNode from "./nodes/interactive-node"
import DelayNode from "./nodes/delay-node"
import HttpRequestNode from "./nodes/http-request-node"

// ✅ DEPOIS (importa de nodes-v2/)
import StartNode from "./nodes-v2/start-node"
import EndNode from "./nodes-v2/end-node"
import TextMessageNode from "./nodes-v2/text-message-node"
import MediaMessageNode from "./nodes-v2/media-message-node"
import InteractiveNode from "./nodes-v2/interactive-node"
import DelayNode from "./nodes-v2/delay-node"
import HttpRequestNode from "./nodes-v2/http-request-node"
```

**Verificações**:
- ✅ Todos os 7 nodeTypes funcionando
- ✅ PlaceholderMenu funcionando em nodes com texto
- ✅ InputMapper funcionando em todos os nodes
- ✅ Drag & drop funcionando
- ✅ Add/Remove nodes funcionando
- ✅ Save/Load workflow funcionando

**Tempo estimado**: 1 hora

---

### FASE 2.4: Validação Completa ✅

**Checklist de Testes** (SEM OMITIR NADA):

#### 1. Teste de Start Node
- [ ] Aparece no menu de nodes
- [ ] Pode ser adicionado ao canvas
- [ ] Não tem handle de input (left)
- [ ] Tem handle de output (right)
- [ ] Visual correto (ícone Play, cor verde)
- [ ] Descrição aparece corretamente
- [ ] Conexão com próximo node funciona

#### 2. Teste de End Node
- [ ] Aparece no menu de nodes
- [ ] Pode ser adicionado ao canvas
- [ ] Tem handle de input (left)
- [ ] Não tem handle de output (right)
- [ ] Visual correto (ícone Stop, cor vermelha)
- [ ] Aceita conexão de node anterior

#### 3. Teste de Text Message Node
- [ ] Aparece no menu de nodes
- [ ] Pode ser adicionado ao canvas
- [ ] Campo "Mensagem" editável
- [ ] **PlaceholderMenu aparece e funciona**
- [ ] **Inserir variável `{{contact.name}}` funciona**
- [ ] **Variável aparece na posição do cursor**
- [ ] Campo "Delay" editável (número)
- [ ] Campo "Presença" editável (número)
- [ ] Switch "Link preview" funciona
- [ ] **InputMapper aparece quando colapsado**
- [ ] **Adicionar input funciona**
- [ ] **Selecionar source node funciona**
- [ ] **Selecionar output funciona**
- [ ] **Remover input funciona**
- [ ] Contador de caracteres funciona
- [ ] Save/Load preserva configuração

#### 4. Teste de Media Message Node
- [ ] Aparece no menu de nodes
- [ ] Pode ser adicionado ao canvas
- [ ] Select "Tipo de Mídia" funciona (image/video/audio/document)
- [ ] Campo "URL da Mídia" editável
- [ ] Campo "Caption" editável
- [ ] **PlaceholderMenu no Caption funciona**
- [ ] **Inserir variável no Caption funciona**
- [ ] Campo "Delay" editável
- [ ] **InputMapper funciona**
- [ ] **Mapear URL de node anterior funciona**
- [ ] Save/Load preserva configuração

#### 5. Teste de Interactive Node
- [ ] Aparece no menu de nodes
- [ ] Pode ser adicionado ao canvas
- [ ] Select "Tipo" funciona (button/list)
- [ ] Campo "Body" editável
- [ ] **PlaceholderMenu no Body funciona**
- [ ] Campo "Footer" editável
- [ ] **PlaceholderMenu no Footer funciona**
- [ ] Lista de botões/itens editável
- [ ] Adicionar/remover botões funciona
- [ ] **InputMapper funciona**
- [ ] Save/Load preserva configuração

#### 6. Teste de Delay Node
- [ ] Aparece no menu de nodes
- [ ] Pode ser adicionado ao canvas
- [ ] Campo "Delay" editável
- [ ] Select "Unidade" funciona (ms/s/min/h)
- [ ] **InputMapper funciona**
- [ ] Save/Load preserva configuração

#### 7. Teste de HTTP Request Node
- [ ] Aparece no menu de nodes
- [ ] Pode ser adicionado ao canvas
- [ ] Select "Método" funciona (GET/POST/PUT/DELETE)
- [ ] Campo "URL" editável
- [ ] Campo "Headers" editável (JSON)
- [ ] Campo "Body" editável (JSON)
- [ ] **InputMapper funciona**
- [ ] **Mapear URL/Headers/Body de nodes anteriores funciona**
- [ ] Save/Load preserva configuração

#### 8. Testes de Workflow Completo
- [ ] Criar workflow: Start → Text → Media → Interactive → Delay → HTTP → End
- [ ] Todas as conexões funcionam
- [ ] PlaceholderMenu funciona em todos os nodes aplicáveis
- [ ] InputMapper funciona em todos os nodes
- [ ] Mapear output de Text como input de Media funciona
- [ ] Salvar workflow completo funciona
- [ ] Carregar workflow completo funciona
- [ ] Todos os dados são preservados
- [ ] Exportar JSON funciona
- [ ] Importar JSON funciona
- [ ] Validação de workflow funciona
- [ ] Detecta workflows sem Start
- [ ] Detecta workflows sem End
- [ ] Detecta loops infinitos
- [ ] Detecta nodes desconectados

**Tempo estimado**: 3 horas

---

### FASE 2.5: Limpeza Final ✅

**Após validação 100% completa**:

1. **Deletar pasta nodes/ antiga**
   ```bash
   rm -rf components/campaign/nodes/
   ```

2. **Renomear nodes-v2/ para nodes/**
   ```bash
   mv components/campaign/nodes-v2/ components/campaign/nodes/
   ```

3. **Atualizar imports no workflow-editor.tsx**
   ```typescript
   // Voltar para importar de ./nodes/
   import StartNode from "./nodes/start-node"
   ```

4. **Verificar nenhum import quebrado**
   ```bash
   npm run lint
   npm run build
   ```

**Tempo estimado**: 30 minutos

---

## 📊 RESUMO DE ESFORÇO

| Fase | Descrição | Tempo | Arquivos |
|------|-----------|-------|----------|
| 2.1 | Copiar base, start, end | 30min | 3 |
| 2.2 | Adicionar PlaceholderMenu + InputMapper | 4-5h | 5 |
| 2.3 | Atualizar workflow-editor | 1h | 1 |
| 2.4 | Validação completa sem omitir nada | 3h | - |
| 2.5 | Limpeza e renomeação | 30min | - |
| **TOTAL** | **Migração Completa** | **9-10h** | **9 arquivos** |

---

## 🎯 RESULTADO ESPERADO

### Estrutura Final

```
components/campaign/
├── nodes/                    # ✅ Única pasta (renomeada de nodes-v2/)
│   ├── base-node.tsx        # ✅ Componente base completo
│   ├── start-node.tsx       # ✅ Node de início
│   ├── end-node.tsx         # ✅ Node de fim
│   ├── text-message-node.tsx    # ✅ Com PlaceholderMenu + InputMapper
│   ├── media-message-node.tsx   # ✅ Com PlaceholderMenu + InputMapper
│   ├── interactive-node.tsx     # ✅ Com PlaceholderMenu + InputMapper
│   ├── delay-node.tsx           # ✅ Com InputMapper
│   └── http-request-node.tsx    # ✅ Com InputMapper
├── placeholder-menu.tsx     # ✅ Mantido
├── input-mapper.tsx         # ✅ Mantido
└── workflow-editor.tsx      # ✅ Importa de ./nodes/
```

### Features Garantidas

✅ **7 nodes completos e funcionais**  
✅ **PlaceholderMenu em nodes de texto**  
✅ **InputMapper em todos os nodes**  
✅ **Sistema de variáveis `{{placeholder}}`**  
✅ **Mapeamento de outputs → inputs**  
✅ **Visual estilo n8n profissional**  
✅ **100% testado sem omissões**  

---

## 🚨 RISCOS E MITIGAÇÕES

### Risco 1: Quebrar workflow existente
**Mitigação**: Manter nodes/ até validação 100% completa

### Risco 2: PlaceholderMenu não funcionar
**Mitigação**: Copiar implementação exata de nodes/ para nodes-v2/

### Risco 3: InputMapper não funcionar
**Mitigação**: Testar cada node individualmente antes de prosseguir

### Risco 4: workflow-editor quebrar
**Mitigação**: Testar imports um por um, validar nodeTypes

---

## ✅ CRITÉRIOS DE SUCESSO

1. ✅ Todos os 7 nodes funcionando em nodes-v2/
2. ✅ PlaceholderMenu funcionando em 3 nodes (text, media, interactive)
3. ✅ InputMapper funcionando em todos os 7 nodes
4. ✅ workflow-editor usando nodes-v2/
5. ✅ 100% dos testes passando sem omissões
6. ✅ npm run lint sem erros
7. ✅ npm run build sem erros
8. ✅ nodes/ deletado
9. ✅ nodes-v2/ renomeado para nodes/

---

**Status**: PRONTO PARA IMPLEMENTAÇÃO  
**Próximo passo**: FASE 2.1 - Copiar base-node, start-node, end-node para nodes-v2/
