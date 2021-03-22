module.exports = {
  chainWebpack: config => {
    config.module
      .rule('shader')
      .test(/\.glsl$/)
      .use('raw-loader')
        .loader('raw-loader')
        .end()

    config.externals({
      // 'three': 'three'
    })
  }
}
