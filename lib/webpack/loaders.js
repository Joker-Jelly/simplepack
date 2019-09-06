const path = require('path');
const utils = require('../utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// the first is relative to ./bin, second is root path
const MAIN_NODE_MODULES_PATH = require.main.paths[1];

const defaultJSLoaderGroup = opts => {
  return [
    {
      loader: 'babel-loader',
      options: {
        babelrc: utils.get(opts, 'babel.babelrc') === true,
        'presets': [
          [require.resolve('@babel/preset-env'), { modules: false }],
          [require.resolve('@babel/preset-react'), { pragma: utils.get(opts, 'babel.jsx.pragma') }],
          [require.resolve('@babel/preset-typescript')]
        ],
        'plugins': [
          [require.resolve('@babel/plugin-syntax-dynamic-import')],
          [require.resolve('@babel/plugin-proposal-class-properties')],
          [require.resolve('@babel/plugin-transform-modules-commonjs')],
          [require.resolve('@babel/plugin-transform-runtime'), { absoluteRuntime: path.join(MAIN_NODE_MODULES_PATH, '@babel/runtime') }]
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
        test: /(\.[jt]sx?)$/,
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