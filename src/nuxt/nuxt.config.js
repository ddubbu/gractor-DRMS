module.exports = {
  telemetry: false,
  srcDir: 'src/nuxt/',
  modules: ['@nuxtjs/axios'],
  axios: {
    // proxy: true
    baseURL: 'http://localhost:8000'
  }
}
