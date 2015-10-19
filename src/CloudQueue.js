/*
CloudQueue
 */

CB.CloudQueue = function(queueName,queueType){
    this.document = {};
    this.document.ACL = new CB.ACL(); //ACL(s) of the document
    this.document._type = 'queue';
    this.document.expires = null;  
    this.document.retry = null;  
    this.document.subscribers = [];
    if(queueType && queueType !== "push" && queueType !== "pull"){
        throw "Type can be push or pull";
    }
    if(queueType){
        this.document.queueType = queueType;
    }else{
        this.document.queueType = "pull";
    }
};

Object.defineProperty(CB.CloudQueue.prototype, 'retry', {
    get: function() {
        return this.document.retry;
    },
    set: function(retry) {

        if(this.queueType !== "push"){
            throw "Queue Type should be push to set this property";
        }

        this.document.retry = retry;
        CB._modified(this,'retry');
    }
});

Object.defineProperty(CB.CloudQueue.prototype, 'subscribers', {
    get: function() {
        return this.document.subscribers;
    },
    set: function(subscribers) {

        if(this.queueType !== "push"){
            throw "Queue Type should be push to set this property";
        }

        this.document.subscribers = subscribers;
        CB._modified(this,'subscribers');
    }
});

Object.defineProperty(CB.CloudQueue.prototype, 'queueType', {
    get: function() {
        return this.document.queueType;
    },
    set: function(queueType) {
        this.document.queueType = queueType;
        CB._modified(this,'queueType');
    }
});

Object.defineProperty(CB.CloudQueue.prototype, 'ACL', {
    get: function() {
        return this.document.ACL;
    },
    set: function(ACL) {
        this.document.ACL = ACL;
        CB._modified(this,'ACL');
    }
});

Object.defineProperty(CB.CloudQueue.prototype, 'id', {
    get: function() {
        return this.document._id;
    }
});

Object.defineProperty(CB.CloudQueue.prototype, 'createdAt', {
    get: function() {
        return this.document.createdAt;
    },
    set: function(createdAt) {
        this.document.createdAt = createdAt;
        CB._modified(this,'createdAt');
    }
});

Object.defineProperty(CB.CloudQueue.prototype, 'updatedAt', {
    get: function() {
        return this.document.updatedAt;
    },
    set: function(updatedAt) {
        this.document.updatedAt = updatedAt;
        CB._modified(this,'updatedAt');
    }
});


Object.defineProperty(CB.CloudQueue.prototype, 'expires', {
    get: function() {
        return this.document.expires;
    },
    set: function(expires) {
        this.document.expires = expires;
        CB._modified(this,'expires');
    }
});

CB.CloudQueue.prototype.push = function(queueMessage, callback) {

    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

    if(!queueMessage instanceof CB.QueueMessage){
        var queueMessage = new CB.QueueMessage(queueMessage);
        this.document.messages = [queueMessage];
    }

    //POST TO SERVER. 

    var thisObj = this;

    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({
        document: CB.toJSON(thisObj),
        key: CB.appKey
    });

    var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName+'/message';

    CB._request('PUT',url,params).then(function(response){
        thisObj = CB.fromJSON(JSON.parse(response),thisObj);
        if (callback) {
            callback.success(thisObj.messages[0]);
        } else {
            def.resolve(thisObj.messages[0]);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
 
};


CB.CloudQueue.prototype.pull = function(count) {

    var def;
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

    if(!count)
        count=1;
    //POST TO SERVER. 

    var thisObj = this;

    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({
        count: count,
        key: CB.appKey
    });

    var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName+'/message';

    CB._request('GET',url,params).then(function(response){
        
        if (callback) {
            callback.success(CB.fromJSON(JSON.parse(response)));
        } else {
            def.resolve(CB.fromJSON(JSON.parse(response)));
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
};

CB.CloudQueue.prototype.getMessage = function(id) {
    var def;
    
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({       
        key: CB.appKey
    });

    var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName+'/message/'+id;

    CB._request('GET',url,params).then(function(response){
        
        if (callback) {
            callback.success(CB.fromJSON(JSON.parse(response)));
        } else {
            def.resolve(CB.fromJSON(JSON.parse(response)));
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
};

CB.CloudQueue.prototype.addSubscriber = function(url) {
    var def;
    
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }
    
    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({       
        key: CB.appKey,
        subscriber : url
    });

   var thisObj = this;

   var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName+'/subscriber/';

   CB._request('POST',url,params).then(function(response){
        thisObj = CB.fromJSON(JSON.parse(response),thisObj);
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
};

CB.CloudQueue.prototype.removeSubscriber = function(url) {

    var def;
    
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }
    
    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({       
        key: CB.appKey,
        subscriber : url
    });

   var thisObj = this;

   var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName+'/subscriber/';

   CB._request('DELETE',url,params).then(function(response){
        thisObj = CB.fromJSON(JSON.parse(response),thisObj);
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

};

CB.CloudQueue.prototype.peek = function(count) {

    var def;
    
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }

    if(!count)
        count = 1;
    
    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({       
        key: CB.appKey,
        count : count
    });

   var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName+'/peek/';

   CB._request('GET',url,params).then(function(response){
        if (callback) {
            callback.success(CB.fromJSON(JSON.parse(response)));
        } else {
            def.resolve(CB.fromJSON(JSON.parse(response)));
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

};

CB.CloudQueue.prototype.delete = function() {
    var def;
    
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }
    
    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({       
        key: CB.appKey,
        document : this.document
    });

   var thisObj = this;

   var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName;

   CB._request('DELETE',url,params).then(function(response){
        thisObj = CB.fromJSON(JSON.parse(response),thisObj);
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
};

CB.CloudQueue.prototype.clear = function() {
    var def;
    
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }
    
    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({       
        key: CB.appKey,
        document : this.document
    });

   var thisObj = this;

   var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName+"/clear";

   CB._request('DELETE',url,params).then(function(response){
        thisObj = CB.fromJSON(JSON.parse(response),thisObj);
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
};

CB.CloudQueue.prototype.refreshMessageTimeout = function(id,timeout) {
    var def;
    
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }
    
    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({       
        key: CB.appKey,
        timeout : timeout
    });

   var thisObj = this;

   var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName+"/refresh-message-timeout/"+id;

   CB._request('PUT',url,params).then(function(response){
        if (callback) {
            callback.success(CB.fromJSON(JSON.parse(response)));
        } else {
            def.resolve(CB.fromJSON(JSON.parse(response)));
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
};

CB.CloudQueue.prototype.deleteMessage = function(id) {
        var def;
    
    CB._validate();

    if (!callback) {
        def = new CB.Promise();
    }
    
    var xmlhttp = CB._loadXml();

    var params=JSON.stringify({       
        key: CB.appKey
    });

   var thisObj = this;

   var url = CB.apiUrl + "/queue/" + CB.appId + '/'+thisObj.document._queueName+"/message/"+id;

   CB._request('DELETE',url,params).then(function(response){
        if (callback) {
            callback.success(CB.fromJSON(JSON.parse(response)));
        } else {
            def.resolve(CB.fromJSON(JSON.parse(response)));
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
};

CB.CloudQueue.prototype.update = function() {

};

CB.CloudQueue.getQueues = function(){

};

CB.CloudQueue.getQueue = function(queueName){

};

CB.CloudQueue.deleteQueue = function(queueName){

};


CB.QueueMessage = function(data) { 
    
    this.document = {};
    this.document.ACL = new CB.ACL(); //ACL(s) of the document
    this.document._type = 'queue-message';
    this.document.expires = null;
    this.document.timeout = 3600;
    this.document.delay = null;
    this.document.message = data;

    if(!id){
        this.document._modifiedColumns = ['createdAt','updatedAt','ACL','expires','timeout','delay','message'];
        this.document._isModified = true;
    }
    else{
        this.document._modifiedColumns = [];
        this.document._isModified = false;
        this.document._id = id;
    }
};

Object.defineProperty(CB.QueueMessage.prototype, 'message', {
    get: function() {
        return this.document.message;
    },
    set: function(message) {
        this.document.message = message;
        CB._modified(this,'message');
    }
});

Object.defineProperty(CB.QueueMessage.prototype, 'ACL', {
    get: function() {
        return this.document.ACL;
    },
    set: function(ACL) {
        this.document.ACL = ACL;
        CB._modified(this,'ACL');
    }
});

Object.defineProperty(CB.QueueMessage.prototype, 'id', {
    get: function() {
        return this.document._id;
    }
});

Object.defineProperty(CB.QueueMessage.prototype, 'createdAt', {
    get: function() {
        return this.document.createdAt;
    },
    set: function(createdAt) {
        this.document.createdAt = createdAt;
        CB._modified(this,'createdAt');
    }
});

Object.defineProperty(CB.QueueMessage.prototype, 'updatedAt', {
    get: function() {
        return this.document.updatedAt;
    },
    set: function(updatedAt) {
        this.document.updatedAt = updatedAt;
        CB._modified(this,'updatedAt');
    }
});


Object.defineProperty(CB.QueueMessage.prototype, 'expires', {
    get: function() {
        return this.document.expires;
    },
    set: function(expires) {
        this.document.expires = expires;
        CB._modified(this,'expires');
    }
});

Object.defineProperty(CB.QueueMessage.prototype, 'timeout', {
    get: function() {
        return this.document.timeout;
    },
    set: function(timeout) {
        this.document.timeout = timeout;
        CB._modified(this,'timeout');
    }
});


Object.defineProperty(CB.QueueMessage.prototype, 'delay', {
    get: function() {
        return this.document.delay;
    },
    set: function(delay) {
        this.document.delay = delay;
        CB._modified(this,'delay');
    }
});

