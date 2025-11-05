"use client"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { Node, Edge } from "reactflow"

interface WorkflowContextType {
  nodes: Node[]
  edges: Edge[]
  updateNode: (nodeId: string, updates: any) => void
  addNode: (node: Node) => void
  removeNode: (nodeId: string) => void
  duplicateNode: (nodeId: string) => void
  updateEdge: (edgeId: string, updates: any) => void
}

const WorkflowContext = createContext<WorkflowContextType | null>(null)

export function WorkflowProvider({
  children,
  initialNodes,
  initialEdges,
  onChange,
  // Controlled mode: usa nodes/edges externos ao invés de estado interno
  nodes: controlledNodes,
  edges: controlledEdges,
  onNodesChange: externalOnNodesChange,
  onEdgesChange: externalOnEdgesChange,
}: {
  children: React.ReactNode
  initialNodes?: Node[]
  initialEdges?: Edge[]
  onChange?: (data: { nodes: Node[]; edges: Edge[] }) => void
  // Props para modo controlled (usado pelo workflow-editor)
  nodes?: Node[]
  edges?: Edge[]
  onNodesChange?: (nodes: Node[]) => void
  onEdgesChange?: (edges: Edge[]) => void
}) {
  // Modo controlled: usa props, Modo uncontrolled: usa estado interno
  const isControlled = controlledNodes !== undefined

  const [internalNodes, setInternalNodes] = useState(initialNodes ?? [])
  const [internalEdges, setInternalEdges] = useState(initialEdges ?? [])

  const nodes = isControlled ? controlledNodes : internalNodes
  const edges = isControlled ? (controlledEdges ?? []) : internalEdges

  // Notifica pai com debounce de 500ms (apenas modo uncontrolled)
  useEffect(() => {
    if (isControlled) return

    const timer = setTimeout(() => {
      onChange?.({ nodes: internalNodes, edges: internalEdges })
    }, 500)
    return () => clearTimeout(timer)
  }, [internalNodes, internalEdges, onChange, isControlled])

  const updateNode = useCallback((nodeId: string, updates: any) => {
    if (isControlled && externalOnNodesChange) {
      // Modo controlled: chama callback externo
      const updatedNodes = nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
      externalOnNodesChange(updatedNodes)
    } else {
      // Modo uncontrolled: atualiza estado interno
      setInternalNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updates } }
            : node
        )
      )
    }
  }, [isControlled, externalOnNodesChange, nodes])

  const addNode = useCallback((node: Node) => {
    if (isControlled && externalOnNodesChange) {
      externalOnNodesChange([...nodes, node])
    } else {
      setInternalNodes((prev) => [...prev, node])
    }
  }, [isControlled, externalOnNodesChange, nodes])

  const removeNode = useCallback((nodeId: string) => {
    if (isControlled && externalOnNodesChange && externalOnEdgesChange) {
      externalOnNodesChange(nodes.filter((n) => n.id !== nodeId))
      externalOnEdgesChange(edges.filter((e) => e.source !== nodeId && e.target !== nodeId))
    } else {
      setInternalNodes((prev) => prev.filter((n) => n.id !== nodeId))
      setInternalEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId))
    }
  }, [isControlled, externalOnNodesChange, externalOnEdgesChange, nodes, edges])

  const duplicateNode = useCallback((nodeId: string) => {
    const nodeToDuplicate = nodes.find((n) => n.id === nodeId)
    if (!nodeToDuplicate) return

    const newNode = {
      ...nodeToDuplicate,
      id: `${nodeId}-copy-${Date.now()}`,
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      },
      selected: false,
    }

    if (isControlled && externalOnNodesChange) {
      externalOnNodesChange([...nodes, newNode])
    } else {
      setInternalNodes((prev) => [...prev, newNode])
    }
  }, [isControlled, externalOnNodesChange, nodes])

  const updateEdge = useCallback((edgeId: string, updates: any) => {
    if (isControlled && externalOnEdgesChange) {
      const updatedEdges = edges.map((edge) =>
        edge.id === edgeId ? { ...edge, ...updates } : edge
      )
      externalOnEdgesChange(updatedEdges)
    } else {
      setInternalEdges((prevEdges) =>
        prevEdges.map((edge) =>
          edge.id === edgeId ? { ...edge, ...updates } : edge
        )
      )
    }
  }, [isControlled, externalOnEdgesChange, edges])

  return (
    <WorkflowContext.Provider
      value={{
        nodes,
        edges,
        updateNode,
        addNode,
        removeNode,
        duplicateNode,
        updateEdge
      }}
    >
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error("useWorkflow must be used within WorkflowProvider")
  }
  return context
}
