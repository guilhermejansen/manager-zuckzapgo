/**
 * Workflow Serialization Utilities
 *
 * Funções para converter entre formato do editor (ReactFlow) e formato do banco (WorkflowFormData)
 */

import type { Node, Edge } from "reactflow"
import type { WorkflowFormData } from "@/lib/validations"
import type { WorkflowNodeType } from "./definitions"

/**
 * Serializa nodes e edges do ReactFlow para o formato do banco
 */
export function serializeWorkflow(
  nodes: Node[],
  edges: Edge[]
): WorkflowFormData {
  return {
    metadata: {
      version: "1.0.0",
      createdAt: new Date().toISOString(),
    },
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type as WorkflowNodeType,
      position: {
        x: Math.round(node.position.x),
        y: Math.round(node.position.y),
      },
      data: {
        label: node.data.label ?? node.type,
        active: node.data.active ?? true,
        config: node.data.config ?? {},
        inputs: node.data.inputs ?? [],
        outputs: node.data.outputs ?? [],
      },
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle ?? undefined,
      targetHandle: edge.targetHandle ?? undefined,
      type: edge.type,
      animated: edge.animated ?? false,
    })),
  }
}

/**
 * Deserializa workflow do banco para o formato do ReactFlow
 */
export function deserializeWorkflow(workflow: WorkflowFormData): {
  nodes: Node[]
  edges: Edge[]
} {
  return {
    nodes: workflow.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        label: node.data.label,
        active: node.data.active ?? true,
        config: node.data.config ?? {},
        inputs: node.data.inputs ?? [],
        outputs: node.data.outputs ?? [],
      },
      // Dimensões padrão para evitar SSR issues
      width: 320,
      height: node.type.includes("delay") ? 120 : node.type.includes("end") || node.type.includes("start") ? 100 : 180,
    })),
    edges: workflow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
      type: edge.type ?? "default",
      animated: edge.animated ?? false,
    })),
  }
}

/**
 * Valida estrutura básica do workflow
 */
export function validateWorkflowStructure(workflow: WorkflowFormData): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Validar nodes
  if (!workflow.nodes || workflow.nodes.length === 0) {
    errors.push("Workflow não pode estar vazio")
    return { valid: false, errors }
  }

  // Deve ter pelo menos um node de início
  const startNodes = workflow.nodes.filter((n) => n.type === "trigger.start")
  if (startNodes.length === 0) {
    errors.push("Workflow precisa ter um node de início (trigger.start)")
  }
  if (startNodes.length > 1) {
    errors.push("Workflow pode ter apenas um node de início")
  }

  // Deve ter pelo menos um node de fim
  const endNodes = workflow.nodes.filter((n) => n.type === "control.end")
  if (endNodes.length === 0) {
    errors.push("Workflow precisa ter pelo menos um node de fim (control.end)")
  }

  // Validar conectividade (todos os nodes exceto start e end devem estar conectados)
  const connectedNodeIds = new Set<string>()
  workflow.edges.forEach((edge) => {
    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  })

  const disconnectedNodes = workflow.nodes.filter(
    (node) => !connectedNodeIds.has(node.id) &&
             node.type !== "trigger.start" &&
             node.type !== "control.end"
  )

  if (disconnectedNodes.length > 0) {
    errors.push(
      `Nodes desconectados: ${disconnectedNodes.map((n) => n.data.label || n.id).join(", ")}`
    )
  }

  // Validar que start node tem saída
  const startNode = startNodes[0]
  if (startNode) {
    const hasOutput = workflow.edges.some((edge) => edge.source === startNode.id)
    if (!hasOutput) {
      errors.push("Node de início precisa estar conectado a outro node")
    }
  }

  // Validar que end nodes têm entrada
  endNodes.forEach((endNode) => {
    const hasInput = workflow.edges.some((edge) => edge.target === endNode.id)
    if (!hasInput) {
      errors.push(`Node de fim "${endNode.data.label || endNode.id}" precisa receber uma conexão`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Exporta workflow como JSON string
 */
export function exportWorkflowJSON(workflow: WorkflowFormData): string {
  return JSON.stringify(workflow, null, 2)
}

/**
 * Importa workflow de JSON string
 */
export function importWorkflowJSON(json: string): {
  success: boolean
  workflow?: WorkflowFormData
  error?: string
} {
  try {
    const parsed = JSON.parse(json)

    // Validar estrutura básica
    if (!parsed.metadata || !parsed.nodes || !parsed.edges) {
      return {
        success: false,
        error: "JSON inválido: faltam campos obrigatórios (metadata, nodes, edges)",
      }
    }

    // Validar que é um array
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return {
        success: false,
        error: "JSON inválido: nodes e edges devem ser arrays",
      }
    }

    const workflow: WorkflowFormData = parsed

    // Validar estrutura
    const validation = validateWorkflowStructure(workflow)
    if (!validation.valid) {
      return {
        success: false,
        error: `Workflow inválido: ${validation.errors.join(", ")}`,
      }
    }

    return {
      success: true,
      workflow,
    }
  } catch (error) {
    return {
      success: false,
      error: `Erro ao parsear JSON: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    }
  }
}
