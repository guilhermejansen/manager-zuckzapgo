export type WorkflowNodeType =
  | "trigger.start"
  | "message.text"
  | "message.media"
  | "message.interactive"
  | "control.delay"
  | "integration.http"
  | "control.end"

export type WorkflowNodeGroup = "Triggers" | "Mensagens" | "Controle" | "Integrações"

export interface WorkflowNodeOutputDefinition {
  name: string
  description?: string
}

export interface WorkflowNodeDefinition<TConfig = any> {
  type: WorkflowNodeType
  label: string
  description: string
  group: WorkflowNodeGroup
  defaultConfig: TConfig
  defaultOutputs?: WorkflowNodeOutputDefinition[]
  allowInput?: boolean
  allowOutput?: boolean
}

export interface TextMessageNodeConfig {
  message: string
  delayMs: number
  linkPreview: boolean
  presenceSimulation: number
}

export interface MediaMessageNodeConfig {
  mediaType: "image" | "video" | "audio" | "document"
  mediaUrl: string
  caption: string
  delayMs: number
}

export interface InteractiveNodeConfig {
  interactiveType: "buttons" | "list"
  text: string
  buttons: Array<{ id: string; label: string; value: string }>
  listButtonText: string
  delayMs: number
}

export interface DelayNodeConfig {
  durationMs: number
  jitterMs: number
}

export interface HttpRequestNodeConfig {
  method: string
  url: string
  auth: "none" | "basic" | "bearer" | "apiKey"
  queryParams: Array<{ id?: string; name: string; value: string; enabled: boolean }>
  headers: Array<{ id?: string; name: string; value: string; enabled: boolean }>
  bodyEnabled: boolean
  bodyContentType: "json" | "text" | "formData"
  body: string
}

export type WorkflowNodeDefinitions = Record<WorkflowNodeType, WorkflowNodeDefinition<any>>

export const WORKFLOW_NODE_DEFINITIONS: WorkflowNodeDefinitions = {
  "trigger.start": {
    type: "trigger.start",
    label: "Início",
    description: "Ponto de partida da campanha",
    group: "Triggers",
    defaultConfig: {},
    allowInput: false,
    defaultOutputs: [{ name: "trigger", description: "Dados de contexto inicial" }],
  },
  "message.text": {
    type: "message.text",
    label: "Mensagem de Texto",
    description: "Enviar texto com placeholders",
    group: "Mensagens",
    defaultConfig: {
      message: "Olá {{contact.name}}!",
      delayMs: 0,
      linkPreview: false,
      presenceSimulation: 0,
    } satisfies TextMessageNodeConfig,
    defaultOutputs: [{ name: "message" }, { name: "sendResult" }],
  },
  "message.media": {
    type: "message.media",
    label: "Mensagem de Mídia",
    description: "Envio de imagem, vídeo, documento",
    group: "Mensagens",
    defaultConfig: {
      mediaType: "image",
      mediaUrl: "",
      caption: "",
      delayMs: 0,
    } satisfies MediaMessageNodeConfig,
    defaultOutputs: [{ name: "sendResult" }],
  },
  "message.interactive": {
    type: "message.interactive",
    label: "Mensagem Interativa",
    description: "Botões ou listas para respostas",
    group: "Mensagens",
    defaultConfig: {
      interactiveType: "buttons",
      text: "Escolha uma opção",
      buttons: [],
      listButtonText: "Ver opções",
      delayMs: 0,
    } satisfies InteractiveNodeConfig,
    defaultOutputs: [{ name: "response" }, { name: "sendResult" }],
  },
  "control.delay": {
    type: "control.delay",
    label: "Delay",
    description: "Aguardar antes do próximo passo",
    group: "Controle",
    defaultConfig: {
      durationMs: 1000,
      jitterMs: 0,
    } satisfies DelayNodeConfig,
  },
  "integration.http": {
    type: "integration.http",
    label: "HTTP Request",
    description: "Chamada HTTP externa",
    group: "Integrações",
    defaultConfig: {
      method: "GET",
      url: "https://api.example.com",
      auth: "none",
      queryParams: [],
      headers: [],
      bodyEnabled: false,
      bodyContentType: "json",
      body: "",
    } satisfies HttpRequestNodeConfig,
    defaultOutputs: [{ name: "response" }, { name: "status" }],
  },
  "control.end": {
    type: "control.end",
    label: "Fim",
    description: "Conclusão da campanha",
    group: "Controle",
    defaultConfig: {},
    allowOutput: false,
  },
}
