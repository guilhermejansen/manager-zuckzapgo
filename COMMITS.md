# 📝 Guia Completo de Commits Semânticos

Guia detalhado sobre como escrever mensagens de commit usando a convenção Conventional Commits no Manager ZuckZapGo.

## 📋 Índice

- [Por Que Commits Semânticos?](#por-que-commits-semânticos)
- [Estrutura de um Commit](#estrutura-de-um-commit)
- [Tipos de Commit](#tipos-de-commit)
- [Scopes Comuns](#scopes-comuns)
- [Exemplos Práticos](#exemplos-práticos)
- [Breaking Changes](#breaking-changes)
- [Ferramentas](#ferramentas)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Por Que Commits Semânticos?

### Benefícios

✅ **Changelog Automático**: Geração automatizada de CHANGELOG.md
✅ **Versionamento Automático**: Semantic versioning determinado automaticamente
✅ **Releases Automatizadas**: GitHub releases criadas automaticamente
✅ **Histórico Claro**: Navegação fácil no histórico do git
✅ **Melhor Colaboração**: Padrão consistente para toda a equipe
✅ **CI/CD Eficiente**: Workflows automatizados baseados em commits

### Como Funciona

```
Commits → Análise → Determina Versão → Gera Changelog → Cria Release → Build Docker
```

---

## 🏗️ Estrutura de um Commit

### Formato Completo

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Componentes

#### 1. Type (Obrigatório)

O tipo do commit determina o impacto no versionamento.

#### 2. Scope (Opcional)

Contexto ou módulo afetado pela mudança.

#### 3. Subject (Obrigatório)

Descrição curta (máximo 100 caracteres).

#### 4. Body (Opcional)

Descrição detalhada da mudança.

#### 5. Footer (Opcional)

Informações adicionais (breaking changes, issues relacionadas).

---

## 🏷️ Tipos de Commit

### Tipos Principais

| Tipo | Descrição | Versão | Exemplo |
|------|-----------|--------|---------|
| `feat` | Nova funcionalidade | **MINOR** | `feat(campaigns): adiciona filtro de data` |
| `fix` | Correção de bug | **PATCH** | `fix(api): corrige timeout em uploads` |
| `perf` | Melhoria de performance | **PATCH** | `perf(dashboard): otimiza query de estatísticas` |

### Tipos Secundários (Sem bump de versão)

| Tipo | Descrição | Versão | Exemplo |
|------|-----------|--------|---------|
| `docs` | Apenas documentação | Nenhum | `docs(readme): atualiza guia de instalação` |
| `style` | Formatação, espaços em branco | Nenhum | `style(components): corrige indentação` |
| `refactor` | Refatoração sem mudança funcional | PATCH | `refactor(utils): simplifica validação de email` |
| `test` | Adiciona ou corrige testes | Nenhum | `test(campaigns): adiciona teste de integração` |
| `build` | Mudanças em sistema de build | Nenhum | `build(docker): otimiza multi-stage build` |
| `ci` | Mudanças em CI/CD | Nenhum | `ci(github): adiciona workflow de testes` |
| `chore` | Tarefas de manutenção | Nenhum | `chore(deps): atualiza dependências` |
| `revert` | Reverte commit anterior | PATCH | `revert: feat(api): remove endpoint temporário` |

---

## 🎯 Scopes Comuns

### Por Módulo/Feature

- `campaigns` - Sistema de campanhas
- `instances` - Gerenciamento de instâncias WhatsApp
- `contacts` - Gerenciamento de contatos
- `dashboard` - Dashboard e estatísticas
- `api` - Endpoints da API
- `auth` - Autenticação e autorização
- `ui` - Componentes de interface
- `workflow` - Editor de fluxo de trabalho

### Por Tipo de Arquivo

- `components` - Componentes React
- `types` - Definições TypeScript
- `hooks` - React hooks
- `utils` - Funções utilitárias
- `lib` - Bibliotecas e helpers
- `prisma` - Schema e migrations do Prisma

### Por Infraestrutura

- `docker` - Configurações Docker
- `ci` - CI/CD e GitHub Actions
- `deps` - Dependências
- `config` - Arquivos de configuração

### Scope Global

Use `*` para mudanças que afetam todo o projeto:

```bash
refactor(*): reorganiza estrutura de pastas
```

---

## 💡 Exemplos Práticos

### Novas Funcionalidades (feat)

```bash
# Simples
feat(campaigns): adiciona botão de duplicar campanha

# Com body
feat(api): implementa endpoint de estatísticas

Adiciona novo endpoint GET /api/campaigns/:id/stats que retorna:
- Total de mensagens enviadas
- Taxa de entrega
- Taxa de leitura
- Tempo médio de resposta

# Com footer
feat(dashboard): adiciona gráfico de performance

Implementa gráfico interativo usando Recharts para
visualização de métricas de campanhas em tempo real.

Closes #123
```

### Correções de Bugs (fix)

```bash
# Simples
fix(contacts): corrige importação de CSV com caracteres especiais

# Com explicação
fix(api): resolve memory leak em websocket

O listener de eventos não estava sendo removido
corretamente ao fechar a conexão, causando
acúmulo de memória ao longo do tempo.

Fixes #456
```

### Melhorias de Performance (perf)

```bash
perf(dashboard): reduz tempo de carregamento em 60%

Implementa as seguintes otimizações:
- Lazy loading de componentes pesados
- Memoização de cálculos complexos
- Virtualização de listas longas
- Cache de requisições API
```

### Documentação (docs)

```bash
docs(api): adiciona exemplos de uso do endpoint de campanhas
docs(readme): atualiza instruções de deploy Docker
docs(contributing): adiciona seção sobre commits semânticos
```

### Refatoração (refactor)

```bash
refactor(components): extrai lógica de validação para custom hook

Move validação de formulários de campanhas para
useCampaignValidation hook reutilizável.
```

### Testes (test)

```bash
test(campaigns): adiciona testes E2E para criação de campanha
test(api): aumenta cobertura de testes para 85%
test(utils): adiciona testes unitários para formatação de data
```

### Build e CI (build, ci)

```bash
build(docker): adiciona suporte multi-arquitetura (amd64/arm64)
ci(github): configura semantic-release para releases automáticas
ci(docker): otimiza cache do Docker build
```

### Tarefas (chore)

```bash
chore(deps): atualiza Next.js para versão 16.0.1
chore(prisma): regenera cliente após mudança no schema
chore(git): adiciona arquivos de build ao .gitignore
```

---

## 💥 Breaking Changes

Breaking changes são mudanças que quebram compatibilidade com versões anteriores e resultam em **MAJOR** version bump (1.0.0 → 2.0.0).

### Método 1: Usando `!` após o tipo

```bash
feat!: remove suporte para Node.js 14

A versão mínima do Node.js agora é 16.
```

### Método 2: Usando `BREAKING CHANGE:` no footer

```bash
feat(api): muda estrutura de resposta do endpoint de campanhas

A resposta agora retorna um objeto paginado ao invés
de um array direto.

BREAKING CHANGE: O endpoint /api/campaigns agora retorna
{ data: Campaign[], pagination: {...} } ao invés de Campaign[]
```

### Método 3: Ambos (mais claro)

```bash
feat(auth)!: implementa novo sistema de autenticação

Migra de JWT para OAuth 2.0 para melhor segurança.

BREAKING CHANGE: Tokens JWT antigos não são mais válidos.
Usuários precisarão fazer login novamente.

Migration Guide:
1. Atualizar CLIENT_ID nas variáveis de ambiente
2. Configurar redirect URLs no OAuth provider
3. Executar script de migração: npm run migrate:auth
```

---

## 🔧 Ferramentas

### Commitlint

Valida mensagens de commit automaticamente.

**Configuração**: `commitlint.config.js`

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [
      "feat", "fix", "docs", /* ... */
    ]],
    "header-max-length": [2, "always", 100],
  },
}
```

### Husky

Executa hooks do git automaticamente.

**Hook de commit-msg**: `.husky/commit-msg`

```sh
#!/usr/bin/env sh
npx --no -- commitlint --edit ${1}
```

### Semantic Release

Automatiza releases baseadas em commits.

**Configuração**: `.releaserc.json`

- Analisa commits desde última release
- Determina próxima versão (MAJOR, MINOR, PATCH)
- Gera CHANGELOG.md
- Cria GitHub Release
- Atualiza package.json
- Cria tag git

---

## 🎨 Boas Práticas

### ✅ Faça

- Use presente do indicativo: "adiciona" ao invés de "adicionado"
- Seja conciso mas descritivo
- Use lowercase para type e scope
- Capitalize apenas a primeira letra do subject
- Não termine o subject com ponto final
- Use body para explicar "o quê" e "por quê", não "como"
- Referencie issues relacionadas no footer
- Use breaking changes com cuidado e documentação

### ❌ Evite

- Commits genéricos: "update", "fix bug", "changes"
- Misturar múltiplas mudanças em um commit
- Commits muito grandes (refatore em commits menores)
- Usar abreviações não claras
- Ignorar o scope quando apropriado

---

## 🚨 Troubleshooting

### Commit foi rejeitado pelo Commitlint

```bash
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

**Solução**: Verifique se o commit segue o formato `type(scope): subject`

### Como editar a mensagem do último commit?

```bash
git commit --amend
```

### Como fazer um commit de merge?

Merges não precisam seguir a convenção:

```bash
git merge feature/nova-funcionalidade
# Mensagem padrão de merge é aceitável
```

### Como reverter um commit?

```bash
# Cria novo commit revertendo
git revert <commit-hash>

# A mensagem será algo como:
# revert: feat(campaigns): adiciona filtro de data
#
# This reverts commit abc123.
```

### Posso usar emojis?

Não é necessário e não é recomendado. Os tipos já fornecem contexto visual suficiente, e emojis podem causar problemas com ferramentas de automação.

### Posso usar commits convencionais em branches?

Sim! Recomendamos usar em todos os commits, mesmo em branches de feature. Isso facilita squash e rebase.

---

## 📚 Referências

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Semantic Release Documentation](https://semantic-release.gitbook.io/)

---

## 🎓 Exemplos Avançados

### Múltiplos Scopes

```bash
feat(campaigns,contacts): adiciona importação de contatos via campanha

Permite importar contatos diretamente ao criar uma
nova campanha, simplificando o fluxo de trabalho.
```

### Commits de Merge Squash

Ao fazer squash de uma feature branch:

```bash
feat(workflow): implementa editor visual de fluxo de trabalho

- Adiciona biblioteca React Flow
- Implementa arrastar e soltar de nós
- Adiciona validação de conexões
- Implementa salvar/carregar fluxo
- Adiciona preview de execução

Closes #789
```

### Commits de Release Manual

Em casos raros onde você precisa criar uma release manual:

```bash
chore(release): 1.5.0

[skip ci]
```

---

**Dúvidas?** Consulte [CONTRIBUTING.md](../CONTRIBUTING.md) ou abra uma [issue de pergunta](../../issues/new?template=question.yml).
