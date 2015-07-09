/*

 This is the version 1.0.0 of the CloudBoost JS/Node SDK
 This SDK is dependent on jQuery.

 */

var CB = CB || {}; //namespace.

CB.version = "1.0.0";
CB._isNode = false;
CB.Socket = null;

CB.serverUrl = 'https://api.cloudboost.io'; // server url.
CB.socketIoUrl = 'http://realtime.cloudboost.io';

CB.io = null; //socket.io library is saved here.


CB.apiUrl = CB.serverUrl+'/api';

CB.appId = CB.appId || null;
CB.appKey = CB.appKey || null;

if (typeof(process) !== "undefined" &&
    process.versions &&
    process.versions.node) {
    CB._isNode = true;
}
else
{
    CB._isNode = false;
}

/*
 Parse codes:
 */
CB._ajaxIE8 = function(method, url, data) {
    var promise = new CB.Promise();
    var xdr = new XDomainRequest();
    xdr.onload = function() {
        var response;
        try {
            response = JSON.parse(xdr.responseText);
        } catch (e) {
            promise.reject(e);
        }
        if (response) {
            promise.resolve(response);
        }
    };
    xdr.onerror = xdr.ontimeout = function() {
        // Let's fake a real error message.
        var fakeResponse = {
            responseText: JSON.stringify({
                code: 500,
                error: "IE's XDomainRequest does not supply error info."
            })
        };
        promise.reject(fakeResponse);
    };
    xdr.onprogress = function() {};
    xdr.open(method, url);
    xdr.send(data);
    return promise;
};
CB._loadXml = function()
{
    var xmlhttp;
    var req = typeof(require) === 'function' ? require : null;
    // Load references to other dependencies
    if (typeof(XMLHttpRequest) !== 'undefined') {
        xmlhttp = XMLHttpRequest;
    } else if (typeof(require) === 'function' &&
        typeof(require.ensure) === 'undefined') {
        xmlhttp = req('xmlhttprequest').XMLHttpRequest;
    }
    xmlhttp = new xmlhttp();
    return xmlhttp;
    /*if(window.XMLHttpRequest){
     xmlhttp=new XMLHttpRequest();
     }
     else {
     xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
     }
     return xmlhttp;*/
};
CB.Promise = function() {
    this._resolved = false;
    this._rejected = false;
    this._resolvedCallbacks = [];
    this._rejectedCallbacks = [];

    this._isPromisesAPlusCompliant = false;
    this.is = function(promise) {
        return promise && promise.then && Object.prototype.toString.call(promise.then) === "[object Function]";
    };
    this.as = function() {
        var promise = new CB.Promise();
        promise.resolve.apply(promise, arguments);
        return promise;
    };
    this.error = function() {
        var promise = new CB.Promise();
        promise.reject.apply(promise, arguments);
        return promise;
    };
    this.when = function(promises) {
        // Allow passing in Promises as separate arguments instead of an Array.
        var objects;
        if (promises && (typeof promises.length === "undefined" || promises.length === null)) {
            objects = arguments;
        } else {
            objects = promises;
        }

        var total = objects.length;
        var hadError = false;
        var results = [];
        var errors = [];
        results.length = objects.length;
        errors.length = objects.length;

        if (total === 0) {
            return CB.Promise.as.apply(this, results);
        }

        var promise = new CB.Promise();

        var resolveOne = function() {
            total = total - 1;
            if (total === 0) {
                if (hadError) {
                    promise.reject(errors);
                } else {
                    promise.resolve.apply(promise, results);
                }
            }
        };

        objects.forEach(function(object, i) {
            if (CB.Promise.is(object)) {
                object.then(function(result) {
                    results[i] = result;
                    resolveOne();
                }, function(error) {
                    errors[i] = error;
                    hadError = true;
                    resolveOne();
                });
            } else {
                results[i] = object;
                resolveOne();
            }
        });

        return promise;
    };
    this._continueWhile = function(predicate, asyncFunction) {
        if (predicate()) {
            return asyncFunction().then(function() {
                return CB.Promise._continueWhile(predicate, asyncFunction);
            });
        }
        return CB.Promise.as();
    }
};

CB.Promise.is = function(promise) {
    return promise && promise.then && Object.prototype.toString.call(promise.then) === "[object Function]";
};
/**
 * Marks this promise as fulfilled, firing any callbacks waiting on it.
 * @param {Object} result the result to pass to the callbacks.
 */
CB.Promise.prototype["resolve"] = function(result) {
    if (this._resolved || this._rejected) {
        throw "A promise was resolved even though it had already been " +
        (this._resolved ? "resolved" : "rejected") + ".";
    }
    this._resolved = true;
    this._result = arguments;
    var results = arguments;
    this._resolvedCallbacks.forEach(function(resolvedCallback) {
        resolvedCallback.apply(this, results);
    });
    this._resolvedCallbacks = [];
    this._rejectedCallbacks = [];
};

/**
 * Marks this promise as fulfilled, firing any callbacks waiting on it.
 * @param {Object} error the error to pass to the callbacks.
 */
CB.Promise.prototype["reject"] = function(error) {
    if (this._resolved || this._rejected) {
        throw "A promise was rejected even though it had already been " +
        (this._resolved ? "resolved" : "rejected") + ".";
    }
    this._rejected = true;
    this._error = error;
    this._rejectedCallbacks.forEach(function(rejectedCallback) {
        rejectedCallback(error);
    });
    this._resolvedCallbacks = [];
    this._rejectedCallbacks = [];
};

/**
 * Adds callbacks to be called when this promise is fulfilled. Returns a new
 * Promise that will be fulfilled when the callback is complete. It allows
 * chaining. If the callback itself returns a Promise, then the one returned
 * by "then" will not be fulfilled until that one returned by the callback
 * is fulfilled.
 * @param {Function} resolvedCallback Function that is called when this
 * Promise is resolved. Once the callback is complete, then the Promise
 * returned by "then" will also be fulfilled.
 * @param {Function} rejectedCallback Function that is called when this
 * Promise is rejected with an error. Once the callback is complete, then
 * the promise returned by "then" with be resolved successfully. If
 * rejectedCallback is null, or it returns a rejected Promise, then the
 * Promise returned by "then" will be rejected with that error.
 * @return {CB.Promise} A new Promise that will be fulfilled after this
 * Promise is fulfilled and either callback has completed. If the callback
 * returned a Promise, then this Promise will not be fulfilled until that
 * one is.
 */
CB.Promise.prototype["then"] = function(resolvedCallback, rejectedCallback) {
    var promise = new CB.Promise();

    var wrappedResolvedCallback = function() {
        var result = arguments;
        if (resolvedCallback) {
            if (CB.Promise._isPromisesAPlusCompliant) {
                try {
                    result = [resolvedCallback.apply(this, result)];
                } catch (e) {
                    result = [CB.Promise.error(e)];
                }
            } else {
                result = [resolvedCallback.apply(this, result)];
            }
        }
        if (result.length === 1 && CB.Promise.is(result[0])) {
            result[0].then(function() {
                promise.resolve.apply(promise, arguments);
            }, function(error) {
                promise.reject(error);
            });
        } else {
            promise.resolve.apply(promise, result);
        }
    };

    var wrappedRejectedCallback = function(error) {
        var result = [];
        if (rejectedCallback) {
            if (CB.Promise._isPromisesAPlusCompliant) {
                try {
                    result = [rejectedCallback(error)];
                } catch (e) {
                    result = [CB.Promise.error(e)];
                }
            } else {
                result = [rejectedCallback(error)];
            }
            if (result.length === 1 && CB.Promise.is(result[0])) {
                result[0].then(function() {
                    promise.resolve.apply(promise, arguments);
                }, function(error) {
                    promise.reject(error);
                });
            } else {
                if (CB.Promise._isPromisesAPlusCompliant) {
                    promise.resolve.apply(promise, result);
                } else {
                    promise.reject(result[0]);
                }
            }
        } else {
            promise.reject(error);
        }
    };

    var runLater = function(func) {
        func.call();
    };
    if (CB.Promise._isPromisesAPlusCompliant) {
        if (typeof(window) !== 'undefined' && window.setTimeout) {
            runLater = function(func) {
                window.setTimeout(func, 0);
            };
        } else if (typeof(process) !== 'undefined' && process.nextTick) {
            runLater = function(func) {
                process.nextTick(func);
            };
        }
    }

    var self = this;
    if (this._resolved) {
        runLater(function() {
            wrappedResolvedCallback.apply(self, self._result);
        });
    } else if (this._rejected) {
        runLater(function() {
            wrappedRejectedCallback(self._error);
        });
    } else {
        this._resolvedCallbacks.push(wrappedResolvedCallback);
        this._rejectedCallbacks.push(wrappedRejectedCallback);
    }

    return promise;
};

/**
 * Add handlers to be called when the promise
 * is either resolved or rejected
 */
CB.Promise.prototype["always"] = function(callback) {
    return this.then(callback, callback);
};

/**
 * Add handlers to be called when the Promise object is resolved
 */
CB.Promise.prototype["done"] = function(callback) {
    return this.then(callback);
};

/**
 * Add handlers to be called when the Promise object is rejected
 */
CB.Promise.prototype["fail"] = function(callback) {
    return this.then(null, callback);
};

/**
 * Run the given callbacks after this promise is fulfilled.
 * @param optionsOrCallback {} A Backbone-style options callback, or a
 * callback function. If this is an options object and contains a "model"
 * attributes, that will be passed to error callbacks as the first argument.
 * @param model {} If truthy, this will be passed as the first result of
 * error callbacks. This is for Backbone-compatability.
 * @return {CB.Promise} A promise that will be resolved after the
 * callbacks are run, with the same result as this.
 */
CB.clone = function(obj) {
    if (! Object.prototype.toString.call(obj) === "[object Object]") return obj;
    return (Object.prototype.toString.call(obj) === "[object Array]") ? obj.slice() : new Object(obj);
};

CB.Promise.prototype["_thenRunCallbacks"] = function(optionsOrCallback, model) {
    var options;
    if (Object.prototype.toString.call(optionsOrCallback) === "[object Function]") {
        var callback = optionsOrCallback;
        options = {
            success: function(result) {
                callback(result, null);
            },
            error: function(error) {
                callback(null, error);
            }
        };
    } else {
        options = CB.clone(optionsOrCallback);
    }
    options = options || {};

    return this.then(function(result) {
        if (options.success) {
            options.success.apply(this, arguments);
        } else if (model) {
            // When there's no callback, a sync event should be triggered.
            model.trigger('sync', model, result, options);
        }
        return CB.Promise.as.apply(CB.Promise, arguments);
    }, function(error) {
        if (options.error) {
            if (! typeof model === "undefined") {
                options.error(model, error);
            } else {
                options.error(error);
            }
        } else if (model) {
            // When there's no error callback, an error event should be triggered.
            model.trigger('error', model, error, options);
        }
        // By explicitly returning a rejected Promise, this will work with
        // either jQuery or Promises/A semantics.
        return CB.Promise.error(error);
    });
}
CB.Events = {
    trigger: function(events) {
        var event, node, calls, tail, args, all, rest;
        if (!(calls = this._callbacks)) {
            return this;
        }
        all = calls.all;
        events = events.split(eventSplitter);
        rest = slice.call(arguments, 1);

        // For each event, walk through the linked list of callbacks twice,
        // first to trigger the event, then to trigger any `"all"` callbacks.
        event = events.shift();
        while (event) {
            node = calls[event];
            if (node) {
                tail = node.tail;
                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, rest);
                }
            }
            node = all;
            if (node) {
                tail = node.tail;
                args = [event].concat(rest);
                while ((node = node.next) !== tail) {
                    node.callback.apply(node.context || this, args);
                }
            }
            event = events.shift();
        }

        return this;
    }
}
/**
 * Adds a callback function that should be called regardless of whether
 * this promise failed or succeeded. The callback will be given either the
 * array of results for its first argument, or the error as its second,
 * depending on whether this Promise was rejected or resolved. Returns a
 * new Promise, like "then" would.
 * @param {Function} continuation the callback.
 */
CB.Promise.prototype["_continueWith"] = function(continuation) {
    return this.then(function() {
        return continuation(arguments, null);
    }, function(error) {
        return continuation(null, error);
    });
};
console.log("promises loaded");
console.log(CB);

console.log('in acl');

CB.ACL = function() { //constructor for ACL class
    this['read'] = {"allow":{"user":['all'],"role":[]},"deny":{"user":[],"role":[]}}; //by default allow read access to "all"
    this['write'] = {"allow":{"user":['all'],"role":[]},"deny":{"user":[],"role":[]}}; //by default allow write access to "all"
};
CB.ACL.prototype.setPublicWriteAccess = function(value) { //for setting the public write access
    if (value) { //If asked to allow public write access
        this['write']['allow']['user'] = ['all'];
    } else {
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1); //remove the "all" value from the "write" array of "this" object
        }
    }
};
CB.ACL.prototype.setPublicReadAccess = function(value) { //for setting the public read access

    if (value) { //If asked to allow public read access
        this['read']['allow']['user'] = ['all'];
    } else {
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1); //remove the "all" value from the "read" array of "this" object
        }
    }
};
CB.ACL.prototype.setUserWriteAccess = function(userId, value) { //for setting the user write access

    if (value) { //If asked to allow user write access
        //remove public write access.
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1);
        }
        if (this['write']['allow']['user'].indexOf(userId) === -1) {
            this['write']['allow']['user'].push(userId);
        }
    } else {
        var index = this['write']['allow']['user'].indexOf(userId);
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1); //remove the "userId" value from the "write" array of "this" object
        }
        this['write']['deny']['user'].push(userId);
    }
};
CB.ACL.prototype.setUserReadAccess = function(userId, value) { //for setting the user read access

    if (value) { //If asked to allow user read access
        //remove public write access.
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1);
        }
        if (this['read']['allow']['user'].indexOf(userId) === -1) {
            this['read']['allow']['user'].push(userId);
        }
    } else {
        var index = this['read']['allow']['user'].indexOf(userId);
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1); //remove the "userId" value from the "read" array of "this" object
        }
        this['read']['deny']['user'].push(userId);
    }
};
CB.ACL.prototype.setRoleWriteAccess = function(roleId, value) {

    if (value) {
        //remove public write access.
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1);
        }
        if (this['write']['allow']['role'].indexOf(roleId) === -1) {
            this['write']['allow']['role'].push(roleId);
        }
    } else {
        var index = this['write']['allow']['role'].indexOf(roleId);
        if (index > -1) {
            this['write']['allow']['role'].splice(index, 1);
        }
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1);
        }

        this['write']['deny']['role'].push(roleId);
    }
};
CB.ACL.prototype.setRoleReadAccess = function(roleId, value) {

    if (value) {
        //remove public write access.
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1);
        }
        if (this['read']['allow']['role'].indexOf(roleId) === -1) {
            this['read']['allow']['role'].push(roleId);
        }
    } else {
        var index = this['read']['allow']['role'].indexOf(roleId);
        if (index > -1) {
            this['read']['allow']['role'].splice(index, 1);
        }
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1);
        }
        this['read']['deny']['role'].push(roleId);
    }
};

/* CloudNotificiation */

CB.CloudNotification = CB.CloudNotification || {};

CB.CloudNotification.on = function(channelName, callback, done) {

    CB._validate();

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    CB.Socket.emit('join-custom-channel',CB.appId+channelName);
    CB.Socket.on(CB.appId+channelName, function(data){ //listen to events in custom channel.
        callback(data);
    });

    if(done && done.success)
        done.success();
    else
        def.resolve();

    if (!done) {
        return def;
    }

};

CB.CloudNotification.off = function(channelName, done) {

    CB._validate();

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    CB.Socket.emit('leave-custom-channel',CB.appId+channelName);
    CB.Socket.removeAllListeners(CB.appId+channelName);
    if(done && done.success)
        done.success();
    else
        def.resolve();

    if (!done) {
        return def;
    }

};

CB.CloudNotification.publish = function(channelName, data, done) {

    CB._validate();

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    CB.Socket.emit('publish-custom-channel',{channel:CB.appId+channelName,data : data});
    if(done && done.success)
        done.success();
    else
        def.resolve();

    if (!done) {
        return def;
    }

};

/*
 CloudObject
 */

CB.CloudObject = function(tableName) { //object for documents
    this.document = {};
    this.document._tableName = tableName; //the document object
    this.document.ACL = new CB.ACL(); //ACL(s) of the document
    this.document._type = 'custom';
    this.document._isModified = true;
    this.document._modifiedColumns = ['createdAt','updatedAt','ACL'];
};

Object.defineProperty(CB.CloudObject.prototype, 'ACL', {
    get: function() {
        return this.document.ACL;
    },
    set: function(ACL) {
        this.document.ACL = ACL;
        CB._modified(this,'ACL');
    }
});

Object.defineProperty(CB.CloudObject.prototype, 'id', {
    get: function() {
        return this.document._id;
    },
    set: function(id) {
        this.document._id = id;
        CB._modified(this,'_id');
    }
});

Object.defineProperty(CB.CloudObject.prototype, 'createdAt', {
    get: function() {
        return this.document.createdAt;
    },
    set: function(createdAt) {
        this.document.createdAt = createdAt;
        CB._modified(this,'createdAt');
    }
});

Object.defineProperty(CB.CloudObject.prototype, 'updatedAt', {
    get: function() {
        return this.document.updatedAt;
    },
    set: function(updatedAt) {
        this.document.updatedAt = updatedAt;
        CB._modified(this,'updatedAt');
    }
});

Object.defineProperty(CB.CloudObject.prototype, 'isSearchable', {
    get: function() {
        return this.document._isSearchable;
    },
    set: function(isSearchable) {
        this.document._isSearchable = isSearchable;
        CB._modified(this,'_isSearchable');
    }
});

/* For Expire of objects */

Object.defineProperty(CB.CloudObject.prototype, 'expires', {
    get: function() {
        return this.document._expires;
    },
    set: function(expires) {
        this.document._expires = expires;
        CB._modified(this,'_expires');
    }
});

/* This is Real time implementation of CloudObjects */

CB.CloudObject.on = function(tableName, eventType, callback, done) {

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    tableName = tableName.toLowerCase();

    if (eventType instanceof Array) {
        //if event type is an array.
        for(var i=0;i<eventType.length;i++){
            CB.CloudObject.on(tableName, eventType[i], callback);
            if(done && done.success)
                done.success();
            else
                def.resolve();
        }
    } else {
        eventType = eventType.toLowerCase();
        if(eventType==='created' || eventType === 'updated' || eventType === 'deleted'){
            CB.Socket.emit('join-object-channel',(CB.appId+'table'+tableName+eventType).toLowerCase());
            CB.Socket.on((CB.appId+'table'+tableName+eventType).toLowerCase(), function(data){ //listen to events in custom channel.
                callback(CB._deserialize(data));
            });

            if(done && done.success)
                done.success();
            else
                def.resolve();
        }else{
            throw 'created, updated, deleted are supported notification types.';
        }
    }

    if (!done) {
        return def;
    }
};

CB.CloudObject.off = function(tableName, eventType, done) {

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    tableName = tableName.toLowerCase();

    if (eventType instanceof Array) {
        //if event type is an array.
        for(var i=0;i<eventType.length;i++){
            CB.CloudObject.off(tableName, eventType[i]);
            if(done && done.success)
                done.success();
            else
                def.resolve();
        }
    } else {

        eventType = eventType.toLowerCase();

        if(eventType==='created' || eventType === 'updated' || eventType === 'deleted'){
            CB.Socket.emit('leave-object-channel',(CB.appId+'table'+tableName+eventType).toLowerCase());
            CB.Socket.removeAllListeners((CB.appId+'table'+tableName+eventType).toLowerCase());
            if(done && done.success)
                done.success();
            else
                def.resolve();
        }else{
            throw 'created, updated, deleted are supported notification types.';
        }
    }

    if (!done) {
        return def;
    }
};

/* RealTime implementation ends here.  */

CB.CloudObject.prototype.set = function(columnName, data) { //for setting data for a particular column

    var keywords = ['_tableName', '_type', 'operator'];

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    if (keywords.indexOf(columnName) > -1) {
        throw columnName + " is a keyword. Please choose a different column name.";
    }
    this.document[columnName] = data;
    CB._modified(this,columnName);
};


CB.CloudObject.prototype.get = function(columnName) { //for getting data of a particular column

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    CB._modified(this,columnName);
    return this.document[columnName];

};

CB.CloudObject.prototype.unset = function(columnName) { //to unset the data of the column
    this.document[columnName] = null;
};

CB.CloudObject.prototype.save = function(callback) { //save the document to the db
    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    CB._validate();

    var thisObj = this;
    var xmlhttp = CB._loadXml();
    var params=JSON.stringify({
        document: CB._serialize(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/save";
    //console.log(params);
    CB._request('POST',url,params).then(function(response){
        CB._deserialize(JSON.parse(response),thisObj);
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

CB.CloudObject.prototype.fetch = function(callback) { //fetch the document from the db
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (this.id) {
        this.document['_id'] = this.id;
    } else {
        throw "Can't fetch an object which is not saved."
    }
    if (this.ACL) {
        this.document['ACL'] = this.ACL;
    }
    thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    // var xmlhttp=CB._loadXml();
    var params=JSON.stringify({
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + thisObj.document._tableName + "/get/" + thisObj.document['_id'];

    CB._request('POST',url,params).then(function(response){
        CB._deserialize(JSON.parse(response),thisObj);
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

CB.CloudObject.prototype.delete = function(callback) { //delete an object matching the objectId
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.document._id) {
        throw "You cannot delete an object which is not saved."
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    var params=JSON.stringify({
        key: CB.appKey,
        document: CB._serialize(thisObj)
    });
    url = CB.apiUrl + "/" + CB.appId +"/delete/";

    CB._request('POST',url,params).then(function(response){
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
/*
 CloudQuery
 */
CB.CloudQuery = function(tableName) { //constructor for the class CloudQuery
    this.tableName = tableName;
    this.query = {};
    this.query.$include = [];
    this.select = {};
    this.sort = {};
    this.skip = 0;
    this.limit = -1; //limit to 20 documents by default.
};
// Logical operations
CB.CloudQuery.or = function(obj1, obj2) {
    if (!obj1.tableName === obj2.tableName) {
        throw "Table names are not same";
    }
    var obj = new CB.CloudQuery(obj1.tableName);
    obj.query["$or"] = [obj1.query, obj2.query];
    return obj;
}


CB.CloudQuery.prototype.equalTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    this.query[columnName] = data;

    return this;
};

CB.CloudQuery.prototype.include = function (columnName, data) {
    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    this.query.$include.push(columnName);

    return this;
};

CB.CloudQuery.prototype.notEqualTo = function(columnName, data) {
    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    this.query[columnName] = {
        $ne: data
    };

    return this;
};
CB.CloudQuery.prototype.greaterThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$gt"] = data;

    return this;
};
CB.CloudQuery.prototype.greaterThanEqualTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$gte"] = data;

    return this;
};
CB.CloudQuery.prototype.lessThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;


    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$lt"] = data;

    return this;
};
CB.CloudQuery.prototype.lessThanEqualTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;


    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$lte"] = data;

    return this;
};
//Sorting
CB.CloudQuery.prototype.orderByAsc = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    this.sort[columnName] = 1;

    return this;
};
CB.CloudQuery.prototype.orderByDesc = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    this.sort[columnName] = -1;

    return this;
};
//Limit and skip
CB.CloudQuery.prototype.setLimit = function(data) {

    this.limit = data;
    return this;
};
CB.CloudQuery.prototype.setSkip = function(data) {
    this.skip = data;
    return this;
};

//select/deselect columns to show
CB.CloudQuery.prototype.selectColumn = function(columnNames) {
    if (Object.prototype.toString.call(columnNames) === '[object Object]') {
        this.select = columnNames;
    } else if (Object.prototype.toString.call(columnNames) === '[object Array]') {
        for (var i = 0; i < columnNames.length; i++) {
            this.select[columnNames[i]] = 1;
        }
    } else {
        this.select[columnNames] = 1;
    }

    return this;
};
CB.CloudQuery.prototype.doNotSelectColumn = function(columnNames) {
    if (Object.prototype.toString.call(columnNames) === '[object Object]') {
        this.select = columnNames;
    } else if (Object.prototype.toString.call(columnNames) === '[object Array]') {
        for (var i = 0; i < columnNames.length; i++) {
            this.select[columnNames[i]] = 0;
        }
    } else {
        this.select[columnNames] = 0;
    }

    return this;
};
CB.CloudQuery.prototype.containedIn = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    if (Object.prototype.toString.call(data) === '[object Object]') { //if object is passed as an argument
        throw 'Array or string expected as an argument';
    }
    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }

    if (Object.prototype.toString.call(data) === '[object Array]') { //if array is passed, then replace the whole
        this.query[columnName]["$in"] = data;
        thisObj = this;
        if (typeof this.query[columnName]["$nin"] !== 'undefined') { //for removing dublicates
            data.forEach(function(val) {
                if ((index = thisObj.query[columnName]["$nin"].indexOf(val)) >= 0) {
                    thisObj.query[columnName]["$nin"].splice(index, 1);
                }
            });
        }
    } else { //if the argument is a string then push if it is not present already
        if (!this.query[columnName]["$in"]) {
            this.query[columnName]["$in"] = [];
        }
        if (this.query[columnName]["$in"].indexOf(data) === -1) {
            this.query[columnName]["$in"].push(data);
        }
        if (typeof this.query[columnName]["$nin"] !== 'undefined') {
            if ((index = this.query[columnName]["$nin"].indexOf(data)) >= 0) {
                this.query[columnName]["$nin"].splice(index, 1);
            }
        }
    }

    return this;
}

CB.CloudQuery.prototype.notContainedIn = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    if (Object.prototype.toString.call(data) === '[object Object]') { //if object is passed as an argument
        throw 'Array or string expected as an argument';
    }
    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }

    if (Object.prototype.toString.call(data) === '[object Array]') { //if array is passed, then replace the whole
        this.query[columnName]["$nin"] = data;
        if (typeof this.query[columnName]["$in"] !== 'undefined') { //for removing dublicates
            thisObj = this;
            data.forEach(function(val) {
                if ((index = thisObj.query[columnName]["$in"].indexOf(val)) >= 0) {
                    thisObj.query[columnName]["$in"].splice(index, 1);
                }
            });
        }
    } else { //if the argument is a string then push if it is not present already
        if (!this.query[columnName]["$nin"]) {
            this.query[columnName]["$nin"] = [];
        }
        if (this.query[columnName]["$nin"].indexOf(data) === -1) {
            this.query[columnName]["$nin"].push(data);
        }
        if (typeof this.query[columnName]["$in"] !== 'undefined') {
            if ((index = this.query[columnName]["$in"].indexOf(data)) >= 0) {
                this.query[columnName]["$in"].splice(index, 1);
            }
        }
    }

    return this;
}

CB.CloudQuery.prototype.exists = function(columnName) {
    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$exists"] = true;

    return this;
}

CB.CloudQuery.prototype.doesNotExists = function(columnName) {
    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$exists"] = false;

    return this;
}

CB.CloudQuery.prototype.containsAll = function(columnName, values) {
    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {
            "$all": values
        }
    } else {
        this.query[columnName]["$all"] = values;
    }

    return this;
}

CB.CloudQuery.prototype.startsWith = function(columnName, value) {
    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    var regex = '^' + value;
    if (!this.query[columnName]) {
        this.query[columnName] = {
            $regex: regex,
            $options: "im"
        }
    } else {
        this.query[columnName]["$regex"] = regex;
        this.query[columnName]["$options"] = 'im';
    }

    return this;
}

//GeoPoint near query
CB.CloudQuery.prototype.near = function(columnName, coordinates, maxDistance, minDistance){
    if(!this.query[columnName]){
        this.query[columnName] = {};
        this.query[columnName]['$near'] = {
            '$geometry': coordinates['document'],
            '$maxDistance': maxDistance,
            '$minDistance': minDistance
        };
    }
};

//GeoPoint geoWithin query
CB.CloudQuery.prototype.geoWithin = function(columnName, geoPoint, radius){

    if(!radius){
        var coordinates = [];
        //extracting coordinates from each CloudGeoPoint Object
        if (Object.prototype.toString.call(geoPoint) === '[object Array]') {
            for(i=0; i < geoPoint.length; i++){
                if (geoPoint[i]['document'].hasOwnProperty('coordinates')) {
                    coordinates[i] = geoPoint[i]['document']['coordinates'];
                }
            }
        }else{
            throw 'Invalid Parameter, coordinates should be an array of CloudGeoPoint Object';
        }
        //2dSphere needs first and last coordinates to be same for polygon type
        //eg. for Triangle four coordinates need to pass, three points of triangle and fourth one should be same as first one
        coordinates[coordinates.length] = coordinates[0];
        var type = 'Polygon';
        if(!this.query[columnName]){
            this.query[columnName] = {};
            this.query[columnName]['$geoWithin'] = {};
            this.query[columnName]['$geoWithin']['$geometry'] = {
                'type': type,
                'coordinates': [ coordinates ]
            };
        }
    }else{
        if(!this.query[columnName]){
            this.query[columnName] = {};
            this.query[columnName]['$geoWithin'] = {
                '$centerSphere': [ geoPoint['document']['coordinates'], radius/3963.2 ]
            };
        }
    }
};

CB.CloudQuery.prototype.count = function(callback) {
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;
    var params=JSON.stringify({
        query: thisObj.query,
        limit: thisObj.limit,
        skip: thisObj.skip,
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + thisObj.tableName + '/count';

    CB._request('POST',url,params).then(function(response){
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


};

CB.CloudQuery.prototype.distinct = function(keys, callback) {
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    if (Object.prototype.toString.call(keys) !== '[object Array]' && keys.length <= 0) {
        throw "keys should be array";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;
    var params=JSON.stringify({
        onKey: keys,
        query: thisObj.query,
        sort: this.sort,
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + thisObj.tableName + '/distinct';

    CB._request('POST',url,params).then(function(response){
        var object = CB._deserialize(JSON.parse(response));
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
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

CB.CloudQuery.prototype.find = function(callback) { //find the document(s) matching the given query
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    var thisObj = this;

    var xmlhttp=CB._loadXml();
    var params=JSON.stringify({
        query: thisObj.query,
        select: thisObj.select,
        sort: thisObj.sort,
        limit: thisObj.limit,
        skip: thisObj.skip,
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + thisObj.tableName + '/find';

    CB._request('POST',url,params).then(function(response){
        var object = CB._deserialize(JSON.parse(response));
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
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
CB.CloudQuery.prototype.get = function(objectId,callback){
    var query = new CB.CloudQuery(this.tableName);
    return query.findById(objectId,callback);
};
CB.CloudQuery.prototype.findById = function(objectId, callback) { //find the document(s) matching the given query
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    var params=JSON.stringify({
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + this.tableName + "/get/" + objectId;

    CB._request('POST',url,params).then(function(response){
        if (Object.prototype.toString.call(response) === '[object Array]') {
            response = response[0];
        }
        if (callback) {
            callback.success(CB._deserialize(JSON.parse(response)));
        } else {
            def.resolve(CB._deserialize(JSON.parse(response)));
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
CB.CloudQuery.prototype.findOne = function(callback) { //find a single document matching the given query
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    var params=JSON.stringify({
        query: this.query,
        select: this.select,
        sort: this.sort,
        skip: this.skip,
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + this.tableName + '/findOne';

    CB._request('POST',url,params).then(function(response){
        var object = CB._deserialize(JSON.parse(response));
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
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

CB.CloudSearch = function(collectionNames) {
    this.collectionNames = collectionNames;
    this.query={};
    this.from = 0; //this is skip in usual terms.
    this.size = 10; //this is take in usual terms.
    this.sort = [];
};

CB.CloudSearch.prototype.setSkip = function(data) {
    this.from = data;

    return this;
};

CB.CloudSearch.prototype.setLimit = function(data) {
    this.size = data;
    return this;
};

CB.CloudSearch.prototype.orderByAsc = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    var obj = {};
    obj[columnName] = {};
    obj[columnName]['order'] = 'asc';
    this.sort.push(obj);

    return this;
};

CB.CloudSearch.prototype.orderByDesc = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    var obj = {};
    obj[columnName] = {};
    obj[columnName]['order'] = 'desc';
    this.sort.push(obj);

    return this;
};



CB.CloudSearch.prototype._makeFilteredQuery = function() {

    if (!this.query)
        this.query = {};

    if (!this.query.filtered) {
        var prevQuery = this.query;
        this.query = {};
        this.query.filtered = {};
        this.query.filtered.query = prevQuery;
        this.query.filtered.filter = {};
    }

    this._isFilteredQuery = true;
};

CB.CloudSearch.prototype._getFilterItem = function() {

    for (var key in this.query.filtered.filter) {
        //if you have objects in this object then,
        return this.query.filtered.filter;
    }

    //else
    return null;
};

CB.CloudSearch.prototype._deleteFilterItems = function() {
    this.query.filtered.filter = {};
};

CB.CloudSearch.prototype._createBoolFilter = function() {
    if (!this.query.filtered.filter.bool)
        this.query.filtered.filter.bool = {};
    if (!this.query.filtered.filter.bool.must)
        this.query.filtered.filter.bool.must = [];
    if (!this.query.filtered.filter.bool.should)
        this.query.filtered.filter.bool.should = [];

    if (!this.query.filtered.filter.bool.must_not)
        this.query.filtered.filter.bool.must_not = [];

};

CB.CloudSearch.prototype._createBoolQuery = function() {
    if (!this.query.filtered) {
        if (!this.query.bool)
            this.query.bool = {};

        if (!this.query.bool.must)
            this.query.bool.must = [];

        if (!this.query.bool.must_not)
            this.query.bool.must_not = [];

        if (!this.query.bool.should)
            this.query.bool.should = [];

    } else {
        if (!this.query.filtered.query.bool)
            this.query.filtered.query.bool = {};

        if (!this.query.filtered.query.bool.must)
            this.query.filtered.query.bool.must = [];

        if (!this.query.filtered.query.bool.must_not)
            this.query.filtered.query.bool.must_not = [];

        if (!this.query.filtered.query.bool.should)
            this.query.filtered.query.bool.should = [];
    }



};

CB.CloudSearch.prototype._appendPrevFilterToBool = function() {
    var prevTerm = this._getFilterItem();
    this._deleteFilterItems();
    this._createBoolFilter();
    this.query.filtered.filter.bool.must.push(prevTerm);
};

CB.CloudSearch.prototype._pushInMustFilter = function(obj) {
    this._makeFilteredQuery();


    if (this.query.filtered.filter.bool && this.query.filtered.filter.bool.must) {
        //attach this term to an array of 'must'.
        this.query.filtered.filter.bool.must.push(obj);
    } else if (this._getFilterItem()) {
        //if I already have a exists, then :
        //create a bool and and all of these.
        this._appendPrevFilterToBool();
        this.query.filtered.filter.bool.must.push(obj);

    } else {
        this.query.filtered.filter = obj;
    }
};

CB.CloudSearch.prototype._pushInShouldFilter = function(obj) {
    this._makeFilteredQuery();


    if (this.query.filtered.filter.bool && this.query.filtered.filter.bool.should) {
        //attach this term to an array of 'must'.
        this.query.filtered.filter.bool.should.push(obj);
    } else if (this._getFilterItem()) {
        //if I already have a exists, then :
        //create a bool and and all of these.
        this._appendPrevFilterToBool();
        this.query.filtered.filter.bool.should.push(obj);

    } else {
        this._createBoolFilter();
        this.query.filtered.filter.bool.must_not.push(obj);
    }
};

CB.CloudSearch.prototype._pushInShouldQuery = function(obj) {
    this._makeFilteredQuery();


    if (this.query.filtered.filter.bool && this.query.filtered.filter.bool.should) {
        //attach this term to an array of 'must'.
        this.query.filtered.filter.bool.should.push(obj);
    } else if (this._getFilterItem()) {
        //if I already have a exists, then :
        //create a bool and and all of these.
        this._appendPrevFilterToBool();
        this.query.filtered.filter.bool.should.push(obj);

    } else {
        this._createBoolFilter();
        this.query.filtered.filter.bool.must_not.push(obj);
    }
};


CB.CloudSearch.prototype._pushInMustNotFilter = function(obj) {
    this._makeFilteredQuery();
    if (this.query.filtered.filter.bool && this.query.filtered.filter.bool.must_not) {
        //attach this term to an array of 'must'.
        this.query.filtered.filter.bool.must_not.push(obj);
    } else if (this._getFilterItem()) {
        //if I already have a term, then :
        //create a bool and and all of these.
        this._appendPrevFilterToBool();
        this.query.filtered.filter.bool.must_not.push(obj);

    } else {
        this._createBoolFilter();
        this.query.filtered.filter.bool.must_not.push(obj);
    }
};

CB.CloudSearch.prototype.searchOn = function(columns, query, precision) {

    if (this._isFilteredQuery) {
        if (columns instanceof Array) {
            //if columns is an array.
            this.query.query.multi_match = {};
            this.query.query.multi_match.query = query;
            this.query.query.multi_match.fields = columns;
            if (precision) {
                this.query.query.multi_match.operator = precision;
            }

        } else {
            this.query.query.match = {};
            this.query.query.match[columns] = query;
            if (precision) {
                this.query.query.match.operator = precision;
            }
        }
    } else {
        if (columns instanceof Array) {
            //if columns is an array.
            this.query.multi_match = {};
            this.query.multi_match.query = query;
            this.query.multi_match.fields = columns;
            if (precision) {
                this.query.multi_match.operator = precision;
            }

        } else {
            this.query.match = {};
            this.query.match[columns] = query;
            if (precision) {
                this.query.match.operator = precision;
            }
        }
    }

    return this;
};


CB.CloudSearch.prototype.search = function(callback) {

    CB._validate();

    var collectionName = null;

    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    if (this.collectionNames instanceof Array) {
        collectionName = this.collectionNames.join(',');
    } else {
        collectionName = this.collectionNames;
    }
    var params=JSON.stringify({
        collectionName: collectionName,
        query: this.query,
        sort: this.sort,
        limit: this.size,
        skip: this.from,
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/search" ;

    CB._request('POST',url,params).then(function(response){
        var object = CB._deserialize(JSON.parse(response));
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
    if(!callback) {
        return def;
    }
};

CB.CloudSearch.prototype.notEqualTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    //data can bean array too!
    var term = {};
    if (data instanceof Array) {
        term.terms = {};
        term.terms[columnName] = data;
    } else {
        term.term = {};
        term.term[columnName] = data;
    }

    this._pushInMustNotFilter(term);

    return this;


};

CB.CloudSearch.prototype.equalTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var term = {};
    if (data instanceof Array) {
        term.terms = {};
        term.terms[columnName] = data;
    } else {
        term.term = {};
        term.term[columnName] = data;
    }

    this._pushInMustFilter(term);

    return this;
};

CB.CloudSearch.prototype.exists = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.exists = {};
    obj.exists.field = columnName;


    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.doesNotExist = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.missing = {};
    obj.missing.field = columnName;

    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.greaterThanOrEqual = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['gte'] = data;
    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.greaterThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['gt'] = data;

    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.lessThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['lt'] = data;

    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.prototype.lessthanOrEqual = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['lte'] = data;
    this._pushInMustFilter(obj);

    return this;
};

CB.CloudSearch.or = function(searchObj1, searchObj2) {

    var collectionNames = [];

    if (searchObj1.collectionNames instanceof Array) {
        collectionNames.append(searchObj1.collectionNames);
    } else {
        collectionNames.push(searchObj1.collectionNames);
    }

    if (searchObj2.collectionNames instanceof Array) {
        //check for duplicates.
        for (var i = 0; i < searchObj2.collectionNames; i++) {
            if (collectionNames.indexOf(searchObj2.collectionNames[i]) < 0)
                collectionNames.push(searchObj2.collectionNames[i]);
        }
    } else {
        if (collectionNames.indexOf(searchObj2.collectionNames) < 0)
            collectionNames.push(searchObj2.collectionNames);
    }

    var obj3 = new CB.CloudSearch(collectionNames);
    //merge both of the objects.

    var q1 = null;
    var q2 = null;
    var f1 = null;
    var f2 = null;

    if (searchObj1.query.filtered && searchObj1.query.filtered.query) {
        q1 = searchObj1.query.filtered.query;
    } else if (searchObj1.query && !searchObj1.query.filtered) {
        q1 = searchObj1.query;
    }

    if (searchObj2.query.filtered && searchObj2.query.filtered.query) {
        q2 = searchObj2.query.filtered.query;
    } else if (searchObj2.query && !searchObj2.query.filtered) {
        q2 = searchObj2.query;
    }

    if (searchObj1.query.filtered && searchObj1.query.filtered.filter)
        f1 = searchObj1.query.filtered.filter;

    /* if (searchObj1.query.filteredQuery && searchObj1.query.filteredQuery.filter)
     f1 = searchObj1.query.filteredQuery.filter;*/

    if (searchObj2.query.filtered && searchObj2.query.filtered.filter)
        f2 = searchObj2.query.filtered.filter;

    if (f1 || f2) { //if any of the filters exist, then...
        obj3._makeFilteredQuery();
        if (f1 && !f2)
            obj3.query.filtered.filter = f1;
        else if (f2 && !f1)
            obj3.query.filtered.filter = f2;
        else {
            //if both exists.
            obj3._pushInShouldFilter(f1);
            obj3._pushInShouldFilter(f2);
        }

    }
    if(obj3.query.filtered) {
        if(Object.keys(q1).length>0 || Object.keys(q2).length>0) {
            if(Object.keys(q1).length>0 && !Object.keys(q2).length>0){
                obj3.query.filtered.query=q1;
            }else if(!Object.keys(q1).length>0 && !Object.keys(q2).length>0){
                obj3.query.filtered.query=q2;
            }else{
                obj3.query.filtered.query.bool={"should":[],"must":[],"must_not":[]};
                obj3.query.filtered.query.bool.should.push(q1);
                obj3.query.filtered.query.bool.should.push(q2);

            }
        }

    }

    return obj3;

};

/*
 CloudUser
 */
CB.CloudUser = CB.CloudUser || function() {
    if (!this.document) this.document = {};
    this.document._tableName = 'User';
    this.document._type = 'user';
    this.document.ACL = new CB.ACL();
    this.document._isModified = true;
    this.document._modifiedColumns = ['createdAt','updatedAt','ACL'];
};
CB.CloudUser.prototype = Object.create(CB.CloudObject.prototype);
Object.defineProperty(CB.CloudUser.prototype, 'username', {
    get: function() {
        return this.document.username;
    },
    set: function(username) {
        this.document.username = username;
        CB._modified(this,'username');
    }
});
Object.defineProperty(CB.CloudUser.prototype, 'password', {
    get: function() {
        return this.document.password;
    },
    set: function(password) {
        this.document.password = password;
        CB._modified(this,'password');
    }
});
Object.defineProperty(CB.CloudUser.prototype, 'email', {
    get: function() {
        return this.document.email;
    },
    set: function(email) {
        this.document.email = email;
        CB._modified(this,'email');
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
    var params=JSON.stringify({
        document: CB._serialize(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/signup" ;

    CB._request('POST',url,params).then(function(response){
        CB._deserialize(JSON.parse(response),thisObj);
        CB.CloudUser.current = thisObj;
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
    var params=JSON.stringify({
        document: CB._serialize(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/login" ;

    CB._request('POST',url,params).then(function(response){
        CB._deserialize(JSON.parse(response),thisObj);
        CB.CloudUser.current = thisObj;
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
    var params=JSON.stringify({
        document: CB._serialize(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/logout" ;

    CB._request('POST',url,params).then(function(response){
        CB._deserialize(JSON.parse(response),thisObj);
        CB.CloudUser.current = null;
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
    var params=JSON.stringify({
        user: CB._serialize(thisObj),
        role: CB._serialize(role),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/addToRole" ;

    CB._request('PUT',url,params).then(function(response){
        CB._deserialize(JSON.parse(response),thisObj);
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
    var params=JSON.stringify({
        user: CB._serialize(thisObj),
        role: CB._serialize(role),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/removeFromRole" ;

    CB._request('PUT',url,params).then(function(response){
        CB._deserialize(JSON.parse(response),thisObj);
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
    this.document._modifiedColumns = ['createdAt','updatedAt','ACL','name'];
};

CB.CloudRole.prototype = Object.create(CB.CloudObject.prototype);

Object.defineProperty(CB.CloudRole.prototype, 'name', {
    get: function() {
        return this.document.name;
    },
    set: function(name) {
        this.document.name = name;
        CB._modified(this,name);
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

/*
 CloudFiles
 */

CB.CloudFile = CB.CloudFile || function(file,data,type) {

    if(!file)
        throw "File is null.";

    if (Object.prototype.toString.call(file) === '[object File]' || Object.prototype.toString.call(file) === '[object Blob]' ) {

        this.fileObj = file;

        this.document = {
            _type: 'file',
            name: (file && file.name && file.name !== "") ? file.name : 'unknown',
            size: file.size,
            url: '',
            contentType : (typeof file.type !== "undefined" && file.type !== "") ? file.type : 'unknown'
        };

    } else if(typeof file === "string") {
        var regexp = RegExp("https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}");
        if (regexp.test(file)) {
            this.document = {
                _type: 'file',
                name: '',
                size: '',
                url: file,
                contentType : ''
            };
        } else if(data){
            this.document={
                _type: 'file',
                name: file,
                size: data
            };
        }else{
            throw "Invalid File. It should be of type file or blob";
        }
    }
    else{
        throw "Invalid File. It should be of type file or blob";
    }
};

Object.defineProperty(CB.CloudFile.prototype, 'type', {
    get: function() {
        return this.document.contentType;
    },
    set: function(type) {
        this.document.contentType = type;
    }
});

Object.defineProperty(CB.CloudFile.prototype, 'url', {
    get: function() {
        return this.document.url;
    },
    set: function(url) {
        this.document.url = url;
    }
});

Object.defineProperty(CB.CloudFile.prototype, 'size', {
    get: function() {
        return this.document.size;
    },
    set: function(size) {
        this.document.size = size;
    }
});

Object.defineProperty(CB.CloudFile.prototype, 'name', {
    get: function() {
        return this.document.name;
    },
    set: function(name) {
        this.document.name = name;
    }
});

CB.CloudFile.prototype.save = function(callback) {

    var def;

    if (!callback) {
        def = new CB.Promise();
    }


    var thisObj = this;
    var formdata = new FormData();

    if(!this.fileObj)
        throw "You cannot save a file which is null";

    formdata.append("fileToUpload", this.fileObj);
    formdata.append("key", CB.appKey);

    var xmlhttp = CB._loadXml();
    var params=formdata;
    url = CB.serverUrl+'/file/' + CB.appId + '/upload' ;
    xmlhttp.open('POST',url,true);
    if (CB._isNode) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
        xmlhttp.setRequestHeader("User-Agent",
            "CB/" + CB.version +
            " (NodeJS " + process.versions.node + ")");
    }
    var ssid = localStorage.getItem('sessionID');
    if(ssid != null)
        xmlhttp.setRequestHeader('sessionID', ssid);
    xmlhttp.send(params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                thisObj.url = JSON.parse(xmlhttp.responseText)._url;
                var sessionID = xmlhttp.getResponseHeader('sessionID');
                if(sessionID)
                    localStorage.setItem('sessionID', sessionID);
                else
                    localStorage.removeItem('sessionID');
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
}

CB.CloudFile.prototype.delete = function(callback) {
    var def;

    if(!this.url) {
        throw "You cannot delete a file which does not have an URL";
    }
    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;

    var params=JSON.stringify({
        url: thisObj.url,
        key: CB.appKey
    });
    url = CB.serverUrl+'/file/' + CB.appId + '/delete' ;

    CB._request('POST',url,params).then(function(response){
        thisObj.url = null;
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
/*
 *CloudGeoPoint
 */

CB.CloudGeoPoint = CB.CloudGeoPoint || function(latitude , longitude) {
    if(!latitude || !longitude)
        throw "Latitude or Longitude is empty.";

    if(isNaN(latitude))
        throw "Latitude "+ latitude +" is not a number type.";

    if(isNaN(longitude))
        throw "Longitude "+ longitude+" is not a number type.";

    this.document = {};
    this.document.type = "Point";

    //The default datum for an earth-like sphere is WGS84. Coordinate-axis order is longitude, latitude.
    if((Number(latitude)>= -90 && Number(latitude)<=90)&&(Number(longitude)>= -180 && Number(longitude)<=180))
        this.document.coordinates = [Number(latitude), Number(longitude)];
    else
        throw "latitude and longitudes are not in range";
};

Object.defineProperty(CB.CloudGeoPoint.prototype, 'latitude', {
    get: function() {
        return this.document.coordinates[0];
    },
    set: function(latitude) {
        if(Number(latitude)>= -90 && Number(latitude)<=90)
            this.document.coordinates[0] = latitude;
        else
            throw "Latitude is not in Range";
    }
});

Object.defineProperty(CB.CloudGeoPoint.prototype, 'longitude', {
    get: function() {
        return this.document.coordinates[1];
    },
    set: function(longitude) {
        if(Number(longitude)>= -180 && Number(latitude)<=180)
            this.document.coordinates[1] = longitude;
        else
            throw "Longitude is not in Range";
    }
});

CB.CloudGeoPoint.prototype.distanceInKMs = function(point) {

    var earthRedius = 6371; //in Kilometer
    return earthRedius * greatCircleFormula(this, point);
};

CB.CloudGeoPoint.prototype.distanceInMiles = function(point){

    var earthRedius = 3959 // in Miles
    return earthRedius * greatCircleFormula(this, point);

};

CB.CloudGeoPoint.prototype.distanceInRadians = function(point){

    return greatCircleFormula(this, point);
};

function greatCircleFormula(thisObj, point){

    var dLat =(thisObj.document.coordinates[1] - point.document.coordinates[1]).toRad();
    var dLon = (thisObj.document.coordinates[0] - point.document.coordinates[0]).toRad();
    var lat1 = (point.document.coordinates[1]).toRad();
    var lat2 = (thisObj.document.coordinates[1]).toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return c;
}

if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

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
CB._modified = function(thisObj,columnName){
    thisObj.document._isModified = true;
    if(thisObj.document._modifiedColumns) {
        if (thisObj.document._modifiedColumns.indexOf(columnName) === -1) {
            thisObj.document._modifiedColumns.push(columnName);
        }
    }else{
        thisObj.document._modifiedColumns = [];
        thisObj.document._modifiedColumns.push(columnName);
    }
};