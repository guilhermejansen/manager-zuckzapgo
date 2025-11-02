"use client"

import { memo, useCallback, useRef } from "react"

import type { NodeProps } from "reactflow"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { MediaMessageNodeConfig } from "@/lib/workflow/definitions"

import { InputMapper } from "../input-mapper"
import { PlaceholderMenu } from "../placeholder-menu"
import { BaseNode, type BaseNodeData } from "./base-node"

export interface MediaMessageNodeData extends Omit<BaseNodeData, "content"> {
  config: MediaMessageNodeConfig
  onConfigChange?: (config: Partial<MediaMessageNodeConfig>) => void
}

function MediaMessageNode(props: NodeProps<MediaMessageNodeData>) {
  const { data, id } = props
  const { config } = data
  const captionRef = useRef<HTMLTextAreaElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)

  const insertIntoField = useCallback(
    (
      value: string,
      element: HTMLTextAreaElement | HTMLInputElement | null,
      current: string,
      key: keyof MediaMessageNodeConfig
    ) => {
      if (data.readOnly) return

      if (!element) {
        data.onConfigChange?.({
          [key]: `${current ?? ""}${value}`,
        } as Partial<MediaMessageNodeConfig>)
        return
      }

      const selectionStart = element.selectionStart ?? current.length
      const selectionEnd = element.selectionEnd ?? current.length
      const nextValue = current.slice(0, selectionStart) + value + current.slice(selectionEnd)

      data.onConfigChange?.({ [key]: nextValue } as Partial<MediaMessageNodeConfig>)

      requestAnimationFrame(() => {
        const cursor = selectionStart + value.length
        element.focus()
        element.setSelectionRange(cursor, cursor)
      })
    },
    [data]
  )

  const handleInsertCaptionPlaceholder = useCallback(
    (placeholder: string) => {
      insertIntoField(placeholder, captionRef.current, config.caption ?? "", "caption")
    },
    [config.caption, insertIntoField]
  )

  const handleInsertUrlPlaceholder = useCallback(
    (placeholder: string) => {
      insertIntoField(placeholder, urlRef.current, config.mediaUrl ?? "", "mediaUrl")
    },
    [config.mediaUrl, insertIntoField]
  )

  const shouldShowInputMapper =
    (data.availableSources?.length ?? 0) > 0 || (data.inputs?.length ?? 0) > 0

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        content: (
          <div className="space-y-4 text-xs text-white/80">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`${id}-type`} className="text-white/80">
                  Media type
                </Label>
                <select
                  id={`${id}-type`}
                  value={config.mediaType}
                  onChange={(event) =>
                    data.onConfigChange?.({
                      mediaType: event.target.value as MediaMessageNodeConfig["mediaType"],
                    })
                  }
                  className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-white"
                  disabled={data.readOnly}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Document</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${id}-delay`} className="text-white/80">
                  Delay (ms)
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
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`${id}-url`} className="text-white/80">
                  Media URL
                </Label>
                <PlaceholderMenu
                  groups={data.placeholders ?? []}
                  onInsert={handleInsertUrlPlaceholder}
                  disabled={data.readOnly}
                  triggerLabel="Variáveis"
                />
              </div>
              <Input
                ref={urlRef}
                id={`${id}-url`}
                value={config.mediaUrl}
                onChange={(event) => data.onConfigChange?.({ mediaUrl: event.target.value })}
                placeholder="https://"
                className="bg-white/5 text-white"
                disabled={data.readOnly}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`${id}-caption`} className="text-white/80">
                  Caption
                </Label>
                <PlaceholderMenu
                  groups={data.placeholders ?? []}
                  onInsert={handleInsertCaptionPlaceholder}
                  disabled={data.readOnly}
                  triggerLabel="Variáveis"
                />
              </div>
              <Textarea
                ref={captionRef}
                id={`${id}-caption`}
                value={config.caption ?? ""}
                onChange={(event) => data.onConfigChange?.({ caption: event.target.value })}
                placeholder="Message caption, supports placeholders"
                className="min-h-[80px] resize-none bg-white/5 text-white"
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

export default memo(MediaMessageNode)
