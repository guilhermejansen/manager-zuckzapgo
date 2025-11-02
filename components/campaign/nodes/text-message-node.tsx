"use client"

import { memo, useCallback, useRef } from "react"

import type { NodeProps } from "reactflow"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { TextMessageNodeConfig } from "@/lib/workflow/definitions"

import { InputMapper } from "../input-mapper"
import { PlaceholderMenu } from "../placeholder-menu"
import { BaseNode, type BaseNodeData } from "./base-node"

export interface TextMessageNodeData extends Omit<BaseNodeData, "content"> {
  config: TextMessageNodeConfig
  onConfigChange?: (config: Partial<TextMessageNodeConfig>) => void
}

function TextMessageNode(props: NodeProps<TextMessageNodeData>) {
  const { data, id } = props
  const { config } = data
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const handleInsertPlaceholder = useCallback(
    (placeholder: string) => {
      if (data.readOnly) return

      const element = messageRef.current
      const currentValue = config.message ?? ""

      if (!element) {
        data.onConfigChange?.({ message: `${currentValue}${placeholder}` })
        return
      }

      const selectionStart = element.selectionStart ?? currentValue.length
      const selectionEnd = element.selectionEnd ?? currentValue.length
      const nextValue =
        currentValue.slice(0, selectionStart) + placeholder + currentValue.slice(selectionEnd)

      data.onConfigChange?.({ message: nextValue })

      requestAnimationFrame(() => {
        const cursor = selectionStart + placeholder.length
        element.focus()
        element.setSelectionRange(cursor, cursor)
      })
    },
    [config.message, data.onConfigChange, data.readOnly]
  )

  const shouldShowInputMapper =
    (data.availableSources?.length ?? 0) > 0 || (data.inputs?.length ?? 0) > 0

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        content: (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`${id}-message`} className="text-xs text-white/80">
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
                onChange={(event) => data.onConfigChange?.({ message: event.target.value })}
                placeholder="Use placeholders como {{contact.name}}"
                className="min-h-[120px] resize-none bg-white/5 text-white"
                disabled={data.readOnly}
              />
              <div className="text-2xs text-white/60">{config.message.length} characters</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <Label htmlFor={`${id}-delay`} className="text-white/80">
                  Delay after send (ms)
                </Label>
                <Input
                  id={`${id}-delay`}
                  type="number"
                  min={0}
                  step={100}
                  value={config.delayMs}
                  onChange={(event) =>
                    data.onConfigChange?.({ delayMs: Number(event.target.value) || 0 })
                  }
                  className="bg-white/5 text-white"
                  disabled={data.readOnly}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${id}-presence`} className="text-white/80">
                  Presence simulation (ms)
                </Label>
                <Input
                  id={`${id}-presence`}
                  type="number"
                  min={0}
                  step={100}
                  value={config.presenceSimulation}
                  onChange={(event) =>
                    data.onConfigChange?.({ presenceSimulation: Number(event.target.value) || 0 })
                  }
                  className="bg-white/5 text-white"
                  disabled={data.readOnly}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs text-white/80">
              <div>
                <div className="font-medium">Link preview</div>
                <div className="text-white/60">Enable preview snippets for URLs</div>
              </div>
              <Switch
                checked={config.linkPreview}
                onCheckedChange={(checked) => data.onConfigChange?.({ linkPreview: checked })}
                disabled={data.readOnly}
              />
            </div>

            {shouldShowInputMapper ? (
              <InputMapper
                value={data.inputs ?? []}
                sources={data.availableSources ?? []}
                onChange={(next) => data.onInputsChange?.(next)}
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
