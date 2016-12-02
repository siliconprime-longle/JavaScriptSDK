import CB from './CB'
// import Socket from 'socket.io-client'

/*
 CloudApp
 */
CB.CloudApp = CB.CloudApp || {};
CB.CloudApp._isConnected = false;

CB.CloudApp.init = function(serverUrl, applicationId, applicationKey, opts) { //static function for initialisation of the app
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
    }else{
        // CB.io = Socket
        // CB.Socket = CB.io(CB.apiUrl);        
    } 
    CB.CloudApp._isConnected = true;  
};

CB.CloudApp.onConnect = function(functionToFire) { //static function for initialisation of the app
    CB._validate();

    if(!CB.Socket){
        throw "Socket couldn't be found. Init app first.";
    }

    CB.Socket.on('connect', functionToFire);
    

};

CB.CloudApp.onDisconnect = function(functionToFire) { //static function for initialisation of the app
    CB._validate();

    if(!CB.Socket){
        throw "Socket couldn't be found. Init app first.";
    }

    CB.Socket.on('disconnect', functionToFire);

};

CB.CloudApp.connect = function() { //static function for initialisation of the app
    CB._validate();

    if(!CB.Socket){
        throw "Socket couldn't be found. Init app first.";
    }

    CB.Socket.connect();
    CB.CloudApp._isConnected = true;
};

CB.CloudApp.disconnect = function() { //static function for initialisation of the app
    CB._validate();

    if(!CB.Socket){
        throw "Socket couldn't be found. Init app first.";
    }

    CB.Socket.emit('socket-disconnect',CB.appId);
    CB.CloudApp._isConnected = false;
};

export default true