import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/runtime-config
export default defineConfig({
  // Site configuration
  title: 'Toolkit House',
  description: 'Modern frontend toolkit monorepo with React, Vue, Svelte, and SolidJS templates',

  // Appearance
  appearance: 'dark', // Default to dark mode
  lastUpdated: true,
  cleanUrls: true,

  // Ignore dead links for now (missing pages)
  ignoreDeadLinks: true,

  // Markdown configuration
  markdown: {
    lineNumbers: true,
    config: (md) => {
      // Add markdown-it plugins if needed
    },
  },

  // Theme configuration
  themeConfig: {
    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-org/toolkit-house' },
    ],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Toolkit House Team',
    },

    // Edit link
    editLink: {
      pattern: 'https://github.com/your-org/toolkit-house/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    // Last updated text
    lastUpdatedText: {
      en: 'Last updated',
      zh: '最后更新',
    },

    // Search
    search: {
      provider: 'local',
      options: {
        locales: {
          en: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search',
              },
              modal: {
                noResultsText: 'No results for',
                resetButtonTitle: 'Clear query',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close',
                },
              },
            },
          },
          zh: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索',
              },
              modal: {
                noResultsText: '没有搜索结果',
                resetButtonTitle: '清除查询',
                footer: {
                  selectText: '选择',
                  navigateText: '导航',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },

    // Outline
    outline: {
      level: [2, 3],
      label: {
        en: 'On this page',
        zh: '本页内容',
      },
    },

    // Doc footer
    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },
  },

  // Build configuration
  vite: {
    build: {
      target: 'ES2022',
    },
  },

  // Locales configuration
  locales: {
    // Root locale (English) - default
    root: {
      label: 'English',
      lang: 'en-US',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/getting-started' },
          { text: 'API', link: '/api/' },
          { text: 'Packages', link: '/packages/' },
          { text: 'Apps', link: '/apps/' },
          {
            text: 'Development',
            items: [
              { text: 'Setup', link: '/development/setup' },
              { text: 'Contributing', link: '/development/contributing' },
            ],
          },
        ],

        sidebar: {
          '/guide/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/guide/getting-started' },
                { text: 'Quick Start', link: '/guide/quick-start' },
                { text: 'Installation', link: '/guide/installation' },
              ],
            },
            {
              text: 'Core Concepts',
              items: [
                { text: 'Monorepo Structure', link: '/guide/monorepo' },
                { text: 'Package System', link: '/guide/packages' },
                { text: 'Build System', link: '/guide/build' },
              ],
            },
            {
              text: 'Tutorials',
              items: [
                { text: 'Creating a Component', link: '/guide/tutorials/component' },
                { text: 'Adding a Package', link: '/guide/tutorials/package' },
                { text: 'Building an App', link: '/guide/tutorials/app' },
              ],
            },
          ],
          '/api/': [
            {
              text: 'API Reference',
              items: [
                { text: 'ts-utils', link: '/api/ts-utils' },
                { text: 'validation', link: '/api/validation' },
                { text: 'http-client', link: '/api/http-client' },
                { text: 'logger', link: '/api/logger' },
              ],
            },
          ],
          '/packages/': [
            {
              text: 'Packages',
              items: [
                { text: 'ts-utils', link: '/packages/ts-utils' },
                { text: 'validation', link: '/packages/validation' },
                { text: 'http-client', link: '/packages/http-client' },
                { text: 'logger', link: '/packages/logger' },
                { text: 'react-components', link: '/packages/react-components' },
                { text: 'vue-components', link: '/packages/vue-components' },
              ],
            },
          ],
          '/apps/': [
            {
              text: 'Applications',
              items: [
                { text: 'React Demo', link: '/apps/react-demo' },
                { text: 'Vue Demo', link: '/apps/vue-demo' },
                { text: 'API Gateway', link: '/apps/api-gateway' },
                { text: 'Go Server', link: '/apps/server-go' },
              ],
            },
          ],
          '/development/': [
            {
              text: 'Development',
              items: [
                { text: 'Development Setup', link: '/development/setup' },
                { text: 'Testing', link: '/development/testing' },
                { text: 'Building', link: '/development/building' },
                { text: 'Contributing', link: '/development/contributing' },
              ],
            },
          ],
        },

        editLink: {
          pattern: 'https://github.com/your-org/toolkit-house/edit/main/docs/:path',
          text: 'Edit this page on GitHub',
        },

        lastUpdatedText: 'Last updated',

        outline: {
          label: 'On this page',
        },
      },
    },

    // Chinese locale
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/getting-started' },
          { text: 'API', link: '/zh/api/' },
          { text: '包', link: '/zh/packages/' },
          { text: '应用', link: '/zh/apps/' },
          {
            text: '开发',
            items: [
              { text: '设置', link: '/zh/development/setup' },
              { text: '贡献', link: '/zh/development/contributing' },
            ],
          },
        ],

        sidebar: {
          '/zh/guide/': [
            {
              text: '快速入门',
              items: [
                { text: '简介', link: '/zh/guide/getting-started' },
                { text: '快速开始', link: '/zh/guide/quick-start' },
                { text: '安装', link: '/zh/guide/installation' },
              ],
            },
            {
              text: '核心概念',
              items: [
                { text: 'Monorepo 结构', link: '/zh/guide/monorepo' },
                { text: '包系统', link: '/zh/guide/packages' },
                { text: '构建系统', link: '/zh/guide/build' },
              ],
            },
            {
              text: '教程',
              items: [
                { text: '创建组件', link: '/zh/guide/tutorials/component' },
                { text: '添加包', link: '/zh/guide/tutorials/package' },
                { text: '构建应用', link: '/zh/guide/tutorials/app' },
              ],
            },
          ],
          '/zh/api/': [
            {
              text: 'API 参考',
              items: [
                { text: 'ts-utils', link: '/zh/api/ts-utils' },
                { text: 'validation', link: '/zh/api/validation' },
                { text: 'http-client', link: '/zh/api/http-client' },
                { text: 'logger', link: '/zh/api/logger' },
              ],
            },
          ],
          '/zh/packages/': [
            {
              text: '包',
              items: [
                { text: 'ts-utils', link: '/zh/packages/ts-utils' },
                { text: 'validation', link: '/zh/packages/validation' },
                { text: 'http-client', link: '/zh/packages/http-client' },
                { text: 'logger', link: '/zh/packages/logger' },
                { text: 'react-components', link: '/zh/packages/react-components' },
                { text: 'vue-components', link: '/zh/packages/vue-components' },
              ],
            },
          ],
          '/zh/apps/': [
            {
              text: '应用',
              items: [
                { text: 'React Demo', link: '/zh/apps/react-demo' },
                { text: 'Vue Demo', link: '/zh/apps/vue-demo' },
                { text: 'API Gateway', link: '/zh/apps/api-gateway' },
                { text: 'Go Server', link: '/zh/apps/server-go' },
              ],
            },
          ],
          '/zh/development/': [
            {
              text: '开发',
              items: [
                { text: '开发环境设置', link: '/zh/development/setup' },
                { text: '测试', link: '/zh/development/testing' },
                { text: '构建', link: '/zh/development/building' },
                { text: '贡献指南', link: '/zh/development/contributing' },
              ],
            },
          ],
        },

        editLink: {
          pattern: 'https://github.com/your-org/toolkit-house/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页',
        },

        outline: {
          label: '本页内容',
        },
      },
    },
  },
})
