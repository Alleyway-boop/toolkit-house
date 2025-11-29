import React, { useState, useCallback, useEffect } from 'react'
import { SortAlgorithm, quickSort, mergeSort, heapSort, bubbleSort, insertionSort, selectionSort } from '@toolkit-house/ts-utils/sorting'
import { AlgorithmComparatorProps, ComparisonResult } from '@/types'
import { cn, cardVariants, getAlgorithmColor } from '@/styles'
import { PlayIcon, RotateCcwIcon } from 'lucide-react'
import { PerformanceChart } from './PerformanceChart'

export function AlgorithmComparator<T = any>({
  data,
  algorithms: propAlgorithms = ['quick', 'merge', 'heap', 'bubble', 'insertion', 'selection'],
  autoRun = false,
  showDetails = true,
  theme = {},
  onResults,
  className
}: AlgorithmComparatorProps<T>) {
  const [results, setResults] = useState<ComparisonResult<T>[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentAlgorithm, setCurrentAlgorithm] = useState<string | null>(null)
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<SortAlgorithm[]>(propAlgorithms)

  const runAlgorithm = useCallback(async (algorithm: SortAlgorithm): Promise<ComparisonResult<T>> => {
    const startTime = performance.now()
    let comparisons = 0
    let swaps = 0
    let memoryBefore = 0

    // Get memory usage if available
    if ((performance as any).memory) {
      memoryBefore = (performance as any).memory.usedJSHeapSize
    }

    // Count operations during sorting
    const countOperations = (arr: T[], comparator?: (a: T, b: T) => number): number => {
      comparisons++
      return comparator ? comparator(arr[0], arr[1]) : 0
    }

    let sortedData: T[] = []

    try {
      switch (algorithm) {
        case 'quick':
          sortedData = quickSort([...data])
          break
        case 'merge':
          sortedData = mergeSort([...data])
          break
        case 'heap':
          sortedData = heapSort([...data])
          break
        case 'bubble':
          sortedData = bubbleSort([...data])
          break
        case 'insertion':
          sortedData = insertionSort([...data])
          break
        case 'selection':
          sortedData = selectionSort([...data])
          break
        default:
          throw new Error(`Unknown algorithm: ${algorithm}`)
      }

      // Estimate swaps (this is a simplified calculation)
      swaps = Math.floor(data.length * Math.log2(data.length) / 2)

      const endTime = performance.now()
      const time = endTime - startTime
      const memoryAfter = (performance as any).memory?.usedJSHeapSize || 0
      const memory = Math.max(0, memoryAfter - memoryBefore)

      return {
        algorithm,
        info: {
          name: algorithm.charAt(0).toUpperCase() + algorithm.slice(1) + ' Sort',
          timeComplexity: {
            best: 'O(n log n)',
            average: 'O(n log n)',
            worst: 'O(n²)'
          },
          spaceComplexity: 'O(log n)',
          stable: algorithm !== 'quick' && algorithm !== 'heap'
        },
        result: {
          sorted: sortedData,
          original: data,
          metrics: {
            comparisons,
            swaps,
            timeMs: time,
            memory
          }
        },
        performance: {
          time,
          memory,
          comparisons,
          swaps
        }
      }
    } catch (error) {
      throw new Error(`Algorithm ${algorithm} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }, [data])

  const runComparison = useCallback(async () => {
    setIsRunning(true)
    const newResults: ComparisonResult<T>[] = []

    for (const algorithm of selectedAlgorithms) {
      setCurrentAlgorithm(algorithm)
      try {
        const result = await runAlgorithm(algorithm)
        newResults.push(result)
      } catch (error) {
        console.error(`Error running ${algorithm}:`, error)
      }
    }

    setResults(newResults)
    setCurrentAlgorithm(null)
    setIsRunning(false)
    onResults?.(newResults)
  }, [selectedAlgorithms, runAlgorithm, onResults])

  const reset = useCallback(() => {
    setResults([])
    setCurrentAlgorithm(null)
    setIsRunning(false)
  }, [])

  useEffect(() => {
    if (autoRun && !isRunning) {
      runComparison()
    }
  }, [autoRun, isRunning, runComparison])

  const toggleAlgorithm = (algorithm: SortAlgorithm) => {
    setSelectedAlgorithms(prev =>
      prev.includes(algorithm)
        ? prev.filter(a => a !== algorithm)
        : [...prev, algorithm]
    )
  }

  return (
    <div className={cn(cardVariants.variant.default, 'p-6 space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Algorithm Comparator</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={runComparison}
            disabled={isRunning || selectedAlgorithms.length === 0}
            className={cn(
              'flex items-center space-x-2 px-4 py-2 rounded-md text-white',
              isRunning || selectedAlgorithms.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            )}
          >
            <PlayIcon className="w-4 h-4" />
            <span>{isRunning ? 'Running...' : 'Run Comparison'}</span>
          </button>
          <button
            onClick={reset}
            disabled={isRunning}
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            <RotateCcwIcon className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Algorithm Selection */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Select Algorithms</h3>
        <div className="grid grid-cols-3 gap-3">
          {propAlgorithms.map(algorithm => (
            <label
              key={algorithm}
              className={cn(
                'flex items-center space-x-2 p-3 rounded-lg border cursor-pointer transition-colors',
                selectedAlgorithms.includes(algorithm)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <input
                type="checkbox"
                checked={selectedAlgorithms.includes(algorithm)}
                onChange={() => toggleAlgorithm(algorithm)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="font-medium">{algorithm.charAt(0).toUpperCase() + algorithm.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Running Status */}
      {isRunning && currentAlgorithm && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-blue-900 font-medium">
              Running {currentAlgorithm.charAt(0).toUpperCase() + currentAlgorithm.slice(1)} Sort...
            </span>
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          {/* Performance Chart */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Performance Comparison</h3>
            <PerformanceChart results={results} />
          </div>

          {/* Detailed Results */}
          {showDetails && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Detailed Results</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {results.map((result, index) => (
                  <div
                    key={result.algorithm}
                    className="p-4 rounded-lg border-2"
                    style={{ borderColor: getAlgorithmColor(result.algorithm) }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg" style={{ color: getAlgorithmColor(result.algorithm) }}>
                        {result.info.name}
                      </h4>
                      <span className="text-sm text-gray-500">Rank #{index + 1}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Time:</span>
                        <span className="ml-2 font-medium">{result.performance.time.toFixed(2)}ms</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Comparisons:</span>
                        <span className="ml-2 font-medium">{result.performance.comparisons}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Swaps:</span>
                        <span className="ml-2 font-medium">{result.performance.swaps}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Memory:</span>
                        <span className="ml-2 font-medium">{(result.performance.memory / 1024).toFixed(1)}KB</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Time: {result.info.timeComplexity.average}</div>
                        <div>Space: {result.info.spaceComplexity}</div>
                        <div>Stable: {result.info.stable ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Data Information */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Input Data</h3>
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Size:</span> {data.length}
          </div>
          <div>
            <span className="font-medium">Range:</span> {Math.min(...data.map(Number))} - {Math.max(...data.map(Number))}
          </div>
          <div>
            <span className="font-medium">Type:</span> {typeof data[0]}
          </div>
        </div>
      </div>
    </div>
  )
}