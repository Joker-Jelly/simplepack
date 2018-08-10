#! /usr/bin/env node

const path  = require('path');
const utils = require('../lib/utils');
const args  = require('args');

const DIR_PROJECT    = global.DIR_PROJECT = process.cwd();
const DIR_SIMPLEPACK = global.DIR_SIMPLEPACK = path.join(__dirname, '../');

const BAD_DEFAULT_ENTRY = './index.js';

const FLAG_MULTI_ENTRY = '@multi';
const FLAG_VENDOR_ENTRY = '@vendor';

// set default server port
let HOST = '127.0.0.1';
let PORT = 8080;

const packageJSON = (() => {
  const filePath = path.join(DIR_PROJECT, 'package.json');
  if (utils.exist(filePath)) {
    return require(filePath);
  } else {
    utils.log.error('Should start in project root');
  }
})();

const defaultMainEntry = 
  packageJSON ? 
    './' + path.normalize(packageJSON.module || packageJSON.main) : 
    BAD_DEFAULT_ENTRY;

/*------------------------------------------------------------*/
/* Get CLI Args */

utils.log.info(`Start parse config file...`);

// default options
const argv = {};
const parseSubComArgv = (cmds, sub, opts) => {
  argv.cmd = cmds[0];
  argv.opts = opts;
};

args
  .option('entry', 'The list entries', defaultMainEntry)
  .option('port', 'The port that server should listen', PORT)
  .option('runtime-engine', 'The name of workflow engine', 'webpack')
  .option('config', 'Specifies a different configuration file to pick up')
  .option('not-compress', 'Do not compress the output code')
  .option('not-clear', 'Do not clear the output dir')
  .option('module-export', 'The name of module export, using in write a component')
  .option('extract-css', 'Whether extract css file from bundle')
  .option('include-nodemodules', 'Whether include node modules folder', false)
  .option('cli-only', 'Use CLI config only, not merge config file', false)
    .command('dev', 'Start dev server for develop', parseSubComArgv, ['d'])
    .command('publish', 'get dist. file for publish', parseSubComArgv, ['p'])

if (process.argv.length <= 2) {
  process.argv.push('-h')
}    

args.parse(process.argv);

if (!utils.isObject(argv.opts)) {
  utils.log.error(`Must specify a certain command [dev/publish], use 'simplepack -h' to get more information`);
  process.exit(1);
}

/*------------------------------------------------------------*/
/* Parse Options */

// override the default port
PORT = argv.opts.port;

// default options
let tempOptions = {

  // webpack or rollup
  engine: argv.opts.runtimeEngine || 'webpack',

  entry: argv.opts.entry,
  export: argv.opts.moduleExport,
  notClear: argv.opts.notClear,
  extractCss: argv.opts.extractCss,
  notCompress: argv.opts.notCompress,
  includeNodemodules: argv.opts.includeNodemodules
};

// if there is a custom config
const customConfig = argv.opts.config || path.join(DIR_PROJECT, 'simplepack.config.js');

// cli argv will cover the custom config
if (!argv.opts.cliOnly && utils.exist(customConfig)) {
  tempOptions = utils.merge(tempOptions, require(customConfig));
}

/**
 * parse options to webpack style
 *
 * @example
 * (glob or path) string  => Array[path,...] => Object{path: path}
 */
const parseOptions = function(){
  const stringEntry = utils.isString(tempOptions.entry) ? tempOptions.entry : tempOptions.entry[FLAG_MULTI_ENTRY];
  const vendorEntry = tempOptions.entry[FLAG_VENDOR_ENTRY];

  if (stringEntry) {

    if (utils.includes(stringEntry, ',')) {
      
      const [key, value] = stringEntry.split(',');

      if (key && value) {
        tempOptions.entry = {
          [key.trim()]: value.trim()
        };
      }
    } else {
      return utils.globPromise(stringEntry)
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

      server.listen(PORT)
        .on('error', () => {
          utils.log.error(`Server port ${PORT} in use, auto change to ${++PORT}`);
          server.listen(PORT);
        })
        .once('listening', () => utils.log.info(`Server started at http://${HOST}:${PORT}`));
  };

}).catch(e => utils.log.error(e.stack));