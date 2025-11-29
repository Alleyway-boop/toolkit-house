import React from 'react'
import { cn } from '@/styles'

interface SortingArrayBarProps {
  value: number
  index: number
  isComparing?: boolean
  isSorted?: boolean
  isPivot?: boolean
  isSwapping?: boolean
  highlight?: boolean
  maxValue: number
  showValue?: boolean
  className?: string
}

export function SortingArrayBar({
  value,
  index,
  isComparing = false,
  isSorted = false,
  isPivot = false,
  isSwapping = false,
  highlight = false,
  maxValue,
  showValue = true,
  className
}: SortingArrayBarProps) {
  const height = maxValue > 0 ? (value / maxValue) * 100 : 0

  const getColorClass = () => {
    if (isSwapping) return 'bg-red-500'
    if (isPivot) return 'bg-purple-500'
    if (isSorted) return 'bg-green-500'
    if (isComparing) return 'bg-yellow-500'
    if (highlight) return 'bg-blue-600'
    return 'bg-blue-500'
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-end transition-all duration-300 rounded-t',
        getColorClass(),
        'hover:opacity-80',
        className
      )}
      style={{
        height: `${height}%`,
        width: '100%',
        minWidth: '8px',
        maxWidth: '80px'
      }}
      title={`Value: ${value} (Index: ${index})`}
    >
      {showValue && height > 15 && (
        <div className="text-xs text-white text-center pb-1 font-medium">
          {value}
        </div>
      )}
    </div>
  )
}