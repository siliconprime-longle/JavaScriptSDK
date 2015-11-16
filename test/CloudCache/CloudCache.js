describe("Cloud Cache", function(){
     before(function(){
        CB.appKey = CB.masterKey;
      });
    it("Should add an item to the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.document.item = {name:"Buhiire Keneth", sex:"male", age:24};
        cache.put('test1',{
            success: function(response){
                    if(response != null){
                    if(response === JSON.stringify({name:"Buhiire Keneth", sex:"male", age:24} )){
                        done();
                    }else{
                    done("Pushed but incorrect data");
                }
               }else{
                done("Pushed but item was empty");
               }
            },error: function(error){
                done(error);
            }
        });
    });

    it("Should get the item in the cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('school');
        cache.document.item = {name:"Mbarara High School", location:"Mbarara"};
        cache.put('test2');
        cache.get('test2',{
            success: function(response){
                console.log(response);
                if(response != null){
                    if(response === JSON.parse({name:"Mbarara High School", location:"Mbarara"})){
                        done();
                    }else{
                    done("Got item but incorrect data");
                }
                }else{
                    done("Item received but it is empty");
                }
            },error: function(error){
                done(error);
            }
        });

    });

    it("Should get all the cache items", function(done){
        this.timeout(30000);
        var cache = new CB.CloudCache('district');
        cache.document.item = {name:"Mbarara District", population:"2 Million People"};
        cache.put('test3');
        cache.getAll({
            success: function(response){
                if(response.length>0){
                    if(response instanceof Array){
                        done();
                    }else{
                    done("Got cache but incorrect data");
                }
                }else{
                    done("cache Item received but not an array or it is empty");
                }
            },error: function(error){
                done(error);
            }
        });

    });

    it("Should get information about the cache", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('county');
        cache.document.item = {name:"Mbarara ", population:"4 Million People"};
        cache.put('test4');
        cache.getInfo({
            success: function(response){
                if(response){
                    if(response.slice(-2,response.length) === 'kb'){
                        done();
                    }else{
                    done("Got cache information but has incorrect units");
                }
                }else{
                    done("No response for the cache info returned");
                }
            },error: function(error){
                done(error);
            }
        });
    });

    it("Should get all the caches", function(done){
        this.timeout(3000);
        CB.CloudCache.getAll({
                  success : function(response){
                   console.log(response);
                if(response){
                    if(response instanceof CB.CloudCache ){
                       done();
                    }
                    else{
                        done("incorrect data returned");
                    }
                 }else{
                      done("Cache does not exist");
                   }
                  },error : function(error){
                 done(error);
                 }
        });
       });

    it("Should get the cache ", function(done){
        this.timeout(3000);
        var cache = new CB.CloudCache('province');
        cache.document.item = {name:"Western", population:"15 Million People"};
        cache.put('test5');
           cache.getCache({
                  success : function(response){
                if(response){
                    if(response instanceof CB.CloudCache ){
                       done();
                    }
                    else{
                        done("Incorect data returned");
                    }
                 }else{
                      done("Cache doesnot exist");
                   }
                  },error : function(error){
                 done(error);
                 }
        });
       });

    it("Should delete a cache from an app", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('country');
        cache.document.item = {name:"Uganda", population:"42 Million People"};
        cache.put('test6');
        cache.deleteAll({
            success: function(response){
                console.log(response);
                if(response){
                    if(response instanceof Integer){
                        done();
                    }else{
                    done("Cache was deleted but incorrect response");
                }
                }else{
                    done("cache does not exist");
                }
            },error: function(error){
                done(error);
            }
        });
    });

     it("Should delete the entire app:cachename cache", function(done){
        this.timeout(30000);

        CB.CloudCache.deleteAll({
            success: function(response){
                console.log(response);
                if(response){
                    if(response instanceof Array){
                        done();
                    }else{
                    done(" All Cache were deleted but incorrect response");
                }
                }else{
                    done("App with that ID does not exist");
                }
            },error: function(error){
                done(error);
            }
        });
    });
});
