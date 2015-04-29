/*
 CloudUser
 */
CB.CloudUser = CB.CloudUser || function() {
    if (!this.document) this.document = {};
    this.document._tableName = 'User';
    this.document._type = 'user';
};
CB.CloudUser.prototype = new CB.CloudObject;
Object.defineProperty(CB.CloudUser.prototype, 'username', {
    get: function() {
        return this.document.username;
    },
    set: function(username) {
        this.document.username = username;
    }
});
Object.defineProperty(CB.CloudUser.prototype, 'password', {
    get: function() {
        return this.document.password;
    },
    set: function(password) {
        this.document.password = password;
    }
});
Object.defineProperty(CB.CloudUser.prototype, 'email', {
    get: function() {
        return this.document.email;
    },
    set: function(email) {
        this.document.email = email;
    }
});
CB.CloudUser.current = new CB.CloudUser();
CB.CloudUser.prototype.signUp = function(callback) {
    if (!this.document.username) {
        throw "Username is not set.";
    }
    if (!this.document.password) {
        throw "Password is not set.";
    }
    if (!this.document.email) {
        throw "Email is not set.";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //now call the signup API.

    var xmlhttp = CB._loadXml();
    var params=JSON.stringify({
        document: CB._serialize(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/signup" ;

    xmlhttp.open('POST',url,true);
    xmlhttp.setRequestHeader('Content-type','application/json');
    xmlhttp.send(params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                CB._deserialize(JSON.parse(xmlhttp.responseText), thisObj);
                CB.CloudUser.current = thisObj;
                if (callback) {
                    callback.success(thisObj);
                } else {
                    def.resolve(thisObj);
                }
            } else {
                CB.CloudUser.current = null;
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
CB.CloudUser.prototype.logIn = function(callback) {
    if (!this.document.username) {
        throw "Username is not set.";
    }
    if (!this.document.password) {
        throw "Password is not set.";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //now call the signup API.

    var xmlhttp = CB._loadXml();
    var params=JSON.stringify({
        document: CB._serialize(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/login" ;

    xmlhttp.open('POST',url,true);
    xmlhttp.setRequestHeader('Content-type','application/json');
    xmlhttp.send(params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                CB._deserialize(JSON.parse(xmlhttp.responseText), thisObj);
                CB.CloudUser.current = thisObj;
                if (callback) {
                    callback.success(thisObj);
                } else {
                    def.resolve(thisObj);
                }
            } else {
                CB.CloudUser.current = null;
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
CB.CloudUser.prototype.logOut = function(callback) {
    if (!this.document.username) {
        throw "Username is not set.";
    }
    if (!this.document.password) {
        throw "Password is not set.";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //now call the logout API.

    var xmlhttp = CB._loadXml();
    var params=JSON.stringify({
        document: CB._serialize(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/logout" ;

    xmlhttp.open('POST',url,true);
    xmlhttp.setRequestHeader('Content-type','application/json');
    xmlhttp.send(params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                CB.CloudUser.current = null;;
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
CB.CloudUser.prototype.addToRole = function(role, callback) {
    if (!role) {
        throw "Role is null";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //Call the addToRole API

    var xmlhttp = CB._loadXml();
    var params=JSON.stringify({
        user: CB._serialize(thisObj),
        role: CB._serialize(role),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/addToRole" ;

    xmlhttp.open('PUT',url,true);
    xmlhttp.setRequestHeader('Content-type','application/json');
    xmlhttp.send(params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                CB._deserialize(JSON.parse(xmlhttp.responseText), thisObj);
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
CB.CloudUser.prototype.isInRole = function(role) {
    if (!role) {
        throw "role is null";
    }
    return (this.get('roles').indexOf(role.document._id) >= 0);
};
CB.CloudUser.prototype.removeFromRole = function(role, callback) {
    if (!role) {
        throw "Role is null";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //now call the removeFromRole API.

    var xmlhttp = CB._loadXml();
    var params=JSON.stringify({
        user: CB._serialize(thisObj),
        role: CB._serialize(role),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/removeFromRole" ;

    xmlhttp.open('PUT',url,true);
    xmlhttp.setRequestHeader('Content-type','application/json');
    xmlhttp.send(params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                CB._deserialize(JSON.parse(xmlhttp.responseText), thisObj);
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