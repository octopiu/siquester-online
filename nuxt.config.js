export default {
  render: {
    resourceHints: false,
    bundleRenderer: {
      shouldPreload: (_, type) => ['script', 'style', 'font'].includes(type),
      shouldPrefetch: (_, type) => ['script', 'style'].includes(type),
    },
  },

  server: {
    host: '0.0.0.0',
  },

  head: {
    title: 'siquester',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        href: 'https://fonts.googleapis.com/icon?family=Material+Icons+Outlined',
        rel: 'stylesheet'
      }
    ]
  },

  styleResources: {
    scss: [
      './assets/styles/variables.scss',
      './assets/styles/typography.scss',
    ],
  },

  css: [
    './assets/styles/typography.scss',
  ],

  plugins: [
  ],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
  ],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],

  axios: {
    baseURL: '/'
  },

  build: {
  }
}
