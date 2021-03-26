const path = require('path')
const alias = location => path.resolve(__dirname, location)

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('shader')
      .test(/\.glsl$/)
      .use('raw-loader')
        .loader('raw-loader')
        .end()

    config.resolve.alias
      .set('@Engine', alias('src/engine'))
      .set('@Messenger', alias('src/engine/messenger'))
      .set('@Events', alias('src/engine/events'))
      .set('@Input', alias('src/engine/input'))

    config.externals({
      // 'three': 'three'
    })
  }
}
