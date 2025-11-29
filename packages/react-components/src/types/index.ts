import { ReactNode } from 'react'
import { SortAlgorithm, SortResult, AlgorithmInfo } from '@toolkit-house/ts-utils/sorting'

export interface VisualizationTheme {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
  success: string
  warning: string
  error: string
}

export interface AnimationConfig {
  duration: number
  easing: string
  delay: number
}

export interface VisualizationStep<T = any> {
  type: 'compare' | 'swap' | 'insert' | 'delete' | 'highlight' | 'complete'
  elements: T[]
  indices?: number[]
  message?: string
  data?: any
}

export interface VisualizationState<T = any> {
  currentStep: number
  steps: VisualizationStep<T>[]
  isPlaying: boolean
  speed: number
  data: T[]
  currentData: T[]
  highlightedIndices: Set<number>
  comparingIndices: Set<number>
}

export interface SortingVisualizationProps<T = any> {
  data: T[]
  algorithm: SortAlgorithm
  autoPlay?: boolean
  speed?: number
  showControls?: boolean
  showMetrics?: boolean
  theme?: Partial<VisualizationTheme>
  animationConfig?: Partial<AnimationConfig>
  onStepChange?: (step: number, state: VisualizationState<T>) => void
  onComplete?: (result: SortResult<T>) => void
  className?: string
}

export interface DataStructureVisualizationProps<T = any> {
  data: T
  theme?: Partial<VisualizationTheme>
  animationConfig?: Partial<AnimationConfig>
  className?: string
  interactive?: boolean
}

export interface AlgorithmComparatorProps<T = any> {
  data: T[]
  algorithms?: SortAlgorithm[]
  autoRun?: boolean
  showDetails?: boolean
  theme?: Partial<VisualizationTheme>
  onResults?: (results: ComparisonResult<T>[]) => void
  className?: string
}

export interface ComparisonResult<T = any> {
  algorithm: SortAlgorithm
  info: AlgorithmInfo
  result: SortResult<T>
  performance: {
    time: number
    memory: number
    comparisons: number
    swaps: number
  }
}

export interface ComponentSize {
  width: number
  height: number
}

export interface RenderConfig {
  itemHeight?: number
  itemSpacing?: number
  showValues?: boolean
  colorScheme?: 'algorithm' | 'value' | 'custom'
  customColors?: (value: any, index: number) => string
}

export interface BaseVisualizationProps {
  width?: number
  height?: number
  responsive?: boolean
  className?: string
}

export interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  children: ReactNode
  onClick?: () => void
  className?: string
}

export interface CardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  footer?: ReactNode
  variant?: 'default' | 'outlined' | 'elevated'
  className?: string
}

export interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon?: ReactNode
  className?: string
}