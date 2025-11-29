import React from 'react'
import { Stack } from '@toolkit-house/ts-utils/data-structures'
import { DataStructureVisualizationProps } from '@/types'
import { cn } from '@/styles'

interface StackVisualizationProps extends DataStructureVisualizationProps<Stack<any>> {
  itemWidth?: number
  itemHeight?: number
  maxItems?: number
  showPointers?: boolean
}

export function StackVisualization({
  data,
  itemWidth = 120,
  itemHeight = 50,
  maxItems = 10,
  showPointers = true,
  className
}: StackVisualizationProps) {
  if (!data || data.count() === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8 border border-gray-200 rounded-lg bg-white', className)}>
        <p className="text-gray-500">Empty Stack</p>
      </div>
    )
  }

  // Get stack items (convert to array for visualization)
  const items = Array.from(data as any[])
  const displayItems = items.slice(-maxItems) // Show last N items

  const svgHeight = displayItems.length * (itemHeight + 10) + 100
  const svgWidth = itemWidth + 120

  return (
    <div className={cn('w-full border border-gray-200 rounded-lg bg-white p-4', className)}>
      <svg width={svgWidth} height={svgHeight} className="w-full mx-auto">
        {displayItems.map((item, index) => {
          const actualIndex = items.length - displayItems.length + index
          const x = 60
          const y = svgHeight - 50 - (index + 1) * (itemHeight + 10)

          return (
            <g key={`item-${actualIndex}`}>
              {/* Stack item */}
              <rect
                x={x}
                y={y}
                width={itemWidth}
                height={itemHeight}
                className="fill-white stroke-blue-500 stroke-2"
                rx="6"
              />

              {/* Item value */}
              <text
                x={x + itemWidth / 2}
                y={y + itemHeight / 2 + 5}
                textAnchor="middle"
                className="text-sm font-medium fill-gray-800"
              >
                {String(item)}
              </text>

              {/* Item index */}
              <text
                x={x - 10}
                y={y + itemHeight / 2 + 5}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                [{actualIndex}]
              </text>
            </g>
          )
        })}

        {/* Top pointer */}
        {showPointers && (
          <>
            <line
              x1={10}
              y1={svgHeight - 50 - (displayItems.length * (itemHeight + 10)) + itemHeight / 2}
              x2={45}
              y2={svgHeight - 50 - (displayItems.length * (itemHeight + 10)) + itemHeight / 2}
              stroke="#ef4444"
              strokeWidth="2"
              markerEnd="url(#arrowhead-red)"
            />
            <text
              x={10}
              y={svgHeight - 55 - (displayItems.length * (itemHeight + 10)) + itemHeight / 2}
              className="text-sm font-medium fill-red-600"
            >
              TOP
            </text>
          </>
        )}

        {/* Stack base line */}
        <line
          x1={60}
          y1={svgHeight - 40}
          x2={60 + itemWidth}
          y2={svgHeight - 40}
          stroke="#374151"
          strokeWidth="3"
        />

        {/* Arrow markers */}
        <defs>
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

      {/* Stack information */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Size:</span> {data.count()}
          </div>
          <div>
            <span className="font-medium">Top:</span> {data.peek() || 'EMPTY'}
          </div>
          <div>
            <span className="font-medium">Capacity:</span> {data.count()} / {maxItems} shown
          </div>
        </div>
      </div>
    </div>
  )
}