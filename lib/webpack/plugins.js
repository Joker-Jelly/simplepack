const webpack = require('webpack');
const utils = require('../utils');

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
          'DIR_SIMPLEPACK': JSON.stringify(DIR_SIMPLEPACK),
          ...utils.get(opts, 'prcessEnv', {})
        },
      })
    ]);
  } else {
    if (!opts.notClear) {
      const CleanWebpackPlugin = require('clean-webpack-plugin');

      spPlugins.push(
        new CleanWebpackPlugin(['dist'], {
          root: DIR_PROJECT,
          verbose: false
        })
      );
    }

    if (!opts.notCompress) {
      const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

      spPlugins.push(
        new OptimizeCSSAssetsPlugin()
      );
    }

    if (opts.extractCss) {
      const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  
      spPlugins.push(
        new MiniCssExtractPlugin()
      );
    }
  
    if (utils.get(opts, 'webpack.showBundleAnalyzer')) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

      spPlugins.push(
        new BundleAnalyzerPlugin({
          openAnalyzer: false,
          defaultSizes: 'gzip',
          analyzerMode: 'static',
          generateStatsFile: true
        })
      );
    }
  }

  return utils.concat(commonPlugins, spPlugins, customExtraPlugins);
};
