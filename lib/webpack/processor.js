const path    = require('path');
const utils   = require('../utils');
const webpack = require('webpack');

const WEBPACK_LOG_STYLE = {
  version: false,
  chunks: false,
  colors: true,
  modules: false,
  excludeAssets: /\.map$/
};

/*------------------------------------------------------------*/

const config = require('./config');

const _init = function(options, isDev) {

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
  /* module alias */

  config.resolve.alias = utils.assign(config.resolve.alias, options.moduleAlias);

  /*------------------------------------------------------------*/
  /* loaders */

  const loaders = require('./loaders');
  config.module.rules = utils.concat(config.module.rules, ...loaders.all(options, isDev));

  /*------------------------------------------------------------*/
  /* plugins */

  // common plugins
  const plugins = require('./plugins');
  config.plugins = utils.concat(config.plugins, plugins(options, isDev));

  return config;
}

const _addDevServerEntrypoints = function(config, devServerOptions) {
  const hotEntryPart = [
    require.resolve('webpack-dev-server/client/index') + '?/',
    require.resolve('webpack/hot/dev-server')
  ]

  if(!devServerOptions.hot){
    return;
  }

  config.entry = utils.mapValues(config.entry, entryPath => [
    ...hotEntryPart,
    entryPath
  ]);
}

const dev = function(options) {

  const config = _init(options, true);
  const devServerOptions = {
    hot: true,
    quiet: false,
    compress: true,
    stats: WEBPACK_LOG_STYLE,
    publicPath: config.output.publicPath
  };

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