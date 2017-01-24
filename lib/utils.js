const _  = require('lodash');
const fs = require('fs');

_.exist = function(filePath) {
  try{
    fs.accessSync(filePath);
    return true;
  }catch(e){
    return false;
  }
}

module.exports = _;