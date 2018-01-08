const ParseInfo=require('./parseInfo.js');
const StrictParseInfo=require('./strictParseInfo.js');

const basic=function(initialParsingFunction) {
  return new ParseInfo(initialParsingFunction);
}

const strict=function(listOfKeys,flag) {
  return function(initialParsingFunction) {
    return new StrictParseInfo(initialParsingFunction,listOfKeys,flag);
  }
}
module.exports = {
  basic: basic,
  strict: strict
}
