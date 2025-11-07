"use client"

import { createElement, memo } from "react"

import { Copy, Trash2 } from "lucide-react"
import { Handle, type NodeProps, Position } from "reactflow"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import type {
  PlaceholderGroup,
  WorkflowAvailableSource,
  WorkflowNodeInput,
} from "../workflow-types"

export interface NodeActionHandlers {
  onDuplicate?: () => void
  onDelete?: () => void
  onExecute?: () => void
  onToggleActive?: () => void
  onOpenSettings?: () => void
}

export interface BaseNodeData {
  label: string
  description?: string
  icon: any
  theme: {
    border: string
    background: string
    accent: string
  }
  active?: boolean
  allowInput?: boolean
  allowOutput?: boolean
  onOpenSettings?: () => void
  actions?: NodeActionHandlers
  content?: React.ReactNode
  footer?: React.ReactNode
  inputs?: WorkflowNodeInput[]
  availableSources?: WorkflowAvailableSource[]
  placeholders?: PlaceholderGroup[]
  onInputsChange?: (inputs: WorkflowNodeInput[]) => void
  readOnly?: boolean
  contextSignature?: string
}

function BaseNodeComponent({ data, id }: NodeProps<BaseNodeData>) {
  // ✅ VALIDAÇÃO: Verificar se theme existe
  if (!data.theme) {
    console.error(`Node ${id} missing theme configuration`, data)
    return (
      <div className="rounded-lg border-2 border-red-500 bg-red-500/10 p-4 min-w-[320px]">
        <p className="text-sm font-semibold text-red-400 mb-1">⚠️ Erro de Configuração</p>
        <p className="text-xs text-red-300">Node sem theme definido (ID: {id})</p>
        <p className="text-xs text-red-300 mt-1">Type: {data.label || "Unknown"}</p>
      </div>
    )
  }

  const isActive = data.active ?? true
  return (
    <div
      className={cn(
        "group relative min-w-[320px] max-w-[420px] rounded-2xl border bg-gradient-to-br p-[1px] shadow-lg transition-all",
        !isActive && "opacity-70",
        data.theme.border
      )}
    >
      <div className={cn("rounded-2xl p-4", data.theme.background)}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl",
                data.theme.accent
              )}
            >
              {createElement(data.icon, { className: "h-5 w-5" })}
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight text-white">{data.label}</div>
              {data.description ? (
                <div className="text-xs text-white/70">{data.description}</div>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {/* Botões sempre visíveis estilo n8n */}
            {data.actions?.onDuplicate && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-white/70 hover:text-white hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  data.actions?.onDuplicate?.()
                }}
                title="Duplicate node"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            )}
            {data.actions?.onDelete && (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-white/70 hover:text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  data.actions?.onDelete?.()
                }}
                title="Delete node"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {data.content ? (
          <div
            className={cn("mt-4 space-y-3 text-sm text-white/80", "nodrag nopan")}
            onPointerDown={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            {data.content}
          </div>
        ) : null}

        {data.footer ? (
          <div
            className={cn("mt-4 text-xs text-white/60", "nodrag nopan")}
            onPointerDown={(event) => event.stopPropagation()}
            onWheel={(event) => event.stopPropagation()}
          >
            {data.footer}
          </div>
        ) : null}
      </div>

      {data.allowInput !== false ? (
        <Handle
          type="target"
          position={Position.Left}
          id={`${id}-input`}
          className="h-3 w-3 rounded-full border-2 border-white bg-white/40"
        />
      ) : null}
      {data.allowOutput !== false ? (
        <Handle
          type="source"
          position={Position.Right}
          id={`${id}-output`}
          className="h-3 w-3 rounded-full border-2 border-white bg-white/40"
        />
      ) : null}
    </div>
  )
}

export const BaseNode = memo(BaseNodeComponent)
