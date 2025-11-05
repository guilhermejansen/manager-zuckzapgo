"use client"

import { memo } from "react"

import { Play } from "lucide-react"
import type { NodeProps } from "reactflow"

import { BaseNode, type BaseNodeData } from "./base-node"

export interface StartNodeData extends Omit<BaseNodeData, "content"> {
  config?: {}
}

function StartNode(props: NodeProps<StartNodeData>) {
  return (
    <BaseNode
      {...props}
      data={{
        ...props.data,
        label: "Início",
        description: "Trigger da campanha",
        icon: Play,
        theme: {
          border: "from-green-400 to-green-600",
          background: "bg-gradient-to-br from-green-900/40 to-green-800/30",
          accent: "bg-green-500/30",
        },
        allowInput: false,
        allowOutput: true,
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
