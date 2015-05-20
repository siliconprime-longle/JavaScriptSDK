# CloudBoost: Hybrid No-Sql Database as a Service

## Installation
```
npm install cloudboost
```
<img align="right" src="https://cloud.githubusercontent.com/assets/5427704/7724257/b7f45d6c-ff0d-11e4-8f60-06024eaa1508.png">

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

