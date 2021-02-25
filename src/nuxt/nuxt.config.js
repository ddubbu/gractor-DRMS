module.exports = {
  telemetry: false,
  srcDir: 'src/nuxt/',
  modules: ['@nuxtjs/axios'],
  axios: {
    // proxy: true
    baseURL: 'http://localhost:8000',
  },
  plugins: [
    { src: '~plugins/vue-echarts', ssr: false },
    { src: '~plugins/vx-easyui', ssr: false }

  ],
  build: {
    // transpile: ['vue-echarts', 'resize-detector'],
    // transpile: ['vx-easyui', 'resize-detector'],
    extend(config) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  },
}
