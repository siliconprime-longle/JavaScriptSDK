/*
 CloudApp
 */

CB.CloudApp = CB.CloudApp || {};

CB.CloudApp.init = function(applicationId, applicationKey, callback) { //static function for initialisation of the app

    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    CB.appId = applicationId;
    CB.appKey = applicationKey;

    //load socket.io.

    var socketIoLoadCheker = setInterval(function(){
        if(CB.io){
            clearInterval(socketIoLoadCheker);
            if (callback) {
                callback.success();
            } else {
                def.resolve();
            }
        }
    }, 200);

    if (!callback) {
        return def;
    }
};