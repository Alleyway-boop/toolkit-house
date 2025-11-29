import React from 'react'
import { LinkedList } from '@toolkit-house/ts-utils/data-structures'
import { DataStructureVisualizationProps } from '@/types'
import { cn } from '@/styles'

interface LinkedListVisualizationProps extends DataStructureVisualizationProps<LinkedList<any>> {
  nodeWidth?: number
  nodeHeight?: number
  horizontalSpacing?: number
  onNodeClick?: (value: any, index: number) => void
}

export function LinkedListVisualization({
  data,
  nodeWidth = 80,
  nodeHeight = 60,
  horizontalSpacing = 40,
  onNodeClick,
  className
}: LinkedListVisualizationProps) {
  if (!data || data.count() === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8 border border-gray-200 rounded-lg bg-white', className)}>
        <p className="text-gray-500">Empty Linked List</p>
      </div>
    )
  }

  const nodes = []
  let current = data.head
  let index = 0

  while (current && index < data.count()) {
    nodes.push({
      value: current.value,
      index
    })
    current = current.next
    index++
  }

  const svgWidth = nodes.length * (nodeWidth + horizontalSpacing) + 100
  const svgHeight = nodeHeight + 60

  return (
    <div className={cn('w-full overflow-auto border border-gray-200 rounded-lg bg-white p-4', className)}>
      <svg width={svgWidth} height={svgHeight} className="w-full">
        {/* Draw nodes and pointers */}
        {nodes.map((node, index) => {
          const x = 50 + index * (nodeWidth + horizontalSpacing)
          const y = 30

          return (
            <g key={`node-${index}`}>
              {/* Node rectangle */}
              <rect
                x={x}
                y={y}
                width={nodeWidth}
                height={nodeHeight}
                className="fill-white stroke-blue-500 stroke-2 cursor-pointer hover:fill-blue-50"
                rx="8"
                onClick={() => onNodeClick?.(node.value, index)}
              />

              {/* Node value */}
              <text
                x={x + nodeWidth / 2}
                y={y + nodeHeight / 2 + 5}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-800 pointer-events-none select-none"
              >
                {String(node.value)}
              </text>

              {/* Node index */}
              <text
                x={x + nodeWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs fill-gray-500 pointer-events-none select-none"
              >
                [#{index}]
              </text>

              {/* Pointer to next node */}
              {index < nodes.length - 1 && (
                <>
                  {/* Arrow line */}
                  <line
                    x1={x + nodeWidth}
                    y1={y + nodeHeight / 2}
                    x2={x + nodeWidth + horizontalSpacing}
                    y2={y + nodeHeight / 2}
                    stroke="#9ca3af"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                </>
              )}

              {/* NULL pointer for last node */}
              {index === nodes.length - 1 && (
                <>
                  <line
                    x1={x + nodeWidth}
                    y1={y + nodeHeight / 2}
                    x2={x + nodeWidth + 30}
                    y2={y + nodeHeight / 2}
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />
                  <text
                    x={x + nodeWidth + 35}
                    y={y + nodeHeight / 2 + 5}
                    className="text-sm fill-gray-500 pointer-events-none select-none"
                  >
                    NULL
                  </text>
                </>
              )}
            </g>
          )
        })}

        {/* Head pointer */}
        <line
          x1={10}
          y1={30 + nodeHeight / 2}
          x2={45}
          y2={30 + nodeHeight / 2}
          stroke="#ef4444"
          strokeWidth="2"
          markerEnd="url(#arrowhead-red)"
        />
        <text
          x={10}
          y={30 + nodeHeight / 2 - 10}
          className="text-sm font-medium fill-red-600 pointer-events-none select-none"
        >
          HEAD
        </text>

        {/* Arrow markers definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#9ca3af" />
          </marker>
          <marker
            id="arrowhead-red"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
          </marker>
        </defs>
      </svg>

      {/* List information */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Size:</span> {data.count()}
          </div>
          <div>
            <span className="font-medium">Head:</span> {data.head?.value || 'NULL'}
          </div>
          <div>
            <span className="font-medium">Tail:</span> {data.tail?.value || 'NULL'}
          </div>
        </div>
      </div>
    </div>
  )
}