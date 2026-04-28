import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'elevated'],
      description: '卡片样式变体',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Default Card
export const Default: Story = {
  args: {
    children: <p>这是默认卡片的内容</p>,
  },
}

// Card with Title
export const WithTitle: Story = {
  args: {
    title: '卡片标题',
    children: <p>这是卡片的内容部分</p>,
  },
}

// Card with Title and Subtitle
export const WithTitleAndSubtitle: Story = {
  args: {
    title: '卡片标题',
    subtitle: '这是副标题',
    children: <p>这是卡片的内容部分</p>,
  },
}

// Card with Footer
export const WithFooter: Story = {
  args: {
    title: '卡片标题',
    children: <p>这是卡片的内容部分</p>,
    footer: <div className="text-sm text-gray-500">这是页脚</div>,
  },
}

// Full Featured Card
export const FullFeatured: Story = {
  args: {
    title: '完整卡片',
    subtitle: '包含所有元素',
    children: (
      <div className="space-y-4">
        <p>这是卡片的主要内容区域。</p>
        <p>可以包含任意内容，比如文本、图片、表格等。</p>
      </div>
    ),
    footer: (
      <div className="flex justify-end gap-2">
        <button className="px-3 py-1 text-sm border rounded">取消</button>
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">确认</button>
      </div>
    ),
  },
}

// Bordered Variant
export const Bordered: Story = {
  args: {
    variant: 'outlined',
    title: '边框卡片',
    children: <p>这是一个带边框的卡片样式</p>,
  },
}

// Elevated Variant
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    title: '凸起卡片',
    children: <p>这是一个带阴影的凸起卡片样式</p>,
  },
}

// All Variants
export const AllVariants: Story = {
  args: {} as any,
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="default" title="默认">
        <p>默认样式</p>
      </Card>
      <Card variant="outlined" title="边框">
        <p>边框样式</p>
      </Card>
      <Card variant="elevated" title="凸起">
        <p>凸起样式</p>
      </Card>
    </div>
  ),
}

// Content Examples
export const ContentExamples: Story = {
  args: {} as any,
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card title="用户信息" subtitle="个人资料">
        <div className="space-y-2">
          <div><span className="font-medium">姓名:</span> 张三</div>
          <div><span className="font-medium">邮箱:</span> zhangsan@example.com</div>
          <div><span className="font-medium">角色:</span> 管理员</div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <button className="text-blue-500 text-sm">编辑资料</button>
        </div>
      </Card>

      <Card title="统计数据" subtitle="本月概览">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">128</div>
            <div className="text-sm text-gray-500">访问量</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">42</div>
            <div className="text-sm text-gray-500">新用户</div>
          </div>
        </div>
      </Card>
    </div>
  ),
}

// Article Card
export const Article: Story = {
  args: {} as any,
  render: () => (
    <Card variant="elevated">
      <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg -m-6 mb-4 h-48" />
      <h3 className="text-xl font-bold mb-2">文章标题</h3>
      <p className="text-gray-600 mb-4">
        这是文章的摘要内容。可以包含简短的描述，吸引用户点击阅读更多内容。
      </p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>作者: 张三</span>
        <span>2024-01-15</span>
      </div>
      <div className="mt-4 pt-4 border-t flex gap-2">
        <span className="px-2 py-1 bg-gray-100 rounded text-xs">标签1</span>
        <span className="px-2 py-1 bg-gray-100 rounded text-xs">标签2</span>
      </div>
    </Card>
  ),
}
