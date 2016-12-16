///<reference path="./cloudboost.d.ts" />

import CB from './CB'

try {
 	if(window){
 		CB._isNode = false
 	}
} catch(e){
	CB._isNode = true
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
}
module.exports = CB