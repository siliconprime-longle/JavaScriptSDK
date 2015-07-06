/*
 CloudRole
 */
CB.CloudRole = CB.CloudRole || function(roleName) { //calling the constructor.
    if (!this.document) this.document = {};
    this.document._tableName = 'Role';
    this.document._type = 'role';
    this.document.name = roleName;
    this.document.ACL = new CB.ACL();
    this.document._isModified = true;
    this.document._modifiedColumns = ['createdAt','updatedAt','ACL'];
};

CB.CloudRole.prototype = Object.create(CB.CloudObject.prototype);

Object.defineProperty(CB.CloudRole.prototype, 'name', {
    get: function() {
        return this.document.name;
    },
    set: function(name) {
        this.document.name = name;
    }
});

CB.CloudRole.getRole = function(role, callback) {
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    var roleName = role.document.name;
    var params=JSON.stringify({
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/role/getRole/" + roleName ;

    CB._request('POST',url,params).then(function(response){
        var thisObj = CB._deserialize((JSON.parse(response)));
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
};
