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
	this.document.latitude = Number(latitude);
	this.document.longitude = Number(longitude);
	
};

Object.defineProperty(CB.CloudGeoPoint.prototype, 'latitude', {
    get: function() {
        return this.document.latitude;
    },
    set: function(latitude) {
        this.document.latitude = latitude;
    }
});

Object.defineProperty(CB.CloudGeoPoint.prototype, 'longitude', {
    get: function() {
        return this.document.longitude;
    },
    set: function(longitude) {
        this.document.longitude = longitude;
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

	var dLat =(thisObj.document.latitude - point.document.latitude).toRad();
	var dLon = (thisObj.document.longitude - point.document.longitude).toRad();
	var lat1 = (point.document.latitude).toRad();
	var lat2 = (thisObj.document.latitude).toRad();
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	return c;
	
}

if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

