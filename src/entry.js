import CB from './CB'

try {
 	if(window){
 		CB._isNode = false
 	}
} catch(e){
	CB._isNode = true
}

if(CB._isNode){
	CB._loadXml = function(){
        var xmlhttp
        xmlhttp = require('xmlhttprequest').XMLHttpRequest
        xmlhttp = new xmlhttp();
        return xmlhttp; 
    }
	
} else {
	CB._loadXml = function(){
        var xmlhttp
        xmlhttp = XMLHttpRequest
        xmlhttp = new xmlhttp();
        return xmlhttp; 
    }
}

require( './PrivateMethods')
require( './CloudApp')
require( './Column')
require( './CloudTable')
require( './ACL')
require( './CloudGeoPoint')
require( './CloudObject')
require( './CloudFile')
require( './CloudQueue')
require( './CloudRole')
require( './CloudUser')
require( './CloudCache')
require( './CloudNotification')
require( './CloudPush')
require( './CloudQuery')

try {
 window.CB = CB
} catch(e){
	// console.log(e)
}
module.exports = CB