describe("Cloud GeoPoint Test", function() {
  
	it("should save a latitude and longitude when passing data are number type", function(done) {
		var obj = new CB.CloudObject('Sample');
     	obj.set("name", "ranjeet");
     	var loc = new CB.CloudGeoPoint(17.4,78.3);
		obj.set("sameRelation", loc);
		var loc1 = new CB.CloudGeoPoint(17.4372,78.3444);
		var loc2 = new CB.CloudGeoPoint(17.3959,78.4312);
		console.log(loc1.distanceInKMs(loc2) + " Kms");
		console.log(loc1.distanceInMiles(loc2) + " miles");
		console.log(loc1.distanceInRadians(loc2) + " radians");
		obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
     	
     	/*var jsonString = '{"_tableName":"Sample","ACL":{"write":["all"],"read":["all"]},"_type":"custom","name":"ranjeet","sameRelation":{"latitude":"17.4","longitude":"78.3"}, "createdAt":"2015-05-06T06:10:35.507Z","_expires":null,"updatedAt":"2015-05-06T06:10:35.507Z","_id":"5549b05b8e5dc6930dbde2a2"}';
		
		console.log(loc1.deserialize(JSON.parse(jsonString), obj1));*/
	});
	
	it("should save a latitude and longitude when passing a valid numberic data as string type", function(done) {
		var obj = new CB.CloudObject('Sample');
     	obj.set("name", "ranjeet");
     	var loc = new CB.CloudGeoPoint("17.4","78.3");
		obj.set("sameRelation", loc);
		var loc1 = new CB.CloudGeoPoint("17.4372","78.3444");
		var loc2 = new CB.CloudGeoPoint("17.3959","78.4312");
		console.log(loc1.distanceInKMs(loc2) + " Kms");
		console.log(loc1.distanceInMiles(loc2) + " miles");
		console.log(loc1.distanceInRadians(loc2) + " radians");
		obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
	});
	
	it("should not save a latitude and longitude when passing a invalid numberic data as string type", function(done) {
		var obj = new CB.CloudObject('Sample');
     	obj.set("name", "ranjeet");
     	var loc = new CB.CloudGeoPoint("17.4","78.3");
		obj.set("sameRelation", loc);
		var loc1 = new CB.CloudGeoPoint("17.4372","78.3444");
		var loc2 = new CB.CloudGeoPoint("17 3959","78.4312");
		console.log(loc1.distanceInKMs(loc2) + " Kms");
		console.log(loc1.distanceInMiles(loc2) + " miles");
		console.log(loc1.distanceInRadians(loc2) + " radians");
		obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
	});
});
