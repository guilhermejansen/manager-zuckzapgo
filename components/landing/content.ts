export const heroLines = ["Operação Global", "Escala Inteligente", "Experiência Premium"]

type FeatureHighlight = {
  title: string
  description: string
  stats?: string
  badge?: string
}

export const featureHighlights: FeatureHighlight[] = [
  {
    title: "Controle Total de Instâncias",
    description:
      "Ative, monitore e organize instâncias WhatsApp em um só painel com governança pensada para squads globais.",
    badge: "Centralização segura",
  },
  {
    title: "Entrega Multicanal Confiável",
    description:
      "Distribua eventos em Webhooks, RabbitMQ, SQS, Redis Streams e WebSockets com orquestração automática.",
    badge: "Fan-out inteligente",
  },
  {
    title: "Observabilidade Integrada",
    description:
      "Tracing distribuído, dashboards e alertas mantêm times alinhados em qualquer operação. Sentry captura erros e Jaeger mapeia requests ponta a ponta.",
    badge: "Monitoramento completo",
  },
  {
    title: "Visibilidade em Tempo Real",
    description:
      "Streams ao vivo, histórico pesquisável e alertas garantem respostas rápidas a qualquer cenário.",
    badge: "Monitoramento 360°",
  },
  {
    title: "Resiliência Corporativa",
    description:
      "Retries automáticos, buffers dedicados e filas de quarentena mantêm jornadas críticas sempre ativas.",
    badge: "Alta disponibilidade",
  },
  {
    title: "Escalabilidade Horizontal",
    description:
      "Docker Swarm nativo, balanceamento de carga automático e deploy zero-downtime. Escale de 1 para N instâncias sem interrupção.",
    badge: "Deploy simplificado",
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

type ReliabilityStat = {
  label: string
  value: string
  detail: string
}

export const reliabilityStats: ReliabilityStat[] = [
  {
    label: "Disponibilidade Global",
    value: "99.97%",
    detail: "Monitoramento contínuo com alertas pró-ativos a cada 5 segundos.",
  },
  {
    label: "Eventos Processados",
    value: ">1M/dia",
    detail: "Pipeline paralelo com filas dedicadas e reroteamento automático.",
  },
  {
    label: "Tempo Médio de Retry",
    value: "<120ms",
    detail: "Buffers inteligentes garantem confirmações rápidas em múltiplos transportes.",
  },
]

type SecurityFocus = {
  title: string
  points: string[]
}

export const securityFocus: SecurityFocus = {
  title: "Login seguro com tokens efêmeros",
  points: [
    "Tokens protegidos em cookies httpOnly com SameSite=Strict.",
    "Proxy interno cifra a comunicação entre Manager e API.",
    "Dark e light mode com transições suaves pensadas para uso prolongado.",
  ],
}

type PricingPlan = {
  tier: "Professional" | "Enterprise"
  billing: "Mensal" | "Anual"
  installations: string
  description: string
  link: string
}

export const pricingPlans: PricingPlan[] = [
  {
    tier: "Professional",
    billing: "Mensal",
    installations: "1 instalação por IP",
    description:
      "1 licença/1 IP para instalar localmente ou em cloud privada, com API completa e instâncias ilimitadas.",
    link: "https://go.hotmart.com/S101068222H?off=24s9oau4",
  },
  {
    tier: "Professional",
    billing: "Anual",
    installations: "1 instalação por IP",
    description:
      "1 licença/1 IP com cobrança anual, mantendo operação self-hosted na infraestrutura do cliente.",
    link: "https://go.hotmart.com/S101068222H?off=ml91nraz",
  },
  {
    tier: "Enterprise",
    billing: "Mensal",
    installations: "Até 2 instalações por IP",
    description:
      "Até 2 licenças/IP para ambientes redundantes + botões interativos, carousels e catálogos com suporte dedicado.",
    link: "https://go.hotmart.com/S101068222H?off=pez6mwnh",
  },
  {
    tier: "Enterprise",
    billing: "Anual",
    installations: "Até 2 instalações por IP",
    description:
      "Até 2 licenças/IP com faturamento anual, pensado para clusters Swarm, escalabilidade e jornadas globais.",
    link: "https://go.hotmart.com/S101068222H?off=p1q64goj",
  },
]
