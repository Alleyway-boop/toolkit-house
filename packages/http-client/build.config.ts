export default {
  entries: ['src/index.ts'],
  clean: true,
  rollup: {
    emitCJS: true
  },
  failOnWarn: false
}