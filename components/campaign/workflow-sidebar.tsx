"use client"

import { useTheme } from "next-themes"

import {
  CircleStop,
  Clock,
  Image,
  MessageCircle,
  MessageSquare,
  Play,
  Webhook,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface WorkflowSidebarProps {
  isOpen: boolean
  onClose: () => void
  isFullscreen?: boolean
}

interface NodeTemplate {
  type: string
  label: string
  description: string
  icon: any
  category: "trigger" | "message" | "control"
  color: string
}

const NODE_TEMPLATES: NodeTemplate[] = [
  {
    type: "trigger.start",
    label: "Início",
    description: "Ponto de partida do workflow",
    icon: Play,
    category: "trigger",
    color: "text-green-500 dark:text-green-400",
  },
  {
    type: "message.text",
    label: "Mensagem de Texto",
    description: "Enviar mensagem de texto",
    icon: MessageSquare,
    category: "message",
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    type: "message.media",
    label: "Mensagem de Mídia",
    description: "Enviar imagem, vídeo, áudio ou documento",
    icon: Image,
    category: "message",
    color: "text-purple-500 dark:text-purple-400",
  },
  {
    type: "message.interactive",
    label: "Mensagem Interativa",
    description: "Botões ou lista de opções",
    icon: MessageCircle,
    category: "message",
    color: "text-orange-500 dark:text-orange-400",
  },
  {
    type: "control.delay",
    label: "Delay",
    description: "Aguardar um tempo antes de continuar",
    icon: Clock,
    category: "control",
    color: "text-violet-500 dark:text-violet-400",
  },
  {
    type: "integration.http",
    label: "HTTP Request",
    description: "Chamada HTTP externa",
    icon: Webhook,
    category: "control",
    color: "text-indigo-500 dark:text-indigo-400",
  },
  {
    type: "control.end",
    label: "Fim",
    description: "Finaliza o workflow",
    icon: CircleStop,
    category: "control",
    color: "text-red-500 dark:text-red-400",
  },
]

export function WorkflowSidebar({ isOpen, onClose, isFullscreen = false }: WorkflowSidebarProps) {
  const { theme } = useTheme()

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden",
        "bg-white dark:bg-[#1A1D29]",
        "border border-gray-200 dark:border-white/[0.08]",
        "transform transition-all duration-300 ease-in-out",
        "shadow-2xl",
        // Fullscreen: sidebar completa do topo ao fundo
        isFullscreen && "right-0 top-0 bottom-0 w-64 border-l rounded-none",
        // Normal: dropdown compacto no canto superior direito
        !isFullscreen && "right-4 top-20 bottom-20 w-72 rounded-2xl",
        isOpen ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3 flex-shrink-0",
          "border-b border-gray-200 dark:border-white/[0.08]"
        )}
      >
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Adicionar Node</h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          className={cn(
            "h-7 w-7 rounded-lg",
            "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
            "dark:text-white/50 dark:hover:text-white dark:hover:bg-white/5"
          )}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Node List */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-3 space-y-2">
          {NODE_TEMPLATES.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className={cn(
                "group relative p-3 rounded-xl",
                "border border-gray-200 dark:border-white/[0.08]",
                "bg-white dark:bg-white/[0.02]",
                "hover:bg-gray-50 dark:hover:bg-white/[0.06]",
                "hover:border-gray-300 dark:hover:border-white/[0.12]",
                "cursor-grab active:cursor-grabbing",
                "transition-all duration-200",
                "hover:shadow-md dark:hover:shadow-black/20"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 flex-shrink-0 p-2 rounded-lg",
                    "bg-gray-100 dark:bg-white/[0.05]",
                    "group-hover:bg-gray-200 dark:group-hover:bg-white/[0.08]",
                    "transition-colors duration-200",
                    node.color
                  )}
                >
                  {node.icon && <node.icon className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      "text-sm font-medium mb-1 leading-tight",
                      "text-gray-900 dark:text-white"
                    )}
                  >
                    {node.label}
                  </div>
                  <div className={cn("text-xs leading-snug", "text-gray-500 dark:text-white/50")}>
                    {node.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
