module.exports = {
  telemetry: false,
  srcDir: 'src/nuxt/',
  modules: ['@nuxtjs/axios'],
  head: [

  ],
  axios: {
    // proxy: true
    baseURL: 'http://nas.gractor.com:9001'
    // baseURL: 'http://192.168.1.91:9001', // -> 회사에서
    // baseURL: 'http://localhost:9001', // --> 집에서 

  },
  plugins: [
    { src: '~plugins/vue-echarts', ssr: false },
    // { src: '~plugins/vx-easyui', ssr: false }
    "@/plugins/fontawesome.js",
    "@/store/index.js",
    { src: '~plugins/vx-easyui', ssr: false },

  ],
  build: {
    // transpile: ['vue-echarts', 'resize-detector'],
    // transpile: ['vx-easyui', 'resize-detector'],
    extend(config) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  },
  // buildModules: [
  //   // Simple usage
  //   '@nuxtjs/vuetify',

  //   // With options
  //   ['@nuxtjs/vuetify', { /* module options */ }]
  // ]

}
