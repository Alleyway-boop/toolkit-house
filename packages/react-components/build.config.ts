import { defineBuildConfig } from 'unbuild'

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
    inlineDependencies: true
  },
  declaration: true,
  clean: true,
  failOnWarn: false
})