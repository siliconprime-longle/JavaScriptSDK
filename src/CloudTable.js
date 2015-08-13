/*
  CloudTable
 */

CB.CloudTable = function(tableName){  //new table constructor

  CB._tableValidation(tableName);
  this.name = tableName;
  this.appId = CB.appId;

  if(tableName.toLowerCase() == "user") {
      this.type = "user";
      this.maxCount = 1;
  }
  else if(tableName.toLowerCase() == "role") {
      this.type = "role";
      this.maxCount = 1;
  }
  else {
      this.type = "custom";
      this.maxCount = 9999;
  }
  this.columns = CB._defaultColumns(this.type);
};

CB.CloudTable.prototype.addColumn = function(column){
  if (Object.prototype.toString.call(column) === '[object Object]') {
    if(CB._columnValidation(column, this))
      this.columns.push(column);

  } else if (Object.prototype.toString.call(column) === '[object Array]') {
      for(var i=0; i<column.length; i++){
        if(CB._columnValidation(column[i], this))
          this.columns.push(column[i]);
      }
  }
}

CB.CloudTable.prototype.deleteColumn = function(column){
  if (Object.prototype.toString.call(column) === '[object Object]') {
        if(CB._columnValidation(column, this)){
          this.columns = this.columns.filter(function(index){return index.name != column.name });
        }

  } else if (Object.prototype.toString.call(column) === '[object Array]') {
      //yet to test
      for(var i=0; i<column.length; i++){
        if(CB._columnValidation(column[i], this)){
          this.columns = this.columns.filter(function(index){return index.name != column[i].name });
        }
      }
  }
}

//CloudTable static functions
CB.CloudTable.getAll = function(callback){
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

  url = CB.serviceUrl + "/table/get/" + CB.appId;
  CB._request('PUT',url,params,true).then(function(response){
    response = JSON.parse(response);
    var objArray = [];
    for(var i=0; i<response.length; i++){
      if(response[i].name){
        var obj = new CB.CloudTable(response[i].name);
        if(response[i].columns){
        	obj.columns = response[i].columns;
        }
        if(response[i].id){
        	obj.id = response[i].id;
        }
        if(response[i]._id){
        	obj._id = response[i]._id;
        }
        objArray.push(obj);
      }
    }
    if (callback) {
        callback.success(objArray);
    } else {
        def.resolve(objArray);
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
}

CB.CloudTable.get = function(table, callback){
  if (Object.prototype.toString.call(table) === '[object Object]') {
    if(table.type == "user"){
      throw "cannot delete user table";
    }else if(table.type == "role"){
      throw "cannot delete role table";
    }else{
      if (!CB.appId) {
          throw "CB.appId is null.";
      }

      var def;
      if (!callback) {
          def = new CB.Promise();
      }

      var params=JSON.stringify({
          key: CB.appKey,
          appId: CB.appId
      });

      url = CB.serviceUrl + "/table/"+table.name;
      CB._request('PUT',url,params,true).then(function(response){
          if(response === "null"){
            obj = null;
        }else{
            response = JSON.parse(response);
            var obj = new CB.CloudTable(response.name);
            obj.columns = response.columns;
            obj.id = response.id;
            obj._id = response._id;
        }
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

    }
  } else if (Object.prototype.toString.call(table) === '[object Array]') {
    throw "cannot fetch array of tables";
  }
}

CB.CloudTable.delete = function(table, callback){
  if (Object.prototype.toString.call(table) === '[object Object]') {
      if (!CB.appId) {
          throw "CB.appId is null.";
      }

      var def;
      if (!callback) {
          def = new CB.Promise();
      }

      var params=JSON.stringify({
          key: CB.appKey,
          name: table.name
      });

      url = CB.serviceUrl + "/table/delete/" + CB.appId;
      CB._request('PUT',url,params,true).then(function(response){
        if (callback) {
            callback.success(response);
        } else {
            def.resolve(response);
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
  } else if (Object.prototype.toString.call(table) === '[object Array]') {
    throw "cannot delete array of tables";
  }
}

//CloudTable save function
CB.CloudTable.prototype.save = function(callback){
  var def;
  if (!callback) {
      def = new CB.Promise();
  }
  CB._validate();
  var thisObj = this;
  var params=JSON.stringify({
      maxCount:thisObj.maxCount,
      columns:thisObj.columns,
      name: thisObj.name,
      type: thisObj.type,
      id: thisObj.id,
      key:CB.appKey,
      _id:thisObj._id
  });

  url = CB.serviceUrl + "/table/create/" + CB.appId;
  CB._request('PUT',url,params,true).then(function(response){
      response = JSON.parse(response);
      var obj = new CB.CloudTable(response.name);
      obj.columns = response.columns;
      obj.id = response.id;
      obj._id = response._id;
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
}



