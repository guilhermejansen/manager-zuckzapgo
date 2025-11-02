"use client"

import { memo } from "react"

import type { NodeProps } from "reactflow"

import { BaseNode, type BaseNodeData } from "./base-node"

interface EndNodeData extends Omit<BaseNodeData, "content"> {}

function EndNode(props: NodeProps<EndNodeData>) {
  const { data, id } = props
  return (
    <BaseNode
      {...props}
      data={{
        ...data,
        allowOutput: false,
        content: (
          <p className="text-xs text-white/70">
            Marca o fim do workflow. Conecte todos os caminhos para garantir o envio completo.
          </p>
        ),
      }}
    />
  )
}

export default memo(EndNode)
