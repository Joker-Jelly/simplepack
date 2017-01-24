const path    = require('path');
const utils   = require('../utils');
const webpack = require('webpack');

/*------------------------------------------------------------*/

const config = require('./config');

const _init = function(options, isDev) {

  if(!isDev){
    config.output.path = path.join('./', config.output.publicPath);
    delete config.output.publicPath;
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
  /* loaders */

  const loaders = require('./loaders');
  config.module.rules = utils.concat(config.module.rules, ...loaders);

  /*------------------------------------------------------------*/
  /* plugins */

  if(options.compress){
    config.plugins = utils.concat(config.plugins || [], [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
      })
    ]);
  }

  return config;
}

const dev = function(options) {

  const config = _init(options, true);

  const WebpackDevServer = require('webpack-dev-server');
  const compiler = webpack(config);

  return new WebpackDevServer(compiler, {
    quiet: false,
    stats: {
      colors: true
    },
    publicPath: config.output.publicPath
  });

}

const publish = function(options) {

  const config = _init(options, false);
  webpack(config, (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString({
      colors: true
    }));
  });

}

module.exports = {dev, publish}