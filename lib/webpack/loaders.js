const REG_EXCLUDE_PATH = /(node_modules|bower_components)/;

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const esEnvLoader = {
  loader: 'babel-loader',
  options: {
    'presets': [
      [require.resolve('babel-preset-react')],
      [require.resolve('babel-preset-env'), { 'loose': true, 'modules': false }],
      [require.resolve('babel-preset-stage-3')]
    ]
  }
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    url: false
  }
}

module.exports = {
  esEnvLoader,
  all: opts => [
    // js loaders
    [
      {
        test: /\.js|\.jsx$/,
        exclude: REG_EXCLUDE_PATH,
        use: ['happypack/loader?id=js']
      }
    ],

    // css loaders
    [
      {
        test: /\.less$/,
        exclude: REG_EXCLUDE_PATH,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            cssLoader,
            'less-loader',
          ]
        })
      },
      {
        test: /\.css$/,
        exclude: REG_EXCLUDE_PATH,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            cssLoader,
          ]
        })
      }
    ],

    // img+font loaders
    [
      {
        test: /\.(png|jpg|jpeg|gif|tff|eot|woff|woff2)$/,
        exclude: REG_EXCLUDE_PATH,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ],

    // other loaders
    [
      {
        test: /\.vue$/,
        exclude: REG_EXCLUDE_PATH,
        use: [
          {
            loader: 'vue-loader',
            options: {
              loaders: {
                js: 'happypack/loader?id=js'
              }
            }
          }
        ]
      },

      {
        test: /\.json$/,
        exclude: REG_EXCLUDE_PATH,
        use: [
          'json-loader'
        ]
      },

      {
        test: /\.html$/,
        exclude: REG_EXCLUDE_PATH,
        use: [
          'html-loader'
        ]
      },

      {
        test: /\.(txt|raw)$/,
        exclude: REG_EXCLUDE_PATH,
        use: [
          'raw-loader'
        ]
      }
    ]
  ]
}