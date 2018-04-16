const REG_EXCLUDE_PATH = /(node_modules|bower_components)/;
const utils = require('../utils');

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
    modules: false
  }
}

module.exports = opts => [
  // js loaders
  [
    {
      test: /(\.js|\.jsx)$/,
      exclude: REG_EXCLUDE_PATH,
      use: esEnvLoader(opts)
    }
  ],

  // css loaders
  [
    {
      test: /\.less$/,
      exclude: REG_EXCLUDE_PATH,
      use: [
        'style-loader',
        cssLoader,
        'less-loader'
      ]
    },

    {
      test: /\.css$/,
      exclude: REG_EXCLUDE_PATH,
      use: [
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
              js: esEnvLoader(opts)
            }
          }
        }
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
    ...(utils.get(opts, 'webpack.extraLoaders', []))
  ]
];