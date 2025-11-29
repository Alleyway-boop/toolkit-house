import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/common/index',
    'src/business/index',
    'src/technical/index',
    'src/environment/index',
    'src/theme/index',
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
  },
});