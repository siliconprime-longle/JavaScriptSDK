describe("Search Bugs",function(done){

	it("should save",function(done){

        this.timeout(10000);

        var obj = new CB.CloudObject('cron');
        obj.set('name','test');
        obj.save().then(function(res){
            if(res.expires === null)
                done();
            else
                throw "Unable to save expire as null";
        },function(){
            throw "Unable to save";
        });
    });

    it("should save",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('cron');
        obj.set('name','test');
        obj.set('expires',new Date().getTime());
        obj.save().then(function(res){
            if(res.expires )
                done();
            else
                throw "Unable to save expire as null";
        },function(){
            throw "Unable to save";
        });
    });
})