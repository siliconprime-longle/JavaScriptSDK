
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var CB = require('./dist/cloudboost');

var Chance = require('chance');
var  chance = new Chance();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

runTests();

//Ending
app.set('port', process.env.PORT || 6000);
var server = app.listen(app.get('port'), function() {	
	console.log("CBLanding started on PORT:"+app.get('port'));
});


function runTests(){

	/*var SECURE_KEY = "b8e40eda-3ec2-4e9e-b30c-8195be38fbae";
	var URL = "http://localhost:4730";

	var appId = chance.word();
    var url = URL+'/app/'+appId;
    var params = {};
    params.secureKey = SECURE_KEY;

	request({
	    url: url, //URL to hit
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/json'
	    },
	    json: params //Set the body as a string
	}, function(error, response, json){
	    if(error) {
	        done(error);
	    } else {
	        CB.CloudApp.init(URL, json.appId, json.keys.js);
	        CB.masterKey = json.keys.master;
	        CB.jsKey = json.keys.js;


	        var url = CB.serverUrl+'/db/mongo/connect';  
		    CB._request('POST',url).then(function() {
		        console.log("SUCEESS");
		    },function(err){
		        console.log(err)           
		    });
	    }
	});*/
	
}