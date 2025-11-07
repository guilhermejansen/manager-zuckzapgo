"use client"

import { memo, useCallback, useRef } from "react"

import { Send } from "lucide-react"
import type { NodeProps } from "reactflow"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useWorkflow } from "@/contexts/campaign-workflow-context"
import type { MediaMessageNodeConfig } from "@/lib/workflow/definitions"

import { InputMapper } from "../input-mapper"
import { PlaceholderMenu } from "../placeholder-menu"
import { BaseNode, type BaseNodeData } from "./base-node"

export interface MediaMessageNodeData extends Omit<BaseNodeData, "content"> {
  config: MediaMessageNodeConfig
}

function MediaMessageNode(props: NodeProps<MediaMessageNodeData>) {
  const { data, id } = props
  const { config } = data
  const captionRef = useRef<HTMLTextAreaElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)
  const { updateNode } = useWorkflow()

  const insertIntoField = useCallback(
    (
      value: string,
      element: HTMLTextAreaElement | HTMLInputElement | null,
      current: string,
      key: keyof MediaMessageNodeConfig
    ) => {
      if (data.readOnly) return

      if (!element) {
        updateNode(id, {
          config: {
            ...config,
            [key]: `${current ?? ""}${value}`,
          },
        })
        return
      }

      const selectionStart = element.selectionStart ?? current.length
      const selectionEnd = element.selectionEnd ?? current.length
      const nextValue = current.slice(0, selectionStart) + value + current.slice(selectionEnd)

      updateNode(id, {
        config: {
          ...config,
          [key]: nextValue,
        },
      })

      requestAnimationFrame(() => {
        const cursor = selectionStart + value.length
        element.focus()
        element.setSelectionRange(cursor, cursor)
      })
    },
    [id, config, updateNode, data.readOnly]
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
        label: "Mensagem de Mídia",
        description: "Envio de imagem, vídeo, documento",
        icon: Send,
        theme: {
          border: "from-purple-400 to-purple-600",
          background: "bg-gradient-to-br from-purple-900/40 to-purple-800/30",
          accent: "bg-purple-500/30",
        },
        allowInput: true,
        allowOutput: true,
        content: (
          <div className="space-y-4 text-xs text-card-foreground">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`${id}-type`} className="text-card-foreground">
                  Media type
                </Label>
                <select
                  id={`${id}-type`}
                  value={config.mediaType}
                  onChange={(event) =>
                    updateNode(id, {
                      config: {
                        ...config,
                        mediaType: event.target.value as MediaMessageNodeConfig["mediaType"],
                      },
                    })
                  }
                  className="h-10 w-full rounded-md border border-border bg-secondary/50 px-3 text-foreground"
                  disabled={data.readOnly}
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="document">Document</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`${id}-delay`} className="text-card-foreground">
                  Delay (ms)
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
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`${id}-url`} className="text-card-foreground">
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
                onChange={(event) =>
                  updateNode(id, { config: { ...config, mediaUrl: event.target.value } })
                }
                placeholder="https://"
                className="bg-secondary/50 text-foreground placeholder:text-muted-foreground"
                disabled={data.readOnly}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`${id}-caption`} className="text-card-foreground">
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
                onChange={(event) =>
                  updateNode(id, { config: { ...config, caption: event.target.value } })
                }
                placeholder="Message caption, supports placeholders"
                className="min-h-[80px] resize-none bg-secondary/50 text-foreground placeholder:text-muted-foreground"
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

export default memo(MediaMessageNode)
