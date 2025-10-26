import { defineConfig } from 'vite'
import { baseConfig } from './vite.base.js'
import react from '@vitejs/plugin-react'

export const reactConfig = defineConfig({
  ...baseConfig,
  
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-styled-components', {
            displayName: true,
            fileName: false
          }]
        ]
      }
    })
  ],
  
  define: {
    __APP_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
  },
  
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true
  },
  
  preview: {
    port: 3000,
    host: true
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}'
      ]
    }
  }
})