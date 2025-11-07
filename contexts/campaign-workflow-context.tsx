"use client"

import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react"

import {
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  useEdgesState,
  useNodesState,
} from "reactflow"

import { generateDeterministicId } from "@/lib/id-generator"

type NodeUpdates = Record<string, unknown>

type NodeUpdateInput = NodeUpdates | ((currentData: Node["data"] | undefined) => NodeUpdates)

interface WorkflowContextType {
  nodes: Node[]
  edges: Edge[]
  setNodes: Dispatch<SetStateAction<Node[]>>
  setEdges: Dispatch<SetStateAction<Edge[]>>
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  updateNode: (nodeId: string, updates: NodeUpdateInput) => void
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  duplicateNode: (nodeId: string) => void
  updateEdge: (edgeId: string, updates: NodeUpdates) => void
}

const WorkflowContext = createContext<WorkflowContextType | null>(null)

function sanitizeNodeData(data: Node["data"]) {
  if (!data || typeof data !== "object") return data
  const {
    actions: _actions,
    onConfigChange: _onConfigChange,
    onInputsChange: _onInputsChange,
    ...rest
  } = data as Record<string, unknown>
  return { ...rest }
}

export function WorkflowProvider({
  children,
  initialNodes = [],
  initialEdges = [],
  onChange,
}: {
  children: ReactNode
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onChange?: (data: { nodes: Node[]; edges: Edge[] }) => void
}) {
  const [nodes, setNodes, handleNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, handleEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    if (!onChange) return

    const timer = setTimeout(() => onChange({ nodes, edges }), 400)
    return () => clearTimeout(timer)
  }, [nodes, edges, onChange])

  const updateNode = useCallback(
    (nodeId: string, updates: NodeUpdateInput) => {
      setNodes((prev) =>
        prev.map((node) => {
          if (node.id !== nodeId) return node

          const previousData = node.data ?? {}
          const resolvedUpdates = typeof updates === "function" ? updates(previousData) : updates

          return {
            ...node,
            data: sanitizeNodeData({
              ...previousData,
              ...resolvedUpdates,
            }),
          }
        })
      )
    },
    [setNodes]
  )

  const addNode = useCallback(
    (node: Node) => {
      setNodes((prev) => [...prev, { ...node, data: sanitizeNodeData(node.data) }])
    },
    [setNodes]
  )

  const removeNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => prev.filter((node) => node.id !== nodeId))
      setEdges((prev) => prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    },
    [setNodes, setEdges]
  )

  const duplicateNode = useCallback(
    (nodeId: string) => {
      setNodes((prev) => {
        const nodeToDuplicate = prev.find((node) => node.id === nodeId)
        if (!nodeToDuplicate) {
          return prev
        }

        const newNodeId = generateDeterministicId("node")
        const clonedNode: Node = {
          ...nodeToDuplicate,
          id: newNodeId,
          data: sanitizeNodeData(nodeToDuplicate.data),
          position: {
            x: nodeToDuplicate.position.x + 50,
            y: nodeToDuplicate.position.y + 50,
          },
          selected: false,
        }

        return [...prev, clonedNode]
      })
    },
    [setNodes]
  )

  const updateEdge = useCallback(
    (edgeId: string, updates: NodeUpdates) => {
      setEdges((prev) => prev.map((edge) => (edge.id === edgeId ? { ...edge, ...updates } : edge)))
    },
    [setEdges]
  )

  const value: WorkflowContextType = {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange: handleNodesChange,
    onEdgesChange: handleEdgesChange,
    updateNode,
    addNode,
    removeNode,
    duplicateNode,
    updateEdge,
  }

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider")
  }
  return context
}
