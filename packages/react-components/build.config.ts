import { defineBuildConfig } from 'unbuild'
import { resolve } from 'path'

export default defineBuildConfig({
  entries: [
    'src/index'
  ],
  outDir: 'dist',
  externals: [
    'react',
    'react-dom',
    '@toolkit-house/ts-utils'
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    alias: {
      '@/styles': resolve(__dirname, 'src/styles/index.ts'),
      '@/types': resolve(__dirname, 'src/types/index.ts'),
      '@/utils': resolve(__dirname, 'src/utils/index.ts'),
      '@': resolve(__dirname, 'src')
    }
  },
  declaration: true,
  clean: true,
  failOnWarn: false
})