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