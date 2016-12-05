import CB from './CB'
import './PrivateMethods'
import './CloudApp'
import './Column'
import './CloudTable'
import './ACL'
import './CloudGeoPoint'
import './CloudObject'
import './CloudFile'
import './CloudQueue'
import './CloudRole'
import './CloudUser'
import './CloudCache'
import './CloudNotification'
import './CloudPush'
import './CloudQuery'

try {
 window.CB = CB
} catch(e){
	console.log('window object not found')
}
export default CB

// import CB from '../dist/cloudboost.js'
// window.CB = CB


