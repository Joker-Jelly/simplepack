const ExtractTextPlugin = require('extract-text-webpack-plugin');

const esEnvLoader = {
  loader: 'babel-loader',
  options: {
    'presets': [
      [require.resolve('babel-preset-env'), { 'loose': true, 'modules': false }]
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
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['happypack/loader?id=js']
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'happypack/loader?id=js',
          {
            loader: 'babel-loader',
            options: {
              'presets': ['react']
            }
          }
        ]
      }
    ],

    // css loaders
    [
      {
        test: /\.less$/,
        exclude: /node_modules/,
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
        exclude: /node_modules/,
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
        use: [
          'json-loader'
        ]
      },

      {
        test: /\.html$/,
        use: [
          'html-loader'
        ]
      },

      {
        test: /\.(txt)$/,
        use: [
          'raw-loader'
        ]
      }
    ]
  ]
}