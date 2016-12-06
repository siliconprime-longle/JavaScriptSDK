import CB from './CB'

try {
 	console.log('is window object Available ? ' ,!!window)
 	CB._isNode = false
} catch(e){
	console.log('now running on node platform')
	CB._isNode = true
}
console.log("Running on browser based pltform ? " , !CB._isNode)

if(CB._isNode){
	CB._loadXml = function(){
        var xmlhttp
        xmlhttp = require('xmlhttprequest').XMLHttpRequest
        xmlhttp = new xmlhttp();
        return xmlhttp; 
    }
	require( './node/PrivateMethods')
	require( './node/CloudApp')
} else {
	CB._loadXml = function(){
        var xmlhttp
        xmlhttp = XMLHttpRequest
        xmlhttp = new xmlhttp();
        return xmlhttp; 
    }
	require( './browser/PrivateMethods')
	require( './browser/CloudApp')
}

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
	console.log(e)
}
export default CB