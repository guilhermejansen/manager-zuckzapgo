# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

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
