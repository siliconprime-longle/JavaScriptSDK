describe("CloudQuery", function (done) {

    var obj = new CB.CloudObject('student1');

    it("Should save data with a particular value.", function (done) {

        this.timeout(30000);

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


    it("Should save data with a particular value.", function (done) {

        this.timeout(30000);

        obj.set('name', 'vipul');
        obj.save().then(function(list) {
            if(list.get('name') === 'vipul'){
               var query  = new CB.CloudQuery('student1');
               query.substring("name", "pu");
               query.find({
                success : function(list){
                    if(list.length>0){
                        if(list[0].get("name") === "vipul"){
                            done();
                        }else{
                            done("Got the list but got incorrect name");
                        }
                    }else{
                        done("Failed to get the list");
                    }
                }, error : function(error){
                    done("Failed to save the object");
                }
               });
            }
            else
                done("object could not saved properly");
        }, function () {
            throw "data Save error";
        });
    });

    it("Substring with an array.", function (done) {

        this.timeout(30000);

        obj.set('name', 'nawaz');
        obj.save().then(function(list) {
            if(list.get('name') === 'nawaz'){
               var query  = new CB.CloudQuery('student1');
               query.substring("name", ["pu","aw"]);
               query.find({
                success : function(list){
                    if(list.length>0){
                       done();
                    }else{
                        done("Failed to get the list");
                    }
                }, error : function(error){
                    done("Failed to save the object");
                }
               });
            }
            else
                done("object could not saved properly");
        }, function () {
            throw "data Save error";
        });
    });

     it("Substring with an array and array.", function (done) {

        this.timeout(30000);

        obj.set('name', 'nawaz');
        obj.save().then(function(list) {
            if(list.get('name') === 'nawaz'){
               var query  = new CB.CloudQuery('student1');
               query.substring(["name","age"], ["pu","aw"]);
               query.find({
                success : function(list){
                    if(list.length>0){
                       done();
                    }else{
                        done("Failed to get the list");
                    }
                }, error : function(error){
                    done("Failed to save the object");
                }
               });
            }
            else
                done("object could not saved properly");
        }, function () {
            throw "data Save error";
        });
    });

   it("select column should work on find",function(done){
            this.timeout(30000);
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


        it("containedIn should work on Id",function(done){
            this.timeout(30000);
            var obj1 = new CB.CloudObject('Custom1');
            obj1.set('newColumn','sample');
            obj1.set('description','sample2');
            obj1.save().then(function(obj1){
                 var obj2 = new CB.CloudObject('Custom1');
                obj2.set('newColumn','sample');
                obj2.set('description','sample2');
                obj2.save().then(function(obj2){
                     var obj3 = new CB.CloudObject('Custom1');
                    obj3.set('newColumn','sample');
                    obj3.set('description','sample2');
                    obj3.save().then(function(obj3){

                        var cbQuery = new CB.CloudQuery('Custom1');
                        cbQuery.containedIn('id', [obj1.id,obj3.id]);
                        cbQuery.find({
                          success: function(objList){
                            if(objList.length===2)
                               done();
                            else
                                done("Cannot do contains in on Id");
                          },
                          error: function(err){
                             throw "Error querying object.";
                          }
                        });
                    },function(){
                       throw "should save the object";
                    });

                   
                   
                },function(){
                   throw "should save the object";
                });

               
               
            },function(){
               throw "should save the object";
            });
        }); 

        it("select column should work on distinct",function(done){
            this.timeout(30000);
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
        this.timeout(30000);

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
        this.timeout(30000);

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
        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);

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

    it("Should count the no.of objects", function (done) {

        this.timeout(40000); 

        CB.appKey = CB.masterKey;        

        var Name = new CB.Column('name');
        Name.dataType = 'Text';

        var table = new CB.CloudTable('countobjectsxx');  
        table.addColumn(Name);       

        table.save().then(function(res){

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('countobjectsxx');
            obj1.set('name','abcd');        
            
            var obj2 = new CB.CloudObject('countobjectsxx');
            obj2.set('name','pqrs');

            var obj3 = new CB.CloudObject('countobjectsxx');
            obj3.set('name','gdgd');

            var obj4 = new CB.CloudObject('countobjectsxx');
            obj4.set('name','sjdhsjd');

            CB.CloudObject.saveAll([obj1,obj2,obj3,obj4],{
                success: function(res){

                    var totalObjectsInDB=res.length;
                 
                    var obj = new CB.CloudQuery('countobjectsxx');
                    obj.count({
                        success : function(number){
                            if(number!=totalObjectsInDB){
                                done("Count is not as expected.");                                
                            }else{
                                done();                                
                            }
                        }, error : function(error){
                          done(error);                          
                        }
                    });
                 
                    
                },error: function(err){
                    done(err);                    
                }    
            });  

        },function(err){
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";            
        });                  

    });

    it("Should count the no.of objects with skip,limit", function (done) {

        this.timeout(40000); 

        CB.appKey = CB.masterKey;        

        var Name = new CB.Column('name');
        Name.dataType = 'Text';

        var table = new CB.CloudTable('countobjectsskip');  
        table.addColumn(Name);       

        table.save().then(function(res){

            CB.appKey = CB.jsKey;

            var obj1 = new CB.CloudObject('countobjectsskip');
            obj1.set('name','abcd');        
            
            var obj2 = new CB.CloudObject('countobjectsskip');
            obj2.set('name','pqrs');

            var obj3 = new CB.CloudObject('countobjectsskip');
            obj3.set('name','gdgd');

            var obj4 = new CB.CloudObject('countobjectsskip');
            obj4.set('name','sjdhsjd');

            CB.CloudObject.saveAll([obj1,obj2,obj3,obj4],{
                success: function(res){

                    var totalObjectsInDB=res.length;
                 
                    var obj = new CB.CloudQuery('countobjectsskip');
                    obj.setLimit(2);
                    obj.setSkip(1);
                    obj.count({
                        success : function(number){
                            if(number==2){
                                done();                                                                
                            }else{
                                done("Count is not as expected.");                               
                            }
                        }, error : function(error){
                          done(error);                          
                        }
                    });
                 
                    
                },error: function(err){
                    done(err);                    
                }    
            });  

        },function(err){
            CB.appKey = CB.jsKey;
            done(err);
            throw "Unable to Create Table";            
        });                  

    });    

    it("should find item by id",function(done){
        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['java','python']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "list Save error";
        });

    });

    it("Should retrieve list matching with several different values", function (done) {

        this.timeout(30000);
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

        this.timeout(30000);

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

        this.timeout(30000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['C#','python']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "list Save error";
        });

    });

    it("Should not retrieve data with a particular value.", function (done) {

        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);

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

        this.timeout(30000);
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

        this.timeout(30000);
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

        this.timeout(30000);
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

    it("Should paginate with all params (return list of limited objects,count and totalpages)", function (done) {

        this.timeout(40000);        

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name','abcd');        
        
        var obj2 = new CB.CloudObject('student1');
        obj2.set('name','pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name','gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name','sjdhsjd');

        CB.CloudObject.saveAll([obj1,obj2,obj3,obj4],{
            success: function(res){                

                var pageNumber=1;
                var totalItemsInPage=2;

                var obj = new CB.CloudQuery('student1');
                obj.paginate(pageNumber,totalItemsInPage,{
                    success : function(objectsList,count,totalPages){

                        if(objectsList && objectsList.length>totalItemsInPage){
                            throw "received number of items are greater than the required value";
                            done("paginate data error");
                        }else if(Math.ceil(count/totalItemsInPage)!=totalPages){
                            done("totalpages is not recieved as expected");
                        }else{
                            done();
                        }
                    },
                    error : function(error){
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });
                
            },error: function(err){
                done(err);
            }    
        });       

    });

    it("Should paginate with null params", function (done) {

        this.timeout(40000);        

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name','abcd');        
        
        var obj2 = new CB.CloudObject('student1');
        obj2.set('name','pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name','gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name','sjdhsjd');

        CB.CloudObject.saveAll([obj1,obj2,obj3,obj4],{
            success: function(res){

                var obj = new CB.CloudQuery('student1');
                obj.paginate().then(function(objectsList,count,totalPages){
                    if(objectsList && objectsList.length==0){
                        throw "received 0 objects";
                        done("paginate received 0 objects");                    
                    }else{
                        done();
                    }
                },function(error){
                    done(error);
                });
                
            },error: function(err){
                done(err);
            }    
        });       

    });

    it("Should paginate with callback as first param", function (done) {

        this.timeout(40000);        

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name','abcd');        
        
        var obj2 = new CB.CloudObject('student1');
        obj2.set('name','pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name','gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name','sjdhsjd');

        CB.CloudObject.saveAll([obj1,obj2,obj3,obj4],{
            success: function(res){               

                var obj = new CB.CloudQuery('student1');
                obj.paginate({
                    success : function(objectsList,count,totalPages){
                        if(objectsList && objectsList.length==0){
                            throw "received 0 objects";
                            done("received 0 objectsr");                        
                        }else{
                            done();
                        }
                    },
                    error : function(error){
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });
                
            },error: function(err){
                done(err);
            }    
        });       

    });

    it("Should paginate with callback as second param", function (done) {

        this.timeout(40000);        

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name','abcd');        
        
        var obj2 = new CB.CloudObject('student1');
        obj2.set('name','pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name','gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name','sjdhsjd');

        CB.CloudObject.saveAll([obj1,obj2,obj3,obj4],{
            success: function(res){             

                var obj = new CB.CloudQuery('student1');
                obj.paginate(null,{
                    success : function(objectsList,count,totalPages){

                        if(objectsList && objectsList.length==0){
                            throw "received 0 objects";
                            done("received 0 objects");                        
                        }else{
                            done();
                        }
                    },
                    error : function(error){
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });
                
            },error: function(err){
                done(err);
            }    
        });       

    });

    it("Should paginate with callback as third param", function (done) {

        this.timeout(40000);        

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name','abcd');        
        
        var obj2 = new CB.CloudObject('student1');
        obj2.set('name','pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name','gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name','sjdhsjd');

        CB.CloudObject.saveAll([obj1,obj2,obj3,obj4],{
            success: function(res){

                var obj = new CB.CloudQuery('student1');
                obj.paginate(null,null,{
                    success : function(objectsList,count,totalPages){

                        if(objectsList && objectsList.length==0){
                            throw "received 0 objcts";
                            done("paginate received 0 objcts");                        
                        }else{
                            done();
                        }
                    },
                    error : function(error){
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });
                
            },error: function(err){
                done(err);
            }    
        });       

    });

    it("Should paginate with as pageNumber null and totalItemsInPage with value", function (done) {

        this.timeout(40000);        

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name','abcd');        
        
        var obj2 = new CB.CloudObject('student1');
        obj2.set('name','pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name','gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name','sjdhsjd');

        CB.CloudObject.saveAll([obj1,obj2,obj3,obj4],{
            success: function(res){

                var pageNumber=null;
                var totalItemsInPage=2;

                var obj = new CB.CloudQuery('student1');
                obj.paginate(null,totalItemsInPage,{
                    success : function(objectsList,count,totalPages){

                        if(objectsList && objectsList.length==0){
                            throw "received 0 objects";
                            done("paginate received 0 objects");
                        }else if(Math.ceil(count/totalItemsInPage)!=totalPages){
                            done("totalpages is not recieved as expected");
                        }else{
                            done();
                        }
                    },
                    error : function(error){
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });
                
            },error: function(err){
                done(err);
            }    
        });       

    });

    it("Should paginate with pageNumber and totalItemsInPage as null", function (done) {

        this.timeout(40000);        

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name','abcd');        
        
        var obj2 = new CB.CloudObject('student1');
        obj2.set('name','pqrs');

        var obj3 = new CB.CloudObject('student1');
        obj3.set('name','gdgd');

        var obj4 = new CB.CloudObject('student1');
        obj4.set('name','sjdhsjd');

        CB.CloudObject.saveAll([obj1,obj2,obj3,obj4],{
            success: function(res){
                
                var pageNumber=1;
                var totalItemsInPage=null;

                var obj = new CB.CloudQuery('student1');
                obj.paginate(pageNumber,null,{
                    success : function(objectsList,count,totalPages){

                        if(objectsList && objectsList.length==0){
                            throw "received 0 objects";
                            done("paginate received 0 objects");
                        }else{
                            done();
                        }
                    },
                    error : function(error){
                        throw "paginate data error";
                        done("paginate data error");
                    }
                });
                
            },error: function(err){
                done(err);
            }    
        });       

    });

    it("Should limit the number of data items received to one", function (done) {

        this.timeout(30000);
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

        this.timeout(30000);
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

        this.timeout(30000);
        getidobj.set('name', 'abcd');
        getidobj.save().then(function() {
            done();
        }, function () {
            throw "data Save error";
        });

    });

    it("Should get element with a given id", function (done) {

        this.timeout(30000);
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

        this.timeout(30000);
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

        this.timeout(30000);
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

        this.timeout(30000);

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
        this.timeout(30000);
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