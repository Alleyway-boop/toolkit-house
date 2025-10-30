import { defineConfig } from 'vite'
import { baseConfig } from './vite.base.js'
import { resolve } from 'path'

export const libraryConfig = defineConfig({
  ...baseConfig,
  
  build: {
    ...baseConfig.build,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ToolkitHouse',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      ...baseConfig.build.rollupOptions,
      external: ['react', 'react-dom'],
      output: {
        ...baseConfig.build.rollupOptions.output,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})