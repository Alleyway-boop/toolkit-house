import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: '当前进度值',
    },
    max: {
      control: { type: 'range', min: 1, max: 200, step: 1 },
      description: '最大值',
    },
    showLabel: {
      control: 'boolean',
      description: '是否显示标签',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '进度条尺寸',
    },
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
      description: '进度条样式变体',
    },
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

// Default Progress
export const Default: Story = {
  args: {
    value: 50,
    max: 100,
  },
}

// No Label
export const NoLabel: Story = {
  args: {
    value: 75,
    showLabel: false,
  },
}

// Custom Max
export const CustomMax: Story = {
  args: {
    value: 150,
    max: 200,
  },
}

// Small Size
export const Small: Story = {
  args: {
    value: 60,
    size: 'sm',
  },
}

// Medium Size
export const Medium: Story = {
  args: {
    value: 60,
    size: 'md',
  },
}

// Large Size
export const Large: Story = {
  args: {
    value: 60,
    size: 'lg',
  },
}

// Success Variant
export const Success: Story = {
  args: {
    value: 100,
    variant: 'success',
  },
}

// Warning Variant
export const Warning: Story = {
  args: {
    value: 70,
    variant: 'warning',
  },
}

// Error Variant
export const Error: Story = {
  args: {
    value: 30,
    variant: 'error',
  },
}

// All Sizes
export const AllSizes: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-md space-y-8">
      <div>
        <div className="mb-2 text-sm font-medium">小尺寸</div>
        <ProgressBar value={60} size="sm" />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">中等尺寸</div>
        <ProgressBar value={60} size="md" />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium">大尺寸</div>
        <ProgressBar value={60} size="lg" />
      </div>
    </div>
  ),
}

// All Variants
export const AllVariants: Story = {
  args: {} as any,
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <ProgressBar value={60} variant="default" showLabel />
      <ProgressBar value={100} variant="success" showLabel />
      <ProgressBar value={70} variant="warning" showLabel />
      <ProgressBar value={30} variant="error" showLabel />
    </div>
  ),
}

// Animated Progress
export const Animated: Story = {
  args: {} as any,
  render: function AnimatedProgress() {
    const [value, setValue] = useState(0)

    return (
      <div className="w-full max-w-md space-y-4">
        <ProgressBar value={value} />
        <div className="flex gap-2">
          <button
            onClick={() => setValue(Math.max(0, value - 10))}
            className="px-4 py-2 border rounded"
          >
            -10
          </button>
          <button
            onClick={() => setValue(Math.min(100, value + 10))}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            +10
          </button>
          <button
            onClick={() => setValue(0)}
            className="px-4 py-2 border rounded"
          >
            重置
          </button>
        </div>
      </div>
    )
  },
}

// Progress Stages
export const ProgressStages: Story = {
  args: {} as any,
  render: function ProgressStages() {
    const stages = [
      { label: '开始', value: 25 },
      { label: '进行中', value: 50 },
      { label: '即将完成', value: 75 },
      { label: '完成', value: 100 },
    ]

    return (
      <div className="w-full max-w-md space-y-6">
        {stages.map((stage) => (
          <div key={stage.label}>
            <div className="mb-2 text-sm font-medium">{stage.label}</div>
            <ProgressBar
              value={stage.value}
              variant={
                stage.value === 100 ? 'success' : stage.value < 50 ? 'warning' : 'default'
              }
            />
          </div>
        ))}
      </div>
    )
  },
}

// Upload Progress
export const UploadProgress: Story = {
  args: {} as any,
  render: function UploadProgress() {
    const [files] = useState([
      { name: 'document.pdf', progress: 100, size: '2.3 MB' },
      { name: 'image.png', progress: 65, size: '1.1 MB' },
      { name: 'video.mp4', progress: 30, size: '15.8 MB' },
    ])

    return (
      <div className="w-full max-w-md space-y-4">
        <h3 className="font-medium">文件上传</h3>
        {files.map((file) => (
          <div key={file.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{file.name}</span>
              <span className="text-gray-500">{file.size}</span>
            </div>
            <ProgressBar
              value={file.progress}
              variant={file.progress === 100 ? 'success' : 'default'}
              showLabel
            />
          </div>
        ))}
      </div>
    )
  },
}

// Download Progress with ETA
export const DownloadProgress: Story = {
  args: {} as any,
  render: function DownloadProgress() {
    const [progress, setProgress] = useState(45)
    const eta = Math.ceil((100 - progress) / 5) // 模拟剩余时间

    return (
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">下载中...</h3>
          <span className="text-sm text-gray-500">
            {progress}% · 剩余约 {eta} 秒
          </span>
        </div>
        <ProgressBar value={progress} size="lg" />
        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>已下载: 45.2 MB / 100.0 MB</span>
          <span>速度: 5.2 MB/s</span>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setProgress(Math.min(100, progress + 10))}
            className="flex-1 py-2 bg-blue-500 text-white rounded"
          >
            {progress === 100 ? '完成' : '继续'}
          </button>
          <button
            onClick={() => setProgress(0)}
            className="px-4 py-2 border rounded"
          >
            取消
          </button>
        </div>
      </div>
    )
  },
}
