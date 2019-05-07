const utils = require('../utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const defaultJSLoaderGroup = opts => {
  return [
    {
      loader: 'babel-loader',
      options: {
        babelrc: utils.get(opts, 'babel.babelrc') === true,
        'presets': [
          [require.resolve('babel-preset-env'), { 'modules': false }],
          [require.resolve('babel-preset-stage-0')]
        ],
        'plugins': [
          [require.resolve('babel-plugin-syntax-dynamic-import')],
          [require.resolve('babel-plugin-transform-react-jsx'), {pragma: utils.get(opts, 'babel.jsx.pragma')}]
        ]
      }
    }
  ]
};

const defaultCSSLoaderGroup = opts => {
  return [
    opts.extractCss ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        url: false,
        modules: false,
        importLoaders: 1
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          require('autoprefixer')
        ]
      }
    }
  ]
}

module.exports = (opts, isDev) => {
  const REG_EXCLUDE_PATH = opts.buildExclude || /(node_modules|bower_components)/;
  let customExtraLoaders = utils.get(opts, 'webpack.extraLoaders', []);

  if (utils.isFunction(customExtraLoaders)) {
    customExtraLoaders = customExtraLoaders({
      defaultJSLoaderGroup, defaultCSSLoaderGroup
    }, opts, isDev);
  }

  return [
    // js loaders
    [
      {
        test: /(\.js|\.jsx)$/,
        exclude: REG_EXCLUDE_PATH,
        use: defaultJSLoaderGroup(opts)
      }
    ],

    // css loaders
    [
      {
        test: /\.less$/,
        exclude: REG_EXCLUDE_PATH,
        use: [
          ...defaultCSSLoaderGroup(opts),
          'less-loader'
        ]
      },

      {
        test: /\.css$/,
        exclude: REG_EXCLUDE_PATH,
        use: defaultCSSLoaderGroup(opts)
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
                js: defaultJSLoaderGroup(opts)
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
      ...customExtraLoaders
    ]
  ]
};