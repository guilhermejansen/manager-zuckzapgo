"use client"

import { memo, useCallback, useRef } from "react"

import type { NodeProps } from "reactflow"
import { useWorkflow } from "@/contexts/campaign-workflow-context"
import { generateDeterministicId } from "@/lib/id-generator"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { InteractiveNodeConfig } from "@/lib/workflow/definitions"

import { InputMapper } from "../input-mapper"
import { PlaceholderMenu } from "../placeholder-menu"
import { BaseNode, type BaseNodeData } from "./base-node"

type InteractiveButton = InteractiveNodeConfig["buttons"][number]

export interface InteractiveNodeData extends Omit<BaseNodeData, "content"> {
  config: InteractiveNodeConfig
}

function InteractiveNode(props: NodeProps<InteractiveNodeData>) {
  const { data, id } = props
  const { config } = data
  const promptRef = useRef<HTMLInputElement>(null)
  const { updateNode } = useWorkflow()

  const appendPromptPlaceholder = useCallback(
    (placeholder: string) => {
      if (data.readOnly) return
      const element = promptRef.current
      const current = config.text ?? ""
      if (!element) {
        updateNode(id, { config: { ...config, text: `${current}${placeholder}` } })
        return
      }

      const selectionStart = element.selectionStart ?? current.length
      const selectionEnd = element.selectionEnd ?? current.length
      const nextValue = current.slice(0, selectionStart) + placeholder + current.slice(selectionEnd)
      updateNode(id, { config: { ...config, text: nextValue } })

      requestAnimationFrame(() => {
        const cursor = selectionStart + placeholder.length
        element.focus()
        element.setSelectionRange(cursor, cursor)
      })
    },
    [id, config, updateNode, data.readOnly]
  )

  const addButton = () => {
    const nextButtons = [
      ...config.buttons,
      {
        id: generateDeterministicId("btn"),
        label: `Option ${config.buttons.length + 1}`,
        value: `option_${config.buttons.length + 1}`,
      },
    ]
    updateNode(id, { config: { ...config, buttons: nextButtons } })
  }

  const updateButton = (buttonId: string, patch: Partial<InteractiveButton>) => {
    const nextButtons = config.buttons.map((button) =>
      button.id === buttonId ? { ...button, ...patch } : button
    )
    updateNode(id, { config: { ...config, buttons: nextButtons } })
  }

  const removeButton = (buttonId: string) => {
    const nextButtons = config.buttons.filter((button) => button.id !== buttonId)
    updateNode(id, { config: { ...config, buttons: nextButtons } })
  }

  const insertButtonPlaceholder = (
    buttonId: string,
    field: keyof InteractiveButton,
    placeholder: string
  ) => {
    const targetButton = config.buttons.find((button) => button.id === buttonId)
    if (!targetButton) return
    updateButton(buttonId, { [field]: `${targetButton[field] ?? ""}${placeholder}` })
  }

  const shouldShowInputMapper =
    (data.availableSources?.length ?? 0) > 0 || (data.inputs?.length ?? 0) > 0

  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        content: (
          <div className="space-y-4 text-xs text-white/80">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`${id}-text`} className="text-white/80">
                  Prompt text
                </Label>
                <PlaceholderMenu
                  groups={data.placeholders ?? []}
                  onInsert={appendPromptPlaceholder}
                  disabled={data.readOnly}
                  triggerLabel="Variáveis"
                />
              </div>
              <Input
                ref={promptRef}
                id={`${id}-text`}
                value={config.text}
                onChange={(event) => updateNode(id, { config: { ...config, text: event.target.value } })}
                className="bg-white/5 text-white"
                disabled={data.readOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor={`${id}-type`} className="text-white/80">
                  Interactive type
                </Label>
                <select
                  id={`${id}-type`}
                  value={config.interactiveType}
                  onChange={(event) =>
                    updateNode(id, {
                      config: {
                        ...config,
                        interactiveType: event.target.value as InteractiveNodeConfig["interactiveType"],
                      }
                    })
                  }
                  className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-white"
                  disabled={data.readOnly}
                >
                  <option value="buttons">Buttons</option>
                  <option value="list">List</option>
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
                    updateNode(id, { config: { ...config, delayMs: Number(event.target.value) || 0 } })
                  }
                  className="bg-white/5 text-white"
                  disabled={data.readOnly}
                />
              </div>
            </div>

            {config.interactiveType === "list" ? (
              <div className="space-y-1">
                <Label htmlFor={`${id}-list-button`} className="text-white/80">
                  List button label
                </Label>
                <Input
                  id={`${id}-list-button`}
                  value={config.listButtonText ?? ""}
                  onChange={(event) =>
                    updateNode(id, { config: { ...config, listButtonText: event.target.value } })
                  }
                  placeholder="View options"
                  className="bg-white/5 text-white"
                  disabled={data.readOnly}
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white/80">Options</span>
                <Button variant="secondary" size="sm" onClick={addButton} disabled={data.readOnly}>
                  Add option
                </Button>
              </div>
              <div className="space-y-2">
                {config.buttons.map((button) => (
                  <div key={button.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-white/70">Label</Label>
                        <Input
                          value={button.label}
                          onChange={(event) =>
                            updateButton(button.id, { label: event.target.value })
                          }
                          className="mt-1 bg-white/5 text-white"
                          disabled={data.readOnly}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label className="text-white/70">Value</Label>
                          <PlaceholderMenu
                            groups={data.placeholders ?? []}
                            onInsert={(placeholder) =>
                              insertButtonPlaceholder(button.id, "value", placeholder)
                            }
                            disabled={data.readOnly}
                            triggerLabel="Variáveis"
                          />
                        </div>
                        <Input
                          value={button.value}
                          onChange={(event) =>
                            updateButton(button.id, { value: event.target.value })
                          }
                          className="mt-1 bg-white/5 text-white"
                          disabled={data.readOnly}
                        />
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeButton(button.id)}
                        disabled={data.readOnly}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {config.buttons.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-4 text-center text-xs text-white/50">
                    No options yet. Add at least one.
                  </div>
                ) : null}
              </div>
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

export default memo(InteractiveNode)
