const webpack = require('webpack');
const utils = require('../utils');

const loaders = require('./loaders');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const HappyPack = require('happypack');

module.exports = (opts, isDev) => {
  let spPlugins  = [];
  const commonPlugins = [
    new HappyPack({
      id: 'js',
      threads: 4,
      loaders: [ loaders.esEnvLoader(opts) ],
      verbose: false
    }),

    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('css/[name].css').replace(/css[./]+?js/, './css');
      },
      allChunks: true
    }),


  ];

  if(opts.entry.vendor){
    commonPlugins.push(
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity
      })
    );
  }

  if(isDev){
    spPlugins.push(...[
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'DIR_SIMPLEPACK': JSON.stringify(DIR_SIMPLEPACK),
          'NODE_ENV': JSON.stringify('development')
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

    // scope hosting
    if (!utils.get(opts, 'webpack.disableScopeHosting')) {
      spPlugins.push(
        new webpack.optimize.ModuleConcatenationPlugin()
      );
    }

    if(opts.compress){
      spPlugins.push(...[
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
  }

  return utils.concat(commonPlugins, spPlugins, ...(utils.get(opts, 'webpack.extraPlugins', [])));
};
