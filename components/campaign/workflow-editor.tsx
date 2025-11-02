"use client"

import {
  DragEvent as ReactDragEvent,
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { useTheme } from "next-themes"

import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  Node,
  type NodeProps,
  type NodeTypes,
  ReactFlowInstance,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow"
import "reactflow/dist/style.css"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { logger } from "@/lib/logger"
import type { WorkflowFormData } from "@/lib/validations"

import type { BaseNodeData, NodeActionHandlers } from "./nodes/base-node"
import DelayNode from "./nodes/delay-node"
import type { DelayNodeData } from "./nodes/delay-node"
import EndNode from "./nodes/end-node"
import HttpRequestNode from "./nodes/http-request-node"
import type { HttpRequestNodeData } from "./nodes/http-request-node"
import InteractiveNode from "./nodes/interactive-node"
import type { InteractiveNodeData } from "./nodes/interactive-node"
import MediaMessageNode from "./nodes/media-message-node"
import type { MediaMessageNodeData } from "./nodes/media-message-node"
import StartNode from "./nodes/start-node"
import TextMessageNode from "./nodes/text-message-node"
import type { TextMessageNodeData } from "./nodes/text-message-node"
import { NODE_DEFINITIONS, type WorkflowNodeType } from "./workflow-definitions"
import { WorkflowSidebar } from "./workflow-sidebar"
import type {
  PlaceholderGroup,
  WorkflowAvailableSource,
  WorkflowNodeInput,
} from "./workflow-types"

interface WorkflowEditorProps {
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onChange?: (workflow: WorkflowFormData) => void
  readOnly?: boolean
}

function withNodeDefinition(node: Node): Node {
  const definition = NODE_DEFINITIONS[node.type as WorkflowNodeType]
  if (!definition) return node

  const baseData: BaseNodeData = {
    label: definition.label,
    description: definition.description,
    icon: definition.icon,
    theme: definition.theme,
    active: node.data?.active ?? true,
    allowInput: definition.allowInput,
    allowOutput: definition.allowOutput,
  }

  return {
    ...node,
    data: {
      ...baseData,
      ...(node.data ?? {}),
    },
  }
}

function sanitizeWorkflow(nodes: Node[], edges: Edge[]): WorkflowFormData {
  return {
    metadata: {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
    },
    nodes: nodes.map((node) => {
      const nodeType = node.type || "unknown"
      const definition = NODE_DEFINITIONS[nodeType as WorkflowNodeType]
      const config = node.data?.config ?? definition?.defaultConfig ?? {}

      return {
        id: node.id,
        type: nodeType,
        position: node.position,
        data: {
          label: node.data?.label ?? definition?.label ?? nodeType,
          active: node.data?.active ?? true,
          config,
          inputs: node.data?.inputs ?? [],
          outputs: node.data?.outputs ?? definition?.defaultOutputs ?? [],
        },
      }
    }),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle ?? undefined,
      targetHandle: edge.targetHandle ?? undefined,
      type: edge.type,
      animated: edge.animated,
    })),
  }
}

const CONTACT_PLACEHOLDERS: PlaceholderGroup = {
  id: "contact",
  label: "Dados do contato",
  options: [
    {
      id: "{{contact.jid}}",
      label: "Contato • JID",
      description: "Identificador completo do contato",
    },
    {
      id: "{{contact.name}}",
      label: "Contato • Nome",
      description: "Nome cadastrado na lista",
    },
    {
      id: "{{contact.pushName}}",
      label: "Contato • Nome no WhatsApp",
    },
    {
      id: "{{contact.type}}",
      label: "Contato • Tipo",
      description: "INDIVIDUAL, GROUP, NEWSLETTER, etc",
    },
    {
      id: "{{contact.custom.campo}}",
      label: "Contato • Campo personalizado",
      description: "Substitua 'campo' pelo nome configurado na importação",
    },
  ],
}

const CAMPAIGN_PLACEHOLDERS: PlaceholderGroup = {
  id: "campaign",
  label: "Dados da campanha",
  options: [
    { id: "{{campaign.id}}", label: "Campanha • ID" },
    { id: "{{campaign.name}}", label: "Campanha • Nome" },
    { id: "{{campaign.type}}", label: "Campanha • Tipo" },
    { id: "{{campaign.status}}", label: "Campanha • Status" },
    {
      id: "{{campaign.scheduledAt}}",
      label: "Campanha • Agendamento",
      description: "ISO string da data agendada, se existir",
    },
  ],
}

const SYSTEM_PLACEHOLDERS: PlaceholderGroup = {
  id: "system",
  label: "Contexto de execução",
  options: [
    {
      id: "{{context.timestamp}}",
      label: "Contexto • Timestamp",
      description: "Momento em que o passo está sendo executado",
    },
    {
      id: "{{context.batchIndex}}",
      label: "Contexto • Índice do contato",
      description: "Posição do contato atual na campanha",
    },
    {
      id: "{{context.instanceId}}",
      label: "Contexto • Instância",
      description: "Identificador da instância que está enviando a mensagem",
    },
  ],
}

function buildAvailableSources(
  nodes: Node[],
  edges: Edge[]
): Record<string, WorkflowAvailableSource[]> {
  const sourcesByNode: Record<string, WorkflowAvailableSource[]> = {}
  const nodesMap = new Map(nodes.map((node) => [node.id, node]))

  nodes.forEach((node) => {
    const incoming = edges.filter((edge) => edge.target === node.id)
    if (!incoming.length) {
      sourcesByNode[node.id] = []
      return
    }

    const sources: WorkflowAvailableSource[] = incoming
      .map((edge) => nodesMap.get(edge.source))
      .filter((sourceNode): sourceNode is Node => Boolean(sourceNode))
      .map((sourceNode) => {
        const definition = NODE_DEFINITIONS[sourceNode.type as WorkflowNodeType]
        const outputs = (sourceNode.data?.outputs ?? definition?.defaultOutputs ?? []).map(
          (output: any) => ({
            name: output.name,
            description: output.description,
            placeholder: `{{nodes.${sourceNode.id}.${output.name}}}`,
          })
        )
        return {
          nodeId: sourceNode.id,
          nodeLabel: sourceNode.data?.label ?? definition?.label ?? sourceNode.type,
          outputs,
        }
      })

    sourcesByNode[node.id] = sources
  })

  return sourcesByNode
}

function buildPlaceholderGroups(
  nodes: Node[],
  availableSources: Record<string, WorkflowAvailableSource[]>
): Record<string, PlaceholderGroup[]> {
  const placeholdersByNode: Record<string, PlaceholderGroup[]> = {}

  nodes.forEach((node) => {
    const groups: PlaceholderGroup[] = [
      { ...CONTACT_PLACEHOLDERS, options: [...CONTACT_PLACEHOLDERS.options] },
      { ...CAMPAIGN_PLACEHOLDERS, options: [...CAMPAIGN_PLACEHOLDERS.options] },
      { ...SYSTEM_PLACEHOLDERS, options: [...SYSTEM_PLACEHOLDERS.options] },
    ]

    const inputs = (node.data?.inputs as WorkflowNodeInput[] | undefined)?.filter(
      (input) => input.name?.length
    )

    if (inputs?.length) {
      const sources = availableSources[node.id] ?? []
      const sourceById = new Map(sources.map((source) => [source.nodeId, source]))

      groups.push({
        id: "inputs",
        label: "Entradas mapeadas",
        options: inputs.map((input) => {
          const source = sourceById.get(input.sourceNodeId)
          return {
            id: `{{inputs.${input.name}}}`,
            label: input.name,
            description: source
              ? `${source.nodeLabel} • ${input.sourceOutput}`
              : `Origem: ${input.sourceOutput}`,
          }
        }),
      })
    }

    const sources = availableSources[node.id] ?? []
    if (sources.length) {
      groups.push({
        id: "previous",
        label: "Saídas de passos anteriores",
        options: sources.flatMap((source) =>
          source.outputs.map((output) => ({
            id: output.placeholder,
            label: `${source.nodeLabel} → ${output.name}`,
            description: output.description,
          }))
        ),
      })
    }

    placeholdersByNode[node.id] = groups
  })

  return placeholdersByNode
}

interface WorkflowNodeContextValue {
  readOnly: boolean
  getPlaceholders: (nodeId: string) => PlaceholderGroup[]
  getAvailableSources: (nodeId: string) => WorkflowAvailableSource[]
  handleInputsChange: (nodeId: string, inputs: WorkflowNodeInput[]) => void
  handleNodeConfigChange: (nodeId: string, config: Record<string, unknown>) => void
  handleExecuteNode: (nodeId: string) => void
  handleDuplicateNode: (nodeId: string) => void
  handleDeleteNode: (nodeId: string) => void
  handleToggleActive: (nodeId: string) => void
}

const WorkflowNodeContext = createContext<WorkflowNodeContextValue | null>(null)

function useWorkflowNodeContext(): WorkflowNodeContextValue {
  const context = useContext(WorkflowNodeContext)
  if (!context) {
    throw new Error("Workflow node context must be used within WorkflowNodeContext provider")
  }
  return context
}

type NodeActionConfig = {
  execute?: boolean
  duplicate?: boolean
  delete?: boolean
  toggleActive?: boolean
}

function mergeNodeData<T extends BaseNodeData>(
  props: NodeProps<T>,
  ctx: WorkflowNodeContextValue,
  actionConfig: NodeActionConfig,
  overrides: Partial<T> = {}
): T {
  const placeholders = ctx.getPlaceholders(props.id)
  const availableSources = ctx.getAvailableSources(props.id)

  const baseActions = props.data?.actions ?? {}
  let actions: NodeActionHandlers | undefined = baseActions

  if (!ctx.readOnly) {
    actions = {
      ...baseActions,
      onExecute: actionConfig.execute ? () => ctx.handleExecuteNode(props.id) : baseActions?.onExecute,
      onDuplicate: actionConfig.duplicate
        ? () => ctx.handleDuplicateNode(props.id)
        : baseActions?.onDuplicate,
      onDelete: actionConfig.delete ? () => ctx.handleDeleteNode(props.id) : baseActions?.onDelete,
      onToggleActive: actionConfig.toggleActive
        ? () => ctx.handleToggleActive(props.id)
        : baseActions?.onToggleActive,
    }
  }

  const data: T = {
    ...(props.data ?? {}),
    ...overrides,
    readOnly: ctx.readOnly,
    placeholders,
    availableSources,
    actions,
  }

  if (!ctx.readOnly) {
    data.onInputsChange = (next) => ctx.handleInputsChange(props.id, next)
  }

  return data
}

const TriggerStartNode = memo(function TriggerStartNodeRenderer(props: NodeProps<BaseNodeData>) {
  const ctx = useWorkflowNodeContext()
  const data = useMemo(
    () => mergeNodeData(props, ctx, { execute: true, duplicate: true, delete: true, toggleActive: true }),
    [ctx, props]
  )
  return <StartNode {...props} data={data} />
})

const TextMessageNodeComponent = memo(function TextMessageNodeRenderer(
  props: NodeProps<TextMessageNodeData>
) {
  const ctx = useWorkflowNodeContext()

  const data = useMemo(
    () =>
      mergeNodeData<TextMessageNodeData>(
        props,
        ctx,
        { execute: true, duplicate: true, delete: true, toggleActive: true },
        {
          onConfigChange: ctx.readOnly
            ? props.data?.onConfigChange
            : (patch) => ctx.handleNodeConfigChange(props.id, patch as Record<string, unknown>),
        }
      ),
    [ctx, props]
  )

  return <TextMessageNode {...props} data={data} />
})

const MediaMessageNodeComponent = memo(function MediaMessageNodeRenderer(
  props: NodeProps<MediaMessageNodeData>
) {
  const ctx = useWorkflowNodeContext()

  const data = useMemo(
    () =>
      mergeNodeData<MediaMessageNodeData>(
        props,
        ctx,
        { execute: true, duplicate: true, delete: true, toggleActive: true },
        {
          onConfigChange: ctx.readOnly
            ? props.data?.onConfigChange
            : (patch) => ctx.handleNodeConfigChange(props.id, patch as Record<string, unknown>),
        }
      ),
    [ctx, props]
  )

  return <MediaMessageNode {...props} data={data} />
})

const InteractiveMessageNodeComponent = memo(function InteractiveMessageNodeRenderer(
  props: NodeProps<InteractiveNodeData>
) {
  const ctx = useWorkflowNodeContext()

  const data = useMemo(
    () =>
      mergeNodeData<InteractiveNodeData>(
        props,
        ctx,
        { execute: true, duplicate: true, delete: true, toggleActive: true },
        {
          onConfigChange: ctx.readOnly
            ? props.data?.onConfigChange
            : (patch) => ctx.handleNodeConfigChange(props.id, patch as Record<string, unknown>),
        }
      ),
    [ctx, props]
  )

  return <InteractiveNode {...props} data={data} />
})

const DelayNodeComponent = memo(function DelayNodeRenderer(props: NodeProps<DelayNodeData>) {
  const ctx = useWorkflowNodeContext()

  const data = useMemo(
    () =>
      mergeNodeData<DelayNodeData>(
        props,
        ctx,
        { execute: true, duplicate: true, delete: true },
        {
          onConfigChange: ctx.readOnly
            ? props.data?.onConfigChange
            : (patch) => ctx.handleNodeConfigChange(props.id, patch as Record<string, unknown>),
        }
      ),
    [ctx, props]
  )

  return <DelayNode {...props} data={data} />
})

const HttpRequestNodeComponent = memo(function HttpRequestNodeRenderer(
  props: NodeProps<HttpRequestNodeData>
) {
  const ctx = useWorkflowNodeContext()

  const data = useMemo(
    () =>
      mergeNodeData<HttpRequestNodeData>(
        props,
        ctx,
        { execute: true, duplicate: true, delete: true },
        {
          onConfigChange: ctx.readOnly
            ? props.data?.onConfigChange
            : (patch) => ctx.handleNodeConfigChange(props.id, patch as Record<string, unknown>),
        }
      ),
    [ctx, props]
  )

  return <HttpRequestNode {...props} data={data} />
})

const EndNodeComponent = memo(function EndNodeRenderer(props: NodeProps<BaseNodeData>) {
  const ctx = useWorkflowNodeContext()
  const data = useMemo(
    () => mergeNodeData(props, ctx, { duplicate: true, delete: true }),
    [ctx, props]
  )
  return <EndNode {...props} data={data} />
})

const NODE_TYPES: NodeTypes = {
  "trigger.start": TriggerStartNode,
  "message.text": TextMessageNodeComponent,
  "message.media": MediaMessageNodeComponent,
  "message.interactive": InteractiveMessageNodeComponent,
  "control.delay": DelayNodeComponent,
  "integration.http": HttpRequestNodeComponent,
  "control.end": EndNodeComponent,
}

function WorkflowEditorInner({
  initialNodes = [],
  initialEdges = [],
  onChange,
  readOnly = false,
}: WorkflowEditorProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes.map(withNodeDefinition))
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setNodes((current) => {
      const next = initialNodes.map(withNodeDefinition)

      if (current.length === next.length) {
        const same = current.every((node, index) => node.id === next[index]?.id)
        if (same) {
          return current
        }
      }

      return next
    })
  }, [initialNodes, setNodes])

  useEffect(() => {
    setEdges((current) => {
      if (current.length === initialEdges.length) {
        const same = current.every((edge, index) => edge.id === initialEdges[index]?.id)
        if (same) {
          return current
        }
      }

      return initialEdges
    })
  }, [initialEdges, setEdges])

  const availableSourcesMap = useMemo(() => buildAvailableSources(nodes, edges), [nodes, edges])
  const placeholderMap = useMemo(
    () => buildPlaceholderGroups(nodes, availableSourcesMap),
    [nodes, availableSourcesMap]
  )

  const getPlaceholders = useCallback(
    (nodeId: string) => placeholderMap[nodeId] ?? [],
    [placeholderMap]
  )

  const getAvailableSources = useCallback(
    (nodeId: string) => availableSourcesMap[nodeId] ?? [],
    [availableSourcesMap]
  )

  const onConnectHandle = useCallback(
    (params: Connection) => {
      logger.debug("Workflow: connecting nodes", null, {
        component: "WorkflowEditor",
        action: "onConnect",
        metadata: { ...params },
      })
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges]
  )

  const onDragOver = useCallback((event: ReactDragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const handleNodeConfigChange = useCallback(
    (nodeId: string, nextConfig: Record<string, unknown>) => {
      if (readOnly) return

      setNodes((current) =>
        current.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  config: {
                    ...(node.data?.config ?? {}),
                    ...nextConfig,
                  },
                },
              }
            : node
        )
      )
    },
    [readOnly, setNodes]
  )

  const handleInputsChange = useCallback(
    (nodeId: string, inputs: WorkflowNodeInput[]) => {
      if (readOnly) return

      setNodes((current) =>
        current.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  inputs,
                },
              }
            : node
        )
      )
    },
    [readOnly, setNodes]
  )

  const handleToggleActive = useCallback(
    (nodeId: string) => {
      if (readOnly) return

      setNodes((current) =>
        current.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  active: !(node.data?.active ?? true),
                },
              }
            : node
        )
      )
    },
    [readOnly, setNodes]
  )

  const handleDuplicateNode = useCallback(
    (nodeId: string) => {
      if (readOnly) return

      setNodes((current) => {
        const node = current.find((item) => item.id === nodeId)
        if (!node) return current

        const duplicate: Node = {
          ...node,
          id: `${node.type}-${crypto.randomUUID()}`,
          position: {
            x: node.position.x + 64,
            y: node.position.y + 64,
          },
        }

        logger.debug("Workflow: node duplicated", null, {
          component: "WorkflowEditor",
          action: "duplicateNode",
          metadata: { nodeId, duplicateId: duplicate.id },
        })

        toast.success("Node duplicado")
        return [...current, duplicate]
      })
    },
    [readOnly, setNodes]
  )

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      if (readOnly) return

      setEdges((prev) => prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
      setNodes((prev) => prev.filter((node) => node.id !== nodeId))

      logger.info("Workflow: node removed", null, {
        component: "WorkflowEditor",
        action: "deleteNode",
        metadata: { nodeId },
      })

      toast.success("Node removido")
    },
    [readOnly, setEdges, setNodes]
  )

  const handleExecuteNode = useCallback((nodeId: string) => {
    logger.info("Workflow: execute node (preview)", null, {
      component: "WorkflowEditor",
      action: "executeNode",
      metadata: { nodeId },
    })
    toast.info("Execução simulada para pré-visualização")
  }, [])

  const onDrop = useCallback(
    (event: ReactDragEvent) => {
      event.preventDefault()
      if (!reactFlowInstance.current || !reactFlowWrapper.current || readOnly) return

      const type = event.dataTransfer.getData("application/workflow-node") as WorkflowNodeType
      if (!type) return

      const definition = NODE_DEFINITIONS[type]
      const bounds = reactFlowWrapper.current.getBoundingClientRect()
      const position = reactFlowInstance.current.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      })

      const nodeId = `${type}-${crypto.randomUUID()}`
      const newNode: Node = {
        id: nodeId,
        type,
        position,
        data: {
          label: definition.label,
          description: definition.description,
          icon: definition.icon,
          theme: definition.theme,
          active: true,
          config: definition.defaultConfig,
          outputs: definition.defaultOutputs ?? [],
          inputs: [],
        },
      }

      setNodes((nds) => nds.concat(newNode))

      logger.debug("Workflow: node dropped", null, {
        component: "WorkflowEditor",
        action: "onDrop",
        metadata: { nodeId, type },
      })
    },
    [readOnly, setNodes]
  )

  const handleAutoLayout = useCallback(() => {
    if (readOnly) return

    setNodes((current) => {
      if (!current.length) return current

      const spacingX = 360
      const spacingY = 220
      const levels = new Map<string, number>()
      const adjacency = new Map<string, string[]>()

      current.forEach((node) => adjacency.set(node.id, []))
      edges.forEach((edge) => adjacency.get(edge.source)?.push(edge.target))

      const startNodes = current.filter((node) => node.type === "trigger.start")
      const queue: string[] = []

      startNodes.forEach((node) => {
        levels.set(node.id, 0)
        queue.push(node.id)
      })

      while (queue.length) {
        const nodeId = queue.shift()!
        const baseLevel = levels.get(nodeId) ?? 0
        ;(adjacency.get(nodeId) ?? []).forEach((childId) => {
          if (!levels.has(childId)) {
            levels.set(childId, baseLevel + 1)
            queue.push(childId)
          }
        })
      }

      return current.map((node) => {
        const level = levels.get(node.id) ?? 0
        const siblings = current.filter((candidate) => (levels.get(candidate.id) ?? 0) === level)
        const index = siblings.findIndex((candidate) => candidate.id === node.id)

        return {
          ...node,
          position: {
            x: level * spacingX,
            y: index * spacingY,
          },
        }
      })
    })

    setTimeout(() => reactFlowInstance.current?.fitView({ padding: 0.2 }), 100)

    logger.debug("Workflow: auto layout applied", null, {
      component: "WorkflowEditor",
      action: "autoLayout",
    })

    toast.success("Workflow reorganizado")
  }, [edges, readOnly, setNodes])

  const handleSelectionChange = useCallback((params: { nodes: Node[] }) => {
    setSelectedNodeId(params.nodes[0]?.id ?? null)
  }, [])

  const handleDragStart = useCallback(
    (event: ReactDragEvent<HTMLButtonElement>, type: WorkflowNodeType) => {
      event.dataTransfer.setData("application/workflow-node", type)
      event.dataTransfer.effectAllowed = "move"
    },
    []
  )

  const handleKeyboard = useCallback(
    (event: KeyboardEvent) => {
      if (readOnly) return

      if ((event.key === "Delete" || event.key === "Backspace") && selectedNodeId) {
        event.preventDefault()
        handleDeleteNode(selectedNodeId)
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d" && selectedNodeId) {
        event.preventDefault()
        handleDuplicateNode(selectedNodeId)
      }
    },
    [handleDeleteNode, handleDuplicateNode, readOnly, selectedNodeId]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard)
    return () => document.removeEventListener("keydown", handleKeyboard)
  }, [handleKeyboard])

  useEffect(() => {
    if (!onChange || readOnly) return

    const workflow = sanitizeWorkflow(nodes, edges)
    onChange(workflow)
  }, [edges, nodes, onChange, readOnly])

  const contextValue = useMemo<WorkflowNodeContextValue>(
    () => ({
      readOnly,
      getPlaceholders,
      getAvailableSources,
      handleInputsChange,
      handleNodeConfigChange,
      handleExecuteNode,
      handleDuplicateNode,
      handleDeleteNode,
      handleToggleActive,
    }),
    [
      readOnly,
      getPlaceholders,
      getAvailableSources,
      handleInputsChange,
      handleNodeConfigChange,
      handleExecuteNode,
      handleDuplicateNode,
      handleDeleteNode,
      handleToggleActive,
    ]
  )

  return (
    <div className="flex h-full gap-4">
      {!readOnly && <WorkflowSidebar onDragStart={handleDragStart} />}
      <div className="flex h-full flex-1 flex-col rounded-3xl border border-white/[0.04] bg-[#090B11]">
        <div
          ref={reactFlowWrapper}
          className="relative flex-1 overflow-hidden rounded-3xl"
          style={{ minHeight: 600, width: "100%" }}
        >
          <WorkflowNodeContext.Provider value={contextValue}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={readOnly ? undefined : onNodesChange}
              onEdgesChange={readOnly ? undefined : onEdgesChange}
              onConnect={readOnly ? undefined : onConnectHandle}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
              onSelectionChange={handleSelectionChange}
              onInit={(instance) => (reactFlowInstance.current = instance)}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={NODE_TYPES}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              className="bg-[#0B0D13]"
            >
              <Background
                color={resolvedTheme === "light" ? "#CBD5F5" : "#1F2430"}
                gap={20}
                size={1}
              />
              <Controls
                className="rounded-full border border-white/10 bg-black/40 text-white"
                showFitView
              />
            </ReactFlow>
          </WorkflowNodeContext.Provider>
        </div>
        {!readOnly ? (
          <div className="flex items-center justify-between border-t border-white/5 px-6 py-4 text-xs text-white/70">
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleAutoLayout}>
                Organizar workflow
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => reactFlowInstance.current?.fitView({ padding: 0.2 })}
              >
                Centralizar
              </Button>
            </div>
            <div>
              {nodes.length} nodes • {edges.length} conexões
              {selectedNodeId ? ` • Node selecionado: ${selectedNodeId}` : ""}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function WorkflowEditor(props: WorkflowEditorProps) {
  return (
    <ReactFlowProvider>
      <WorkflowEditorInner {...props} />
    </ReactFlowProvider>
  )
}
