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
    this.document.coordinates = [Number(longitude), Number(latitude)];
};

Object.defineProperty(CB.CloudGeoPoint.prototype, 'latitude', {
    get: function() {
        return this.document.coordinates[1];
    },
    set: function(latitude) {
        this.document.coordinates[1] = latitude;
    }
});

Object.defineProperty(CB.CloudGeoPoint.prototype, 'longitude', {
    get: function() {
        return this.document.coordinates[0];
    },
    set: function(longitude) {
        this.document.coordinates[0] = longitude;
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