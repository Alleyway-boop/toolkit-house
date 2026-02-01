import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: '按钮样式变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '按钮尺寸',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    loading: {
      control: 'boolean',
      description: '是否加载中',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Primary Button
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '主要按钮',
  },
}

// Secondary Button
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '次要按钮',
  },
}

// Outline Button
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '轮廓按钮',
  },
}

// Ghost Button
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '幽灵按钮',
  },
}

// Small Size
export const Small: Story = {
  args: {
    size: 'sm',
    variant: 'primary',
    children: '小按钮',
  },
}

// Medium Size
export const Medium: Story = {
  args: {
    size: 'md',
    variant: 'primary',
    children: '中按钮',
  },
}

// Large Size
export const Large: Story = {
  args: {
    size: 'lg',
    variant: 'primary',
    children: '大按钮',
  },
}

// Disabled State
export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: '禁用按钮',
  },
}

// Loading State
export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: '加载中...',
  },
}

// All Variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">主要</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="outline">轮廓</Button>
      <Button variant="ghost">幽灵</Button>
    </div>
  ),
}

// All Sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm" variant="primary">小</Button>
      <Button size="md" variant="primary">中</Button>
      <Button size="lg" variant="primary">大</Button>
    </div>
  ),
}

// All States
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="primary">默认</Button>
      <Button variant="primary" disabled>禁用</Button>
      <Button variant="primary" loading>加载中</Button>
    </div>
  ),
}

// Dark Theme Preview
export const DarkTheme: Story = {
  args: {
    variant: 'primary',
    children: '深色主题按钮',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}
