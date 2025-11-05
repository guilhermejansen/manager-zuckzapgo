# ✅ Correção de Avatares - Instâncias de Campanhas

## 🐛 Problema Identificado

As imagens (avatares) das instâncias WhatsApp não estavam aparecendo nos componentes de seleção e gerenciamento de instâncias de campanhas.

**Causa**: Os componentes tinham `<AvatarImage src="" />` (string vazia) ao invés de usar o campo `avatar_url` das instâncias.

---

## 🔧 Correções Aplicadas

### 1. **InstanceSelector** (`components/campaign/instance-selector.tsx`)

#### Correção 1: Lista de Instâncias Selecionadas
**Linha ~287**
```typescript
// ANTES
<AvatarImage src="" alt={instance.name} />

// DEPOIS
<AvatarImage src={matchingInstance?.avatar_url} alt={instance.name} />
```

#### Correção 2: Dialog de Adicionar Instâncias
**Linha ~417**
```typescript
// ANTES
<AvatarImage src="" alt={instance.name} />

// DEPOIS
<AvatarImage src={instance.avatar_url} alt={instance.name} />
```

**Explicação**: 
- Na lista de selecionadas, usa `matchingInstance` (que busca a instância da lista de disponíveis)
- No dialog, usa `instance.avatar_url` diretamente (pois já tem acesso ao objeto User completo)

---

### 2. **InstanceManager** (`components/campaign/instance-manager.tsx`)

#### Correção 1: Adicionar Estado para Dados das Instâncias
**Linha ~133**
```typescript
// ADICIONADO
const [instancesData, setInstancesData] = useState<Map<string, { avatar_url?: string }>>(new Map())
```

#### Correção 2: Adicionar Import do adminApi
**Linha ~58**
```typescript
// ADICIONADO
import { adminApi } from "@/lib/api"
```

#### Correção 3: Buscar Dados das Instâncias (Users)
**Linha ~162**
```typescript
// ADICIONADO na função loadInstances()
// Buscar dados das instâncias (Users) para obter avatar_url
if (campaignInstances.length > 0) {
  try {
    const usersResponse = await adminApi.users.list()
    const usersMap = new Map<string, { avatar_url?: string }>()
    
    usersResponse.data?.forEach((user: any) => {
      usersMap.set(user.id, { avatar_url: user.avatar_url })
    })
    
    setInstancesData(usersMap)
  } catch (err) {
    logger.error("Error loading users data", err instanceof Error ? err : undefined, {
      component: "InstanceManager",
      action: "loadInstances",
    })
  }
}
```

#### Correção 4: Usar avatar_url no Avatar
**Linha ~349**
```typescript
// ANTES
<AvatarImage src="" alt={instance.name || "Instance"} />

// DEPOIS
<AvatarImage 
  src={instancesData.get(instance.instanceId)?.avatar_url} 
  alt={instance.name || "Instance"} 
/>
```

**Explicação**:
- `CampaignInstance` não tem relação direta com `User` no Prisma
- Apenas tem `instanceId` (string) que corresponde ao `User.id`
- Solução: Buscar lista completa de Users e criar um Map para lookup eficiente
- Usar `instancesData.get(instance.instanceId)?.avatar_url` para obter o avatar

---

## 📊 Arquivos Modificados

| Arquivo | Modificações |
|---------|--------------|
| `components/campaign/instance-selector.tsx` | 2 correções (linhas 287 e 417) |
| `components/campaign/instance-manager.tsx` | 4 adições (estado, import, função de busca, uso do avatar) |

**Total**: 2 arquivos, 6 modificações

---

## ✅ Resultado

Agora todos os avatares das instâncias WhatsApp são exibidos corretamente:

### ✅ InstanceSelector
- ✅ Avatares visíveis na lista de instâncias selecionadas
- ✅ Avatares visíveis no dialog de adicionar instâncias
- ✅ Fallback para iniciais quando sem avatar

### ✅ InstanceManager
- ✅ Avatares visíveis na tabela de instâncias
- ✅ Busca eficiente usando Map
- ✅ Error handling para falha na busca de users
- ✅ Fallback para iniciais quando sem avatar

---

## 🎯 Funcionalidades Verificadas

- [x] Avatares aparecem ao criar campanha
- [x] Avatares aparecem ao editar campanha (tab Instâncias)
- [x] Avatares aparecem no dialog de adicionar instâncias
- [x] Avatares aparecem na tabela do InstanceManager
- [x] Fallback funciona quando não há avatar
- [x] Performance otimizada com Map lookup

---

## 🔍 Referência

**Base de comparação**: Página de instâncias (`app/admin/instances/page.tsx`)
```typescript
// Linha ~254 - Como é feito corretamente
<Avatar className="size-10">
  <AvatarImage src={instance.avatar_url} alt={instance.name} />
  <AvatarFallback className="text-xs font-semibold uppercase">
    {initials}
  </AvatarFallback>
</Avatar>
```

---

*Correção aplicada em: $(date)*
*Sistema de avatares 100% funcional!* ✅
