const _  = require('lodash');
const fs = require('fs');
const path = require('path');
const glob  = require('glob');
const chalk = require('chalk');
const prettyjson = require('prettyjson');

const EXCLUDE_PATTERNS = ['./dist/**/*', './node_modules/**/*', './bower_components/**/*'];

_.exist = function(filePath) {
  try{
    fs.accessSync(filePath);
    return true;
  }catch(e){
    return false;
  }
}

_.removePathExt = function(dir) {
  return dir.replace(path.extname(dir), '');
}

_.formatJSONString = function(json) {
  return prettyjson.render(json, {
    inlineArrays: true
  });
}

/*------------------------------------------------------------*/

_.globPromise = function(pattern) {
  return new Promise((resolve, reject) => {
    if(_.isString(pattern)){
      glob(pattern, {ignore: EXCLUDE_PATTERNS, nonull: true}, (err, files) => err ? reject(err) : resolve(files));
    }else{
      resolve(pattern);
    }
  });
}

/*------------------------------------------------------------*/

_.log = {
  head: `[${chalk.blue('Simplepack')}]: `,
  plain(...msg) {
    console.log(...msg);
  },
  info(msg) {
    console.log(this.head, chalk.cyan(msg));
  },
  error(msg) {
    console.log(this.head, chalk.red(msg));
  }
}

module.exports = _;