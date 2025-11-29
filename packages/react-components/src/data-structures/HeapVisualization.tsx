import React from 'react'
import { BinaryHeap } from '@toolkit-house/ts-utils/data-structures'
import { DataStructureVisualizationProps } from '@/types'
import { cn } from '@/styles'

interface HeapVisualizationProps extends DataStructureVisualizationProps<BinaryHeap<any>> {
  nodeSpacing?: number
  levelHeight?: number
  showConnections?: boolean
  onNodeClick?: (value: any, index: number) => void
}

export function HeapVisualization({
  data,
  nodeSpacing = 60,
  levelHeight = 80,
  showConnections = true,
  onNodeClick,
  className
}: HeapVisualizationProps) {
  if (!data || data.count() === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8 border border-gray-200 rounded-lg bg-white', className)}>
        <p className="text-gray-500">Empty Heap</p>
      </div>
    )
  }

  // Convert heap to array for visualization
  const heapArray = Array.from(data as any[])

  // Calculate positions for heap nodes (tree layout)
  const treeLayout = heapArray.map((value, index) => {
    const level = Math.floor(Math.log2(index + 1))
    const positionInLevel = index - (Math.pow(2, level) - 1)
    const nodesInLevel = Math.pow(2, level)

    const x = (positionInLevel - nodesInLevel / 2 + 0.5) * nodeSpacing * (2 / (level + 1)) + 300
    const y = level * levelHeight + 50

    return { value, index, x, y }
  })

  const svgWidth = 600
  const svgHeight = Math.max(300, treeLayout[treeLayout.length - 1]?.y + 100)

  return (
    <div className={cn('w-full overflow-auto border border-gray-200 rounded-lg bg-white p-4', className)}>
      <svg width={svgWidth} height={svgHeight} className="w-full mx-auto">
        {/* Draw connections */}
        {showConnections && treeLayout.map((node, index) => {
          if (index === 0) return null

          const parentIndex = Math.floor((index - 1) / 2)
          const parent = treeLayout[parentIndex]

          return (
            <line
              key={`edge-${index}`}
              x1={parent.x}
              y1={parent.y}
              x2={node.x}
              y2={node.y}
              stroke="#9ca3af"
              strokeWidth="2"
            />
          )
        })}

        {/* Draw nodes */}
        {treeLayout.map((node, index) => (
          <g key={`node-${index}`}>
            <circle
              cx={node.x}
              cy={node.y}
              r="25"
              className="fill-white stroke-purple-500 stroke-2 cursor-pointer hover:fill-purple-50"
              onClick={() => onNodeClick?.(node.value, index)}
            />

            {/* Node value */}
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              className="text-sm font-medium fill-gray-800 pointer-events-none select-none"
            >
              {String(node.value)}
            </text>

            {/* Node index */}
            <text
              x={node.x}
              y={node.y + 40}
              textAnchor="middle"
              className="text-xs fill-gray-500 pointer-events-none select-none"
            >
              [#{index}]
            </text>
          </g>
        ))}
      </svg>

      {/* Heap information */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <span className="font-medium">Size:</span> {data.count()}
          </div>
          <div>
            <span className="font-medium">Type:</span> {data.type || 'Binary Heap'}
          </div>
          <div>
            <span className="font-medium">Root:</span> {heapArray[0] || 'EMPTY'}
          </div>
          <div>
            <span className="font-medium">Height:</span> {Math.floor(Math.log2(data.count())) + 1}
          </div>
        </div>
      </div>
    </div>
  )
}