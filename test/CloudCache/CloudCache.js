describe("Cloud Cache", function(){
     before(function(){
        CB.appKey = CB.masterKey;
      });
    it("Should add an item to the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.document.item = "name:Buhiire Keneth, sex:male, age:24";
        cache.put('test8').then(function(res){
            if(res)
               done();
           else
                throw "Unable to add an item";
        }, function(err){
            throw "Failed to add an item to the cache";
        });
    });

    // it("Should get the item in the cache", function(done){
    //     this.timeout(30000);

    //     var cache = new CB.CloudCache('student');
    //     cache.get('test8').then(function(res){
    //         if(res)
    //            done();
    //         else
    //             throw "Unable to get item from cache";
    //     }, function(err){
    //         throw "Failed to get item from Cache";
    //     });

    // });

    // it("Should get all the caches", function(done){
    //     this.timeout(30000);
    //     var cache = new CB.CloudCache('student');
    //     cache.getAll().then(function(res){
    //         if(res)
    //             done();
    //         else
    //             throw "Unable to get all the caches";
    //     }, function(err){
    //         throw "Failed to get all the cache";
    //     });
    // });

    // it("Should get information about the cache", function(done){
    //     this.timeout(3000);

    //     var cache = new CB.CloudCache('student');
    //     cache.getInfo().then(function(res){
    //         if(res)
    //            done();
    //         else
    //             throw "Unable to get cache information";
    //     }, function(err){
    //         throw "Failed to get information about the cache";
    //     });
    // });

    it("Should get all the app cache", function(done){
        this.timeout(3000);
        CB.CloudCache.getAll().then(function(res){
            if(res)
                done();
            else
                throw "Unable to get all app caches";
        }, function(err){
            throw "Failed to get information about the cache";
        });
    });

    // it("Should delete a cache from an app", function(done){
    //     this.timeout(3000);

    //     var cache = new CB.CloudCache('student');
    //     cache.deleteAll().then(function(res){
    //         if(res)
    //            done();
    //        else
    //         throw "Unable to delete cache "
    //     }, function(err){
    //         throw "Failed to get information about the cache";
    //     });
    // });

    //  it("Should delete the entire app:cachename cache", function(done){
    //     this.timeout(30000);

    //     CB.CloudCache.deleteAll().then(function(res){
    //         if(res)
    //             done();
    //         else
    //             throw "Unable to delete all the app cache";
    //     }, function(err){

    //         throw "Failed to delete all the cache";
    //     });
    // });
});
