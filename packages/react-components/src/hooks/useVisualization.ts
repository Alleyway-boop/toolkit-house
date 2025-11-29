import { useState, useCallback, useRef, useEffect } from 'react'
import { VisualizationState, VisualizationStep, AnimationConfig } from '@/types'

const defaultAnimationConfig: AnimationConfig = {
  duration: 500,
  easing: 'ease-in-out',
  delay: 0
}

export function useVisualization<T = any>(
  initialData: T[],
  steps: VisualizationStep<T>[],
  animationConfig: Partial<AnimationConfig> = {}
) {
  const [state, setState] = useState<VisualizationState<T>>({
    currentStep: 0,
    steps,
    isPlaying: false,
    speed: 1,
    data: initialData,
    currentData: [...initialData],
    highlightedIndices: new Set(),
    comparingIndices: new Set()
  })

  const config = { ...defaultAnimationConfig, ...animationConfig }
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  const executeStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= state.steps.length) return

    const step = state.steps[stepIndex]
    setState(prevState => {
      const newState = { ...prevState, currentStep: stepIndex }

      // Update highlighted and comparing indices
      newState.highlightedIndices = new Set()
      newState.comparingIndices = new Set()

      if (step.indices) {
        switch (step.type) {
          case 'compare':
            step.indices.forEach(idx => newState.comparingIndices.add(idx))
            break
          case 'highlight':
          case 'swap':
          case 'insert':
          case 'delete':
          case 'complete':
            step.indices.forEach(idx => newState.highlightedIndices.add(idx))
            break
        }
      }

      // Update current data if step has new data
      if (step.elements) {
        newState.currentData = [...step.elements]
      }

      return newState
    })
  }, [state.steps.length])

  const play = useCallback(() => {
    if (state.currentStep >= state.steps.length - 1) {
      // Restart from beginning if at the end
      setState(prev => ({ ...prev, currentStep: -1 }))
    }

    setState(prev => ({ ...prev, isPlaying: true }))
  }, [state.currentStep, state.steps.length])

  const pause = useCallback(() => {
    clearTimers()
    setState(prev => ({ ...prev, isPlaying: false }))
  }, [clearTimers])

  const reset = useCallback(() => {
    clearTimers()
    setState(prev => ({
      ...prev,
      currentStep: 0,
      currentData: [...prev.data],
      isPlaying: false,
      highlightedIndices: new Set(),
      comparingIndices: new Set()
    }))
  }, [clearTimers])

  const stepForward = useCallback(() => {
    if (state.currentStep < state.steps.length - 1) {
      executeStep(state.currentStep + 1)
    }
  }, [state.currentStep, state.steps.length, executeStep])

  const stepBackward = useCallback(() => {
    if (state.currentStep > 0) {
      executeStep(state.currentStep - 1)
    }
  }, [state.currentStep, executeStep])

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < state.steps.length) {
      executeStep(stepIndex)
    }
  }, [state.steps.length, executeStep])

  const setSpeed = useCallback((speed: number) => {
    setState(prev => ({ ...prev, speed: Math.max(0.1, Math.min(5, speed)) }))
  }, [])

  // Auto-play effect
  useEffect(() => {
    if (state.isPlaying && state.currentStep < state.steps.length - 1) {
      const delay = config.duration / state.speed + config.delay

      timeoutRef.current = setTimeout(() => {
        executeStep(state.currentStep + 1)
      }, delay)
    } else if (state.isPlaying && state.currentStep >= state.steps.length - 1) {
      // Stop playing at the end
      setState(prev => ({ ...prev, isPlaying: false }))
    }

    return () => clearTimers()
  }, [state.isPlaying, state.currentStep, state.steps.length, state.speed, config.duration, config.delay, executeStep, clearTimers])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimers()
  }, [clearTimers])

  return {
    state,
    controls: {
      play,
      pause,
      reset,
      stepForward,
      stepBackward,
      goToStep,
      setSpeed,
      isPlaying: state.isPlaying,
      isComplete: state.currentStep >= state.steps.length - 1,
      progress: state.steps.length > 0 ? (state.currentStep / (state.steps.length - 1)) * 100 : 0
    }
  }
}