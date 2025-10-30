import { defineConfig } from 'vite'
import { resolve } from 'path'

export const baseConfig = defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  build: {
    target: 'es2022',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lodash-es', 'date-fns']
        }
      }
    }
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  
  clearScreen: false,
  logLevel: 'warn'
})