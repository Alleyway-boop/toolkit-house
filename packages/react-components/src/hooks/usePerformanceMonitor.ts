import { useState, useCallback, useRef, useEffect } from 'react'

interface PerformanceMetrics {
  timestamp: number
  memoryUsage: number
  executionTime: number
  operations: number
}

interface PerformanceData {
  algorithm: string
  metrics: PerformanceMetrics[]
  averageMemory: number
  averageTime: number
  totalOperations: number
  peakMemory: number
}

export function usePerformanceMonitor() {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [data, setData] = useState<PerformanceData[]>([])
  const currentMetrics = useRef<PerformanceMetrics[]>([])
  const startTime = useRef<number>(0)
  const operationCount = useRef<number>(0)

  const startMonitoring = useCallback((algorithm: string) => {
    setIsMonitoring(true)
    startTime.current = performance.now()
    operationCount.current = 0
    currentMetrics.current = []

    // Set up periodic monitoring
    const monitorInterval = setInterval(() => {
      if (!isMonitoring) return

      const timestamp = performance.now() - startTime.current
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0

      currentMetrics.current.push({
        timestamp,
        memoryUsage,
        executionTime: timestamp,
        operations: operationCount.current
      })
    }, 16) // Monitor every 16ms (60fps)

    return () => clearInterval(monitorInterval)
  }, [isMonitoring])

  const stopMonitoring = useCallback((algorithm: string) => {
    setIsMonitoring(false)

    if (currentMetrics.current.length === 0) return

    const totalTime = performance.now() - startTime.current
    const metrics = currentMetrics.current

    const performanceData: PerformanceData = {
      algorithm,
      metrics,
      averageMemory: metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / metrics.length,
      averageTime: totalTime,
      totalOperations: operationCount.current,
      peakMemory: Math.max(...metrics.map(m => m.memoryUsage))
    }

    setData(prev => {
      const existingIndex = prev.findIndex(d => d.algorithm === algorithm)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = performanceData
        return updated
      }
      return [...prev, performanceData]
    })

    currentMetrics.current = []
  }, [])

  const recordOperation = useCallback(() => {
    if (isMonitoring) {
      operationCount.current++
    }
  }, [isMonitoring])

  const reset = useCallback(() => {
    setData([])
    currentMetrics.current = []
    operationCount.current = 0
  }, [])

  const getComparisonData = useCallback(() => {
    return data.map(d => ({
      algorithm: d.algorithm,
      time: d.averageTime,
      memory: d.averageMemory,
      operations: d.totalOperations,
      efficiency: d.totalOperations / d.averageTime
    }))
  }, [data])

  return {
    isMonitoring,
    data,
    startMonitoring,
    stopMonitoring,
    recordOperation,
    reset,
    getComparisonData
  }
}