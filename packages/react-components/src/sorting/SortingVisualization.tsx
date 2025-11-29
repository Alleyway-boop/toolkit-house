import React, { useEffect, useMemo } from 'react'
import { SortingVisualizationProps } from '@/types'
import { useVisualization } from '@/hooks'
import { useSortingSteps } from '@/hooks/useSortingSteps'
import { cn, visualizationVariants } from '@/styles'
import { PlayIcon, PauseIcon, StopIcon, SkipForwardIcon, SkipBackIcon } from 'lucide-react'

export function SortingVisualization<T = any>({
  data,
  algorithm,
  autoPlay = false,
  speed = 1,
  showControls = true,
  showMetrics = true,
  theme = {},
  animationConfig = {},
  onStepChange,
  onComplete,
  className
}: SortingVisualizationProps<T>) {
  const { generateSteps } = useSortingSteps<T>()

  const steps = useMemo(() => {
    return generateSteps(algorithm, data)
  }, [algorithm, data, generateSteps])

  const { state, controls } = useVisualization(data, steps, animationConfig)

  useEffect(() => {
    if (autoPlay && !controls.isPlaying) {
      controls.play()
    }
  }, [autoPlay, controls])

  useEffect(() => {
    onStepChange?.(state.currentStep, state)

    if (controls.isComplete) {
      onComplete?.({
        sorted: state.currentData,
        metrics: {
          comparisons: state.steps.filter(s => s.type === 'compare').length,
          swaps: state.steps.filter(s => s.type === 'swap').length,
          timeMs: 0,
          memory: 0
        }
      } as any)
    }
  }, [state.currentStep, controls.isComplete, onStepChange, onComplete])

  const getItemColor = (index: number) => {
    if (state.highlightedIndices.has(index)) {
      return 'bg-green-500'
    }
    if (state.comparingIndices.has(index)) {
      return 'bg-yellow-500'
    }
    return 'bg-blue-500'
  }

  const maxValue = Math.max(...data.map(d => Number(d) || 0))

  return (
    <div className={cn(visualizationVariants.container, className)}>
      {showControls && (
        <div className={visualizationVariants.controls}>
          <div className="flex items-center space-x-2">
            <button
              onClick={controls.stepBackward}
              disabled={controls.isPlaying || state.currentStep === 0}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Step backward"
            >
              <SkipBackIcon className="w-4 h-4" />
            </button>

            <button
              onClick={controls.isPlaying ? controls.pause : controls.play}
              className="p-2 rounded hover:bg-gray-200"
              title={controls.isPlaying ? 'Pause' : 'Play'}
            >
              {controls.isPlaying ? (
                <PauseIcon className="w-4 h-4" />
              ) : (
                <PlayIcon className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={controls.reset}
              disabled={controls.isPlaying}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Reset"
            >
              <StopIcon className="w-4 h-4" />
            </button>

            <button
              onClick={controls.stepForward}
              disabled={controls.isPlaying || controls.isComplete}
              className="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Step forward"
            >
              <SkipForwardIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Speed:</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={state.speed}
                onChange={(e) => controls.setSpeed(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="text-sm">{state.speed.toFixed(1)}x</span>
            </div>

            <div className="text-sm text-gray-600">
              Step {state.currentStep + 1} / {state.steps.length}
            </div>
          </div>

          <div className="w-48">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(controls.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                style={{ width: `${controls.progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className={visualizationVariants.content}>
        <div className="flex items-end justify-center space-x-1 h-64">
          {state.currentData.map((value, index) => {
            const height = maxValue > 0 ? (Number(value) / maxValue) * 100 : 0
            return (
              <div
                key={index}
                className={cn(
                  'transition-all duration-300 rounded-t',
                  getItemColor(index),
                  'hover:opacity-80'
                )}
                style={{
                  height: `${height}%`,
                  width: `${100 / state.currentData.length}%`,
                  minWidth: '4px',
                  maxWidth: '60px'
                }}
                title={`${value} (Index: ${index})`}
              >
                {state.currentData.length <= 20 && (
                  <div className="text-xs text-white text-center pt-1">
                    {value}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {showMetrics && state.steps[state.currentStep]?.message && (
          <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
            {state.steps[state.currentStep].message}
          </div>
        )}
      </div>

      {showMetrics && (
        <div className={visualizationVariants.footer}>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Default</span>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Algorithm: <span className="font-medium">{algorithm}</span>
          </div>
        </div>
      )}
    </div>
  )
}