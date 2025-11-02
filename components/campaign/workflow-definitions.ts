import {
  WORKFLOW_NODE_DEFINITIONS,
  type WorkflowNodeDefinition,
  type WorkflowNodeGroup,
  type WorkflowNodeType,
  type TextMessageNodeConfig,
  type MediaMessageNodeConfig,
  type InteractiveNodeConfig,
  type DelayNodeConfig,
  type HttpRequestNodeConfig,
} from "@/lib/workflow/definitions"
import { Activity, Clock4, MessageSquareText, Send, Share2, Webhook, Workflow } from "lucide-react"

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
      border: "from-emerald-500/80 to-emerald-800/60",
      background: "bg-[#12352D]",
      accent: "bg-emerald-500/20",
    },
  },
  "message.text": {
    ...WORKFLOW_NODE_DEFINITIONS["message.text"],
    icon: MessageSquareText,
    theme: {
      border: "from-sky-500/80 to-indigo-800/60",
      background: "bg-[#161F3A]",
      accent: "bg-sky-500/20",
    },
  },
  "message.media": {
    ...WORKFLOW_NODE_DEFINITIONS["message.media"],
    icon: Send,
    theme: {
      border: "from-purple-500/80 to-purple-800/60",
      background: "bg-[#22163B]",
      accent: "bg-purple-500/20",
    },
  },
  "message.interactive": {
    ...WORKFLOW_NODE_DEFINITIONS["message.interactive"],
    icon: Share2,
    theme: {
      border: "from-amber-500/80 to-orange-800/60",
      background: "bg-[#332617]",
      accent: "bg-amber-500/20",
    },
  },
  "control.delay": {
    ...WORKFLOW_NODE_DEFINITIONS["control.delay"],
    icon: Clock4,
    theme: {
      border: "from-slate-500/80 to-slate-800/60",
      background: "bg-[#1F242B]",
      accent: "bg-slate-500/20",
    },
  },
  "integration.http": {
    ...WORKFLOW_NODE_DEFINITIONS["integration.http"],
    icon: Webhook,
    theme: {
      border: "from-violet-500/80 to-violet-800/60",
      background: "bg-[#20163B]",
      accent: "bg-violet-500/20",
    },
  },
  "control.end": {
    ...WORKFLOW_NODE_DEFINITIONS["control.end"],
    icon: Activity,
    theme: {
      border: "from-rose-500/80 to-rose-800/60",
      background: "bg-[#34161C]",
      accent: "bg-rose-500/20",
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
