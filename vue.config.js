const path = require('path');
module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? '/vue-demo/dist/' : '/',
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      },

    }
  },

  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    },
    'style-resources-loader': {
      preProcessor: 'sass',
      patterns: [
        // path.resolve(__dirname,'./src/common/css/base.scss')
      ]
    },
  },
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule('png|jpg')
      .test(/\.(png|jpg)$/)
      .use('url-loader?limit=40000')
      .loader('url-loader?limit=40000')
      .end()
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('svg-inline-loader')
      .loader('svg-inline-loader')
  }
}
