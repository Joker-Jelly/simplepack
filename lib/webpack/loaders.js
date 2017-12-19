const REG_EXCLUDE_PATH = /(node_modules|bower_components)/;
const utils = require('../utils');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const esEnvLoader = opts => {
  return {
    loader: 'babel-loader',
    options: {
      'presets': [
        [require.resolve('babel-preset-env'), { 'modules': false }],
        [require.resolve('babel-preset-stage-3')]
      ],
      'plugins': [
        [require.resolve('babel-plugin-syntax-dynamic-import')],
        [require.resolve('babel-plugin-transform-react-jsx'), {pragma: utils.get(opts, 'babel.jsx.pragma')}]
      ]
    }
  }
};



const cssLoader = {
  loader: 'css-loader',
  options: {
    url: false,
    modules: true
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
        use: opts.extractCss ? 
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              cssLoader,
              'less-loader'
            ]
          }) : 
          [
            'style-loader',
            cssLoader,
            'less-loader'
          ]
      },

      {
        test: /\.css$/,
        exclude: REG_EXCLUDE_PATH,
        use: opts.extractCss ? 
          ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              cssLoader
            ]
          }) : 
          [
            'style-loader',
            cssLoader
          ]
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
        test: /\.(txt|raw|xml)$/,
        exclude: REG_EXCLUDE_PATH,
        use: [
          'raw-loader'
        ]
      },
      ...(opts.extraLoaders || [])
    ]
  ]
}