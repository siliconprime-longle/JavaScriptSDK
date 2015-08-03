var pjson = require('../package.json'); //Package.json. 
module.exports=require('../dist/'+pjson.version+'.js');
