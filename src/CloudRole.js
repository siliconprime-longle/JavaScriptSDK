/*
 CloudRole
 */
CB.CloudRole = CB.CloudRole || function(roleName) { //calling the constructor.
    if (!this.document) this.document = {};
    this.document._tableName = 'Role';
    this.document._type = 'role';
    this.document.name = roleName;
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

    var xmlhttp = CB._loadXml();
    var params=JSON.stringify({
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/role/getRole/" + roleName ;

    xmlhttp.open('POST',url,true);
    xmlhttp.setRequestHeader('Content-type','application/json');
    xmlhttp.send(params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                var thisObj=CB._deserialize(JSON.parse(xmlhttp.responseText));
                if (callback) {
                    callback.success(thisObj);
                } else {
                    def.resolve(thisObj);
                }
            } else {
                if (callback) {
                    callback.error(xmlhttp.responseText);
                } else {
                    def.reject(xmlhttp.responseText);
                }
            }
        }
    }

    if (!callback) {
        return def;
    }
};