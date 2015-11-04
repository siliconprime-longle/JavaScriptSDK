/*
 CloudObject
 */

CB.CloudCache = function(cacheName){
    this.appId = CB.appId;
    this.cacheName = CB.cacheName;

};

CB.CloudCache.prototype.put = function(key, val, option, callback){

    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;
    CB._fileCheck(this).then(function(thisObj){

        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + thisObj.appId + '/'+thisObj.cacheName+'/'+key+'/'+val+'/'+option;
        CB._request('POST',url).then(function(response){
            // thisObj = CB.fromJSON(JSON.parse(response),thisObj);
            if (callback) {
                callback.success(thisObj);
            } else {
                def.resolve(thisObj);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });

    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
    if (!callback) {
        return def;
    }
};

CB.CloudCache.prototype.get = function(key, callback){

    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;
    CB._fileCheck(this).then(function(thisObj){

        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + thisObj.appId + '/'+thisObj.cacheName+'/'+key;
        CB._request('GET',url).then(function(response){
            // thisObj = CB.fromJSON(JSON.parse(response),thisObj);
            if (callback) {
                callback.success(thisObj);
            } else {
                def.resolve(thisObj);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });

    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
    if (!callback) {
        return def;
    }

};

CB.CloudCache.prototype.delete = function(key, callback){
    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;
    CB._fileCheck(this).then(function(thisObj){

        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + thisObj.appId + '/'+thisObj.cacheName+'/'+key;
        CB._request('DELETE',url).then(function(response){

            if (callback) {
                callback.success(thisObj);
            } else {
                def.resolve(thisObj);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });

    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
    if (!callback) {
        return def;
    }

};

CB.CloudCache.prototype.clear = function(key, callback){
   if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;
    CB._fileCheck(this).then(function(thisObj){

        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + thisObj.appId + '/'+thisObj.cacheName+'/'+key;
        CB._request('POST',url).then(function(response){

            if (callback) {
                callback.success(thisObj);
            } else {
                def.resolve(thisObj);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });

    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
    if (!callback) {
        return def;
    }
};

CB.CloudCache.prototype.increment = function(){

};

CB.CloudCache.prototype.getInfo = function(){

};

CB.CloudCache.prototype.getAll = function(){
    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;
    CB._fileCheck(this).then(function(thisObj){

        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + thisObj.appId ;
        CB._request('GET',url).then(function(response){

            if (callback) {
                callback.success(thisObj);
            } else {
                def.resolve(thisObj);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });

    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
    if (!callback) {
        return def;
    }

};
