/*
  CloudTable
 */

CB.CloudTable = function(tableName){  //new table constructor

  tableValidation(tableName);
  this.name = tableName;
  this.appId = CB.appId;

  if(tableName.toLowerCase() == "user")
    this.type = "user";
  else if(tableName.toLowerCase() == "role")
    this.type = "role";
  else
    this.type = "custom";

  this.column = defaultColumns(this.type);
}

//CloudTable static functions
CB.CloudTable.getAll = function(){
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
  CB._request('GET',url,params).then(function(response){
      response = parseInt(response);
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
}

CB.CloudTable.get = function(table){
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
          key: CB.appKey
      });

      url = CB.serviceUrl + "/table/"+table.name+"/" + CB.appId;
      CB._request('GET',url,params).then(function(response){
          response = parseInt(response);
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

    }
  } else if (Object.prototype.toString.call(table) === '[object Array]') {
    throw "cannot delete array of tables";
  }
}

CB.CloudTable.delete = function(table){
  //check existance of table
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
          name: table.name
      });

      url = CB.serviceUrl + "/table/delete/" + CB.appId;
      CB._request('PUT',url,params).then(function(response){
          response = parseInt(response);
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

    }
  } else if (Object.prototype.toString.call(table) === '[object Array]') {
    throw "cannot delete array of tables";
  }
}

CB.CloudTable.addColumn = function(column){
  //check for duplication
  if (Object.prototype.toString.call(column) === '[object Object]') {
      this.column.push(column);
  } else if (Object.prototype.toString.call(column) === '[object Array]') {
      this.column.concat(column);
  }
}

CB.CloudTable.deleteColumn = function(column){
  //check for existance

}

//CloudTable save function
CB.CloudTable.prototype.save = function(){
  var def;
  if (!callback) {
      def = new CB.Promise();
  }

  CB._validate();

  var thisObj = this;
  thisObj.key = CB.appKey;
  var params=JSON.stringify({
      CB.toJSON(thisObj)
  });
  url = CB.serviceUrl + "/table/create/" + CB.appId;

  CB._request('PUT',url,params).then(function(response){
      CB.fromJSON(JSON.parse(response),thisObj);
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

  if (!callback) {
      return def;
  }
}

//validation
function tableValidation(tableName){

  if(!tableName) //if table name is empty
    throw "table name cannot be empty";

  if(!isNaN(tableName[0]))
    throw "table name should not start with a number";

  if(!tableName.match(/^\S+$/))
    throw "table name should not contain spaces";

  var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
  if(pattern.test(tableName))
    throw "table not shoul not contain special characters";
}

//generate a unique Id
function makeId(){
  //creates a random string of 8 char long.
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 8; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    return 'x'+text; //should start with char.
}

function defaultColumns(type){
  if(type == "custom")
     return [{
                  name: 'id',
                  id : makeId(),
                  dataType: 'Id',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'isSearchable',
                  dataType: 'Boolean',
                  id : makeId(),
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: false,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'createdAt',
                  dataType: 'DateTime',
                  id : makeId(),
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'updatedAt',
                  dataType: 'DateTime',
                  id : makeId(),
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'ACL',
                  dataType: 'ACL',
                  id : makeId(),
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              }];

   if(type == "user")
      return  [{
                  name: 'id',
                  dataType: 'Id',
                  id : makeId(),
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'username',
                  dataType: 'Text',
                  relatedTo: null,
                  id : makeId(),
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'email',
                  dataType: 'Email',
                  relatedTo: null,
                  id : makeId(),
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'password',
                  dataType: 'Password',
                  id : makeId(),
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'roles',
                  dataType: 'List',
                  relatedTo:null,
                  id : makeId(),
                  relatedToType :'role',
                  relationType: 'table',
                  required: false,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'isSearchable',
                  dataType: 'Boolean',
                  relatedTo: null,
                  id : makeId(),
                  relatedToType :null,
                  relationType: null,
                  required: false,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'createdAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  id : makeId(),
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'updatedAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  id : makeId(),
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'ACL',
                  dataType: 'ACL',
                  relatedTo: null,
                  id : makeId(),
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              }];

   if(type == "role")
      return [{
                  name: 'id',
                  dataType: 'Id',
                  relatedTo: null,
                  relatedToType :null,
                  id : makeId(),
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'name',
                  dataType: 'Text',
                  relatedTo: null,
                  relatedToType :null,
                  id : makeId(),
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'isSearchable',
                  dataType: 'Boolean',
                  relatedTo: null,
                  relatedToType :null,
                  id : makeId(),
                  relationType: null,
                  required: false,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'createdAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  id : makeId(),
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'updatedAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  id : makeId(),
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'ACL',
                  dataType: 'ACL',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  id : makeId(),
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              }];
}
