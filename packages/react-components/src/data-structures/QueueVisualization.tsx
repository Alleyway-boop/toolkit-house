import React from 'react'
import { Queue } from '@toolkit-house/ts-utils/data-structures'
import { DataStructureVisualizationProps } from '@/types'
import { cn } from '@/styles'

interface QueueVisualizationProps extends DataStructureVisualizationProps<Queue<any>> {
  itemWidth?: number
  itemHeight?: number
  horizontalSpacing?: number
  showPointers?: boolean
}

export function QueueVisualization({
  data,
  itemWidth = 80,
  itemHeight = 60,
  horizontalSpacing = 30,
  showPointers = true,
  className
}: QueueVisualizationProps) {
  if (!data || data.count() === 0) {
    return (
      <div className={cn('flex items-center justify-center p-8 border border-gray-200 rounded-lg bg-white', className)}>
        <p className="text-gray-500">Empty Queue</p>
      </div>
    )
  }

  // Get queue items (convert to array for visualization)
  const items = Array.from(data as any[])

  const svgWidth = items.length * (itemWidth + horizontalSpacing) + 100
  const svgHeight = itemHeight + 80

  return (
    <div className={cn('w-full border border-gray-200 rounded-lg bg-white p-4', className)}>
      <svg width={svgWidth} height={svgHeight} className="w-full mx-auto">
        {items.map((item, index) => {
          const x = 50 + index * (itemWidth + horizontalSpacing)
          const y = 40

          return (
            <g key={`item-${index}`}>
              {/* Queue item */}
              <rect
                x={x}
                y={y}
                width={itemWidth}
                height={itemHeight}
                className="fill-white stroke-green-500 stroke-2"
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
                x={x + itemWidth / 2}
                y={y - 5}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                [#{index}]
              </text>
            </g>
          )
        })}

        {/* Front pointer */}
        {showPointers && items.length > 0 && (
          <>
            <line
              x1={10}
              y1={40 + itemHeight / 2}
              x2={45}
              y2={40 + itemHeight / 2}
              stroke="#10b981"
              strokeWidth="2"
              markerEnd="url(#arrowhead-green)"
            />
            <text
              x={10}
              y={40 + itemHeight / 2 - 10}
              className="text-sm font-medium fill-green-600"
            >
              FRONT
            </text>
          </>
        )}

        {/* Rear pointer */}
        {showPointers && items.length > 1 && (
          <>
            <line
              x1={50 + (items.length - 1) * (itemWidth + horizontalSpacing) + itemWidth}
              y1={40 + itemHeight / 2}
              x2={50 + (items.length - 1) * (itemWidth + horizontalSpacing) + itemWidth + 35}
              y2={40 + itemHeight / 2}
              stroke="#f59e0b"
              strokeWidth="2"
              markerEnd="url(#arrowhead-orange)"
            />
            <text
              x={50 + (items.length - 1) * (itemWidth + horizontalSpacing) + itemWidth + 40}
              y={40 + itemHeight / 2 + 5}
              className="text-sm font-medium fill-orange-600"
            >
              REAR
            </text>
          </>
        )}

        {/* Arrow markers */}
        <defs>
          <marker
            id="arrowhead-green"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
          </marker>
          <marker
            id="arrowhead-orange"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#f59e0b" />
          </marker>
        </defs>
      </svg>

      {/* Queue information */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="font-medium">Size:</span> {data.count()}
          </div>
          <div>
            <span className="font-medium">Front:</span> {items[0] || 'EMPTY'}
          </div>
          <div>
            <span className="font-medium">Rear:</span> {items[items.length - 1] || 'EMPTY'}
          </div>
        </div>
      </div>
    </div>
  )
}