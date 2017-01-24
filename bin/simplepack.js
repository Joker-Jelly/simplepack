#! /usr/bin/env node

const path  = require('path');
const utils = require('../lib/utils');
const argv  = require('argh').argv;
const commands = argv.argv || [];

const DIR_PROJECT    = global.DIR_PROJECT = process.cwd();
const DIR_SIMPLEPACK = global.DIR_SIMPLEPACK = path.join(__dirname, '../');

const options = (function() {

  // default options
  const tempOptions = {

    // webpack or rollup
    engine: argv.engine || 'webpack',

    entry: argv.e || argv.entry,
    compress: argv.c || argv.compress,
    export: argv.export
  };

  // if there is a custom config
  const customConfig = path.join(DIR_PROJECT, 'simplepack.config.js');

  // cli argv will cover the custom config
  if (utils.exist(customConfig)) {
    return utils.merge(require(customConfig), tempOptions);
  }

  return tempOptions;
}());

/*------------------------------------------------------------*/

// specific engine's processor
const processor = require(`../lib/${options.engine}/processor`);

switch(commands[0]){

  case 'dev':
    const server = processor.dev(options);
    server.listen(8080);
    break;

  case 'publish':default:
    processor.publish(options);

};