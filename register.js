const tsNode = require('ts-node');
const tsConfigPaths = require('tsconfig-paths');
const babelRegister = require('@babel/register')

tsConfigPaths.register({
  baseUrl: './',
  paths: {
    "@/*": [ "src/*" ]
  }
})

tsNode.register({
  files: true,
  transpileOnly: true,
  project: './tsconfig.json'
})

babelRegister({
  ignore: [
    /\.glsl$/
  ],

  extensions: [".es6", ".es", ".jsx", ".cjs", ".js", ".mjs", ".ts"],
})
