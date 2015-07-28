   var util = {
     makeString : function(){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
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
                    CB.appId = 'sample123';
                    CB.appKey = '9SPxp6D3OPWvxj0asw5ryA==';
                    CB.serverUrl = 'http://localhost:4730';
                    CB.socketIoUrl = CB.serverUrl;
                    CB.apiUrl = CB.serverUrl + '/api';
                    done();
                }
                else {
                    CB.appId = 'travis123';
                    CB.appKey = '6dzZJ1e6ofDamGsdgwxLlQ==';
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

describe("CloudObject - Encryption", function () {

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

});
describe("CloudObjectExpires", function () {

    it("should save a CloudObject after expire is set", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.expires=new Date().getTime();
        obj.isSearchable=true;
        obj.save().then(function(obj1) {
            if(obj1.get('expires'))
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
        delete query.query.$include;
        delete query.query.$or[0].$include;
        delete query.query.$or[1].$include;
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    if(list[i]._expires>curr || !list[i]._expires){
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
                    if (list[i]._expires > curr || !list[i]._expires) {
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
  
	var obj = new CB.CloudObject('Student');

     it("should save a file inside of an object", function(done) {

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

      file.save().then(function(file) {
         if(file.url){
          console.log(file);
           //create a new object.
           var obj = new CB.CloudObject('Sample');
           obj.set('name', 'sample');
           obj.set('file', file);

           obj.save().then(function(newobj){
             if(newobj.get('file') instanceof CB.CloudFile && newobj.get('file').url){
               done();
             }else{
               throw "object saved but didnot return file.";
             }
           }, function(error){
             throw "error saving an object.";
           });

         }else{
           throw "upload success. but cannot find the url.";
         }
       }, function(err) {
         throw "error uploading file";
       });

     });

    it("should save an array of files.", function(done) {
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

     file.save().then(function(file) {
        if(file.url){

            var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
            try {
                var oMyBlob = new Blob(aFileParts, {type: "text/html"});
            } catch (e) {
                var builder = new WebKitBlobBuilder();
                builder.append(aFileParts);
                var oMyBlob = builder.getBlob();
            }
         var file1 = new CB.CloudFile(oMyBlob);

         file1.save().then(function(file1) {
            if(file1.url){
              
              //create a new object.
              var obj = new CB.CloudObject('Sample');
              obj.set('name', 'sample');
              obj.set('fileList', [file, file1]);

              obj.save().then(function(newObj){
                  done();
              }, function(error){
                throw "Error Saving an object.";
              });

            }else{
              throw "Upload success. But cannot find the URL.";
            }
          }, function(err) {
            throw "Error uploading file";
          });

        }else{
          throw "Upload success. But cannot find the URL.";
        }
      }, function(err) {
        throw "Error uploading file";
      });
    });

    it("should save an object with unsaved file.", function(done) {
      done();
    });

   

});
describe("Cloud Objects Notification", function() {
  
	var obj = new CB.CloudObject('Student');
    var obj1 = new CB.CloudObject('student4');
  it("should alert when the object is created.", function(done) {

      this.timeout(20000);

      CB.CloudObject.on('Student', 'created', function(data){
       if(data.get('name') === 'sample') {
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

      this.timeout(20000);
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
describe("Cloud Object", function() {

	//Use Sample Table. 
	// -> Which has columns : 
	// name : string : required. 

    it("should not save a string into date column",function(done){

        this.timeout(20000);
        var obj = new CB.CloudObject('Sample');
        obj.set('createdAt','abcd');
        obj.set('name', 'sample');
        obj.save().then(function(){
            throw("should not have saved string in datetime field");
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

               if(newObj.get('newColumn2').document._tableName === 'Custom3' &&  newObj.get('newColumn7').document._tableName === 'student1')
               {
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
        this.timeout(20000);

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
        obj.set('List_Number',[1,2,3]);
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
        obj.set('List_GeoPoint',[GP1,GP2]);
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
            
            if(obj.get('room')===123){
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
        
        this.timeout(20000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',123);
        obj1.save().then(function(obj){
            
            if(obj.get('room')===123){
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


     it("should save a required number with 0.", function(done) {
        
        this.timeout(20000);

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

        this.timeout('10000');
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
        this.timeout(10000);
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

        this.timeout(10000);

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

    var roleName = util.makeString();

    it("Should create a role with version", function (done) {

        this.timeout(10000);
        var role = new CB.CloudRole(roleName);
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

        this.timeout(10000);
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
        this.timeout(10000);
        var query = new CB.CloudQuery('User');
        query.get(user.get('id')).then(function (user) {
            if(user.get('username') === username)
                done();
        }, function () {
            throw "unable to get a doc";
        });
    });

    it("Should save object with a relation and don't have a child object",function(done){

        this.timeout(10000);
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

});
describe("CloudQuery Include", function () {
    
   
    
    it("save a relation.", function (done) {
        
        this.timeout(10000);

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

        this.timeout(10000);

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
        obj1.set('expires',null);
        obj.set('newColumn7', obj1);
        obj1.set('newColumn',obj2);
        obj.save().then(function() {
            done();
        }, function () {
            throw "Relation Save error";
        });

    });

    it("should include a relation object when include is requested in a query.", function (done) {

        this.timeout(10000);

        var query = new CB.CloudQuery('Custom2');
        query.include('newColumn7');
        query.include('newColumn7.newColumn');
        query.include('newColumn2');
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

        })

    });


    it("should include a relation on distinct.", function (done) {

        this.timeout(10000);

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
                    if(list.length>0){
                        for(var i=0;i<list.length;i++){
                            var student_obj=list[i].get('newColumn7');
                            if(!student_obj.get('name'))
                                throw "Unsuccessful Join";
                            else
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

        })

       

    });

    it("should query over a linked column if a object is passed in equalTo",function(done){
            this.timeout(100000);

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
                })
                console.log(list);
            },function(){
                throw "unable to save data";
            })
    });


    it("should run containedIn over list of CloudObjects",function(done){

            this.timeout(100000);

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

            this.timeout(100000);

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

    it("should inclue with findById",function(done){

            this.timeout(100000);

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
describe("CloudQuery", function () {

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
                console.log(list)
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

    this.timeout(20000);

    it("should index object for search", function (done) {
        var obj = new CB.CloudObject('Custom1');
        obj.set('description', 'wi-fi');
        obj.save({
            success : function(obj){
                done();
            },error : function(error){
                throw "should index cloud object";
            }
        });
    });

    it("should search indexed object", function (done) {

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.phrase('name', 'Gautam Singh');
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

    it("should search for object with a wildcard",function(done){

        this.timeout(20000);

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

        this.timeout(20000);

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

     it("should search for object with a mostcolumns",function(done){

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);

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

        this.timeout(20000);


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

         this.timeout(20000);


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

         this.timeout(20000);


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

});
describe("CloudUser", function () {
    var username = util.makeString();
    var passwd = "abcd";
   it("Should create new user", function (done) {

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
        this.timeout(10000);
        CB.CloudUser.current.logOut().then(function(){
            done();
        },function(){
            throw "err";
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
        }, function () {
            throw "user create error";
        });

    });


   it("Should login user", function (done) {

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

    var rolename = util.makeString();
    var role = new CB.CloudRole(rolename);
    role.set('name',rolename);
    it("Should create a role ", function (done) {

        this.timeout(10000);

        //var role = new CB.CloudRole('admin');
        role.save().then(function(list){
                done();
            },function(){
                throw "role create error";
            });

    });


   it("Should assign role to user", function (done) {

        this.timeout(100000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role.save().then(function(role){
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

        this.timeout(1000000);

        var obj = new CB.CloudUser();
        rolename = util.makeString();
        var role = new CB.CloudRole(rolename);
        role.set('name',rolename);
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role.save().then(function(role){
                list.addToRole(role).then(function(list){
                    CB.CloudUser.current.removeFromRole(role).then(function(){
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


});
describe("ACL", function () {

    it("Should set the public write access", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicWriteAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
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

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
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

    it("Should create new user and listen to CLoudNotifiction events.", function (done) {

        this.timeout(20000);

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            if(user.get('username') === username){
                CB.CloudObject.on('User', 'created', function(){
                    done();
                });
            }
            else
                throw "Create user error"
        }, function () {
            throw "user create error";
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


    it("Should allow users of role to read", function (done) {

        this.timeout(20000);

        //TODO 

        done();

    });
});

