const path = require('path');
const fs = require('fs');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const resolve = require('@rollup/plugin-node-resolve').default;
const { terser } = require('rollup-plugin-terser');

const getRootPath = root => relative => path.resolve(__dirname, '../', root, relative);

const clearDist = dist => {
  if (fs.existsSync(dist)) {
    // 删除文件
    fs.rmSync(dist, { recursive: true });
  }
};

const onwarn = (warning, warn) => {
  // typescript tslib
  if (warning.code === 'THIS_IS_UNDEFINED') return;

  warn(warning);
};

const external = [
  // node built-in
  'path',
  'fs',
  'child_process',
  'os',
  'net',
  'util',
  'crypto',
  'url',
  'assert',
  'inspector',
  'module',
  'events',
  'tty',
  'buffer',
  'stream',
  'string_decoder',
  'perf_hooks',
  // vscode
  'vscode'
];

const createPlugins = tsconfig => [
  json(), // import 方式引用*.json
  resolve(), // 支持 npm 模块引用的 rollup.js 插件( 帮助Rollup查找并打包依赖节点模块。如 nodejs 的 path、fs 模块 )
  commonjs(), // 支持 CommonJS 的模块引用的 rollup.js 插件( 如支持打包 require('path') )
  typescript({ tsconfig, tsconfigOverride: { compilerOptions: { module: 'esnext' } } }),
  terser() // 是一个用于压缩JavaScript 代码的插件
];

module.exports = {
  getRootPath,
  clearDist,
  onwarn,
  external,
  createPlugins
};
