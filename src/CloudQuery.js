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
    this.limit = 10; //default limit is 10
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

    if (columnName === 'id' ||  columnName === 'expires')
        columnName = '_' + columnName;

    if(data !== null){
        if( data.constructor === CB.CloudObject){
            columnName = columnName+'._id';
            data = data.get('id');
        }

        this.query[columnName] = data;
    }else{

        //This is for people who code : obj.equalTo('column', null);
        this.doesNotExists(columnName);
    }

    return this;
};

CB.CloudQuery.prototype.include = function (columnName, data) {
    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    this.query.$include.push(columnName);

    return this;
};

CB.CloudQuery.prototype.notEqualTo = function(columnName, data) {
    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if(data !== null){

        if(data.constructor === CB.CloudObject){
            columnName = columnName+'._id';
            data = data.get('id');
        }

        this.query[columnName] = {
            $ne: data
        };
    }else{
        //This is for people who code : obj.notEqualTo('column', null);
        this.exists(columnName); 
    }

    return this;
};
CB.CloudQuery.prototype.greaterThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$gt"] = data;

    return this;
};
CB.CloudQuery.prototype.greaterThanEqualTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$gte"] = data;

    return this;
};
CB.CloudQuery.prototype.lessThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;


    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$lt"] = data;

    return this;
};
CB.CloudQuery.prototype.lessThanEqualTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;


    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$lte"] = data;

    return this;
};
//Sorting
CB.CloudQuery.prototype.orderByAsc = function(columnName) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    this.sort[columnName] = 1;

    return this;
};
CB.CloudQuery.prototype.orderByDesc = function(columnName) {

    if (columnName === 'id' || columnName === 'expires')
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

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

   
    

    if (Object.prototype.toString.call(data) === '[object Object]' && !data instanceof CB.CloudObject) { //if object is passed as an argument
        throw 'Array or string expected as an argument';
    }

    
    if (Object.prototype.toString.call(data) === '[object Array]') { //if array is passed, then replace the whole

        for(var i=0; i<data.length; i++){
             if(data[i] instanceof CB.CloudObject){

                if(!data[i].id){
                    throw "CloudObject passed should be saved and should have an id before being passed to containedIn";
                }
                columnName = columnName+'._id';
                data[i] = data[i].id;

                
            }
        }

        if (!this.query[columnName]) {
                    this.query[columnName] = {};
        }

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


        if(data instanceof CB.CloudObject){

            if(!data.id){
                throw "CloudObject passed should be saved and should have an id before being passed to containedIn";
            }

            columnName = columnName+'._id';
            data = data.id;
        }

        if (!this.query[columnName]) {
                this.query[columnName] = {};
        }


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

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (Object.prototype.toString.call(data) === '[object Object]' && !data instanceof CB.CloudObject) { //if object is passed as an argument
        throw 'Array or string expected as an argument';
    }

    if (Object.prototype.toString.call(data) === '[object Array]') { //if array is passed, then replace the whole



        for(var i=0; i<data.length; i++){
             if(data[i] instanceof CB.CloudObject){
                if(!data[i].id){
                    throw "CloudObject passed should be saved and should have an id before being passed to containedIn";
                }
                columnName = columnName+'._id';
                data[i] = data[i].id;                
            }
        }

         if (!this.query[columnName]) {
            this.query[columnName] = {};
         }

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

        if(data instanceof CB.CloudObject){

            if(!data.id){
                throw "CloudObject passed should be saved and should have an id before being passed to containedIn";
            }

            columnName = columnName+'._id';
            data = data.id;
        }

        if (!this.query[columnName]) {
            this.query[columnName] = {};
        }


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
    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$exists"] = true;

    return this;
}

CB.CloudQuery.prototype.doesNotExists = function(columnName) {
    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$exists"] = false;

    return this;
}

CB.CloudQuery.prototype.containsAll = function(columnName, values) {
    if (columnName === 'id' || columnName === 'expires')
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
    if (columnName === 'id' || columnName === 'expires')
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
CB.CloudQuery.prototype.near = function(columnName, geoPoint, maxDistance, minDistance){
    if(!this.query[columnName]){
        this.query[columnName] = {};
        this.query[columnName]['$near'] = {
            '$geometry': { coordinates: geoPoint['document'].coordinates, type:'Point'},
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
        response = parseInt(response);
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
