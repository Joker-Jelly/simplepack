#! /usr/bin/env node

const path  = require('path');
const utils = require('../lib/utils');
const args  = require('args');

const DIR_PROJECT    = global.DIR_PROJECT = process.cwd();
const DIR_SIMPLEPACK = global.DIR_SIMPLEPACK = path.join(__dirname, '../');

const FLAG_MULTI_ENTRY = '@multi';
const FLAG_VENDOR_ENTRY = '@vendor';

// set default server port
let HOST = '127.0.0.1';
let PORT = 8080;

/*------------------------------------------------------------*/
/* Get CLI Args */

utils.log.info(`Start parse config file...`);

const argv = {};
const parseSubComArgv = (cmds, sub, opts) => {
  argv.cmd = cmds[0];
  argv.opts = opts
};

args
  .option('entry', 'The list entries')
  .option('engine', 'The name of workflow engine', 'webpack')
  .option('config', 'Specifies a different configuration file to pick up')
  .option('compress', 'Whether compress the output code')
  .option('export', 'The name of Component export')
  .option('extract-css', 'Whether extract css file from bundle', false)
  .option('cli-only', 'Use CLI config only, not merge config file', false)
    .command('dev', 'Start dev server for develop', parseSubComArgv, ['d'])
    .command('publish', 'get dist. file for publish', parseSubComArgv, ['p'])

args.parse(process.argv);

/*------------------------------------------------------------*/
/* Parse Options */

// default options
let tempOptions = {

  // webpack or rollup
  engine: argv.opts.engine || 'webpack',

  entry: argv.opts.entry,
  compress: argv.opts.compress,
  export: argv.opts.export,
  extractCss: argv.opts.extractCss
};


// if there is a custom config
const customConfig = argv.opts.config || path.join(DIR_PROJECT, 'simplepack.config.js');

// cli argv will cover the custom config
if (!argv.opts.cliOnly && utils.exist(customConfig)) {
  tempOptions = utils.merge(require(customConfig), tempOptions);
}

/**
 * parse options to webpack style
 *
 * @example
 * (glob or path) string  => Array[path,...] => Object{path: path}
 */
const parseOptions = function(){
  const globEntry = utils.isString(tempOptions.entry) ? tempOptions.entry : tempOptions.entry[FLAG_MULTI_ENTRY];
  const vendorEntry = tempOptions.entry[FLAG_VENDOR_ENTRY];

  if(globEntry){
    return utils.globPromise(globEntry)
      .then(pathArr => utils.mapKeys(pathArr, utils.removePathExt))
      .then(parseEntry => {
        if(vendorEntry){
          parseEntry.vendor = vendorEntry;
        }
        return parseEntry;
      })
      .then(parseEntry => {
        if(utils.isObject(tempOptions.entry)){
          utils.assign(parseEntry,
            utils.omit(tempOptions.entry, [FLAG_MULTI_ENTRY, FLAG_VENDOR_ENTRY])
          );
        }

        return parseEntry;
      })
      .then(parseEntry => {
        tempOptions.entry = parseEntry;
        return tempOptions;
      });
  }

  return Promise.resolve(tempOptions);
}

/*------------------------------------------------------------*/
/* Sub Command Define */

parseOptions().then(options => {

  utils.log.info(`Using config file \n ${utils.formatJSONString(options)}`);

  // specific engine's processor
  const processor = require(`../lib/${options.engine}/processor`);

  switch(argv.cmd){

    case 'publish':
      processor.publish(options);
      break;

    case 'dev':default:
      const server = processor.dev(options);

      server.listen(PORT, HOST)
        .on('error', () => {
          utils.log.error(`Server port ${PORT} in use, auto change to ${++PORT}`);
          server.listen(PORT, HOST);
        })
        .once('listening', () => utils.log.info(`Server started at http://${HOST}:${PORT}`));
  };

}).catch(e => utils.log.error(e.stack));