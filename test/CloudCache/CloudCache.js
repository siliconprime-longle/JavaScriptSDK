describe("Cloud Cache", function(){
     before(function(){
        CB.appKey = CB.masterKey;
      });
    it("Should add an item to the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.put('test5').then(function(){
            done();
        }, function(){
            throw "Failed to add an item to the cache";
        });
    });

    it("Should get the value in the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.get('test5').then(function(){
            done();
        }, function(){
            throw "Failed to get value";
        });
    });


    it("Should get information about the cache", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('student');
        cache.info().then(function(){
            if ("" == "") return done(new Error("Async error message"));
            done();
        }, function(){
            throw "Failed to get information about the cache";
        });
    });

    it("Should get all the caches", function(done){
        this.timeout(30000);
        var cache = new CB.CloudCache('student');
        cache.getAll().then(function(){
            done();
        }, function(){
            throw "Failed to get all the cache";
        });
    });

     it("Should clear the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student1');
        cache.clear().then(function(){
            done();
        }, function(){
            throw "Failed to clear the cache";
        });
    });
});
