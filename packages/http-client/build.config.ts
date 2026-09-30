export default {
  entries: ['src/index.ts', 'src/types/index.ts'],
  clean: true,
  rollup: {
    emitCJS: true
  },
  failOnWarn: false
}
