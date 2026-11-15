// Conteúdo da landing comercial.
//
// Regras que este arquivo segue (PRODUCT.md / DESIGN.md deste repositório):
// - nenhum número de disponibilidade, latência ou volume sem medição registrada;
// - nenhuma afirmação de acessibilidade, desempenho ou criptografia sem tela conferida;
// - preço não é declarado aqui: ele vive na página de assinatura do gateway;
// - links comerciais, gateway e marcas de terceiros são preservados como estão.

export const brand = {
  name: "ZuckZapGo",
  manager: "ZuckZapGo Manager",
  descriptor: "Customer Operations Platform",
  summary:
    "API privada e Manager para squads que operam WhatsApp em escala, na própria infraestrutura.",
} as const

/** Pilares de marca. Texto curto, sem promessa mensurável. */
export const brandPillars: { title: string; description: string }[] = [
  {
    title: "Operação Global",
    description: "Instâncias, campanhas e eventos de vários times num só painel.",
  },
  {
    title: "Escala Inteligente",
    description: "Fan-out por Webhooks, filas e streams, escolhido por transporte.",
  },
  {
    title: "Experiência Premium",
    description: "Formulários validados, temas claro e escuro e retorno imediato de cada ação.",
  },
]

/** Trabalhos reais do operador, derivados das rotas de `app/admin/`. */
export const heroTasks: { label: string; detail: string; icon: HeroTaskIconKey }[] = [
  {
    label: "Ativar instâncias",
    detail: "Wizard de criação, QR Code e status de conexão",
    icon: "instances",
  },
  {
    label: "Disparar campanhas",
    detail: "FlowBuild, agendamento e acompanhamento de envio",
    icon: "campaigns",
  },
  {
    label: "Tratar eventos e DLQ",
    detail: "Stream ao vivo, reprocessamento e histórico arquivado",
    icon: "events",
  },
]

export type HeroTaskIconKey = "instances" | "campaigns" | "events"

type FeatureHighlight = {
  title: string
  description: string
  badge?: string
}

export const featureHighlights: FeatureHighlight[] = [
  {
    title: "Controle de Instâncias",
    description:
      "Ative, monitore e organize instâncias WhatsApp em um só painel, com wizard de criação e status de conexão por instância.",
    badge: "Centralização",
  },
  {
    title: "Entrega Multicanal",
    description:
      "Distribua eventos em Webhooks, RabbitMQ, SQS, Redis Streams e WebSockets, com o transporte escolhido por configuração.",
    badge: "Fan-out",
  },
  {
    title: "Observabilidade Integrada",
    description:
      "Sentry captura erros com stack trace e Jaeger mapeia requests ponta a ponta. Dashboards e alertas ficam no Manager.",
    badge: "Sentry e Jaeger",
  },
  {
    title: "Visibilidade em Tempo Real",
    description:
      "Stream de eventos ao vivo, histórico pesquisável e filtros por impacto para responder rápido a uma falha de entrega.",
    badge: "Stream e histórico",
  },
  {
    title: "Resiliência na Entrega",
    description:
      "Retries automáticos, buffers dedicados e fila de quarentena mantêm o evento recuperável quando o destino falha.",
    badge: "Retries e DLQ",
  },
  {
    title: "Escala Horizontal",
    description:
      "Docker Swarm, balanceamento de carga e crescimento de 1 para N instâncias conforme a operação pede.",
    badge: "Swarm",
  },
]

export type IntegrationIconKey =
  | "zuckzapgo"
  | "whatsapp"
  | "webhook"
  | "rabbitmq"
  | "sqs"
  | "s3"
  | "redis"
  | "postgres"
  | "websocket"
  | "sentry"
  | "jaeger"

type Integration = {
  name: string
  tagline: string
  icon: IntegrationIconKey
}

export const integrations: Integration[] = [
  { name: "ZuckZapGo", tagline: "Suite completa de automação", icon: "zuckzapgo" },
  { name: "WhatsApp WA MD", tagline: "SDK whatsmeow otimizado", icon: "whatsapp" },
  { name: "Webhooks", tagline: "Entrega JSON com controle de retries", icon: "webhook" },
  { name: "RabbitMQ", tagline: "Mensageria para squads tech", icon: "rabbitmq" },
  { name: "Amazon SQS", tagline: "Escala elástica com filas FIFO", icon: "sqs" },
  { name: "Amazon S3", tagline: "Mídia em storage seguro", icon: "s3" },
  { name: "Redis Streams", tagline: "Streaming em tempo real", icon: "redis" },
  { name: "PostgreSQL", tagline: "Base transacional confiável", icon: "postgres" },
  { name: "WebSockets", tagline: "Broadcast bidirecional", icon: "websocket" },
  { name: "Sentry", tagline: "Monitoramento de erros em tempo real", icon: "sentry" },
  { name: "Jaeger", tagline: "Tracing distribuído ponta a ponta", icon: "jaeger" },
]

type ApiCapability = {
  title: string
  endpoint: string
  description: string
}

export const apiCapabilities: ApiCapability[] = [
  {
    title: "Sessões Sempre Ativas",
    endpoint: "Sessões",
    description:
      "Conecte, refresque e proteja instâncias WhatsApp com poucos cliques e supervisão constante.",
  },
  {
    title: "Fluxos de Mensagens",
    endpoint: "Mensageria",
    description:
      "Envio de texto, mídia, interativos e newsletters com fallback multi-device e relatórios claros.",
  },
  {
    title: "Governança de Eventos",
    endpoint: "Monitoramento",
    description:
      "Capture, analise e reprocesse eventos com poucos cliques graças a painéis e DLQ pronta.",
  },
  {
    title: "Configuração Unificada",
    endpoint: "Ambiente",
    description:
      "Ajuste transportes, storage e integrações globais em um único local com testes guiados.",
  },
]

type ManagerModule = {
  title: string
  description: string
  items: string[]
}

export const managerModules: ManagerModule[] = [
  {
    title: "Dashboard Inteligente",
    description:
      "KPIs em tempo real com cartões interativos e atalhos que aceleram decisões do time.",
    items: ["Status online/offline imediato", "Atalhos acionáveis", "Sincronização automática"],
  },
  {
    title: "Monitoramento de Eventos",
    description:
      "Timeline e filtros avançados para acompanhar tudo que acontece nas instâncias sem sair do Manager.",
    items: ["Stream ao vivo com fallback", "Replay instantâneo", "Filtros por impacto"],
  },
  {
    title: "Configuração Centralizada",
    description:
      "Webhooks, RabbitMQ, S3, Proxy e filtros Skip configurados em formulários claros e validados.",
    items: [
      "Teste de conexão imediato",
      "Validação com feedback visual",
      "Histórico de alterações",
    ],
  },
]

/**
 * Mecanismos de resiliência que existem no produto.
 * Substitui os antigos números de disponibilidade, volume e latência:
 * `PRODUCT.md` registra "nenhuma medição" para esses indicadores.
 */
type ResilienceFact = {
  label: string
  title: string
  detail: string
}

export const resilienceFacts: ResilienceFact[] = [
  {
    label: "Reenvio",
    title: "Retries automáticos",
    detail: "Falha de destino não descarta o evento: ele volta para a fila de reenvio.",
  },
  {
    label: "Quarentena",
    title: "Fila DLQ no Manager",
    detail: "O que falha de vez cai na DLQ e pode ser inspecionado e reprocessado na tela.",
  },
  {
    label: "Absorção",
    title: "Buffers por instância",
    detail: "Buffer dedicado segura o pico antes do fan-out para os transportes configurados.",
  },
  {
    label: "Auditoria",
    title: "Eventos arquivados",
    detail: "Histórico pesquisável para reconstruir o que aconteceu em cada instância.",
  },
]

type SecurityFocus = {
  title: string
  points: string[]
  flow: string[]
}

export const securityFocus: SecurityFocus = {
  title: "Login seguro com tokens efêmeros",
  points: [
    "Tokens guardados em cookies httpOnly com SameSite=Strict.",
    "Proxy interno intermedia a comunicação entre Manager e API.",
    "Campo de token com opção de mostrar ou ocultar.",
  ],
  flow: [
    "Selecione o perfil (Admin ou User)",
    "Validação do token no servidor",
    "Redirecionamento para o painel do perfil",
  ],
}

/**
 * Quatro ofertas comerciais: dois níveis × duas periodicidades.
 * Os links de assinatura são os reais do gateway e não devem ser alterados aqui.
 * Nenhum preço é declarado: ele é exibido na página de assinatura.
 */
export const checkout = {
  provider: "Hotmart",
  note: "Preço e condições aparecem na página de assinatura. Ativação após a confirmação do pagamento.",
} as const

export const pricingIncluded: string[] = [
  "Setup Automatizado com suporte oficial",
  "FlowBuild e automações ilimitadas, hospedadas na sua infraestrutura",
  "Integrações Webhook, RabbitMQ, S3, SQS, WebSockets e Redis",
  "Node n8n Community, plugin Chatwoot e suporte a cluster Swarm",
]

export type PricingOffer = {
  billing: "Mensal" | "Anual"
  description: string
  link: string
}

export type PricingTier = {
  tier: "Professional" | "Enterprise"
  installations: string
  summary: string
  extras: string[]
  featured: boolean
  offers: PricingOffer[]
  /** Observação exibida quando o limite comercial não é declarado nesta superfície. */
  quantityNote?: string
}

export const pricingTiers: PricingTier[] = [
  {
    tier: "Professional",
    installations: "1 instalação por IP",
    summary:
      "1 licença/1 IP para instalar localmente ou em cloud privada, com API completa e instâncias ilimitadas.",
    extras: [],
    featured: false,
    offers: [
      {
        billing: "Mensal",
        description: "Cobrança mensal. Consulte as condições da oferta.",
        link: "https://go.hotmart.com/S101068222H?off=24s9oau4",
      },
      {
        billing: "Anual",
        description: "Cobrança anual, mantendo a operação self-hosted na sua infraestrutura.",
        link: "https://go.hotmart.com/S101068222H?off=ml91nraz",
      },
    ],
  },
  {
    // "Até 2 instalações por IP" é o valor que este repositório já declarava,
    // igual no cartão e no rodapé da superfície publicada. Mantido como está.
    tier: "Enterprise",
    installations: "Até 2 instalações por IP",
    summary:
      "Até 2 licenças/IP para ambientes redundantes, com suporte dedicado e os recursos interativos do WhatsApp.",
    extras: ["Botões interativos, carousels e catálogos nativos", "Suporte dedicado"],
    featured: true,
    offers: [
      {
        billing: "Mensal",
        description: "Cobrança mensal para ambientes redundantes.",
        link: "https://go.hotmart.com/S101068222H?off=pez6mwnh",
      },
      {
        billing: "Anual",
        description: "Cobrança anual, pensada para clusters Swarm e operações distribuídas.",
        link: "https://go.hotmart.com/S101068222H?off=p1q64goj",
      },
    ],
  },
]

export type FooterLinkIconKey = "github" | "swagger" | "postman"

export const footerLinks: { label: string; href: string; icon: FooterLinkIconKey }[] = [
  {
    label: "Repositório de apoio",
    href: "https://github.com/guilhermejansen/use-zuckzapgo",
    icon: "github",
  },
  { label: "Swagger API", href: "https://api.zuckzapgo.com/api/", icon: "swagger" },
  {
    label: "Workspace Postman",
    href: "https://www.postman.com/setupautomatizado/setup-automatizado-s-workspace",
    icon: "postman",
  },
]

export const supportWhatsApp = {
  phone: "5521971532700",
  message: `Olá! Gostaria de conhecer mais detalhes sobre o ${brand.manager}.`,
} as const
