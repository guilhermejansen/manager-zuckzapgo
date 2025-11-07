"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import dynamic from "next/dynamic"

import { Trash2 } from "lucide-react"
import ReactFlow, {
  Background,
  BackgroundVariant,
  BaseEdge,
  type Connection,
  type Edge,
  EdgeLabelRenderer,
  type EdgeProps,
  type Node,
  ReactFlowProvider,
  addEdge,
  getStraightPath,
} from "reactflow"
import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { WorkflowProvider, useWorkflow } from "@/contexts/campaign-workflow-context"
import { generateDeterministicId } from "@/lib/id-generator"
import { cn } from "@/lib/utils"
import type { WorkflowFormData } from "@/lib/validations"
import { deserializeWorkflow, serializeWorkflow } from "@/lib/workflow/serialization"

import { NODE_DEFINITIONS, type WorkflowNodeType } from "./workflow-definitions"
import { WorkflowSidebar } from "./workflow-sidebar"
import { WorkflowToolbar } from "./workflow-toolbar"
import type { WorkflowNodeInput } from "./workflow-types"

// Dynamic imports para evitar SSR issues
const StartNodeV2 = dynamic(() => import("./nodes/start-node"), { ssr: false })

const TextMessageNodeV2 = dynamic(() => import("./nodes/text-message-node"), { ssr: false })

const MediaMessageNodeV2 = dynamic(() => import("./nodes/media-message-node"), { ssr: false })

const InteractiveNodeV2 = dynamic(() => import("./nodes/interactive-node"), { ssr: false })

const DelayNodeV2 = dynamic(() => import("./nodes/delay-node"), { ssr: false })

const HttpRequestNodeV2 = dynamic(() => import("./nodes/http-request-node"), { ssr: false })

const EndNode = dynamic(() => import("./nodes/end-node"), { ssr: false })

// Custom Edge com botão de delete
function CustomEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps) {
  const { setEdges } = useWorkflow()
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const onEdgeDelete = useCallback(() => {
    setEdges((prev) => prev.filter((edge) => edge.id !== id))
  }, [id, setEdges])

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdgeDelete}
            className="h-7 w-7 rounded-md bg-gray-800 border border-red-500/50 text-red-400 hover:text-red-300 hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete connection"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}

// CRITICAL: NODE_TYPES deve ser definido no nível do módulo (fora do componente)
// para evitar Error #185 (re-renders infinitos)
const NODE_TYPES = {
  "trigger.start": StartNodeV2,
  "message.text": TextMessageNodeV2,
  "message.media": MediaMessageNodeV2,
  "message.interactive": InteractiveNodeV2,
  "control.delay": DelayNodeV2,
  "integration.http": HttpRequestNodeV2,
  "control.end": EndNode,
} as const

const EDGE_TYPES = {
  default: CustomEdge,
} as const

type NodeHandlerMap = {
  onDuplicate: (nodeId: string) => void
  onDelete: (nodeId: string) => void
  onConfigChange: (nodeId: string, patch: Record<string, unknown>) => void
  onInputsChange: (nodeId: string, inputs: WorkflowNodeInput[]) => void
}

// Função para enriquecer nodes com dados de NODE_DEFINITIONS
function enrichNodeWithDefinition(node: Node, handlers?: NodeHandlerMap): Node {
  const definition = NODE_DEFINITIONS[node.type as WorkflowNodeType]

  if (!definition) {
    console.error(`Unknown node type: ${node.type}`, node)
    return node // Retorna node original se tipo desconhecido
  }

  return {
    ...node,
    data: {
      ...node.data,
      label: definition.label,
      description: definition.description,
      icon: definition.icon,
      theme: definition.theme,
      active: node.data?.active ?? true,
      // Adicionar actions se handlers foram fornecidos
      actions: handlers
        ? {
            onDuplicate: () => handlers.onDuplicate(node.id),
            onDelete: () => handlers.onDelete(node.id),
          }
        : node.data?.actions,
      onConfigChange: handlers
        ? (patch: Record<string, unknown>) => handlers.onConfigChange(node.id, patch)
        : node.data?.onConfigChange,
      onInputsChange: handlers
        ? (inputs: WorkflowNodeInput[]) => handlers.onInputsChange(node.id, inputs)
        : node.data?.onInputsChange,
    },
  }
}

// Initial nodes with explicit dimensions for SSR
const initialNodes: Node[] = [
  {
    id: "1",
    type: "trigger.start", // Usando custom node type
    position: { x: 250, y: 0 },
    data: {
      config: {},
    },
    width: 320,
    height: 120,
  },
  {
    id: "2",
    type: "message.text",
    position: { x: 250, y: 200 },
    data: {
      config: {
        message: "Olá {{contact.name}}! Bem-vindo ao nosso sistema.",
        delayMs: 0,
        linkPreview: false,
        presenceSimulation: 0,
      },
    },
    width: 320,
    height: 150,
  },
  {
    id: "3",
    type: "message.interactive",
    position: { x: 250, y: 400 },
    data: {
      config: {
        interactiveType: "buttons",
        text: "Como posso ajudar você hoje?",
        buttons: [
          { id: "1", label: "Suporte Técnico", value: "support" },
          { id: "2", label: "Vendas", value: "sales" },
          { id: "3", label: "Informações Gerais", value: "info" },
        ],
        listButtonText: "",
        delayMs: 0,
      },
    },
    width: 320,
    height: 180,
  },
  {
    id: "4",
    type: "control.end",
    position: { x: 250, y: 620 },
    data: {
      config: {},
    },
    width: 200,
    height: 80,
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e3-4", source: "3", target: "4" },
]

interface WorkflowEditorV2Props {
  className?: string
  onExitFullscreen?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  onChange?: (workflow: WorkflowFormData) => void
  initialWorkflow?: WorkflowFormData
  readOnly?: boolean
}

function WorkflowEditorContent({
  className,
  onExitFullscreen,
  onToggleFullscreen,
  isFullscreen,
  onChange,
  initialWorkflow,
  readOnly = false,
}: WorkflowEditorV2Props) {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    updateNode,
    removeNode,
    duplicateNode,
  } = useWorkflow()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Handlers para duplicate e delete
  const handleDuplicate = useCallback(
    (nodeId: string) => {
      duplicateNode(nodeId)
    },
    [duplicateNode]
  )

  const handleDelete = useCallback(
    (nodeId: string) => {
      removeNode(nodeId)
    },
    [removeNode]
  )

  const handleConfigChange = useCallback(
    (nodeId: string, patch: Record<string, unknown>) => {
      updateNode(nodeId, (currentData) => {
        const previousConfig = (currentData?.config as Record<string, unknown> | undefined) ?? {}

        return {
          config: {
            ...previousConfig,
            ...patch,
          },
        }
      })
    },
    [updateNode]
  )

  const handleInputsChange = useCallback(
    (nodeId: string, inputs: WorkflowNodeInput[]) => {
      updateNode(nodeId, { inputs })
    },
    [updateNode]
  )

  const nodeHandlers = useMemo<NodeHandlerMap>(
    () => ({
      onDuplicate: handleDuplicate,
      onDelete: handleDelete,
      onConfigChange: handleConfigChange,
      onInputsChange: handleInputsChange,
    }),
    [handleDuplicate, handleDelete, handleConfigChange, handleInputsChange]
  )

  // Deserializar initialWorkflow quando componente monta
  useEffect(() => {
    if (initialWorkflow) {
      const deserialized = deserializeWorkflow(initialWorkflow)
      setNodes(deserialized.nodes)
      setEdges(deserialized.edges)
    }
  }, [initialWorkflow, setNodes, setEdges])

  // Serializar e notificar parent quando workflow mudar (debounced)
  useEffect(() => {
    if (!onChange || readOnly) return

    const timer = setTimeout(() => {
      const workflow = serializeWorkflow(nodes, edges)
      onChange(workflow)
    }, 500) // Debounce de 500ms para não sobrecarregar

    return () => clearTimeout(timer)
  }, [nodes, edges, onChange, readOnly])

  // Store reactFlow instance globally for CustomEdge
  const onInit = useCallback((instance: any) => {
    ;(window as any).reactFlowInstance = instance
    // Fit view inicial para garantir que tudo está visível
    setTimeout(() => {
      instance.fitView({ padding: 0.3, maxZoom: 1.2, duration: 400 })
    }, 100)
  }, [])

  // ESC para sair do fullscreen
  useEffect(() => {
    if (!onExitFullscreen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExitFullscreen()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onExitFullscreen])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log("Clicked node:", node.id, node.type, node.data)
  }, [])

  // Drag & Drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")
      if (!type || !reactFlowWrapper.current) return

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
      const reactFlowInstance = (window as any).reactFlowInstance

      if (!reactFlowInstance) return

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      })

      // Configurações padrão para cada tipo de node
      const defaultConfigs: Record<string, any> = {
        "trigger.start": {},
        "message.text": {
          message: "",
          delayMs: 0,
          linkPreview: false,
          presenceSimulation: 0,
        },
        "message.media": {
          mediaType: "image",
          mediaUrl: "",
          caption: "",
          delayMs: 0,
        },
        "message.interactive": {
          interactiveType: "buttons",
          text: "",
          buttons: [],
          listButtonText: "",
          delayMs: 0,
        },
        "control.delay": {
          durationMs: 1000,
          jitterMs: 0,
        },
        "integration.http": {
          method: "GET",
          url: "https://api.example.com",
          auth: "none",
          queryParams: [],
          headers: [],
          bodyEnabled: false,
          bodyContentType: "json",
          body: "",
        },
        "control.end": {},
      }

      // Obter definição do node para incluir theme, label, icon, etc.
      const definition = NODE_DEFINITIONS[type as WorkflowNodeType]

      if (!definition) {
        console.error(`Unknown node type dropped: ${type}`)
        return
      }

      const newNode: Node = {
        id: generateDeterministicId("node"),
        type,
        position,
        data: {
          label: definition.label,
          description: definition.description,
          icon: definition.icon,
          theme: definition.theme,
          active: true,
          config: defaultConfigs[type] || {},
        },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes]
  )

  // Enriquecer nodes com actions sempre que nodes mudar
  const enrichedNodes = useMemo(
    () => nodes.map((node) => enrichNodeWithDefinition(node, nodeHandlers)),
    [nodes, nodeHandlers]
  )

  return (
    <div
      ref={reactFlowWrapper}
      className={cn(className, "w-full h-full")}
      style={{
        width: "100%",
        height: isFullscreen ? "100vh" : "500px",
        minHeight: isFullscreen ? "100vh" : "500px",
        position: "relative",
      }}
    >
      <ReactFlow
        nodes={enrichedNodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onNodeClick={readOnly ? undefined : onNodeClick}
        onInit={onInit}
        onDragOver={readOnly ? undefined : onDragOver}
        onDrop={readOnly ? undefined : onDrop}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1.2, minZoom: 0.5 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        {!readOnly && (
          <WorkflowToolbar
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onExitFullscreen={onExitFullscreen}
            onToggleFullscreen={onToggleFullscreen}
            isFullscreen={isFullscreen}
          />
        )}
      </ReactFlow>

      {!readOnly && (
        <WorkflowSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isFullscreen={isFullscreen}
        />
      )}
    </div>
  )
}

export function WorkflowEditorV2({
  className,
  onExitFullscreen,
  onToggleFullscreen,
  isFullscreen,
  onChange,
  initialWorkflow,
  readOnly = false,
}: WorkflowEditorV2Props) {
  return (
    <ReactFlowProvider>
      <WorkflowProvider initialNodes={initialNodes} initialEdges={initialEdges}>
        <WorkflowEditorContent
          className={className}
          onExitFullscreen={onExitFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          isFullscreen={isFullscreen}
          onChange={onChange}
          initialWorkflow={initialWorkflow}
          readOnly={readOnly}
        />
      </WorkflowProvider>
    </ReactFlowProvider>
  )
}
