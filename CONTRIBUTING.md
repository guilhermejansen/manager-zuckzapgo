# Guia de Contribuição - Manager ZuckZapGo

Obrigado por considerar contribuir para o Manager ZuckZapGo! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Contribuir](#como-contribuir)
- [Commits Semânticos](#commits-semânticos)
- [Processo de Pull Request](#processo-de-pull-request)
- [Padrões de Código](#padrões-de-código)
- [Testes](#testes)
- [Documentação](#documentação)

---

## 📜 Código de Conduta

Este projeto adere a um código de conduta para garantir um ambiente acolhedor e inclusivo. Ao participar, você concorda em:

- Ser respeitoso e profissional
- Aceitar críticas construtivas
- Focar no que é melhor para a comunidade
- Mostrar empatia com outros membros

---

## 🤝 Como Contribuir

### Reportando Bugs

Use o [template de bug report](../../issues/new?template=bug_report.yml) e inclua:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs. real
- Screenshots (se aplicável)
- Versão do Manager ZuckZapGo
- Ambiente (navegador, SO, etc.)

### Sugerindo Melhorias

Use o [template de feature request](../../issues/new?template=feature_request.yml) e inclua:

- Problema que a funcionalidade resolve
- Solução proposta detalhada
- Alternativas consideradas
- Caso de uso específico
- Mockups (se aplicável)

### Fazendo Perguntas

Use o [template de pergunta](../../issues/new?template=question.yml) para dúvidas sobre:

- Instalação e configuração
- Uso de funcionalidades
- API e integrações
- Deploy e Docker
- Troubleshooting

---

## 💬 Commits Semânticos

Este projeto segue a convenção de **Conventional Commits** para commits semânticos.

### Formato

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Tipos de Commit

| Tipo | Descrição | Bump de Versão |
|------|-----------|----------------|
| `feat` | Nova funcionalidade | MINOR (1.0.0 → 1.1.0) |
| `fix` | Correção de bug | PATCH (1.0.0 → 1.0.1) |
| `docs` | Apenas documentação | Nenhum |
| `style` | Formatação (sem mudança de código) | Nenhum |
| `refactor` | Refatoração (sem mudança funcional) | PATCH |
| `perf` | Melhoria de performance | PATCH |
| `test` | Adição ou correção de testes | Nenhum |
| `build` | Mudanças no sistema de build | Nenhum |
| `ci` | Mudanças em CI/CD | Nenhum |
| `chore` | Tarefas gerais (manutenção) | Nenhum |
| `revert` | Reversão de commit anterior | PATCH |

### Breaking Changes

Para mudanças incompatíveis (MAJOR bump: 1.0.0 → 2.0.0), adicione `!` após o tipo ou inclua `BREAKING CHANGE:` no footer:

```bash
feat!: remove suporte para Node.js 14
```

```bash
feat(api): adiciona novo endpoint de campanhas

BREAKING CHANGE: O endpoint antigo /campaigns foi removido
```

### Exemplos de Commits

✅ **Bons Exemplos:**

```bash
feat(campaigns): adiciona filtro de status nas campanhas
fix(api): corrige timeout em requisições longas
docs(readme): atualiza instruções de instalação do Docker
perf(dashboard): otimiza carregamento de dados da dashboard
refactor(components): extrai lógica de validação para helper
```

❌ **Maus Exemplos:**

```bash
update stuff
fixed bug
WIP
alterações gerais
```

### Validação Automática

O projeto usa **Commitlint** + **Husky** para validar mensagens de commit automaticamente. Commits que não seguem o padrão serão rejeitados.

📚 **Documentação Completa**: Consulte [docs/COMMITS.md](docs/COMMITS.md) para mais detalhes e exemplos.

---

## 🔀 Processo de Pull Request

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/zuckzapgo-private.git
cd manager-zuckzapgo
```

### 2. Crie uma Branch

```bash
# Sempre crie a partir da main
git checkout main
git pull origin main

# Crie uma branch descritiva
git checkout -b feat/adiciona-filtro-campanhas
# ou
git checkout -b fix/corrige-timeout-api
```

### 3. Faça suas Mudanças

- Siga os [padrões de código](#padrões-de-código)
- Adicione testes para novas funcionalidades
- Atualize a documentação se necessário
- Faça commits semânticos

### 4. Teste Localmente

```bash
# Instalar dependências
npm install

# Executar linter
npm run lint

# Formatar código
npm run format

# Executar testes
npm test

# Build local
npm run build
```

### 5. Push e Pull Request

```bash
# Push para seu fork
git push origin feat/adiciona-filtro-campanhas

# Abra um Pull Request no GitHub
```

### Checklist do Pull Request

- [ ] Título descritivo e claro
- [ ] Descrição completa das mudanças
- [ ] Commits semânticos
- [ ] Testes passando
- [ ] Código formatado (Prettier)
- [ ] Sem erros de lint
- [ ] Documentação atualizada (se aplicável)
- [ ] Screenshots (se mudança visual)

---

## 🎨 Padrões de Código

### TypeScript/JavaScript

- **TypeScript** para todo código novo
- **Async/await** ao invés de promises encadeadas
- **Functional components** no React
- **Hooks** ao invés de class components
- **Named exports** ao invés de default exports

### Estilo de Código

```bash
# Formatar código automaticamente
npm run format

# Verificar formatação
npm run format:check

# Corrigir erros de lint
npm run lint:fix
```

### Convenções

- **Nomes de arquivos**: `kebab-case.tsx`
- **Componentes**: `PascalCase`
- **Funções/variáveis**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Interfaces/Types**: `PascalCase` (prefixo `I` não é necessário)

### Imports

Use o plugin de ordenação de imports (já configurado):

```typescript
// 1. React
import { useState } from "react"

// 2. Next.js
import { useRouter } from "next/router"

// 3. Bibliotecas externas
import { z } from "zod"

// 4. Imports locais (@/)
import { Button } from "@/components/ui/button"

// 5. Imports relativos
import { helper } from "./helper"
```

---

## 🧪 Testes

### Executar Testes

```bash
# Todos os testes
npm test

# Watch mode
npm test -- --watch

# Com cobertura
npm test -- --coverage
```

### Escrever Testes

- **Unit tests**: Para funções e utilitários
- **Integration tests**: Para fluxos completos
- **E2E tests**: Para cenários críticos de usuário

```typescript
// Exemplo de teste
describe("CampaignFilter", () => {
  it("deve filtrar campanhas por status", () => {
    const result = filterByStatus(campaigns, "RUNNING")
    expect(result).toHaveLength(2)
  })
})
```

---

## 📚 Documentação

### Código

- Use **JSDoc** para funções e componentes complexos
- Documente **por quê**, não **o quê** (o código já mostra o quê)
- Adicione **exemplos** quando apropriado

```typescript
/**
 * Filtra campanhas por status
 *
 * @param campaigns - Lista de campanhas
 * @param status - Status desejado (DRAFT, RUNNING, COMPLETED, etc.)
 * @returns Campanhas filtradas
 *
 * @example
 * ```ts
 * const running = filterByStatus(campaigns, "RUNNING")
 * ```
 */
export function filterByStatus(campaigns: Campaign[], status: CampaignStatus) {
  return campaigns.filter((c) => c.status === status)
}
```

### README e Guias

- Mantenha o README.md atualizado
- Adicione guias em `docs/` para features complexas
- Use screenshots e exemplos práticos

---

## 🚀 Versionamento e Releases

### Versionamento Semântico

O projeto segue o [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): Novas funcionalidades (compatíveis)
- **PATCH** (1.0.0 → 1.0.1): Correções de bugs

### Release Automática

O projeto usa **semantic-release** para releases automáticas:

1. Commits são analisados quando push para `main`
2. Versão é determinada automaticamente
3. Changelog é gerado
4. GitHub Release é criado
5. Tag é criada
6. Docker image é buildada e publicada

**Você não precisa se preocupar com versões!** Apenas siga os commits semânticos.

---

## 🙏 Reconhecimento

Todas as contribuições são valorizadas e serão reconhecidas:

- Adição ao arquivo CONTRIBUTORS.md
- Menção nas release notes
- Crédito nos commits

---

## 📞 Precisa de Ajuda?

- 📧 Email: suporte@setupautomatizado.com.br
- 💬 [GitHub Discussions](../../discussions)
- 🐛 [Reportar Bug](../../issues/new?template=bug_report.yml)
- ✨ [Sugerir Feature](../../issues/new?template=feature_request.yml)
- ❓ [Fazer Pergunta](../../issues/new?template=question.yml)

---

**Obrigado por contribuir! 🎉**
