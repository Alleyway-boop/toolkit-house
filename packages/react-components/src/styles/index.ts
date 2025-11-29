import { twMerge } from 'tailwind-merge'
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const buttonVariants = {
  variant: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
}

export const cardVariants = {
  variant: {
    default: 'bg-white border border-gray-200 rounded-lg shadow-sm',
    outlined: 'bg-white border-2 border-gray-300 rounded-lg',
    elevated: 'bg-white border border-gray-200 rounded-lg shadow-md'
  }
}

export const progressVariants = {
  size: {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  },
  variant: {
    default: 'bg-primary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  }
}

export const visualizationVariants = {
  container: 'relative overflow-hidden rounded-lg border border-gray-200 bg-white',
  controls: 'flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50',
  content: 'relative p-4',
  footer: 'flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50'
}

export const algorithmColors = {
  quick: 'bg-green-500',
  merge: 'bg-amber-500',
  heap: 'bg-purple-500',
  bubble: 'bg-red-500',
  insertion: 'bg-blue-500',
  selection: 'bg-pink-500'
}

export const statusColors = {
  idle: 'text-gray-500',
  running: 'text-blue-600',
  paused: 'text-yellow-600',
  completed: 'text-green-600',
  error: 'text-red-600'
}