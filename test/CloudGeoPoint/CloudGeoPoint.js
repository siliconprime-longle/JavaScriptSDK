describe("Cloud GeoPoint Test", function() {
  
	it("should save a latitude and longitude when passing data are number type", function(done) {
		var obj = new CB.CloudObject('Sample');
     	obj.set("name", "ranjeet");
     	var loc = new CB.CloudGeoPoint(17.4,78.3);
		obj.set("location", loc);
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
	});
	
	it("should save a latitude and longitude when passing a valid numberic data as string type", function(done) {
		var obj = new CB.CloudObject('Sample');
     	obj.set("name", "ranjeet");
     	var loc = new CB.CloudGeoPoint("17.4","78.3");
		obj.set("location", loc);
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
});
