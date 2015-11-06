/*
 CloudCache
 */

CB.CloudCache = function(cacheName){
    this.cacheName = cacheName;

};

CB.CloudCache.prototype.put = function(cacheKey, val, callback){

    if (!CB.appId) {
      throw "CB.appId is null.";
  }

  var def;
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/'+CB.appId+'/'+this.cacheName+'/'+cacheKey+'/'+val;
  CB._request('POST',url,params,true).then(function(response){
    response = JSON.parse(response);
    var obj = CB.fromJSON(response);
    if (callback) {
        callback.success(obj);
    } else {
        def.resolve(obj);
    }
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

CB.CloudCache.prototype.get = function(cacheKey, callback){

     if (!CB.appId) {
      throw "CB.appId is null.";
  }

  var def;
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/get/'+CB.appId+'/'+this.cacheName+'/'+cacheKey;
  CB._request('GET',url,params,true).then(function(response){
    response = JSON.parse(response);
    var obj = CB.fromJSON(response);
    if (callback) {
        callback.success(obj);
    } else {
        def.resolve(obj);
    }
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

CB.CloudCache.prototype.delete = function(cacheKey, callback){
     if (!CB.appId) {
      throw "CB.appId is null.";
  }

  var def;
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/delete/'+CB.appId +'/'+this.cacheName+'/'+cacheKey;
  CB._request('DELETE',url,params,true).then(function(response){
    response = JSON.parse(response);
    var obj = CB.fromJSON(response);
    if (callback) {
        callback.success(obj);
    } else {
        def.resolve(obj);
    }
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

CB.CloudCache.prototype.clear = function(cacheKey, callback){
    if (!CB.appId) {
      throw "CB.appId is null.";
  }

  var def;
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/clear/'+CB.appId +'/'+this.cacheName+'/'+cacheKey;
  CB._request('PUT',url,params,true).then(function(response){
    response = JSON.parse(response);
    var obj = CB.fromJSON(response);
    if (callback) {
        callback.success(obj);
    } else {
        def.resolve(obj);
    }
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



CB.CloudCache.prototype.getInfo = function(cacheKey, callback){
     if (!CB.appId) {
      throw "CB.appId is null.";
  }

  var def;
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/info/'+CB.appId +'/'+this.cacheName+'/'+cacheKey;
  CB._request('GET',url,params,true).then(function(response){
    response = JSON.parse(response);
    var obj = CB.fromJSON(response);
    if (callback) {
        callback.success(obj);
    } else {
        def.resolve(obj);
    }
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

CB.CloudCache.prototype.getAll = function(callback){
    if (!CB.appId) {
      throw "CB.appId is null.";
  }

  var def;
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/'+CB.appId;
  CB._request('GET',url,params,true).then(function(response){
    response = JSON.parse(response);
    var obj = CB.fromJSON(response);
    if (callback) {
        callback.success(obj);
    } else {
        def.resolve(obj);
    }
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
