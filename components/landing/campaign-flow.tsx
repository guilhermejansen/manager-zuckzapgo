"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { useReducedMotion } from "framer-motion"
import { Flag, MessageSquare, MousePointerClick, Play } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Edge,
  Handle,
  MarkerType,
  type Node,
  Position,
} from "reactflow"

import { cn } from "@/lib/utils"

type CampaignNodeState = "idle" | "active" | "completed"

type CampaignStep = {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

/** Os quatro passos do FlowBuild: única fonte do diagrama e da lista. */
const campaignSteps: CampaignStep[] = [
  {
    id: "ingestion",
    title: "Início do FlowBuild",
    description: "Ponto de partida com gatilhos, horários e filtros de entrada.",
    icon: Play,
  },
  {
    id: "message",
    title: "Mensagem de Texto",
    description: "Personalize conteúdo com variáveis, testes A/B e prévias.",
    icon: MessageSquare,
  },
  {
    id: "interactive",
    title: "Mensagem Interativa",
    description: "Botões e listas direcionando contatos para squads e bots.",
    icon: MousePointerClick,
  },
  {
    id: "delivery",
    title: "Fim do FlowBuild",
    description: "Finalize com tags, follow-ups ou integrações externas.",
    icon: Flag,
  },
]

const flowNotes = [
  {
    label: "Modelagem",
    text: "Construa journeys FlowBuild com condicionais, esperas e múltiplos destinos.",
  },
  {
    label: "Pré-visualização",
    text: "Veja o caminho de cada contato passo a passo antes de publicar.",
  },
  {
    label: "Governança",
    text: "Acompanhe métricas, repita campanhas e ajuste regras sem interromper jornadas ativas.",
  },
]

type CampaignNodeData = {
  title: string
  description: string
  order: number
  state: CampaignNodeState
  icon: LucideIcon
}

/**
 * Nó do diagrama. Superfície e texto vêm de token, nos dois temas:
 * a versão anterior terminava os gradientes de estado em `slate-950`
 * também no tema claro, deixando texto escuro sobre fundo quase preto.
 */
const CampaignNode = ({ data }: { data: CampaignNodeData }) => {
  const Icon = data.icon

  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5 text-left shadow-sm transition-colors",
        data.state === "active"
          ? "border-primary ring-1 ring-primary/40"
          : data.state === "completed"
            ? "border-primary/40"
            : "border-border/60"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-xs text-muted-foreground">
          {String(data.order + 1).padStart(2, "0")}
        </span>
        <span
          aria-hidden
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-full bg-muted",
            data.state === "idle" ? "text-muted-foreground" : "text-primary"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <h3 className="mt-3 text-base font-semibold text-foreground">{data.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{data.description}</p>
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
    </div>
  )
}

const nodeTypes = { campaignNode: CampaignNode }

const buildNodes = (activeIndex: number | null): Node<CampaignNodeData>[] =>
  campaignSteps.map((step, index) => ({
    id: step.id,
    type: "campaignNode",
    position: { x: index * 360, y: 0 },
    style: { width: 320 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: {
      title: step.title,
      description: step.description,
      order: index,
      icon: step.icon,
      state:
        activeIndex === null
          ? "idle"
          : index === activeIndex
            ? "active"
            : index < activeIndex
              ? "completed"
              : "idle",
    },
  }))

const buildEdges = (activeIndex: number | null, animate: boolean): Edge[] =>
  campaignSteps.slice(0, -1).map((step, index) => {
    const reached = activeIndex !== null && index < activeIndex
    const isActive = activeIndex !== null && index === activeIndex - 1

    return {
      id: `${step.id}-${campaignSteps[index + 1].id}`,
      source: step.id,
      target: campaignSteps[index + 1].id,
      type: "smoothstep",
      animated: animate && isActive,
      markerEnd: { type: MarkerType.ArrowClosed, color: "var(--border)" },
      style: {
        strokeWidth: 2,
        stroke: reached || isActive ? "var(--primary)" : "var(--border)",
      },
    }
  })

const STEP_INTERVAL = 2600
/** Abaixo disto o diagrama não cabe: a lista de passos é a versão visível. */
const DIAGRAM_MIN_WIDTH = "(min-width: 900px)"

/**
 * Largura lida por store externa, não por `setState` dentro de efeito:
 * o servidor lê `false` e o cliente reage a resize e rotação pelo próprio
 * `matchMedia`.
 */
const subscribeDiagramWidth = (onStoreChange: () => void) => {
  const query = window.matchMedia(DIAGRAM_MIN_WIDTH)
  query.addEventListener("change", onStoreChange)

  return () => query.removeEventListener("change", onStoreChange)
}
const getDiagramWidth = () => window.matchMedia(DIAGRAM_MIN_WIDTH).matches
const getDiagramWidthOnServer = () => false

export const CampaignFlowDemo = () => {
  const prefersReducedMotion = useReducedMotion()
  const showDiagram = useSyncExternalStore(
    subscribeDiagramWidth,
    getDiagramWidth,
    getDiagramWidthOnServer
  )
  const [step, setStep] = useState(0)

  // Só percorre os passos quando há diagrama na tela e o visitante não pediu
  // movimento reduzido. O índice ativo é derivado, então nada é escrito no
  // corpo do efeito: sem percurso, o estado fica parado e completo.
  const walkSteps = showDiagram && !prefersReducedMotion
  const activeIndex = walkSteps ? step % campaignSteps.length : null

  useEffect(() => {
    if (!walkSteps) return

    const interval = setInterval(() => setStep((previous) => previous + 1), STEP_INTERVAL)

    return () => clearInterval(interval)
  }, [walkSteps])

  const animateEdges = !prefersReducedMotion

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border/60 bg-muted/20 p-4 shadow-sm sm:p-6">
      {showDiagram ? (
        <div aria-hidden className="h-[360px] w-full lg:h-[400px]">
          <ReactFlow
            nodes={buildNodes(activeIndex)}
            edges={buildEdges(activeIndex, animateEdges)}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            panOnScroll={false}
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            preventScrolling={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={32} size={1} variant={BackgroundVariant.Dots} />
          </ReactFlow>
        </div>
      ) : null}

      {/*
        A mesma sequência em texto: visível onde o diagrama não cabe e sempre
        disponível para leitor de tela, já que a tela do ReactFlow é decorativa.
      */}
      <ol className={cn("grid gap-3", showDiagram && "sr-only")}>
        {campaignSteps.map((step, index) => {
          const Icon = step.icon

          return (
            <li
              key={step.id}
              className="flex min-w-0 gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-sm"
            >
              <span
                aria-hidden
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="font-mono text-xs text-muted-foreground">
                  Passo {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold text-foreground">{step.title}</span>
                <span className="mt-1 text-sm text-muted-foreground">{step.description}</span>
              </span>
            </li>
          )
        })}
      </ol>

      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
        {flowNotes.map((note) => (
          <div key={note.label}>
            <dt className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {note.label}
            </dt>
            <dd className="mt-2 text-muted-foreground">{note.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default CampaignFlowDemo
