/*CloudBoost Push Notifications*/

CB.Push={};

CB.Push.send = function(data,query,callback) {
	
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
        var object = CB.fromJSON(JSON.parse(response));
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