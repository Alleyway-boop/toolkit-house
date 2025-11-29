/**
 * Example usage of @toolkit-house/react-components
 * This file demonstrates how to use the React components library
 */

import React, { useState } from 'react'
import {
  SortingVisualization,
  AlgorithmComparator,
  BinaryTreeVisualization,
  LinkedListVisualization,
  Button,
  Card
} from '@toolkit-house/react-components'
import { BinaryTree, LinkedList } from '@toolkit-house/ts-utils/data-structures'
import { generateRandomArray } from '@toolkit-house/react-components/utils'

// Sorting Visualization Example
function SortingExample() {
  const [data] = useState(() => generateRandomArray(15, 10, 100))

  return (
    <Card title="Sorting Visualization" className="p-6">
      <SortingVisualization
        data={data}
        algorithm="quick"
        autoPlay={false}
        speed={1.5}
        showControls={true}
        showMetrics={true}
        onStepChange={(step, state) => {
          console.log(`Step ${step}:`, state.steps[step]?.message)
        }}
        onComplete={(result) => {
          console.log('Sorting completed:', result)
        }}
      />
    </Card>
  )
}

// Algorithm Comparator Example
function AlgorithmComparisonExample() {
  const [testData] = useState(() => generateRandomArray(20, 1, 50))

  return (
    <Card title="Algorithm Performance Comparison" className="p-6">
      <AlgorithmComparator
        data={testData}
        algorithms={['quick', 'merge', 'heap', 'bubble']}
        autoRun={false}
        showDetails={true}
        onResults={(results) => {
          console.log('Comparison results:', results)
          const fastest = results.reduce((a, b) =>
            a.performance.time < b.performance.time ? a : b
          )
          console.log(`Fastest algorithm: ${fastest.info.name}`)
        }}
      />
    </Card>
  )
}

// Data Structure Visualization Example
function DataStructuresExample() {
  const [tree] = useState(() => {
    const binaryTree = new BinaryTree()
    [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45].forEach(val =>
      binaryTree.insert(val)
    )
    return binaryTree
  })

  const [linkedList] = useState(() => {
    const list = new LinkedList()
    [10, 20, 30, 40, 50].forEach(val => list.append(val))
    return list
  })

  const handleNodeClick = (value) => {
    console.log(`Node clicked: ${value}`)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Binary Tree Visualization" className="p-6">
        <BinaryTreeVisualization
          data={tree}
          onNodeClick={handleNodeClick}
          nodeSpacing={80}
          levelHeight={100}
          showConnections={true}
        />
      </Card>

      <Card title="Linked List Visualization" className="p-6">
        <LinkedListVisualization
          data={linkedList}
          onNodeClick={(value, index) => console.log(`Node ${value} at index ${index}`)}
          nodeWidth={60}
          nodeHeight={50}
          horizontalSpacing={30}
        />
      </Card>
    </div>
  )
}

// Interactive Controls Example
function InteractiveControlsExample() {
  const [data, setData] = useState(() => generateRandomArray(12, 5, 80))
  const [algorithm, setAlgorithm] = useState('quick')
  const [isPlaying, setIsPlaying] = useState(false)

  const generateNewData = () => {
    setData(generateRandomArray(12, 5, 80))
    setIsPlaying(false)
  }

  const algorithms = ['quick', 'merge', 'heap', 'bubble', 'insertion', 'selection']

  return (
    <Card title="Interactive Sorting Controls" className="p-6">
      <div className="space-y-4">
        {/* Algorithm Selection */}
        <div className="flex items-center space-x-4">
          <label className="font-medium">Algorithm:</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            {algorithms.map(algo => (
              <option key={algo} value={algo}>
                {algo.charAt(0).toUpperCase() + algo.slice(1)} Sort
              </option>
            ))}
          </select>
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant="primary"
            loading={isPlaying}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button
            onClick={generateNewData}
            variant="secondary"
          >
            Generate New Data
          </Button>
        </div>

        {/* Data Display */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Current Data:</div>
          <div className="flex space-x-2">
            {data.map((value, index) => (
              <div
                key={index}
                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium"
              >
                {value}
              </div>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <SortingVisualization
          data={data}
          algorithm={algorithm}
          autoPlay={isPlaying}
          speed={2}
          showControls={false}
          showMetrics={true}
        />
      </div>
    </Card>
  )
}

// Complete App Example
function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            @toolkit-house/react-components
          </h1>
          <p className="text-lg text-gray-600">
            Algorithm Visualizations and Smart UI Components
          </p>
        </header>

        <main className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Algorithm Visualizations
            </h2>
            <div className="space-y-6">
              <SortingExample />
              <AlgorithmComparisonExample />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Structure Visualizations
            </h2>
            <DataStructuresExample />
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Interactive Example
            </h2>
            <InteractiveControlsExample />
          </section>
        </main>

        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            Built with React, TypeScript, and Tailwind CSS
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by @toolkit-house/ts-utils
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App

// Usage Instructions:
/*
1. Install dependencies:
   npm install react react-dom @toolkit-house/react-components
   # or
   pnpm add react react-dom @toolkit-house/react-components

2. Set up Tailwind CSS in your project:
   npm install -D tailwindcss postcss autoprefixer

3. Configure your app to import the components

4. Use the components as shown in the examples above

Features demonstrated:
- Sorting algorithm visualizations with playback controls
- Algorithm performance comparison
- Interactive data structure visualizations
- Customizable themes and styling
- TypeScript support with full type safety
- Responsive design
- Performance monitoring
- Event handlers and callbacks
*/

// Performance Optimization Tips:
/*
1. Use the `speed` prop to control animation performance
2. For large datasets, consider using virtualization or pagination
3. Use the `autoPlay={false}` prop to prevent automatic animations
4. Leverage the `onStepChange` callback for custom behavior
5. Use React.memo for components that render frequently
6. Implement proper cleanup in useEffect hooks
7. Use the performance monitoring hooks for optimization
*/

// Advanced Usage:
/*
You can extend the library by:
1. Creating custom visualization steps
2. Implementing new sorting algorithms
3. Adding custom data structure visualizations
4. Creating specialized UI components
5. Integrating with state management libraries
6. Adding animation libraries like Framer Motion
*/

console.log('React Components Demo loaded successfully!')
console.log('This file demonstrates the usage of @toolkit-house/react-components')
console.log('Key features:')
console.log('- Sorting visualizations (QuickSort, MergeSort, HeapSort, etc.)')
console.log('- Data structure visualizations (Binary Trees, Linked Lists, etc.)')
console.log('- Algorithm performance comparison')
console.log('- Smart UI components with TypeScript support')
console.log('- Interactive controls and real-time updates')