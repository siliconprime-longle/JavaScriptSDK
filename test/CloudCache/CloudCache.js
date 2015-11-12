describe("Cloud Cache", function(){
     before(function(){
        CB.appKey = CB.masterKey;
      });
    it("Should add an item to the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.document.item = "education:Mbarara High School";
        cache.put('test8').then(function(){
            done();
        }, function(){
            throw "Failed to add an item to the cache";
        });
    });

    it("Should get the value in the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.get('test8').then(function(){
            done();
        }, function(){
            throw "Failed to get value";
        });
    });

    it("Should get all the caches", function(done){
        this.timeout(30000);
        var cache = new CB.CloudCache('student');
        cache.listCache().then(function(){
            done();
        }, function(){
            throw "Failed to get all the cache";
        });
    });

    it("Should get information about the cache", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('student');
        cache.getInfo().then(function(res){
            done();
        }, function(){
            throw "Failed to get information about the cache";
        });
    });

     it("Should clear the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');

        cache.clear().then(function(res){
            done();
        }, function(){
            throw "Failed to clear the cache";
        });
    });
});
