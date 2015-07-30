describe("Query over Orient",function(done){

    it("Should Query over related Document",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Employee');
        obj.set('Name',util.makeString());
        obj.set('Age',20);
        var obj1 = new CB.CloudObject('Company');
        var company = util.makeString();
        obj1.set('Name',company);
        obj.set('Company',obj1);
        obj.save().then(function(res){
            if(res){
                var query = new CB.CloudQuery('Employee');
                query.equalTo('Company.Name',company);
                query.find().then(function(result){
                    console.log(result);
                    if(result.length === 1)
                        done();
                    else
                        throw "Unable to query over relation";
                },function(err){
                    throw "Unable to do Find";
                });
            }
        },function(err){
            throw "Unable to save Data";
        });
    });
    // Wait for OrientDB to launch it
    it("Should Query over related Document with not equal to Set",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Employee');
        obj.set('Name',util.makeString());
        obj.set('Age',25);
        var obj1 = new CB.CloudObject('Company');
        var company = util.makeString();
        obj1.set('Name',company);
        obj.set('Company',obj1);
        obj.save().then(function(res){
            if(res){
                var query = new CB.CloudQuery('Employee');
                query.notEqualTo('Company.Name',company);
                query.notEqualTo('Name','Anurag');
                query.find().then(function(result){
                    console.log(result);
                    if(result.length > 1)
                        done();
                    else
                        done("Returned Wrong records");
                },function(err){
                    done("Unable to do Find");
                });
            }
        },function(err){
            done("Unable to save Data");
        });
    });

    it("Should Return limited number of records",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.setLimit(5);
        query.selectColumn(['Name','Company.Name']);
        query.find().then(function(obj){
            if(obj.length === 5)
                done();
            else
                throw "Unable to Set Limit";
        },function(){
            throw "Unable to do query";
        });
    });

    it("should sort the results in ascending order",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.orderByAsc('createdAt');
        query.equalTo('Company.Name','CloudBoost');
        query.find().then(function(res){
            console.log(res);
            done();
        },function(err){
           throw "Unable to execute find query";
        });
    });

    it("should sort the results in descending order",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.orderByDesc('createdAt');
        query.equalTo('Company.Name','CloudBoost');
        query.find().then(function(res){
            console.log(res);
            done();
        },function(err){
            throw "Unable to execute find query";
        });
    });

    it("should select specific columns from document",function(done){

        this.timeout(10000);

        var query = new CB.CloudQuery('Employee');
        query.selectColumn(['Name','Company.Name']);
        query.find().then(function(obj){
            console.log(obj);
            done();
        },function(){
           throw "Unable to do query";
        });
    });

    it("Should include columns over relation",function(done){

        this.timeout(10000);

        var query = new CB.CloudQuery('Employee');
        query.setLimit(100);
        query.include('Company');
        query.find().then(function(res){
            for(var i=0;i<res.length;i++){
                if(res[i].get('Company').get('Name')) {
                    done();
                    return ;
                }
            }
            done("did not get the linked records");
        },function(){
            throw "Unable to find";
        });
    });

    it("Should skip records",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.setLimit(100);
        query.setSkip(100);
        query.include('Company');
        query.find().then(function(res){
            console.log(res);
            done();
        },function(){
            throw "Unable to find";
        });
    });

    it("Should return 10 records the default limit",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.include('Company');
        query.find().then(function(res){
            if(res.length === 10) {
                console.log(res);
                done();
            }else
                done("Unable to Set Default limit to 10");
        },function(){
            throw "Unable to find";
        });
    });

    it("Should give objects with a value less than something",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Company');
        query.lessThan('Employee.Age',20);
        query.find().then(function(res){
            if(res.length ===0)
                done();
            else
                done("Less than didn't work");
        },function(err){
            done("Unable to find");
        });
    });

    it("Should give objects with a value greater than something",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Company');
        query.greaterThan('Employee.Age',25);
        query.find().then(function(res){
            if(res.length === 0)
                done();
            else
                done("greater than didn't work");
        },function(err){
            done("Unable to find");
        });
    });

    it("Should give objects with a value less than equal to something",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Company');
        query.lessThanEqualTo('Employee.Age',20);
        query.find().then(function(res){
            if(res.length > 0)
                done();
            else
                done("Less than equalTo didn't work");
        },function(err){
            done("Unable to find");
        });
    });

    it("Should give objects with a value greater than equal to something",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Company');
        query.greaterThan('Employee.Age',25);
        query.find().then(function(res){
            if(res.length > 0)
                done();
            else
                done("greater than equalTo didn't work");
        },function(err){
            done("Unable to find");
        });
    });

    it("should give only those columns which satisfy exist",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.selectColumn(['Name','Company.Name']);
        query.exists('Age');
        query.find().then(function(res){
            for(var i=0;i<res.length;i++){
                if(!res[i].get('Age'))
                    done('Unable to get objects with column exists check');
            }
            done();
        },function(){
            done("Unable to find");
        });
    });

    it("should give only those columns which satisfy exist",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.selectColumn(['Name','Company.Name']);
        query.setLimit(100);
        query.doesNotExists('Age');
        query.find().then(function(res){
            for(var i=0;i<res.length;i++){
                if(res[i].get('Age'))
                    done('Unable to get objects with column exists check');
            }
            done();
        },function(){
            done("Unable to find");
        });
    });

    it("should Give the number documents",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Employee');
        obj.set('Name',util.makeString());
        obj.set('Age',20);
        var obj1 = new CB.CloudObject('Company');
        var company = util.makeString();
        obj1.set('Name',company);
        obj.set('Company',obj1);
        obj.save().then(function(res){
            if(res){
                var query = new CB.CloudQuery('Employee');
                query.equalTo('Company.Name',company);
                query.count().then(function(result){
                    console.log(result);
                    if(result === 1)
                        done();
                    else
                        done("Unable to Run Count Query");
                },function(err){
                    done("Unable to find");
                });
            }
        },function(err){
            done("Unable to Save Data");
        });
    });

    it("should find the element by ID",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Employee');
        obj.set('Name',util.makeString());
        obj.set('Age',20);
        var obj1 = new CB.CloudObject('Company');
        var company = util.makeString();
        obj1.set('Name',company);
        obj.set('Company',obj1);
        obj.save().then(function(res){
            if(res){
                var query = new CB.CloudQuery('Employee');
                query.equalTo('Company.Name',company);
                query.findById(res.get('id')).then(function(result){
                    console.log(result);
                    if(result.get('id') === res.get('id'))
                        done();
                    else
                        done("Unable to Find By Id");
                },function(err){
                    done("Unable to find");
                });
            }
        },function(err){
            done("Unable to Save Data");
        });
    });

    it("should query when distinct is set",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.orderByDesc('createdAt');
        query.selectColumn(['Name','Company.Name']);
        query.distinct('Name').then(function(res){
            console.log(res);
            done();
        },function(err){
            throw "Unable to execute find query";
        });
    });

    it("should query by using find One",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.orderByDesc('createdAt');
        query.selectColumn(['Name','Company.Name']);
        query.findOne().then(function(res){
            console.log(res);
            if(res.length === 1)
                done();
            else
                done("Find One returned more than one record");
        },function(err){
            throw "Unable to execute find query";
        });
    });

    it("Should do an OR query over relation",function(done){

        this.timeout(10000);
        var query1 = new CB.CloudQuery('Employee');
        query1.equalTo('Company.Name','CloudBoost');
        var query2 = new CB.CloudQuery('Employee');
        query2.equalTo('Company.Name','CloudBoost');
        var query = CB.CloudQuery.or(query1,query2);
        query.find().then(function(res){
            console.log(res);
            done();
        },function(){
           done('Unable to Find');
        });
    });

    it("Should query over starts with on a column",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.equalTo('Company.Name','CloudBoost');
        query.startsWith('Name','A');
        query.find().then(function(res){
            console.log(res);
            done();
        },function(){
            done("unable to find");
        })
    });


});