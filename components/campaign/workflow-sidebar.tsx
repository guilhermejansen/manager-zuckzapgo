"use client"

import { type DragEvent, useMemo, useState } from "react"

import { Input } from "@/components/ui/input"
import { NODE_DEFINITIONS, NODE_GROUPS, type WorkflowNodeType } from "./workflow-definitions"

interface WorkflowSidebarProps {
  onDragStart: (event: DragEvent<HTMLButtonElement>, type: WorkflowNodeType) => void
}

export function WorkflowSidebar({ onDragStart }: WorkflowSidebarProps) {
  const [query, setQuery] = useState("")
  const items = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return Object.values(NODE_DEFINITIONS).filter((definition) =>
      normalizedQuery
        ? definition.label.toLowerCase().includes(normalizedQuery) ||
          definition.description.toLowerCase().includes(normalizedQuery)
        : true
    )
  }, [query])

  return (
    <aside className="h-full w-80 rounded-3xl border border-white/[0.04] bg-[#121216] p-5 text-white">
      <div className="mb-6 space-y-1">
        <h2 className="text-lg font-semibold">Componentes</h2>
        <p className="text-xs text-white/50">Arraste e solte para montar o fluxo</p>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar nodes..."
          className="mt-3 w-full rounded-xl border-none bg-white/5 text-white placeholder:text-white/40"
        />
      </div>

      <div className="space-y-6 overflow-y-auto pb-16 pr-2">
        {NODE_GROUPS.map((group) => {
          const groupNodes = items.filter((item) => item.group === group.name)
          if (groupNodes.length === 0) return null
          return (
            <section key={group.name} className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-white/80">{group.name}</div>
                <div className="text-xs text-white/50">{group.description}</div>
              </div>
              <div className="space-y-2">
                {groupNodes.map((definition) => (
                  <button
                    key={definition.type}
                    type="button"
                    draggable
                    onDragStart={(event) => onDragStart(event, definition.type)}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition hover:border-white/30 hover:bg-white/[0.08]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        <definition.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{definition.label}</div>
                        <div className="text-xs text-white/50">{definition.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </aside>
  )
}
