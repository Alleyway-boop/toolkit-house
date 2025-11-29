import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/basic/index',
    'src/function/index',
    'src/collection/index',
    'src/conditional/index',
    'src/utility/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});