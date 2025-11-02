"use client"

import { createElement, memo, useMemo } from "react"

import { Copy, MoreHorizontal, Play, Trash2 } from "lucide-react"
import { Handle, type NodeProps, Position } from "reactflow"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  const isActive = data.active ?? true
  const menuItems = useMemo(
    () =>
      [
        data.actions?.onOpenSettings && {
          label: "Open settings",
          action: data.actions.onOpenSettings,
        },
        data.actions?.onExecute && { label: "Execute step", action: data.actions.onExecute },
        data.actions?.onToggleActive && {
          label: isActive ? "Deactivate" : "Activate",
          action: data.actions.onToggleActive,
        },
        data.actions?.onDuplicate && { label: "Duplicate", action: data.actions.onDuplicate },
        data.actions?.onDelete && {
          label: "Delete",
          action: data.actions.onDelete,
          destructive: true,
        },
      ].filter(Boolean),
    [data.actions, isActive]
  )

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
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {data.actions?.onExecute ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white"
                onClick={data.actions.onExecute}
              >
                <Play className="h-4 w-4" />
              </Button>
            ) : null}
            {data.actions?.onDuplicate ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white"
                onClick={data.actions.onDuplicate}
              >
                <Copy className="h-4 w-4" />
              </Button>
            ) : null}
            {data.actions?.onDelete ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-white"
                onClick={data.actions.onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : null}
            {menuItems.length ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {menuItems.map((item, index) =>
                    item ? (
                      <DropdownMenuItem
                        key={`${id}-menu-${index}`}
                        onClick={item.action}
                        className={item.destructive ? "text-destructive" : undefined}
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuSeparator key={`sep-${index}`} />
                    )
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </div>

        {data.content ? (
          <div className="mt-4 space-y-3 text-sm text-white/80">{data.content}</div>
        ) : null}

        {data.footer ? <div className="mt-4 text-xs text-white/60">{data.footer}</div> : null}
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
