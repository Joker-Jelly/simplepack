const path = require('path');

module.exports = {
  entry: [],
  output: {
    path: path.resolve(path.join(DIR_PROJECT, 'dist')),
    filename: '[name].js',
    chunkFilename: 'sp-asyncbundle.[chunkhash].js',
    publicPath: '/dist/'
  },
  resolveLoader: {
    modules: [
      path.join(global.DIR_SIMPLEPACK, 'node_modules'), 
      path.join(global.DIR_PROJECT, 'node_modules')
    ]
  },
  externals: [],
  resolve: {
    alias: {}
  },
  module: {
    rules: []
  },
  plugins: [],
  optimization: {}
};