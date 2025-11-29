# @toolkit-house/react-components

React component library with algorithm visualizations and smart UI components built on top of `@toolkit-house/ts-utils`.

## Features

### <¯ Algorithm Visualizations
- **Sorting Algorithms**: Visualize QuickSort, MergeSort, HeapSort, BubbleSort, InsertionSort, and SelectionSort
- **Data Structures**: Interactive visualizations for Binary Trees, Linked Lists, Stacks, Queues, and Heaps
- **Algorithm Comparator**: Compare performance of multiple algorithms side-by-side

### <¨ Smart UI Components
- **Modern Design**: Clean, accessible components with Tailwind CSS
- **TypeScript**: Full type safety and IntelliSense support
- **Responsive**: Mobile-first design approach
- **Customizable**: Extensive theming and styling options

### ¡ Performance
- **Optimized Rendering**: Efficient updates with React hooks and memoization
- **Animation System**: Smooth, performant algorithm visualizations
- **Memory Efficient**: Low memory footprint for large datasets

## Installation

```bash
npm install @toolkit-house/react-components
# or
pnpm add @toolkit-house/react-components
```

### Peer Dependencies

Make sure you have React 18+ installed:

```bash
npm install react react-dom
```

## Quick Start

### Sorting Visualization

```tsx
import React, { useState } from 'react'
import { SortingVisualization } from '@toolkit-house/react-components'

function App() {
  const [data] = useState([64, 34, 25, 12, 22, 11, 90])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Sorting Visualization</h1>
      <SortingVisualization
        data={data}
        algorithm="quick"
        autoPlay={false}
        speed={1}
        showControls={true}
        showMetrics={true}
      />
    </div>
  )
}
```

### Data Structure Visualization

```tsx
import React, { useState } from 'react'
import { BinaryTreeVisualization, LinkedListVisualization } from '@toolkit-house/react-components'
import { BinaryTree } from '@toolkit-house/ts-utils/data-structures'

function DataStructuresDemo() {
  const [tree] = useState(() => {
    const bt = new BinaryTree<number>()
    bt.insert(5)
    bt.insert(3)
    bt.insert(7)
    bt.insert(2)
    bt.insert(4)
    return bt
  })

  return (
    <div className="p-8 space-y-8">
      <BinaryTreeVisualization data={tree} />
    </div>
  )
}
```

### Algorithm Comparator

```tsx
import React, { useState } from 'react'
import { AlgorithmComparator } from '@toolkit-house/react-components'

function AlgorithmComparison() {
  const [data] = useState([64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 43])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Algorithm Performance Comparison</h1>
      <AlgorithmComparator
        data={data}
        algorithms={['quick', 'merge', 'heap', 'bubble']}
        autoRun={false}
        showDetails={true}
        onResults={(results) => {
          console.log('Comparison results:', results)
        }}
      />
    </div>
  )
}
```

## Components

### Sorting Visualization Components

#### `SortingVisualization`
Main component for visualizing sorting algorithms with full playback controls.

**Props:**
- `data: T[]` - Array to be sorted
- `algorithm: SortAlgorithm` - Sorting algorithm to use
- `autoPlay?: boolean` - Auto-start visualization
- `speed?: number` - Animation speed (0.1 - 5)
- `showControls?: boolean` - Show playback controls
- `showMetrics?: boolean` - Show step information

#### `SortingArrayBar`
Individual bar component used in sorting visualizations.

#### `SortingControls`
Playback controls for sorting visualizations.

### Data Structure Visualization Components

#### `BinaryTreeVisualization`
Interactive binary tree visualization with click handlers.

#### `LinkedListVisualization`
Visual representation of linked lists with pointer visualization.

#### `StackVisualization`
Stack visualization showing LIFO behavior.

#### `QueueVisualization`
Queue visualization showing FIFO behavior.

#### `HeapVisualization`
Binary heap visualization with tree layout.

### Algorithm Comparator Components

#### `AlgorithmComparator`
Compare multiple sorting algorithms performance side-by-side.

#### `PerformanceChart`
Visual performance comparison charts.

### UI Components

#### `Button`
Customizable button component with loading states.

#### `Card`
Flexible card container component.

#### `ProgressBar`
Animated progress bar component.

#### `MetricCard`
Card for displaying metrics and statistics.

## Hooks

### `useVisualization`
Core hook for managing animation state and playback controls.

### `useSortingSteps`
Hook for generating sorting algorithm visualization steps.

### `usePerformanceMonitor`
Hook for monitoring algorithm performance metrics.

## Utilities

### Data Generation
- `generateRandomArray(length, min, max)` - Generate random arrays
- `generateNearlySortedArray(length, disorder)` - Generate nearly sorted arrays
- `generateReversedArray(length)` - Generate reversed arrays

### Performance
- `formatNumber(num)` - Format large numbers
- `formatTime(ms)` - Format time values
- `debounce(fn, delay)` - Debounce function
- `throttle(fn, delay)` - Throttle function

### Styling
- `cn(...classes)` - Utility for conditional class names
- `mergeTheme(theme)` - Merge theme configurations
- `getAlgorithmColor(algorithm)` - Get algorithm-specific colors

## Theming

The library supports extensive theming through CSS variables and Tailwind CSS:

```tsx
import { mergeTheme } from '@toolkit-house/react-components'

const customTheme = mergeTheme({
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    accent: '#f59e0b'
  }
})
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```tsx
import type {
  SortingVisualizationProps,
  AlgorithmComparatorProps,
  UseAlgorithmReturn
} from '@toolkit-house/react-components'
```

## Examples

### Custom Sorting Visualization

```tsx
import React, { useState } from 'react'
import { SortingVisualization, useSortingSteps } from '@toolkit-house/react-components'

function CustomSortingDemo() {
  const [data] = useState([64, 34, 25, 12, 22, 11, 90])
  const { generateSteps } = useSortingSteps()

  const handleStepChange = (step: number, state: any) => {
    console.log(`Current step: ${step}`, state)
  }

  const handleComplete = (result: any) => {
    console.log('Sorting completed:', result)
  }

  return (
    <SortingVisualization
      data={data}
      algorithm="quick"
      onStepChange={handleStepChange}
      onComplete={handleComplete}
      theme={{
        primary: '#8b5cf6',
        accent: '#ec4899'
      }}
    />
  )
}
```

### Interactive Data Structure

```tsx
import React, { useState } from 'react'
import { BinaryTreeVisualization } from '@toolkit-house/react-components'
import { BinaryTree } from '@toolkit-house/ts-utils/data-structures'

function InteractiveTree() {
  const [tree] = useState(() => {
    const bt = new BinaryTree<number>()
    [5, 3, 7, 2, 4, 6, 8].forEach(val => bt.insert(val))
    return bt
  })

  const handleNodeClick = (value: number) => {
    console.log(`Node clicked: ${value}`)
  }

  return (
    <BinaryTreeVisualization
      data={tree}
      onNodeClick={handleNodeClick}
      nodeSpacing={100}
      levelHeight={120}
      showConnections={true}
    />
  )
}
```

## Development

### Building

```bash
# Install dependencies
pnpm install

# Build library
pnpm run build

# Run tests
pnpm run test

# Type checking
pnpm run typecheck
```

### Testing

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage
```

### Storybook

```bash
# Start Storybook
pnpm run storybook

# Build Storybook
pnpm run build-storybook
```

## License

MIT © [Your Name](https://github.com/yourusername)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## Related Packages

- [`@toolkit-house/ts-utils`](https://github.com/toolkit-house/ts-utils) - TypeScript utility library with algorithms and data structures

## Support

For questions and support, please open an issue on [GitHub](https://github.com/toolkit-house/react-components/issues).