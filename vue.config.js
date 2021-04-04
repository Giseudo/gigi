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
      .test(/\.fbx|glb$/)
      .use('file-loader')
        .loader('file-loader')
        .end()

    config.resolve.alias
      .set('@UI', alias('src/ui'))
      .set('@GEngine', alias('src/engine'))
      .set('@GComponents', alias('src/components'))
      .set('@GSystems', alias('src/systems'))
      .set('@GEntities', alias('src/entities'))

      .set('@GAudio', alias('src/engine/Audio'))
      .set('@GWorld', alias('src/engine/World'))
      .set('@GCamera', alias('src/engine/Camera'))
      .set('@GInput', alias('src/engine/Input'))
      .set('@GMessenger', alias('src/engine/Messenger'))
      .set('@GNavMesh', alias('src/engine/NavMesh'))
      .set('@GEvents', alias('src/engine/Messenger/events'))
      .set('@GPhysics', alias('src/engine/Physics'))
      .set('@GRenderer', alias('src/engine/Renderer'))
      .set('@GResources', alias('src/engine/Resources'))
      .set('@GScene', alias('src/engine/Scene'))
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
