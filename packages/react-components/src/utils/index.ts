import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { VisualizationTheme } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const defaultTheme: VisualizationTheme = {
  primary: '#3b82f6',
  secondary: '#6b7280',
  accent: '#f59e0b',
  background: '#ffffff',
  text: '#111827',
  border: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444'
}

export function mergeTheme(theme: Partial<VisualizationTheme> = {}): VisualizationTheme {
  return { ...defaultTheme, ...theme }
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatTime(ms: number): string {
  if (ms >= 1000) {
    return (ms / 1000).toFixed(2) + 's'
  }
  return ms.toFixed(2) + 'ms'
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
}

export function generateRandomArray(length: number, min: number, max: number): number[] {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export function generateNearlySortedArray(length: number, disorder: number = 0.1): number[] {
  const array = Array.from({ length }, (_, i) => i + 1)
  const swaps = Math.floor(length * disorder)

  for (let i = 0; i < swaps; i++) {
    const idx1 = Math.floor(Math.random() * length)
    const idx2 = Math.floor(Math.random() * length)
    ;[array[idx1], array[idx2]] = [array[idx2], array[idx1]]
  }

  return array
}

export function generateReversedArray(length: number): number[] {
  return Array.from({ length }, (_, i) => length - i)
}

export function getAlgorithmColor(algorithm: string): string {
  const colors: Record<string, string> = {
    quick: '#10b981',
    merge: '#f59e0b',
    heap: '#8b5cf6',
    bubble: '#ef4444',
    insertion: '#3b82f6',
    selection: '#ec4899'
  }
  return colors[algorithm] || '#6b7280'
}

export function calculateComplexity(n: number, complexity: 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(n³)'): number {
  switch (complexity) {
    case 'O(1)':
      return 1
    case 'O(log n)':
      return Math.log2(n)
    case 'O(n)':
      return n
    case 'O(n log n)':
      return n * Math.log2(n)
    case 'O(n²)':
      return n * n
    case 'O(n³)':
      return n * n * n
    default:
      return n
  }
}