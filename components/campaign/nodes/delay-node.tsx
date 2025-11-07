"use client"

import { memo } from "react"

import { Clock4 } from "lucide-react"
import type { NodeProps } from "reactflow"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWorkflow } from "@/contexts/campaign-workflow-context"
import type { DelayNodeConfig } from "@/lib/workflow/definitions"

import { BaseNode, type BaseNodeData } from "./base-node"

export interface DelayNodeData extends Omit<BaseNodeData, "content"> {
  config: DelayNodeConfig
}

function DelayNode(props: NodeProps<DelayNodeData>) {
  const { data, id } = props
  const { config } = data
  const { updateNode } = useWorkflow()
  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        label: "Delay",
        description: "Aguardar um tempo antes de continuar",
        icon: Clock4,
        theme: {
          border: "from-violet-400 to-violet-600",
          background: "bg-gradient-to-br from-violet-900/40 to-violet-800/30",
          accent: "bg-violet-500/30",
        },
        allowInput: true,
        allowOutput: true,
        content: (
          <div className="grid grid-cols-2 gap-3 text-xs text-card-foreground">
            <div className="space-y-1">
              <Label htmlFor={`${id}-duration`} className="text-card-foreground">
                Duration (ms)
              </Label>
              <Input
                id={`${id}-duration`}
                type="number"
                min={0}
                step={100}
                value={config.durationMs}
                onChange={(event) =>
                  updateNode(id, {
                    config: { ...config, durationMs: Number(event.target.value) || 0 },
                  })
                }
                className="bg-secondary/50 text-foreground"
                disabled={data.readOnly}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`${id}-jitter`} className="text-card-foreground">
                Jitter (ms)
              </Label>
              <Input
                id={`${id}-jitter`}
                type="number"
                min={0}
                step={100}
                value={config.jitterMs ?? 0}
                onChange={(event) =>
                  updateNode(id, {
                    config: { ...config, jitterMs: Number(event.target.value) || 0 },
                  })
                }
                className="bg-secondary/50 text-foreground"
                disabled={data.readOnly}
              />
            </div>
          </div>
        ),
      }}
    />
  )
}

export default memo(DelayNode)
