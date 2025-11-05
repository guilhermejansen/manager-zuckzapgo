"use client"

import { useMemo, useRef } from "react"

import Image from "next/image"
import Link from "next/link"

import { motion, useScroll, useTransform } from "framer-motion"
import ReactLenis from "lenis/react"
import {
  Activity,
  ArrowUpRight,
  GitBranch,
  HeartPulse,
  LineChart,
  LogIn,
  MessageSquare,
  Radar,
  ServerCog,
  Settings2,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { CampaignFlowDemo } from "@/components/landing/campaign-flow"
import {
  type IntegrationIconKey,
  apiCapabilities,
  featureHighlights,
  heroLines,
  integrations,
  managerModules,
  pricingPlans,
  reliabilityStats,
  securityFocus,
} from "@/components/landing/content"
import { DashboardCarousel } from "@/components/landing/dashboard-carousel"
import { FloatingActions } from "@/components/landing/floating-actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const heroSentence = "Operação WhatsApp sem atrito"
const heroSubtitle =
  "ZuckZapGo Manager para escalar jornadas digitais com automação e confiança total."

type BrandIconKey =
  | IntegrationIconKey
  | "monitoring"
  | "fanout"
  | "automation"
  | "analytics"
  | "onboarding"

type BrandAsset =
  | {
      type: "icon"
      Icon: LucideIcon
      className: string
      iconClassName: string
    }
  | {
      type: "image"
      src: string
      alt: string
      className: string
    }

const brandAssets: Record<BrandIconKey, BrandAsset> = {
  zuckzapgo: {
    type: "image",
    src: "/logonova.png",
    alt: "ZuckZapGo",
    className: "from-primary/30 to-cyan-500/10",
  },
  whatsapp: {
    type: "image",
    src: "/landing/icons/whatsapp.svg",
    alt: "WhatsApp",
    className: "from-[#25D366]/40 to-[#25D366]/10",
  },
  webhook: {
    type: "image",
    src: "/landing/icons/webhook.svg",
    alt: "Webhooks",
    className: "from-sky-500/35 to-sky-500/10",
  },
  rabbitmq: {
    type: "image",
    src: "/landing/icons/rabbitmq.svg",
    alt: "RabbitMQ",
    className: "from-orange-500/35 to-orange-500/10",
  },
  sqs: {
    type: "image",
    src: "/landing/icons/sqs.svg",
    alt: "Amazon SQS",
    className: "from-[#7B3FE4]/35 to-[#7B3FE4]/10",
  },
  s3: {
    type: "image",
    src: "/landing/icons/s3.svg",
    alt: "Amazon S3",
    className: "from-emerald-500/35 to-emerald-500/10",
  },
  redis: {
    type: "image",
    src: "/landing/icons/redis.svg",
    alt: "Redis Streams",
    className: "from-red-500/35 to-red-500/10",
  },
  postgres: {
    type: "image",
    src: "/landing/icons/postgres.svg",
    alt: "PostgreSQL",
    className: "from-blue-600/35 to-blue-600/10",
  },
  websocket: {
    type: "image",
    src: "/landing/icons/websocket.svg",
    alt: "WebSockets",
    className: "from-purple-500/35 to-purple-500/10",
  },
  sentry: {
    type: "image",
    src: "/landing/icons/sentry.svg",
    alt: "Sentry",
    className: "from-[#362D59]/35 to-[#362D59]/10",
  },
  jaeger: {
    type: "image",
    src: "/landing/icons/jaeger.svg",
    alt: "Jaeger",
    className: "from-[#60D0E4]/35 to-[#60D0E4]/10",
  },
  monitoring: {
    type: "icon",
    Icon: Radar,
    className: "from-primary/25 to-primary/5",
    iconClassName: "text-primary",
  },
  fanout: {
    type: "icon",
    Icon: GitBranch,
    className: "from-amber-500/25 to-amber-500/5",
    iconClassName: "text-amber-500",
  },
  automation: {
    type: "icon",
    Icon: Settings2,
    className: "from-slate-500/25 to-slate-500/5",
    iconClassName: "text-slate-500",
  },
  analytics: {
    type: "icon",
    Icon: LineChart,
    className: "from-blue-500/25 to-blue-500/5",
    iconClassName: "text-blue-500",
  },
  onboarding: {
    type: "icon",
    Icon: Sparkles,
    className: "from-fuchsia-500/25 to-fuchsia-500/5",
    iconClassName: "text-fuchsia-500",
  },
}

type HeroShowcase = {
  label: string
  annotation: string
  icon: BrandIconKey
}

const heroShowcase: HeroShowcase[] = [
  { label: "ZuckZapGo", annotation: "Suite oficial", icon: "zuckzapgo" },
  { label: "WhatsApp WA MD", annotation: "SDK whatsmeow otimizado", icon: "whatsapp" },
  { label: "Sentry Integration", annotation: "Error tracking em tempo real", icon: "sentry" },
  { label: "Jaeger Tracing", annotation: "Distributed tracing completo", icon: "jaeger" },
  { label: "Webhooks", annotation: "Entrega JSON com retries", icon: "webhook" },
  { label: "RabbitMQ", annotation: "Mensageria para squads tech", icon: "rabbitmq" },
  { label: "Amazon SQS", annotation: "Filas FIFO escaláveis", icon: "sqs" },
  { label: "Amazon S3", annotation: "Storage seguro de mídia", icon: "s3" },
  { label: "Redis Streams", annotation: "Streaming em tempo real", icon: "redis" },
  { label: "PostgreSQL", annotation: "Base transacional confiável", icon: "postgres" },
  { label: "WebSockets", annotation: "Broadcast bidirecional", icon: "websocket" },
  { label: "Monitoramento ao vivo", annotation: "Eventos em segundos", icon: "monitoring" },
  { label: "Entrega omnicanal", annotation: "Multi-transporte inteligente", icon: "fanout" },
  { label: "Automação segura", annotation: "Governança ponta a ponta", icon: "automation" },
  { label: "Analytics unificado", annotation: "Insights para squads", icon: "analytics" },
  { label: "Onboarding ágil", annotation: "Instâncias em minutos", icon: "onboarding" },
]

const BrandGlyph = ({ iconKey, size = "md" }: { iconKey: BrandIconKey; size?: "sm" | "md" }) => {
  const asset = brandAssets[iconKey]
  const dimension = size === "sm" ? 72 : 88
  const iconSize = size === "sm" ? 44 : 56

  // Aumentar tamanho especificamente para logonova.png
  const imageSize = asset?.src === "/logonova.png" ? iconSize + 16 : iconSize

  if (!asset) return null

  return (
    <div
      className="inline-flex items-center justify-center rounded-2xl p-3 bg-background/5 ring-1 ring-border/20 backdrop-blur-sm"
      style={{
        width: dimension,
        height: dimension,
        minWidth: dimension,
        minHeight: dimension,
        overflow: "visible",
      }}
    >
      {asset.type === "icon" ? (
        <asset.Icon className={asset.iconClassName} style={{ width: iconSize, height: iconSize }} />
      ) : (
        <Image
          src={asset.src}
          alt={asset.alt}
          width={imageSize}
          height={imageSize}
          className="rounded-lg drop-shadow-2xl"
          unoptimized={asset.src === "/logonova.png"}
          style={{
            filter:
              asset.src === "/logonova.png"
                ? "brightness(1.3) contrast(1.35) saturate(1.25) drop-shadow(0 0 12px rgba(14, 165, 233, 0.5))"
                : "brightness(1.15) contrast(1.2) saturate(1.15)",
            objectFit: "contain",
            width: "100%",
            height: "100%",
            maxWidth: "none",
            maxHeight: "none",
          }}
        />
      )}
    </div>
  )
}

type CharacterProps = {
  char: string
  index: number
  centerIndex: number
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
}

const Character = ({ char, index, centerIndex, progress }: CharacterProps) => {
  const distance = index - centerIndex
  const isSpace = char === " "

  const x = useTransform(progress, [0, 0.5], [distance * 65, 0])
  const rotateX = useTransform(progress, [0, 0.5], [distance * 60, 0])
  const y = useTransform(progress, [0, 0.5], [Math.abs(distance) * 22, 0])

  return (
    <motion.span
      style={{ x, rotateX, y }}
      className={cn("inline-block text-balance", isSpace && "w-3")}
    >
      {char}
    </motion.span>
  )
}

const IconCharacter = ({
  label,
  annotation,
  index,
  centerIndex,
  progress,
  icon,
}: {
  label: string
  annotation: string
  index: number
  centerIndex: number
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
  icon: BrandIconKey
}) => {
  const distance = index - centerIndex
  // Eliminar movimento vertical no mobile para evitar quebra
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768
  const xMultiplier = isMobile ? 25 : 90
  const yMultiplier = isMobile ? 0 : 40 // Zero movimento Y no mobile!

  const x = useTransform(progress, [0, 0.5], [distance * xMultiplier, 0])
  const y = useTransform(progress, [0, 0.5], [Math.abs(distance) * yMultiplier, 0])
  const scale = useTransform(progress, [0, 0.5], [0.95, 1]) // Ainda menos zoom

  return (
    <motion.div
      style={{ x, y, scale }}
      className="inline-flex w-[160px] sm:w-[200px] lg:min-w-[220px] flex-col items-center justify-center gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-border/30 bg-gradient-to-br from-background via-background/80 to-background/60 px-3 sm:px-6 py-3 sm:py-5 text-center text-xs sm:text-sm font-medium text-foreground shadow-sm"
    >
      <BrandGlyph iconKey={icon} size="md" />
      <span className="text-sm sm:text-base font-semibold">{label}</span>
      <span className="text-xs sm:text-sm text-muted-foreground">{annotation}</span>
    </motion.div>
  )
}

const HeroLine = ({
  line,
  index,
  progress,
}: {
  line: string
  index: number
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
}) => {
  const direction = index % 2 === 0 ? -120 : 120
  const x = useTransform(progress, [0, 0.6], [direction, 0])
  const opacity = useTransform(progress, [0, 0.3, 0.6], [0, 0.7, 1])

  return <motion.span style={{ x, opacity }}>{line}</motion.span>
}

const SectionHeader = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) => (
  <div className="mx-auto max-w-3xl text-center">
    <span className="font-mono text-xs uppercase tracking-[0.32em] text-primary/80">{eyebrow}</span>
    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
    <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>
  </div>
)

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
}

const FeatureCard = ({
  title,
  description,
  badge,
}: {
  title: string
  description: string
  badge?: string
}) => (
  <motion.div
    {...fadeUp}
    viewport={{ once: true, amount: 0.3 }}
    className="card-elevated group relative flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/80 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/50"
  >
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <Sparkles className="h-5 w-5 text-primary/70 transition-transform duration-500 group-hover:rotate-12" />
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
    {badge ? (
      <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-border/40 bg-muted/40 px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <span className="inline-flex size-1.5 rounded-full bg-primary" />
        {badge}
      </span>
    ) : null}
  </motion.div>
)

const IntegrationPill = ({
  name,
  tagline,
  icon,
}: {
  name: string
  tagline: string
  icon: IntegrationIconKey
}) => (
  <motion.div
    variants={{
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
    viewport={{ once: true, amount: 0.25 }}
    className="card-elevated flex min-w-[200px] items-center gap-3 rounded-xl border border-border/30 bg-gradient-to-br from-background via-background/80 to-background/60 px-4 py-3 text-left shadow-sm sm:min-w-[220px]"
  >
    <BrandGlyph iconKey={icon} size="sm" />
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">{tagline}</span>
    </div>
  </motion.div>
)

const capabilityIcons: Record<string, LucideIcon> = {
  Sessões: LogIn,
  Mensageria: MessageSquare,
  Monitoramento: Radar,
  Ambiente: ServerCog,
}

const ApiCard = ({ title, endpoint, description }: (typeof apiCapabilities)[number]) => (
  <motion.div
    {...fadeUp}
    viewport={{ once: true, amount: 0.3 }}
    className="card-elevated flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/80 p-6"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          {(() => {
            const Icon = capabilityIcons[endpoint] ?? Sparkles
            return <Icon className="h-4 w-4" />
          })()}
        </span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      <ArrowUpRight className="h-5 w-5 text-primary/70" />
    </div>
    <code className="inline-flex w-fit items-center rounded-lg bg-muted/60 px-3 py-1 font-mono text-sm text-muted-foreground">
      {endpoint}
    </code>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
)

const PricingCard = ({
  tier,
  billing,
  installations,
  description,
  link,
}: (typeof pricingPlans)[number]) => (
  <motion.div
    {...fadeUp}
    viewport={{ once: true, amount: 0.3 }}
    className="group relative flex flex-col justify-between gap-6 rounded-3xl border border-border/30 bg-gradient-to-br from-card via-card/80 to-card p-8 shadow-[0_35px_70px_-50px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:border-primary/50"
  >
    <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />
    {tier === "Enterprise" ? (
      <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
        Destaque
      </span>
    ) : null}
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground/80">
            {billing}
          </span>
          <h3 className="mt-2 text-2xl font-semibold text-foreground">{tier}</h3>
        </div>
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {installations}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Suporte oficial Setup Automatizado
        </li>
        <li className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-primary" />
          FlowBuild, automações ilimitadas e hospedagem na sua infraestrutura
        </li>
        <li className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" />
          Integrações Webhook, RabbitMQ, S3, SQS, WebSockets e Redis
        </li>
        <li className="flex items-center gap-2">
          <LineChart className="h-4 w-4 text-primary" />
          Node n8n Community, plugin Chatwoot e suporte a cluster Swarm
        </li>
        {tier === "Enterprise" ? (
          <li className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Botões interativos, carousels e catálogos nativos
          </li>
        ) : null}
      </ul>
    </div>
    <div className="space-y-3">
      <Link href={link} target="_blank" rel="noreferrer" className="block">
        <Button className="w-full" size="lg">
          Assinar {tier} {billing}
        </Button>
      </Link>
      <p className="text-xs text-muted-foreground">
        Pagamento seguro via Hotmart. Ativação imediata após a assinatura.
      </p>
    </div>
  </motion.div>
)

const ManagerCard = ({ title, description, items }: (typeof managerModules)[number]) => (
  <motion.div
    {...fadeUp}
    viewport={{ once: true, amount: 0.3 }}
    className="card-elevated flex flex-col gap-5 rounded-2xl border border-border/40 bg-card/85 p-6"
  >
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="grid gap-2">
      {items.map((item) => (
        <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="inline-flex size-1.5 rounded-full bg-primary/70" />
          {item}
        </div>
      ))}
    </div>
  </motion.div>
)

const StatCard = ({ label, value, detail }: (typeof reliabilityStats)[number]) => (
  <motion.div
    {...fadeUp}
    viewport={{ once: true, amount: 0.3 }}
    className="card-elevated flex flex-col gap-3 rounded-2xl border border-border/40 bg-gradient-to-br from-background via-background/80 to-background/70 p-6"
  >
    <span className="text-xs uppercase tracking-[0.3em] text-primary/80">{label}</span>
    <span className="text-3xl font-semibold text-foreground">{value}</span>
    <p className="text-sm text-muted-foreground">{detail}</p>
  </motion.div>
)

const SecurityCard = () => (
  <motion.div
    {...fadeUp}
    viewport={{ once: true, amount: 0.3 }}
    className="card-elevated relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background/90 to-background p-8"
  >
    <div
      className="absolute -right-20 top-0 size-64 rounded-full bg-primary/20 blur-3xl"
      aria-hidden
    />
    <div className="relative flex flex-col gap-4 text-left sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-3 sm:max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          <ShieldCheck className="h-4 w-4" />
          Segurança
        </div>
        <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
          {securityFocus.title}
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {securityFocus.points.map((point) => (
            <li key={point} className="flex items-start gap-2">
              <span className="mt-1 inline-flex size-1.5 rounded-full bg-primary" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border/40 bg-background/80 p-5 text-sm text-muted-foreground sm:mt-0 sm:w-64">
        <span className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary/70">
          <LogIn className="h-4 w-4" />
          Fluxo com token
        </span>
        <ol className="list-decimal space-y-2 pl-4">
          <li>Selecione perfil (Admin/User)</li>
          <li>Validação instantânea via loginAction</li>
          <li>Redireciono seguro para dashboard</li>
        </ol>
        <span className="mt-2 text-xs text-muted-foreground/80">
          Cookies httpOnly + SameSite=Strict mantêm o Manager blindado.
        </span>
      </div>
    </div>
  </motion.div>
)

export const LandingPage = () => {
  const topRef = useRef<HTMLDivElement | null>(null)
  const midRef = useRef<HTMLDivElement | null>(null)
  const lowRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress: topProgress } = useScroll({
    target: topRef,
    offset: ["start end", "end center"],
  })
  const { scrollYProgress: midProgress } = useScroll({
    target: midRef,
    offset: ["start end", "end center"],
  })
  const { scrollYProgress: lowProgress } = useScroll({
    target: lowRef,
    offset: ["start end", "end center"],
  })

  const heroCharacters = useMemo(() => heroSentence.split(""), [])
  const centerIndex = Math.floor(heroCharacters.length / 2)

  return (
    <ReactLenis root options={{ smoothWheel: true, lerp: 0.08 }}>
      <main className="relative min-h-screen bg-gradient-to-b from-background via-background/90 to-muted/40 text-foreground">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -left-24 top-0 size-[480px] rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute bottom-10 right-0 size-[420px] rounded-full bg-secondary/30 blur-3xl"
            aria-hidden
          />
        </div>

        <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logonova.png"
                alt="ZuckZapGo"
                width={64}
                height={64}
                className="rounded-xl object-contain drop-shadow-lg"
                priority
                unoptimized
              />
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  ZuckZapGo Manager
                </span>
                <span className="text-sm font-semibold text-muted-foreground/80">
                  Customer Operations Platform
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login" className="inline-flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 rounded-full border border-border/50 bg-background/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-primary"
                >
                  Entrar
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-1.5 text-xs uppercase tracking-[0.3em] text-primary shadow-sm"
              animate={{ scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src="/landing/icons/whatsapp.svg"
                alt="WhatsApp"
                width={16}
                height={16}
                className="h-4 w-4"
              />
              Whatsapp Business API
            </motion.div>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {heroSubtitle}
            </h1>
            <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Unifique marketing, suporte e produto em um cockpit único. Acompanhe eventos críticos
              em tempo real, personalize integrações e mantenha cada instância WhatsApp sob controle
              absoluto.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Link href="#flowbuild" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto">Explorar FlowBuild</Button>
              </Link>
              <Link href="#integrations" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-border/60">
                  Ver integrações
                </Button>
              </Link>
              <Link href="#pricing" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto">
                  Ver planos
                </Button>
              </Link>
            </div>
            <div className="flex flex-col items-center gap-4 text-xs uppercase tracking-[0.4em] text-muted-foreground">
              <span>Role para baixo e destrave o ecossistema</span>
              <div className="h-16 w-px bg-gradient-to-b from-muted-foreground/40 to-transparent" />
            </div>
          </div>
        </section>

        <section className="section-padding container-responsive flex items-center justify-center">
          <DashboardCarousel />
        </section>

        <section
          ref={topRef}
          className="relative box-border flex h-[200vh] items-center justify-center bg-none px-4 sm:px-6 lg:px-8"
        >
          <div
            className="w-full max-w-6xl text-center text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold uppercase tracking-tight text-primary px-4"
            style={{ perspective: "600px" }}
          >
            {heroCharacters.map((char, index) => (
              <Character
                key={`char-${index}`}
                char={char}
                index={index}
                centerIndex={centerIndex}
                progress={topProgress}
              />
            ))}
          </div>
        </section>

        <section
          ref={midRef}
          className="relative -mt-[70vh] flex h-[200vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 sm:gap-4 text-foreground py-16 sm:py-8">
            {heroShowcase.map((item, index) => (
              <IconCharacter
                key={item.label}
                label={item.label}
                annotation={item.annotation}
                index={index}
                centerIndex={Math.floor(heroShowcase.length / 2)}
                progress={midProgress}
                icon={item.icon}
              />
            ))}
          </div>
        </section>

        <section
          ref={lowRef}
          className="relative -mt-[40vh] flex h-[180vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 pt-40">
            <div
              className="grid w-full gap-3 text-center text-sm uppercase tracking-[0.4em] text-muted-foreground"
              style={{ perspective: "500px" }}
            >
              {heroLines.map((line, index) => (
                <HeroLine key={line} line={line} index={index} progress={lowProgress} />
              ))}
            </div>
            <motion.div
              className="grid w-full gap-6 sm:grid-cols-2"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.4 }}
            >
              <motion.div
                variants={{ initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                className="rounded-2xl border border-border/40 bg-background/80 p-6 text-left shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-foreground">Fluxo resiliente</h3>
                  <div className="flex gap-2">
                    <BrandGlyph iconKey="webhook" size="sm" />
                    <BrandGlyph iconKey="rabbitmq" size="sm" />
                    <BrandGlyph iconKey="sqs" size="sm" />
                    <BrandGlyph iconKey="redis" size="sm" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Webhooks, RabbitMQ, Amazon SQS e Redis Streams</strong> trabalham juntos.
                  Arquitetura multi-transporte entrega cada evento no melhor canal, mesmo durante
                  picos de uso.
                </p>
              </motion.div>
              <motion.div
                variants={{ initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.1 }}
                className="rounded-2xl border border-border/40 bg-background/80 p-6 text-left shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Observabilidade integrada
                  </h3>
                  <div className="flex gap-2">
                    <BrandGlyph iconKey="sentry" size="sm" />
                    <BrandGlyph iconKey="jaeger" size="sm" />
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  <strong>Sentry</strong> captura erros em tempo real com stack traces completos.{" "}
                  <strong>Jaeger</strong> mapeia cada request ponta a ponta com distributed tracing.
                  Dashboards e alertas mantêm times alinhados em qualquer operação.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="section-padding container-responsive">
          <SectionHeader
            eyebrow="Arquitetura"
            title="Construída para operar 24/7 sem quedas"
            description="Desenhada para equipes que precisam de disponibilidade contínua: governança centralizada, operação simplificada e entrega garantida."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureHighlights.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <section className="section-padding container-responsive">
          <SectionHeader
            eyebrow="Manager"
            title="Um cockpit desenhado por especialistas em UX"
            description="Layouts responsivos, formulários com feedback e animações suaves criam uma experiência impecável para times comerciais e técnicos."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {managerModules.map((module) => (
              <ManagerCard key={module.title} {...module} />
            ))}
          </div>
        </section>

        <section id="flowbuild" className="section-padding container-responsive">
          <SectionHeader
            eyebrow="Campanhas"
            title="Construa campanhas no FlowBuild"
            description="Arraste, conecte e publique jornadas omnicanal com pré-visualização em tempo real."
          />
          <div className="mt-12">
            <CampaignFlowDemo />
          </div>
        </section>

        <section className="section-padding container-responsive">
          <SectionHeader
            eyebrow="API ZuckZapGo"
            title="Endpoints que cobrem todo o ciclo de vida"
            description="Do onboarding ao pós-venda, a API privada oferece recursos para squads técnicos e de negócios colaborarem sem atrito."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {apiCapabilities.map((capability) => (
              <ApiCard key={capability.title} {...capability} />
            ))}
          </div>
        </section>

        <section id="integrations" className="section-padding container-responsive">
          <SectionHeader
            eyebrow="Integrações"
            title="Stack completa pronta para fan-out"
            description="O gateway processa e distribui eventos no formato ideal para cada transporte. Configure tudo em minutos direto do Manager."
          />
          <div className="mt-12 overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: [0, -2640, 0] }}
              transition={{ repeat: Infinity, duration: 90, ease: "linear" }}
            >
              {integrations.concat(integrations).map((integration, index) => (
                <IntegrationPill key={`${integration.name}-${index}`} {...integration} />
              ))}
            </motion.div>
          </div>
        </section>

        <section className="section-padding container-responsive">
          <SectionHeader
            eyebrow="Confiabilidade"
            title="Telemetria, retries e auto-healing sempre ativos"
            description="Manager e API trabalham juntos para monitorar métricas, reprocesar eventos e proteger jornadas críticas com agilidade."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reliabilityStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        <section className="section-padding container-responsive">
          <SectionHeader
            eyebrow="Login"
            title="Acesso seguro para equipes globais"
            description="Tokens efêmeros, cookies httpOnly e criptografia ponta a ponta asseguram a operação.
            "
          />
          <div className="mt-10">
            <SecurityCard />
          </div>
        </section>

        <section id="pricing" className="section-padding container-responsive">
          <SectionHeader
            eyebrow="Planos"
            title="Escolha a licença ideal para o seu time"
            description="Planos Professional e Enterprise com cobrança mensal ou anual, prontos para escalar a operação WhatsApp."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {pricingPlans.map((plan) => (
              <PricingCard key={`${plan.tier}-${plan.billing}`} {...plan} />
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Licenciamento Professional cobre 1 IP com instâncias ilimitadas. Planos Enterprise
            liberam até 2 instalações simultâneas, botões interativos, carousels e catálogos
            nativos.
          </p>
        </section>

        <FloatingActions />

        <footer className="border-t border-border/30 bg-background/80">
          <div className="container-responsive mx-auto flex flex-col gap-6 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logonova.png"
                alt="ZuckZapGo"
                width={72}
                height={72}
                className="rounded-xl object-contain drop-shadow-lg"
                unoptimized
              />
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  ZuckZapGo
                </span>
                <p className="text-sm text-muted-foreground">
                  API privada + Manager premium para squads que precisam de confiabilidade radical.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/70 px-3 py-1">
                <Activity className="h-4 w-4 text-primary" />
                Uptime monitorado 24/7
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/70 px-3 py-1">
                <HeartPulse className="h-4 w-4 text-primary" />
                Health endpoint ativo
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/70 px-3 py-1">
                <Workflow className="h-4 w-4 text-primary" />
                Campanhas fluxos nativos
              </div>
              <Link
                href="https://github.com/guilhermejansen/use-zuckzapgo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/70 px-3 py-1 transition hover:-translate-y-0.5"
              >
                <Image src="/landing/icons/github.svg" alt="GitHub" width={18} height={18} />
                Repositório de apoio
              </Link>
              <Link
                href="https://api.zuckzapgo.com/api/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/70 px-3 py-1 transition hover:-translate-y-0.5"
              >
                <Image src="/landing/icons/swagger.svg" alt="Swagger" width={18} height={18} />
                Swagger API
              </Link>
              <Link
                href="https://www.postman.com/setupautomatizado/setup-automatizado-s-workspace"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/70 px-3 py-1 transition hover:-translate-y-0.5"
              >
                <Image src="/landing/icons/postman.svg" alt="Postman" width={18} height={18} />
                Workspace Postman
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </ReactLenis>
  )
}
