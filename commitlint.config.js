/**
 * ===========================================================================
 * Commitlint Configuration
 * Manager ZuckZapGo - Validação de Commits Semânticos
 * ===========================================================================
 *
 * Este arquivo configura as regras de validação para mensagens de commit,
 * garantindo que sigam o padrão Conventional Commits.
 *
 * Formato esperado:
 * <type>(<scope>): <subject>
 *
 * Exemplo:
 * feat(campaigns): adiciona filtro de status nas campanhas
 * fix(api): corrige timeout em requisições longas
 * docs(readme): atualiza instruções de instalação
 */

module.exports = {
  extends: ["@commitlint/config-conventional"],

  rules: {
    // Tipos permitidos de commits
    "type-enum": [
      2,
      "always",
      [
        "feat",      // Nova funcionalidade
        "fix",       // Correção de bug
        "docs",      // Documentação
        "style",     // Formatação (sem mudança de código)
        "refactor",  // Refatoração (sem mudança funcional)
        "perf",      // Melhoria de performance
        "test",      // Adição ou correção de testes
        "build",     // Mudanças no sistema de build
        "ci",        // Mudanças em CI/CD
        "chore",     // Tarefas gerais (manutenção)
        "revert",    // Reversão de commit anterior
      ],
    ],

    // Tipo é obrigatório
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],

    // Subject é obrigatório e não pode terminar com ponto
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "subject-case": [
      2,
      "never",
      ["sentence-case", "start-case", "pascal-case", "upper-case"],
    ],

    // Header não pode ser muito longo
    "header-max-length": [2, "always", 100],

    // Body deve ter uma linha em branco antes
    "body-leading-blank": [2, "always"],

    // Body pode ter linhas longas (necessário para changelogs com URLs)
    "body-max-line-length": [0, "always", Infinity],

    // Footer deve ter uma linha em branco antes
    "footer-leading-blank": [2, "always"],

    // Scope é opcional mas deve ser lower-case
    "scope-case": [2, "always", "lower-case"],
  },

  // Ignora commits de release automáticos do semantic-release
  ignores: [
    (commit) => commit.includes('[skip ci]'),
  ],
};
