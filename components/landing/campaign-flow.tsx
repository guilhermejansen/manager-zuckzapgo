"use client"

import { useEffect, useState } from "react"

import { motion } from "framer-motion"
import ReactFlow, {
  Background,
  BackgroundVariant,
  Edge,
  Handle,
  MarkerType,
  Node,
  Position,
  useEdgesState,
  useNodesState,
} from "reactflow"

import { cn } from "@/lib/utils"

const nodePalette = {
  start: {
    gradient:
      "from-emerald-400/15 via-emerald-400/8 to-white dark:from-emerald-400/25 dark:via-emerald-400/12 dark:to-slate-950",
    border: "border-emerald-400/40",
    accent: "text-emerald-300",
    glyph: "▶",
  },
  text: {
    gradient:
      "from-sky-500/15 via-sky-500/8 to-white dark:from-sky-500/25 dark:via-sky-500/12 dark:to-slate-950",
    border: "border-sky-500/40",
    accent: "text-sky-300",
    glyph: "⌘",
  },
  interactive: {
    gradient:
      "from-amber-400/15 via-amber-400/8 to-white dark:from-amber-500/25 dark:via-amber-500/12 dark:to-slate-950",
    border: "border-amber-500/40",
    accent: "text-amber-300",
    glyph: "✦",
  },
  end: {
    gradient:
      "from-slate-200/60 via-white to-white dark:from-white/15 dark:via-white/8 dark:to-slate-950",
    border: "border-muted-foreground/25",
    accent: "text-muted-foreground",
    glyph: "■",
  },
} as const

type CampaignNodeState = "idle" | "active" | "completed"

type CampaignNodeData = {
  title: string
  description: string
  order: number
  state: CampaignNodeState
  tone?: keyof typeof nodePalette
}

const baseNodes: Node<CampaignNodeData>[] = [
  {
    id: "ingestion",
    position: { x: 0, y: 140 },
    type: "campaignNode",
    data: {
      title: "Início do FlowBuild",
      description: "Ponto de partida com gatilhos, horários e filtros de entrada.",
      order: 0,
      state: "idle",
      tone: "start",
    },
    sourcePosition: Position.Right,
    style: { width: 320 },
  },
  {
    id: "message",
    position: { x: 360, y: 140 },
    type: "campaignNode",
    data: {
      title: "Mensagem de Texto",
      description: "Personalize conteúdo com variáveis, testes A/B e prévias.",
      order: 1,
      state: "idle",
      tone: "text",
    },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    style: { width: 320 },
  },
  {
    id: "interactive",
    position: { x: 720, y: 140 },
    type: "campaignNode",
    data: {
      title: "Mensagem Interativa",
      description: "Botões e listas direcionando contatos para squads e bots.",
      order: 2,
      state: "idle",
      tone: "interactive",
    },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    style: { width: 320 },
  },
  {
    id: "delivery",
    position: { x: 1080, y: 140 },
    type: "campaignNode",
    data: {
      title: "Fim do FlowBuild",
      description: "Finalize com tags, follow-ups ou integrações externas.",
      order: 3,
      state: "idle",
      tone: "end",
    },
    targetPosition: Position.Left,
    style: { width: 320 },
  },
]

const baseEdges: Edge[] = [
  {
    id: "ingestion-message",
    source: "ingestion",
    target: "message",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
    animated: true,
    style: { strokeWidth: 2, stroke: "rgba(59,130,246,0.65)", opacity: 0.35 },
  },
  {
    id: "message-interactive",
    source: "message",
    target: "interactive",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
    animated: true,
    style: { strokeWidth: 2, stroke: "rgba(59,130,246,0.65)", opacity: 0.35 },
  },
  {
    id: "interactive-delivery",
    source: "interactive",
    target: "delivery",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#38bdf8" },
    animated: true,
    style: { strokeWidth: 2, stroke: "rgba(59,130,246,0.65)", opacity: 0.35 },
  },
]

const nodeOrder = baseNodes
  .map((node) => ({ id: node.id, order: node.data.order }))
  .sort((a, b) => a.order - b.order)
  .map((item) => item.id)

const CampaignNode = ({ data }: { data: CampaignNodeData }) => {
  const palette = data.tone ? nodePalette[data.tone] : undefined
  const stateVariants: Record<CampaignNodeState, string> = {
    idle: palette
      ? palette.gradient
      : "from-slate-100 via-white to-slate-100 dark:from-background dark:via-background dark:to-background",
    active: "from-primary/15 via-primary/5 to-slate-950 dark:from-primary/25 dark:via-primary/10 dark:to-slate-950",
    completed:
      "from-emerald-500/15 via-emerald-500/5 to-slate-950 dark:from-emerald-500/25 dark:via-emerald-500/10 dark:to-slate-950",
  }

  return (
    <motion.div
      layout
      className={cn("rounded-2xl border bg-gradient-to-br p-5 shadow-sm", palette?.border ?? "border-border/40")}
      animate={{
        scale: data.state === "active" ? 1.05 : 1,
        boxShadow:
          data.state === "active"
            ? "0 25px 55px -28px rgba(56,189,248,0.55)"
            : "0 15px 45px -28px rgba(15,23,42,0.7)",
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={cn("relative rounded-xl bg-gradient-to-br p-5 text-left", stateVariants[data.state])}>
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/30 shadow-[0_25px_40px_-30px_rgba(15,23,42,0.45)] dark:border-white/10" />
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-muted-foreground/80">
          <span>{String(data.order + 1).padStart(2, "0")}</span>
          {palette ? <span className={cn("text-sm", palette.accent)}>{palette.glyph}</span> : null}
        </div>
        <h4 className="mt-3 text-lg font-semibold text-foreground">{data.title}</h4>
        <p className="mt-2 text-sm text-muted-foreground/90 dark:text-muted-foreground">{data.description}</p>
        <Handle type="target" position={Position.Left} className="!bg-transparent" />
        <Handle type="source" position={Position.Right} className="!bg-transparent" />
      </div>
    </motion.div>
  )
}

type LayoutMode = "desktop" | "mobile"

const desktopLayout: Record<string, { position: { x: number; y: number }; width: number; sourcePosition?: Position; targetPosition?: Position }> = {
  ingestion: { position: { x: 0, y: 140 }, width: 320, sourcePosition: Position.Right },
  message: { position: { x: 360, y: 140 }, width: 320, sourcePosition: Position.Right, targetPosition: Position.Left },
  interactive: { position: { x: 720, y: 140 }, width: 320, sourcePosition: Position.Right, targetPosition: Position.Left },
  delivery: { position: { x: 1080, y: 140 }, width: 320, targetPosition: Position.Left },
}

const mobileLayout: Record<string, { position: { x: number; y: number }; width: number; sourcePosition?: Position; targetPosition?: Position }> = {
  ingestion: { position: { x: 20, y: 20 }, width: 280, sourcePosition: Position.Bottom },
  message: { position: { x: 20, y: 280 }, width: 280, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  interactive: { position: { x: 20, y: 540 }, width: 280, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  delivery: { position: { x: 20, y: 800 }, width: 280, targetPosition: Position.Top },
}

const applyNodeLayout = (nodes: Node<CampaignNodeData>[], mode: LayoutMode) => {
  const layout = mode === "mobile" ? mobileLayout : desktopLayout

  return nodes.map((node) => {
    const next = layout[node.id]
    if (!next) return node

    return {
      ...node,
      position: next.position,
      style: { ...(node.style ?? {}), width: next.width },
      sourcePosition: next.sourcePosition ?? node.sourcePosition,
      targetPosition: next.targetPosition ?? node.targetPosition,
    }
  })
}

const applyEdgeLayout = (edges: Edge[], mode: LayoutMode) =>
  edges.map((edge) => ({
    ...edge,
    style: {
      ...(edge.style ?? {}),
      strokeDasharray: mode === "mobile" ? "6 4" : undefined,
    },
  }))

const nodeTypes = { campaignNode: CampaignNode }

const STEP_INTERVAL = 2200

export const CampaignFlowDemo = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("desktop")
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const query = window.matchMedia("(max-width: 900px)")

    const apply = (matches: boolean) => {
      const mode: LayoutMode = matches ? "mobile" : "desktop"
      setLayoutMode(mode)
      setNodes((prev) => applyNodeLayout(prev, mode))
      setEdges((prev) => applyEdgeLayout(prev, mode))
    }

    apply(query.matches)

    const listener = (event: MediaQueryListEvent) => apply(event.matches)
    query.addEventListener("change", listener)

    return () => query.removeEventListener("change", listener)
  }, [setEdges, setNodes])

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % nodeOrder.length)
    }, STEP_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const activeId = nodeOrder[stepIndex]
    const completedSet = new Set(nodeOrder.slice(0, stepIndex))

    setNodes((current) =>
      current.map((node) => {
        if (node.id === activeId) {
          return { ...node, data: { ...node.data, state: "active" } }
        }
        if (completedSet.has(node.id)) {
          return { ...node, data: { ...node.data, state: "completed" } }
        }
        return { ...node, data: { ...node.data, state: "idle" } }
      })
    )

    setEdges((current) =>
      current.map((edge) => {
        const sourceIndex = nodeOrder.indexOf(edge.source)
        const isCompleted = completedSet.has(edge.source)
        const isActive = edge.source === activeId || edge.target === activeId
        const baseStyle = edge.style ?? {}
        return {
          ...edge,
          animated: isActive || isCompleted,
          style: {
            ...baseStyle,
            strokeWidth: isActive ? 3 : 2,
            stroke: isCompleted ? "#22c55e" : "rgba(59,130,246,0.75)",
            opacity: sourceIndex <= stepIndex ? 1 : 0.25,
          },
        }
      })
    )
  }, [stepIndex, setEdges, setNodes])

  const boardHeightClass =
    layoutMode === "mobile"
      ? "h-[860px] sm:h-[900px]"
      : "h-[320px] sm:h-[360px] lg:h-[400px]"

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-border/20 bg-gradient-to-br from-slate-100 via-white to-slate-100 p-4 shadow-[0_35px_65px_-50px_rgba(15,23,42,0.25)] dark:border-border/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.14),transparent_55%)]" aria-hidden />
      </div>
      <div className="absolute -top-12 right-4 hidden rounded-full border border-border/30 bg-slate-200/80 px-4 py-1 text-xs uppercase tracking-[0.35em] text-slate-700 shadow-sm dark:bg-slate-900/70 dark:text-muted-foreground md:inline-flex">
        FlowBuild ao vivo
      </div>
      <div className={cn("w-full", boardHeightClass)}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          fitViewOptions={layoutMode === "mobile" ? { padding: 0.2 } : { padding: 0.15 }}
          panOnDrag={false}
          elementsSelectable={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          zoomOnScroll={false}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          attributionPosition="bottom-right"
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={32} size={1} color="rgba(148,163,184,0.15)" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
      <div className="mt-6 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
        <div>
          <span className="text-xs uppercase tracking-[0.35em] text-primary/80">Modelagem</span>
          <p className="mt-2">Construa journeys FlowBuild com condicionais, esperas e múltiplos destinos.</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.35em] text-primary/80">Preview vivo</span>
          <p className="mt-2">Visualize o caminho de cada contato em tempo real, passo a passo.</p>
        </div>
        <div>
          <span className="text-xs uppercase tracking-[0.35em] text-primary/80">Governança</span>
          <p className="mt-2">
            Acompanhe métricas, repita campanhas e ajuste regras sem interromper jornadas ativas.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CampaignFlowDemo
