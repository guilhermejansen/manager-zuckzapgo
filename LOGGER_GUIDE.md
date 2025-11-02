# 📝 Logger System Guide - Manager ZuckZapGo

Guia completo do sistema de logging profissional do Manager ZuckZapGo.

## 🎯 Visão Geral

O sistema de logging é **100% nativo Next.js**, sem dependências externas, oferecendo:

- ✅ **Cores ANSI** para terminal Node.js (server-side)
- ✅ **Estilos CSS** para browser console (client-side)
- ✅ **5 Níveis de log**: debug, info, warn, error, success
- ✅ **Context-aware**: Componente, ação, metadata
- ✅ **Formatação condicional**: JSON (produção) vs Pretty (desenvolvimento)
- ✅ **TypeScript type-safe** com generics
- ✅ **Performance**: <1ms overhead
- ✅ **Timestamps** automáticos
- ✅ **Stack trace** para errors

---

## 📦 Import

```typescript
import { logger } from "@/lib/logger"
```

---

## 🎨 Níveis de Log

### 1. **debug** - Debugging Detalhado

Uso: Informações de debugging durante desenvolvimento

```typescript
logger.debug("User object loaded", user, {
  component: "UserProfile",
  action: "loadUser",
  metadata: { userId: "123" },
})
```

**Quando usar:**

- Valores de variáveis durante debugging
- Fluxo de execução detalhado
- Dados intermediários de processamento

---

### 2. **info** - Informações Gerais

Uso: Mensagens informativas sobre operações normais

```typescript
logger.info("API request successful", null, {
  component: "ApiClient",
  action: "GET",
  metadata: { endpoint: "/users", status: 200 },
})
```

**Quando usar:**

- Operações concluídas com sucesso
- Estados de sistema normais
- Mudanças de estado importantes

---

### 3. **success** - Operações Bem-Sucedidas

Uso: Destacar operações críticas concluídas com sucesso

```typescript
logger.success("User created successfully", null, {
  component: "UserForm",
  action: "createUser",
  metadata: { userId: newUser.id },
})
```

**Quando usar:**

- Criação/atualização/deleção bem-sucedida
- Operações críticas finalizadas
- Confirmações de ações do usuário

---

### 4. **warn** - Avisos

Uso: Situações anormais que não impedem execução

```typescript
logger.warn("Rate limit approaching", null, {
  component: "ApiClient",
  action: "checkRateLimit",
  metadata: { remaining: 10, limit: 100 },
})
```

**Quando usar:**

- Limites sendo atingidos
- Fallbacks sendo utilizados
- Configurações não ideais
- Deprecated features em uso

---

### 5. **error** - Erros

Uso: Erros e exceções que precisam atenção

```typescript
logger.error("Failed to fetch user", error, {
  component: "UserService",
  action: "fetchUser",
  metadata: { userId: "123" },
})
```

**Quando usar:**

- Exceções capturadas em try-catch
- Falhas de operações críticas
- Erros de validação graves
- Problemas de conectividade

---

## 🏗️ Context (Contexto)

O parâmetro `context` adiciona informações valiosas para debugging:

```typescript
interface LogContext {
  /** Nome do componente ou módulo */
  component?: string

  /** Ação ou função sendo executada */
  action?: string

  /** Metadata adicional (objetos, IDs, etc.) */
  metadata?: Record<string, unknown>

  /** ID do usuário (se aplicável) */
  userId?: string

  /** ID da requisição (para correlação) */
  requestId?: string
}
```

### Exemplos de Uso:

```typescript
// Server Component
logger.info("Fetching user data", null, {
  component: "UserDashboard",
  action: "fetchUserData",
  userId: session.userId,
})

// Client Component
logger.error("Form validation failed", validationError, {
  component: "LoginForm",
  action: "validateForm",
  metadata: { fields: ["email", "password"] },
})

// API Route
logger.warn("Slow database query", null, {
  component: "APIProxy",
  action: "GET",
  metadata: {
    endpoint: "/admin/users",
    duration: 3500,
    threshold: 1000,
  },
})
```

---

## 💻 Uso em Different Contextos

### Server Components (React Server Components)

```typescript
// app/admin/dashboard/page.tsx
import { logger } from "@/lib/logger"

export default async function DashboardPage() {
  try {
    const stats = await fetchStats()
    logger.success("Stats loaded successfully", null, {
      component: "DashboardPage",
      action: "fetchStats",
    })
    return <div>{/* ... */}</div>
  } catch (error) {
    logger.error("Failed to load stats", error, {
      component: "DashboardPage",
      action: "fetchStats",
    })
    return <ErrorState />
  }
}
```

**Saída no terminal Node.js:**

```
2025-01-29T10:30:45.123Z ✅ [SUCCESS] Stats loaded successfully (component=DashboardPage, action=fetchStats)
```

---

### Client Components (Browser)

```typescript
// components/forms/LoginForm.tsx
"use client"

import { logger } from "@/lib/logger"

export function LoginForm() {
  const handleSubmit = async (data: FormData) => {
    try {
      logger.info("Attempting login", null, {
        component: "LoginForm",
        action: "handleSubmit",
      })

      await loginAction(data)

      logger.success("Login successful", null, {
        component: "LoginForm",
        action: "handleSubmit",
      })
    } catch (error) {
      logger.error("Login failed", error, {
        component: "LoginForm",
        action: "handleSubmit",
      })
    }
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

**Saída no browser console:**

```
10:30:45.123 ✅ [SUCCESS] Login successful (component=LoginForm, action=handleSubmit)
```

_(com cores e estilos CSS)_

---

### API Routes (Next.js Route Handlers)

```typescript
// app/api/proxy/[...path]/route.ts
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.pathname

  try {
    const response = await fetch(API_URL + url)
    const data = await response.json()

    logger.info("Proxy request successful", null, {
      component: "APIProxy",
      action: "GET",
      metadata: {
        url,
        status: response.status,
      },
    })

    return NextResponse.json(data)
  } catch (error) {
    logger.error("Proxy request failed", error, {
      component: "APIProxy",
      action: "GET",
      metadata: { url },
    })

    return NextResponse.json({ error: "Proxy error" }, { status: 500 })
  }
}
```

---

### Server Actions

```typescript
// app/actions/auth.ts
"use server"

import { logger } from "@/lib/logger"

// app/actions/auth.ts

// app/actions/auth.ts

// app/actions/auth.ts

// app/actions/auth.ts

export async function loginAction(token: string, role: UserRole) {
  try {
    const isValid = await validateCredentials(token, role)

    if (!isValid) {
      logger.warn("Invalid login attempt", null, {
        component: "AuthActions",
        action: "loginAction",
        metadata: { role },
      })
      return { success: false, error: "Invalid credentials" }
    }

    logger.success("User logged in successfully", null, {
      component: "AuthActions",
      action: "loginAction",
      metadata: { role },
    })

    return { success: true }
  } catch (error) {
    logger.error("Login error", error, {
      component: "AuthActions",
      action: "loginAction",
      metadata: { role },
    })
    return { success: false, error: "Login failed" }
  }
}
```

---

## ⚙️ Configuração (Environment Variables)

### Variáveis Disponíveis

```bash
# .env.local

# Nível mínimo de log (debug, info, warn, error)
# Default: info
NEXT_PUBLIC_LOG_LEVEL=debug

# Habilitar logs no console
# Default: true (desenvolvimento), false (produção)
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=true

# Formato de saída (pretty, json)
# Default: pretty (desenvolvimento), json (produção)
NEXT_PUBLIC_LOG_FORMAT=pretty
```

### Configurações por Ambiente

**Desenvolvimento:**

```bash
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=true
NEXT_PUBLIC_LOG_FORMAT=pretty
```

**Staging:**

```bash
NEXT_PUBLIC_LOG_LEVEL=info
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=true
NEXT_PUBLIC_LOG_FORMAT=json
```

**Produção:**

```bash
NEXT_PUBLIC_LOG_LEVEL=error
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=false
NEXT_PUBLIC_LOG_FORMAT=json
```

---

## 📊 Formato de Saída

### Pretty Format (Desenvolvimento)

**Terminal (Server-side):**

```
2025-01-29T10:30:45.123Z 🔍 [DEBUG] Loading user preferences (component=UserSettings, action=loadPreferences)
2025-01-29T10:30:45.456Z ℹ️  [INFO] API request started (component=ApiClient, action=GET)
2025-01-29T10:30:45.789Z ✅ [SUCCESS] Data saved successfully (component=DataForm, action=saveData)
2025-01-29T10:30:46.012Z ⚠️  [WARN] Cache miss, fetching from database (component=CacheLayer, action=get)
2025-01-29T10:30:46.345Z ❌ [ERROR] Network request failed (component=ApiClient, action=POST)
```

**Browser Console (Client-side):**

```
10:30:45.123 🔍 [DEBUG] User interaction detected (component=InteractiveMap, action=handleClick)
10:30:45.456 ℹ️  [INFO] Fetching data... (component=DataTable, action=fetchData)
10:30:45.789 ✅ [SUCCESS] Changes saved (component=EditForm, action=onSubmit)
```

_(com cores e estilos CSS aplicados)_

### JSON Format (Produção)

```json
{"timestamp":"2025-01-29T10:30:45.123Z","level":"info","message":"API request successful","context":{"component":"ApiClient","action":"GET","metadata":{"endpoint":"/users","status":200}}}
{"timestamp":"2025-01-29T10:30:46.345Z","level":"error","message":"Database connection failed","context":{"component":"Database","action":"connect"},"error":{"name":"Error","message":"Connection timeout"}}
```

---

## 🚀 Boas Práticas

### ✅ Fazer

```typescript
// ✅ Sempre adicionar contexto
logger.info("Operation completed", null, {
  component: "MyComponent",
  action: "myAction",
})

// ✅ Usar metadata para dados estruturados
logger.error("Validation failed", error, {
  component: "Form",
  action: "validate",
  metadata: {
    fields: failedFields,
    userId: user.id,
  },
})

// ✅ Log no nível apropriado
logger.debug("Variable value", { value: x }) // Desenvolvimento
logger.info("Request completed") // Operação normal
logger.success("User created") // Sucesso importante
logger.warn("Deprecated API used") // Aviso
logger.error("Failed to save", error) // Erro

// ✅ Incluir erro original
try {
  await riskyOperation()
} catch (error) {
  logger.error("Operation failed", error, {
    /* context */
  })
}
```

### ❌ Evitar

```typescript
// ❌ NUNCA usar console.* diretamente
console.log("Debug info") // ❌
console.error("Error occurred") // ❌

// ❌ Não omitir contexto
logger.info("Data loaded") // ❌ Sem contexto

// ❌ Não usar string para errors
logger.error("Error: " + error.message) // ❌

// ❌ Não logar informações sensíveis
logger.info("User password", user.password) // ❌ PERIGOSO!

// ❌ Não logar objetos gigantes
logger.debug("Full database dump", entireDatabase) // ❌
```

---

## 🔧 Troubleshooting

### Logs não aparecem

**Problema:** Logs não estão sendo exibidos

**Solução:**

```bash
# Verifique as variáveis de ambiente
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=true
NEXT_PUBLIC_LOG_LEVEL=debug

# Limpe cache e reinicie
rm -rf .next
npm run dev
```

### Cores não aparecem no terminal

**Problema:** Cores ANSI não funcionam no terminal

**Solução:**

- Use um terminal moderno (iTerm2, Hyper, Windows Terminal)
- Verifique se `FORCE_COLOR=1` está definido
- Algumas IDEs (VS Code) podem não suportar cores ANSI completamente

### Performance afetada

**Problema:** Muitos logs afetando performance

**Solução:**

```bash
# Produção: desabilite logs desnecessários
NEXT_PUBLIC_LOG_LEVEL=error
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=false
```

---

## 📈 Performance

- **Overhead**: <1ms por log
- **Zero dependências**: Não adiciona peso ao bundle
- **Lazy evaluation**: Logs desabilitados têm overhead mínimo
- **Format condicional**: JSON em produção é mais eficiente

---

## 🎓 Exemplos Completos

### Exemplo 1: Operação CRUD

```typescript
async function createUser(data: CreateUserData) {
  logger.info("Creating new user", null, {
    component: "UserService",
    action: "createUser",
    metadata: { email: data.email },
  })

  try {
    const user = await db.users.create(data)

    logger.success("User created successfully", null, {
      component: "UserService",
      action: "createUser",
      metadata: { userId: user.id },
    })

    return { success: true, user }
  } catch (error) {
    logger.error("Failed to create user", error, {
      component: "UserService",
      action: "createUser",
      metadata: { email: data.email },
    })

    return { success: false, error: "User creation failed" }
  }
}
```

### Exemplo 2: API Request com Retry

```typescript
async function fetchWithRetry(url: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      logger.debug(`Fetch attempt ${attempt}/${retries}`, null, {
        component: "ApiClient",
        action: "fetchWithRetry",
        metadata: { url, attempt },
      })

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      logger.success("Fetch successful", null, {
        component: "ApiClient",
        action: "fetchWithRetry",
        metadata: { url, attempt },
      })

      return response.json()
    } catch (error) {
      if (attempt === retries) {
        logger.error("All fetch attempts failed", error, {
          component: "ApiClient",
          action: "fetchWithRetry",
          metadata: { url, totalAttempts: retries },
        })
        throw error
      }

      logger.warn(`Fetch attempt ${attempt} failed, retrying...`, null, {
        component: "ApiClient",
        action: "fetchWithRetry",
        metadata: { url, attempt, remaining: retries - attempt },
      })

      await sleep(1000 * attempt) // Exponential backoff
    }
  }
}
```

---

## 📚 Referências

- **Código-fonte**: `lib/logger.ts`
- **Configuração**: `.env.local`, `.env.sample`
- **Guia de Estilo**: `CODE_STYLE.md`
- **Next.js Logging**: [Next.js Docs](https://nextjs.org)

---

## 🆘 Suporte

Problemas ou dúvidas sobre o logger? Consulte:

1. Este guia completo
2. Exemplos no código (`grep -r "logger\." .`)
3. Documentação inline em `lib/logger.ts`

**Pronto!** Sistema de logging profissional funcionando! 🎉
