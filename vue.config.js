const path = require('path')
const webpack = require('webpack')

const alias = location => path.resolve(__dirname, location)

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('shader')
      .test(/\.glsl$/)
      .use('raw-loader')
        .loader('raw-loader')
        .end()

    config.module
      .rule('models')
      .test(/\.fbx$/)
      .use('file-loader')
        .loader('file-loader')
        .end()

    config.resolve.alias
      .set('@Engine', alias('src/engine'))
      .set('@Audio', alias('src/engine/Audio'))
      .set('@Camera', alias('src/engine/Camera'))
      .set('@Input', alias('src/engine/Input'))
      .set('@Messenger', alias('src/engine/Messenger'))
      .set('@NavMesh', alias('src/engine/NavMesh'))
      .set('@Events', alias('src/engine/Messenger/events'))
      .set('@Physics', alias('src/engine/Physics'))
      .set('@Renderer', alias('src/engine/Renderer'))
      .set('@Resources', alias('src/engine/Resources'))
      .set('@Scene', alias('src/engine/Scene'))
  },

  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        THREE: 'three',
        fflate: 'fflate'
      })
    ]
  },

  devServer: {
    disableHostCheck: true
  }
}
