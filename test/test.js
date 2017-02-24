var SECURE_KEY = "1227d1c4-1385-4d5f-ae73-23e99f74b006";

var URL = "http://localhost:4730";

   var util = {
     makeString : function(){
	    var text = "x";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return 'x'+text;
	},	

	makeEmail : function(){
	    return this.makeString()+'@sample.com';
	}

   };

   

	

var window = window || null;
var request = require('request');
var CB = require('../dist/cloudboost');
describe("Cloud App", function() {
    
    it("MongoDb,RedisDb & Elastic SearchDb Statuses..", function(done) {
        this.timeout(100000);
       
        var url = URL+'/status'; 
        var params = {};    
        params.url = URL;

        if(!window){
        	//Lets configure and request
			request({
			    url: url, //URL to hit
			    method: 'GET'			  
			}, function(error, response, body){

			    if(error || response.statusCode === 500 || response.statusCode === 400 || body === 'Error'){  
		          	done("Something went wrong..");
		        }else {  
		        	done();	          
			    }
			});

        } else{
        	$.ajax({ 
			    // The URL for the request
			    url: url,			
			    // Whether this is a POST or GET request
			    type: "GET",			   
			    // Code to run if the request succeeds;
			    // the response is passed to the function
			    success: function( resp ) {
			       done();
			    },			 
			    // Code to run if the request fails; the raw request and
			    // status codes are passed to the function
			    error: function( xhr, status, errorThrown ) {
			        done("Something went wrong..");
			    },
			 
			});
        }

    });

    it("Change the Server URL", function(done) {
        this.timeout(100000);
        var appId = util.makeString();
        var url = URL+'/server/url';
        var params = {};
        params.secureKey = SECURE_KEY;
        params.url = URL;

        if(!window){
        	//Lets configure and request
			request({
			    url: url, //URL to hit
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/json'
			    },
			    json: params //Set the body as a string
			}, function(error, response, body){
			    if(error) {
			        done(error);
			    } else {
			       done();
			    }
			});
        } else{
        	$.ajax({
 
			    // The URL for the request
			    url: url,
			    // The data to send (will be converted to a query string)
			    data: params,
			    // Whether this is a POST or GET request
			    type: "POST",
			    // The type of data we expect back
			    dataType : "json",
			    // Code to run if the request succeeds;
			    // the response is passed to the function
			    success: function( json ) {
			       done();
			    },
			 
			    // Code to run if the request fails; the raw request and
			    // status codes are passed to the function
			    error: function( xhr, status, errorThrown ) {
			        done("Error thrown.");
			    },
			 
			});
        }

    });


    it("should create the app and init the CloudApp.", function(done) {
        this.timeout(100000);
        var appId = util.makeString();
        var url = URL+'/app/'+appId;
        var params = {};
        params.secureKey = SECURE_KEY;
        if(!window){        	
        	//Lets configure and request
			request({
			    url: url, //URL to hit
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/json'
			    },
			    json: params //Set the body as a string
			}, function(error, response, json){
			    if(error) {
			        done(error);
			    } 
				else {
			       CB.CloudApp.init(URL, json.appId, json.keys.js);
			       CB.masterKey = json.keys.master;
			       CB.jsKey = json.keys.js;
			       done();
			    }
			});
       	} else{
	       $.ajax({
	 
			    // The URL for the request
			    url: url,
			 
			    // The data to send (will be converted to a query string)
			    data: params,
			 
			    // Whether this is a POST or GET request
			    type: "POST",
			 
			    // The type of data we expect back
			    dataType : "json",
			 
			    // Code to run if the request succeeds;
			    // the response is passed to the function
			    success: function( json ) {
			       CB.CloudApp.init(URL, json.appId, json.keys.js);
			       CB.masterKey = json.keys.master;
			       CB.jsKey = json.keys.js;
			       done();
			    },
			 
			    // Code to run if the request fails; the raw request and
			    // status codes are passed to the function
			    error: function( xhr, status, errorThrown ) {
			        done("Error thrown.");
			    },
			 
			});
		}

	 });


    it("should add a sample setting to an app.", function(done) {
        this.timeout(100000);
        var url = URL+'/settings/'+CB.appId+"/settings";
        var params = {};
        params.key = CB.masterKey;
        params.settings = {
        	"keykey" : "valuevalue"
        };
          if(!window){
        	//Lets configure and request
			request({
			    url: url, //URL to hit
			    method: 'PUT',
			    headers: {
			        'Content-Type': 'application/json'
			    },
			    json: params //Set the body as a string
			}, function(error, response, json){
			    if(error) {
			        done(error);
			    } else {
			      done();
			    }
			});
        }else{
	       $.ajax({
	 
			    // The URL for the request
			    url: url,
			    // The data to send (will be converted to a query string)
			    data: params,
			    // Whether this is a POST or GET request
			    type: "PUT",
			    // The type of data we expect back
			    dataType : "json",
			    // Code to run if the request succeeds;
			    // the response is passed to the function
			    success: function( json ) {			    			    	
			       if(json.category === "settings"){
			       	 done();
			       }else{
			       	 done("Wrong json.");
			       }
			    },
			    // Code to run if the request fails; the raw request and
			    // status codes are passed to the function
			    error: function( xhr, status, errorThrown ) {
			        done("Error thrown.");
			    },
			 
			});
		}
	 });


	it("should get sample setting to an app.", function(done) {
        this.timeout(100000);
        var url = URL+'/settings/'+CB.appId;
        var params = {};
        params.key = CB.masterKey;
        
        if(!window){
        	//Lets configure and request
			request({
			    url: url, //URL to hit
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/json'
			    },
			    json: params //Set the body as a string
			}, function(error, response, json){
			    if(error) {
			      done(error);
			    } else {
			      done();
			    }
			});
        }else{
	       $.ajax({
	 
			    // The URL for the request
			    url: url,
			 
			    // The data to send (will be converted to a query string)
			    data: params,
			 
			    // Whether this is a POST or GET request
			    type: "POST",
			 
			    // The type of data we expect back
			    dataType : "json",
			 
			    // Code to run if the request succeeds;
			    // the response is passed to the function
			    success: function( json ) {
			       if(json[0]._id){
			       	done();
			       }else{
			       	done("Success but Id not defined.");
			       }
			    },
			 
			    // Code to run if the request fails; the raw request and
			    // status codes are passed to the function
			    error: function( xhr, status, errorThrown ) {
			        done("Error thrown.");
			    }
			 
			});
		}
	});

	
});

describe("Should Create All Test Tables", function(done) {

    before(function() {
        this.timeout(10000);
        CB.appKey = CB.masterKey;
    });

    it("Should create a table", function(done) {
        this.timeout(50000);
        var Age = new CB.Column('Age');
        Age.dataType = 'Number';
        var Name = new CB.Column('Name');
        Name.dataType = 'Text';
        obj = new CB.CloudTable('Employee');
        obj.addColumn(Age);
        obj.addColumn(Name);
        var dob = new CB.Column('dob');
        dob.dataType = 'DateTime';
        obj.addColumn(dob);
        var password = new CB.Column('password');
        password.dataType = 'EncryptedText';
        obj.addColumn(password);
        obj.save().then(function(res) {
            //console.log(res);
            done();
        }, function(err) {
            throw "Unable to Create Table";
        });
    });

    it("should create an empty table", function(done) {

        this.timeout(50000);

        var obj = new CB.CloudTable('Empty');

        obj.save().then(function(res) {
            if (res.id) {
                done();
            } else
                done("Table saved but didnot return the id.");
            }
        , function(err) {
            throw "Unable to Create Table";
        });
    });

    it("should create a table with two underscore columns", function(done) {

        this.timeout(50000);

        obj = new CB.CloudTable('UnderScoreTable_a');

        var Age = new CB.Column('Age_a');
        Age.dataType = 'Text';

        obj.addColumn(Age);

        obj.save().then(function(obj) {

            var Age = new CB.Column('Age_b');
            Age.dataType = 'Text';

            obj.addColumn(Age);
            obj.save().then(function(obj) {
                done();
            }, function(err) {
                done("Cannot save two underscore columns.");
            });

        }, function(err) {
            throw "Unable to Create Table";
        });
    });

    it("should create a table", function(done) {

        this.timeout(50000);

        var obj = new CB.CloudTable('Company');
        var Revenue = new CB.Column('Revenue');
        Revenue.dataType = 'Number';
        var Name = new CB.Column('Name');
        Name.dataType = 'Text';
        var File = new CB.Column('File');
        File.dataType = 'File';
        obj.addColumn(Revenue);
        obj.addColumn(Name);
        obj.addColumn(File);
        obj.save().then(function(res) {
            //console.log(res);
            done();
        }, function() {
            throw "Unable to Create Table";
        });
    });

    it("should create a table", function(done) {

        this.timeout(50000);

        var obj = new CB.CloudTable('Address');
        var City = new CB.Column('City');
        City.dataType = 'Text';
        var PinCode = new CB.Column('PinCode');
        PinCode.dataType = 'Number';
        obj.addColumn(City);
        obj.addColumn(PinCode);
        obj.save().then(function(res) {
            //console.log(res);
            done();
        }, function() {
            throw "Unable to Create Table";
        });
    });

    it("Should update the table schema", function(done) {

        this.timeout(50000);

        var obj = new CB.CloudTable('Employee');
        CB.CloudTable.get(obj).then(function(res) {
            var Company = new CB.Column('Company');
            Company.dataType = 'Relation';
            Company.relatedTo = 'Company';
            res.addColumn(Company);
            var Address = new CB.Column('Address');
            Address.dataType = 'Relation';
            Address.relatedTo = 'Address';
            res.addColumn(Address);
            res.save().then(function(res) {
                //console.log(res);
                done();
            }, function(err) {
                throw "Unable to Update schema of the table";
            })
        }, function() {
            throw "Unable to get table";
        });
    });

    it("Should update the table schema", function(done) {

        this.timeout(50000);

        var obj = new CB.CloudTable('Company');
        CB.CloudTable.get(obj).then(function(res) {
            var Employee = new CB.Column('Employee');
            Employee.dataType = 'List';
            Employee.relatedTo = 'Employee';
            res.addColumn(Employee);
            var Address = new CB.Column('Address');
            Address.dataType = 'Relation';
            Address.relatedTo = 'Address';
            res.addColumn(Address);
            res.save().then(function(res) {
                //console.log(res);
                done();
            }, function(err) {
                throw "Unable to Update schema of the table";
            })
        }, function() {
            throw "Unable to get table";
        });
    });

    it("should create table student4", function(done) {

        this.timeout(50000);
        var student = new CB.CloudTable('student4');
        var subject = new CB.Column('subject');
        subject.dataType = 'List';
        subject.relatedTo = 'Text';
        var age = new CB.Column('age');
        age.dataType = 'Number';
        student.addColumn(subject);
        student.addColumn(age);
        student.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Student";
        });
    });

    it("should create table Role", function(done) {

        this.timeout(50000);

        var role = new CB.CloudTable('Role');
        role.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Role";
        });

    });

    it("should create table user", function(done) {

        this.timeout(50000);

        var user = new CB.CloudTable('User');

        var newColumn = new CB.Column('newColumn');
        newColumn.dataType = 'Text';
        user.addColumn(newColumn);

        user.save().then(function(user) {
            var newColumn1 = new CB.Column('newColumn1');
            newColumn1.dataType = 'Text';
            user.addColumn(newColumn1);

            user.save().then(function(res) {
                done();
            }, function(error) {
                throw "Unable to create user";
            });
        }, function(error) {
            throw "Unable to create user";
        });
    });

    it("should create table device", function(done) {

        this.timeout(50000);

        var device = new CB.CloudTable('Device');

        var newColumn = new CB.Column('newColumn');
        newColumn.dataType = 'Text';
        device.addColumn(newColumn);

        device.save().then(function(device) {
            var newColumn1 = new CB.Column('newColumn1');
            newColumn1.dataType = 'Text';
            device.addColumn(newColumn1);

            device.save().then(function(res) {
                done();
            }, function(error) {
                throw "Unable to create device";
            });
        }, function(error) {
            throw "Unable to create device";
        });
    });

    it("should create table Custom", function(done) {

        this.timeout(60000);

        var custom = new CB.CloudTable('Custom');
        var newColumn = new CB.Column('newColumn');
        newColumn.dataType = 'Email';
        custom.addColumn(newColumn);
        var newColumn1 = new CB.Column('newColumn1');
        newColumn1.dataType = 'Text';
        custom.addColumn(newColumn1);
        var newColumn2 = new CB.Column('newColumn2');
        newColumn2.dataType = 'URL';
        custom.addColumn(newColumn2);
        var newColumn3 = new CB.Column('newColumn3');
        newColumn3.dataType = 'Number';
        custom.addColumn(newColumn3);
        var newColumn4 = new CB.Column('newColumn4');
        newColumn4.dataType = 'Boolean';
        custom.addColumn(newColumn4);
        var newColumn5 = new CB.Column('newColumn5');
        newColumn5.dataType = 'DateTime';
        custom.addColumn(newColumn5);
        var newColumn6 = new CB.Column('newColumn6');
        newColumn6.dataType = 'Object';
        var newColumn7 = new CB.Column('location');
        newColumn7.dataType = 'GeoPoint';
        custom.addColumn(newColumn7);
        custom.addColumn(newColumn6);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create user";
        });
    });

    it("should update custom table ", function(done) {

        this.timeout(60000);

        var custom = new CB.CloudTable('Custom');
        CB.CloudTable.get(custom).then(function(custom) {
            var newColumn7 = new CB.Column('newColumn7');
            newColumn7.dataType = 'List';
            newColumn7.relatedTo = 'Custom';
            custom.addColumn(newColumn7);
            custom.save().then(function(res) {
                done();
            }, function() {
                throw "Unable to create user";
            });
        }, function() {
            throw "Unable to get Table";
        });
    });

    it("should create table Custom5", function(done) {

        this.timeout(30000);

        var custom = new CB.CloudTable('Custom5');
        var newColumn = new CB.Column('location');
        newColumn.dataType = 'GeoPoint';
        custom.addColumn(newColumn);
        custom.save().then(function(res) {
            done();
        }, function(error) {
            throw "Unable to create Custom5";
        });
    });

    it("should create table Sample", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Sample');
        var newColumn = new CB.Column('name');
        newColumn.dataType = 'Text';
        newColumn.required = true;
        custom.addColumn(newColumn);
        var newColumn1 = new CB.Column('unique');
        newColumn1.dataType = 'Text';
        newColumn1.unique = true;
        custom.addColumn(newColumn1);
        var newColumn2 = new CB.Column('stringArray');
        newColumn2.dataType = 'List';
        newColumn2.relatedTo = 'Text';
        custom.addColumn(newColumn2);
        var newColumn3 = new CB.Column('objectArray');
        newColumn3.dataType = 'List';
        newColumn3.relatedTo = 'Object';
        custom.addColumn(newColumn3);
        var newColumn6 = new CB.Column('file');
        newColumn6.dataType = 'File';
        custom.addColumn(newColumn6);
        var newColumn7 = new CB.Column('fileList');
        newColumn7.dataType = 'List';
        newColumn7.relatedTo = 'File';
        custom.addColumn(newColumn7);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Sample";
        });
    });

    it("should update Sample table ", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Sample');
        CB.CloudTable.get(custom).then(function(custom) {
            var newColumn = new CB.Column('uniqueRelation');
            newColumn.dataType = 'Relation';
            newColumn.relatedTo = 'Sample';
            newColumn.unique = true;
            custom.addColumn(newColumn);
            var newColumn4 = new CB.Column('sameRelation');
            newColumn4.dataType = 'Relation';
            newColumn4.relatedTo = 'Sample';
            custom.addColumn(newColumn4);
            var newColumn5 = new CB.Column('relationArray');
            newColumn5.dataType = 'List';
            newColumn5.relatedTo = 'Sample';
            custom.addColumn(newColumn5);
            custom.save().then(function(res) {
                done();
            }, function() {
                throw "Unable to Update Sample";
            });
        }, function() {
            throw "Unable to get Table";
        });
    });

    it("should create table hostel", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('hostel');
        var newColumn = new CB.Column('room');
        newColumn.dataType = 'Number';
        custom.addColumn(newColumn);
        var newColumn1 = new CB.Column('name');
        newColumn1.dataType = 'Text';
        custom.addColumn(newColumn1);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create hostel";
        });

    });

    //create Hostel
    it("should create table student1", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('student1');
        var newColumn = new CB.Column('age');
        newColumn.dataType = 'Number';
        custom.addColumn(newColumn);
        var newColumn2 = new CB.Column('newColumn');
        newColumn2.dataType = 'Relation';
        newColumn2.relatedTo = 'hostel';
        custom.addColumn(newColumn2);
        var newColumn3 = new CB.Column('name');
        newColumn3.dataType = 'Text';
        custom.addColumn(newColumn3);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Sample";
        });
    });

    it("should create table Student", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Student');
        var newColumn = new CB.Column('name');
        newColumn.dataType = 'Text';
        custom.addColumn(newColumn);
        var newColumn1 = new CB.Column('age');
        newColumn1.dataType = 'Number';
        custom.addColumn(newColumn1);
        var newColumn2 = new CB.Column('class');
        newColumn2.dataType = 'Text';
        custom.addColumn(newColumn2);
        var newColumn3 = new CB.Column('description');
        newColumn3.dataType = 'Text';
        custom.addColumn(newColumn3);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Student";
        });

    });

    it("should create table Offline", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Offline');
        var newColumn = new CB.Column('name');
        newColumn.dataType = 'Text';
        custom.addColumn(newColumn);
        var newColumn1 = new CB.Column('age');
        newColumn1.dataType = 'Number';
        custom.addColumn(newColumn1);
        var newColumn2 = new CB.Column('class');
        newColumn2.dataType = 'Text';
        custom.addColumn(newColumn2);
        var newColumn3 = new CB.Column('description');
        newColumn3.dataType = 'Text';
        custom.addColumn(newColumn3);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Student";
        });

    });

    it("should create table Custom18", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Custom18');
        var newColumn = new CB.Column('number');
        newColumn.dataType = 'Number';
        custom.addColumn(newColumn);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Custom18";
        });

    });

    it("should create table Custom3", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Custom3');
        var newColumn = new CB.Column('address');
        newColumn.dataType = 'Text';
        custom.addColumn(newColumn);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Custom3";
        });
    });

    it("should create table Custom7", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Custom7');
        var newColumn = new CB.Column('requiredNumber');
        newColumn.dataType = 'Number';
        custom.addColumn(newColumn);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Custom7";
        });
    });

    it("should create table Custom2", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Custom2');
        var newColumn = new CB.Column('newColumn1');
        newColumn.dataType = 'Text';
        custom.addColumn(newColumn);
        var newColumn1 = new CB.Column('newColumn7');
        newColumn1.dataType = 'Relation';
        newColumn1.relatedTo = 'student1';
        custom.addColumn(newColumn1);
        var newColumn2 = new CB.Column('newColumn2');
        newColumn2.dataType = 'Relation';
        newColumn2.relatedTo = 'Custom3';
        custom.addColumn(newColumn2);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Custom2";
        });
    });

    it("should create table Custom4", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Custom4');
        var newColumn = new CB.Column('newColumn1');
        newColumn.dataType = 'Text';
        custom.addColumn(newColumn);
        var newColumn1 = new CB.Column('newColumn7');
        newColumn1.dataType = 'List';
        newColumn1.relatedTo = 'student1';
        custom.addColumn(newColumn1);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Custom4";
        });

    });

    it("should create table Custom14", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Custom14');
        var newColumn = new CB.Column('ListNumber');
        newColumn.dataType = 'List';
        newColumn.relatedTo = 'Number';
        custom.addColumn(newColumn);
        var newColumn1 = new CB.Column('ListGeoPoint');
        newColumn1.dataType = 'List';
        newColumn1.relatedTo = 'GeoPoint';
        custom.addColumn(newColumn1);
        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Custom14";
        });

    });

    it("should create table Custom1", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('Custom1');
        var newColumn = new CB.Column('description');
        newColumn.dataType = 'Text';
        custom.addColumn(newColumn);
        var newColumn1 = new CB.Column('newColumn');
        newColumn1.dataType = 'Text';
        custom.addColumn(newColumn1);
        var newColumn2 = new CB.Column('newColumn1');
        newColumn2.dataType = 'Boolean';
        custom.addColumn(newColumn2);

        custom.save().then(function(res) {
            done();
        }, function() {
            throw "Unable to create Custom1";
        });

    });

    it("should create table and delete table", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('CustomDelete');

        var newColumn = new CB.Column('description');
        newColumn.dataType = 'Text';
        custom.addColumn(newColumn);

        var newColumn1 = new CB.Column('newColumn');
        newColumn1.dataType = 'Text';
        custom.addColumn(newColumn1);

        var newColumn2 = new CB.Column('newColumn1');
        newColumn2.dataType = 'Boolean';
        custom.addColumn(newColumn2);

        custom.save().then(function(res) {

            res.delete().then(function(delRes) {
                done();
            }, function(err) {
                done(err);
                throw "Unable to delete a table.";
            });

        }, function() {
            throw "Unable to delete a table.";
        });

    });
    it("should create tables", function(done) {

        this.timeout(50000);

        var custom = new CB.CloudTable('CustomDelete');

        var newColumn = new CB.Column('name');
        newColumn.dataType = 'Text';
        custom.addColumn(newColumn);

        var newColumn1 = new CB.Column('age');
        newColumn1.dataType = 'Number';
        custom.addColumn(newColumn1);

        custom.save().then(function(res) {

            res.delete().then(function(delRes) {
                done();
            }, function(err) {
                done(err);
                throw "Unable to delete a table.";
            });

        }, function() {
            throw "Unable to delete a table.";
        });

    });

    after(function() {
        CB.appKey = CB.jsKey;
    });

});

describe("CloudQuery Include", function (done) {
    
   
    
    it("save a relation.", function (done) {
        
        this.timeout(30000);

        //create an object. 
        var obj = new CB.CloudObject('Custom4');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        var obj2= new CB.CloudObject('student1');
        obj2.set('name', 'Nawaz');
        obje=[obj1,obj2];
        obj.set('newColumn7', obje);
        obj.save().then(function() {
            done();
        }, function () { 
            throw "Relation Save error";
        });

    });

    it("save a Multi-Join.", function (done) {

        this.timeout(30000);

        //create an object.
        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        var obj2 = new CB.CloudObject('hostel');
        var obj3 = new CB.CloudObject('Custom3');
        obj3.set('address','progress');
        obj.set('newColumn2',obj3);
        obj2.set('room',509);
        obj1.set('name', 'Vipul');
        obj.set('newColumn7', obj1);
        obj1.set('newColumn',obj2);
        obj.save().then(function() {
            done();
        }, function () {
            throw "Relation Save error";
        });

    });

    it("should include a relation object when include is requested in a query.", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        var obj2 = new CB.CloudObject('hostel');
        var obj3 = new CB.CloudObject('Custom3');
        obj3.set('address','progress');
        obj.set('newColumn2',obj3);
        obj2.set('room',509);
        obj1.set('name', 'Vipul');
        obj.set('newColumn7', obj1);
        obj1.set('newColumn',obj2);
        obj.set('newColumn7', obj1);
        obj.save().then(function(obj) {
            var query = new CB.CloudQuery('Custom2');
            query.include('newColumn7');
            query.include('newColumn7.newColumn');
            query.include('newColumn2');
            query.equalTo('id',obj.id);
            query.find().then(function(list){
                if(list.length>0){
                    for(var i=0;i<list.length;i++){
                        var student_obj=list[i].get('newColumn7');
                        var room=student_obj.get('newColumn');
                        var address=list[i].get('newColumn2');
                        if(!student_obj.get('name') || !room.get('room') || !address.get('address'))
                            throw "Unsuccessful Join";
                    }
                    done();
                }else{
                    throw "Cannot retrieve a saved relation.";
                }
            }, function(error){
                    throw "Cannot find";
            });
            
        }, function () { 
            throw "Relation Save error";
        });
    });


    it("should not return duplicate objects in relation list after saving", function (done) {

        this.timeout(30000);     
       
        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
       
        var obj = new CB.CloudObject('Custom4');
        obj.set('newColumn7', [obj1,obj1]);
        obj.save().then(function(respObj) {

            if(respObj.get("newColumn7").length==2){
                done("returning duplicate objects");
            }else{
                done();
            }            
        }, function (error) {
            done(error);            
        });
    });

    it("should not return duplicate objects in relation list on Querying", function (done) {

        this.timeout(30000);     
       
        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'sjdgsduj');
       
        var obj = new CB.CloudObject('Custom4');
        obj.set('newColumn7', [obj1,obj1]);
        obj.save().then(function(respObj) {

            var obj = new CB.CloudQuery('Custom4');
            obj.include('newColumn7');
            obj.findById(respObj.get("id"),{success : function(queriedObj){ 

                if(queriedObj.get("newColumn7").length==2){
                    done("returning duplicate objects");
                }else{
                    done();
                } 
            }, error : function(error){ 
              done(error);             
            }});

            
        }, function (error) { 
            done(error);
        });
    });


    it("should include a relation on distinct.", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'text');

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        obj.set('newColumn7', obj1);
    
        obj.save({
            success : function(obj){
                var query = new CB.CloudQuery('Custom2');
                query.include('newColumn7');
                query.distinct('newColumn1').then(function(list){
                    var status = false;
                    if(list.length>0){
                        for(var i=0;i<list.length;i++){
                            var student_obj=list[i].get('newColumn7');
                            if(student_obj && student_obj.get('name'))
                                status = true;
                        }
                        if(status === true){
                            done();
                        }else{
                            throw "Cannot retrieve a saved relation.";
                        }
                    }else{
                        throw "Cannot retrieve a saved relation.";
                    }
                }, function(error){
                    throw "Unsuccessful join"
                });
            }, error : function(error){
                throw "Cannot save a CloudObject";
            }
        })
    });

    it("should query over a linked column if a object is passed in equalTo",function(done){
            this.timeout(30000);

            var hostel = new CB.CloudObject('hostel');
            var student = new CB.CloudObject('student1');
            hostel.set('room',789);
            student.set('newColumn',hostel);
            student.save().then(function(list){
                var query1 = new CB.CloudQuery('student1');
                var temp = list.get('newColumn');
                query1.equalTo('newColumn',temp);
                query1.find().then(function(obj){
                    //console.log(obj);
                    done();
                }, function () {
                    throw "";
                });
                //console.log(list);
            },function(){
                throw "unable to save data";
            })
    });


    it("should run containedIn over list of CloudObjects",function(done){

            this.timeout(300000);

            var obj = new CB.CloudObject('Custom');
            var obj1 = new CB.CloudObject('Custom');

            var obj2 = new CB.CloudObject('Custom');

            obj.set('newColumn7', [obj2,obj1]);

            obj.save().then(function(obj){
                var query = new CB.CloudQuery('Custom');
                query.containedIn('newColumn7', obj.get('newColumn7')[0]);
                query.find().then(function(list){
                    if(list.length>0){
                        done();
                    }else{
                        throw "Cannot query";
                    }
                }, function(error){
                    throw "Cannot query";
                });
            }, function(error){
                throw "Cannot save an object";
            });

            
    });


     it("should run containedIn over list of CloudObjects by passing a list of CloudObjects",function(done){

            this.timeout(300000);

            var obj = new CB.CloudObject('Custom');
            var obj1 = new CB.CloudObject('Custom');

            var obj2 = new CB.CloudObject('Custom');

            obj.set('newColumn7', [obj2,obj1]);

            obj.save().then(function(obj){
                var query = new CB.CloudQuery('Custom');
                query.containedIn('newColumn7', obj.get('newColumn7'));
                query.find().then(function(list){
                    if(list.length>0){
                        done();
                    }else{
                        throw "Cannot query";
                    }
                }, function(error){
                    throw "Cannot query";
                });
            }, function(error){
                throw "Cannot save an object";
            });

            
    });

    it("should include with findById",function(done){

            this.timeout(300000);
            var obj = new CB.CloudObject('Custom');
            var obj1 = new CB.CloudObject('Custom');
            var obj2 = new CB.CloudObject('Custom');
            obj2.set('newColumn1','sample');
            obj.set('newColumn7', [obj2,obj1]);
            obj.save().then(function(obj){
                var query = new CB.CloudQuery('Custom');
                query.include('newColumn7');
                query.findById(obj.id).then(function(obj){
                   if(obj.get('newColumn7').length>0){
                     if(obj.get('newColumn7')[0].get('newColumn1') === 'sample'){
                        done();
                     }else{
                        throw "did not include sub documents";
                     }
                   }else{
                        throw "Cannot get the list";
                   }
                }, function(error){
                    throw "Cannot query";
                });
            }, function(error){
                throw "Cannot save an object";
            });            
    });

});
describe("CloudQuery", function(done) {

    var obj = new CB.CloudObject('student1');

    it("Should save data with a particular value.", function(done) {

        this.timeout(30000);

        obj.set('name', 'vipul');
        obj.save().then(function(list) {
            if (list.get('name') === 'vipul')
                done();
            else
                throw "object could not saved properly";
            }
        , function() {
            throw "data Save error";
        });

    });

    it("Should save data with a particular value.", function(done) {

        this.timeout(30000);

        obj.set('name', 'abrakadabra');
        obj.save().then(function(list) {
            if (list.get('name') === 'abrakadabra') {
                var query = new CB.CloudQuery('student1');
                query.substring("name", "kad");
                query.find({
                    success: function(list) {
                        if (list.length > 0) {
                            if (list[0].get("name") === "abrakadabra") {
                                done();
                            } else {
                                done("Got the list but got incorrect name");
                            }
                        } else {
                            done("Failed to get the list");
                        }
                    },
                    error: function(error) {
                        done("Failed to save the object");
                    }
                });
            } else
                done("object could not saved properly");
            }
        , function() {
            throw "data Save error";
        });
    });

    it("Should query with substring and case insensitive.", function(done) {

        this.timeout(30000);

        obj.set('name', 'VIPUL');
        obj.save().then(function(list) {
            if (list.get('name') === 'VIPUL') {

                var query = new CB.CloudQuery('student1');
                query.substring("name", "pu", true);
                query.find({
                    success: function(list) {

                        if (list.length > 0) {

                            var foundObj = false;
                            for (var i = 0; i < list.length; ++i) {
                                if (list[i].get("name") === "VIPUL") {
                                    foundObj = true;
                                }
                            }

                            if (foundObj) {
                                done();
                            } else {
                                done("Got the list but got incorrect name");
                            }

                        } else {
                            done("Failed to get the list");
                        }

                    },
                    error: function(error) {
                        done("Failed to save the object");
                    }
                });

            } else
                done("object could not saved properly");
            }
        , function() {
            throw "data Save error";
        });
    });

    it("Substring with an array.", function(done) {

        this.timeout(30000);

        var obj2 = new CB.CloudObject('student1');
        obj2.set('name', 'nawaz');
        obj2.save().then(function(list) {
            if (list.get('name') === 'nawaz') {
                var query = new CB.CloudQuery('student1');
                query.substring("name", ["pu", "aw"]);
                query.find({
                    success: function(list) {
                        if (list.length > 0) {
                            done();
                        } else {
                            done("Failed to get the list");
                        }
                    },
                    error: function(error) {
                        done("Failed to save the object");
                    }
                });
            } else
                done("object could not saved properly");
            }
        , function() {
            throw "data Save error";
        });
    });

    it("Substring with an array and array.", function(done) {

        this.timeout(30000);

        var obj2 = new CB.CloudObject('student1');
        obj2.set('name', 'nawaz');
        obj2.save().then(function(list) {
            if (list.get('name') === 'nawaz') {
                var query = new CB.CloudQuery('student1');
                query.substring([
                    "name", "age"
                ], ["pu", "aw"]);
                query.find({
                    success: function(list) {
                        if (list.length > 0) {
                            done();
                        } else {
                            done("Failed to get the list");
                        }
                    },
                    error: function(error) {
                        done("Failed to save the object");
                    }
                });
            } else
                done("object could not saved properly");
            }
        , function() {
            throw "data Save error";
        });
    });

    it("select column should work on find", function(done) {
        this.timeout(30000);
        var obj1 = new CB.CloudObject('Custom1');
        obj1.set('newColumn', 'sample');
        obj1.set('description', 'sample2');
        obj1.save().then(function(obj) {
            var cbQuery = new CB.CloudQuery('Custom1');
            cbQuery.equalTo('id', obj.id);
            cbQuery.selectColumn('newColumn');
            cbQuery.find({
                success: function(objList) {
                    if (objList.length > 0)
                        if (!objList[0].get('description'))
                            done();
                        else
                            throw "Select doesn't work";
                else
                        throw "Cannot query over select ";
                    }
                ,
                error: function(err) {
                    throw "Error querying object.";
                }
            });
        }, function() {
            throw "should save the object";
        });
    });

    it("containedIn should work on Id", function(done) {
        this.timeout(30000);
        var obj1 = new CB.CloudObject('Custom1');
        obj1.set('newColumn', 'sample');
        obj1.set('description', 'sample2');
        obj1.save().then(function(obj1) {
            var obj2 = new CB.CloudObject('Custom1');
            obj2.set('newColumn', 'sample');
            obj2.set('description', 'sample2');
            obj2.save().then(function(obj2) {
                var obj3 = new CB.CloudObject('Custom1');
                obj3.set('newColumn', 'sample');
                obj3.set('description', 'sample2');
                obj3.save().then(function(obj3) {

                    var cbQuery = new CB.CloudQuery('Custom1');
                    cbQuery.containedIn('id', [obj1.id, obj3.id]);
                    cbQuery.find({
                        success: function(objList) {
                            if (objList.length === 2)
                                done();
                            else
                                done("Cannot do contains in on Id");
                            }
                        ,
                        error: function(err) {
                            throw "Error querying object.";
                        }
                    });
                }, function() {
                    throw "should save the object";
                });

            }, function() {
                throw "should save the object";
            });

        }, function() {
            throw "should save the object";
        });
    });

    it("select column should work on distinct", function(done) {
        this.timeout(30000);
        var obj1 = new CB.CloudObject('Custom1');
        obj1.set('newColumn', 'sample');
        obj1.set('description', 'sample2');
        obj1.save().then(function(obj) {
            var cbQuery = new CB.CloudQuery('Custom1');
            cbQuery.equalTo('id', obj.id);
            cbQuery.selectColumn('newColumn');
            cbQuery.distinct('id', {
                success: function(objList) {
                    if (objList.length > 0)
                        if (!objList[0].get('description'))
                            done();
                        else
                            throw "Select doesn't work";
                else
                        throw "Cannot query over select ";
                    }
                ,
                error: function(err) {
                    throw "Error querying object.";
                }
            });

        }, function() {
            throw "should save the object";
        });
    });

    it("should retrieve items when column name is null (from equalTo function)", function(done) {
        this.timeout(30000);

        var obj = new CB.CloudObject('student1');
        obj.save().then(function(obj) {
            var query = new CB.CloudQuery('student1');
            query.equalTo('name', null);
            query.find().then(function(list) {

                //check all the objects returned.
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('name')) {
                        throw "Name exists";
                    }
                }

                if (list.length > 0) {
                    done();
                } else
                    throw "object could not queried properly";
                }
            , function(err) {
                done(err);
            });
        }, function(error) {
            throw "object could not saved properly";
        });
    });

    it("should retrieve items when column name is NOT null (from NotEqualTo function)", function(done) {
        this.timeout(30000);

        var obj = new CB.CloudObject('student1');
        obj.set('name', 'sampleName');
        obj.save().then(function(obj) {
            var query = new CB.CloudQuery('student1');
            query.notEqualTo('name', null);
            query.find().then(function(list) {

                //check all the objects returned.
                for (var i = 0; i < list.length; i++) {
                    if (!list[i].get('name')) {
                        throw "Name does not exists";
                    }
                }
                if (list.length > 0)
                    done();
                else
                    throw "object could not queried properly";
                }
            , function(err) {
                done(err);
            });
        }, function(error) {
            throw "object could not saved properly";
        });

    });

    it("should retrieve items when column name is not null (from notEqualTo function)", function(done) {
        this.timeout(30000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('id', obj.get('id'));
        query.find().then(function(list) {
            if (list.length > 0)
                done();
            else
                throw "object could not saved properly";
            }
        , function(err) {
            done(err);
        });
    });

    it("should find data with id", function(done) {

        this.timeout(30000);

        var query = new CB.CloudQuery('student1');
        query.equalTo("id", obj.get('id'));
        query.find().then(function(list) {
            if (list.length > 0) {
                done();
            } else {
                throw "unable to retrive data";
            }
        }, function(err) {
            throw "unable to retrieve data";
        });

    });

    it("should return count as an integer", function(done) {

        this.timeout(30000);

        var query = new CB.CloudQuery('student1');
        query.count({
            success: function(count) {
                //count is the count of data which belongs to the query
                if (count === parseInt(count, 10))
                    done();
                else
                    throw "Count returned is not of type integer.";
                }
            ,
            error: function(err) {
                //Error in retrieving the data.
                throw "Error getting count.";
            }
        });

    });

    it("Should count the no.of objects", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';

        var table = new CB.CloudTable('countobjectsxx');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('countobjectsxx');
            obj1.set('name', 'abcd');

            var obj2 = new CB.CloudObject('countobjectsxx');
            obj2.set('name', 'pqrs');

            var obj3 = new CB.CloudObject('countobjectsxx');
            obj3.set('name', 'gdgd');

            var obj4 = new CB.CloudObject('countobjectsxx');
            obj4.set('name', 'sjdhsjd');

            CB.CloudObject.saveAll([
                obj1, obj2, obj3, obj4
            ], {
                success: function(res) {

                    var totalObjectsInDB = res.length;

                    var obj = new CB.CloudQuery('countobjectsxx');
                    obj.count({
                        success: function(number) {
                            if (number != totalObjectsInDB) {
                                done("Count is not as expected.");
                            } else {
                                done();
                            }
                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should count with OR query", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';

        var table = new CB.CloudTable('countorquery');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('countorquery');
            obj1.set('name', 'pqrs');

            var obj2 = new CB.CloudObject('countorquery');
            obj2.set('name', 'pqrs');

            var obj3 = new CB.CloudObject('countorquery');
            obj3.set('name', 'sjdhsjd');

            var obj4 = new CB.CloudObject('countorquery');
            obj4.set('name', 'sjdhsjd');

            CB.CloudObject.saveAll([
                obj1, obj2, obj3, obj4
            ], {
                success: function(res) {

                    var totalObjectsInDB = res.length;

                    var query1 = new CB.CloudQuery('countorquery');
                    var query2 = new CB.CloudQuery('countorquery');

                    query1.equalTo('name', "sjdhsjd");
                    query2.equalTo('name', "pqrs");

                    var query = CB.CloudQuery.or(query1, query2);

                    query.count({
                        success: function(number) {
                            done();
                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should count with Multi level OR query", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';

        var table = new CB.CloudTable('countmultiorquery');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('countmultiorquery');
            obj1.set('name', 'pqrs');

            var obj2 = new CB.CloudObject('countmultiorquery');
            obj2.set('name', 'pqrs');

            var obj3 = new CB.CloudObject('countmultiorquery');
            obj3.set('name', 'sjdhsjd');

            var obj4 = new CB.CloudObject('countmultiorquery');
            obj4.set('name', 'sjdhsjd');

            CB.CloudObject.saveAll([
                obj1, obj2, obj3, obj4
            ], {
                success: function(res) {

                    var totalObjectsInDB = res.length;

                    var multiquery1 = new CB.CloudQuery('countmultiorquery');
                    var multiquery2 = new CB.CloudQuery('countmultiorquery');

                    multiquery1.equalTo('name', "pqrs");
                    multiquery2.equalTo('name', "sjdhsjd");

                    var query1 = CB.CloudQuery.or(multiquery1, multiquery2);

                    var query2 = new CB.CloudQuery('countmultiorquery');
                    query2.equalTo('name', "pqrs");

                    var query = CB.CloudQuery.or(query1, query2);

                    query.count({
                        success: function(number) {
                            done();
                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("should find item by id", function(done) {
        this.timeout(30000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('id', obj.get('id'));
        query.find().then(function(list) {
            if (list.length > 0)
                done();
            else
                throw "object could not saved properly";
            }
        , function(err) {
            done(err);
        });
    });

    it("should run a find one query", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';

        var table = new CB.CloudTable('findonequery');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('findonequery');
            obj1.set('name', 'vipul');

            CB.CloudObject.saveAll([obj1], {
                success: function(res) {

                    var query = new CB.CloudQuery('findonequery');
                    query.equalTo('name', 'vipul');
                    query.findOne().then(function(list) {
                        if (list.get('name') === 'vipul')
                            done();
                        else {
                            done("unable to get");
                        }
                    }, function(err) {
                        done(err);
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should retrieve data with a particular value.", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';

        var table = new CB.CloudTable('particularquery');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('particularquery');
            obj1.set('name', 'vipul');

            CB.CloudObject.saveAll([obj1], {
                success: function(res) {

                    var obj = new CB.CloudQuery('particularquery');
                    obj.equalTo('name', 'vipul');
                    obj.find().then(function(list) {
                        if (list.length > 0) {
                            var found = false;
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].get('name') == 'vipul') {
                                    found = true;
                                    break;
                                }
                            }
                        } else {
                            done("failed to retrieve saved data with particular value ");
                        }
                        if (found) {
                            done();
                        } else {
                            done("failed to retrieve saved data with particular value ");
                        }

                    }, function(error) {
                        done(error);
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should perform OR query with 2 Query Objects", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';

        var table = new CB.CloudTable('ortwoquery');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('ortwoquery');
            obj1.set('name', 'pqrs');

            var obj2 = new CB.CloudObject('ortwoquery');
            obj2.set('name', 'pqrs');

            var obj3 = new CB.CloudObject('ortwoquery');
            obj3.set('name', 'sjdhsjd');

            var obj4 = new CB.CloudObject('ortwoquery');
            obj4.set('name', 'sjdhsjd');

            CB.CloudObject.saveAll([
                obj1, obj2, obj3, obj4
            ], {
                success: function(res) {

                    var query1 = new CB.CloudQuery('ortwoquery');
                    var query2 = new CB.CloudQuery('ortwoquery');

                    query1.equalTo('name', "pqrs");
                    query2.equalTo('name', "sjdhsjd");

                    var query = CB.CloudQuery.or(query1, query2);

                    query.find({
                        success: function(data) {
                            if (data) {
                                done();
                            } else {
                                done("Failed to retrieve data with OR query");
                            }

                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should perform OR query with Array of Queries", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';

        var table = new CB.CloudTable('orarrayquery');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('orarrayquery');
            obj1.set('name', 'pqrs');

            var obj2 = new CB.CloudObject('orarrayquery');
            obj2.set('name', 'pqrs');

            var obj3 = new CB.CloudObject('orarrayquery');
            obj3.set('name', 'sjdhsjd');

            var obj4 = new CB.CloudObject('orarrayquery');
            obj4.set('name', 'sjdhsjd');

            CB.CloudObject.saveAll([
                obj1, obj2, obj3, obj4
            ], {
                success: function(res) {

                    var query1 = new CB.CloudQuery('orarrayquery');
                    var query2 = new CB.CloudQuery('orarrayquery');

                    query1.equalTo('name', "pqrs");
                    query2.equalTo('name', "sjdhsjd");

                    var queryArray = [];
                    queryArray.push(query1);
                    queryArray.push(query2);

                    var query = CB.CloudQuery.or(queryArray);

                    query.find({
                        success: function(data) {
                            if (data) {
                                done();
                            } else {
                                done("Failed to retrieve data with OR query");
                            }

                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should save list with in column", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['java', 'python']);
        obj.save().then(function() {
            done();
        }, function() {
            throw "list Save error";
        });

    });

    it("Should retrieve list matching with several different values", function(done) {

        this.timeout(30000);
        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['java', 'python']);
        obj.save().then(function() {
            var obj = new CB.CloudQuery('student4');
            obj.containsAll('subject', ['java', 'python']);
            obj.find().then(function(list) {
                if (list.length > 0) {
                    for (var i = 0; i < list.length; i++) {
                        var subject = list[i].get('subject');
                        for (var j = 0; j < subject.length; j++) {
                            if (subject[j] != 'java' && subject[j] != 'python')
                                throw "should retrieve saved data with particular value ";
                            }
                        }
                } else {
                    throw "should retrieve data matching a set of values ";
                }
                done();
            }, function(err) {
                done(err);
            });
        }, function(err) {
            done(err);
        });

    });

    it("Should retrieve data where column name starts which a given string", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudQuery('student1');
        obj.startsWith('name', 'v');
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('name')[0] != 'v' && list[i].get('name')[0] != 'V')
                        throw "should retrieve saved data with particular value ";
                    }
                } else {
                throw "should retrieve data matching a set of values ";
            }
            done();
        }, function() {
            throw "find data error";
        });

    });

    it("Should save list with in column", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['C#', 'python']);
        obj.save().then(function() {
            done();
        }, function() {
            throw "list Save error";
        });

    });

    it("Should not retrieve data with a particular value.", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudQuery('student1');
        obj.notEqualTo('name', 'vipul');
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('name') === 'vipul')
                        throw "should not retrieve data with particular value ";
                    }
                } else {
                throw "should not retrieve data with particular value ";
            }
            done();
        }, function() {
            throw "find data error";
        });

    });

    it("Should not retrieve data including a set of different values", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudQuery('student4');
        obj.notContainedIn('subject', ['java', 'python']);
        obj.find().then(function(list) {

            if (list && list.length > 0) {
                for (var i = 0; i < list.length; i++) {

                    if (list[i].get('subject')) {
                        var subject = list[i].get('subject');
                        for (var j = 0; j < subject.length; j++) {
                            if (subject[j] === 'java' || subject[j] === 'python')
                                throw "should retrieve saved data with particular value ";

                            }
                        }
                }
            }
            done();
        }, function(err) {
            done(err);
        });

    });

    it("Should save data with a particular value.", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('student4');
        obj.set('age', 15);
        obj.set('subject', ['C#', 'C']);
        obj.save().then(function() {
            done();
        }, function() {
            throw "data Save error";
        });

    });

    it("Should retrieve data which is greater that a particular value.", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudQuery('student4');
        obj.greaterThan('age', 10);
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age') <= 10)
                        throw "received value less than the required value";
                    }
                } else {
                throw "received value less than the required value";
            }
            done();
        }, function() {
            throw "find data error";
        });

    });

    it("Should retrieve data which is greater equal to a particular value.", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudQuery('student4');
        obj.greaterThanEqualTo('age', 15);
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age') < 10)
                        throw "received value less than the required value";
                    }
                } else {
                throw "received value less than the required value";
            }
            done();
        }, function() {
            throw "find data error";
        });

    });

    it("Should retrieve data which is less than a particular value.", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudQuery('student4');
        obj.lessThan('age', 20);
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age') >= 20)
                        throw "received value greater than the required value";
                    }
                } else {
                throw "received value greater than the required value";
            }
            done();
        }, function() {
            throw "find data error";
        });

    });

    it("Should retrieve data which is less or equal to a particular value.", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudQuery('student4');
        obj.lessThanEqualTo('age', 15);
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age') > 15)
                        throw "received value greater than the required value";
                    }
                } else {
                throw "received value greater than the required value";
            }
            done();
        }, function() {
            throw "find data error";
        });

    });

    it("Should retrieve data with a particular value.", function(done) {

        this.timeout(30000);

        var obj1 = new CB.CloudQuery('student4');
        obj1.equalTo('subject', ['java', 'python']);
        var obj2 = new CB.CloudQuery('student4');
        obj2.equalTo('age', 12);
        var obj = new CB.CloudQuery.or(obj1, obj2);
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age') === 12) {
                        continue;
                    } else {
                        var subject = list[i].get('subject');
                        for (var j = 0; j < subject.length; j++) {
                            if (subject[j] === 'java' || subject[j] === 'python') {
                                continue;
                            } else {
                                throw "should retrieve saved data with particular value ";
                            }
                        }
                    }
                    continue;
                }
            } else
                throw "should return data";
            done();
        }, function() {
            throw "find data error";
        });

    });

    it("Should retrieve data in ascending order", function(done) {

        this.timeout(30000);
        var age = null;
        var obj = new CB.CloudQuery('student4');
        obj.orderByAsc('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                age = list[0].get('age');
                for (var i = 1; i < list.length; i++) {
                    if (age > list[i].get('age'))
                        throw "received value greater than the required value";
                    age = list[i].get('age');
                }
            } else {
                throw "received value greater than the required value";
            }
            done();
        }, function() {
            throw "find data error";
        });

    });

    it("Should retrieve data in descending order", function(done) {

        this.timeout(30000);
        var age = null;
        var obj = new CB.CloudQuery('student4');
        obj.orderByDesc('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                age = list[0].get('age');
                for (var i = 1; i < list.length; i++) {
                    if (age < list[i].get('age'))
                        throw "received value greater than the required value";
                    age = list[i].get('age');
                }
            } else {
                throw "received value greater than the required value";
            }
            done();
        }, function() {
            throw "find data error";
        });

    });

    it("Should limit the number of data items received", function(done) {

        this.timeout(30000);
        var age = null;
        var obj = new CB.CloudQuery('student4');
        obj.setLimit(5);
        obj.find().then(function(list) {
            if (list.length > 5)
                throw "received number of items are greater than the required value";
            else
                done();
            }
        , function() {
            throw "find data error";
        });

    });

    it("Should paginate with all params (return list of limited objects,count and totalpages)", function(done) {

        this.timeout(40000);

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'abcd');

        var obj2 = new CB.CloudObject('student1');
        obj2.set('name', 'pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name', 'gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name', 'sjdhsjd');

        CB.CloudObject.saveAll([
            obj1, obj2, obj3, obj4
        ], {
            success: function(res) {

                var pageNumber = 1;
                var totalItemsInPage = 2;

                var obj = new CB.CloudQuery('student1');
                obj.paginate(pageNumber, totalItemsInPage, {
                    success: function(objectsList, count, totalPages) {

                        if (objectsList && objectsList.length > totalItemsInPage) {
                            throw "received number of items are greater than the required value";
                            done("paginate data error");
                        } else if (Math.ceil(count / totalItemsInPage) != totalPages) {
                            done("totalpages is not recieved as expected");
                        } else {
                            done();
                        }
                    },
                    error: function(error) {
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });

            },
            error: function(err) {
                done(err);
            }
        });

    });

    it("Should paginate with null params", function(done) {

        this.timeout(40000);

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'abcd');

        var obj2 = new CB.CloudObject('student1');
        obj2.set('name', 'pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name', 'gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name', 'sjdhsjd');

        CB.CloudObject.saveAll([
            obj1, obj2, obj3, obj4
        ], {
            success: function(res) {

                var obj = new CB.CloudQuery('student1');
                obj.paginate().then(function(objectsList, count, totalPages) {
                    if (objectsList && objectsList.length == 0) {
                        throw "received 0 objects";
                        done("paginate received 0 objects");
                    } else {
                        done();
                    }
                }, function(error) {
                    done(error);
                });

            },
            error: function(err) {
                done(err);
            }
        });

    });

    it("Should paginate with callback as first param", function(done) {

        this.timeout(40000);

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'abcd');

        var obj2 = new CB.CloudObject('student1');
        obj2.set('name', 'pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name', 'gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name', 'sjdhsjd');

        CB.CloudObject.saveAll([
            obj1, obj2, obj3, obj4
        ], {
            success: function(res) {

                var obj = new CB.CloudQuery('student1');
                obj.paginate({
                    success: function(objectsList, count, totalPages) {
                        if (objectsList && objectsList.length == 0) {
                            throw "received 0 objects";
                            done("received 0 objectsr");
                        } else {
                            done();
                        }
                    },
                    error: function(error) {
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });

            },
            error: function(err) {
                done(err);
            }
        });

    });

    it("Should paginate with callback as second param", function(done) {

        this.timeout(40000);

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'abcd');

        var obj2 = new CB.CloudObject('student1');
        obj2.set('name', 'pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name', 'gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name', 'sjdhsjd');

        CB.CloudObject.saveAll([
            obj1, obj2, obj3, obj4
        ], {
            success: function(res) {

                var obj = new CB.CloudQuery('student1');
                obj.paginate(null, {
                    success: function(objectsList, count, totalPages) {

                        if (objectsList && objectsList.length == 0) {
                            throw "received 0 objects";
                            done("received 0 objects");
                        } else {
                            done();
                        }
                    },
                    error: function(error) {
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });

            },
            error: function(err) {
                done(err);
            }
        });

    });

    it("Should paginate with callback as third param", function(done) {

        this.timeout(40000);

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'abcd');

        var obj2 = new CB.CloudObject('student1');
        obj2.set('name', 'pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name', 'gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name', 'sjdhsjd');

        CB.CloudObject.saveAll([
            obj1, obj2, obj3, obj4
        ], {
            success: function(res) {

                var obj = new CB.CloudQuery('student1');
                obj.paginate(null, null, {
                    success: function(objectsList, count, totalPages) {

                        if (objectsList && objectsList.length == 0) {
                            throw "received 0 objcts";
                            done("paginate received 0 objcts");
                        } else {
                            done();
                        }
                    },
                    error: function(error) {
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });

            },
            error: function(err) {
                done(err);
            }
        });

    });

    it("Should paginate with as pageNumber null and totalItemsInPage with value", function(done) {

        this.timeout(40000);

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'abcd');

        var obj2 = new CB.CloudObject('student1');
        obj2.set('name', 'pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name', 'gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name', 'sjdhsjd');

        CB.CloudObject.saveAll([
            obj1, obj2, obj3, obj4
        ], {
            success: function(res) {

                var pageNumber = null;
                var totalItemsInPage = 2;

                var obj = new CB.CloudQuery('student1');
                obj.paginate(null, totalItemsInPage, {
                    success: function(objectsList, count, totalPages) {

                        if (objectsList && objectsList.length == 0) {
                            throw "received 0 objects";
                            done("paginate received 0 objects");
                        } else if (Math.ceil(count / totalItemsInPage) != totalPages) {
                            done("totalpages is not recieved as expected");
                        } else {
                            done();
                        }
                    },
                    error: function(error) {
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });

            },
            error: function(err) {
                done(err);
            }
        });

    });

    it("Should paginate with pageNumber and totalItemsInPage as null", function(done) {

        this.timeout(40000);

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'abcd');

        var obj2 = new CB.CloudObject('student1');
        obj2.set('name', 'pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name', 'gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name', 'sjdhsjd');

        CB.CloudObject.saveAll([
            obj1, obj2, obj3, obj4
        ], {
            success: function(res) {

                var pageNumber = 1;
                var totalItemsInPage = null;

                var obj = new CB.CloudQuery('student1');
                obj.paginate(pageNumber, null, {
                    success: function(objectsList, count, totalPages) {

                        if (objectsList && objectsList.length == 0) {
                            throw "received 0 objects";
                            done("paginate received 0 objects");
                        } else {
                            done();
                        }
                    },
                    error: function(error) {
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });

            },
            error: function(err) {
                done(err);
            }
        });

    });

    it("Should limit the number of data items received to one", function(done) {

        this.timeout(30000);
        var age = null;
        var obj = new CB.CloudQuery('student4');
        obj.findOne().then(function(list) {
            if (list.length > 1)
                throw "received number of items are greater than the required value";
            else
                done();
            }
        , function() {
            throw "find data error";
        });

    });

    it("Should give distinct elements", function(done) {

        this.timeout(30000);
        var age = [];
        var obj = new CB.CloudQuery('student4');
        obj.distinct('age').then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age')) {
                        if (age.indexOf(list[i].get('age')) > 0)
                            throw "received item with duplicate age";
                        else
                            age.push(list[i].get('age'));
                        }
                    }
                done();
            }
        }, function() {
            throw "find data error";
        });

    });

    var getidobj = new CB.CloudObject('student1');

    it("Should save data with a particular value.", function(done) {

        this.timeout(30000);
        getidobj.set('name', 'abcd');
        getidobj.save().then(function() {
            done();
        }, function() {
            throw "data Save error";
        });

    });

    it("Should get element with a given id", function(done) {

        this.timeout(30000);
        var obj = new CB.CloudQuery('student1');
        obj.get(getidobj.get('id')).then(function(list) {
            if (list.length > 0) {
                throw "received number of items are greater than the required value";
            } else {
                if (list.get('name') === 'abcd')
                    done();
                else
                    throw "received wrong data";
                }
            }, function() {
            throw "find data error";
        });

    });

    it("Should get element having a given column name", function(done) {

        this.timeout(30000);
        var obj = new CB.CloudQuery('student4');
        obj.exists('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    //if (!list[i].get('age'))
                    if (list[i].get('age') !== null && !list[i].get('age')) {
                        //throw "received wrong data";
                        done("received wrong data");
                    }
                }
                done();
            } else {
                throw "data not received"
            }
        }, function() {
            throw "find data error";
        });
    });

    it("Should not get any element if queried with an invalid column name to exist", function(done) {
        this.timeout(30000);
        var obj = new CB.CloudQuery('student4');
        obj.exists('aNonExistingColumn');
        obj.find().then(function(list) {
            if (list.length > 0) {
                done("Reciveing data");
            } else {
                done();
            }
        }, function() {
            throw "find data error";
        });
    });

    it("Should not get any element if queried with a valid column name to not to exist", function(done) {
        this.timeout(30000);
        var obj = new CB.CloudQuery('student4');
        obj.doesNotExists('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                done("Reciveing data");
            } else {
                done();
            }
        }, function() {
            throw "find data error";
        });
    });

    it("Should not give element with a given relation", function(done) {

        this.timeout(30000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room', 123);
        obj1.save().then(function(obj) {
            if (obj) {
                obj1 = obj;
            } else {
                throw "should save the object";
            }
            obj = new CB.CloudObject('student1');
            obj.set('newColumn', obj1);
            obj.save().then(function(list) {
                var query = new CB.CloudQuery('student1');
                query.notEqualTo('newColumn', obj1);
                query.find().then(function(list) {
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].get('newColumn')) {
                            if (list[i].get('newColumn').get('id') === obj1.get('id'))
                                throw "Should not get the id in not equal to";
                            }
                        }
                    done();
                }, function() {
                    throw "should do query";
                });
            }, function() {
                throw "should save the object";
            });
        }, function() {
            throw "should save the object";
        });
    });

    it("Should query over boolean dataType", function(done) {
        this.timeout(30000);
        var obj1 = new CB.CloudObject('Custom1');
        obj1.set('newColumn1', false);
        obj1.save().then(function(obj) {
            var cbQuery = new CB.CloudQuery('Custom1');
            cbQuery.equalTo('newColumn1', false);
            cbQuery.find({
                success: function(objList) {
                    if (objList.length > 0)
                        done();
                    else
                        throw "Cannot query over boolean datatype ";
                    }
                ,
                error: function(err) {
                    throw "Error querying object.";
                }
            });

        }, function() {
            throw "should save the object";
        });
    });

    //Search Tests
    it("Should perform Stemming search ", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';
        Name.isSearchable = true;

        var table = new CB.CloudTable('stemsearch');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('stemsearch');
            obj1.set('name', 'Joe owns a dog');

            var obj2 = new CB.CloudObject('stemsearch');
            obj2.set('name', 'Dogs eat cats');

            CB.CloudObject.saveAll([
                obj1, obj2
            ], {
                success: function(res) {

                    var query = new CB.CloudQuery('stemsearch');
                    query.search("dog");
                    query.find({
                        success: function(list) {
                            if (list.length == 2) {
                                done();
                            } else {
                                done("Failed to stemmer search");
                            }

                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should perform Phrase search ", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';
        Name.isSearchable = true;

        var table = new CB.CloudTable('phrasesearch');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('phrasesearch');
            obj1.set('name', 'Joe owns a dog');

            var obj2 = new CB.CloudObject('phrasesearch');
            obj2.set('name', 'Dogs eat cats');

            CB.CloudObject.saveAll([
                obj1, obj2
            ], {
                success: function(res) {

                    var query = new CB.CloudQuery('phrasesearch');
                    query.search("dog cat");
                    query.find({
                        success: function(list) {
                            if (list.length == 2) {
                                done();
                            } else {
                                done("Failed to phrase search");
                            }

                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should perform AND search ", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';
        Name.isSearchable = true;

        var table = new CB.CloudTable('andsearch');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('andsearch');
            obj1.set('name', 'Joe owns a dog');

            var obj2 = new CB.CloudObject('andsearch');
            obj2.set('name', 'Dogs eat cats');

            CB.CloudObject.saveAll([
                obj1, obj2
            ], {
                success: function(res) {

                    var query = new CB.CloudQuery('andsearch');
                    query.search("\"Dogs eat\"");
                    query.find({
                        success: function(list) {
                            if (list.length == 1) {
                                done();
                            } else {
                                done("Failed  AND search");
                            }

                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should perform Negation search ", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';
        Name.isSearchable = true;

        var table = new CB.CloudTable('negsearch');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('negsearch');
            obj1.set('name', 'Joe owns a dog');

            var obj2 = new CB.CloudObject('negsearch');
            obj2.set('name', 'Dogs eat cats');

            CB.CloudObject.saveAll([
                obj1, obj2
            ], {
                success: function(res) {

                    var query = new CB.CloudQuery('negsearch');
                    query.search("dog -cats");
                    query.find({
                        success: function(list) {
                            if (list.length == 1) {
                                done();
                            } else {
                                done("Failed  Negation search");
                            }

                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should perform Case sensitive search ", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';
        Name.isSearchable = true;

        var table = new CB.CloudTable('casesearch');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('casesearch');
            obj1.set('name', 'Joe owns a dog');

            var obj2 = new CB.CloudObject('casesearch');
            obj2.set('name', 'Dogs eat cats');

            CB.CloudObject.saveAll([
                obj1, obj2
            ], {
                success: function(res) {

                    var query = new CB.CloudQuery('casesearch');
                    query.search("Dog", null, true);
                    query.find({
                        success: function(list) {
                            if (list.length == 1) {
                                done();
                            } else {
                                done("Failed  Case senstive search");
                            }

                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should perform Diacritic Sensitive  search ", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';
        Name.isSearchable = true;

        var table = new CB.CloudTable('diacriticsearch');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('diacriticsearch');
            obj1.set('name', 'Joe eats fish');

            var obj2 = new CB.CloudObject('diacriticsearch');
            obj2.set('name', 'Dogs êat cats');

            CB.CloudObject.saveAll([
                obj1, obj2
            ], {
                success: function(res) {

                    var query = new CB.CloudQuery('diacriticsearch');
                    query.search("êat", null, null, true);
                    query.find({
                        success: function(list) {
                            if (list.length == 1) {
                                done();
                            } else {
                                done("Failed  Diacritic Sensitive search");
                            }

                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should perform language Stop words  search ", function(done) {

        this.timeout(40000);

        CB.appKey = CB.masterKey;

        var Name = new CB.Column('name');
        Name.dataType = 'Text';
        Name.isSearchable = true;

        var table = new CB.CloudTable('stopsearch');
        table.addColumn(Name);

        table.save().then(function(res) {

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('stopsearch');
            obj1.set('name', 'algunas comidas');

            var obj2 = new CB.CloudObject('stopsearch');
            obj2.set('name', 'antes de dormir');

            //algunas and antes are stop words in spanish

            CB.CloudObject.saveAll([
                obj1, obj2
            ], {
                success: function(res) {

                    var query = new CB.CloudQuery('stopsearch');
                    query.search("algunas", "es");
                    query.find({
                        success: function(list) {
                            if (list.length == 0) {
                                done();
                            } else {
                                done("Failed  Language Stop words search");
                            }

                        },
                        error: function(error) {
                            done(error);
                        }
                    });

                },
                error: function(err) {
                    done(err);
                }
            });

        }, function(err) {
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";
        });

    });

    it("Should delete data based on query.", function(done) {

        this.timeout(30000);

        obj.set('name', 'Ritish');
        obj.save().then(function(list) {
            if (list.get('name') === 'Ritish') {
                var query = new CB.CloudQuery('student1');
                query.equalTo('name', 'Ritish');
                query.delete({
                    success: function(obj) {
                        query = new CB.CloudQuery('student1');
                        query.find({
                            success: function(list) {

                                if (list.length > 0) {

                                    var foundObj = false;
                                    for (var i = 0; i < list.length; ++i) {
                                        if (list[i].get("name") === "Ritish") {
                                            foundObj = true;
                                        }
                                    }

                                    if (!foundObj) {
                                        done();
                                    } else {
                                        done("Object not deleted");
                                    }

                                } else {
                                    done("Failed to get the list");
                                }

                            },
                            error: function(error) {
                                done("Failed to save the object");
                            }
                        });
                    },
                    error: function(err) {
                        done(err);
                    }
                })
            } else
                throw "object could not saved properly";
            }
        , function() {
            throw "data Save error";
        });

    });

});

describe("CloudQuery - Encryption", function () {

    it("should get encrypted passwords", function (done) {

        this.timeout(30000);
         
        var username = util.makeEmail();

        var obj = new CB.CloudObject('User');
        obj.set('username',username);
        obj.set('password','password');
        obj.set('email',util.makeEmail());

        obj.save().then(function(obj){
            if(obj.get('password') !== 'password'){
                //now run CloudQuery. 
                var query = new CB.CloudQuery('User');
                query.equalTo('password','password');
                query.equalTo('username',username);
                query.find({
                    success : function(list){
                        if(list.length>0){
                            done();
                        }
                        else{
                            throw "Cannot get items.";
                        }
                    }, error : function(query){
                        //cannot query. 
                        throw "Cannot query over encrypted type";
                    }
                })
            }

            else
                throw "Cannot encrypt";

        }, function(){
            throw "Cannot save a CloudObject";
        });

    });




     it("should get encrypted passwords over OR query", function (done) {

        this.timeout(30000);
         
        var username = util.makeEmail();

        var obj = new CB.CloudObject('User');
        obj.set('username',username);
        obj.set('password','password');
        obj.set('email',util.makeEmail());

        obj.save().then(function(obj){
            if(obj.get('password') !== 'password'){
                //now run CloudQuery. 
                var query1 = new CB.CloudQuery('User');
                query1.equalTo('password','password');

                 var query2 = new CB.CloudQuery('User');
                query2.equalTo('password','password1');

                var query = new CB.CloudQuery.or(query1, query2);
                query.equalTo('username',username);
                query.find({
                    success : function(list){
                        if(list.length>0){
                            done();
                        }
                        else{
                            throw "Cannot get items.";
                        }
                    }, error : function(query){
                        //cannot query. 
                        throw "Cannot query over encrypted type";
                    }
                })
            }

            else
                throw "Cannot encrypt";

        }, function(){
            throw "Cannot save a CloudObject";
        });

    });

    it("should not encrypt already encrypted passwords", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('User');
        obj.set('username',util.makeEmail());
        obj.set('password','password');
        obj.set('email',util.makeEmail());
        obj.save().then(function(obj){
            var query = new CB.CloudQuery('User');
            query.findById(obj.get('id')).then(function(obj1){
                obj1.save().then(function(obj2){
                    if(obj2.get('password') === obj2.get('password'))
                        done();
                },function(){
                    throw "Encrypted the password field again";
                });
            }, function (err) {
                throw "unable to find object by id";
            });
        }, function(){
            throw "Cannot save a CloudObject";
        });

    });

});