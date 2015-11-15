/*
 CloudCache
 */

CB.CloudCache = function(cacheName){
    this.document = {};
    this.document._tableName = "_cache";
    this.document.name = cacheName;
    this.document.size = "";
    this.document.keys = [];
};

CB.CloudCache.prototype.put = function(key, callback){
  var def;
  CB._validate();
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey,
      item: this.document.item
  });

  var url = CB.apiUrl+'/cache/'+CB.appId+'/'+this.document.name+'/'+key;
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


  var url = CB.apiUrl+'/cache/'+CB.appId+'/'+this.document.name+'/'+key+'/item';
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


CB.CloudCache.prototype.getInfo = function(callback){
    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

  var params=JSON.stringify({
    document: CB.toJSON(this),
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/'+CB.appId +'/'+this.document.name;
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
  var url = CB.apiUrl+'/cache/'+CB.appId+'/'+this.document.name+'/items';
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

CB.CloudCache.prototype.deleteAll = function(callback){
    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

  var params=JSON.stringify({
    document: CB.toJSON(this),
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/'+CB.appId+'/'+this.document.name;
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

CB.CloudCache.getAll = function(callback){
    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

  var params=JSON.stringify({
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

CB.CloudCache.deleteAll = function(callback){
    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

  var params=JSON.stringify({
    // document: CB.toJSON(this),
      key: CB.appKey
  });

  var url = CB.apiUrl+'/cache/'+CB.appId;
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




