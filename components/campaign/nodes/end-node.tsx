"use client"

import { memo } from "react"

import { CircleStop } from "lucide-react"
import type { NodeProps } from "reactflow"

import { BaseNode, type BaseNodeData } from "./base-node"

export interface EndNodeData extends Omit<BaseNodeData, "content"> {
  config?: {}
}

function EndNode(props: NodeProps<EndNodeData>) {
  return (
    <BaseNode
      {...props}
      data={{
        ...props.data,
        label: "Fim",
        description: "Finaliza a campanha",
        icon: CircleStop,
        theme: {
          border: "from-red-400 to-red-600",
          background: "bg-gradient-to-br from-red-900/40 to-red-800/30",
          accent: "bg-red-500/30",
        },
        allowInput: true,
        allowOutput: false,
        content: (
          <p className="text-xs text-white/70">
            Marca o final do fluxo da campanha. Todos os caminhos devem terminar em um node de fim.
          </p>
        ),
      }}
    />
  )
}

export default memo(EndNode)
