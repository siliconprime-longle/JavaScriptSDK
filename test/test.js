var CB = require('../lib/cloudboost.js');
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

   

	

describe("Server Check",function(){
    it("should check for localhost",function(done){
    	this.timeout(10000);
        var xmlhttp;
        this.timeout(10000);
        var req = typeof(require) === 'function' ? require : null;
        // Load references to other dependencies
        if (typeof(XMLHttpRequest) !== 'undefined') {
             xmlhttp = XMLHttpRequest;
            } else if (typeof(require) === 'function' &&
                typeof(require.ensure) === 'undefined') {
                xmlhttp = req('xmlhttprequest').XMLHttpRequest;
            }
            xmlhttp = new xmlhttp();
        xmlhttp.open('GET','http://localhost:4730',true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == xmlhttp.DONE) {
                if (xmlhttp.status == 200) {
                    CB.appId = "sample123";
                    CB.appKey = "9SPxp6D3OPWvxj0asw5ryA==";
                    CB.masterKey = "Qopoy/kXd+6G734HsjQMqGPGOvwEJYmBG84lQawRmWM=";
                    CB.jsKey = CB.appKey;
                    CB.serverUrl = 'http://localhost:4730';
                    CB.serviceUrl = 'http://localhost:3000';
                    CB.socketIoUrl = CB.serverUrl;
                    CB.apiUrl = CB.serverUrl;
                    done();

                }
                else {
                    if(window.mochaPhantomJS){
                         console.log('RUNNING IN PHANTOM JS'); 
                         CB.serverUrl = 'http://stagingdataservices.azurewebsites.net';
                         CB.serviceUrl = 'http://stagingfrontendservice.azurewebsites.net';
                         CB.socketIoUrl = CB.serverUrl;
                         CB.apiUrl = CB.serverUrl;
                    }
                    CB.appId = 'travis123';
                    CB.appKey = '6dzZJ1e6ofDamGsdgwxLlQ==';
                    CB.jsKey = CB.appKey;
                    CB.masterKey = "Qopoy/kXd+6G734HsjQMqGPGOvwEJYmBG84lQawRmWM="
                    done();
                }
            }
        }
    });
});

describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(500000);

        CB.CloudApp.init(CB.appId, CB.appKey);

        done();
    });
});

describe("Cloud Table", function(){

    before(function(){
        CB.appKey = CB.masterKey;
      });

    var tableName = util.makeString();

    it("should not create duplicate table",function(done){

        this.timeout(80000);


        var obj = new CB.CloudTable(tableName);

        obj.save().then(function(){
            var obj1 = new CB.CloudTable(tableName);
            obj1.save().then(function(){
                throw("should not create duplicate table");
            },function(){
                done();
            })
        },function(){
            throw "Should Create a table";
        });
    });

    it("should first create a table and then delete that table",function(done){
        this.timeout(100000);

        var tableName = util.makeString();
        var obj = new CB.CloudTable(tableName);
        obj.save().then(function(){
          obj.delete().then(function(){
              done();
          },function(){
              throw("should have delete the table");
          });
        },function(){
            throw("should have create the table");
        });

    });

    it("should get a table information",function(done){
        this.timeout(40000);
        var obj = new CB.CloudTable('Address');
        CB.CloudTable.get(obj).then(function(res){
            done();
        },function(){
            throw("should fetch the table");
        });
    });

    it("should get all tables from an app",function(done){
        this.timeout(40000);
        CB.CloudTable.getAll().then(function(res){
            if(res)
                done();
            else
                throw "Unable to Get table Data";
        },function(){
            throw("should get the all table");
        });
    });

    it("should update new column into the table",function(done){

        this.timeout(80000);

        var tableName1 = util.makeString();
        var tableName2 = util.makeString();
        var obj = new CB.CloudTable(tableName1);
        var obj1 = new CB.CloudTable(tableName2);
        obj.save().then(function () {
            obj1.save().then(function(){
                CB.CloudTable.get(obj, {
                    success: function(table){
                        var column1 = new CB.Column('Name11', 'Relation', true, false);
                        column1.relatedTo = tableName2;
                        table.addColumn(column1);
                        table.save().then(function(newTable){
                            var column2 = new CB.Column('Name11');
                            newTable.deleteColumn(column2);
                            newTable.save().then(function(){
                                done();
                            },function(){
                                throw("should save the table");
                            });
                        },function(){
                            throw("should save the table");
                        });
                    },
                    error: function(err){
                        throw("should fetch the table");
                    }
                });
            },function(){
                throw "Should Save Table";
            })
        },function(){
            throw "Should Save Table";
        });
    });

    it("should first create a table and then delete that table",function(done){

        this.timeout(80000);

        var tableName = util.makeString();
        var obj = new CB.CloudTable(tableName);
        obj.save().then(function(newTable){
          newTable.delete().then(function(){
              done();
          },function(){
              done("should have delete the table");
          });
        },function(){
            done("should have create the table");
        });

    });
	
	it("should add a column to an existing table",function(done){
        this.timeout(90000);
        var obj = new CB.CloudTable(tableName);
        CB.CloudTable.get(obj).then(function(table){
        	var column1 = new CB.Column('city', 'Text', true, false);
		    table.addColumn(column1);
		    table.save().then(function(table){
		          done();
		    },function(){
                throw "Unable to add column to existing table"
            });
        },function(){
            done("should fetch the table");
        });
        
    });
    
	it("should add a column to the table after save.",function(done){
        this.timeout(80000);

        var tableName = util.makeString();
        var table = new CB.CloudTable(tableName);
        table.save().then(function(table){
            var column1 = new CB.Column('Name1', 'Text', true, false);
            table.addColumn(column1);
            table.save().then(function(newTable){
              done();
              newTable.delete();
            });
        });
    });
    
    it("should get a table information",function(done){
        this.timeout(40000);
        var obj = new CB.CloudTable(tableName);
        CB.CloudTable.get(obj).then(function(){
            done();
        },function(){
            done("should fetch the table");
        });
    });

    it("should get all tables from an app",function(done){
        this.timeout(40000);
        CB.CloudTable.getAll().then(function(table){
            done();
        },function(){
            done("should get the all table");
        });
    });

    it("should not rename a table",function(done){

        this.timeout(80000);

        var obj = new CB.CloudTable(tableName);
        CB.CloudTable.get(obj).then(function(table){
            table.document.name = "sadjhkasj";
            table.save().then(function(){
                done("Should not rename the tableName");
            },function(){
               done();
            });
        },function(){
            done("should fetch the table");
        });
    });


    it("should not change type of table",function(done){

        this.timeout(80000);

      var obj = new CB.CloudTable(tableName);
      CB.CloudTable.get(obj).then(function(table){
          table.document.type = "NewType";
          table.save().then(function(newTable){
              done( "should not change the type of a table");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not rename a column",function(done){
        this.timeout(80000);
        var obj = new CB.CloudTable(tableName);
        CB.CloudTable.get(obj).then(function(table){
            table.document.columns[0].name = "abcd";
            table.save().then(function(){
                done("should not update the column name");
            },function(){
                done();
            });
        },function(){
            done("should fetch the table");
        });
    });

    it("should not change data type of a column",function(done){
      this.timeout(80000);
      var obj = new CB.CloudTable(tableName);
      CB.CloudTable.get(obj).then(function(table){
          table.document.columns[0].dataType = "abcd";
          table.save().then(function(){
              done("should not update the column dataType");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not change unique property of a default column",function(done){
      this.timeout(80000);
      var obj = new CB.CloudTable(tableName);
      CB.CloudTable.get(obj).then(function(table){
          table.document.columns[0].unique = false;
          table.save().then(function(){
              done("should not change unique property of a default column");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not change required property of a default column",function(done){
      this.timeout(80000);
      var obj = new CB.CloudTable(tableName);
      CB.CloudTable.get(obj).then(function(table){
          table.document.columns[0].required = false;
          table.save().then(function(){
              done("should not change required property of a default column");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not change unique property of a pre defined column",function(done){
      this.timeout(80000);
      var obj = new CB.CloudTable(tableName);
      CB.CloudTable.get(obj).then(function(table){
          if(table.document.columns[0].unique)
            table.document.columns[0].unique = false;
          else
            table.document.columns[0].unique = true;
          table.save().then(function(newTable){
              if(newTable.document.columns[0].unique !== table.columns[0].unique)
                done();
              else
                done("shouldChange unique property of a user defined column");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should change required property of a user defined column",function(done){

      this.timeout(80000);


      var obj = new CB.CloudTable(util.makeString());
      var name = new CB.Column("abc");
        name.required = true;
        obj.addColumn(name);
        obj.save().then(function(table){
          if(table.columns[5].required)
            table.columns[5].required = false;
          else
            table.columns[5].required = true;
          table.save().then(function(newTable){
              if(newTable.columns[5].required === table.columns[5].required)
                done();
              else
                done("should change required property of a user defined column");
          },function(){
              done("should change required property of a user defined column");

          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not delete a default column of a table",function(done){

        this.timeout(80000);
      var obj = new CB.CloudTable(tableName);
      CB.CloudTable.get(obj).then(function(table){
          table.deleteColumn('id');
          table.save().then(function(newTable){
              if(newTable.columns) {
                  if (newTable.columns[0].name === "id")
                      done();
                  else
                      done("Should not change the behaviour of predefined columns");
              }else
                done();
          },function(){
              done();
          });
      });
    });

    after(function() {
    	CB.appKey = CB.jsKey;
  	});


});

describe("Should Create All Test Tables",function(done){

    before(function(){
        this.timeout(10000);
        CB.appKey = CB.masterKey;
    });
   

  it("should delete tables",function(done){

        this.timeout(20000);
        var obj = new CB.CloudTable('Address');
        obj.delete().then(function(){
            done();
        },function(){
            throw "Unable to delete";
        });

    });

    it("should delete tables",function(done){

        this.timeout(20000);
        var obj = new CB.CloudTable('Company');
        obj.delete().then(function(){
            done();
        },function(){
            throw "Unable to delete";
        });

    }); 

    it("should delete tables",function(done){

        this.timeout(20000);
     
        var obj = new CB.CloudTable('Employee');
        obj.delete().then(function(){
            done();
        },function(){
            throw "Unable to delete";
        });

    });

    it("should create a table",function(done){

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
        obj.save().then(function(res){
            console.log(res);
            done();
        },function(){
            throw "Unable to Create Table";
        });
    });

    it("should create a table",function(done){

        this.timeout(50000);

        var obj = new CB.CloudTable('Company');
        var Revenue = new CB.Column('Revenue');
        Revenue.dataType = 'Number';
        var Name = new CB.Column('Name');
        Name.dataType = 'Text';
        obj.addColumn(Revenue);
        obj.addColumn(Name);
        obj.save().then(function(res){
            console.log(res);
            done();
        },function(){
            throw "Unable to Create Table";
        });
    });

    it("should create a table",function(done){

        this.timeout(50000);

        var obj = new CB.CloudTable('Address');
        var City = new CB.Column('City');
        City.dataType = 'Text';
        var PinCode = new CB.Column('PinCode');
        PinCode.dataType = 'Number';
        obj.addColumn(City);
        obj.addColumn(PinCode);
        obj.save().then(function(res){
            console.log(res);
            done();
        },function(){
            throw "Unable to Create Table";
        });
    });

    it("Should update the table schema",function(done){

        this.timeout(50000);

        var obj = new CB.CloudTable('Employee');
        CB.CloudTable.get(obj).then(function(res){
            var Company = new CB.Column('Company');
            Company.dataType = 'Relation';
            Company.relatedTo = 'Company';
            res.addColumn(Company);
            var Address = new CB.Column('Address');
            Address.dataType = 'Relation';
            Address.relatedTo = 'Address';
            res.addColumn(Address);
            res.save().then(function(res){
                console.log(res);
                done();
            },function(err){
                throw "Unable to Update schema of the table";
            })
        },function(){
            throw "Unable to get table";
        });
    });

    it("Should update the table schema",function(done){

        this.timeout(50000);

        var obj = new CB.CloudTable('Company');
        CB.CloudTable.get(obj).then(function(res){
            var Employee = new CB.Column('Employee');
            Employee.dataType = 'List';
            Employee.relatedTo = 'Employee';
            res.addColumn(Employee);
            var Address = new CB.Column('Address');
            Address.dataType = 'Relation';
            Address.relatedTo = 'Address';
            res.addColumn(Address);
            res.save().then(function(res){
                console.log(res);
                done();
            },function(err){
                throw "Unable to Update schema of the table";
            })
        },function(){
            throw "Unable to get table";
        });
    });



    it("should create table student4",function(done){

        this.timeout(50000);
        var callback = {};
        callback.success = function(res){
            var student = new CB.CloudTable('student4');
            var subject = new CB.Column('subject');
            subject.dataType = 'List';
            subject.relatedTo = 'Text';
            var age = new CB.Column('age');
            age.dataType = 'Number';
            student.addColumn(subject);
            student.addColumn(age);
            student.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Student";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('student4');
        obj.delete(callback);
    });


    it("should create table Role",function(done){

        this.timeout(50000);

        var callback = {};
        callback.success = function(res){
            var user = new CB.CloudTable('Role');
            user.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Role";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Role');
        obj.delete(callback);
    });


    it("should create table user",function(done){

        this.timeout(50000);

        var callback = {};
        callback.success = function(res){
            var user = new CB.CloudTable('User');
            user.save().then(function(res){
                done();
            },function(){
                throw "Unable to create user";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('User');
        obj.delete(callback);
    });

  it("should create table Custom",function(done){

        this.timeout(60000);


        var callback = {};
        callback.success = function(res){
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
            custom.addColumn(newColumn6);
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create user";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Custom');
        obj.delete(callback);
    });

    it("should update custom table ",function(done){

        this.timeout(60000);

        var custom = new CB.CloudTable('Custom');
        CB.CloudTable.get(custom).then(function(custom){
            var newColumn7 = new CB.Column('newColumn7');
            newColumn7.dataType = 'List';
            newColumn7.relatedTo = 'Custom';
            custom.addColumn(newColumn7);
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create user";
            });
        },function(){
           throw "Unable to get Table";
        });
    });

    it("should create table Custom5",function(done){

        this.timeout(60000);

        var callback = {};
        callback.success = function(res){
            var custom = new CB.CloudTable('Custom5');
            var newColumn = new CB.Column('location');
            newColumn.dataType = 'GeoPoint';
            custom.addColumn(newColumn);
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Custom5";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Custom5');
        obj.delete(callback);
    });


    it("should create table Sample",function(done){

        this.timeout(50000);


        var callback = {};
        callback.success = function(res){
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
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Sample";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Sample');
        obj.delete(callback);


    });


    it("should update Sample table ",function(done){

        this.timeout(50000);

        var custom = new CB.CloudTable('Sample');
        CB.CloudTable.get(custom).then(function(custom){
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
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to Update Sample";
            });
        },function(){
            throw "Unable to get Table";
        });
    });


    it("should create table hostel",function(done){

        this.timeout(50000);

        var callback = {};
        callback.success = function(res){
            var custom = new CB.CloudTable('hostel');
            var newColumn = new CB.Column('room');
            newColumn.dataType = 'Number';
            custom.addColumn(newColumn);
            var newColumn1 = new CB.Column('name');
            newColumn1.dataType = 'Text';
            custom.addColumn(newColumn1);
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create hostel";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('hostel');
        obj.delete(callback);


    });

    //create Hostel
    it("should create table student1",function(done){

        this.timeout(50000);

        var callback = {};
        callback.success = function(res){
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
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Sample";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('student1');
        obj.delete(callback);
    });

    it("should create table Student",function(done){

        this.timeout(50000);


        var callback = {};
        callback.success = function(res){
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
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Student";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Student');
        obj.delete(callback);

    });

    it("should create table Custom18",function(done){

        this.timeout(50000);

        var callback = {};
        callback.success = function(res){
            var custom = new CB.CloudTable('Custom18');
            var newColumn = new CB.Column('number');
            newColumn.dataType = 'Number';
            custom.addColumn(newColumn);
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Custom18";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Custom18');
        obj.delete(callback);

    });

    it("should create table Custom3",function(done){

        this.timeout(50000);

        var callback = {};
        callback.success = function(res){
            var custom = new CB.CloudTable('Custom3');
            var newColumn = new CB.Column('address');
            newColumn.dataType = 'Text';
            custom.addColumn(newColumn);
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Custom3";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Custom3');
        obj.delete(callback);


    });

    it("should create table Custom7",function(done){

        this.timeout(50000);

        var callback = {};
        callback.success = function(res){
            var custom = new CB.CloudTable('Custom7');
            var newColumn = new CB.Column('requiredNumber');
            newColumn.dataType = 'Number';
            custom.addColumn(newColumn);
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Custom7";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Custom7');
        obj.delete(callback);
    });

    it("should create table Custom2",function(done){

        this.timeout(50000);

        var callback = {};
        callback.success = function(res){
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
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Custom2";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Custom2');
        obj.delete(callback);
    });

    it("should create table Custom4",function(done){

        this.timeout(50000);


        var callback = {};
        callback.success = function(res){
            var custom = new CB.CloudTable('Custom4');
            var newColumn = new CB.Column('newColumn1');
            newColumn.dataType = 'Text';
            custom.addColumn(newColumn);
            var newColumn1 = new CB.Column('newColumn7');
            newColumn1.dataType = 'List';
            newColumn1.relatedTo = 'student1';
            custom.addColumn(newColumn1);
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Custom4";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Custom4');
        obj.delete(callback);


    });


    it("should create table Custom14",function(done){

        this.timeout(50000);


        var callback = {};
        callback.success = function(res){
            var custom = new CB.CloudTable('Custom14');
            var newColumn = new CB.Column('ListNumber');
            newColumn.dataType = 'List';
            newColumn.relatedTo = 'Number';
            custom.addColumn(newColumn);
            var newColumn1 = new CB.Column('ListGeoPoint');
            newColumn1.dataType = 'List';
            newColumn1.relatedTo = 'GeoPoint';
            custom.addColumn(newColumn1);
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Custom14";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Custom14');
        obj.delete(callback);


    });

   it("should create table Custom1",function(done){

        this.timeout(50000);


        var callback = {};
        callback.success = function(res){
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
            
            custom.save().then(function(res){
                done();
            },function(){
                throw "Unable to create Custom1";
            });
        };
        callback.error = function(){
            throw "Unable to Delete";
        };
        var obj = new CB.CloudTable('Custom1');
        obj.delete(callback);


    });

    after(function() {
        CB.appKey = CB.jsKey;
    });

});
describe("Table Tests", function (done) {

    before(function(){
        CB.appKey = CB.masterKey;
    });

    it("Should Give all the tables", function (done) {

        this.timeout(30000);

        CB.CloudTable.getAll().then(function(res){
            done();
        },function(){
            throw "Unable to get tables";
        });
    });

    it("Should Give specific tables", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudTable('Role');
        CB.CloudTable.get(obj).then(function(res){
            done();
        },function(){
            throw "Unable to get tables";
        });
    });

    it("Should give table with tableName",function(done){

        this.timeout(10000);

        CB.CloudTable.get('Employee').then(function(res) {
            if(res){
                done();
            }else
                throw "Unable to Get table by name";
        },function(){
           throw "unable to get table by name";
        });
    });

    it("should create a column and then delete it",function(done){

        this.timeout(20000);

        CB.CloudTable.get('Employee').then(function(emp){
            var column = new CB.Column('Test2');
            emp.addColumn(column);
            emp.save().then(function(emp){
                emp.deleteColumn('Test2');
                emp.save().then(function(){
                    done();
                },function(){
                   throw "Unable to drop coumn";
                });
            },function(){
                throw "Unable to add Column";
            });
        },function(err){
            throw "Unable to get cloudtable";
        });
    });

    it("Should wait for other tests to run",function(done){

        this.timeout(100000);

        setTimeout(function(){
            done();
        },10000);

    });

    after(function() {
        CB.appKey = CB.jsKey;
    });

});
describe("ACL", function () {

    it("Should set the public write access", function (done) {

        this.timeout(20000);

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
        }


        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicWriteAccess(false);
        obj.save().then(function(list) {
            var acl=list.get('ACL');
            if(acl.write.deny.user.length === 0) {
                obj.set('age',15);
                obj.save().then(function(){
                    throw "Should not save object with no right access";
                },function(){
                    done();
                });
            }
            else
                throw "public write access set error"
        }, function () {
            throw "public write access save error";
        });
    });

    it("Should set the public read access", function (done) {

        this.timeout(20000);

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
        }


        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            var acl=list.get('ACL');
            if(acl.read.deny.user.length === 0)
                done();
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });
    var username = util.makeString();
    var passwd = "abcd";
    var userObj = new CB.CloudUser();

    it("Should create new user", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    it("Should set the user read access", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setUserReadAccess(userObj.get('id'),true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.indexOf(userObj.get('id')) >= 0)
                done();
            else
                throw "user read access set error"
        }, function () {
            throw "user read access save error";
        });

    });

    it("Should allow users of role to write", function (done) {
        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }


        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setRoleWriteAccess(userObj.get('id'),true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.allow.role.indexOf(userObj.get('id'))>=0)
                done();
            else
                throw "user role write access set error"
        }, function () {
            throw "user role write access save error";
        });

    });

    it("Should allow users of role to read", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
        }

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.ACL.setRoleReadAccess(userObj.get('id'),true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.role.indexOf(userObj.get('id'))>=0)
                done();
            else
                throw "user role read access set error"
        }, function () {
            throw "user role read access save error";
        });

    });
});


describe("ACL on CloudObject Notifications", function () {

    it("Should create new user and listen to CloudNotification events.", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        var isDone = false;

        this.timeout(20000);

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(){
                CB.CloudObject.off('User','created');
                if(!isDone){
                    isDone=true;
                    done();
                }
                
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.save();
           
        }, function (error) {
            done("user create error");
        });

    });

    it("Should NOT receieve a  notification when public read access is false;", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        var isDone = false;

        this.timeout(30000);

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(data){
                CB.CloudObject.off('User','created');
                if(!isDone){
                    isDone=true;
                     done("Sent notification when set public read access is false");
                }
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.ACL = new CB.ACL();
            userObj.ACL.setPublicReadAccess(false);

            userObj.save();

            setTimeout(function(){ 
                console.log('Done!');
                if(!isDone){
                    isDone=true;
                    done();
                }

            }, 1000); //wait for sometime and done! 
           
        }, function (error) {
            throw "user create error";
        });

    });

    it("Should NOT receivee an event when user read access is false;", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(){
                CB.CloudObject.off('User','created');
                if(!isDone){
                    isDone=true;
                     done("Sent notification when set public read access is false");
                }
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.ACL = new CB.ACL();
            userObj.ACL.setUserReadAccess(user.id, false);

            userObj.save();

            setTimeout(function(){ 
               if(!isDone){
                    isDone=true;
                    done();
                }
            }, 10000); //wait for sometime and done! 
           
        }, function (error) {
            done("user create error");
        });

    });

    it("Should NOT receieve a  notification when public read access is true but user is false;", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(){
                CB.CloudObject.off('User','created');
                if(!isDone){
                    isDone=true;
                     done("Sent notification when set public read access is false");
                }
               
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.ACL = new CB.ACL();
            userObj.ACL.setPublicReadAccess(true);
            userObj.ACL.setUserReadAccess(user.id, false);

            userObj.save();

            setTimeout(function(){ 
                if(!isDone){
                    isDone=true;
                    done();
                }
             }, 10000); //wait for sometime and done! 
           
        }, function (error) {
            done("user create error");
        });

    });


    it("Should receieve a notification when public read access is false but user is true;", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(){
               CB.CloudObject.off('User','created');
               if(!isDone){
                    isDone=true;
                    done();
                }
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.ACL = new CB.ACL();
            userObj.ACL.setPublicReadAccess(false);
            userObj.ACL.setUserReadAccess(user.id, true);

            userObj.save();

        }, function (error) {
            done("user create error");
        });

    });

    it("Should NOT receieve a notification when user is logged out.", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('Custom1', 'created', function(){
               CB.CloudObject.off('Custom1','created');
               if(!isDone){
                    isDone=true;
                    done("Wrong event fired");
                }
            });

            var obj = new CB.CloudObject('Custom1'); 
            obj.set('newColumn', 'Sample');
            obj.ACL = new CB.ACL();
            obj.ACL.setPublicReadAccess(false);
            obj.ACL.setPublicWriteAccess(true);
            obj.ACL.setUserReadAccess(user.id, true);

            user.logOut({
                success: function(user){

                    obj.save();

                    setTimeout(function(){ 
                        if(!isDone){
                            isDone=true;
                            done();
                        }
                     }, 10000); //wait for sometime and done! 

                }, error : function(error){
                    done("Error");
                }
            });

        }, function (error) {
            done("user create error");
        });

    });

    it("Should receieve a notification when user is logged out and logged back in.", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('Custom1', 'created', function(){
               CB.CloudObject.off('Custom1','created');
               if(!isDone){
                    isDone=true;
                    done();
                }
            });

            var obj = new CB.CloudObject('Custom1'); 
            obj.set('newColumn', 'Sample');
            obj.ACL = new CB.ACL();
            obj.ACL.setPublicReadAccess(false);
            obj.ACL.setPublicWriteAccess(true);
            obj.ACL.setUserReadAccess(user.id, true);

            user.logOut({
                success: function(user){
                console.log(user);
                    user.set("password",passwd);
                    user.logIn({
                        success : function(){
                             obj.save();

                        }, error: function(){
                            done("Failed to login a user");
                        }
                    });

                   

                }, error : function(error){
                    done("Error");
                }
            });

        }, function (error) {
            done("user create error");
        });

    });
});


describe("Query_ACL", function () {

    var obj = new CB.CloudObject('student4');
    obj.isSearchable = true;
    obj.set('age',55);

    var username = util.makeString();
    var passwd = "abcd";
    var user = new CB.CloudUser();
    it("Should create new user", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);
        user.set('username', username);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    it("Should set the public read access", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }


        this.timeout(20000);

        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.length === 0) {
                var cq = new CB.CloudQuery('student4');
                cq. equalTo('age',55);
                cq.find().then(function(list){
                    if(list.length>0)
                    {
                        throw "should not return items";
                    }
                    else
                        done();
                },function(){
                    throw "should perform the query";
                });
            }
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });

    var obj1 = new CB.CloudObject('student4');
    obj1.isSearchable = true;
    obj1.set('age',60);
    it("Should search object with user read access", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);
        obj1.ACL = new CB.ACL();
        obj1.ACL.setUserReadAccess(user.document._id,false);
        obj1.save().then(function(list) {
            acl=list.get('ACL');
           // if(acl.read.indexOf(user.document._id) >= 0) {
                var user = new CB.CloudUser();
                user.set('username', username);
                user.set('password', passwd);
                user.logIn().then(function(){
                    var cq = new CB.CloudQuery('student4');
                    cq.equalTo('age',60);
                    cq.find().then(function(){
                        done();
                    },function(){
                        throw "should retrieve object with user read access";
                    });
                },function(){
                    throw "should login";
                });
        }, function () {
            throw "user read access save error";
        });

    });



});


    describe("Search_ACL", function () {

    var obj = new CB.CloudObject('student4');
    obj.set('age',150);

        var username = util.makeString();
        var passwd = "abcd";
        var user = new CB.CloudUser();
        it("Should create new user", function (done) {

            if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

            this.timeout(20000);
            user.set('username', username);
            user.set('password',passwd);
            user.set('email',util.makeEmail());
            user.signUp().then(function(list) {
                if(list.get('username') === username)
                    done();
                else
                    throw "create user error"
            }, function () {
                throw "user create error";
            });

        });


   it("Should set the public read access to false", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
        }

        this.timeout(20000);

        obj.ACL = new CB.ACL();
        CB.CloudUser.current.logOut();
        obj.ACL.setUserReadAccess(CB.CloudUser.current.id,true);
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.indexOf('all') === -1) {
             var cs = new CB.CloudSearch('student4');
                cs.searchQuery = new CB.SearchQuery();
                cs.searchQuery.searchOn('age',150);
                cs.search().then(function(list){
                    if(list.length>0)
                    {
                        for(var i=0;i<list.length;i++)
                            if(list[i].get('age') && list[i].ACL.read.allow.user.indexOf('all') === -1)
                                throw "should not return items";
                    }
                    
                    done();
                },function(){
                    done();
                });
            }
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });

   it("Should search object with user read access", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
        }

        this.timeout(20000);
       var user = new CB.CloudUser();
       user.set('username', username);
       user.set('password', passwd);
       user.logIn().then(function(){
            obj.ACL = new CB.ACL();
            obj.save().then(function(list) {
                acl=list.get('ACL');
                    var cs = new CB.CloudSearch('student4');
                     cs.searchQuery = new CB.SearchQuery();
                    cs.searchQuery.searchOn('age',15);

                    cs.search().then(function(){
                        done();
                    },function(){
                        throw "should retrieve object with user read access";
                    });
            }, function () {
                throw "user read access save error";
            });
       },function(){
           throw "should login";
       });

    });

});


describe("Cloud Files", function(done) {

    it("Should Save a file with file data and name",function(done){

        this.timeout(10000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);
        fileObj.save().then(function(file){
            console.log(file);
            if(file.url) {
                console.log(file);
                console.log("Saved file");
                done();
            }else{
                throw 'ún able to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });


    it("Should Save a file and give the url",function(done){

        this.timeout(10000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);
        fileObj.save().then(function(file){
            if(file.url) {
                console.log(file);
                console.log("Saved file");
                done();
            }else{
                throw 'ún able to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });

    it("Should delete a file with file data and name",function(done){

        this.timeout(10000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);
        fileObj.save().then(function(file){
            if(file.url) {
                file.delete().then(function(file){
                    console.log(file);
                    if(file.url === null)
                        done();
                    else
                        throw "file delete error"
                },function(err){
                    throw "unable to delete file";
                });
            }else{
                throw 'ún able to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });

    try {

        if (window) {
            it("should save a new file", function (done) {

                this.timeout(20000);
                var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                try {
                    var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                } catch (e) {
                    var builder = new WebKitBlobBuilder();
                    builder.append(aFileParts);
                    var oMyBlob = builder.getBlob();
                }
                var file = new CB.CloudFile(oMyBlob);

                file.save().then(function (file) {
                    if (file.url) {
                        done();
                    } else {
                        throw "Upload success. But cannot find the URL.";
                    }
                }, function (err) {
                    throw "Error uploading file";
                });

            });
            it("should delete a file", function (done) {

                this.timeout(200000);
                var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                try {
                    var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                } catch (e) {
                    var builder = new WebKitBlobBuilder();
                    builder.append(aFileParts);
                    var oMyBlob = builder.getBlob();
                }
                var file = new CB.CloudFile(oMyBlob);

                file.save().then(function (file) {
                    if (file.url) {
                        //received the blob's url
                        console.log(file.url);
                        file.delete().then(function (file) {
                            if (file.url === null) {
                                done();
                            } else {
                                throw "File deleted, url in SDK not deleted";
                            }
                        }, function (err) {
                            throw "Error deleting file";
                        })
                    } else {
                        throw "Upload success. But cannot find the URL.";
                    }
                }, function (err) {
                    throw "Error uploading file";
                });
            });
            it("should save a new file", function (done) {

                this.timeout(20000);
                var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                try {
                    var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                } catch (e) {
                    var builder = new WebKitBlobBuilder();
                    builder.append(aFileParts);
                    var oMyBlob = builder.getBlob();
                }
                var file = new CB.CloudFile(oMyBlob);
                var file1 = new CB.CloudFile(oMyBlob);

                var obj = new CB.CloudObject('Sample');
                obj.set('fileList', [file, file1]);
                obj.set('name', 'abcd');
                obj.save().then(function (file) {
                    if (file.get('fileList')[0].url && file.get('fileList')[1].url) {
                        done();
                    } else {
                        throw "Upload success. But cannot find the URL.";
                    }
                }, function (err) {
                    throw "Error uploading file";
                });

            });
        }
    }catch(e){
        console.log('In node');
    }



    //add ACL on CloudFiles.
    
});

describe("Bulk API",function(done){

    it("should save array of CloudObject using bulk Api",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Student');
        obj.set('name','Vipul');
        var obj1 = new CB.CloudObject('Student');
        obj1.set('name','ABCD');
        var arr = [obj,obj1];
        CB.CloudObject.saveAll(arr).then(function(res){
            console.log(res);
            done();
        },function(err){
            throw "Unable to Save CloudObject";
        });
    });

    it("should save and then delete array of CloudObject using bulk Api",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Student');
        obj.set('name','Vipul');
        var obj1 = new CB.CloudObject('Student');
        obj1.set('name','ABCD');
        var arr = [obj,obj1];
        CB.CloudObject.saveAll(arr).then(function(res){
            console.log(res);
            CB.CloudObject.deleteAll(res).then(function(res){
                console.log(res);
                done();
            },function(err){
                throw "Unable to Delete CloudObject";
            });
        },function(err){
            throw "Unable to Save CloudObject";
        });
    });

    try {
        if(window) {

            it("Should save CloudObject Array with unsaved files", function (done) {

                this.timeout(20000);

                var data = 'akldaskdhklahdasldhd';
                var name = 'abc.txt';
                var type = 'txt';
                var fileObj = new CB.CloudFile(name, data, type);
                var obj = new CB.CloudObject('Sample');
                obj.set('name', 'vipul');
                obj.set('file', fileObj);
                var data = 'akldaskdhklahdasldhd';
                var name = 'abc.txt';
                var type = 'txt';
                var fileObj1 = new CB.CloudFile(name, data, type);
                var obj1 = new CB.CloudObject('Sample');
                obj1.set('name', 'ABCD');
                obj1.set('file', fileObj1);
                CB.CloudObject.saveAll([obj, obj1]).then(function (res) {
                    console.log(res);
                    done();
                }, function (err) {
                    throw "Unable to Save CloudObject";
                });

            });
        }
    }catch(e){
        console.log("Not in Browser");
    }

    it("Should properly save a relation in Bulk API",function(done){

        this.timeout(10000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'Course');
        var obj3 = new CB.CloudObject('Custom3');
        obj3.set('address','progress');
        obj.set('newColumn2',obj3);
        CB.CloudObject.saveAll([obj,obj3]).then(function(res) {
            if(res[1].get('id') === res[0].get('newColumn2').get('id'))
                done();
            else
                throw "Unable to Save Relation properly";
        }, function () {
            throw "Relation Save error";
        });
    });

    it("Should properly save a relation in Bulk API",function(done){

        this.timeout(10000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'Course');
        var obj3 = new CB.CloudObject('Custom3');
        obj3.set('address','progress');
        obj.set('newColumn2',obj3);
        CB.CloudObject.saveAll([obj3,obj]).then(function(res) {
            if(res[0].get('id') === res[1].get('newColumn2').get('id'))
                done();
            else
                throw "Unable to Save Relation properly";
        }, function () {
            throw "Relation Save error";
        });
    });
});
describe("CloudObject - Encryption", function (done) {

    it("should encrypt passwords", function (done) {

        this.timeout(20000);
        
        var obj = new CB.CloudObject('User');
        obj.set('username',util.makeEmail());
        obj.set('password','password');
        obj.set('email',util.makeEmail());
        obj.save().then(function(obj){
            if(obj.get('password') !== 'password')
                done();
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
                obj1.set('updatedAt',new Date());
                obj1.save().then(function(obj2){
                    if(obj1.get('password') === obj2.get('password'))
                        done();
                    else
                        throw "password encrypted twice";
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
describe("CloudObjectExpires", function () {

    it("should save a CloudObject after expire is set", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.save().then(function(obj1) {
            done();
        }, function (err) {
            console.log(err);
            throw "Cannot save an object after expire is set";
        });

    });

    it("objects expired should not show up in query", function (done) {

        this.timeout(20000);
        var curr=new Date().getTime();
        var query1 = new CB.CloudQuery('student1');
        query1.equalTo('name','vipul');
        var query2 = new CB.CloudQuery('student1');
        query2.lessThan('age',12);
        var query =  CB.CloudQuery.or(query1,query2);
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    if(list[i].expires > curr || !list[i].expires){
                            break;
                        }
                    else{
                        throw "Expired Object Retrieved";
                    }
                }
                done();
                }else{
                    done();
            }

        }, function(error){

        })

    });


    it("objects expired should not show up in Search", function (done) {

        this.timeout(20000);
        var curr=new Date().getTime();
        var query = new CB.CloudSearch('student1');
        
        var searchFilter1 = new CB.SearchFilter();
        searchFilter1.equalTo('name','vipul');

        var searchFilter2 = new CB.SearchFilter();
        searchFilter2.lessThan('age',12);

        var searchFilter = new CB.SearchFilter();
        searchFilter.or(searchFilter1);
        searchFilter.or(searchFilter2);

        query.searchFilter = searchFilter;
        
        query.search({
            success:function(list){
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].expires > curr || !list[i].expires) {
                        break;
                    }
                    else {
                        throw "expired object retrieved in Search";
                    }
                }
                done();
            }else{ done();
            }
            },error: function(error){
                throw "should not show expired objects";
            }
            });

    });
});
describe("Cloud Objects Files", function() {

    try {
        if(window) {
            var obj = new CB.CloudObject('Student');

            it("should save a file inside of an object", function (done) {

                this.timeout(20000);

                //save file first.
                var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                try {
                    var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                } catch (e) {
                    var builder = new WebKitBlobBuilder();
                    builder.append(aFileParts);
                    var oMyBlob = builder.getBlob();
                }
                var file = new CB.CloudFile(oMyBlob);

                file.save().then(function (file) {
                    if (file.url) {
                        console.log(file);
                        //create a new object.
                        var obj = new CB.CloudObject('Sample');
                        obj.set('name', 'sample');
                        obj.set('file', file);

                        obj.save().then(function (newobj) {
                            if (newobj.get('file') instanceof CB.CloudFile && newobj.get('file').url) {
                                done();
                            } else {
                                throw "object saved but didnot return file.";
                            }
                        }, function (error) {
                            throw "error saving an object.";
                        });

                    } else {
                        throw "upload success. but cannot find the url.";
                    }
                }, function (err) {
                    throw "error uploading file";
                });

            });

            it("should save an array of files.", function (done) {
                this.timeout(200000);
                //save file first.
                var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                try {
                    var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                } catch (e) {
                    var builder = new WebKitBlobBuilder();
                    builder.append(aFileParts);
                    var oMyBlob = builder.getBlob();
                }
                var file = new CB.CloudFile(oMyBlob);

                file.save().then(function (file) {
                    if (file.url) {

                        var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                        try {
                            var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                        } catch (e) {
                            var builder = new WebKitBlobBuilder();
                            builder.append(aFileParts);
                            var oMyBlob = builder.getBlob();
                        }
                        var file1 = new CB.CloudFile(oMyBlob);

                        file1.save().then(function (file1) {
                            if (file1.url) {

                                //create a new object.
                                var obj = new CB.CloudObject('Sample');
                                obj.set('name', 'sample');
                                obj.set('fileList', [file, file1]);

                                obj.save().then(function (newObj) {
                                    done();
                                }, function (error) {
                                    throw "Error Saving an object.";
                                });

                            } else {
                                throw "Upload success. But cannot find the URL.";
                            }
                        }, function (err) {
                            throw "Error uploading file";
                        });

                    } else {
                        throw "Upload success. But cannot find the URL.";
                    }
                }, function (err) {
                    throw "Error uploading file";
                });
            });

            it("should save an object with unsaved file.", function (done) {
                done();
            });
        }
    }catch(e){
        console.log("Not in Browser");
    }

});
describe("Cloud Objects Notification", function() {
  
	var obj = new CB.CloudObject('Student');
    var obj1 = new CB.CloudObject('student4');

    it("should alert when the object is created.", function(done) {

      this.timeout(40000);

      CB.CloudObject.on('Student', 'created', function(data){
       if(data.get('name') === 'sample') {
           console.log(data);
           done();
           CB.CloudObject.off('Student','created',{success:function(){},error:function(){}});
       }
       else
        throw "Wrong data received.";
      }, {
      	success : function(){
      		obj.set('name', 'sample');
      		obj.save().then(function(newObj){
      			obj = newObj;
      		});
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });



   it("should throw an error when wrong event type is entered. ", function(done) {

       this.timeout(20000);
     	try{
     	  CB.CloudObject.on('Student', 'wrongtype', function(data){
	      	throw 'Fired event to wrong type.';
	      });

	      throw 'Listening to wrong event type.';
     	}catch(e){
     		done();
     	}     

    });

    it("should alert when the object is updated.", function(done) {

      this.timeout(40000);
      CB.CloudObject.on('student4', 'updated', function(data){
        done();
          CB.CloudObject.off('student4','updated',{success:function(){},error:function(){}});
      }, {
      	success : function(){
            obj1.save().then(function(){
      		    obj1.set('age', 15);
      		    obj1.save().then(function(newObj){
      			    obj1 = newObj;
      		    }, function(){
      			    throw 'Error Saving an object.';
      		    });
            },function(){
                throw 'Error Saving an object.'
            });
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}

      });
    });

    it("should alert when the object is deleted.", function(done) {

      this.timeout(50000);

      CB.CloudObject.on('Student', 'deleted', function(data){
      	if(data instanceof CB.CloudObject) {
            done();
            CB.CloudObject.off('Student','deleted',{success:function(){},error:function(){}});
        }
        else
          throw "Wrong data received.";
      }, {
      	success : function(){
      		obj.set('name', 'sample');
      		obj.delete();
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });

    it("should alert when multiple events are passed.", function(done) {
      this.timeout(20000);
      var cloudObject = new CB.CloudObject('Student');
      var count = 0;
      CB.CloudObject.on('Student', ['created', 'deleted'], function(data){
      	count++;
      	if(count === 2){
      		done();
      	}
      }, {
      	success : function(){
      		cloudObject.set('name', 'sample');
      		cloudObject.save({
      			success: function(newObj){
      				cloudObject = newObj;
      				cloudObject.set('name', 'sample1');
      				cloudObject.save();
      				cloudObject.delete();
      			}
      		});

      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });

    it("should alert when all three events are passed", function(done) {

      this.timeout(20000);
       
      var cloudObject = new CB.CloudObject('Student');
      var count = 0;
      CB.CloudObject.on('Student', ['created', 'deleted', 'updated'], function(data){
      	count++;
      	if(count === 3){
      		done();
      	}
      }, {
      	success : function(){
      		cloudObject.set('name', 'sample');
      		cloudObject.save({
      			success : function(newObj){
      				cloudObject = newObj; 
      				cloudObject.set('name', 'sample1');
      				cloudObject.save({success : function(newObj){
	      				cloudObject = newObj; 
	      				cloudObject.delete();
	      			}
	      			});
      			}
      		});
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });

    it("should stop listening.", function(done) {

     this.timeout(20000);
      
      var cloudObject = new CB.CloudObject('Student');
      var count = 0;
      CB.CloudObject.on('Student', ['created','updated','deleted'], function(data){
          count++;
      }, {
      	success : function(){
      		CB.CloudObject.off('Student', ['created','updated','deleted'], {
		      	success : function(){
		      		cloudObject.save();
		      	}, error : function(error){
		      		throw 'Error on stopping listening to an event.';
		      	}
		      });
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });

      setTimeout(function(){
      	if(count ===  0){
      		done();
      	}else{
      		throw 'Listening to events even if its stopped.';
      	}

      }, 5000);
    });

});
describe("Query on Cloud Object Notifications ", function() {

	//Use Sample Table. 
	// -> Which has columns : 
	// name : string : required. 

    it("limit : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.limit = 2;   

        var count = 0;

        CB.CloudObject.on('Student', 'created', query, function(){
           ++count;
        });

        for(var i=0;i<3;i++){
            //attach it to the event. 
            var obj = new CB.CloudObject('Student');
            obj.set('name','Nawaz');
            obj.save();
        }

        setTimeout(function(){
            if(count === 2){
                 if(!isDone){
                    isDone=true;
                    done();
                 };
            }else{
                 if(!isDone){
                    isDone=true;
                    done("Limit Error");
                 };
            }
        }, 30000)

    });    

    it("skip : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.skip = 1;   

        var count = 0;

        CB.CloudObject.on('Student', 'created', query, function(data){
           ++count;
        });

        for(var i=0;i<3;i++){
            //attach it to the event. 
            var obj = new CB.CloudObject('Student');
            obj.set('name','Nawaz');
            obj.save();
        }

        setTimeout(function(){
            if(count === 2){
                 if(!isDone){
                    isDone=true;
                    done();
                 };
            }else{
                 if(!isDone){
                    isDone=true;
                    done("Limit Error");
                 };
            }
        }, 20000);

    });
  

    it("notification should work on equalTo Columns",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.equalTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done();
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample');
        obj.save();

    });

    it("should work on equalTo Columns : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.equalTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample1');
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                }
        }, 10000);
    });


    it("should work on notEqualTo Columns : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notEqualTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample1');
        obj.save();

    });


     it("should work on notEqualTo Columns : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notEqualTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample');
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);
    });


    it("greaterThan : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("greaterThan : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });


    it("lessThan : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();
    });


    it("lessThan : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("Exists : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.exists('age');

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("Exists : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.exists('name');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("doesNotExist : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.doesNotExists('name');

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("doesNotExist : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.doesNotExists('age');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("GTE : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThanEqualTo('age',11);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("GTE : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThanEqualTo('age',9);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',8);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });


    it("LTE : 1",function(done){

        var isDone = false;
        
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThanEqualTo('age',11);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("LTE : 2",function(done){

        var isDone = false; 

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThanEqualTo('age',9);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("containedIn : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containedIn('age',[11]);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });

    it("containedIn : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containedIn('age',[9]);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("notContainedIn : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notContainedIn('age',[10]);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });

    it("notContainedIn : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notContainedIn('age',[9]);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });   

    it("containsAll : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containsAll('age',[11]);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("containsAll : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containsAll('age',[8]);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });


    it("or : 1",function(done){

        var isDone = false;
        
        this.timeout(30000);
        //create the query. 
        var query1 = new CB.CloudQuery('Student');
        query1.equalTo('age',8);

        var query2 = new CB.CloudQuery('Student');
        query2.equalTo('name','Nawaz');

        var query = CB.CloudQuery.or(query1, query2);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',8);
        obj.save();
    });       

    it("or : 2",function(done){

        var isDone = false;
        
        this.timeout(30000);
        //create the query. 
        var query1 = new CB.CloudQuery('Student');
        query1.equalTo('age',8);

        var query2 = new CB.CloudQuery('Student');
        query2.equalTo('name','Nawaz');

        var query = CB.CloudQuery.or(query1, query2);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("startsWith : 1",function(done){

        var isDone = false;
        
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.startsWith('name','N');       

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Nawaz');
        obj.save();
    });       

    it("startsWith : 2",function(done){

        var isDone = false;
        
        this.timeout(30000);
      
        var query = new CB.CloudQuery('Student');
        query.startsWith('name','N');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','x');
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });


    it("EqualTo over CloudObjects : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');
        child.save({
            success : function(child){
               
                //create the query. 
                var query = new CB.CloudQuery('Custom2');
                query.equalTo('newColumn7', child);

                CB.CloudObject.on('Custom2', 'created', query, function(data){
                   if(!isDone){
                        isDone=true;
                        done();
                    }
                });

                var obj = new CB.CloudObject('Custom2');
                obj.set('newColumn7',child);
                obj.save();

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("EqualTo over CloudObjects : 2",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');

        child.save({
            success : function(child){
                var child2 = new CB.CloudObject('student1');
        
                child2.save({
                    success : function(child2){
                        //create the query. 
                        var query = new CB.CloudQuery('Custom2');
                        query.equalTo('newColumn7', child2);

                        CB.CloudObject.on('Custom2', 'created', query, function(data){
                            if(!isDone){
                                isDone=true;
                                done("Wrong event fired");
                            }
                        });

                        var obj = new CB.CloudObject('Custom2');
                        obj.set('newColumn7',child);
                        obj.save();

                        setTimeout(function(){
                            if(!isDone){
                                    isDone=true;
                                    done();
                                };
                        }, 10000);
                    }, error : function(error){
                     done("Object cannot be saved");
                }
            });

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });

    it("ContainedIn : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');
        child.save({
            success : function(child){
               
                //create the query. 
                var query = new CB.CloudQuery('Custom4');
                query.containedIn('newColumn7', [child]);

                CB.CloudObject.on('Custom4', 'created', query, function(data){
                   if(!isDone){
                        isDone=true;
                        done();
                    }
                });

                var obj = new CB.CloudObject('Custom4');
                obj.set('newColumn7',[child]);
                obj.save();

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("ContainedIn : 2",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');

        child.save({
            success : function(child){
                var child2 = new CB.CloudObject('student1');
        
                child2.save({
                    success : function(child2){
                        //create the query. 
                        var query = new CB.CloudQuery('Custom4');
                        query.containedIn('newColumn7', [child2]);

                        CB.CloudObject.on('Custom4', 'created', query, function(data){
                            if(!isDone){
                                isDone=true;
                                done("Wrong event fired");
                            }
                        });

                        var obj = new CB.CloudObject('Custom4');
                        obj.set('newColumn7',[child]);
                        obj.save();

                        setTimeout(function(){
                            if(!isDone){
                                    isDone=true;
                                    done();
                                };
                        }, 10000);
                    }, error : function(error){
                     done("Object cannot be saved");
                }
            });

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("ContainsAll : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');
        child.save({
            success : function(child){
               
                //create the query. 
                var query = new CB.CloudQuery('Custom4');
                query.containsAll('newColumn7', [child]);

                CB.CloudObject.on('Custom4', 'created', query, function(data){
                   if(!isDone){
                        isDone=true;
                        done();
                    }
                });

                var obj = new CB.CloudObject('Custom4');
                obj.set('newColumn7',[child]);
                obj.save();

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("ContainsAll : 2",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');

        child.save({
            success : function(child){
                var child2 = new CB.CloudObject('student1');
        
                child2.save({
                    success : function(child2){
                        //create the query. 
                        var query = new CB.CloudQuery('Custom4');
                        query.containsAll('newColumn7', [child2]);

                        CB.CloudObject.on('Custom4', 'created', query, function(data){
                            if(!isDone){
                                isDone=true;
                                done("Wrong event fired");
                            }
                        });

                        var obj = new CB.CloudObject('Custom4');
                        obj.set('newColumn7',[child]);
                        obj.save();

                        setTimeout(function(){
                            if(!isDone){
                                    isDone=true;
                                    done();
                                };
                        }, 10000);
                    }, error : function(error){
                     done("Object cannot be saved");
                }
            });

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });

    it("notContainedIn : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');
        child.save({
            success : function(child){
               
                //create the query. 
                var query = new CB.CloudQuery('Custom4');
                query.notContainedIn('newColumn7', [child]);

                CB.CloudObject.on('Custom4', 'created', query, function(data){
                   if(!isDone){
                        isDone=true;
                        done("Wrong event fired");
                    }
                });

                var obj = new CB.CloudObject('Custom4');
                obj.set('newColumn7',[child]);
                obj.save();

                 setTimeout(function(){
                            if(!isDone){
                                    isDone=true;
                                    done();
                                };
                }, 10000);


            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("notContainedIn : 2",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');

        child.save({
            success : function(child){
                var child2 = new CB.CloudObject('student1');
        
                child2.save({
                    success : function(child2){
                        //create the query. 
                        var query = new CB.CloudQuery('Custom4');
                        query.notContainedIn('newColumn7', [child2]);

                        CB.CloudObject.on('Custom4', 'created', query, function(data){
                            if(!isDone){
                                isDone=true;
                                done();
                            }
                        });

                        var obj = new CB.CloudObject('Custom4');
                        obj.set('newColumn7',[child]);
                        obj.save();

                       
                    }, error : function(error){
                     done("Object cannot be saved");
                }
            });

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });                              
});
describe("Cloud Object", function() {

	//Use Sample Table. 
	// -> Which has columns : 
	// name : string : required.


 it("Should timeout",function(done){

     this.timeout(100000);

     setTimeout(function(){
         done();
     },10000);
 });

 it("Should Save data in Custom date field",function(done){

     this.timeout(20000);

     var obj = new CB.CloudObject('Employee');
     obj.set('dob',new Date());
     obj.save().then(function(res){
            if(res)
                done();
            else
                throw "Unable to Save Object";
     },function(err){
         throw "Unable to Save Date TIme";
     });
 });

it("should not save a string into date column",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('createdAt','abcd');
        obj.set('name', 'sample');
        obj.save().then(function(res){
            if(res.createdAt === 'abcd')
                throw("should not have saved string in datetime field");
            else
                done();
        },function(){
            done();
        });
    });

    it("should not set the id",function(done){

        try{
            this.timeout(20000);

            var obj = new CB.CloudObject('Sample');
            obj.set('id', '123');
            throw "CLoudObject can set the id";
        }catch(e){
            done();
        }
    
    });

    it("should save.", function(done) {

    	this.timeout('20000');

     	var obj = new CB.CloudObject('Sample');
     	obj.set('name', 'sample');
     	obj.save({
     		success : function(newObj){
     			if(obj.get('name') !== 'sample'){
     				throw 'name is not equal to what was saved.';
     			}
     			if(!obj.id){
     				throw 'id is not updated after save.';
     			}

     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
    });


   it("should update the object after save and update.", function(done) {
        this.timeout('20000');

     	var obj = new CB.CloudObject('Sample');
     	obj.set('name', 'sample');
     	obj.save({
     		success : function(newObj){

     			var oldId = newObj.id;

     			if(obj.get('name') !== 'sample'){
     				throw 'name is not equal to what was saved.';
     			}

     			if(!obj.id){
     				throw 'id is not updated after save.';
     			}

     			obj.set('name','sample1');
     			obj.save({
		     		success : function(newObj){

		     			if(obj.get('name') !== 'sample1'){
		     				throw 'name is not equal to what was saved.';
		     			}

		     			if(!obj.id){
		     				throw 'id is not updated after save.';
		     			}
		     			
		     			if(obj.id !== oldId){
		     				throw "did not update the object, but saved.";
		     			}

		     			done();
		     		}, error : function(error){
		     			throw 'Error updating the object';
		     		}
     			});

     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
    });

    it("should update a saved CloudObject",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('student1');
        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',8787);
        obj1.save().then(function(res){
            console.log(res);
            obj1 = res;
            obj.set('name','vipul');
            obj.save().then(function(res){
                console.log(res);
                obj = res;
                obj.set('newColumn',obj1);
                obj.save().then(function(res){
                    console.log(res);
                    done();
                },function(err){
                    console.log(err);
                    throw "Should save";
                });
            },function(){
                throw "Error while saving";
            });
        },function(){
            throw "Error";
        });
    });

   it("should delete an object after save.", function(done) {

    	this.timeout('20000');
        
        var obj = new CB.CloudObject('Sample');
     	obj.set('name', 'sample');
     	obj.save({
     		success : function(newObj){
     			obj.delete({
		     		success : function(obj){
		     			done();
		     		}, error : function(error){
		     			throw 'Error deleting the object';
		     		}
     			});
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
    });

    it("should not save an object which has required column which is missing. ", function(done) {
        this.timeout('20000');

     	var obj = new CB.CloudObject('Sample');
   		//name is required which is missing.
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object even when required is missing.";
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save an object with wrong dataType.", function(done) {
       this.timeout('20000');

     	var obj = new CB.CloudObject('Sample');
   		//name is string and we have a wrong datatype here.
   		obj.set('name', 10); //number instead of string.
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object even when required is missing.";
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save an object with duplicate values in unique fields.", function(done) {

    	this.timeout('20000');
        
        var text = util.makeString();

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('unique', text);
   
     	obj.save({
     		success : function(newObj){
     			var obj = new CB.CloudObject('Sample');
		        obj.set('name','sample');
		        obj.set('unique', text); //saving with sample text
		     	obj.save({
		     		success : function(newObj){
		     			throw "Saved an object violated unique constraint.";
		     		}, error : function(error){
		     			done();
		     		}
		     	});

     		}, error : function(error){
     			throw "Saved Error";
     		}
     	});
    });

    it("should save an array.", function(done) {

    	this.timeout('20000');

        var text = util.makeString();

		var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('stringArray', [text,text]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw "Error saving object. ";
     		}
     	});
    });

    it("should not save wrong datatype in an  array.", function(done) {
       	
       	this.timeout(20000);

		var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('stringArray', [10,20]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			throw 'Wrong datatype in an array saved.';
     		}, error : function(error){
     			done();
     		}
     	});
    });


    it("should not allow multiple dataTypes in an array. ", function(done) {

        this.timeout(20000);

    	var text = util.makeString();

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('stringArray', [text,20]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			throw 'Multiple datatype in an array saved.';
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should save an array with JSON objects. ", function(done) {

    	this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('objectArray', [{sample : 'sample'},
        						{sample : 'sample'}
        					]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw "Error saving object. ";
     		}
     	});
    });

   it("should save a CloudObject as a relation. ", function(done) {
       	this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        obj.set('sameRelation', obj1); //saving with sample text

     	obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw "Error saving object. ";
     		}
     	});
    });

    it("should save a CloudObject as a relation with relate function. ", function(done) {
        this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');
        obj1.save({
            success : function(newObj){
                obj.relate('sameRelation', 'Sample', newObj.id); //saving with sample text

                obj.save({
                    success : function(newObj){
                        done();
                    }, error : function(error){
                        throw "Error saving object. ";
                    }
                });
            }, error : function(error){
                throw "Error saving object. ";
            }
        });

        
    });


    it("should keep relations intact.", function(done) {
        this.timeout(20000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn2',new CB.CloudObject('Custom3'));

        obj.set('newColumn7',new CB.CloudObject('student1'));
        
        obj.save({
            success : function(newObj){

               if(newObj.get('newColumn2').document._tableName === 'Custom3' &&  newObj.get('newColumn7').document._tableName === 'student1') {
                    done();
               }

               throw "Wrong Relationship retrieved.";

            }, error : function(error){
                throw "Error saving object. ";
            }
        });

        
    });




     it("should not save a a wrong relation.", function(done) {
       this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Student');
        obj1.set('name','sample');

        obj.set('sameRelation', obj1); //saving with sample text
        
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object with a wrong relation."
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save a CloudObject Relation when the schema of a related object is wrong. ", function(done) {
       this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        //name is required , which means the schema is wrong. 

        obj.set('sameRelation', obj1); //saving with sample text
        
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object in a relation with an invalid schema.";
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save a duplicate relation in unique fields. ", function(done) {

       this.timeout(20000);

       var obj = new CB.CloudObject('Sample');
       obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        obj.set('uniqueRelation', obj1); //saving with sample text
        
     	obj.save({
     		success : function(newObj){
     			var obj2 = new CB.CloudObject('Sample');
       			obj2.set('name','sample');
       			obj2.set('uniqueRelation', obj1);
       			obj2.save({success : function(newObj){
       				throw "Saved a duplicate relation on a unique field.";
       			}, error : function(error){
       				done();
       			}	
       		});


     		}, error : function(error){
     			throw "Cannot save an object";
     		}
     	});
    });

    it("should save an array of CloudObject with an empty array", function(done) {
        this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
        obj2.set('name','sample');
        obj2.set('relationArray', []);


        obj.save({
            success : function(newObj){

                obj2.save({success : function(newObj){
                    done();
                }, error : function(error){
                    throw "Cannot save an object in a relation.";
                }
                });
            }});
    });


    it("should save an array of CloudObject.", function(done) {
       this.timeout(20000);

       var obj = new CB.CloudObject('Sample');
       obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
		obj2.set('name','sample');
		obj2.set('relationArray', [obj1, obj]);

        
     	obj.save({
     		success : function(newObj){

       			obj2.save({success : function(newObj){
       				done();
       			}, error : function(error){
       				throw "Cannot save an object in a relation.";
       			}	
       		});
    	}});
    });

     it("should modify the list relation of a saved CloudObject.", function(done) {
        this.timeout(30000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
        obj2.set('name','sample');
        obj2.set('relationArray', [obj1, obj]);


        obj.save({
        success : function(newObj){
            obj2.save({success : function(Obj3){
                var relationArray = Obj3.get('relationArray');
                if(relationArray.length !== 2)
                    throw "unable to save relation properly";
                relationArray.splice(1);
                Obj3.set('relationArray',relationArray);
                Obj3.save().then(function(Obj4){
                    if(relationArray.length === 1)
                        done();
                },function(){
                    throw "should save";
                });
            }, error : function(error){
                throw "Cannot save an object in a relation.";
            }
            });
        }});
     });

    it("should save an array of CloudObject with some objects saved and others unsaved.", function(done) {
       this.timeout(20000);

       var obj = new CB.CloudObject('Sample');
       obj.set('name','sample');

       obj.save({

     		success : function(newObj){

     			var obj1 = new CB.CloudObject('Sample');
		        obj1.set('name','sample');

		        var obj2 = new CB.CloudObject('Sample');
				obj2.set('name','sample');
				obj2.set('relationArray', [obj1, obj]);

       			obj2.save({success : function(newObj){
	       				done();
	       			}, error : function(error){
	       				throw "Cannot save an object in a relation.";
	       			}	
       			});
       			
    	}});

    });

    it("should not save an array of different CloudObjects.", function(done) {
        this.timeout(30000);

       var obj = new CB.CloudObject('Student');
       obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
		obj2.set('name','sample');
		obj2.set('relationArray', [obj1, obj]);

        
     	obj.save({
     		success : function(newObj){

       			obj2.save({success : function(newObj){
       				throw "Saved different types of CloudObject in a single list";
       			}, error : function(error){
       				done();
       			}	
       		});
    	}, error : function(error){
                throw "Cannot save obj";
            }});
    });

 // Test for error of getting duplicate objects while saving a object after updating
    it("Should not duplicate the values in a list after updating",function(done){
        this.timeout(20000);
        var obj = new CB.CloudObject('student1');
        obj.set('age',5);
        obj.set('name','abcd');
        var obj1 = new CB.CloudObject('Custom4');
        obj1.set('newColumn7',[obj,obj]);
        obj1.save().then(function(list){
            nc7=list.get('newColumn7');
            nc7.push(obj);
            obj1.set('newColumn7',nc7);
            obj1.save().then(function(list){
                if(list.get('newColumn7').length === 3)
                    done();
                else
                    throw "should not save duplicate objects";
            },function(){
                throw "should save cloud object ";
            });
        },function(err){
            throw "should save cloud object";
        });
    });

// Test Case for error saving an object in a column
    it("should save a JSON object in a column",function(done){
        this.timeout(20000);
        var json= {"name":"vipul","location":"uoh","age":10};
        var obj = new CB.CloudObject('Custom');
        obj.set('newColumn6',json);
        obj.save().then(function(list){
            var obje=list.get('newColumn6');
            if(obje.name === 'vipul' && obje.location === 'uoh' && obje.age === 10)
                done();
            else
                throw "error in saving json object";
        },function(){
            throw "should save JSON object in cloud";
        });
    });

    it("should save list of numbers",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Custom14');
        obj.set('ListNumber',[1,2,3]);
        obj.save().then(function(list){
            console.log(list);
           done();
        },function(){
            throw "should save the list of numbers";
        });
    });

    it("should save a list of GeoPoint",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Custom14');
        var GP1 = new CB.CloudGeoPoint(17,89);
        var GP2 = new CB.CloudGeoPoint(66,78);
        obj.set('ListGeoPoint',[GP1,GP2]);
        obj.save().then(function(list){
           console.log(list);
            done();
        },function(){
            throw "should save list of geopoint";
        });
    });

    it("should save the relation",function(done){

        this.timeout(20000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',123);
        obj1.save().then(function(obj){
            if(obj){
                obj1 = obj;
            }else{
                throw "should save the object";
            }
            obj = new CB.CloudObject('student1');
            obj2 = new CB.CloudObject('hostel',obj1.get('id'));
            obj.set('newColumn',obj2);
            obj.save().then(function(list){
                console.log(list);
                    done();
            },function(){
                throw "should save the object";
            });
        },function(){
            throw "should save the object";
        });
    });

    it("should display correct error message when you save a string in a number field. ", function(done) {
        
        this.timeout(20000);

        var obj = new CB.CloudObject('Custom7');
        obj.set('requiredNumber','sample');
       
        obj.save({
            success : function(newObj){
                throw 'Wrong datatype in an array saved.';
            }, error : function(error){
                console.log(error);
                done();
            }
        });
    });

     it("should unset the field. ", function(done) {
        
        this.timeout(20000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',123);
        obj1.save().then(function(obj){
            
            if(obj.get('room') === 123){
                obj.unset('room');
                obj1.save().then(function(obj){
                    if(!obj.get('room')){
                        done();
                    }else
                        throw "Didnot unset the data from an object";

                },function(){
                    throw "should save the object";
                });
            }else
                throw "Didnot set the data to an object";

        },function(){
            throw "should save the object";
        });
    });


     it("should add multiple relations to CLoudObject -> save -> should maintain the order of those relations. ", function(done) {
        
        this.timeout(30000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',123);
        obj1.save().then(function(obj){
            
            if(obj.get('room')===123){
                obj.unset('room');
                obj1.save().then(function(obj){
                    if(!obj.get('room')){
                        done();
                    }else
                        throw "DidNot unset the data from an object";

                },function(){
                    throw "should save the object";
                });
            }else
                throw "DidNot set the data to an object";

        },function(){
            throw "should save the object";
        });
    });


     it("should save a required number with 0.", function(done) {
        
        this.timeout(30000);

        var obj1 = new CB.CloudObject('Custom18');
        obj1.set('number',0);
        obj1.save().then(function(obj){
            done();
        },function(){
            throw "should save the object";
        });
    });
});
describe("Version Test",function(done){

    it("should set the Modified array",function(done){
        var obj = new CB.CloudObject('sample');
        obj.set('expires',0);
        obj.set('name','vipul');
        if(obj.get('_modifiedColumns').length > 0) {
            done();
        }else{
            throw "Unable to set Modified Array";
        }
    });

    var obj = new CB.CloudObject('Sample');

    it("should save.", function(done) {

        this.timeout(20000);
        obj.set('name', 'sample');
        obj.save({
            success : function(newObj){
                if(obj.get('name') !== 'sample'){
                    throw 'name is not equal to what was saved.';
                }
                if(!obj.id){
                    throw 'id is not updated after save.';
                }
                done();
            }, error : function(error){
                throw 'Error saving the object';
            }
        });
    });

    it("should get the saved CO with version",function(done){
        this.timeout(20000);
        var query = new CB.CloudQuery('Sample');
        query.findById(obj.get('id')).then(function(list){
            var version = list.get('_version');
            if(version>=0){
                done();
            }else{
                throw "unable to get Version";
            }
        },function(){
            throw "unable to find saved object";
        });
    });


    it("should update the version of a saved object", function (done) {
        this.timeout(15000);
        var query = new CB.CloudQuery('Sample');
        query.equalTo('id',obj.get('id'));
        query.find().then(function(list){
            console.log(list);
            list[0].set('name','abcd');
            list[0].save().then(function(){
                var query1 = new CB.CloudQuery('Sample');
                query1.equalTo('id',obj.get('id'));
                query1.find().then(function(list){
                    if(list[0].get('_version') === 1){
                        done();
                    }else{
                        throw "version number should update";
                    }
                },function(){
                    throw "unable to find saved object";
                })
            }, function () {
                throw "unable to save object";
            })
        },function(){
            throw "unable to find saved object";
        })
    });

    var username = util.makeString();
    var passwd = "abcd";
    var user = new CB.CloudUser();
    it("Should create new user with version", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);

        user.set('username', username);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === username && list.get('_version')>=0){
                done();
            }
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    var roleName1 = util.makeString();

    it("Should create a role with version", function (done) {

        this.timeout(20000);
        var role = new CB.CloudRole(roleName1);
        role.save().then(function (list) {
            if (!list)
                throw "Should retrieve the cloud role";
            if (list.get('_version') >= 0)
                done();
            else
                throw "Unable to save version number with CloudRole";
        }, function () {
            throw "Should retrieve the cloud role";
        });
    });

    var parent = new CB.CloudObject('Custom4');
    var child = new CB.CloudObject('student1');

    it("Should Store a relation with version",function(done){

        this.timeout(20000);
        child.set('name','vipul');
        parent.set('newColumn7',[child]);
        parent.save().then(function(list){
            if(list)
            done();
        },function(err){
            throw "should save the relation";
        });

    });
    it("Should retrieve a saved user object",function(done){

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }
         
        this.timeout(20000);
        var query = new CB.CloudQuery('User');
        query.get(user.get('id')).then(function (user) {
            if(user.get('username') === username)
                done();
        }, function () {
            throw "unable to get a doc";
        });
    });

    it("Should save object with a relation and don't have a child object",function(done){

        this.timeout(20000);
        var obj = new CB.CloudObject('Sample');
        obj.set('name','vipul');
        obj.save().then(function(obj1){
            if(obj1.get('name') === 'vipul')
                done();
            else
                throw "unable to save the object";
        },function(){
            throw "unable to save object";
        });
    });
});
describe("CloudExpire", function () {

    it("Sets Expire in Cloud Object.", function (done) {

        this.timeout(10000);
        //create an object.
        var obj = new CB.CloudObject('Custom');
        obj.set('newColumn1', 'abcd');
        obj.save().then(function(obj1) {
            if(obj1)
                done();
            else
                throw "unable to save expires";
        }, function (err) {
            console.log(err);
            throw "Relation Expire error";
        });

    });

    it("Checks if the expired object shows up in the search or not", function (done) {

        this.timeout(10000);
        var curr=new Date().getTime();
        var query = new CB.CloudQuery('Custom');
        query.find().then(function(list){
            if(list.length>0){
                var __success = false;
                for(var i=0;i<list.length;i++){
                    if(list[i].get('expires')>curr || !list[i].get('expires')){
                           __success = true;
                            done();
                            break;
                        }
                    else{
                        throw "Expired Values also shown Up";
                    }
                    }
                }else{
                done();
            }

        }, function(error){

        })

    });


});
describe("CloudNotification", function() {
 
    it("should subscribe to a channel", function(done) {
      this.timeout(20000);
        CB.CloudNotification.on('sample',
      function(data){
      }, 
      {
      	success : function(){
      		done();
      	}, 
      	error : function(){
      		throw 'Error subscribing to a CloudNotification.';
      	}
      });
    });

    it("should publish data to the channel.", function(done) {

        this.timeout(20000);
        CB.CloudNotification.on('sample',
      function(data){
      	if(data === 'data'){
      		done();
      	}else{
      		throw 'Error wrong data received.';
      	}
      }, 
      {
      	success : function(){
      		//publish to a channel. 
      		CB.CloudNotification.publish('sample', 'data',{
				success : function(){
					//succesfully published. //do nothing. 
				},
				error : function(err){
					//error
					throw 'Error publishing to a channel in CloudNotification.';
				}
				});
      	}, 
      	error : function(){
      		throw 'Error subscribing to a CloudNotification.';
      	}

      });
    });


    it("should stop listening to a channel", function(done) {

    	this.timeout(20000);

     	CB.CloudNotification.on('sample', 
	      function(data){
	      	throw 'stopped listening, but still receiving data.';
	      }, 
	      {
	      	success : function(){
	      		//stop listening to a channel. 
	      		CB.CloudNotification.off('sample', {
					success : function(){
						//succesfully stopped listening.
						//now try to publish. 
						CB.CloudNotification.publish('sample', 'data',{
							success : function(){
								//succesfully published.
								//wait for 5 seconds.
								setTimeout(function(){ 
									done();
								}, 5000);
							},
							error : function(err){
								//error
								throw 'Error publishing to a channel.';
							}
						});
					},
					error : function(err){
						//error
						throw 'error in sop listening.';
					}
				});
	      	}, 
	      	error : function(){
	      		throw 'Error subscribing to a CloudNotification.';
	      	}
	      });


    });

});
describe("Cloud GeoPoint Test", function() {

    it("should save a latitude and longitude when passing data are number type", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom5');
        var loc = new CB.CloudGeoPoint(17.7,78.9);
        obj.set("location", loc);
        obj.save({
            success : function(newObj){
                done();
            }, error : function(error){
                throw 'Error saving the object';
            }
        });
    });

    it("should save a latitude and longitude when passing a valid numeric data as string type", function(done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('Custom5');
        var loc = new CB.CloudGeoPoint("18.19","79.3");
        loc.latitude = 78;
        loc.longitude = 17;
        obj.set("location", loc);
        obj.save({
            success : function(newObj){
                done();
            }, error : function(error){
                throw 'Error saving the object';
            }
        });
    });

	it("should save a latitude and longitude when passing data are number type", function(done) {

        this.timeout(30000);

		var obj = new CB.CloudObject('Custom5');
     	var loc = new CB.CloudGeoPoint(17.7,80.9);
		obj.set("location", loc);
        obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
	});

	it("should save a latitude and longitude when passing a valid numeric data as string type", function(done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('Custom5');
     	var loc = new CB.CloudGeoPoint("17.19","79.3");
		loc.latitude = 78;
        loc.longitude = 17;
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
     	this.timeout(20000);
        var loc = new CB.CloudGeoPoint("17.7","80.3");
        var query = new CB.CloudQuery('Custom5');
		query.near("location", loc, 100000);
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
     	this.timeout(10000);
        var loc1 = new CB.CloudGeoPoint(18.4,78.9);
     	var loc2 = new CB.CloudGeoPoint(17.4,78.4);
     	var loc3 = new CB.CloudGeoPoint(17.7,80.4);
        var query = new CB.CloudQuery('Custom5');
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
     	this.timeout(10000);
        var loc1 = new CB.CloudGeoPoint(18.4,78.9);
     	var loc2 = new CB.CloudGeoPoint(17.4,78.4);
     	var loc3 = new CB.CloudGeoPoint(17.7,80.4);
        var query = new CB.CloudQuery('Custom5');
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
     	this.timeout(10000);
        var loc = new CB.CloudGeoPoint(17.3, 78.3);
        var query = new CB.CloudQuery('Custom5');
		query.geoWithin("location", loc, 1000);
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
     	this.timeout(10000);
        var loc = new CB.CloudGeoPoint(17.3, 78.3);
        var query = new CB.CloudQuery('Custom5');
		query.geoWithin("location", loc, 1000);
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

    it("should update a saved GeoPoint", function(done) {
        this.timeout(30000);
        var obj = new CB.CloudObject('Custom5');
        var loc = new CB.CloudGeoPoint(17.9,79.6);
        obj.set("location", loc);
        obj.save({
            success : function(newObj){
                obj = newObj;
                obj.get('location').set('latitude',55);
                obj.save().then(function(obj1){
                    console.log(obj1);
                    done()
                },function(){
                    throw "";
                });
            }, error : function(error){
                throw 'Error saving the object';
            }
        });
    });

    it("should take latitude in range",function(done){

        this.timeout(10000);

        var obj = new CB.CloudGeoPoint(10,20);
        try{
            obj.set('latitude',-100);
            throw "should take latitude in range";
        }catch(err){
            done();
        }
    });

    it("should take longitude in range",function(done){

        this.timeout(10000);

        var obj = new CB.CloudGeoPoint(10,20);
        try{
            obj.set('longitude',-200);
            throw "should take longitude in range";
        }catch(err){
            done();
        }
    });
});

describe("CloudQuery - Encryption", function () {

    it("should get encrypted passwords", function (done) {

        this.timeout(20000);
         
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

        this.timeout(20000);
         
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
                            if(student_obj.get('name'))
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
                    console.log(obj);
                    done();
                }, function () {
                    throw "";
                });
                console.log(list);
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
describe("CloudQuery", function (done) {

    var obj = new CB.CloudObject('student1');

   it("Should save data with a particular value.", function (done) {

        this.timeout(20000);

        obj.set('name', 'vipul');
        obj.save().then(function(list) {
            if(list.get('name') === 'vipul')
                done();
            else
                throw "object could not saved properly";
        }, function () {
            throw "data Save error";
        });

    });

   it("select column should work on find",function(done){
            this.timeout(20000);
            var obj1 = new CB.CloudObject('Custom1');
            obj1.set('newColumn','sample');
            obj1.set('description','sample2');
            obj1.save().then(function(obj){
                var cbQuery = new CB.CloudQuery('Custom1');
                cbQuery.equalTo('id', obj.id);
                cbQuery.selectColumn('newColumn');
                cbQuery.find({
                  success: function(objList){
                    if(objList.length>0)
                        if(!objList[0].get('description'))
                            done();
                        else
                            throw "Select doesn't work";
                    else
                        throw "Cannot query over select ";
                  },
                  error: function(err){
                     throw "Error querying object.";
                  }
                });
               
            },function(){
               throw "should save the object";
            });
        });

        it("select column should work on distinct",function(done){
            this.timeout(20000);
            var obj1 = new CB.CloudObject('Custom1');
            obj1.set('newColumn','sample');
            obj1.set('description','sample2');
            obj1.save().then(function(obj){
                var cbQuery = new CB.CloudQuery('Custom1');
                cbQuery.equalTo('id', obj.id);
                cbQuery.selectColumn('newColumn');
                cbQuery.distinct('id',{
                  success: function(objList){
                    if(objList.length>0)
                        if(!objList[0].get('description'))
                            done();
                        else
                            throw "Select doesn't work";
                    else
                        throw "Cannot query over select ";
                  },
                  error: function(err){
                     throw "Error querying object.";
                  }
                });
               
            },function(){
               throw "should save the object";
            });
        });

     it("should retrieve items when column name is null (from equalTo function)",function(done){
        this.timeout(20000);

        var obj = new CB.CloudObject('student1');
        obj.save().then(function(obj){
            var query = new CB.CloudQuery('student1');
            query.equalTo('name',null);
            query.find().then(function(list){

                //check all the objects returned. 
                for(var i=0;i<list.length;i++){
                    if(list[i].get('name')){
                        throw "Name exists";
                    }
                }

                console.log(list);

                if(list.length>0)
                    done();
                else
                    throw "object could not queried properly";
            },function(err){
                console.log(err);
            });
        }, function(error){
            throw "object could not saved properly";
        });

       
    });


    it("should retrieve items when column name is NOT null (from NotEqualTo function)",function(done){
        this.timeout(20000);

        var obj = new CB.CloudObject('student1');
        obj.set('name','sampleName');
        obj.save().then(function(obj){
            var query = new CB.CloudQuery('student1');
            query.notEqualTo('name',null);
            query.find().then(function(list){

                //check all the objects returned. 
                for(var i=0;i<list.length;i++){
                    if(!list[i].get('name')){
                        throw "Name does not exists";
                    }
                }
                if(list.length>0)
                    done();
                else
                    throw "object could not queried properly";
            },function(err){
                console.log(err);
            });
        }, function(error){
            throw "object could not saved properly";
        });

       
    });

     it("should retrieve items when column name is not null (from notEqualTo function)",function(done){
        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('id',obj.get('id'));
        query.find().then(function(list){
            if(list.length>0)
                done();
            else
                throw "object could not saved properly";
        },function(err){
            console.log(err);
        });
    });

    it("should find data with id",function(done){

        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.equalTo("id",obj.get('id'));
        query.find().then(function(list){
            if(list.length>0){
                done();
            }else{
                throw "unable to retrive data";
            }
        },function(err){
           throw "unable to retrieve data";
        });

    });

     it("should return count as an integer",function(done){

        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.count({
            success: function(count){
                //count is the count of data which belongs to the query
                if (count === parseInt(count, 10))
                    done();
                else
                   throw "Count returned is not of type integer.";
            },
            error: function(err) {
                //Error in retrieving the data.
                throw "Error getting count.";
            }
        });

    });

    it("should find item by id",function(done){
        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('id',obj.get('id'));
        query.find().then(function(list){
            if(list.length>0)
                done();
            else
                throw "object could not saved properly";
        },function(err){
            console.log(err);
        });
    });

    it("should run a find one query",function(done){

        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('name','vipul');
        query.findOne().then(function(list){
            if(list.get('name') === 'vipul')
                done();
            else
                throw "unable to get";
        }, function (err) {
            console.log(err);
            throw "should return object";
        })
    });

    it("Should retrieve data with a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student1');
        obj.equalTo('name','vipul');
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name') != 'vipul')
                        throw "should retrieve saved data with particular value ";
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should save list with in column", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['java','python']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "list Save error";
        });

    });

    it("Should retrieve list matching with several different values", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudObject('student4');
        obj.set('subject',['java','python']);
        obj.save().then(function() {
            var obj = new CB.CloudQuery('student4');
            obj.containsAll('subject',['java','python']);
            obj.find().then(function(list) {
                if(list.length>0){
                    for(var i=0;i<list.length;i++)
                    {
                        var subject=list[i].get('subject');
                        for(var j=0;j<subject.length;j++) {
                            if (subject[j] != 'java' && subject[j] != 'python')
                                throw "should retrieve saved data with particular value ";
                        }
                    }
                } else{
                    throw "should retrieve data matching a set of values ";
                }
            done();
        }, function () {
            throw "find data error";
        });
        }, function () {
            throw "list Save error";
        });


        

    });

    it("Should retrieve data where column name starts which a given string", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student1');
        obj.startsWith('name','v');
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name')[0] != 'v' && list[i].get('name')[0]!='V')
                        throw "should retrieve saved data with particular value ";
                }
            } else{
                throw "should retrieve data matching a set of values ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should save list with in column", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['C#','python']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "list Save error";
        });

    });

    it("Should not retrieve data with a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student1');
        obj.notEqualTo('name','vipul');
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name') === 'vipul')
                        throw "should not retrieve data with particular value ";
                }
            } else{
                throw "should not retrieve data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should not retrieve data including a set of different values", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.notContainedIn('subject',['java','python']);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('subject')) {
                        var subject = list[i].get('subject');
                        for (var j = 0; j < subject.length; j++) {
                            if (subject[j] === 'java' || subject[j] === 'python')
                                throw "should retrieve saved data with particular value ";

                        }
                    }
                }
            } else{
                done();
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should save data with a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.set('age', 15);
        obj.set('subject', ['C#','C']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "data Save error";
        });

    });

    it("Should retrieve data which is greater that a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.greaterThan('age',10);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') <= 10 )
                        throw "received value less than the required value";
                }
            } else{
                throw "received value less than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data which is greater equal to a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.greaterThanEqualTo('age',15);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') < 10)
                        throw "received value less than the required value";
                }
            } else{
                throw "received value less than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data which is less than a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.lessThan('age',20);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') >= 20)
                        throw "received value greater than the required value";
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data which is less or equal to a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.lessThanEqualTo('age',15);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') > 15)
                        throw "received value greater than the required value";
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data with a particular value.", function (done) {

        this.timeout(20000);

        var obj1 = new CB.CloudQuery('student4');
        obj1.equalTo('subject',['java','python']);
        var obj2 = new CB.CloudQuery('student4');
        obj2.equalTo('age',12);
        var obj = new CB.CloudQuery.or(obj1,obj2);
        obj.find().then(function(list) {
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age') === 12) {
                        continue;
                    }else {
                        var subject = list[i].get('subject');
                        for (var j = 0; j < subject.length; j++) {
                            if (subject[j] === 'java' || subject[j] === 'python') {
                                continue;
                            }
                            else
                            {
                                throw "should retrieve saved data with particular value ";
                            }
                        }
                    }
                    continue;
                }
            }
            else
                throw "should return data";
            done();
        }, function () {
            throw "find data error";
        });

    });

   it("Should retrieve data in ascending order", function (done) {

        this.timeout(20000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.orderByAsc('age');
        obj.find().then(function(list) {
            if(list.length>0){
                age=list[0].get('age');
                for(var i=1;i<list.length;i++)
                {
                    if(age>list[i].get('age'))
                        throw "received value greater than the required value";
                    age=list[i].get('age');
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data in descending order", function (done) {

        this.timeout(20000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.orderByDesc('age');
        obj.find().then(function(list) {
            if(list.length>0){
                age=list[0].get('age');
                for(var i=1;i<list.length;i++)
                {
                    if(age<list[i].get('age'))
                        throw "received value greater than the required value";
                    age=list[i].get('age');
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should limit the number of data items received", function (done) {

        this.timeout(20000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.setLimit(5);
        obj.find().then(function(list) {
            if(list.length>5)
                throw "received number of items are greater than the required value";
            else
                done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should limit the number of data items received to one", function (done) {

        this.timeout(20000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.findOne().then(function(list) {
            if(list.length > 1)
                throw "received number of items are greater than the required value";
            else
                done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should give distinct elements", function (done) {

        this.timeout(20000);
        var age=[];
        var obj = new CB.CloudQuery('student4');
        obj.distinct('age').then(function(list) {
            if(list.length>0)
            {
                for(var i=0;i<list.length;i++) {
                    if (list[i].get('age')) {
                        if (age.indexOf(list[i].get('age')) > 0)
                            throw "received item with duplicate age";
                        else
                            age.push(list[i].get('age'));
                    }
                }
                done();
            }
        }, function () {
            throw "find data error";
        });

    });

    var getidobj = new CB.CloudObject('student1');

    it("Should save data with a particular value.", function (done) {

        this.timeout(20000);
        getidobj.set('name', 'abcd');
        getidobj.save().then(function() {
            done();
        }, function () {
            throw "data Save error";
        });

    });

    it("Should get element with a given id", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudQuery('student1');
        obj.get(getidobj.get('id')).then(function(list) {
            if(list.length>0) {
                throw "received number of items are greater than the required value";
            }
            else{
                if(list.get('name')==='abcd')
                    done();
                else
                    throw "received wrong data";
            }
        }, function () {
            throw "find data error";
        });

    });

    it("Should get element having a given column name", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudQuery('student4');
        obj.exists('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (!list[i].get('age'))
                        throw "received wrong data";
                }
                done();
            }
            else{
                throw "data not received"
            }
        }, function () {
            throw "find data error";
        });

    });

    it("Should get element not having a given column name", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudQuery('student4');
        var obj = new CB.CloudQuery('student4');
        obj.doesNotExists('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age'))
                        throw "received wrong data";
                }
                done();
            }
            else{
                throw "data not received"
            }
        }, function () {
            throw "find data error";
        });

    });

    it("Should not give element with a given relation",function(done){

        this.timeout(20000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',123);
        obj1.save().then(function(obj){
            if(obj){
                obj1 = obj;
            }else{
                throw "should save the object";
            }
            obj = new CB.CloudObject('student1');
            obj.set('newColumn',obj1);
            obj.save().then(function(list){
                var query = new CB.CloudQuery('student1');
                query.notEqualTo('newColumn',obj1);
                query.find().then(function (list) {
                    for(var i=0;i<list.length;i++){
                        if(list[i].get('newColumn')) {
                            if (list[i].get('newColumn').get('id') === obj1.get('id'))
                                throw "Should not get the id in not equal to";
                        }
                    }
                    done();
                }, function () {
                    throw "should do query";
                });
            },function(){
                throw "should save the object";
            });
        },function(){
           throw "should save the object";
        });
    });

    it("Should query over boolean dataType",function(done){
            this.timeout(20000);
            var obj1 = new CB.CloudObject('Custom1');
            obj1.set('newColumn1',false);
            obj1.save().then(function(obj){
                var cbQuery = new CB.CloudQuery('Custom1');
                cbQuery.equalTo('newColumn1', false);
                cbQuery.find({
                  success: function(objList){
                    if(objList.length>0)
                        done();
                    else
                        throw "Cannot query over boolean datatype ";
                  },
                  error: function(err){
                     throw "Error querying object.";
                  }
                });
               
            },function(){
               throw "should save the object";
            });
        });


});
describe("CloudSearch", function (done) {


    it("should index object for search", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom1');
        obj.set('description', 'wi-fi');
        obj.save({
            success : function(obj){
                setTimeout(function(){
                    done();
                },2000);
            },error : function(error){
                throw "should index cloud object";
            }
        });
    });

    it("should search indexed object", function (done) {

        this.timeout(30000);

        var cs = new CB.CloudSearch('Custom1');
        cs.searchQuery = new CB.SearchQuery();
        cs.searchQuery.searchOn('description', 'wi-fi');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for indexed object";
                }
            },error : function(error){
                throw "should search for indexed object";
            }
        });
    });

   
    it("should index test data",function(done){

        this.timeout(50000);

        var obj = new CB.CloudObject('Student');
        obj.set('description', 'This is nawaz');
        obj.set('age', 19);
        obj.set('name', 'Nawaz Dhandala');
        obj.set('class', 'Java');
       
        obj.save({
            success : function(obj){
                //now search on this object.
                var obj = new CB.CloudObject('Student');
                obj.set('description', 'This is gautam singh');
                obj.set('age', 19);
               // obj.expires=new Date().getTime();
                obj.set('name', 'Gautam Singh');
                obj.set('class', 'C#');
                
                obj.save({
                    success : function(obj){
                        var obj = new CB.CloudObject('Student');
                        obj.set('description', 'This is ravi');
                        obj.set('age', 40);
                   //     obj.expires=new Date().getTime();
                        obj.set('name', 'Ravi');
                        obj.set('class', 'C#');
                       

                        obj.save({
                            success : function(obj){
                                //now search on this object.
                                done();
                            },error : function(error){
                                throw "should index data for search";
                            }
                        });
                    },error : function(error){
                        throw "index data error";
                    }
                });


            },error : function(error){
                throw "index data error";
            }
        });

    });

    it("should search for object for a given value",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();

        cs.searchFilter .equalTo('age', 19);
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search indexed object";
                }
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });


    it("should search for object with a phrase",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.phrase('name', 'Gautam Singh');
        cs.search({
            success : function(list){
               done();
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });

    it("should search for object with a wildcard",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.wildcard('name', 'G*');
        cs.search({
            success : function(list){
               
                    done();
               
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });


    it("should search for object with a startsWith",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.startsWith('name', 'G');
        cs.search({
            success : function(list){
               
                    done();
               
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });

     it("should search for object with a mostColumns",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.mostColumns(['name','description'], 'G');
        cs.search({
            success : function(list){
               
                    done();
              
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });

    it("should search for object with a bestColumns",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.bestColumns(['name','description'], 'G');
        cs.search({
            success : function(list){
              
                    done();
               
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });


    it("should search values which are not equal to a given value",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.notEqualTo('age', 19);

        cs.search({
            success : function(list){
                
                    done();
               
            },error : function(error){
                throw "should search values which are not equal to a given value";
            }
        });
    });

    it("should limit the number of search results",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.notEqualTo('age', 19);
        cs.setLimit(0);
        cs.search({
            success : function(list){
                if(list.length===0){
                    done();
                }else{
                    throw "should limit the number of results";
                }
            },error : function(error){
                throw "should search for results";
            }
        });
    });

    it("should skip elements",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.notEqualTo('age', 19);
        cs.setSkip(9999999);
        cs.search({
            success : function(list){
                if(list.length===0){
                    var cs = new CB.CloudSearch('Student');
                    cs.searchFilter = new CB.SearchFilter();
                    cs.searchFilter.notEqualTo('age', 19);
                    cs.setSkip(1);
                    cs.search({
                        success : function(list){
                            if(list.length>0){
                                done();
                            }else{
                                throw "should skip elements";
                            }
                        },error : function(error){
                            throw "should skip elements"
                        }
                    });
                }else{
                    throw "should search for elements";
                }
            },error : function(error){
                throw "should search for elements"
            }
        });
    });

    it("should sort the results in ascending order",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.orderByAsc('age');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for elements in ascending order";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should sort elements in descending order",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.orderByDesc('age');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for elements in ascending order";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should give elements in which a particular column exists",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.exists('name');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for elements with a particular column";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should search for records which do not have a certain column",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.doesNotExist('expire');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should give records which do not have a specified column";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should give records within a certain range",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.greaterThan('age',19);
        cs.searchFilter.lessThan('age',50);
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should give elements within a certain range";
                }
            },error : function(error){
               throw "should search for elements";
            }
        });
    });


    it("OR should work between tables",function(done){

        this.timeout(30000);


        var obj = new CB.CloudObject('Student');
        obj.set('name', 'RAVI');

         var obj1 = new CB.CloudObject('hostel');
         obj1.set('room', 509);

         obj.save().then(function(obj){
            obj1.save().then(function(obj1){
                
                var tableNames = ['Student','hostel'];

                
                var sq = new CB.SearchQuery();
                sq.searchOn('name','ravi');

                var sq1 = new CB.SearchQuery();
                sq1.searchOn('room',509);

                var cs = new CB.CloudSearch(tableNames);
                cs.searchQuery = new CB.SearchQuery();
                cs.searchQuery.or(sq);
                cs.searchQuery.or(sq1);

                cs.setLimit(9999);

                cs.search({
                    success : function(list){
                        for(var i=0;i<list.length;i++){
                            if(list[i].document._tableName){
                                if(tableNames.indexOf(list[i].document._tableName)>-1){
                                    tableNames.splice(tableNames.indexOf(list[i].document._tableName),1);
                                }
                            }
                        }


                        if(tableNames.length===0){
                            //test passed. 
                            done();
                        }else{
                            throw "Search on both tables with OR failed.";
                        }

                    }, error: function(error){
                        console.log(error);
                        throw "Error while search.";
                    }
                })


             }, function(error){
                throw "Cannot save an object";
             });
         }, function(error){
            throw "Cannot save an object";
         });

       

        
        
    });



    it("should run operator (precision) queries",function(done){

         this.timeout(30000);


        var obj = new CB.CloudObject('Student');
        obj.set('name', 'RAVI');

         

         obj.save().then(function(obj){
           
                
                var tableNames = ['Student'];

               
                var cs = new CB.CloudSearch(['Student']);
                cs.searchQuery = new CB.SearchQuery();

                
                cs.searchQuery.searchOn('name','ravi',null,'and'); //Precision search.

                cs.setLimit(9999);

                cs.search({
                    success : function(list){
                        for(var i=0;i<list.length;i++){
                            if(list[i].document._tableName){
                                if(tableNames.indexOf(list[i].document._tableName)>-1){
                                    tableNames.splice(tableNames.indexOf(list[i].document._tableName),1);
                                }
                            }
                        }

                        if(tableNames.length===0){
                            //test passed. 
                            done();
                        }else{
                            throw "Search with precision passed.";
                        }

                    }, error: function(error){
                        console.log(error);
                        throw "Error while search.";
                    }
                });
         }, function(error){
            throw "Cannot save an object";
         });
        
        });


    it("should run minimum percent (precision) queries",function(done){

         this.timeout(30000);


        var obj = new CB.CloudObject('Student');
        obj.set('name', 'RAVI');

         obj.save().then(function(obj){
           
                
                var tableNames = ['Student'];

               
                var cs = new CB.CloudSearch(['Student']);
                cs.searchQuery = new CB.SearchQuery();
                cs.searchQuery.searchOn('name','ravi',null, null,'75%'); //Precision search.

                cs.setLimit(9999);

                cs.search({
                    success : function(list){
                        for(var i=0;i<list.length;i++){
                            if(list[i].document._tableName){
                                if(tableNames.indexOf(list[i].document._tableName)>-1){
                                    tableNames.splice(tableNames.indexOf(list[i].document._tableName),1);
                                }
                            }
                        }

                        if(tableNames.length===0){
                            //test passed. 
                            done();
                        }else{
                            throw "Search with precision passed.";
                        }

                    }, error: function(error){
                        console.log(error);
                        throw "Error while search.";
                    }
                });
         }, function(error){
            throw "Cannot save an object";
         });
        
        });


        it("multi table search",function(done){


            this.timeout(30000);

            return done();
            var obj = new CB.CloudObject('Student');
            obj.set('name', 'RAVI');

             var obj1 = new CB.CloudObject('hostel');
             obj1.set('name', 'ravi');

             obj.save().then(function(obj){
                obj1.save().then(function(obj1){

                    var tableNames = ['Student','hostel'];


                    var cs = new CB.CloudSearch(['Student','hostel']);
                    cs.searchQuery = new CB.SearchQuery();
                    cs.searchQuery.searchOn('name','ravi');

                    cs.setLimit(9999);

                    cs.search({
                        success : function(list){
                            for(var i=0;i<list.length;i++){
                                if(list[i].document._tableName){
                                    if(tableNames.indexOf(list[i].document._tableName)>-1){
                                        tableNames.splice(tableNames.indexOf(list[i].document._tableName),1);
                                    }
                                }
                            }


                            if(tableNames.length===0){
                                //test passed.
                                done();
                            }else{
                                throw "Search on multi tables failed.";
                            }

                        }, error: function(error){
                            console.log(error);
                            throw "Error while search.";
                        }
                    })


                 }, function(error){
                    throw "Cannot save an object";
                 });
             }, function(error){
                throw "Cannot save an object";
             });


    });

    it("should save a latitude and longitude when passing data are number type", function(done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom5');
        var loc = new CB.CloudGeoPoint(17.7,80.0);
        obj.set("location", loc);
        obj.save({
            success : function(newObj){
                done();
            }, error : function(error){
                throw 'Error saving the object';
            }
        });
    });

    it("should save a latitude and longitude when passing a valid numeric data as string type", function(done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('Custom5');
        var loc = new CB.CloudGeoPoint("18.19","79.3");
        loc.latitude = 78;
        loc.longitude = 17;
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

        this.timeout(20000);

        var loc = new CB.CloudGeoPoint("17.7","80.0");
        var search = new CB.CloudSearch('Custom5');
        search.searchFilter = new CB.SearchFilter();
        search.searchFilter.near("location", loc, 100000);
        search.search().then(function(list) {
            if(list.length>0){
               console.log(list);
                done();
            } else{
                throw "should retrieve saved data with particular value ";
            }
        }, function () {
            throw "find data error";
        })
    });

    it("Equal to should work in CloudSearch over CloudObject",function(done){

            this.timeout(30000);

            var obj = new CB.CloudObject('Custom2');
            obj.set('newColumn1', 'text');

            var obj1 = new CB.CloudObject('student1');
            obj1.set('name', 'Vipul');
            obj.set('newColumn7', obj1);

            obj.save({
                success : function(obj){

                    var cs = new CB.CloudSearch('Custom2');
                    cs.searchFilter = new CB.SearchFilter();
                    cs.searchFilter.equalTo('newColumn7',obj.get('newColumn7'));
                    cs.search().then(function(  list){
                        console.log(list);
                        done();
                    }, function(error){
                        throw "Unsuccessful join"
                    });
                }, error : function(error){
                    throw "Cannot save a CloudObject";

                }

            });

        });

});
describe("Inlcude in CloudSearch", function (done) {

    it("should include a relation on search.", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'text');

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        obj.set('newColumn7', obj1);
    
        obj.save({
            success : function(obj){

                var cs = new CB.CloudSearch('Custom2');
                cs.searchFilter = new CB.SearchFilter();
                cs.searchFilter.include('newColumn7');
                cs.searchFilter.equalTo('id',obj.id);
                cs.search().then(function(  list){
                    done();
                    console.log(list);
                    if(list.length>0){
                        for(var i=0;i<list.length;i++){
                            console.log('LIST');
                            console.log(list[0]);
                            var student_obj=list[i].get('newColumn7');
                            console.log('Student');
                            console.log(student_obj);
                            if(Object.keys(student_obj.document).length >3) {
                                if (!student_obj.get('name'))
                                    throw "Unsuccessful Join";
                            } else
                                done();
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

        });

    });
});
describe("CloudUser", function () {
    var username = util.makeString();
    var passwd = "abcd";

    

   it("Should create new user", function (done) {
         if(CB._isNode){
            done();
            return;
         }

         this.timeout(100000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.set('email',util.makeEmail());
        obj.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function (error) {
            throw error;
        });

    });

    it('should logout the user',function (done){

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(10000);
        CB.CloudUser.current.logOut().then(function(){
            done();
        },function(){
            throw "err";
        });
    });

    it("Should create a user and get version",function(done){

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(10000);
        var user = new CB.CloudUser();
        var usrname = util.makeString();
        var passwd = "abcd";
        user.set('username', usrname);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === usrname && list.get('_version')>=0){
                done();
            }
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });
    });

    it("should do a query on user",function(done){


        if(CB._isNode){
            done();
            return;
         }


        this.timeout(10000);
        var user = new CB.CloudUser();
        var usrname = util.makeString();
        var passwd = "abcd";
        user.set('username', usrname);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === usrname && list.get('_version')>=0){
                var query = new CB.CloudQuery('User');
                query.findById(user.get('id')).then(function(obj){
                    console.log(obj);
                    done();
                },function(err){
                    console.log(err);
                });
            }
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    it('should logout the user',function (done){

        if(CB._isNode){
            done();
            return;
         }


        this.timeout(10000);
        CB.CloudUser.current.logOut().then(function(){
            done();
        },function(){
            throw "err";
        });
    });


     it("Should login user", function (done) {

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(10000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            if(list.get("username") === username)
                done();
        }, function () {
            throw "user login error";
        });

    });

    var roleName2 = util.makeString();
    var role1 = new CB.CloudRole(roleName2);
    role1.set('name',roleName2);

   it("Should assign role to user", function (done) {

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(100000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role1.save().then(function(role){
                list.addToRole(role).then(function(list){
                    done();
                },function(error){
                    throw error;
                });
            }, function (error) {
                throw error;
            });
        },function(){
            throw "role create error";
        })

    });

    it("Should remove role assigned role to user", function (done) {

         if(CB._isNode){
            done();
            return;
         }
         

        this.timeout(1000000);

        var obj = new CB.CloudUser();
        var roleName3 = util.makeString();
        var role2 = new CB.CloudRole(roleName3);
        role2.set('name',roleName3);
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role2.save().then(function(role2){
                list.addToRole(role2).then(function(list){
                    CB.CloudUser.current.removeFromRole(role2).then(function(){
                        done();
                    },function(){
                        throw "Should remove the role";
                    });
                },function(){
                    throw "user role set error";
                });
            }, function () {
                throw "user role assign error";
            });
        },function(){
            throw "user login error";
        });

    });
     


     it('should encrypt user password',function (done){
        
        this.timeout(100000);

        var pass = passwd;

        var obj = new CB.CloudUser();
        obj.set('username', util.makeString());
        obj.set('password',pass);
        obj.set('email',util.makeEmail());
        obj.save().then(function(obj) {
            if(obj.get('password') === pass)
                throw "Password is not encrypted.";
            else
               done();
        }, function (err) {
            throw "user create error";
        });

    });

    it("Should Create a New User",function(done){

        this.timeout(10000);

        var obj = new CB.CloudUser();
        obj.set('username',util.makeString());
        obj.set('email',util.makeEmail());
        obj.set('password','pass');
        obj.save().then(function(res){
            var query = new CB.CloudQuery('User');
            query.get(res.get('id')).then(function (res1) {
                if(res1){
                    done();
                }else{
                    throw "Unable to retrieve User";
                }
            }, function () {
                throw "Unable to Get User By ID";
            })
        },function(err){
           throw "Unable to Create User";
        });
    });

    it("Should Create a New User",function(done){

        this.timeout(10000);

        var obj = new CB.CloudUser();
        obj.set('username',util.makeString());
        obj.set('email',util.makeEmail());
        obj.set('password','pass');
        obj.save().then(function(res){
            var query = new CB.CloudQuery('User');
            query.get(res.get('id')).then(function (res1) {
                if(res1){
                    done();
                }else{
                    throw "Unable to retrieve User";
                }
            }, function () {
                throw "Unable to Get User By ID";
            })
        },function(err){
            throw "Unable to Create User";
        });
    });

    it("Should Create a New User",function(done){

        this.timeout(10000);

        var obj = new CB.CloudUser();
        obj.set('username',util.makeString());
        obj.set('email',util.makeEmail());
        obj.set('password','pass');
        obj.save().then(function(res){
            var query = new CB.CloudQuery('User');
            query.get(res.get('id')).then(function (res1) {
                if(res1){
                    done();
                }else{
                    throw "Unable to retrieve User";
                }
            }, function () {
                throw "Unable to Get User By ID";
            })
        },function(err){
            throw "Unable to Create User";
        });
    });



});
describe("CloudRole", function (done) {

    it("Should create a role", function (done) {

        this.timeout(40000);
        var roleName5 = util.makeString();
        var role5 = new CB.CloudRole(roleName5);
        role5.save().then(function(list){
            console.log(list);
            if(!list)
                throw "Should create a role";
            done();
        },function(){
            throw "unable to create a role.";
        });
    });

    it("Should Retrieve a role", function (done) {
		
        this.timeout(40000);

        var roleName5 = util.makeString();
        var role5 = new CB.CloudRole(roleName5);
        role5.save().then(function(list){
            var query = new CB.CloudQuery('Role');
            if(!role5.get('id')){
                done();
            }
            query.equalTo('id',role5.get('id'));
            query.find().then(function(list){
                console.log(list);
                if(!list)
                    throw "Should retrieve the cloud role";
                done();
            },function(){
                throw "Should retrieve the cloud role";
            });
        },function(){
            throw "unable to create a role.";
        })


    });
});

describe("CloudApp Socket Test", function () {

    it("Should fire an event when disconnect", function (done) {

       this.timeout(40000);

       CB.CloudApp.onDisconnect(function(){
        done();
       });

       CB.CloudApp.disconnect();

    });

    it("Should fire an event when connect.", function (done) {

       this.timeout(30000);

       CB.CloudApp.onConnect(function(){
        done();
       });

       CB.CloudApp.connect();

    });


});
describe("App Tests2",function(done){

    var appId = util.makeString();
    var name = util.makeString();

    it("should create an App",function(done){

        this.timeout(100000);

        var url = CB.serviceUrl+'/user/signin';
        var params = {};
        params.email = 'a@gmail.com';
        params.password = 'abcd';
        params = JSON.stringify(params);
        CB._request('POST',url,params,true).then(function(res) {
            res = JSON.parse(res);
            console.log(res);
            url = CB.serviceUrl+'/app/create';
            params = {};
            params.appId = appId;
            params.name = name;
            params.userId = res._id;
            params = JSON.stringify(params);
            CB._request('POST',url,params,true).then(function(res){
                res = JSON.parse(res);
                CB.appId = res.appId;
                CB.appKey = res.keys.js;
                CB.jsKey = res.keys.js;
                CB.masterKey = res.keys.master;
                console.log(res);
                done();
            },function(err){
                throw "unable to create App";
            });
        },function(){
            throw "unable to create App";
        });
    });

    it("",function(done){

        this.timeout(10000);

        CB.CloudApp.init(CB.appId,CB.appKey);
        CB.appKey = CB.masterKey;
        done();
    });

    it("should create a table",function(done){

        this.timeout(50000);

        var table = new CB.CloudTable('Tests1');
        table.save().then(function(){
            done();
        },function(){
            throw "Unable to create Table";
        });

    });

    it("",function(done){

        this.timeout(1000);

        CB.appKey = CB.jsKey;
        done();
    });


    it("should save a record",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Tests1');
        obj.save().then(function(res){
            done();
        },function(err){
           throw "Unable to Save";
        });
    });
});
describe("App Tests",function(done){

    var appId = util.makeString();
    var name = util.makeString();

    it("should create an App",function(done){

        this.timeout(100000);

        var url = CB.serviceUrl+'/user/signin';
        console.log(CB.serviceUrl);
        var params = {};
        params.email = 'a@gmail.com';
        params.password = 'abcd';
        params = JSON.stringify(params);
        CB._request('POST',url,params,true).then(function(res) {
            res = JSON.parse(res);
            console.log(res);
            url = CB.serviceUrl+'/app/create';
            params = {};
            params.appId = appId;
            params.name = name;
            params.userId = res._id;
            params = JSON.stringify(params);
            CB._request('POST',url,params,true).then(function(res){
                res = JSON.parse(res);
                CB.appId = res.appId;
                CB.appKey = res.keys.js;
                CB.masterKey = res.keys.master;
                CB.jsKey = res.keys.js;
                console.log(res);
                done();
            },function(err){
               throw "unable to create App";
            });
        },function(){
            throw "unable to create App";
        });
    });

     it("",function(done){

         this.timeout(10000);

         CB.CloudApp.init(CB.appId,CB.appKey);
         CB.appKey = CB.masterKey;
            done();
     });

    it("should create a table",function(done){

        this.timeout(50000);

        var table = new CB.CloudTable('Tests');
        table.save().then(function(){
            done();    
        },function(){
            throw "Unable to create Table";
        });    

    });

    it("",function(done){

        this.timeout(1000);

        CB.appKey = CB.jsKey;
        done();
    });


    it("should save a record",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Tests');
        obj.save().then(function(res){
            done();
        },function(err){
            throw "Unable to Save";
        });
    });

});