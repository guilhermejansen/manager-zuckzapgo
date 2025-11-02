# 🎨 Code Style Guide - Manager ZuckZapGo

Este projeto utiliza **Prettier** e **ESLint** para manter consistência e qualidade do código.

## 📦 Ferramentas Configuradas

### ✨ Prettier

Formatador automático de código que garante consistência visual.

### 🔍 ESLint

Analisador estático que detecta problemas e aplica boas práticas.

### 🔗 Integração

ESLint + Prettier trabalham juntos sem conflitos.

---

## 🚀 Scripts Disponíveis

### Desenvolvimento

```bash
npm run dev          # Inicia servidor de desenvolvimento
```

### Formatação

```bash
npm run format       # Formata todo o código
npm run format:check # Verifica formatação sem modificar
npm run format:all   # Formata + aplica correções ESLint
```

### Lint

```bash
npm run lint         # Verifica problemas ESLint
npm run lint:fix     # Corrige automaticamente problemas
npm run check        # Verifica formatação + lint (CI/CD)
```

### Build

```bash
npm run build        # Build de produção
npm run start        # Inicia servidor de produção
```

---

## ⚙️ Configurações

### Prettier (`.prettierrc`)

```json
{
  "semi": false, // Sem ponto e vírgula
  "singleQuote": false, // Aspas duplas
  "tabWidth": 2, // 2 espaços de indentação
  "printWidth": 100, // 100 caracteres por linha
  "trailingComma": "es5", // Vírgulas finais (ES5)
  "arrowParens": "always" // Parênteses em arrow functions
}
```

### ESLint (`eslint.config.mjs`)

- ✅ **Permite `any`**: `@typescript-eslint/no-explicit-any: "off"`
- ⚠️ **Variáveis não usadas**: Prefixe com `_` (ex: `_error`)
- ✅ **Integrado com Prettier**: Sem conflitos de regras

---

## 💡 Boas Práticas

### 1. Formatação Automática (VS Code)

Instale as extensões recomendadas:

- **Prettier** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)

O arquivo `.vscode/settings.json` já configura:

- ✅ Formatação ao salvar
- ✅ Correção ESLint automática
- ✅ Trim de espaços em branco

### 2. Antes de Commit

```bash
npm run format:all   # Formata e corrige tudo
npm run check        # Verifica se está tudo ok
```

### 3. CI/CD

No pipeline, adicione:

```yaml
- run: npm run check
- run: npm run build
```

### 4. Ignorar Variáveis Não Usadas

```typescript
// ❌ Erro: 'error' is defined but never used
catch (error) {
  console.log("Erro")
}

// ✅ Correto: prefixe com underscore
catch (_error) {
  console.log("Erro")
}
```

### 5. Uso de `any`

```typescript
// ✅ Permitido quando necessário
const data: any = await fetchData()

// 💡 Prefira tipos específicos quando possível
const user: User = await fetchUser()
```

---

## 📁 Arquivos de Configuração

```
manager-zuckzapgo/
├── .prettierrc              # Configuração Prettier
├── .prettierignore          # Arquivos ignorados pelo Prettier
├── eslint.config.mjs        # Configuração ESLint
├── .vscode/
│   ├── settings.json        # Formatação automática VS Code
│   └── extensions.json      # Extensões recomendadas
└── CODE_STYLE.md            # Este guia
```

---

## 🔧 Troubleshooting

### Prettier não formata ao salvar

1. Instale extensão Prettier no VS Code
2. Configure como formatter padrão:
   ```json
   "editor.defaultFormatter": "esbenp.prettier-vscode"
   ```

### ESLint não corrige automaticamente

1. Instale extensão ESLint no VS Code
2. Habilite no `settings.json`:
   ```json
   "editor.codeActionsOnSave": {
     "source.fixAll.eslint": "explicit"
   }
   ```

### Conflitos entre Prettier e ESLint

✅ Já resolvido! O `eslint-config-prettier` desabilita regras conflitantes.

### Imports não são organizados automaticamente

✅ Plugin `@trivago/prettier-plugin-sort-imports` organiza automaticamente:

- React/Next.js primeiro
- Bibliotecas externas
- Imports locais (`@/`)
- Imports relativos

---

## 📊 Estatísticas

- ✅ **78 arquivos formatados** no primeiro run
- ✅ **Zero erros críticos** ESLint
- ✅ **Build production** funcionando
- ✅ **100% compatível** Next.js 16

---

## 📝 Logging System

### Sistema de Logging Profissional

O projeto usa um **sistema de logging nativo Next.js** (zero dependências) com:

- ✅ Cores ANSI para terminal (server-side)
- ✅ Estilos CSS para browser console (client-side)
- ✅ 5 níveis: debug, info, warn, error, success
- ✅ Context-aware (componente, ação, metadata)
- ✅ TypeScript type-safe
- ✅ Performance <1ms overhead

### Regras de Logging

**❌ NUNCA usar `console.*` diretamente:**

```typescript
// ✅ CORRETO
import { logger } from "@/lib/logger"

// ❌ ERRADO
console.log("Debug info")
console.error("Error occurred")

logger.info("Operation completed", null, {
  component: "MyComponent",
  action: "myAction",
})

logger.error("Operation failed", error, {
  component: "MyComponent",
  action: "myAction",
  metadata: { userId: "123" },
})
```

### Níveis de Log

```typescript
// Debug: informações detalhadas de debugging
logger.debug("Variable value", { value: x }, { component: "Debug" })

// Info: operações normais
logger.info("Request completed", null, { component: "API" })

// Success: operações bem-sucedidas importantes
logger.success("User created", null, { component: "UserService" })

// Warn: avisos que não impedem execução
logger.warn("Rate limit approaching", null, { component: "API" })

// Error: erros e exceções
logger.error("Failed to save", error, { component: "DataService" })
```

### Context Obrigatório

**Sempre** incluir contexto nos logs:

```typescript
// ✅ Padrão mínimo
logger.info("Message", null, {
  component: "ComponentName",
  action: "actionName",
})

// ✅ Com metadata adicional
logger.error("Error occurred", error, {
  component: "FormComponent",
  action: "handleSubmit",
  metadata: {
    userId: user.id,
    formData: data,
  },
})
```

### Configuração (.env.local)

```bash
# Desenvolvimento
NEXT_PUBLIC_LOG_LEVEL=debug
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=true
NEXT_PUBLIC_LOG_FORMAT=pretty

# Produção
NEXT_PUBLIC_LOG_LEVEL=error
NEXT_PUBLIC_ENABLE_CONSOLE_LOGS=false
NEXT_PUBLIC_LOG_FORMAT=json
```

### Documentação Completa

Consulte o **[Logger Guide](./LOGGER_GUIDE.md)** para:

- Exemplos completos de uso
- Boas práticas detalhadas
- Troubleshooting
- Configurações avançadas

---

## 🎯 Resumo Rápido

```bash
# Antes de cada commit
npm run format:all

# Verificar se está tudo ok
npm run check

# Build de produção
npm run build
```

**Regras Essenciais:**

- ✅ SEMPRE usar `logger`, NUNCA usar `console.*`
- ✅ SEMPRE incluir contexto nos logs
- ✅ Formatar código antes de commit
- ✅ Validar TypeScript sem erros

**Pronto!** Código limpo, organizado e profissional! ✨
