module.exports = {
  entry: 'src/index.js',
  chainWebpack(config) {
    config.resolve.alias.set('vue$', 'vue/dist/vue.esm')
  }
}