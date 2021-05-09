module.exports = {
  presets: [
    ...(process.env.NODE_ENV === 'test' ?
      [ '@babel/preset-env' ] :
      [ '@vue/cli-plugin-babel/preset' ]
    )
  ],
  plugins: [ ]
}
