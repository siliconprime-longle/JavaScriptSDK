/*CloudBoost Push Notifications*/

CB.CloudPush={};

CB.CloudPush.send = function(data,query,callback) {
	
	var tableName="Device";	

	if (!CB.appId) {
        throw "CB.appId is null.";
    }    
    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    if(!data){
    	throw "data object is null.";
    }
    if(data && (!data.message)){
    	throw "message is not set.";
    }

	//Query Set
	if(query && Object.prototype.toString.call(query)=="[object Object]" && typeof query.success !== 'function'){
		var pushQuery=query;
	}
	//Channels List
	if(query && Object.prototype.toString.call(query)=="[object Array]" && typeof query.success !== 'function'){
		var pushQuery = new CB.CloudQuery(tableName);
		pushQuery.containedIn('channels', query);		
	}
	//Single Channel	
	if(query && Object.prototype.toString.call(query)=="[object String]" && typeof query.success !== 'function'){
		var pushQuery = new CB.CloudQuery(tableName);
		pushQuery.containedIn('channels', [query]);		
	}
    //when query param is callback
	if(query && Object.prototype.toString.call(query)=="[object Object]" && typeof query.success === 'function'){
		callback=query;
        var pushQuery = new CB.CloudQuery(tableName);
    } 
    //No query param
    if(!query){
        var pushQuery = new CB.CloudQuery(tableName);
    }
	
    var params=JSON.stringify({
        query    : pushQuery.query,        
        sort     : pushQuery.sort,
        limit    : pushQuery.limit,
        skip     : pushQuery.skip,
        key      : CB.appKey,        
        data     : data,
    });  

    url = CB.apiUrl + "/push/" + CB.appId + '/send';

    CB._request('POST',url,params).then(function(response){
        var object = JSON.parse(response);
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
        }
    },function(err){

        try{
            err = JSON.parse(err);
        }catch(e){
        }
        
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



CB.CloudPush.enableWebNotifications = function(callback) {

    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    //Check document
    if(typeof(document) !== 'undefined'){

        CB._requestBrowserNotifications().then(function(response){

            if('serviceWorker' in navigator) {
                return navigator.serviceWorker.register('serviceWorker.js',{scope: './'});
            }else { 
                var noServerDef = new CB.Promise(); 
                noServerDef.reject('Service workers aren\'t supported in this browser.');  
                return noServerDef;
            }

        }).then(function(registration){

            if (!(registration.showNotification)) { 
                var noServerDef = new CB.Promise(); 
                noServerDef.reject('Notifications aren\'t supported on service workers.');  
                return noServerDef;                   
            }else{
                return CB._subscribe();
            }

        }).then(function(subscription){

            var obj = new CB.CloudObject('Device');
            obj.set('deviceOS',"web");
            obj.set('deviceToken',subscription.endpoint);            
            obj.save({
                success : function(obj){
                    if (callback) {
                        callback.success();
                    } else {
                        def.resolve();
                    }
                },error : function(error){
                    if(callback){
                        callback.error(error);
                    }else {
                        def.reject(error);
                    }
                }
            });

        },function(error){
            if(callback){
                callback.error(error);
            }else {
                def.reject(error);
            }
        });

    }else{
        if(callback){
            callback.error(error);
        }else {
            def.reject(error);
        }
    } 

    if (!callback) {
        return def;
    }   
};


CB.CloudPush.disableWebNotifications = function(callback) {

    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    //Check document
    if(typeof(document) !== 'undefined'){

        CB._getSubscription().then(function(subscription){   

            //No subscription 
            if(!subscription){
                if (callback) {
                    callback.success();
                } else {
                    def.resolve();
                } 
            }

            if(subscription){
                // We have a subcription, so call unsubscribe on it
                subscription.unsubscribe().then(function(successful) {
                    if (callback) {
                        callback.success();
                    } else {
                        def.resolve();
                    }
                }).catch(function(e) {    

                    console.log('Unsubscription error: ', e);
                    if (callback) {
                        callback.success();
                    } else {
                        def.resolve();
                    }                  
                });

                //Remove Device Objects
                var query = new CB.CloudQuery("Device");
                query.equalTo('deviceOS','web');
                query.equalTo('deviceToken',subscription.endpoint);
                query.find({
                  success: function(list) {
                    if(list && list.length>0){
                        for(var i=0;i<list.length;++i){
                            list[i].delete();
                        }
                    }
                  },
                  error: function(error) {
                  }
                });
                //Remove Device Objects
            }

        },function(error){
            if(callback){
                callback.error(error);
            }else {
                def.reject(error);
            }
        });

    }else{
        if(callback){
            callback.error(error);
        }else {
            def.reject(error);
        }
    } 

    if (!callback) {
        return def;
    }   
};


CB._subscribe = function (){

    var def = new CB.Promise();

    // Check if push messaging is supported  
    if (!('PushManager' in window)) {  
        return def.reject('Push messaging isn\'t supported.');         
    }

    navigator.serviceWorker.ready.then(function(reg) {

        reg.pushManager.getSubscription().then(function(subscription) { 

            if (!subscription) {  
                reg.pushManager.subscribe({userVisibleOnly: true}).then(function(subscription) {                
                    def.resolve(subscription);
                }).catch(function(err) {                                
                    def.reject(err);               
                });
            }else{
                def.resolve(subscription);
            }     
      
        }).catch(function(err) {  
            def.reject(err);  
        });   

    },function(error){
        def.reject(error);
    });

    return def;
};


CB._getSubscription = function(){

    var def = new CB.Promise();
    
    navigator.serviceWorker.ready.then(function(reg) {

        reg.pushManager.getSubscription().then(function(subscription) { 

            if (!subscription) {  
                def.resolve(null);
            }else{
                def.resolve(subscription);
            }     
      
        }).catch(function(err) {  
            def.reject(err);  
        });   

    },function(error){
        def.reject(error);
    });

    return def;
};
 

CB._requestBrowserNotifications = function() {

    var def = new CB.Promise();

    if (!("Notification" in window)) {        
        def.reject("This browser does not support system notifications");
    }else if (Notification.permission === "granted") {  

        def.resolve("Permission granted");

    }else if (Notification.permission !== 'denied') { 

        Notification.requestPermission(function (permission) {   

          if(permission === "granted") {  
            def.resolve("Permission granted");      
          }

          if(permission === "denied"){
            def.reject("Permission denied");
          }

        });
    }

    return def;
};