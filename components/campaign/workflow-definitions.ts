import { Activity, Clock4, MessageSquareText, Send, Share2, Webhook, Workflow } from "lucide-react"

import {
  type DelayNodeConfig,
  type HttpRequestNodeConfig,
  type InteractiveNodeConfig,
  type MediaMessageNodeConfig,
  type TextMessageNodeConfig,
  WORKFLOW_NODE_DEFINITIONS,
  type WorkflowNodeDefinition,
  type WorkflowNodeGroup,
  type WorkflowNodeType,
} from "@/lib/workflow/definitions"

export interface ClientWorkflowNodeDefinition<TConfig = any>
  extends WorkflowNodeDefinition<TConfig> {
  icon: any
  theme: {
    border: string
    background: string
    accent: string
  }
}

export const NODE_DEFINITIONS: Record<WorkflowNodeType, ClientWorkflowNodeDefinition> = {
  "trigger.start": {
    ...WORKFLOW_NODE_DEFINITIONS["trigger.start"],
    icon: Workflow,
    theme: {
      border: "from-green-400 to-green-600",
      background: "bg-gradient-to-br from-green-900/40 to-green-800/30",
      accent: "bg-green-500/30",
    },
  },
  "message.text": {
    ...WORKFLOW_NODE_DEFINITIONS["message.text"],
    icon: MessageSquareText,
    theme: {
      border: "from-blue-400 to-blue-600",
      background: "bg-gradient-to-br from-blue-900/40 to-blue-800/30",
      accent: "bg-blue-500/30",
    },
  },
  "message.media": {
    ...WORKFLOW_NODE_DEFINITIONS["message.media"],
    icon: Send,
    theme: {
      border: "from-purple-400 to-purple-600",
      background: "bg-gradient-to-br from-purple-900/40 to-purple-800/30",
      accent: "bg-purple-500/30",
    },
  },
  "message.interactive": {
    ...WORKFLOW_NODE_DEFINITIONS["message.interactive"],
    icon: Share2,
    theme: {
      border: "from-orange-400 to-orange-600",
      background: "bg-gradient-to-br from-orange-900/40 to-orange-800/30",
      accent: "bg-orange-500/30",
    },
  },
  "control.delay": {
    ...WORKFLOW_NODE_DEFINITIONS["control.delay"],
    icon: Clock4,
    theme: {
      border: "from-violet-400 to-violet-600",
      background: "bg-gradient-to-br from-violet-900/40 to-violet-800/30",
      accent: "bg-violet-500/30",
    },
  },
  "integration.http": {
    ...WORKFLOW_NODE_DEFINITIONS["integration.http"],
    icon: Webhook,
    theme: {
      border: "from-indigo-400 to-indigo-600",
      background: "bg-gradient-to-br from-indigo-900/40 to-indigo-800/30",
      accent: "bg-indigo-500/30",
    },
  },
  "control.end": {
    ...WORKFLOW_NODE_DEFINITIONS["control.end"],
    icon: Activity,
    theme: {
      border: "from-red-400 to-red-600",
      background: "bg-gradient-to-br from-red-900/40 to-red-800/30",
      accent: "bg-red-500/30",
    },
  },
}

export const NODE_GROUPS: Array<{ name: WorkflowNodeGroup; description: string }> = [
  { name: "Triggers", description: "Definem como o fluxo começa" },
  { name: "Mensagens", description: "Envio de conteúdo para o contato" },
  { name: "Integrações", description: "Conecte APIs e serviços externos" },
  { name: "Controle", description: "Manipule a lógica do fluxo" },
]

export type {
  WorkflowNodeType,
  WorkflowNodeDefinition,
  WorkflowNodeGroup,
  TextMessageNodeConfig,
  MediaMessageNodeConfig,
  InteractiveNodeConfig,
  DelayNodeConfig,
  HttpRequestNodeConfig,
}
