const path = require('path');

module.exports = {
  entry: [],
  output: {
    path: '/',
    filename: '[name].js',
    publicPath: '/dist/'
  },
  resolveLoader: {
    modules: [path.join(global.DIR_SIMPLEPACK, 'node_modules')]
  },
  module: {
    rules: []
  }
};