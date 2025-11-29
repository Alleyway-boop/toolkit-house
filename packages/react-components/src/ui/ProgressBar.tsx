import React from 'react'
import { ProgressBarProps } from '@/types'
import { cn, progressVariants } from '@/styles'

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  size = 'md',
  variant = 'default',
  className
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full', progressVariants.size[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            progressVariants.variant[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}