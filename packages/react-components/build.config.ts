import { fileURLToPath } from 'node:url'
import { defineBuildConfig } from 'unbuild'

const srcDir = fileURLToPath(new URL('./src', import.meta.url))

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/sorting/index',
    'src/data-structures/index',
    'src/algorithm-comparator/index',
    'src/ui/index',
    'src/hooks/index',
    'src/utils/index',
    'src/styles/index'
  ],
  outDir: 'dist',
  alias: {
    '@': srcDir
  },
  externals: [
    'react',
    'react-dom',
    '@toolkit-house/ts-utils'
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true
  },
  declaration: true,
  clean: true,
  failOnWarn: false
})
