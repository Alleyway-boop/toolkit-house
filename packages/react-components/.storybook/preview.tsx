import type { Preview } from '@storybook/react-vite'
import React from 'react'
import { clsx } from 'clsx'

/**
 * Storybook 预览配置
 *
 * 负责：
 * - 应用全局样式（Tailwind CSS）
 * - 提供主题切换功能
 * - 设置字体和其他全局配置
 */

// Tailwind CSS 样式
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  globalTypes: {
    theme: {
      name: 'Theme',
      description: '切换主题',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: '浅色' },
          { value: 'dark', icon: 'moon', title: '深色' },
        ],
        dynamicTitle: true,
      },
      defaultValue: 'light',
    },
  },

  decorators: [
    (Story, context) => {
      const { theme } = context.globals

      React.useEffect(() => {
        const html = document.documentElement
        if (theme === 'dark') {
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
        }
      }, [theme])

      return (
        <div
          className={clsx(
            'min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-8',
            theme === 'dark' && 'dark'
          )}
        >
          <Story />
        </div>
      )
    },
  ],

  tags: ['autodocs'],
}

export default preview
