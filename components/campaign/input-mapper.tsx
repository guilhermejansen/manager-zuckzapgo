"use client"

import { useState, useCallback } from "react"
import { ChevronDown, Plus, X, Link2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import type { WorkflowNodeInput, WorkflowAvailableSource } from "./workflow-types"

interface InputMapperProps {
  value: WorkflowNodeInput[]
  sources: WorkflowAvailableSource[]
  onChange: (inputs: WorkflowNodeInput[]) => void
  disabled?: boolean
  className?: string
}

export function InputMapper({
  value = [],
  sources = [],
  onChange,
  disabled = false,
  className,
}: InputMapperProps) {
  const [isOpen, setIsOpen] = useState(value.length > 0)
  const [newInputName, setNewInputName] = useState("")

  const handleAddInput = useCallback(() => {
    if (!newInputName.trim() || disabled) return

    const newInput: WorkflowNodeInput = {
      name: newInputName.trim(),
      sourceNodeId: "",
      sourceOutput: "",
      required: false,
    }

    onChange([...value, newInput])
    setNewInputName("")
  }, [newInputName, value, onChange, disabled])

  const handleRemoveInput = useCallback(
    (index: number) => {
      if (disabled) return
      const newInputs = value.filter((_, i) => i !== index)
      onChange(newInputs)
    },
    [value, onChange, disabled]
  )

  const handleUpdateInput = useCallback(
    (index: number, updates: Partial<WorkflowNodeInput>) => {
      if (disabled) return
      const newInputs = value.map((input, i) =>
        i === index ? { ...input, ...updates } : input
      )
      onChange(newInputs)
    },
    [value, onChange, disabled]
  )

  const handleSourceChange = useCallback(
    (index: number, sourceNodeId: string) => {
      if (disabled) return
      const source = sources.find((s) => s.nodeId === sourceNodeId)
      const firstOutput = source?.outputs[0]
      handleUpdateInput(index, {
        sourceNodeId,
        sourceOutput: firstOutput?.name || "",
      })
    },
    [sources, handleUpdateInput, disabled]
  )

  if (sources.length === 0) {
    return null
  }

  const hasInvalidInputs = value.some(
    (input) => input.required && (!input.sourceNodeId || !input.sourceOutput)
  )

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("space-y-2", className)}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-full justify-between px-2 hover:bg-white/5"
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <Link2 className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              Input Mapping {value.length > 0 && `(${value.length})`}
            </span>
          </div>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3">
        {hasInvalidInputs && (
          <Alert className="border-orange-500/20 bg-orange-500/10">
            <AlertCircle className="h-3.5 w-3.5" />
            <AlertDescription className="text-xs">
              Some required inputs are not mapped to a source
            </AlertDescription>
          </Alert>
        )}

        {value.length === 0 && (
          <div className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-center">
            <p className="text-xs text-muted-foreground">
              No inputs mapped. Add inputs to use data from previous nodes.
            </p>
          </div>
        )}

        {value.map((input, index) => {
          const source = sources.find((s) => s.nodeId === input.sourceNodeId)
          const isInvalid = input.required && (!input.sourceNodeId || !input.sourceOutput)

          return (
            <div
              key={index}
              className={cn(
                "space-y-2 rounded-lg border border-white/10 bg-white/5 p-3",
                isInvalid && "border-orange-500/30"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-white/80">
                      Input name {input.required && <span className="text-red-500">*</span>}
                    </Label>
                    <code className="text-xs font-mono text-primary">
                      {"{{inputs." + input.name + "}}"}
                    </code>
                  </div>

                  <div className="grid gap-2">
                    <Select
                      value={input.sourceNodeId}
                      onValueChange={(value) => handleSourceChange(index, value)}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-8 bg-black/20">
                        <SelectValue placeholder="Select source node" />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source.nodeId} value={source.nodeId}>
                            {source.nodeLabel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {source && source.outputs.length > 0 && (
                      <Select
                        value={input.sourceOutput}
                        onValueChange={(value) =>
                          handleUpdateInput(index, { sourceOutput: value })
                        }
                        disabled={disabled}
                      >
                        <SelectTrigger className="h-8 bg-black/20">
                          <SelectValue placeholder="Select output" />
                        </SelectTrigger>
                        <SelectContent>
                          {source.outputs.map((output) => (
                            <SelectItem key={output.name} value={output.name}>
                              <div className="space-y-0.5">
                                <div className="font-medium">{output.name}</div>
                                {output.description && (
                                  <div className="text-xs text-muted-foreground">
                                    {output.description}
                                  </div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => handleRemoveInput(index)}
                  disabled={disabled}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )
        })}

        <div className="flex gap-2">
          <Input
            placeholder="New input name..."
            value={newInputName}
            onChange={(e) => setNewInputName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddInput()
              }
            }}
            className="h-8 bg-black/20"
            disabled={disabled}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddInput}
            disabled={!newInputName.trim() || disabled}
            className="h-8"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add
          </Button>
        </div>

        <div className="rounded-lg bg-blue-500/10 px-3 py-2">
          <p className="text-xs text-blue-400">
            💡 <strong>Tip:</strong> Map outputs from previous nodes to use their data.
            You can reference mapped inputs using {"{{inputs.name}}"} in your messages.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
