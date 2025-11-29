import React from 'react'
import { MetricCardProps } from '@/types'
import { cn } from '@/styles'

export function MetricCard({
  title,
  value,
  change,
  changeType,
  icon,
  className
}: MetricCardProps) {
  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  'text-sm font-medium',
                  changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {changeType === 'increase' ? '‘' : '“'} {Math.abs(change)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="w-8 h-8 text-gray-400">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}