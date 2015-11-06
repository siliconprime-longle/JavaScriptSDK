describe("Cloud Cache", function(){

    it("Should add an item to the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('test');
        cache.put('test1','name:cloudboost name', null, function(err){
            if(err) throw "Failed to add an item to the cache";
            done();
        });
    });

    it("Should get the value in the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('test');
        cache.get('test1', function(err, result){
            if(err) throw "Failed to get value";
            done();
        });
    });

    it("Should clear the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('test');
        cache.clear('test1',function(err){
            if(err) throw "Failed to clear the cache";
            done();
        });
    });

    it("Should delete the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('test');
        cache.delete('test1',function(err){
            if(err) throw "Failed to delete the cache";
            done();
        });
    });

    // it("Should increment the cache", function(done){
    //     this.timeout(30000);

    //     var cache = new CB.CloudCache('test');
    //     cache.increment('test1', function(err){
    //         if(err) throw "Failed to increment the cache";
    //         done();
    //     });
    // });

    it("Should get information about the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.getInfo('test1',function(err){
            if(err) throw "Failed to get information about the cache";
            done();
        });
    });

    it("Should get all the caches", function(done){
        this.timeout(30000);
        var cache = new CB.CloudCache('test');
        cache.getAll(function(err){
            if(err) throw "Failed to get all the cache";
            done();
        });
    });
});
