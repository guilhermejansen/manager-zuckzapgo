"use client"

import { useCallback } from "react"
import { useTheme } from "next-themes"
import { useReactFlow, getNodesBounds, getViewportForBounds } from "reactflow"
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Locate,
  Grid3x3,
  Plus,
  Minimize
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface WorkflowToolbarProps {
  className?: string
  onToggleSidebar?: () => void
  onExitFullscreen?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
}

export function WorkflowToolbar({
  className,
  onToggleSidebar,
  onExitFullscreen,
  onToggleFullscreen,
  isFullscreen
}: WorkflowToolbarProps) {
  const { theme } = useTheme()
  const {
    zoomIn,
    zoomOut,
    fitView,
    getNodes,
    setNodes,
    getEdges,
    getViewport
  } = useReactFlow()

  // Auto-organize nodes (Tidy Up) - estilo n8n
  const handleTidyUp = useCallback(() => {
    const nodes = getNodes()
    const edges = getEdges()

    if (nodes.length === 0) return

    // Constrói grafo de adjacência (quem aponta para quem)
    const adjacencyList = new Map<string, string[]>()
    const inDegree = new Map<string, number>()

    nodes.forEach(node => {
      adjacencyList.set(node.id, [])
      inDegree.set(node.id, 0)
    })

    edges.forEach(edge => {
      const sources = adjacencyList.get(edge.source) || []
      sources.push(edge.target)
      adjacencyList.set(edge.source, sources)
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1)
    })

    // Topological sort usando BFS (Kahn's algorithm) para organizar por níveis
    const nodesByLevel: Record<number, typeof nodes> = {}
    const queue: Array<{ id: string; level: number }> = []

    // Encontra nodes sem predecessores (start nodes)
    nodes.forEach(node => {
      if (inDegree.get(node.id) === 0) {
        queue.push({ id: node.id, level: 0 })
      }
    })

    const visited = new Set<string>()

    while (queue.length > 0) {
      const { id, level } = queue.shift()!

      if (visited.has(id)) continue
      visited.add(id)

      const node = nodes.find(n => n.id === id)
      if (!node) continue

      if (!nodesByLevel[level]) nodesByLevel[level] = []
      nodesByLevel[level].push(node)

      // Adiciona filhos no próximo nível
      const children = adjacencyList.get(id) || []
      children.forEach(childId => {
        queue.push({ id: childId, level: level + 1 })
      })
    }

    // Organiza nodes não visitados (desconectados) em uma coluna separada à direita
    const disconnectedNodes: typeof nodes = []
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        disconnectedNodes.push(node)
      }
    })

    // Se houver nodes desconectados, coloca em uma coluna à direita
    if (disconnectedNodes.length > 0) {
      const maxLevel = Math.max(...Object.keys(nodesByLevel).map(k => parseInt(k)))
      const disconnectedLevel = maxLevel + 2 // Coloca 2 níveis à direita
      nodesByLevel[disconnectedLevel] = disconnectedNodes
    }

    // Layout horizontal estilo n8n: esquerda → direita, top → bottom
    const horizontalSpacing = 500  // Espaço horizontal entre níveis (aumentado para melhor visualização)
    const verticalSpacing = 200    // Espaço vertical entre nodes do mesmo nível (aumentado)
    const startX = -240            // Posição X inicial (como no exemplo n8n)
    const startY = -32             // Posição Y inicial (como no exemplo n8n)

    const organizedNodes = nodes.map(node => {
      // Encontra o nível e índice do node
      let nodeLevel = 0
      let nodeIndexInLevel = 0

      for (const [level, levelNodes] of Object.entries(nodesByLevel)) {
        const index = levelNodes.findIndex(n => n.id === node.id)
        if (index !== -1) {
          nodeLevel = parseInt(level)
          nodeIndexInLevel = index
          break
        }
      }

      const levelNodeCount = nodesByLevel[nodeLevel]?.length || 1
      const levelHeight = (levelNodeCount - 1) * verticalSpacing
      const levelStartY = startY - (levelHeight / 2)

      return {
        ...node,
        position: {
          x: startX + (nodeLevel * horizontalSpacing),
          y: levelStartY + (nodeIndexInLevel * verticalSpacing)
        }
      }
    })

    setNodes(organizedNodes)

    // Fit view após organizar
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 100)
  }, [getNodes, getEdges, setNodes, fitView])

  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 200 })
  }, [zoomIn])

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 200 })
  }, [zoomOut])

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 })
  }, [fitView])

  return (
    <div
      className={cn(
        "absolute bottom-6 left-1/2 -translate-x-1/2 z-10",
        "flex items-center gap-1 rounded-xl",
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm",
        "border border-gray-200 dark:border-gray-700",
        "px-2 py-1.5 shadow-lg dark:shadow-black/20",
        className
      )}
    >
      {/* Tidy Up */}
      <Button
        size="sm"
        variant="ghost"
        onClick={handleTidyUp}
        className={cn(
          "h-8 px-3 text-xs rounded-lg",
          "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
          "dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10"
        )}
        title="Tidy Up Workflow (auto-organize)"
      >
        <Grid3x3 className="h-3.5 w-3.5 mr-1.5" />
        Tidy Up
      </Button>

      <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-gray-700" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-0.5">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomOut}
          className={cn(
            "h-8 w-8 rounded-lg",
            "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
            "dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10"
          )}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomIn}
          className={cn(
            "h-8 w-8 rounded-lg",
            "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
            "dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10"
          )}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-gray-700" />

      {/* Fit View */}
      <Button
        size="icon"
        variant="ghost"
        onClick={handleFitView}
        className={cn(
          "h-8 w-8 rounded-lg",
          "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
          "dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10"
        )}
        title="Fit View"
      >
        <Locate className="h-4 w-4" />
      </Button>

      {onToggleSidebar && (
        <>
          <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-gray-700" />

          {/* Add Node */}
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleSidebar}
            className={cn(
              "h-8 w-8 rounded-lg",
              "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
              "dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10"
            )}
            title="Add Node"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Fullscreen Toggle */}
      {(onToggleFullscreen || onExitFullscreen) && (
        <>
          <Separator orientation="vertical" className="h-6 bg-gray-300 dark:bg-gray-700" />

          <Button
            size="icon"
            variant="ghost"
            onClick={isFullscreen ? onExitFullscreen : onToggleFullscreen}
            className={cn(
              "h-8 w-8 rounded-lg",
              "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
              "dark:text-white/90 dark:hover:text-white dark:hover:bg-white/10"
            )}
            title={isFullscreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </>
      )}
    </div>
  )
}
