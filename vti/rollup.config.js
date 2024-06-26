const { getRootPath, clearDist, external, onwarn, createPlugins } = require('../build/rollup-common-config');
const vtiPkg = require('./package.json');

const getVTIPath = getRootPath('vti');

clearDist(getVTIPath('dist'));
module.exports = {
  input: getVTIPath('src/cli.ts'), // 输入：./src/cli.ts
  // 输出文件：./dist/cli.js
  output: { file: getVTIPath(vtiPkg.main), name: vtiPkg.name, format: 'cjs', sourcemap: true },
  external: [...external, 'vls'],
  onwarn,
  watch: {
    include: getVTIPath('**')
  },
  plugins: createPlugins(getVTIPath('tsconfig.json'))
};
