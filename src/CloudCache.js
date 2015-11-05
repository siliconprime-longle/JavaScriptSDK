/*
 CloudCache
 */

CB.CloudCache = function(cacheName){
    this.cacheName = cacheName;

};

CB.CloudCache.prototype.put = function(key, val, option, callback){

    if (!callback) {
        def = new CB.Promise();
        return def;
    }

        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + CB.appId + '/'+this.cacheName+'/'+key+'/'+val+'/'+option;
        CB._request('POST',url).then(function(response){
            if (callback) {
                callback.success(this);
            } else {
                def.resolve(this);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });


};

CB.CloudCache.prototype.get = function(key, callback){

    if (!callback) {
        def = new CB.Promise();
        return def;
    }

        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + CB.appId + '/'+this.cacheName+'/'+key;
        CB._request('GET',url).then(function(response){
            if (callback) {
                callback.success(this);
            } else {
                def.resolve(this);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });

};

CB.CloudCache.prototype.delete = function(key, callback){
    if (!callback) {
        def = new CB.Promise();
        return def;
    }
        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + CB.appId + '/'+this.cacheName+'/'+key;
        CB._request('DELETE',url).then(function(response){

            if (callback) {
                callback.success(this);
            } else {
                def.resolve(this);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });

};

CB.CloudCache.prototype.clear = function(key, callback){
   if (!callback) {
        def = new CB.Promise();
        return def;
    }
        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + CB.appId + '/'+this.cacheName+'/'+key;
        CB._request('POST',url).then(function(response){

            if (callback) {
                callback.success(this);
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
};

CB.CloudCache.prototype.increment = function(){

};

CB.CloudCache.prototype.getInfo = function(key, callback){
     if (!callback) {
        def = new CB.Promise();
        return def;
    }

        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + CB.appId +"/"+this.cacheName+"/"+key;
        CB._request('GET',url).then(function(response){

            if (callback) {
                callback.success(this);
            } else {
                def.resolve(this);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });
};

CB.CloudCache.prototype.getAll = function(callback){
    if (!callback) {
        def = new CB.Promise();
        return def;
    }

        var xmlhttp = CB._loadXml();

        var url = CB.apiUrl + "/cache/" + CB.appId ;
        CB._request('GET',url).then(function(response){

            if (callback) {
                callback.success(this);
            } else {
                def.resolve(this);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });

};
