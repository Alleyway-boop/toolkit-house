import { useCallback } from 'react'
import { SortAlgorithm, SortOptions } from '@toolkit-house/ts-utils/sorting'
import { VisualizationStep } from '@/types'

export function useSortingSteps<T = any>() {
  const generateSteps = useCallback((
    algorithm: SortAlgorithm,
    data: T[],
    options?: SortOptions<T>
  ): VisualizationStep<T>[] => {
    const steps: VisualizationStep<T>[] = []
    const arr = [...data] // Work on a copy

    switch (algorithm) {
      case 'bubble':
        return generateBubbleSortSteps(arr, options)
      case 'insertion':
        return generateInsertionSortSteps(arr, options)
      case 'selection':
        return generateSelectionSortSteps(arr, options)
      case 'quick':
        return generateQuickSortSteps(arr, options)
      case 'merge':
        return generateMergeSortSteps(arr, options)
      case 'heap':
        return generateHeapSortSteps(arr, options)
      default:
        return steps
    }
  }, [])

  return { generateSteps }
}

function generateBubbleSortSteps<T>(arr: T[], options?: SortOptions<T>): VisualizationStep<T>[] {
  const steps: VisualizationStep<T>[] = []
  const array = [...arr]
  const n = array.length

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare step
      steps.push({
        type: 'compare',
        elements: [...array],
        indices: [j, j + 1],
        message: `Comparing ${array[j]} and ${array[j + 1]}`
      })

      const comparator = options?.comparator || ((a: T, b: T) => (a as any) - (b as any))
      if (comparator(array[j], array[j + 1]) > 0) {
        // Swap step
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
        steps.push({
          type: 'swap',
          elements: [...array],
          indices: [j, j + 1],
          message: `Swapping ${array[j + 1]} and ${array[j]}`
        })
      }
    }

    // Mark sorted element
    steps.push({
      type: 'complete',
      elements: [...array],
      indices: [n - i - 1],
      message: `Element ${array[n - i - 1]} is now in correct position`
    })
  }

  // Mark first element as sorted
  steps.push({
    type: 'complete',
    elements: [...array],
    indices: [0],
    message: 'Sorting complete!'
  })

  return steps
}

function generateInsertionSortSteps<T>(arr: T[], options?: SortOptions<T>): VisualizationStep<T>[] {
  const steps: VisualizationStep<T>[] = []
  const array = [...arr]
  const n = array.length

  for (let i = 1; i < n; i++) {
    const key = array[i]
    let j = i - 1

    steps.push({
      type: 'highlight',
      elements: [...array],
      indices: [i],
      message: `Inserting ${key}`
    })

    while (j >= 0) {
      steps.push({
        type: 'compare',
        elements: [...array],
        indices: [j, i],
        message: `Comparing ${array[j]} with ${key}`
      })

      const comparator = options?.comparator || ((a: T, b: T) => (a as any) - (b as any))
      if (comparator(array[j], key) <= 0) break

      array[j + 1] = array[j]
      steps.push({
        type: 'insert',
        elements: [...array],
        indices: [j, j + 1],
        message: `Moving ${array[j]} to position ${j + 1}`
      })

      j--
    }

    array[j + 1] = key
    steps.push({
      type: 'complete',
      elements: [...array],
      indices: [j + 1],
      message: `Placed ${key} at position ${j + 1}`
    })
  }

  steps.push({
    type: 'complete',
    elements: [...array],
    message: 'Sorting complete!'
  })

  return steps
}

function generateSelectionSortSteps<T>(arr: T[], options?: SortOptions<T>): VisualizationStep<T>[] {
  const steps: VisualizationStep<T>[] = []
  const array = [...arr]
  const n = array.length

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i

    steps.push({
      type: 'highlight',
      elements: [...array],
      indices: [i],
      message: `Finding minimum element from position ${i}`
    })

    for (let j = i + 1; j < n; j++) {
      steps.push({
        type: 'compare',
        elements: [...array],
        indices: [minIdx, j],
        message: `Comparing ${array[minIdx]} and ${array[j]}`
      })

      const comparator = options?.comparator || ((a: T, b: T) => (a as any) - (b as any))
      if (comparator(array[j], array[minIdx]) < 0) {
        minIdx = j
        steps.push({
          type: 'highlight',
          elements: [...array],
          indices: [minIdx],
          message: `New minimum found: ${array[minIdx]}`
        })
      }
    }

    if (minIdx !== i) {
      ;[array[i], array[minIdx]] = [array[minIdx], array[i]]
      steps.push({
        type: 'swap',
        elements: [...array],
        indices: [i, minIdx],
        message: `Swapping ${array[minIdx]} and ${array[i]}`
      })
    }

    steps.push({
      type: 'complete',
      elements: [...array],
      indices: [i],
      message: `Element ${array[i]} is now in correct position`
    })
  }

  steps.push({
    type: 'complete',
    elements: [...array],
    indices: [n - 1],
    message: 'Sorting complete!'
  })

  return steps
}

function generateQuickSortSteps<T>(arr: T[], options?: SortOptions<T>): VisualizationStep<T>[] {
  const steps: VisualizationStep<T>[] = []
  const array = [...arr]

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pivotIndex = partition(low, high)
      quickSortHelper(low, pivotIndex - 1)
      quickSortHelper(pivotIndex + 1, high)
    }
  }

  function partition(low: number, high: number): number {
    const pivot = array[high]

    steps.push({
      type: 'highlight',
      elements: [...array],
      indices: [high],
      message: `Pivot: ${pivot}`
    })

    let i = low - 1

    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        elements: [...array],
        indices: [j, high],
        message: `Comparing ${array[j]} with pivot ${pivot}`
      })

      const comparator = options?.comparator || ((a: T, b: T) => (a as any) - (b as any))
      if (comparator(array[j], pivot) <= 0) {
        i++
        if (i !== j) {
          ;[array[i], array[j]] = [array[j], array[i]]
          steps.push({
            type: 'swap',
            elements: [...array],
            indices: [i, j],
            message: `Swapping ${array[j]} and ${array[i]}`
          })
        }
      }
    }

    ;[array[i + 1], array[high]] = [array[high], array[i + 1]]
    steps.push({
      type: 'swap',
      elements: [...array],
      indices: [i + 1, high],
      message: `Placing pivot ${pivot} at position ${i + 1}`
    })

    steps.push({
      type: 'complete',
      elements: [...array],
      indices: [i + 1],
      message: `Pivot ${pivot} is now in correct position`
    })

    return i + 1
  }

  quickSortHelper(0, array.length - 1)

  steps.push({
    type: 'complete',
    elements: [...array],
    message: 'Sorting complete!'
  })

  return steps
}

function generateMergeSortSteps<T>(arr: T[], options?: SortOptions<T>): VisualizationStep<T>[] {
  const steps: VisualizationStep<T>[] = []
  const array = [...arr]

  function mergeSortHelper(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2)
      mergeSortHelper(left, mid)
      mergeSortHelper(mid + 1, right)
      merge(left, mid, right)
    }
  }

  function merge(left: number, mid: number, right: number) {
    const leftArr = array.slice(left, mid + 1)
    const rightArr = array.slice(mid + 1, right + 1)

    steps.push({
      type: 'highlight',
      elements: [...array],
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      message: `Merging arrays [${leftArr.join(', ')}] and [${rightArr.join(', ')}]`
    })

    let i = 0, j = 0, k = left
    const comparator = options?.comparator || ((a: T, b: T) => (a as any) - (b as any))

    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: 'compare',
        elements: [...array],
        indices: [left + i, mid + 1 + j],
        message: `Comparing ${leftArr[i]} and ${rightArr[j]}`
      })

      if (comparator(leftArr[i], rightArr[j]) <= 0) {
        array[k] = leftArr[i]
        i++
      } else {
        array[k] = rightArr[j]
        j++
      }

      steps.push({
        type: 'insert',
        elements: [...array],
        indices: [k],
        message: `Placed ${array[k]} at position ${k}`
      })

      k++
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i]
      steps.push({
        type: 'insert',
        elements: [...array],
        indices: [k],
        message: `Placed ${array[k]} at position ${k}`
      })
      i++
      k++
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j]
      steps.push({
        type: 'insert',
        elements: [...array],
        indices: [k],
        message: `Placed ${array[k]} at position ${k}`
      })
      j++
      k++
    }

    steps.push({
      type: 'complete',
      elements: [...array],
      indices: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      message: `Merged segment [${left}...${right}]`
    })
  }

  mergeSortHelper(0, array.length - 1)

  steps.push({
    type: 'complete',
    elements: [...array],
    message: 'Sorting complete!'
  })

  return steps
}

function generateHeapSortSteps<T>(arr: T[], options?: SortOptions<T>): VisualizationStep<T>[] {
  const steps: VisualizationStep<T>[] = []
  const array = [...arr]
  const n = array.length

  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(i, n)
  }

  steps.push({
    type: 'complete',
    elements: [...array],
    message: 'Max heap built'
  })

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    ;[array[0], array[i]] = [array[i], array[0]]
    steps.push({
      type: 'swap',
      elements: [...array],
      indices: [0, i],
      message: `Moving max element ${array[i]} to position ${i}`
    })

    heapify(0, i)

    steps.push({
      type: 'complete',
      elements: [...array],
      indices: [i],
      message: `Element ${array[i]} is now in correct position`
    })
  }

  function heapify(i: number, heapSize: number) {
    const comparator = options?.comparator || ((a: T, b: T) => (a as any) - (b as any))
    let largest = i
    const left = 2 * i + 1
    const right = 2 * i + 2

    if (left < heapSize) {
      steps.push({
        type: 'compare',
        elements: [...array],
        indices: [largest, left],
        message: `Comparing ${array[largest]} and ${array[left]}`
      })
      if (comparator(array[left], array[largest]) > 0) {
        largest = left
      }
    }

    if (right < heapSize) {
      steps.push({
        type: 'compare',
        elements: [...array],
        indices: [largest, right],
        message: `Comparing ${array[largest]} and ${array[right]}`
      })
      if (comparator(array[right], array[largest]) > 0) {
        largest = right
      }
    }

    if (largest !== i) {
      ;[array[i], array[largest]] = [array[largest], array[i]]
      steps.push({
        type: 'swap',
        elements: [...array],
        indices: [i, largest],
        message: `Swapping ${array[largest]} and ${array[i]}`
      })
      heapify(largest, heapSize)
    }
  }

  steps.push({
    type: 'complete',
    elements: [...array],
    message: 'Sorting complete!'
  })

  return steps
}