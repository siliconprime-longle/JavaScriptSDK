describe("Query over Orient",function(done){

    it("Should Query over related Document",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Employee');
        obj.set('Name',util.makeString());
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
                    if(result.length > 0)
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

    it("should select specific columns from document",function(done){

        this.timeout(10000);

        var query = new CB.CloudQuery('Employee');
        query.selectColumn('Company.Name');
        query.find().then(function(obj){
            console.log(obj);
            done();
        },function(){
           throw "Unable to do query";
        });
    });
});