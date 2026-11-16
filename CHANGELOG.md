# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.6.4](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.6.3...v1.6.4) (2026-11-16)

### 🐛 Correções de Bugs

* **docker:** parse Redis host and port when REDIS_URL carries credentials (86b7d0416eb20c888f90d1b5b5d2baa9f442edab)

## [1.6.3](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.6.2...v1.6.3) (2026-11-15)

### 🐛 Correções de Bugs

* **campaign:** align placeholder callback with compiler dependencies (574ac5fb972dbfce97aa63dbe265859a55f4ddc0)
* **landing:** restore readable responsive marketing flow (52f4afdb1d363be4a61d70751a7dc451b70471a3)
* **ui:** make manager hydration and schedule rendering deterministic (e2789cfaf804f045936bdf100ff48019dd9d449c)

## [1.6.2](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.6.1...v1.6.2) (2026-01-07)

### 🐛 Correções de Bugs

* **build:** add not-found page and update baseline-browser-mapping (3badaa609be48a005dde39b2fba7e4e2ea853233)
* **build:** resolve typescript errors for bun compatibility (a74c04c2b6f64c9e89a8dcb61c8136f82ae943ff)
* **ui:** add mounted state to Toaster for SSR compatibility (ed83c98f521e3c4642a6fbd5b6e7ed7c34028b9b)
* **ui:** simplify global-error for prerender compatibility (ab90fe63642f645592f8377c10ea48a378ca0a58)

### ♻️ Refatorações

* **excel:** migrate from xlsx to exceljs (169e676d2306c5ec6b7ee9f428acb645179e13d8)

## [1.6.1](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.6.0...v1.6.1) (2025-11-10)

### 🐛 Correções de Bugs

* **docker:** ajuste do dockerfile para word-wrap@1.2.5 (7c104ba7079f84d7938ffa10757e555e1457fa96)

## [1.6.0](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.5.1...v1.6.0) (2025-11-10)

### ✨ Novas Funcionalidades

* **license:** adicionar campos no type (acd18699df474b16ebbc448b6e1c390c57143f60)

## [1.5.1](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.5.0...v1.5.1) (2025-11-07)

### 🐛 Correções de Bugs

* **campaign:** fix nodev2 (3080c3c45eae4ba5d53179752463e9228340ced7)

## [1.5.0](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.4.1...v1.5.0) (2025-11-05)

### ✨ Novas Funcionalidades

* **actions:** implementar server actions completas para gerenciamento de campanhas (0cb603eeaadded293fabd44a1ff39e9308cb86bd)
* **components:** adicionar componentes reutilizáveis para o sistema de campanhas (09c2f8d37b809b2ecfbbdfda6606de28f771fbc2)
* **config:** configurar Next.js para standalone output e server actions (0dd5471477adb15fa618cd0c5c551dcaab286cdd)
* **contacts:** implementar sistema completo de adição e validação de contatos (328f98825b676a0094be93d17e38649f00163b3d)
* **database:** adicionar schema completo do sistema de campanhas (6eb889edc904d580ee50fe717c00336c17843f19)
* **docker:** configurar docker-compose para produção com workers separados (a925896926a6d3768e646093217d9c867c8513c5)
* **instances:** implementar server actions para gerenciamento de instâncias WhatsApp (64c866ec03938d99f5728a35c4437b95b78c404c)
* **landing:** criar landing page profissional para o sistema (d529e767dc4c83eb2c582e11ad97ee76a2a60357)
* **pages:** implementar páginas completas de gerenciamento de campanhas (3b4b07f70dc7c7ef644c27c7bb1e88da055d5812)
* **utils:** adicionar componentes avançados e utilitários para campanhas (fc7fac5a15796bd424a7c8801d23ddfaf91192db)
* **validation:** adicionar schemas Zod completos para campanhas e contatos (7f15716301e6de8ce24fa4945acc88f87ee3cdfc)

### 🐛 Correções de Bugs

* **workflow:** corrigir infinite loop e nodeTypes recreation no workflow editor (3b0e621d564027a2a91b7fabf5ba59ed5ffcd024)

### 📚 Documentação

* adicionar checklist de validação de implementação (48e9962712b66c09fc2be4fe3193d06b5e3b82e4)
* adicionar documentação completa do projeto e relatórios de status (b02b090edf1c1fe1dc4ad1e74f817daa508d9e41)

### ♻️ Refatorações

* **hooks:** remover arquivo duplicado use-sidebar.ts (d4dacbb954dd2a8d0ed79049b859235854dd3fd6)
* **layout:** melhorar layout admin com sidebar responsivo e theme toggle (f9b5037e403b76115b128cfb81a0527eee2f7c37)
* **nodes:** padronizar implementação de todos os custom nodes do workflow (6645f9d01219cda1c2e0aeecb82b2fcabfb130b7)

## [1.4.1](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.4.0...v1.4.1) (2025-11-03)

### 🐛 Correções de Bugs

* **ci:** corrigir README do Docker Hub e adicionar links nos releases (e97e38acc855fbefc39f073ed6f5527fa07b2a2e)

## [1.4.0](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.3.0...v1.4.0) (2025-11-03)

### ✨ Novas Funcionalidades

* **docker:** adicionar detecção de modo worker e skip de migrations ([d67b275](https://github.com/guilhermejansen/manager-zuckzapgo/commit/d67b2759f2595fe654d87e30409160b7fae8d499))
* **docker:** configurar ambiente de produção completo com Traefik e Docker Swarm ([6977b1a](https://github.com/guilhermejansen/manager-zuckzapgo/commit/6977b1a2253c873dd455eb0cbb84d187f6290039))
* **error-handling:** adicionar Error Boundary de root layout para erros críticos ([1aac4c4](https://github.com/guilhermejansen/manager-zuckzapgo/commit/1aac4c42d3f82fc68aeba15fc70ee9464367f2d6))
* **error-handling:** adicionar página de erro global com diagnóstico inteligente ([3fba310](https://github.com/guilhermejansen/manager-zuckzapgo/commit/3fba310252c1d3b185b1c9391824f3ab661fad6a)), closes [#PROD-ERROR-BLANK-SCREEN](https://github.com/guilhermejansen/manager-zuckzapgo/issues/PROD-ERROR-BLANK-SCREEN)
* **workers:** adicionar configuração TypeScript para compilação de workers BullMQ ([eead17f](https://github.com/guilhermejansen/manager-zuckzapgo/commit/eead17f0cd219333a70facbe77536774ffdd3872))
* **workers:** adicionar scripts de build e produção para BullMQ workers ([c1efde1](https://github.com/guilhermejansen/manager-zuckzapgo/commit/c1efde1b3f8743f5a6abb03272c98a201426e694))

### 🐛 Correções de Bugs

* **api:** corrigir construção de URL do ApiClient em produção standalone ([098e536](https://github.com/guilhermejansen/manager-zuckzapgo/commit/098e536d0e29dd7a7eae7e014815ce90f583e0d8)), closes [#PROD-DASHBOARD-500](https://github.com/guilhermejansen/manager-zuckzapgo/issues/PROD-DASHBOARD-500)
* **docker:** corrigir comando de inicialização dos workers para usar JavaScript compilado ([b5590f9](https://github.com/guilhermejansen/manager-zuckzapgo/commit/b5590f9454faeb25cda59cac7e94a7595d8ce09f))
* **docker:** corrigir publicação de tags versionadas no Docker Hub ([f804dc2](https://github.com/guilhermejansen/manager-zuckzapgo/commit/f804dc2ff7fd85dd70a2e075ed1bc5d8e4d88987))

## [1.3.0](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.2.2...v1.3.0) (2025-11-03)

### ✨ Novas Funcionalidades

* **monitoramento:** adicionar interpretação inteligente de status de eventos ([16b6d33](https://github.com/guilhermejansen/manager-zuckzapgo/commit/16b6d33871cfa1cbb143848d6e16c90272542f95))

### 🐛 Correções de Bugs

* configure turbopack root ([82436db](https://github.com/guilhermejansen/manager-zuckzapgo/commit/82436dbd04480b0cf9abae82ea09f3097a2dd054))

## [1.2.2](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.2.1...v1.2.2) (2025-11-03)

### 🐛 Correções de Bugs

* restaurar semantic-release com npm plugin e emojis ([65bf966](https://github.com/guilhermejansen/manager-zuckzapgo/commit/65bf96638e9ff3717aba8760880e5ba65c1c5578))
* usar workflow_run para acionar Docker build após releases ([711b75b](https://github.com/guilhermejansen/manager-zuckzapgo/commit/711b75b2a187ed045e9c00a60b6f4513fb04667f))

## [1.2.1](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.2.0...v1.2.1) (2025-11-03)

### Bug Fixes

* ajustar trigger do workflow Docker para apenas tags v* ([d948161](https://github.com/guilhermejansen/manager-zuckzapgo/commit/d948161c64401184b8ac78a1c654d89b87cfd7f3))

## [1.2.0](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.1.1...v1.2.0) (2025-11-03)

### Features

* padronizar calendários em histórico e dlq ([a2b5c48](https://github.com/guilhermejansen/manager-zuckzapgo/commit/a2b5c48a2701bc5970b2fe5b836dd7bfae1bcc3e))
* padronizar transportes no filtro da dlq ([e467d6c](https://github.com/guilhermejansen/manager-zuckzapgo/commit/e467d6c46683fe7f930cd5559f05ad0f48e1b8e4))

### Bug Fixes

* corrigir acionamento automático do workflow Docker após releases ([c7609a9](https://github.com/guilhermejansen/manager-zuckzapgo/commit/c7609a9f4fe57f71f01873dbaafdc682b8f981c6))

# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.1](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.1.0...v1.1.1) (2025-11-03)

### 🐛 Correções de Bugs

* corrigir acionamento do workflow Docker após releases ([b00fb03](https://github.com/guilhermejansen/manager-zuckzapgo/commit/b00fb03d82d8fa0333709b48c8233337c2858a99))

## [1.1.0](https://github.com/guilhermejansen/manager-zuckzapgo/compare/v1.0.0...v1.1.0) (2025-11-03)

### ✨ Novas Funcionalidades

* adicionar filtro de datas na lista de eventos arquivados ([73e2e5c](https://github.com/guilhermejansen/manager-zuckzapgo/commit/73e2e5c6a4d4b362be08afcbe693e7603d5c8c77))

## 1.0.0 (2025-11-03)

### 🐛 Correções de Bugs

* ajustar paginação histórica com cursor before_id ([48d2cb1](https://github.com/guilhermejansen/manager-zuckzapgo/commit/48d2cb1115a600076d0436c774958d21f5bbc170))
* corrigir husky deprecado e commitlint para releases ([669fb78](https://github.com/guilhermejansen/manager-zuckzapgo/commit/669fb78051f84aa7a63e7a9e80e3d1577a413c07))
