/* PRIVATE METHODS */
CB._serialize = function(thisObj) {

    var url=null;
    if(thisObj instanceof  CB.CloudFile)
        url=thisObj.document.url;

    var obj= CB._clone(thisObj,url);

    if (!obj instanceof CB.CloudObject || !obj instanceof CB.CloudFile || !obj instanceof CB.CloudGeoPoint) {
        throw "Data passed is not an instance of CloudObject or CloudFile or CloudGeoPoint";
    }

    if(obj instanceof CB.CloudFile)
        return obj.document;

    if(obj instanceof CB.CloudGeoPoint)
        return obj.document;

    var doc = obj.document;

    for (var key in doc) {
        if (doc[key] instanceof CB.CloudObject || doc[key] instanceof CB.CloudFile || doc[key] instanceof CB.CloudGeoPoint) {
            //if something is a relation.
            doc[key] = CB._serialize(doc[key]); //serialize this object.
        } else if (key === 'ACL') {
            //if this is an ACL, then. Convert this from CB.ACL object to JSON - to strip all the ACL Methods.
            var acl = {
                write: doc[key].write,
                read: doc[key].read
            };
            doc[key] = acl;
        } else if (doc[key] instanceof Array) {
            //if this is an array.
            //then check if this is an array of CloudObjects, if yes, then serialize every CloudObject.
            if (doc[key][0] && (doc[key][0] instanceof CB.CloudObject || doc[key][0] instanceof CB.CloudFile || doc[key][0] instanceof CB.CloudGeoPoint )) {
                var arr = [];
                for (var i = 0; i < doc[key].length; i++) {
                    arr.push(CB._serialize(doc[key][i]));
                }
                doc[key] = arr;
            }
        }
    }

    return doc;
};

CB._deserialize = function(data, thisObj) {

    //prevObj : is a copy of object before update.

    //this is to deserialize JSON to a document which can be shoved into CloudObject. :)
    //if data is a list it will return a list of CloudObjects.

    if (!data)
        return null;

    if (data instanceof Array) {

        if (data[0] && data[0] instanceof Object) {

            var arr = [];

            for (var i = 0; i < data.length; i++) {
                obj = CB._deserialize(data[i]);
                arr.push(obj);
            }

            return arr;

        } else {
            //this is just a normal array, not an array of CloudObjects.
            return data;
        }
    } else if (data instanceof Object && data._type) {

        //if this is a CloudObject.
        var document = {};
        //different types of classes.

        for (var key in data) {
            if(data[key] instanceof Array) {
                document[key]=CB._deserialize(data[key]);
            }else if (data[key] instanceof Object) {
                if (key === 'ACL') {
                    //this is an ACL.
                    document[key] = new CB.ACL();
                    document[key].write = data[key].write;
                    document[key].read = data[key].read;

                } else if(data[key]._type) {
                    if(thisObj)
                        document[key] = CB._deserialize(data[key], thisObj.get(key));
                    else
                        document[key] = CB._deserialize(data[key]);
                }else if (data[key].latitude || data[key].longitude) {

                    document[key] = new CB.CloudGeoPoint(data[key].latitude, data[key].longitude);

                }else{

                    document[key] = data[key];

                }
            }else {

                document[key] = data[key];

            }
        }

        if(!thisObj){
            var url=null;
            if(document._type === "file")
                url=document.url;
            var obj = CB._getObjectByType(document._type,url);
            obj.document = document;
            return obj;
        }else{
            thisObj.document = document;
            return thisObj;
        }

    }else {
        //if this is plain json.
        return data;
    }
};

CB._getObjectByType = function(type,url){

    var obj = null;

    if (type === 'custom') {
        obj = new CB.CloudObject();
    }

    if (type === 'role') {
        obj = new CB.CloudRole();
    }

    if (type === 'user') {
        obj = new CB.CloudUser();
    }

    if (type === 'file') {
        obj = new CB.CloudFile(url);
    }

    return obj;
}


CB._validate = function() {
    if (!CB.appId) {
        throw "AppID is null. Please use CB.CLoudApp.init to initialize your app.";
    }

    if(!CB.appKey){
        throw "AppKey is null. Please use CB.CLoudApp.init to initialize your app.";
    }
};


//to check if its running under node, If yes - then export CB.
(function () {
    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this;
    // Create a reference to this
    var _ = new Object();
})();

function _all(arrayOfPromises) {
    //this is simplilar to Q.all for jQuery promises.
    return jQuery.when.apply(jQuery, arrayOfPromises).then(function() {
        return Array.prototype.slice.call(arguments, 0);
    });
};

if(CB._isNode){
    module.exports = {};
    module.exports = CB;
}


CB._clone=function(obj,url){
    var n_obj = null;
    if(obj.document._type) {
        n_obj = CB._getObjectByType(obj.document._type,url);
        var doc=obj.document;
        var doc2={};
        for (var key in doc) {
            if(doc[key] instanceof CB.CloudObject)
                doc2[key]=CB._clone(doc[key],null);
            else if(doc[key] instanceof CB.CloudFile){
                doc2[key]=CB._clone(doc[key],doc[key].document.url);
            }else if(doc[key] instanceof CB.CloudGeoPoint){
                doc2[key]=CB._clone(doc[key], null);
            }
            else
                doc2[key]=doc[key];
        }
    }else if(obj instanceof CB.CloudGeoPoint){
        n_obj = obj;
        var doc=obj.document;
        var doc2={};
        for (var key in doc) {
            doc2[key]=doc[key];
        }
    }
    n_obj.document=doc2;
    return n_obj;
};

CB._request=function(method,url,params)
{
    var def = new CB.Promise();
    var xmlhttp= CB._loadXml();
    if (CB._isNode) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
    }
    xmlhttp.open(method,url,true);
    xmlhttp.setRequestHeader('Content-Type','text/plain');
    var ssid = localStorage.getItem('sessionID');
    if(ssid != null)
        xmlhttp.setRequestHeader('sessionID', ssid);
    if(CB._isNode)
        xmlhttp.setRequestHeader("User-Agent",
            "CB/" + CB.version +
            " (NodeJS " + process.versions.node + ")");
    xmlhttp.send(params);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                var sessionID = xmlhttp.getResponseHeader('sessionID');
                if(sessionID)
                    localStorage.setItem('sessionID', sessionID);
                else
                    localStorage.removeItem('sessionID');
                def.resolve(xmlhttp.responseText);
            } else {
                console.log(xmlhttp.status);
                def.reject(xmlhttp.responseText);
            }
        }
    }
    return def;
};
