import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SortingVisualization } from '../src/sorting/SortingVisualization'

// Mock ts-utils sorting functions
vi.mock('@toolkit-house/ts-utils/sorting', () => ({
  quickSort: (arr: number[]) => [...arr].sort((a, b) => a - b),
  bubbleSort: (arr: number[]) => [...arr].sort((a, b) => a - b),
  mergeSort: (arr: number[]) => [...arr].sort((a, b) => a - b),
  heapSort: (arr: number[]) => [...arr].sort((a, b) => a - b),
  insertionSort: (arr: number[]) => [...arr].sort((a, b) => a - b),
  selectionSort: (arr: number[]) => [...arr].sort((a, b) => a - b)
}))

describe('SortingVisualization', () => {
  const mockData = [64, 34, 25, 12, 22, 11, 90]

  it('renders sorting visualization correctly', () => {
    render(
      <SortingVisualization
        data={mockData}
        algorithm="quick"
        showControls={true}
        showMetrics={true}
      />
    )

    expect(screen.getByText(/Algorithm: quick/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('displays array bars with correct values', () => {
    render(
      <SortingVisualization
        data={mockData}
        algorithm="bubble"
        showControls={false}
      />
    )

    // Check if bars are rendered (they should have the array values as tooltips)
    const bars = screen.getAllByRole('generic')
    expect(bars.length).toBeGreaterThan(0)
  })

  it('handles play/pause functionality', async () => {
    render(
      <SortingVisualization
        data={mockData}
        algorithm="merge"
        autoPlay={false}
      />
    )

    const playButton = screen.getByRole('button', { name: /play/i })
    fireEvent.click(playButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument()
    })
  })

  it('handles step controls', async () => {
    render(
      <SortingVisualization
        data={mockData}
        algorithm="insertion"
        autoPlay={false}
      />
    )

    const stepForwardButton = screen.getByRole('button', { name: /step forward/i })
    fireEvent.click(stepForwardButton)

    // Verify that step count increases
    expect(screen.getByText(/Step 1/i)).toBeInTheDocument()
  })

  it('handles speed control', async () => {
    render(
      <SortingVisualization
        data={mockData}
        algorithm="selection"
        autoPlay={false}
      />
    )

    const speedSlider = screen.getByRole('slider')
    fireEvent.change(speedSlider, { target: { value: '2.0' } })

    expect(screen.getByText('2.0x')).toBeInTheDocument()
  })

  it('calls onStepChange when step changes', async () => {
    const onStepChange = vi.fn()
    render(
      <SortingVisualization
        data={mockData}
        algorithm="heap"
        autoPlay={false}
        onStepChange={onStepChange}
      />
    )

    const stepForwardButton = screen.getByRole('button', { name: /step forward/i })
    fireEvent.click(stepForwardButton)

    await waitFor(() => {
      expect(onStepChange).toHaveBeenCalledWith(1, expect.any(Object))
    })
  })

  it('calls onComplete when sorting completes', async () => {
    const onComplete = vi.fn()
    render(
      <SortingVisualization
        data={[3, 2, 1]} // Small array for quick completion
        algorithm="bubble"
        autoPlay={true}
        speed={5} // Fast speed
        onComplete={onComplete}
      />
    )

    await waitFor(
      () => {
        expect(onComplete).toHaveBeenCalled()
      },
      { timeout: 3000 }
    )
  })

  it('displays progress correctly', () => {
    render(
      <SortingVisualization
        data={mockData}
        algorithm="quick"
        autoPlay={false}
      />
    )

    expect(screen.getByText('Step 0 /')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows correct algorithm information', () => {
    render(
      <SortingVisualization
        data={mockData}
        algorithm="merge"
        showMetrics={true}
      />
    )

    expect(screen.getByText(/Algorithm: merge/i)).toBeInTheDocument()
  })
})