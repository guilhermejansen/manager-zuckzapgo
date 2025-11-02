"use client"

import { memo } from "react"

import type { NodeProps } from "reactflow"

import { BaseNode, type BaseNodeData } from "./base-node"

interface StartNodeData extends Omit<BaseNodeData, "content"> {}

function StartNode(props: NodeProps<StartNodeData>) {
  const { data, id } = props
  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        allowInput: false,
        content: (
          <p className="text-xs text-white/70">
            Trigger que inicia a campanha. Pode ser agendada ou executada manualmente conforme as
            configurações de campanha.
          </p>
        ),
      }}
    />
  )
}

export default memo(StartNode)
