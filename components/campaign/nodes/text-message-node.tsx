"use client"

import { memo, useCallback, useRef } from "react"

import { MessageSquare } from "lucide-react"
import type { NodeProps } from "reactflow"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useWorkflow } from "@/contexts/campaign-workflow-context"
import type { TextMessageNodeConfig } from "@/lib/workflow/definitions"

import { InputMapper } from "../input-mapper"
import { PlaceholderMenu } from "../placeholder-menu"
import { BaseNode, type BaseNodeData } from "./base-node"

export interface TextMessageNodeData extends Omit<BaseNodeData, "content"> {
  config: TextMessageNodeConfig
}

function TextMessageNode(props: NodeProps<TextMessageNodeData>) {
  const { data, id } = props
  const { config } = data
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const { updateNode } = useWorkflow()

  const handleInsertPlaceholder = useCallback(
    (placeholder: string) => {
      if (data.readOnly) return

      const element = messageRef.current
      const currentValue = config.message ?? ""

      if (!element) {
        updateNode(id, { config: { ...config, message: `${currentValue}${placeholder}` } })
        return
      }

      const selectionStart = element.selectionStart ?? currentValue.length
      const selectionEnd = element.selectionEnd ?? currentValue.length
      const nextValue =
        currentValue.slice(0, selectionStart) + placeholder + currentValue.slice(selectionEnd)

      updateNode(id, { config: { ...config, message: nextValue } })

      requestAnimationFrame(() => {
        const cursor = selectionStart + placeholder.length
        element.focus()
        element.setSelectionRange(cursor, cursor)
      })
    },
    [config, updateNode, id, data.readOnly]
  )

  const shouldShowInputMapper =
    (data.availableSources?.length ?? 0) > 0 || (data.inputs?.length ?? 0) > 0

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        label: "Mensagem de Texto",
        description: "Enviar mensagem de texto",
        icon: MessageSquare,
        theme: {
          border: "from-blue-400 to-blue-600",
          background: "bg-gradient-to-br from-blue-900/40 to-blue-800/30",
          accent: "bg-blue-500/30",
        },
        content: (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`${id}-message`} className="text-xs text-card-foreground">
                  Message
                </Label>
                <PlaceholderMenu
                  groups={data.placeholders ?? []}
                  onInsert={handleInsertPlaceholder}
                  disabled={data.readOnly}
                  triggerLabel="Variáveis"
                />
              </div>
              <Textarea
                ref={messageRef}
                id={`${id}-message`}
                value={config.message}
                onChange={(event) =>
                  updateNode(id, { config: { ...config, message: event.target.value } })
                }
                placeholder="Use placeholders como {{contact.name}}"
                className="min-h-[120px] resize-none bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                disabled={data.readOnly}
              />
              <div className="text-2xs text-muted-foreground">
                {config.message.length} characters
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <Label htmlFor={`${id}-delay`} className="text-card-foreground">
                  Delay after send (ms)
                </Label>
                <Input
                  id={`${id}-delay`}
                  type="number"
                  min={0}
                  step={100}
                  value={config.delayMs}
                  onChange={(event) =>
                    updateNode(id, {
                      config: { ...config, delayMs: Number(event.target.value) || 0 },
                    })
                  }
                  className="bg-secondary/50 text-foreground"
                  disabled={data.readOnly}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${id}-presence`} className="text-card-foreground">
                  Presence simulation (ms)
                </Label>
                <Input
                  id={`${id}-presence`}
                  type="number"
                  min={0}
                  step={100}
                  value={config.presenceSimulation}
                  onChange={(event) =>
                    updateNode(id, {
                      config: { ...config, presenceSimulation: Number(event.target.value) || 0 },
                    })
                  }
                  className="bg-secondary/50 text-foreground"
                  disabled={data.readOnly}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2 text-xs text-card-foreground">
              <div>
                <div className="font-medium">Link preview</div>
                <div className="text-muted-foreground">Enable preview snippets for URLs</div>
              </div>
              <Switch
                checked={config.linkPreview}
                onCheckedChange={(checked) =>
                  updateNode(id, { config: { ...config, linkPreview: checked } })
                }
                disabled={data.readOnly}
              />
            </div>

            {shouldShowInputMapper ? (
              <InputMapper
                value={data.inputs ?? []}
                sources={data.availableSources ?? []}
                onChange={(next) => updateNode(id, { inputs: next })}
                disabled={data.readOnly}
              />
            ) : null}
          </div>
        ),
      }}
    />
  )
}

export default memo(TextMessageNode)
