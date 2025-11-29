import React from 'react'
import { ComparisonResult } from '@/types'
import { cn, getAlgorithmColor } from '@/styles'

interface PerformanceChartProps {
  results: ComparisonResult<any>[]
  className?: string
}

export function PerformanceChart({ results, className }: PerformanceChartProps) {
  if (results.length === 0) {
    return (
      <div className={cn('p-8 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg', className)}>
        No algorithm results to display
      </div>
    )
  }

  const maxTime = Math.max(...results.map(r => r.performance.time))
  const maxComparisons = Math.max(...results.map(r => r.performance.comparisons))
  const maxSwaps = Math.max(...results.map(r => r.performance.swaps))

  const normalizeValue = (value: number, maxValue: number) =>
    maxValue > 0 ? (value / maxValue) * 100 : 0

  return (
    <div className={cn('space-y-6', className)}>
      {/* Time Performance Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Execution Time (ms)</h4>
        <div className="space-y-2">
          {results
            .sort((a, b) => a.performance.time - b.performance.time)
            .map((result, index) => {
              const width = normalizeValue(result.performance.time, maxTime)
              return (
                <div key={result.algorithm} className="flex items-center space-x-3">
                  <div className="w-24 text-sm font-medium text-gray-700 truncate">
                    {result.info.name}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className="h-6 rounded-full transition-all duration-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{
                          width: `${width}%`,
                          backgroundColor: getAlgorithmColor(result.algorithm)
                        }}
                      >
                        {result.performance.time.toFixed(2)}ms
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 w-8 text-right">
                    #{index + 1}
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Comparisons Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Comparisons</h4>
        <div className="space-y-2">
          {results
            .sort((a, b) => a.performance.comparisons - b.performance.comparisons)
            .map((result, index) => {
              const width = normalizeValue(result.performance.comparisons, maxComparisons)
              return (
                <div key={result.algorithm} className="flex items-center space-x-3">
                  <div className="w-24 text-sm font-medium text-gray-700 truncate">
                    {result.info.name}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className="h-6 rounded-full transition-all duration-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{
                          width: `${width}%`,
                          backgroundColor: getAlgorithmColor(result.algorithm)
                        }}
                      >
                        {result.performance.comparisons.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 w-8 text-right">
                    #{index + 1}
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Swaps Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Swaps</h4>
        <div className="space-y-2">
          {results
            .sort((a, b) => a.performance.swaps - b.performance.swaps)
            .map((result, index) => {
              const width = normalizeValue(result.performance.swaps, maxSwaps)
              return (
                <div key={result.algorithm} className="flex items-center space-x-3">
                  <div className="w-24 text-sm font-medium text-gray-700 truncate">
                    {result.info.name}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className="h-6 rounded-full transition-all duration-500 flex items-center justify-center text-xs text-white font-medium"
                        style={{
                          width: `${width}%`,
                          backgroundColor: getAlgorithmColor(result.algorithm)
                        }}
                      >
                        {result.performance.swaps.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 w-8 text-right">
                    #{index + 1}
                  </div>
                </div>
              )
            })}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {Math.min(...results.map(r => r.performance.time)).toFixed(2)}ms
          </div>
          <div className="text-sm text-gray-600">Fastest Time</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.min(...results.map(r => r.performance.comparisons)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Fewest Comparisons</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.min(...results.map(r => r.performance.swaps)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Fewest Swaps</div>
        </div>
      </div>
    </div>
  )
}