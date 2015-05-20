# CloudBoost: Hybrid No-Sql Database as a Service

## Installation
```
npm install cloudboost
```
<img align="right" src="https://cloud.githubusercontent.com/assets/5427704/7723971/bf689f5c-ff0a-11e4-9603-bf20ae669730.png">

### Usage

``` js

var CB = new require('cloudboost');
var obj = new CB.CloudObject('Dbass');
obj.set('name','cloudboost');
obj.save().then(function(res){
    console.log("object saved successfully");
},function(err){
    console.log("error while saving object");
});
```
#### Documentation

Visit the [CloudBoost Docs](http://docs.cloudboost.io) for documentation.

