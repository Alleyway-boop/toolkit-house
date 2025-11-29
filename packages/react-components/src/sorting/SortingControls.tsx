import React from 'react'
import { cn, buttonVariants } from '@/styles'
import {
  PlayIcon,
  PauseIcon,
  SquareIcon,
  SkipForwardIcon,
  SkipBackIcon,
  RotateCcwIcon
} from 'lucide-react'

interface SortingControlsProps {
  isPlaying: boolean
  isComplete: boolean
  currentStep: number
  totalSteps: number
  speed: number
  onPlay: () => void
  onPause: () => void
  onReset: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onSpeedChange: (speed: number) => void
  className?: string
  showStepInfo?: boolean
  showSpeedControl?: boolean
}

export function SortingControls({
  isPlaying,
  isComplete,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  className,
  showStepInfo = true,
  showSpeedControl = true
}: SortingControlsProps) {
  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onStepBackward}
            disabled={isPlaying || currentStep === 0}
            className={cn(
              buttonVariants.variant.outline,
              buttonVariants.size.sm,
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="Step backward"
          >
            <SkipBackIcon className="w-4 h-4" />
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className={cn(
              buttonVariants.variant.primary,
              buttonVariants.size.sm
            )}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <PauseIcon className="w-4 h-4" />
            ) : (
              <PlayIcon className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={onReset}
            disabled={isPlaying}
            className={cn(
              buttonVariants.variant.secondary,
              buttonVariants.size.sm,
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="Reset"
          >
            <RotateCcwIcon className="w-4 h-4" />
          </button>

          <button
            onClick={onStepForward}
            disabled={isPlaying || isComplete}
            className={cn(
              buttonVariants.variant.outline,
              buttonVariants.size.sm,
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            title="Step forward"
          >
            <SkipForwardIcon className="w-4 h-4" />
          </button>
        </div>

        {showSpeedControl && (
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">Speed:</label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-gray-600 min-w-[3rem]">
              {speed.toFixed(1)}x
            </span>
          </div>
        )}

        {showStepInfo && (
          <div className="text-sm text-gray-600 min-w-[5rem]">
            Step {currentStep} / {totalSteps}
          </div>
        )}
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}