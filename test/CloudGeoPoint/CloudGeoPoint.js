describe("Cloud GeoPoint Test", function() {
  	
	it("should save a latitude and longitude when passing data are number type", function(done) {
		var obj = new CB.CloudObject('Sample');
     	obj.set("name", "ravi");
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
	
	it("should save a latitude and longitude when passing a valid numberic data as string type", function(done) {
		var obj = new CB.CloudObject('Sample');
     	obj.set("name", "amit");
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
	
	it("should get data from server for near function", function(done) {
     	var loc = new CB.CloudGeoPoint("17.4","78.3");
        var query = new CB.CloudQuery('Sample');
		query.near("location", loc, 10);
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
	});
	
	it("should get list of CloudGeoPoint Object from server Polygon type geoWithin", function(done) {
     	var loc1 = new CB.CloudGeoPoint(18.4,78.9);
     	var loc2 = new CB.CloudGeoPoint(17.4,78.4);
     	var loc3 = new CB.CloudGeoPoint(17.7,80.4);
        var query = new CB.CloudQuery('Sample');
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
     	var loc1 = new CB.CloudGeoPoint(18.4,78.9);
     	var loc2 = new CB.CloudGeoPoint(17.4,78.4);
     	var loc3 = new CB.CloudGeoPoint(17.7,80.4);
        var query = new CB.CloudQuery('Sample');
        query.equalTo('name', 'ranjeet');
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
     	var loc = new CB.CloudGeoPoint(17.3, 78.3);
        var query = new CB.CloudQuery('Sample');
		query.geoWithin("location", loc, 10);
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
     	var loc = new CB.CloudGeoPoint(17.3, 78.3);
        var query = new CB.CloudQuery('Sample');
		query.geoWithin("location", loc, 10);
		query.equalTo('name', 'ranjeet');
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
