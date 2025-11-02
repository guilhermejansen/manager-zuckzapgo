import {
  WORKFLOW_NODE_DEFINITIONS,
  type DelayNodeConfig,
  type HttpRequestNodeConfig,
  type InteractiveNodeConfig,
  type MediaMessageNodeConfig,
  type TextMessageNodeConfig,
  type WorkflowNodeDefinition,
  type WorkflowNodeType,
} from "./definitions"
import { workflowSchema, type WorkflowFormData } from "@/lib/validations"

interface WorkflowNodeData {
  id: string
  type: WorkflowNodeType
  position: { x: number; y: number }
  data?: {
    label?: string
    config?: Record<string, any>
    inputs?: Array<{
      name: string
      sourceNodeId: string
      sourceOutput: string
    }>
  }
}

interface WorkflowEdge {
  id: string
  source: string
  target: string
}

export interface CampaignRuntimeMeta {
  id: string
  name: string
  type: string
  timezone?: string | null
}

export interface ContactRuntimeData {
  jid: string
  name?: string | null
  pushName?: string | null
  type?: string | null
  custom?: Record<string, unknown>
}

export interface WorkflowExecutionContext {
  batchIndex: number
  totalContacts: number
}

export type MessageKind = "TEXT" | "MEDIA" | "INTERACTIVE"

export interface SendMessagePayload {
  nodeId: string
  kind: MessageKind
  payload: Record<string, any>
  config: Record<string, any>
}

export type SendMessageHandler = (payload: SendMessagePayload) => Promise<any>

export interface RunWorkflowOptions {
  workflow: WorkflowFormData
  campaign: CampaignRuntimeMeta
  contact: ContactRuntimeData
  context: WorkflowExecutionContext
  sendMessage: SendMessageHandler
  delay: (ms: number) => Promise<void>
  logger?: (entry: WorkflowLogEntry) => void
}

export interface WorkflowLogEntry {
  nodeId: string
  type: WorkflowNodeType
  message: string
  metadata?: Record<string, any>
}

export interface RunWorkflowResult {
  messagesSent: number
  nodeOutputs: Record<string, Record<string, any>>
}

interface PlaceholderContext {
  contact: Record<string, any>
  campaign: CampaignRuntimeMeta
  context: {
    timestamp: string
    batchIndex: number
    totalContacts: number
  }
  inputs: Record<string, any>
  nodes: Record<string, Record<string, any>>
}

function normalizeContact(contact: ContactRuntimeData): Record<string, any> {
  const jidParts = contact.jid.split("@")
  const phone = jidParts[0]
  return {
    jid: contact.jid,
    name: contact.name ?? undefined,
    pushName: contact.pushName ?? undefined,
    type: contact.type ?? undefined,
    phone,
    custom: contact.custom ?? {},
  }
}

function deepGet(target: any, path: string[]): any {
  return path.reduce((acc, key) => {
    if (acc == null) return undefined
    if (Array.isArray(acc)) {
      const index = Number(key)
      return Number.isNaN(index) ? undefined : acc[index]
    }
    return (acc as Record<string, any>)[key]
  }, target)
}

function resolvePlaceholder(expression: string, context: PlaceholderContext): any {
  const segments = expression.split(".").map((part) => part.trim()).filter(Boolean)
  if (segments.length === 0) return ""
  const [head, ...rest] = segments

  switch (head) {
    case "contact":
      return deepGet(context.contact, rest)
    case "campaign":
      return deepGet(context.campaign, rest)
    case "context":
      return deepGet(context.context, rest)
    case "inputs":
      return deepGet(context.inputs, rest)
    case "nodes": {
      const [nodeId, ...nodeRest] = rest
      if (!nodeId) return ""
      return deepGet(context.nodes[nodeId], nodeRest)
    }
    default:
      return ""
  }
}

function renderTemplateString(template: string, context: PlaceholderContext): string {
  if (!template.includes("{{")) {
    return template
  }

  return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, expr: string) => {
    const value = resolvePlaceholder(expr.trim(), context)
    if (value === undefined || value === null) {
      return ""
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value)
      } catch (error) {
        return ""
      }
    }
    return String(value)
  })
}

function buildAdjacency(edges: WorkflowEdge[]): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>()
  edges.forEach((edge) => {
    if (!adjacency.has(edge.source)) {
      adjacency.set(edge.source, new Set())
    }
    adjacency.get(edge.source)!.add(edge.target)
  })
  return adjacency
}

function getReachableNodeIds(adjacency: Map<string, Set<string>>, startIds: string[]): Set<string> {
  const reachable = new Set<string>()
  const queue = [...startIds]

  while (queue.length) {
    const nodeId = queue.shift()!
    if (reachable.has(nodeId)) continue
    reachable.add(nodeId)
    const neighbors = adjacency.get(nodeId)
    if (!neighbors) continue
    neighbors.forEach((next) => {
      if (!reachable.has(next)) queue.push(next)
    })
  }

  return reachable
}

function getExecutionOrder(workflow: WorkflowFormData): WorkflowNodeData[] {
  const nodes = workflow.nodes as WorkflowNodeData[]
  const edges = workflow.edges as WorkflowEdge[]
  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  const adjacency = buildAdjacency(edges)
  const startNodes = nodes.filter((node) => node.type === "trigger.start").map((node) => node.id)

  if (startNodes.length === 0) {
    throw new Error("Workflow precisa de pelo menos um node de início")
  }

  const reachable = getReachableNodeIds(adjacency, startNodes)
  const inDegree = new Map<string, number>()

  reachable.forEach((nodeId) => inDegree.set(nodeId, 0))
  edges.forEach((edge) => {
    if (reachable.has(edge.source) && reachable.has(edge.target)) {
      inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1)
    }
  })

  const queue: string[] = []
  reachable.forEach((nodeId) => {
    if ((inDegree.get(nodeId) ?? 0) === 0) {
      queue.push(nodeId)
    }
  })

  const order: WorkflowNodeData[] = []

  while (queue.length) {
    const nodeId = queue.shift()!
    const node = nodesById.get(nodeId)
    if (node) {
      order.push(node)
    }
    const neighbors = adjacency.get(nodeId)
    if (!neighbors) continue
    neighbors.forEach((next) => {
      if (!reachable.has(next)) return
      const nextDegree = (inDegree.get(next) ?? 0) - 1
      inDegree.set(next, nextDegree)
      if (nextDegree === 0) {
        queue.push(next)
      }
    })
  }

  return order
}

function buildInputs(node: WorkflowNodeData, outputs: Record<string, Record<string, any>>) {
  const mappings = (node.data?.inputs ?? []) as Array<{
    name: string
    sourceNodeId: string
    sourceOutput: string
  }>
  const result: Record<string, any> = {}

  mappings.forEach((mapping) => {
    if (!mapping.name) return
    const sourceOutputs = outputs[mapping.sourceNodeId]
    if (!sourceOutputs) return
    if (Object.prototype.hasOwnProperty.call(sourceOutputs, mapping.sourceOutput)) {
      result[mapping.name] = sourceOutputs[mapping.sourceOutput]
    }
  })

  return result
}

function resolveConfig<T>(definition: WorkflowNodeDefinition<T>, node: WorkflowNodeData): T {
  const baseConfig = definition.defaultConfig ?? ({} as T)
  const nodeConfig = (node.data?.config ?? {}) as Partial<T>
  return {
    ...baseConfig,
    ...nodeConfig,
  }
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function executeTextNode(
  node: WorkflowNodeData,
  config: TextMessageNodeConfig,
  options: RunWorkflowOptions,
  context: PlaceholderContext,
  nodeOutputs: Record<string, Record<string, any>>
): Promise<void> {
  const message = renderTemplateString(config.message, context)

  if (config.presenceSimulation && config.presenceSimulation > 0) {
    await options.delay(config.presenceSimulation)
  }

  if (config.delayMs && config.delayMs > 0) {
    await options.delay(config.delayMs)
  }

  const payload = {
    text: message,
    linkPreview: config.linkPreview,
  }

  const sendResult = await options.sendMessage({
    nodeId: node.id,
    kind: "TEXT",
    payload,
    config,
  })

  nodeOutputs[node.id] = {
    message,
    sendResult,
    config,
  }
}

async function executeMediaNode(
  node: WorkflowNodeData,
  config: MediaMessageNodeConfig,
  options: RunWorkflowOptions,
  context: PlaceholderContext,
  nodeOutputs: Record<string, Record<string, any>>
): Promise<void> {
  const mediaUrl = renderTemplateString(config.mediaUrl, context)
  const caption = config.caption ? renderTemplateString(config.caption, context) : ""

  if (config.delayMs && config.delayMs > 0) {
    await options.delay(config.delayMs)
  }

  const payload = {
    mediaType: config.mediaType,
    url: mediaUrl,
    caption,
  }

  const sendResult = await options.sendMessage({
    nodeId: node.id,
    kind: "MEDIA",
    payload,
    config,
  })

  nodeOutputs[node.id] = {
    mediaUrl,
    caption,
    sendResult,
    config,
  }
}

async function executeInteractiveNode(
  node: WorkflowNodeData,
  config: InteractiveNodeConfig,
  options: RunWorkflowOptions,
  context: PlaceholderContext,
  nodeOutputs: Record<string, Record<string, any>>
): Promise<void> {
  const text = renderTemplateString(config.text, context)

  if (config.delayMs && config.delayMs > 0) {
    await options.delay(config.delayMs)
  }

  if (config.interactiveType === "buttons") {
    const buttons = (config.buttons ?? []).map((button, index) => ({
      id: button.id || `btn_${index}`,
      text: renderTemplateString(button.label, context),
      value: renderTemplateString(button.value, context),
    }))

    const sendResult = await options.sendMessage({
      nodeId: node.id,
      kind: "INTERACTIVE",
      payload: {
        mode: "buttons",
        text,
        buttons,
      },
      config,
    })

    nodeOutputs[node.id] = {
      text,
      buttons,
      sendResult,
      config,
    }
    return
  }

  const rows = (config.buttons ?? []).map((button, index) => ({
    id: button.id || `row_${index}`,
    title: renderTemplateString(button.label, context),
    description: renderTemplateString(button.value, context),
  }))

  const sendResult = await options.sendMessage({
    nodeId: node.id,
    kind: "INTERACTIVE",
    payload: {
      mode: "list",
      text,
      buttonText: config.listButtonText,
      sections: [
        {
          title: "Opções",
          rows,
        },
      ],
    },
    config,
  })

  nodeOutputs[node.id] = {
    text,
    rows,
    sendResult,
    config,
  }
}

async function executeDelayNode(
  node: WorkflowNodeData,
  config: DelayNodeConfig,
  options: RunWorkflowOptions,
  nodeOutputs: Record<string, Record<string, any>>
) {
  const jitter = config.jitterMs ? randomBetween(0, config.jitterMs) : 0
  const duration = Math.max(config.durationMs + jitter, 0)
  if (duration > 0) {
    await options.delay(duration)
  }
  nodeOutputs[node.id] = {
    durationMs: config.durationMs,
    jitterMs: config.jitterMs,
    appliedDelayMs: duration,
  }
}

async function executeHttpNode(
  node: WorkflowNodeData,
  config: HttpRequestNodeConfig,
  context: PlaceholderContext,
  nodeOutputs: Record<string, Record<string, any>>
) {
  const url = renderTemplateString(config.url, context)
  const queryParams = (config.queryParams ?? [])
    .filter((row) => row.enabled !== false)
    .map((row) => ({
      name: renderTemplateString(row.name, context),
      value: renderTemplateString(row.value, context),
    }))

  const headers = (config.headers ?? [])
    .filter((row) => row.enabled !== false)
    .reduce<Record<string, string>>((acc, row) => {
      const key = renderTemplateString(row.name, context)
      const value = renderTemplateString(row.value, context)
      if (key) {
        acc[key] = value
      }
      return acc
    }, {})

  const urlObj = new URL(url)
  queryParams.forEach((param) => {
    if (param.name) {
      urlObj.searchParams.set(param.name, param.value)
    }
  })

  let body: any = undefined
  let contentType: string | undefined

  if (config.bodyEnabled && config.body) {
    const renderedBody = renderTemplateString(config.body, context)
    if (config.bodyContentType === "json") {
      try {
        body = JSON.parse(renderedBody)
        contentType = "application/json"
      } catch {
        body = renderedBody
        contentType = "application/json"
      }
    } else if (config.bodyContentType === "formData") {
      const params = new URLSearchParams(renderedBody)
      body = params.toString()
      contentType = "application/x-www-form-urlencoded"
    } else {
      body = renderedBody
      contentType = "text/plain"
    }
  }

  if (contentType && !headers["Content-Type"]) {
    headers["Content-Type"] = contentType
  }

  const response = await fetch(urlObj.toString(), {
    method: config.method || "GET",
    headers,
    body: body && typeof body !== "string" ? JSON.stringify(body) : body,
  })

  const responseHeaders = Object.fromEntries(response.headers.entries())
  const rawBody = await response.text()
  let parsedBody: any = rawBody
  try {
    parsedBody = rawBody ? JSON.parse(rawBody) : null
  } catch {
    parsedBody = rawBody
  }

  if (!response.ok) {
    throw new Error(
      `HTTP node ${node.id} returned status ${response.status}: ${
        typeof parsedBody === "string" ? parsedBody : JSON.stringify(parsedBody)
      }`
    )
  }

  nodeOutputs[node.id] = {
    status: response.status,
    ok: response.ok,
    headers: responseHeaders,
    body: parsedBody,
  }
}

export async function runWorkflow(options: RunWorkflowOptions): Promise<RunWorkflowResult> {
  const { workflow, campaign, contact, context, logger } = options
  const parsedWorkflow = workflowSchema.parse(workflow)
  const order = getExecutionOrder(parsedWorkflow)
  const nodeOutputs: Record<string, Record<string, any>> = {}
  const normalizedContact = normalizeContact(contact)
  let messagesSent = 0

  for (const node of order) {
    const definition = WORKFLOW_NODE_DEFINITIONS[node.type as WorkflowNodeType]
    if (!definition) {
      logger?.({
        nodeId: node.id,
        type: node.type as WorkflowNodeType,
        message: "Node definition not found",
      })
      continue
    }

    const inputs = buildInputs(node, nodeOutputs)
    const placeholderContext: PlaceholderContext = {
      contact: normalizedContact,
      campaign,
      context: {
        timestamp: new Date().toISOString(),
        batchIndex: context.batchIndex,
        totalContacts: context.totalContacts,
      },
      inputs,
      nodes: nodeOutputs,
    }

    logger?.({
      nodeId: node.id,
      type: node.type as WorkflowNodeType,
      message: "Executing node",
      metadata: { inputs },
    })

    switch (node.type) {
      case "trigger.start": {
        nodeOutputs[node.id] = {
          trigger: {
            contact: normalizedContact,
            campaign,
            context: placeholderContext.context,
          },
        }
        break
      }
      case "message.text": {
        const config = resolveConfig<TextMessageNodeConfig>(definition, node)
        await executeTextNode(node, config, options, placeholderContext, nodeOutputs)
        messagesSent += 1
        break
      }
      case "message.media": {
        const config = resolveConfig<MediaMessageNodeConfig>(definition, node)
        await executeMediaNode(node, config, options, placeholderContext, nodeOutputs)
        messagesSent += 1
        break
      }
      case "message.interactive": {
        const config = resolveConfig<InteractiveNodeConfig>(definition, node)
        await executeInteractiveNode(node, config, options, placeholderContext, nodeOutputs)
        messagesSent += 1
        break
      }
      case "control.delay": {
        const config = resolveConfig<DelayNodeConfig>(definition, node)
        await executeDelayNode(node, config, options, nodeOutputs)
        break
      }
      case "integration.http": {
        const config = resolveConfig<HttpRequestNodeConfig>(definition, node)
        await executeHttpNode(node, config, placeholderContext, nodeOutputs)
        break
      }
      case "control.end": {
        nodeOutputs[node.id] = { completed: true }
        break
      }
      default: {
        logger?.({
          nodeId: node.id,
          type: node.type as WorkflowNodeType,
          message: "Node type not handled",
        })
      }
    }
  }

  return {
    messagesSent,
    nodeOutputs,
  }
}

export function countMessageNodes(workflow: WorkflowFormData): number {
  const parsedWorkflow = workflowSchema.parse(workflow)
  const adjacency = buildAdjacency(parsedWorkflow.edges as WorkflowEdge[])
  const startNodes = parsedWorkflow.nodes.filter((node) => node.type === "trigger.start").map((node) => node.id)
  const reachable = getReachableNodeIds(adjacency, startNodes)
  return parsedWorkflow.nodes.filter(
    (node) => reachable.has(node.id) && node.type.startsWith("message.")
  ).length
}
