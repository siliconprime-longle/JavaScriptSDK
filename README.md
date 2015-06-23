# CloudBoost: Hybrid No-Sql Database as a Service



## Installation
```
npm install cloudboost
```


### Usage

``` js

var CB = require('cloudboost');

// appId,appKey are the ID,key of the Application created in CloudBoost Dashboard
//This initializes your Application
CB.CloudApp.init('YourAppId','YourAppKey');

//Create a CloudObject of type 'Custom'
//Before you do this go to the table designer and create table first
var obj = new CB.CloudObject('Custom');

//Set the property 'name'
obj.set('name','CloudBoost');

//Save the object
obj.save({
    success:function(res){
        console.log("object saved successfully");
    },
    error:function(err){
        console.log("error while saving object");
    }
});

```
<img align="right" height="150" src="https://cloud.githubusercontent.com/assets/5427704/7724257/b7f45d6c-ff0d-11e4-8f60-06024eaa1508.png">
#### Documentation

Visit the [CloudBoost Docs](http://docs.cloudboost.io) for documentation.

