module.exports = {
  telemetry: false,
  srcDir: 'src/nuxt/',
  modules: ['@nuxtjs/axios'],
  axios: {
    // proxy: true
    baseURL: 'http://localhost:8000',
  },
  plugins: [
    { src: '~plugins/vue-echarts', ssr: false }
  ],
  build: {
    transpile: ['vue-echarts', 'resize-detector'],
  },
  
}
