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
   var util = {
     makeString : function(){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	},	

	makeEmail : function(){
	    return this.makeString()+'@sample.com';
	}

   };

   

	
describe("Server Check",function(){
    it("should check for localhost",function(done){
        this.timeout(100000);
        var xmlhttp;
        var req = typeof(require) === 'function' ? require : null;
        // Load references to other dependencies
        if (typeof(XMLHttpRequest) !== 'undefined') {
            xmlhttp = XMLHttpRequest;
        } else if (typeof(require) === 'function' &&
            typeof(require.ensure) === 'undefined') {
            xmlhttp = req('xmlhttprequest').XMLHttpRequest;
        }
        CB.appId = 'travis123';
        CB.appKey = '6dzZJ1e6ofDamGsdgwxLlQ==';
        CB.serverUrl = 'http://stagingdataservices.azurewebsites.net';
        CB.socketIoUrl = CB.serverUrl;
        CB.apiUrl = CB.serverUrl + '/api';
        done();
    });
});

describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(500000);

        CB.CloudApp.init(CB.appId, CB.appKey);

        done();
    });
});

describe("CloudObjectExpires", function () {

    it("should save a CloudObject after expire is set", function (done) {

        this.timeout(10000);
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.expires=new Date().getTime();
        obj.isSearchable=true;
        obj.save().then(function(obj1) {
            if(obj1.get('expires'))
                done();
        }, function (err) {
            console.log(err);
            throw "Cannot save an object after expire is set";
        });

    });

    it("objects expired should not show up in query", function (done) {

        this.timeout(10000);
        var curr=new Date().getTime();
        var query1 = new CB.CloudQuery('student1');
        query1.equalTo('name','vipul');
        var query2 = new CB.CloudQuery('student1');
        query2.lessThan('age',12);
        var query =  CB.CloudQuery.or(query1,query2);
        delete query.query.$include;
        delete query.query.$or[0].$include;
        delete query.query.$or[1].$include;
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    if(list[i]._expires>curr || !list[i]._expires){
                            break;
                        }
                    else{
                        throw "Expired Object Retrieved";
                    }
                }
                done();
                }else{
                    done();
            }

        }, function(error){

        })

    });


    it("objects expired should not show up in Search", function (done) {

        this.timeout(10000);
        var curr=new Date().getTime();
        var query1 = new CB.CloudSearch('student1');
        query1.equalTo('name','vipul');
       var query2 = new CB.CloudSearch('student1');
        query2.lessThan('age',12);
        var query = CB.CloudSearch.or(query1,query2);
        query.search({
            success:function(list){
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i]._expires > curr || !list[i]._expires) {
                        break;
                    }
                    else {
                        throw "expired object retrieved in Search";
                    }
                }
                done();
            }else{ done();
            }
            },error: function(error){
                throw "should not show expired objects";
            }
            });

    });
});
describe("Cloud Object", function() {

	//Use Sample Table. 
	// -> Which has columns : 
	// name : string : required. 

    it("should not save a string into date column",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Sample');
        obj.set('createdAt','abcd');
        obj.set('name', 'sample');
        obj.save().then(function(){
            throw("should not have saved string in datetime field");
        },function(){
            done();
        });
    });

    it("should save.", function(done) {

    	this.timeout('10000');

     	var obj = new CB.CloudObject('Sample');
     	obj.set('name', 'sample');
     	obj.save({
     		success : function(newObj){
     			if(obj.get('name') !== 'sample'){
     				throw 'name is not equal to what was saved.';
     			}
     			if(!obj.id){
     				throw 'id is not updated after save.';
     			}

     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
    });


   it("should update the object after save and update.", function(done) {
        this.timeout('10000');

     	var obj = new CB.CloudObject('Sample');
     	obj.set('name', 'sample');
     	obj.save({
     		success : function(newObj){

     			var oldId = newObj.id;

     			if(obj.get('name') !== 'sample'){
     				throw 'name is not equal to what was saved.';
     			}

     			if(!obj.id){
     				throw 'id is not updated after save.';
     			}

     			obj.set('name','sample1');
     			obj.save({
		     		success : function(newObj){

		     			if(obj.get('name') !== 'sample1'){
		     				throw 'name is not equal to what was saved.';
		     			}

		     			if(!obj.id){
		     				throw 'id is not updated after save.';
		     			}
		     			
		     			if(obj.id !== oldId){
		     				throw "did not update the object, but saved.";
		     			}

		     			done();
		     		}, error : function(error){
		     			throw 'Error updating the object';
		     		}
     			});

     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
    });

    it("should delete an object after save.", function(done) {

    	this.timeout('10000');
        
        var obj = new CB.CloudObject('Sample');
     	obj.set('name', 'sample');
     	obj.save({
     		success : function(newObj){
     			obj.delete({
		     		success : function(obj){
		     			done();
		     		}, error : function(error){
		     			throw 'Error deleting the object';
		     		}
     			});
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
    });

    it("should not save an object which has required column which is missing. ", function(done) {
        this.timeout('10000');

     	var obj = new CB.CloudObject('Sample');
   		//name is required which is missing.
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object even when required is missing.";
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save an object with wrong dataType.", function(done) {
       this.timeout('10000');

     	var obj = new CB.CloudObject('Sample');
   		//name is string and we have a wrong datatype here.
   		obj.set('name', 10); //number instead of string.
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object even when required is missing.";
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save an object with duplicate values in unique fields.", function(done) {

    	this.timeout('10000');
        
        var text = util.makeString();

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('unique', text);
   
     	obj.save({
     		success : function(newObj){
     			var obj = new CB.CloudObject('Sample');
		        obj.set('name','sample');
		        obj.set('unique', text); //saving with sample text
		     	obj.save({
		     		success : function(newObj){
		     			throw "Saved an object violated unique constraint.";
		     		}, error : function(error){
		     			done();
		     		}
		     	});

     		}, error : function(error){
     			throw "Saved Error";
     		}
     	});
    });

    it("should save an array.", function(done) {

    	this.timeout('10000');

        var text = util.makeString();

		var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('stringArray', [text,text]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw "Error saving object. ";
     		}
     	});
    });

    it("should not save wrong datatype in an  array.", function(done) {
       	
       	this.timeout(10000);

		var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('stringArray', [10,20]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			throw 'Wrong datatype in an array saved.';
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not allow multiple dataTypes in an array. ", function(done) {
    	var text = util.makeString();

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('stringArray', [text,20]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			throw 'Multiple datatype in an array saved.';
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should save an array with JSON objects. ", function(done) {

    	this.timeout(10000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('objectArray', [{sample : 'sample'},
        						{sample : 'sample'}
        					]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw "Error saving object. ";
     		}
     	});
    });

    it("should save a CloudObject as a relation. ", function(done) {
       	this.timeout(10000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        obj.set('sameRelation', obj1); //saving with sample text

     	obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw "Error saving object. ";
     		}
     	});
    });

     it("should not save a a wrong relation.", function(done) {
       this.timeout(10000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Student');
        obj1.set('name','sample');

        obj.set('sameRelation', obj1); //saving with sample text
        
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object with a wrong relation."
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save a CloudObject Relation when the schema of a related object is wrong. ", function(done) {
       this.timeout(10000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        //name is required , which means the schema is wrong. 

        obj.set('sameRelation', obj1); //saving with sample text
        
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object in a relation with an invalid schema.";
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save a duplicate relation in unique fields. ", function(done) {

       this.timeout(10000);

       var obj = new CB.CloudObject('Sample');
       obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        obj.set('uniqueRelation', obj1); //saving with sample text
        
     	obj.save({
     		success : function(newObj){
     			var obj2 = new CB.CloudObject('Sample');
       			obj2.set('name','sample');
       			obj2.set('uniqueRelation', obj1);
       			obj2.save({success : function(newObj){
       				throw "Saved a duplicate relation on a unique field.";
       			}, error : function(error){
       				done();
       			}	
       		});


     		}, error : function(error){
     			throw "Cannot save an object";
     		}
     	});
    });

   /* it("should save an array of CloudObject with an empty array", function(done) {
        this.timeout(10000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
        obj2.set('name','sample');
        obj2.set('relationArray', []);


        obj.save({
            success : function(newObj){

                obj2.save({success : function(newObj){
                    done();
                }, error : function(error){
                    throw "Cannot save an object in a relation.";
                }
                });
            }});
    });*/


    it("should save an array of CloudObject.", function(done) {
       this.timeout(10000);

       var obj = new CB.CloudObject('Sample');
       obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
		obj2.set('name','sample');
		obj2.set('relationArray', [obj1, obj]);

        
     	obj.save({
     		success : function(newObj){

       			obj2.save({success : function(newObj){
       				done();
       			}, error : function(error){
       				throw "Cannot save an object in a relation.";
       			}	
       		});
    	}});
    });

     it("should modify the list relation of a saved CloudObject.", function(done) {
        this.timeout(30000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
        obj2.set('name','sample');
        obj2.set('relationArray', [obj1, obj]);


        obj.save({
        success : function(newObj){
            obj2.save({success : function(Obj3){
                var relationArray = Obj3.get('relationArray');
                if(relationArray.length !== 2)
                    throw "unable to save relation properly";
                relationArray.splice(1);
                Obj3.set('relationArray',relationArray);
                Obj3.save().then(function(Obj4){
                    if(relationArray.length === 1)
                        done();
                },function(){
                    throw "should save";
                });
            }, error : function(error){
                throw "Cannot save an object in a relation.";
            }
            });
        }});
     });

    it("should save an array of CloudObject with some objects saved and others unsaved.", function(done) {
       this.timeout(10000);

       var obj = new CB.CloudObject('Sample');
       obj.set('name','sample');

       obj.save({

     		success : function(newObj){

     			var obj1 = new CB.CloudObject('Sample');
		        obj1.set('name','sample');

		        var obj2 = new CB.CloudObject('Sample');
				obj2.set('name','sample');
				obj2.set('relationArray', [obj1, obj]);

       			obj2.save({success : function(newObj){
	       				done();
	       			}, error : function(error){
	       				throw "Cannot save an object in a relation.";
	       			}	
       			});
       			
    	}});

    });

    it("should not save an array of different CloudObjects.", function(done) {
        this.timeout(10000);

       var obj = new CB.CloudObject('Student');
       obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
		obj2.set('name','sample');
		obj2.set('relationArray', [obj1, obj]);

        
     	obj.save({
     		success : function(newObj){

       			obj2.save({success : function(newObj){
       				throw "Saved different types of CloudObject in a single list";
       			}, error : function(error){
       				done();
       			}	
       		});
    	}, error : function(error){
                throw "Cannot save obj";
            }});
    });

 // Test for error of getting duplicate objects while saving a object after updating
    it("Should not duplicate the values in a list after updating",function(done){
        this.timeout(10000);
        var obj = new CB.CloudObject('student1');
        obj.set('age',5);
        obj.set('name','abcd');
        var obj1 = new CB.CloudObject('Custom4');
        obj1.set('newColumn7',[obj,obj]);
        obj1.save().then(function(list){
            nc7=list.get('newColumn7');
            nc7.push(obj);
            obj1.set('newColumn7',nc7);
            obj1.save().then(function(list){
                if(list.get('newColumn7').length === 3)
                    done();
                else
                    throw "should not save duplicate objects";
            },function(){
                throw "should save cloud object ";
            });
        },function(err){
            throw "should save cloud object";
        });
    });

// Test Case for error saving an object in a column
    it("should save a JSON object in a column",function(done){
        this.timeout(10000);
        var json= {"name":"vipul","location":"uoh","age":10};
        var obj = new CB.CloudObject('Custom');
        obj.set('newColumn6',json);
        obj.save().then(function(list){
            var obje=list.get('newColumn6');
            if(obje.name === 'vipul' && obje.location === 'uoh' && obje.age === 10)
                done();
            else
                throw "error in saving json object";
        },function(){
            throw "should save JSON object in cloud";
        });
    });

});
describe("CloudExpire", function () {

    it("Sets Expire in Cloud Object.", function (done) {

        this.timeout(10000);
        //create an object.
        var obj = new CB.CloudObject('Custom');
        obj.set('newColumn1', 'abcd');
        obj.save().then(function(obj1) {
                done();
            throw "unable to save expires";
        }, function (err) {
            console.log(err);
            throw "Relation Expire error";
        });

    });

    it("Checks if the expired object shows up in the search or not", function (done) {

        this.timeout(10000);
        var curr=new Date().getTime();
        var query = new CB.CloudQuery('Custom');
        query.find().then(function(list){
            if(list.length>0){
                var __success = false;
                for(var i=0;i<list.length;i++){
                    if(list[i].get('expires')>curr || !list[i].get('expires')){
                           __success = true;
                            done();
                            break;
                        }
                    else{
                        throw "Expired Values also shown Up";
                    }
                    }
                }else{
                done();
            }

        }, function(error){

        })

    });


});
describe("Version Test",function(done){

    it("should set the Modified array",function(done){
        var obj = new CB.CloudObject('sample');
        obj.set('expires',0);
        obj.set('name','vipul');
        if(obj.get('_modifiedColumns').length > 0) {
            done();
        }else{
            throw "Unable to set Modified Array";
        }
    });

    var obj = new CB.CloudObject('Sample');

    it("should save.", function(done) {

        this.timeout('10000');
        obj.set('name', 'sample');
        obj.save({
            success : function(newObj){
                if(obj.get('name') !== 'sample'){
                    throw 'name is not equal to what was saved.';
                }
                if(!obj.id){
                    throw 'id is not updated after save.';
                }
                done();
            }, error : function(error){
                throw 'Error saving the object';
            }
        });
    });

    it("should get the saved CO with version",function(done){
        this.timeout(10000);
        var query = new CB.CloudQuery('Sample');
        query.findById(obj.get('id')).then(function(list){
            var version = list.get('_version');
            if(version>=0){
                done();
            }else{
                throw "unable to get Version";
            }
        },function(){
            throw "unable to find saved object";
        });
    });


    it("should update the version of a saved object", function (done) {
        this.timeout(10000);
        var query = new CB.CloudQuery('Sample');
        query.equalTo('id',obj.get('id'));
        query.find().then(function(list){
            console.log(list);
            list[0].set('name','abcd');
            list[0].save().then(function(){
                var query1 = new CB.CloudQuery('Sample');
                query1.equalTo('id',obj.get('id'));
                query1.find().then(function(list){
                    if(list[0].get('_version') === 1){
                        done();
                    }else{
                        throw "version number should update";
                    }
                },function(){
                    throw "unable to find saved object";
                })
            }, function () {
                throw "unable to save object";
            })
        },function(){
            throw "unable to find saved object";
        })
    });

    var username = util.makeString();
    var passwd = "abcd";
    var user = new CB.CloudUser();
    it("Should create new user with version", function (done) {

        this.timeout(10000);

        user.set('username', username);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === username && list.get('_version')>=0){
                done();
            }
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    var roleName = util.makeString();

    it("Should create a role with version", function (done) {

        this.timeout(10000);
        var role = new CB.CloudRole(roleName);
        role.save().then(function (list) {
            if (!list)
                throw "Should retrieve the cloud role";
            if (list.get('_version') >= 0)
                done();
            else
                throw "Unable to save version number with CloudRole";
        }, function () {
            throw "Should retrieve the cloud role";
        });
    });

    var parent = new CB.CloudObject('Custom4');
    var child = new CB.CloudObject('student1');

    it("Should Store a relation with version",function(done){

        this.timeout(10000);
        child.set('name','vipul');
        parent.set('newColumn7',[child]);
        parent.save().then(function(list){
            if(list)
            done();
        },function(err){
            throw "should save the relation";
        });

    });
    it("Should retrieve a saved user object",function(done){
        this.timeout(10000);
        var query = new CB.CloudQuery('User');
        query.get(user.get('id')).then(function (user) {
            if(user.get('username') === username)
                done();
        }, function () {
            throw "unable to get a doc";
        });
    });

    it("Should save object with a relation and don't have a child object",function(){

        this.timeout(10000);
        var obj = new CB.CloudObject('Sample');
        obj.set('name','vipul');
        obj.save().then(function(obj1){
            if(obj1.get('name') === 'vipul')
                done();
            else
                throw "unable to save the object";
        },function(){
            throw "unable to save object";
        });
    });
});


describe("CloudNotification", function() {
 
    it("should subscribe to a channel", function(done) {
      CB.CloudNotification.on('sample', 
      function(data){
      	
      }, 
      {
      	success : function(){
      		done();
      	}, 
      	error : function(){
      		throw 'Error subscribing to a CloudNotification.';
      	}

      });
    });

    /*it("should publish data to the channel.", function(done) {
      CB.CloudNotification.on('sample', 
      function(data){
      	if(data === 'data'){
      		done();
      	}else{
      		throw 'Error wrong data received.';
      	}
      }, 
      {
      	success : function(){
      		//publish to a channel. 
      		CB.CloudNotification.publish('sample', 'data',{
				success : function(){
					//succesfully published. //do nothing. 
				},
				error : function(err){
					//error
					throw 'Error publishing to a channel in CloudNotification.';
				}
				});
      	}, 
      	error : function(){
      		throw 'Error subscribing to a CloudNotification.';
      	}

      });
    });


    it("should stop listening to a channel", function(done) {

    	this.timeout(10000);

     	CB.CloudNotification.on('sample', 
	      function(data){
	      	throw 'stopped listening, but still receiving data.';
	      }, 
	      {
	      	success : function(){
	      		//stop listening to a channel. 
	      		CB.CloudNotification.off('sample', {
					success : function(){
						//succesfully stopped listening.

						//now try to publish. 
						CB.CloudNotification.publish('sample', 'data',{
							success : function(){
								//succesfully published. 

								//wait for 5 seconds.
								setTimeout(function(){ 
									done();
								}, 5000);

							},
							error : function(err){
								//error
								throw 'Error publishing to a channel.';
							}
						});


					},
					error : function(err){
						//error
						throw 'error in sop listening.';
					}
				});

	      		
	      	}, 
	      	error : function(){
	      		throw 'Error subscribing to a CloudNotification.';
	      	}

	      });


    });*/

});
describe("Cloud GeoPoint Test", function() {
  	
	it("should save a latitude and longitude when passing data are number type", function(done) {
        this.timeout(30000);
		var obj = new CB.CloudObject('Custom5');
     	var loc = new CB.CloudGeoPoint(17.9,79.6);
		obj.set("location", loc);
        obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
	});
	
	it("should save a latitude and longitude when passing a valid numeric data as string type", function(done) {
		this.timeout(10000);
        var obj = new CB.CloudObject('Custom5');
     	var loc = new CB.CloudGeoPoint("18.19","79.3");
		obj.set("location", loc);
		obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
	});
	
	/*it("should get data from server for near function", function(done) {
     	this.timeout(10000);
        var loc = new CB.CloudGeoPoint("17.7","80.3");
        var query = new CB.CloudQuery('Custom5');
		query.near("location", loc, 100000);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});*/
	
	it("should get list of CloudGeoPoint Object from server Polygon type geoWithin", function(done) {
     	this.timeout(10000);
        var loc1 = new CB.CloudGeoPoint(18.4,78.9);
     	var loc2 = new CB.CloudGeoPoint(17.4,78.4);
     	var loc3 = new CB.CloudGeoPoint(17.7,80.4);
        var query = new CB.CloudQuery('Custom5');
		query.geoWithin("location", [loc1, loc2, loc3]);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                	//display data
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});
	
	it("should get list of CloudGeoPoint Object from server Polygon type geoWithin + equal to + limit", function(done) {
     	this.timeout(10000);
        var loc1 = new CB.CloudGeoPoint(18.4,78.9);
     	var loc2 = new CB.CloudGeoPoint(17.4,78.4);
     	var loc3 = new CB.CloudGeoPoint(17.7,80.4);
        var query = new CB.CloudQuery('Custom5');
        query.setLimit(4);
		query.geoWithin("location", [loc1, loc2, loc3]);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                	//display data
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});
	
	it("should get list of CloudGeoPoint Object from server for Circle type geoWithin", function(done) {
     	this.timeout(10000);
        var loc = new CB.CloudGeoPoint(17.3, 78.3);
        var query = new CB.CloudQuery('Custom5');
		query.geoWithin("location", loc, 1000);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                	//display data
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});
	
	it("should get list of CloudGeoPoint Object from server for Circle type geoWithin + equal to + limit", function(done) {
     	this.timeout(10000);
        var loc = new CB.CloudGeoPoint(17.3, 78.3);
        var query = new CB.CloudQuery('Custom5');
		query.geoWithin("location", loc, 1000);
		query.setLimit(4);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                	//display data
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});
});

describe("CloudQuery Include", function () {
    
   
    
    it("save a relation.", function (done) {
        
        this.timeout(10000);

        //create an object. 
        var obj = new CB.CloudObject('Custom4');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        var obj2= new CB.CloudObject('student1');
        obj2.set('name', 'Nawaz');
        obje=[obj1,obj2];
        obj.set('newColumn7', obje);
        obj.save().then(function() {
            done();
        }, function () { 
            throw "Relation Save error";
        });

    });

    it("save a Multi-Join.", function (done) {

        this.timeout(10000);

        //create an object.
        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        var obj2 = new CB.CloudObject('hostel');
        var obj3 = new CB.CloudObject('Custom3');
        obj3.set('address','progress');
        obj.set('newColumn2',obj3);
        obj2.set('room',509);
        obj1.set('name', 'Vipul');
        obj1.set('expires',null);
        obj.set('newColumn7', obj1);
        obj1.set('newColumn',obj2);
        obj.save().then(function() {
            done();
        }, function () {
            throw "Relation Save error";
        });

    });

    it("should include a relation object when include is requested in a query.", function (done) {

        this.timeout(10000);

        var query = new CB.CloudQuery('Custom2');
        query.include('newColumn7');
        query.include('newColumn7.newColumn');
        query.include('newColumn2');
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    var student_obj=list[i].get('newColumn7');
                    var room=student_obj.get('newColumn');
                    var address=list[i].get('newColumn2');
                    if(!student_obj.get('name') || !room.get('room') || !address.get('address'))
                        throw "Unsuccessful Join";
                }
                done();
            }else{
                throw "Cannot retrieve a saved relation.";
            }
        }, function(error){

        })

    });

});
describe("CloudQuery", function () {

    var obj = new CB.CloudObject('student1');

   it("Should save data with a particular value.", function (done) {

        this.timeout(10000);

        obj.set('name', 'vipul');
        obj.save().then(function(list) {
            if(list.get('name') === 'vipul')
                done();
            else
                throw "object could not saved properly";
        }, function () {
            throw "data Save error";
        });

    });

    it("should find data with id",function(done){

        this.timeout(10000);

        var query = new CB.CloudQuery('student1');
        query.equalTo("id",obj.get('id'));
        query.find().then(function(list){
            if(list.length>0){
                done();
            }else{
                throw "unable to retrive data";
            }
        },function(err){
           throw "unable to retrieve data";
        });

    });

    it("should find item by id",function(done){
        this.timeout(10000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('id',obj.get('id'));
        query.find().then(function(list){
            if(list.length>0)
                done();
            else
                throw "object could not saved properly";
        },function(err){
            console.log(err);
        });
    });

    it("should run a find one query",function(done){

        this.timeout(10000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('name','vipul');
        query.findOne().then(function(list){
            if(list.get('name') === 'vipul')
                done();
            else
                throw "unable to get";
        }, function (err) {
            console.log(err);
            throw "should return object";
        })
    });

    it("Should retrieve data with a particular value.", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudQuery('student1');
        obj.equalTo('name','vipul');
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name') != 'vipul')
                        throw "should retrieve saved data with particular value ";
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data matching with several different values", function (done) {

        this.timeout(10000);


        var obj = new CB.CloudQuery('student1');
        obj.containedIn('name',['vipul','nawaz']);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name') != 'vipul' && list[i].get('name')!= 'nawaz')
                        throw "should retrieve saved data with particular value ";
                }
            } else{
                throw "should retrieve data matching a set of values ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should save list with in column", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['java','python']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "list Save error";
        });

    });

    it("Should retrieve list matching with several different values", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudQuery('student4');
        obj.containsAll('subject',['java','python']);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    var subject=list[i].get('subject');
                    for(var j=0;j<subject.length;j++) {
                        if (subject[j] != 'java' && subject[j] != 'python')
                            throw "should retrieve saved data with particular value ";

                    }
                }
            } else{
                throw "should retrieve data matching a set of values ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data where column name starts which a given string", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudQuery('student1');
        obj.startsWith('name','v');
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name')[0] != 'v' && list[i].get('name')[0]!='V')
                        throw "should retrieve saved data with particular value ";
                }
            } else{
                throw "should retrieve data matching a set of values ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should save list with in column", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['C#','python']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "list Save error";
        });

    });

    it("Should not retrieve data with a particular value.", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudQuery('student1');
        obj.notEqualTo('name','vipul');
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name') === 'vipul')
                        throw "should not retrieve data with particular value ";
                }
            } else{
                throw "should not retrieve data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should not retrieve data including a set of different values", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudQuery('student4');
        obj.notContainedIn('subject',['java','python']);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('subject')) {
                        var subject = list[i].get('subject');
                        for (var j = 0; j < subject.length; j++) {
                            if (subject[j] === 'java' || subject[j] === 'python')
                                throw "should retrieve saved data with particular value ";

                        }
                    }
                }
            } else{
                done();
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should save data with a particular value.", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.set('age', 15);
        obj.set('subject', ['C#','C']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "data Save error";
        });

    });

    it("Should retrieve data which is greater that a particular value.", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudQuery('student4');
        obj.greaterThan('age',10);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') <= 10 )
                        throw "received value less than the required value";
                }
            } else{
                throw "received value less than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data which is greater equal to a particular value.", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudQuery('student4');
        obj.greaterThanEqualTo('age',15);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') < 10)
                        throw "received value less than the required value";
                }
            } else{
                throw "received value less than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data which is less than a particular value.", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudQuery('student4');
        obj.lessThan('age',20);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') >= 20)
                        throw "received value greater than the required value";
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data which is less or equal to a particular value.", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudQuery('student4');
        obj.lessThanEqualTo('age',15);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') > 15)
                        throw "received value greater than the required value";
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data with a particular value.", function (done) {

        this.timeout(10000);

        var obj1 = new CB.CloudQuery('student4');
        obj1.equalTo('subject',['java','python']);
        var obj2 = new CB.CloudQuery('student4');
        obj2.equalTo('age',12);
        var obj = new CB.CloudQuery.or(obj1,obj2);
        obj.find().then(function(list) {
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age') === 12) {
                        continue;
                    }else {
                        var subject = list[i].get('subject');
                        for (var j = 0; j < subject.length; j++) {
                            if (subject[j] === 'java' || subject[j] === 'python') {
                                continue;
                            }
                            else
                            {
                                throw "should retrieve saved data with particular value ";
                            }
                        }
                    }
                    continue;
                }
            }
            else
                throw "should return data";
            done();
        }, function () {
            throw "find data error";
        });

    });

   it("Should retrieve data in ascending order", function (done) {

        this.timeout(10000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.orderByAsc('age');
        obj.find().then(function(list) {
            if(list.length>0){
                age=list[0].get('age');
                for(var i=1;i<list.length;i++)
                {
                    if(age>list[i].get('age'))
                        throw "received value greater than the required value";
                    age=list[i].get('age');
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data in descending order", function (done) {

        this.timeout(10000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.orderByDesc('age');
        obj.find().then(function(list) {
            if(list.length>0){
                age=list[0].get('age');
                for(var i=1;i<list.length;i++)
                {
                    if(age<list[i].get('age'))
                        throw "received value greater than the required value";
                    age=list[i].get('age');
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should limit the number of data items received", function (done) {

        this.timeout(10000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.setLimit(5);
        obj.find().then(function(list) {
            if(list.length>5)
                throw "received number of items are greater than the required value";
            else
                done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should limit the number of data items received to one", function (done) {

        this.timeout(10000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.findOne().then(function(list) {
            if(list.length > 1)
                throw "received number of items are greater than the required value";
            else
                done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should give distinct elements", function (done) {

        this.timeout(10000);
        var age=[];
        var obj = new CB.CloudQuery('student4');
        obj.distinct('age').then(function(list) {
            if(list.length>0)
            {
                for(var i=0;i<list.length;i++) {
                    if (list[i].get('age')) {
                        if (age.indexOf(list[i].get('age')) > 0)
                            throw "received item with duplicate age";
                        else
                            age.push(list[i].get('age'));
                    }
                }
                done();
            }
        }, function () {
            throw "find data error";
        });

    });

    var getidobj = new CB.CloudObject('student1');

    it("Should save data with a particular value.", function (done) {

        this.timeout(10000);
        getidobj.set('name', 'abcd');
        getidobj.save().then(function() {
            done();
        }, function () {
            throw "data Save error";
        });

    });

    it("Should get element with a given id", function (done) {

        this.timeout(10000);
        var obj = new CB.CloudQuery('student1');
        obj.get(getidobj.get('id')).then(function(list) {
            if(list.length>0) {
                throw "received number of items are greater than the required value";
            }
            else{
                if(list.get('name')==='abcd')
                    done();
                else
                    throw "received wrong data";
            }
        }, function () {
            throw "find data error";
        });

    });

    it("Should get element having a given column name", function (done) {

        this.timeout(10000);
        var obj = new CB.CloudQuery('student4');
        obj.exists('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (!list[i].get('age'))
                        throw "received wrong data";
                }
                done();
            }
            else{
                throw "data not received"
            }
        }, function () {
            throw "find data error";
        });

    });

    it("Should get element not having a given column name", function (done) {

        this.timeout(10000);
        var obj = new CB.CloudQuery('student4');
        var obj = new CB.CloudQuery('student4');
        obj.doesNotExists('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age'))
                        throw "received wrong data";
                }
                done();
            }
            else{
                throw "data not received"
            }
        }, function () {
            throw "find data error";
        });

    });

});
describe("CloudSearch", function (done) {

    this.timeout(10000);

    it("should index object for search", function (done) {
        var obj = new CB.CloudObject('Custom1');
        obj.set('description', 'wi-fi');
        obj.isSearchable = true;
        obj.save({
            success : function(obj){
                done();
            },error : function(error){
                throw "should index cloud object";
            }
        });
    });

    it("should search indexed object", function (done) {

        this.timeout(10000);

        var cs = new CB.CloudSearch('Custom1');
        cs.searchOn('description', 'wi-fi');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for indexed object";
                }
            },error : function(error){
                throw "should search for indexed object";
            }
        });
    });

    it("should search indexed object", function (done) {

        this.timeout(10000);

        var cs = new CB.CloudSearch('Custom1');
        cs.searchOn('description', 'wi-fi');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search indexed object";
                }
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });

    it("should index test data",function(done){

        this.timeout(50000);

        var obj = new CB.CloudObject('Student');
        obj.set('description', 'This is nawaz');
        obj.set('age', 19);
        obj.set('name', 'Nawaz Dhandala');
        obj.set('class', 'Java');
        obj.isSearchable = true;
        obj.save({
            success : function(obj){
                //now search on this object.
                var obj = new CB.CloudObject('Student');
                obj.set('description', 'This is gautam singh');
                obj.set('age', 19);
               // obj.expires=new Date().getTime();
                obj.set('name', 'Gautam Singh');
                obj.set('class', 'C#');
                obj.isSearchable = true;
                obj.save({
                    success : function(obj){
                        var obj = new CB.CloudObject('Student');
                        obj.set('description', 'This is ravi');
                        obj.set('age', 40);
                   //     obj.expires=new Date().getTime();
                        obj.set('name', 'Ravi');
                        obj.set('class', 'C#');
                        obj.isSearchable = true;

                        obj.save({
                            success : function(obj){
                                //now search on this object.
                                done();
                            },error : function(error){
                                throw "should index data for search";
                            }
                        });
                    },error : function(error){
                        throw "index data error";
                    }
                });


            },error : function(error){
                throw "index data error";
            }
        });

    });

    it("should search for object for a given value",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.equalTo('age', 19);
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search indexed object";
                }
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });

    it("should search values which are not equal to a given value",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.notEqualTo('age', 19);
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search values which are not equal to a given value";
                }
            },error : function(error){
                throw "should search values which are not equal to a given value";
            }
        });
    });

    it("should limit the number of search results",function(done){

        this.timeout(20000);

        var cs = new CB.CloudSearch('Student');
        cs.notEqualTo('age', 19);
        cs.setLimit(0);
        cs.search({
            success : function(list){
                if(list.length===0){
                    done();
                }else{
                    throw "should limit the number of results";
                }
            },error : function(error){
                throw "should search for results";
            }
        });
    });

    it("should limit the number of search results",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.notEqualTo('age', 19);
        cs.setLimit(1);
        cs.search({
            success : function(list){
                if(list.length===1){
                    done();
                }else{
                    throw "should limit the number of results";
                }
            },error : function(error){
                throw "should search for results";
            }
        });
    });

    it("should skip elements",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.notEqualTo('age', 19);
        cs.setSkip(9999999);
        cs.search({
            success : function(list){
                if(list.length===0){
                    var cs = new CB.CloudSearch('Student');
                    cs.notEqualTo('age', 19);
                    cs.setSkip(1);
                    cs.search({
                        success : function(list){
                            if(list.length>0){
                                done();
                            }else{
                                throw "should skip elements";
                            }
                        },error : function(error){
                            throw "should skip elements"
                        }
                    });
                }else{
                    throw "should search for elements";
                }
            },error : function(error){
                throw "should search for elements"
            }
        });
    });

    it("should sort the results in ascending order",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.orderByAsc('age');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for elements in ascending order";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should sort elements in descending order",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.orderByDesc('age');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for elements in ascending order";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should give elements in which a particular column exists",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.exists('name');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for elements with a particular column";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should search for records which do not have a certain column",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.doesNotExist('expire');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should give records which do not have a specified column";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should give records within a certain range",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.greaterThan('age',19);
        cs.lessThan('age',50);
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should give elements within a certain range";
                }
            },error : function(error){
               throw "should search for elements";
            }
        });
    });

    it("should unIndex the CloudObject",function(done){

        this.timeout(15000);

        var obj = new CB.CloudObject('Student');
        obj.set('age',777);
        obj.set('isSearchable',true);
        obj.save().then(function(list){
            console.log(list);
            list.set('isSearchable',false);
            list.save().then(function(list){
                var searchObj = new CB.CloudSearch('Student');
                searchObj.equalTo('id',obj.get('id'));
                searchObj.search().then(function(list){
                    console.log('here');
                    if(list.length === 0){
                        done();
                    }else{
                        throw "Unable to UnIndex the CloudObject";
                    }
                },function(){
                    console.log(err);
                });
            },function(err){
                console.log(err);
            });
        },function(err){
            console.log(err);
        });
    });

    it("should reIndex the unIndexed CloudObject",function(done){

        this.timeout(50000);

        var obj = new CB.CloudObject('Student');
        obj.set('age',777);
        obj.set('isSearchable',true);
        obj.save().then(function(list){
            console.log(list);
            list.set('isSearchable',false);
            list.save().then(function(list){
                console.log(list);
                list.set('isSearchable',true);
                list.save().then(function(list){
                    var searchObj = new CB.CloudSearch('Student');
                    searchObj.equalTo('id',obj.get('id'));
                    searchObj.search().then(function(list){
                        console.log('here');
                        if(list.length > 0){
                            done();
                        }else{
                            throw "Unable to UnIndex the CloudObject";
                        }
                    },function(){
                        console.log(err);
                    });
                    console.log(list)
                }, function (err) {
                    console.log(err);
                })
            },function(err){
                console.log(err);
            });
        },function(err){
            console.log(err);
        });
    });
});
describe("CloudUser", function () {
    var username = util.makeString();
    var passwd = "abcd";
   it("Should create new user", function (done) {

        this.timeout(100000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.set('email',util.makeEmail());
        obj.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    it('should logout the user',function (done){
        this.timeout(10000);
        CB.CloudUser.current.logOut().then(function(){
            done();
        },function(){
            throw "err";
        });
    });
   it("Should login user", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            if(list.get("username") === username)
                done();
        }, function () {
            throw "user login error";
        });

    });

    var rolename = util.makeString();
    var role = new CB.CloudRole(rolename);
    role.set('name',rolename);
    it("Should create a role ", function (done) {

        this.timeout(10000);

        //var role = new CB.CloudRole('admin');
        role.save().then(function(list){
                done();
            },function(){
                throw "role create error";
            });

    });


   it("Should assign role to user", function (done) {

        this.timeout(100000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role.save().then(function(role){
                list.addToRole(role).then(function(list){
                    done();
                },function(){
                    throw "user role set error";
                });
            }, function () {
                throw "user role error";
            });
        },function(){
            throw "role create error";
        })

    });

    it("Should remove role assigned role to user", function (done) {

        this.timeout(1000000);

        var obj = new CB.CloudUser();
        rolename = util.makeString();
        var role = new CB.CloudRole(rolename);
        role.set('name',rolename);
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role.save().then(function(role){
                list.addToRole(role).then(function(list){
                    CB.CloudUser.current.removeFromRole(role).then(function(){
                        done();
                    },function(){
                        throw "Should remove the role";
                    });
                },function(){
                    throw "user role set error";
                });
            }, function () {
                throw "user role assign error";
            });
        },function(){
            throw "user login error";
        });

    });


});
describe("ACL", function () {

    it("Should set the public write access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicWriteAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.deny.user.length === 0) {
                obj.set('age',15);
                obj.save().then(function(){
                    throw "Should not save object with no right access";
                },function(){
                    done();
                });
            }
            else
                throw "public write access set error"
        }, function () {
            throw "public write access save error";
        });
    });

    it("Should set the public read access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.deny.user.length === 0)
                done();
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });
    var username = util.makeString();
    var passwd = "abcd";
    var userObj = new CB.CloudUser();

    it("Should create new user", function (done) {

        this.timeout(10000);

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    it("Should set the user read access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setUserReadAccess(userObj.get('id'),true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.indexOf(userObj.get('id')) >= 0)
                done();
            else
                throw "user read access set error"
        }, function () {
            throw "user read access save error";
        });

    });

    it("Should allow users of role to write", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setRoleWriteAccess(userObj.get('id'),true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.allow.role.indexOf(userObj.get('id'))>=0)
                done();
            else
                throw "user role write access set error"
        }, function () {
            throw "user role write access save error";
        });

    });

    it("Should allow users of role to read", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL.setRoleReadAccess(userObj.get('id'),true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.role.indexOf(userObj.get('id'))>=0)
                done();
            else
                throw "user role read access set error"
        }, function () {
            throw "user role read access save error";
        });

    });
});


describe("Query_ACL", function () {

    var obj = new CB.CloudObject('student4');
    obj.isSearchable = true;
    obj.set('age',55);

    var username = util.makeString();
    var passwd = "abcd";
    var user = new CB.CloudUser();
    it("Should create new user", function (done) {

        this.timeout(10000);
        user.set('username', username);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    it("Should set the public read access", function (done) {

        this.timeout(10000);

        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.length === 0) {
                var cq = new CB.CloudQuery('student4');
                cq. equalTo('age',55);
                cq.find().then(function(list){
                    if(list.length>0)
                    {
                        throw "should not return items";
                    }
                    else
                        done();
                },function(){
                    throw "should perform the query";
                });
            }
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });

    var obj1 = new CB.CloudObject('student4');
    obj1.isSearchable = true;
    obj1.set('age',60);
    it("Should search object with user read access", function (done) {

        this.timeout(10000);
        obj1.ACL = new CB.ACL();
        obj1.ACL.setUserReadAccess(user.document._id,false);
        obj1.save().then(function(list) {
            acl=list.get('ACL');
           // if(acl.read.indexOf(user.document._id) >= 0) {
                var user = new CB.CloudUser();
                user.set('username', username);
                user.set('password', passwd);
                user.logIn().then(function(){
                    var cq = new CB.CloudQuery('student4');
                    cq.equalTo('age',60);
                    cq.find().then(function(){
                        done();
                    },function(){
                        throw "should retrieve object with user read access";
                    });
                },function(){
                    throw "should login";
                });
        }, function () {
            throw "user read access save error";
        });

    });



});


    describe("Search_ACL", function () {

    var obj = new CB.CloudObject('student4');
    obj.isSearchable = true;
    obj.set('age',150);

        var username = util.makeString();
        var passwd = "abcd";
        var user = new CB.CloudUser();
        it("Should create new user", function (done) {

            this.timeout(10000);
            user.set('username', username);
            user.set('password',passwd);
            user.set('email',util.makeEmail());
            user.signUp().then(function(list) {
                if(list.get('username') === username)
                    done();
                else
                    throw "create user error"
            }, function () {
                throw "user create error";
            });

        });
   /*it("Should set the public read access", function (done) {

        this.timeout(10000);

        obj.ACL = new CB.ACL();
       CB.CloudUser.current.logOut();
        obj.ACL.setUserReadAccess(CB.CloudUser.current.id,true);
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.indexOf('all') === -1) {
             var cs = new CB.CloudSearch('student4');
                cs.searchOn('age',150);
                cs.search().then(function(list){
                    if(list.length>0)
                    {
                        for(var i=0;i<list.length;i++)
                            if(list[i].get('age'))
                                throw "should not return items";
                    }
                    else
                        done();
                },function(){
                    done();
                });
            }
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });*/

   it("Should search object with user read access", function (done) {

        this.timeout(10000);
       var user = new CB.CloudUser();
       user.set('username', username);
       user.set('password', passwd);
       user.logIn().then(function(){
            obj.ACL = new CB.ACL();
            obj.save().then(function(list) {
                acl=list.get('ACL');
                    var cs = new CB.CloudSearch('student4');
                    cs.searchOn('age',15);
                    cs.search().then(function(){
                        done();
                    },function(){
                        throw "should retrieve object with user read access";
                    });
            }, function () {
                throw "user read access save error";
            });
       },function(){
           throw "should login";
       });

    });


    /*it("Should allow users of role to read", function (done) {

        this.timeout(10000);

        obj.ACL.setRoleWriteAccess("553e194ac0cc01201658142e",true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.indexOf("553e194ac0cc01201658142e")>=0) {
                var user = new CB.CloudUser();
                user.set('username', 'Xjy9g');
                user.set('password', 'abcd');
                user.logIn().then(function(){
                    var cs = new CB.CloudSearch('student4');
                    cs.searchOn('age',15);
                    cs.search().then(function(){
                        done();
                    },function(){
                        throw "should search object with user role read access";
                    });
                },function(){
                    throw "should login";
                });
            }
            else
                throw "user role read access set error"
        }, function () {
            throw "user role read access save error";
        });

    });*/
});

