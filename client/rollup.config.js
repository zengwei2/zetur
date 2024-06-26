const { getRootPath, clearDist, external, createPlugins } = require('../build/rollup-common-config');
const clientPkg = require('../package.json');

const getClientPath = getRootPath('client');

clearDist(getClientPath('../dist'));
module.exports = {
  input: getClientPath('vueMain.ts'), // 输入文件: ./client/vueMain.ts
  // 输出文件：dist/vueMain.js
  output: { file: clientPkg.main, name: clientPkg.name, format: 'cjs', sourcemap: true },
  external, // 告诉rollup不要将此lodash打包，而作为外部依赖
  watch: {
    include: getClientPath('**') // 监听 client 文件夹下的文件
  },
  plugins: createPlugins(getClientPath('tsconfig.json'))
};
