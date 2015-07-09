describe("CloudSearch", function (done) {

    this.timeout(10000);

    it("should index object for search", function (done) {
        var obj = new CB.CloudObject('Custom1');
        obj.set('description', 'wi-fi');
        obj.isSearchable = true;
        obj.save({
            success : function(obj){
                done();
            },error : function(error){
                throw "should index cloud object";
            }
        });
    });

    it("should search indexed object", function (done) {

        this.timeout(10000);

        var cs = new CB.CloudSearch('Custom1');
        cs.searchOn('description', 'wi-fi');
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

    it("should search indexed object", function (done) {

        this.timeout(10000);

        var cs = new CB.CloudSearch('Custom1');
        cs.searchOn('description', 'wi-fi');
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

    it("should index test data",function(done){

        this.timeout(50000);

        var obj = new CB.CloudObject('Student');
        obj.set('description', 'This is nawaz');
        obj.set('age', 19);
        obj.set('name', 'Nawaz Dhandala');
        obj.set('class', 'Java');
        obj.isSearchable = true;
        obj.save({
            success : function(obj){
                //now search on this object.
                var obj = new CB.CloudObject('Student');
                obj.set('description', 'This is gautam singh');
                obj.set('age', 19);
               // obj.expires=new Date().getTime();
                obj.set('name', 'Gautam Singh');
                obj.set('class', 'C#');
                obj.isSearchable = true;
                obj.save({
                    success : function(obj){
                        var obj = new CB.CloudObject('Student');
                        obj.set('description', 'This is ravi');
                        obj.set('age', 40);
                   //     obj.expires=new Date().getTime();
                        obj.set('name', 'Ravi');
                        obj.set('class', 'C#');
                        obj.isSearchable = true;

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

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.equalTo('age', 19);
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

    it("should search values which are not equal to a given value",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.notEqualTo('age', 19);
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search values which are not equal to a given value";
                }
            },error : function(error){
                throw "should search values which are not equal to a given value";
            }
        });
    });

    it("should limit the number of search results",function(done){

        this.timeout(20000);

        var cs = new CB.CloudSearch('Student');
        cs.notEqualTo('age', 19);
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

    it("should limit the number of search results",function(done){

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.notEqualTo('age', 19);
        cs.setLimit(1);
        cs.search({
            success : function(list){
                if(list.length===1){
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

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.notEqualTo('age', 19);
        cs.setSkip(9999999);
        cs.search({
            success : function(list){
                if(list.length===0){
                    var cs = new CB.CloudSearch('Student');
                    cs.notEqualTo('age', 19);
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

        this.timeout(10000);

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

        this.timeout(10000);

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

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.exists('name');
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

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.doesNotExist('expire');
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

        this.timeout(10000);

        var cs = new CB.CloudSearch('Student');
        cs.greaterThan('age',19);
        cs.lessThan('age',50);
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

    /*it("should unIndex the CloudObject",function(done){

        this.timeout(15000);

        var obj = new CB.CloudObject('Student');
        obj.set('age',777);
        obj.set('isSearchable',true);
        obj.save().then(function(list){
            console.log(list);
            list.set('isSearchable',false);
            list.save().then(function(list){
                var searchObj = new CB.CloudSearch('Student');
                searchObj.equalTo('id',obj.get('id'));
                searchObj.search().then(function(list){
                    console.log('here');
                    if(list.length === 0){
                        done();
                    }else{
                        throw "Unable to UnIndex the CloudObject";
                    }
                },function(){
                    console.log(err);
                });
            },function(err){
                console.log(err);
            });
        },function(err){
            console.log(err);
        });
    });*/

    it("should reIndex the unIndexed CloudObject",function(done){

        this.timeout(50000);

        var obj = new CB.CloudObject('Student');
        obj.set('age',777);
        obj.set('isSearchable',true);
        obj.save().then(function(list){
            console.log(list);
            list.set('isSearchable',false);
            list.save().then(function(list){
                console.log(list);
                list.set('isSearchable',true);
                list.save().then(function(list){
                    var searchObj = new CB.CloudSearch('Student');
                    searchObj.equalTo('id',obj.get('id'));
                    searchObj.search().then(function(list){
                        console.log('here');
                        if(list.length > 0){
                            done();
                        }else{
                            throw "Unable to UnIndex the CloudObject";
                        }
                    },function(){
                        console.log(err);
                    });
                    console.log(list)
                }, function (err) {
                    console.log(err);
                })
            },function(err){
                console.log(err);
            });
        },function(err){
            console.log(err);
        });
    });
});