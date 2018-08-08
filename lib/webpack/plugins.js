const webpack = require('webpack');
const utils = require('../utils');

const loaders = require('./loaders');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = (opts, isDev) => {
  let spPlugins  = [];
  const commonPlugins = [];

  let customExtraPlugins = utils.get(opts, 'webpack.extraPlugins', []);
  if (utils.isFunction(customExtraPlugins)) {
    customExtraPlugins = customExtraPlugins({}, opts, isDev);
  }

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

    if (!opts.notCompress) {
      spPlugins.push(
        new OptimizeCSSAssetsPlugin()
      );
    }
  }

  if (opts.extractCss) {
    spPlugins.push(
      new MiniCssExtractPlugin()
    );
  }

  return utils.concat(commonPlugins, spPlugins, customExtraPlugins);
};
