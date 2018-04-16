const webpack = require('webpack');
const utils = require('../utils');

const loaders = require('./loaders');

const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (opts, isDev) => {
  let spPlugins  = [];
  const commonPlugins = [];

  if(isDev){
    spPlugins.push(...[
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'DIR_SIMPLEPACK': JSON.stringify(DIR_SIMPLEPACK)
        }
      })
    ]);
  } else {
    if (!opts.notClear) {
      spPlugins.push(
        new CleanWebpackPlugin(['dist'], {
          root: DIR_PROJECT,
          verbose: false
        })
      );
    }
  }

  return utils.concat(commonPlugins, spPlugins, ...(utils.get(opts, 'webpack.extraPlugins', [])));
};
