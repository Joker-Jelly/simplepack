const path    = require('path');
const utils   = require('../utils');
const webpack = require('webpack');

const WEBPACK_LOG_STYLE = {
  version: false,
  chunks: false,
  colors: true,
  modules: false,
  children: false,
  excludeAssets: /\.map$/
};

/*------------------------------------------------------------*/

const config = require('./config');

const _init = function(options, isDev) {

  if (options.distDirName) {
    config.output.path = path.resolve(DIR_PROJECT, options.distDirName);

    if (isDev) {
      config.output.publicPath = `/${options.distDirName}/`;
    }
  }

  if (!isDev && options.distPublicPath) {
    config.output.publicPath = options.distPublicPath;
  }

  if(options.entry){
    config.entry = options.entry;
  }

  if(options.export){
    utils.assign(config.output, {
      library: options.export,
      libraryTarget: 'umd'
    });
  }

  /*------------------------------------------------------------*/
  /* mode */
  config.mode = isDev ? 'development' : 'production';

  /*------------------------------------------------------------*/
  /* module alias */

  config.resolve.alias = utils.assign(config.resolve.alias, utils.get(options, 'webpack.moduleAlias'));

  /*------------------------------------------------------------*/
  /* module externals */

  config.externals = utils.get(options, 'webpack.moduleExternals', []);

  /*------------------------------------------------------------*/
  /* loaders */

  const loaders = require('./loaders');
  config.module.rules = utils.concat(config.module.rules, ...loaders(options, isDev));

  /*------------------------------------------------------------*/
  /* plugins */

  // common plugins
  const plugins = require('./plugins');
  config.plugins = utils.concat(config.plugins, plugins(options, isDev));

  /*------------------------------------------------------------*/
  /* sourcemap */

  if (isDev) {
    config.devtool = 'eval-source-map';
  }

  /*------------------------------------------------------------*/
  /* optimization */

  // split chunk
  if (options.entry.vendor) {
    config.optimization.splitChunks = {
      cacheGroups: {
        common: {
          chunks: 'all',
          minChunks: Infinity,
          name: 'vendor'
        }
      }
    }
  }

  // compress
  if (options.notCompress) {
    config.optimization.minimize = false;
  }

  // add __unsafe__ config, to direct merge into origin webpack config
  // this prop. have high priority
  utils.merge(config, utils.get(options, 'webpack.__originConfig', {}));

  return config;
}

const _addDevServerEntrypoints = function(config, devServerOptions) {
  if(!devServerOptions.hot){
    return;
  }

  config.entry = utils.mapValues(config.entry, entryPath => [
    path.join(DIR_SIMPLEPACK, './lib/webpack/hot-module'),
    entryPath
  ]);
}

const dev = function(options) {

  const config = _init(options, true);
  const devServerOptions = utils.assign({
    hot: true,
    quiet: false,
    compress: true,
    disableHostCheck: true,
    stats: WEBPACK_LOG_STYLE,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    publicPath: config.output.publicPath
  }, config.devServer);

  const WebpackDevServer = require('webpack-dev-server');
  _addDevServerEntrypoints(config, devServerOptions);
  const compiler = webpack(config);

  return new WebpackDevServer(compiler, devServerOptions);

}

const publish = function(options) {

  const config = _init(options, false);
  webpack(config, (err, stats) => {
    if (err) {
      utils.log.error(err);
      return;
    }

    utils.log.plain(stats.toString(WEBPACK_LOG_STYLE));
    utils.log.info('Publish finish.');
  });

}

module.exports = {dev, publish}