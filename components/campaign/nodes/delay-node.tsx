"use client"

import { memo } from "react"

import type { NodeProps } from "reactflow"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { DelayNodeConfig } from "@/lib/workflow/definitions"

import { BaseNode, type BaseNodeData } from "./base-node"

export interface DelayNodeData extends Omit<BaseNodeData, "content"> {
  config: DelayNodeConfig
  onConfigChange?: (config: Partial<DelayNodeConfig>) => void
}

function DelayNode(props: NodeProps<DelayNodeData>) {
  const { data, id } = props
  const { config } = data
  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        content: (
          <div className="grid grid-cols-2 gap-3 text-xs text-white/80">
            <div className="space-y-1">
              <Label htmlFor={`${id}-duration`} className="text-white/80">
                Duration (ms)
              </Label>
              <Input
                id={`${id}-duration`}
                type="number"
                min={0}
                step={100}
                value={config.durationMs}
                onChange={(event) =>
                  data.onConfigChange?.({ durationMs: Number(event.target.value) || 0 })
                }
                className="bg-white/5 text-white"
                disabled={data.readOnly}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`${id}-jitter`} className="text-white/80">
                Jitter (ms)
              </Label>
              <Input
                id={`${id}-jitter`}
                type="number"
                min={0}
                step={100}
                value={config.jitterMs ?? 0}
                onChange={(event) =>
                  data.onConfigChange?.({ jitterMs: Number(event.target.value) || 0 })
                }
                className="bg-white/5 text-white"
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
