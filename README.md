# CloudBoost: Hybrid No-Sql Database as a Service



## Installation
```
npm install cloudboost
```


### Usage

``` js

var CB = require('cloudboost');

// appId,appKey are the ID,key of the Application created in CloudBoost Dashboard
//This initialises you Application
CB.CloudApp.init(appID,appKey);

//Create a CloudObject of type 'Dbass'
var obj = new CB.CloudObject('Dbass');

//Set the property 'name'
obj.set('name','cloudboost');

//Save the object
obj.save().then(function(res){
    console.log("object saved successfully");
},function(err){
    console.log("error while saving object");
});

```
<img align="right" height="150" src="https://cloud.githubusercontent.com/assets/5427704/7724257/b7f45d6c-ff0d-11e4-8f60-06024eaa1508.png">
#### Documentation

Visit the [CloudBoost Docs](http://docs.cloudboost.io) for documentation.

