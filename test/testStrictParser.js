const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const chaiAssert=require('chai').assert;
const Parsed=require(src('parsed.js'));
const StrictParser=require(src('index.js')).StrictParser;
const InvalidKeyError=require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker=function(key,pos) {
  return function(err) {
    if(err instanceof InvalidKeyError && err.invalidKey==key && err.position==pos)
      return true;
    return false;
  }
}

describe("strict parser",function(){
  it("should only parse keys that are specified for a single key",function(){
    let kvParser=new StrictParser(["name"]);
    chaiAssert.throws(
      () => {
        try {
          kvParser.parse("age=23");
        } catch (e) {
          let error=invalidKeyErrorChecker("age",5);
          if (error) throw error;
        }
      })
  });

  it("should only parse keys that are specified for multiple keys",function(){
    let expected=new Parsed();
    let kvParser=new StrictParser(["name","age"]);
    let actual=kvParser.parse("name=john age=23");
    expected["name"]="john";
    expected["age"]="23";
    chaiAssert.deepEqual(expected,actual);
    chaiAssert.throws(
      () => {
        try {
          kvParser.parse("color=blue");
        } catch (e) {
          let error=invalidKeyErrorChecker("color",9);
          if (error) throw error;
        }
      })
  });

  it("should throw an error when one of the keys is not valid",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        try {
          kvParser.parse("name=john color=blue age=23");
        } catch (e) {
          let error=invalidKeyErrorChecker("color",20);
          if (error) throw error;
        }
      })
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        try {
          kvParser.parse("color   = blue");
        } catch (e) {
          if (invalidKeyErrorChecker("color",13)) throw error;
        }
      })
  });

  it("should throw an error on invalid key when there are quotes on values",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        try {
          kvParser.parse("color   = \"blue\"");
        } catch (e) {
          let error=invalidKeyErrorChecker("color",15);
          if (error) throw error;
        };
    })
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        try {
          kvParser.parse("name = john color   = \"light blue\"");
        } catch (e) {
          let error=invalidKeyErrorChecker("color",33);
          if (error) throw error;
        }
      })
  });

  it("should throw an error when no valid keys are specified",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser([]);
        try {
          kvParser.parse("name=john");
        } catch (e) {
          let error=invalidKeyErrorChecker("name",8);
          if (error) throw error;
        }
      })
  });

  it("should throw an error when no array is passed",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser();
        try {
          kvParser.parse("name=john");
        } catch (e) {
          let error=invalidKeyErrorChecker("name",8);
          if (error) throw error;
        }
      })
  });
});
