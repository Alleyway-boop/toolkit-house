import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/core/index',
    'src/transports/index',
    'src/formatters/index',
    'src/filters/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});