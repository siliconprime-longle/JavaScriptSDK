describe("CloudSearch", function (done) {



    it("should get data from server for near function", function(done) {

        CB.appKey = CB.masterKey;

         this.timeout(53000);

        var custom = new CB.CloudTable('CustomGeoPoint');
            var newColumn7 = new CB.Column('location');
            newColumn7.dataType = 'GeoPoint';
            custom.addColumn(newColumn7);
            custom.save().then(function(res){
                CB.appKey = CB.jsKey;
                var loc = new CB.CloudGeoPoint(17.7,80.0);

                var obj = new CB.CloudObject('CustomGeoPoint');
                obj.set("location", loc);

                obj.save({
                    success : function(newObj){

                        setTimeout(function(){

                            var search = new CB.CloudSearch('CustomGeoPoint');
                            search.searchFilter = new CB.SearchFilter();
                            search.searchFilter.near("location", loc, 1);
                            search.search().then(function(list) {
                                if(list.length>0){
                                   console.log(list);
                                    done();
                                } else{
                                    throw "should retrieve saved data with particular value ";
                                }
                            }, function (error) {
                                done(error);
                            });

                        }, 3000);
                       
                    }, error : function(error){
                        throw 'Error saving the object';
                    }
                });
            },function(){
                throw "Unable to create user";
            });

        
    });

    it("Equal to should work in CloudSearch over CloudObject",function(done){
             CB.appKey = CB.masterKey;

             this.timeout(50000);

           var custom = new CB.CloudTable('CustomRelation');
                var newColumn1 = new CB.Column('newColumn7');
                newColumn1.dataType = 'Relation';
                newColumn1.relatedTo = 'student1';
                custom.addColumn(newColumn1);
                custom.save().then(function(res){
                     CB.appKey = CB.jsKey;
                    var obj = new CB.CloudObject('CustomRelation');
                    var obj1 = new CB.CloudObject('student1');
                    obj1.set('name', 'Vipul');
                    obj.set('newColumn7', obj1);

                    obj.save({
                        success : function(obj){

                            var cs = new CB.CloudSearch('CustomRelation');
                            cs.searchFilter = new CB.SearchFilter();
                            cs.searchFilter.equalTo('newColumn7',obj.get('newColumn7'));
                            cs.search().then(function(list){
                                console.log(list);
                                done();
                            }, function(error){
                                throw "Unsuccessful join"
                            });
                        }, error : function(error){
                            throw "Cannot save a CloudObject";

                        }

                    });
                },function(){
                    throw "Unable to create CustomRelation2";
                });
        });

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

        this.timeout(33000);

        setTimeout(function(){ 

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

        }, 3000);
        
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

        this.timeout(33000);

        var obj = new CB.CloudObject("Student");
        obj.set("age",21);

        obj.save().then(function(obj){

            setTimeout(function(){ 
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
            }, 3000);
            

        }, function(error){
            console.log(error);
            done(error);
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

        this.timeout(33000);


        var obj = new CB.CloudObject('Student');
        obj.set('name', 'RAVI');

         var obj1 = new CB.CloudObject('hostel');
         obj1.set('room', 509);

         obj.save().then(function(obj){
            obj1.save().then(function(obj1){
                
                var tableNames = ['Student','hostel'];

                setTimeout(function(){ 
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
                    });

                }, 3000);

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


});