"use client"

import Image from "next/image"
import Link from "next/link"

import { MotionConfig, useReducedMotion } from "framer-motion"
import ReactLenis from "lenis/react"
import {
  Archive,
  ArrowUpRight,
  Check,
  HeartPulse,
  Inbox,
  Layers,
  LogIn,
  MessageSquare,
  Radar,
  RefreshCw,
  ServerCog,
  ShieldCheck,
  Workflow,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { CampaignFlowDemo } from "@/components/landing/campaign-flow"
import {
  type FooterLinkIconKey,
  type HeroTaskIconKey,
  type IntegrationIconKey,
  type PricingTier,
  apiCapabilities,
  brand,
  brandPillars,
  checkout,
  featureHighlights,
  footerLinks,
  heroTasks,
  integrations,
  managerModules,
  pricingIncluded,
  pricingTiers,
  resilienceFacts,
  securityFocus,
} from "@/components/landing/content"
import { DashboardCarousel } from "@/components/landing/dashboard-carousel"
import { FloatingActions } from "@/components/landing/floating-actions"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const heroHeadline = "Operação WhatsApp sem atrito"
const heroLead = `${brand.manager} para escalar jornadas digitais com automação e confiança total.`

/** Deslocamento das âncoras para que o cabeçalho fixo não cubra o título. */
const anchorOffset = "scroll-mt-24 sm:scroll-mt-28"

/**
 * Largura de leitura das seções, alinhada ao cabeçalho e ao rodapé.
 * Antes as seções usavam só `container-responsive` (padding, sem largura máxima)
 * e se esticavam de borda a borda em 1440 px, desalinhadas do cabeçalho.
 */
const sectionShell = "mx-auto w-full max-w-6xl section-padding container-responsive"

const brandLogo = {
  src: "/logonova.png",
  alt: brand.name,
} as const

const integrationLogos: Record<IntegrationIconKey, { src: string; alt: string }> = {
  zuckzapgo: brandLogo,
  whatsapp: { src: "/landing/icons/whatsapp.svg", alt: "WhatsApp" },
  webhook: { src: "/landing/icons/webhook.svg", alt: "Webhooks" },
  rabbitmq: { src: "/landing/icons/rabbitmq.svg", alt: "RabbitMQ" },
  sqs: { src: "/landing/icons/sqs.svg", alt: "Amazon SQS" },
  s3: { src: "/landing/icons/s3.svg", alt: "Amazon S3" },
  redis: { src: "/landing/icons/redis.svg", alt: "Redis Streams" },
  postgres: { src: "/landing/icons/postgres.svg", alt: "PostgreSQL" },
  websocket: { src: "/landing/icons/websocket.svg", alt: "WebSockets" },
  sentry: { src: "/landing/icons/sentry.svg", alt: "Sentry" },
  jaeger: { src: "/landing/icons/jaeger.svg", alt: "Jaeger" },
}

const footerLinkLogos: Record<FooterLinkIconKey, string> = {
  github: "/landing/icons/github.svg",
  swagger: "/landing/icons/swagger.svg",
  postman: "/landing/icons/postman.svg",
}

const heroTaskIcons: Record<HeroTaskIconKey, LucideIcon> = {
  instances: ServerCog,
  campaigns: Workflow,
  events: Radar,
}

const capabilityIcons: Record<string, LucideIcon> = {
  Sessões: LogIn,
  Mensageria: MessageSquare,
  Monitoramento: Radar,
  Ambiente: ServerCog,
}

const resilienceIcons: LucideIcon[] = [RefreshCw, Inbox, Layers, Archive]

/**
 * Logo de integração sobre superfície de token.
 * Dimensão intrínseca (sem px fixo) para caber a partir de 320 px, e sem filtro
 * de cor ou brilho sobre a marca: o fundo em token dá o contraste nos dois temas.
 */
const BrandGlyph = ({
  iconKey,
  size = "md",
}: {
  iconKey: IntegrationIconKey
  size?: "sm" | "md"
}) => {
  const logo = integrationLogos[iconKey]

  if (!logo) return null

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-muted/50 ring-1 ring-border/60",
        size === "sm" ? "size-11 p-2" : "size-14 p-2.5"
      )}
    >
      {/* `unoptimized`: `next.config.ts` não habilita `dangerouslyAllowSVG`, então
          um SVG pedido pelo otimizador volta 400 e o ícone não aparece. */}
      <Image
        src={logo.src}
        alt=""
        aria-hidden
        width={56}
        height={56}
        className="h-full w-full object-contain"
        unoptimized
      />
    </span>
  )
}

const SectionHeader = ({
  eyebrow,
  title,
  description,
  titleId,
}: {
  eyebrow: string
  title: string
  description: string
  titleId?: string
}) => (
  <div className="mx-auto max-w-3xl text-center">
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary sm:tracking-[0.32em]">
      {eyebrow}
    </span>
    <h2
      id={titleId}
      className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-4xl"
    >
      {title}
    </h2>
    <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">{description}</p>
  </div>
)

const FeatureCard = ({ title, description, badge }: (typeof featureHighlights)[number]) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm transition-colors hover:border-primary/40 sm:p-6">
    <h3 className="text-lg font-semibold text-foreground sm:text-xl">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
    {badge ? (
      <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
        <span aria-hidden className="inline-flex size-1.5 rounded-full bg-primary" />
        {badge}
      </span>
    ) : null}
  </div>
)

const IntegrationCard = ({ name, tagline, icon }: (typeof integrations)[number]) => (
  <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm">
    <BrandGlyph iconKey={icon} size="sm" />
    <div className="flex min-w-0 flex-col">
      <span className="truncate text-sm font-semibold text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">{tagline}</span>
    </div>
  </div>
)

const ApiCard = ({ title, endpoint, description }: (typeof apiCapabilities)[number]) => {
  const Icon = capabilityIcons[endpoint] ?? ServerCog

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
        >
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-base font-semibold text-foreground sm:text-lg">{title}</h3>
      </div>
      <code className="w-fit rounded-lg bg-muted px-3 py-1 font-mono text-sm text-foreground">
        {endpoint}
      </code>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

const ManagerCard = ({ title, description, items }: (typeof managerModules)[number]) => (
  <div className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
)

const ResilienceCard = ({
  fact,
  index,
}: {
  fact: (typeof resilienceFacts)[number]
  index: number
}) => {
  const Icon = resilienceIcons[index] ?? RefreshCw

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
      <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
        <Icon aria-hidden className="h-4 w-4" />
        {fact.label}
      </span>
      <h3 className="text-lg font-semibold text-foreground">{fact.title}</h3>
      <p className="text-sm text-muted-foreground">{fact.detail}</p>
    </div>
  )
}

const SecurityCard = () => (
  <div className="grid gap-6 rounded-2xl border border-border/60 bg-card p-5 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
    <div className="space-y-4">
      <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
        <ShieldCheck aria-hidden className="h-4 w-4 text-primary" />
        Segurança
      </span>
      <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{securityFocus.title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {securityFocus.points.map((point) => (
          <li key={point} className="flex items-start gap-2">
            <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary">
        <LogIn aria-hidden className="h-4 w-4" />
        Fluxo com token
      </span>
      <ol className="list-decimal space-y-2 pl-4">
        {securityFocus.flow.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
    </div>
  </div>
)

/**
 * Um nível comercial com as duas periodicidades lado a lado.
 * Os quatro links de assinatura do produto seguem preservados, um por oferta.
 */
const PricingTierCard = ({ tier }: { tier: PricingTier }) => (
  <div
    className={cn(
      "flex flex-col gap-6 rounded-2xl border bg-card p-5 shadow-sm sm:p-6",
      tier.featured ? "border-primary/50" : "border-border/60"
    )}
  >
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-xl font-semibold text-foreground sm:text-2xl">{tier.tier}</h3>
        {tier.featured ? (
          <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            Mais completo
          </span>
        ) : null}
      </div>
      <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
        {tier.installations}
      </span>
      <p className="text-sm text-muted-foreground">{tier.summary}</p>
      {tier.extras.length > 0 ? (
        <ul className="space-y-2 text-sm text-muted-foreground">
          {tier.extras.map((extra) => (
            <li key={extra} className="flex items-start gap-2">
              <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{extra}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>

    <div className="mt-auto grid gap-3 sm:grid-cols-2">
      {tier.offers.map((offer) => (
        <div
          key={offer.billing}
          className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/60 p-4"
        >
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-foreground">{offer.billing}</h4>
            <p className="text-xs text-muted-foreground">{offer.description}</p>
          </div>
          {/* `size="lg"` da primitiva é h-10 (40 px): h-11 leva o alvo a 44 px. */}
          <Button asChild className="mt-auto h-11 w-full" size="lg">
            <Link
              href={offer.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`Assinar ${tier.tier} ${offer.billing.toLowerCase()} — abre a página de assinatura da ${checkout.provider} em nova aba`}
            >
              Assinar {offer.billing.toLowerCase()}
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ))}
    </div>

    <p className="text-xs text-muted-foreground">
      Pagamento via {checkout.provider}. {checkout.note}
      {tier.quantityNote ? ` ${tier.quantityNote}` : ""}
    </p>
  </div>
)

/**
 * Rolagem suave do Lenis apenas quando o visitante não pediu movimento reduzido.
 * Montado como irmão, sem envolver a página, para não remontar a árvore ao trocar.
 */
const SmoothScroll = () => {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

  return <ReactLenis root options={{ smoothWheel: true, lerp: 0.08 }} />
}

export const LandingPage = () => {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />

      <a
        href="#conteudo"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:border focus-visible:border-border focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-foreground"
      >
        Ir para o conteúdo
      </a>

      <div className="relative min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:gap-3"
            >
              <Image
                src={brandLogo.src}
                alt={brandLogo.alt}
                width={48}
                height={48}
                className="size-9 shrink-0 rounded-lg object-contain sm:size-11"
                priority
                unoptimized
              />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-foreground sm:tracking-[0.2em]">
                  {brand.manager}
                </span>
                <span className="hidden truncate text-xs text-muted-foreground sm:block">
                  {brand.descriptor}
                </span>
              </span>
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <Button asChild size="lg" className="h-11 px-4">
                <Link href="/login">
                  Entrar
                  <LogIn aria-hidden className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main id="conteudo" tabIndex={-1}>
          {/*
            Hero: tarefa real do operador e as duas ações principais.
            Sem animação de entrada — o conteúdo precisa estar legível na
            primeira pintura, inclusive no HTML do servidor.
          */}
          <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:gap-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
                <Image
                  src={integrationLogos.whatsapp.src}
                  alt=""
                  aria-hidden
                  width={16}
                  height={16}
                  className="h-4 w-4"
                  unoptimized
                />
                WhatsApp WA MD · SDK whatsmeow
              </span>

              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {heroHeadline}
              </h1>

              <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
                {heroLead} Acompanhe eventos críticos em tempo real, configure integrações e mantenha
                cada instância WhatsApp sob controle, no seu próprio ambiente.
              </p>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="h-11 w-full sm:w-auto">
                  <Link href="/login">
                    Entrar no Manager
                    <LogIn aria-hidden className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-11 w-full sm:w-auto">
                  <Link href="#pricing">Ver planos</Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-11 w-full sm:w-auto">
                  <Link href="#flowbuild">Ver o FlowBuild</Link>
                </Button>
              </div>

              <ul className="grid w-full gap-3 text-left sm:grid-cols-3">
                {heroTasks.map((task) => {
                  const Icon = heroTaskIcons[task.icon]

                  return (
                    <li
                      key={task.label}
                      className="flex min-w-0 items-start gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm"
                    >
                      <span
                        aria-hidden
                        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="text-sm font-semibold text-foreground">{task.label}</span>
                        <span className="text-xs text-muted-foreground">{task.detail}</span>
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </section>

          {/* Telas reais do produto. */}
          <section
            aria-label="Telas do Manager"
            className="flex items-center justify-center px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8"
          >
            <DashboardCarousel />
          </section>

          <section
            aria-label="Pilares do produto"
            className={sectionShell}
          >
            <ul className="grid gap-4 sm:grid-cols-3">
              {brandPillars.map((pillar) => (
                <li
                  key={pillar.title}
                  className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
                >
                  <h2 className="text-base font-semibold text-foreground">{pillar.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="arquitetura-titulo"
            className={cn(sectionShell, anchorOffset)}
          >
            <SectionHeader
              titleId="arquitetura-titulo"
              eyebrow="Arquitetura"
              title="Pensada para operação contínua"
              description="Governança centralizada, configuração num só lugar e caminho de recuperação declarado para cada evento."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
              {featureHighlights.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </section>

          <section
            aria-labelledby="manager-titulo"
            className={cn(sectionShell, anchorOffset)}
          >
            <SectionHeader
              titleId="manager-titulo"
              eyebrow="Manager"
              title="Um cockpit para instâncias, campanhas e eventos"
              description="Layout responsivo, formulários validados e retorno imediato de cada ação para times comerciais e técnicos."
            />
            <div className="mt-10 grid gap-4 lg:grid-cols-3 sm:gap-6">
              {managerModules.map((module) => (
                <ManagerCard key={module.title} {...module} />
              ))}
            </div>
          </section>

          <section
            id="flowbuild"
            aria-labelledby="flowbuild-titulo"
            className={cn(sectionShell, anchorOffset)}
          >
            <SectionHeader
              titleId="flowbuild-titulo"
              eyebrow="Campanhas"
              title="Construa campanhas no FlowBuild"
              description="Arraste, conecte e publique jornadas omnicanal com pré-visualização dos passos."
            />
            <div className="mt-10">
              <CampaignFlowDemo />
            </div>
          </section>

          <section
            aria-labelledby="api-titulo"
            className={cn(sectionShell, anchorOffset)}
          >
            <SectionHeader
              titleId="api-titulo"
              eyebrow={`API ${brand.name}`}
              title="Endpoints que cobrem todo o ciclo de vida"
              description="Do onboarding ao pós-venda, a API privada atende squads técnicos e de negócios no mesmo contrato."
            />
            <div className="mt-10 grid gap-4 md:grid-cols-2 sm:gap-6">
              {apiCapabilities.map((capability) => (
                <ApiCard key={capability.title} {...capability} />
              ))}
            </div>
          </section>

          <section
            id="integrations"
            aria-labelledby="integracoes-titulo"
            className={cn(sectionShell, anchorOffset)}
          >
            <SectionHeader
              titleId="integracoes-titulo"
              eyebrow="Integrações"
              title="Stack completa pronta para fan-out"
              description="O gateway processa e distribui eventos no formato de cada transporte. A configuração fica no Manager."
            />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4">
              {integrations.map((integration) => (
                <li key={integration.name}>
                  <IntegrationCard {...integration} />
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="resiliencia-titulo"
            className={cn(sectionShell, anchorOffset)}
          >
            <SectionHeader
              titleId="resiliencia-titulo"
              eyebrow="Resiliência"
              title="O que acontece quando uma entrega falha"
              description="Reenvio, quarentena, buffer e arquivo: o caminho de recuperação de um evento é visível no Manager."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4 sm:gap-6">
              {resilienceFacts.map((fact, index) => (
                <ResilienceCard key={fact.title} fact={fact} index={index} />
              ))}
            </div>
          </section>

          <section
            aria-labelledby="login-titulo"
            className={cn(sectionShell, anchorOffset)}
          >
            <SectionHeader
              titleId="login-titulo"
              eyebrow="Login"
              title="Acesso com token efêmero"
              description="Cookies httpOnly com SameSite=Strict e proxy interno entre o Manager e a API."
            />
            <div className="mt-10">
              <SecurityCard />
            </div>
          </section>

          <section
            id="pricing"
            aria-labelledby="planos-titulo"
            className={cn(sectionShell, anchorOffset)}
          >
            <SectionHeader
              titleId="planos-titulo"
              eyebrow="Planos"
              title="Escolha a licença ideal para o seu time"
              description="Professional e Enterprise, cada um com cobrança mensal ou anual: quatro ofertas, todas self-hosted."
            />
            <div className="mt-10 grid gap-4 lg:grid-cols-2 sm:gap-6">
              {pricingTiers.map((tier) => (
                <PricingTierCard key={tier.tier} tier={tier} />
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-border/60 bg-muted/20 p-5 sm:p-6">
              <h3 className="text-base font-semibold text-foreground">Em todos os planos</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {pricingIncluded.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>

        <FloatingActions />

        <footer className="border-t border-border/60 bg-background">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-12 lg:px-8">
            <div className="flex min-w-0 items-start gap-3">
              <Image
                src={brandLogo.src}
                alt={brandLogo.alt}
                width={56}
                height={56}
                className="size-12 shrink-0 rounded-lg object-contain"
                unoptimized
              />
              <div className="min-w-0 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                  {brand.name}
                </span>
                <p className="text-sm text-muted-foreground">{brand.summary}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5">
                <HeartPulse aria-hidden className="h-4 w-4 text-primary" />
                Health endpoint
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5">
                <Workflow aria-hidden className="h-4 w-4 text-primary" />
                Campanhas com fluxos nativos
              </span>
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Image
                    src={footerLinkLogos[link.icon]}
                    alt=""
                    aria-hidden
                    width={18}
                    height={18}
                    className="h-[18px] w-[18px]"
                    unoptimized
                  />
                  {link.label}
                  <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </MotionConfig>
  )
}
