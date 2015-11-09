/*
 CloudCache
 */

CB.CloudCache = function(cacheName){
    this.document = {};
    this.document.cacheName = cacheName;
};

CB.CloudCache.prototype.put = function(key, item, callback){
  var def;
  CB._validate();
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey,
      item: item
  });

  var url = CB.apiUrl+'/cache/'+CB.appId+'/'+this.document.cacheName+'/'+key;
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
CB.CloudCache.prototype.get = function(key, callback){

    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

  var params=JSON.stringify({
    document: CB.toJSON(this),
      key: CB.appKey
  });


  var url = CB.apiUrl+'/cache/'+CB.appId+'/'+this.document.cacheName+'/'+key;
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

CB.CloudCache.prototype.info = function(callback){
    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

  var params=JSON.stringify({
    document: CB.toJSON(this),
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/'+CB.appId +'/'+this.document.cacheName;
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

CB.CloudCache.prototype.getAll = function(callback){
    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

  var params=JSON.stringify({
    document: CB.toJSON(this),
      key: CB.appKey
  });
  var url = CB.apiUrl+'/cache/'+CB.appId;
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

CB.CloudCache.prototype.clear = function(callback){
    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

  var params=JSON.stringify({
    document: CB.toJSON(this),
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/'+CB.appId +'/'+this.document.cacheName;
  CB._request('DELETE',url,params,true).then(function(response){
    // response = JSON.parse(response);
    // var obj = CB.fromJSON(response);
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




