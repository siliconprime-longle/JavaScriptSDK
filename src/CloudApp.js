import CB from './CB'
/*
 CloudApp
 */
class CloudApp {
    constructor(){
        this._isConnected = false;
    }
    init(serverUrl, applicationId, applicationKey, opts) { //static function for initialisation of the app
        if(!applicationKey)
        {
            applicationKey=applicationId;
            applicationId=serverUrl;
        }else {        
            CB.apiUrl = serverUrl;             
        }

        if(typeof applicationKey === "object"){
            opts = applicationKey;
            applicationKey=applicationId;
            applicationId=serverUrl;
        }

        CB.appId = applicationId;
        CB.appKey = applicationKey;

        if(opts && opts.disableRealtime === true){
            CB._isRealtimeDisabled = true;
        } else {
            if(CB._isNode){
                CB.io = require('IO')
                CB.Socket = CB.io(CB.apiUrl)
            } else {
                CB.io = require('./CloudSocketClientLib.js')
                CB.Socket = CB.io(CB.apiUrl);
            }        
        } 
        this._isConnected = true;  
    }

    onConnect(functionToFire) { //static function for initialisation of the app
        CB._validate();
        if(!CB.Socket){
            throw "Socket couldn't be found. Init app first.";
        }
        CB.Socket.on('connect', functionToFire);
    }

    onDisconnect(functionToFire) { //static function for initialisation of the app
        CB._validate();

        if(!CB.Socket){
            throw "Socket couldn't be found. Init app first.";
        }

        CB.Socket.on('disconnect', functionToFire);

    }

    connect() { //static function for initialisation of the app
        CB._validate();

        if(!CB.Socket){
            throw "Socket couldn't be found. Init app first.";
        }

        CB.Socket.connect();
        this._isConnected = true;
    }

    disconnect() { //static function for initialisation of the app
        CB._validate();

        if(!CB.Socket){
            throw "Socket couldn't be found. Init app first.";
        }

        CB.Socket.emit('socket-disconnect',CB.appId);
        this._isConnected = false;
    }
}

CB.CloudApp = new CloudApp()

export default CloudApp