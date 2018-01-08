const Parsed=require("./parsed.js");
const ParseInfo=require("./parseInfo.js");
const InvalidKeyError=require("./errors/invalidKeyError.js");

const contains=function(list,key,flag=true) {
  return list.find(function(validKey){
    if (!flag)
      return key.toLowerCase()==validKey.toLowerCase();
    return key==validKey;
  });
}

var StrictParseInfo=function(initialParsingFunction,validKeys,flag) {
  ParseInfo.call(this,initialParsingFunction);
  this.validKeys=validKeys;
  this.flag=flag;
}

StrictParseInfo.prototype=Object.create(ParseInfo.prototype);

StrictParseInfo.prototype.pushKeyValuePair=function() {
  if(!contains(this.validKeys,this.currentKey,this.flag))
    throw new InvalidKeyError("invalid key",this.currentKey,this.currentPos);
  this.parsedKeys[this.currentKey]=this.currentValue;
  this.resetKeysAndValues();
}

module.exports=StrictParseInfo;
