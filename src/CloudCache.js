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
        // var params=JSON.stringify({
        //     document: CB.toJSON(thisObj),
        //     key: CB.appKey
        // });
        var url = CB.apiUrl + "/cache/" + this.appId + '/'+thisObj.cacheName+'/'+key+'/'+val+'/'+option;
        CB._request('POST',url,params).then(function(response){
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

CB.CloudCache.prototype.get = function(key){

};

CB.CloudCache.prototype.delete = function(){

};

CB>CloudCache.prototype.clear = function(){

};

CB.CloudCache.prototype.increment = function(){

};

CB.CloudCache.prototype.getInfo = function(){

};

CB.CloudCache.prototype.getAll = function(){

};
