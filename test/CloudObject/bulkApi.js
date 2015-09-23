describe("Bulk API",function(done){

    it("should save array of CloudObject using bulk Api",function(done){

        this.timeout(10000);

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

    it("should save  and then delete array of CloudObject using bulk Api",function(done){

        this.timeout(10000);

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
});