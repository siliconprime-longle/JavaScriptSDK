describe("Cloud Cache", function(){
     
    before(function(){
        CB.appKey = CB.masterKey;
    });

    it("Should add an item to the cache", function(done){
        this.timeout(30000);
        var cache = new CB.CloudCache('student');
        cache.put('test1',{name:"Buhiire Keneth", sex:"male", age:24},{
            success: function(response){
                if(response != null){
                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
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

    it("Should create a cache", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.create({
            success: function(response){
                if(response != null){
                    if(response.name === 'student' && response.size === 0){
                        done();
                    }else{
                        done("Incorrect data");
                    }
               }else{
                    done("Item was empty");
               }
            },error: function(error){
                done(error);
            }
        });
    });

    it("Should not create a cache with an empty name.", function(done){
        this.timeout(30000);

        try{
            var cache = new CB.CloudCache('');
            done("Created cache with an empty name.");
        }catch(e){
            done();
        }
        
    });

    it("Should not try to insert null value", function(done){
        this.timeout(30000);

        try{
            var cache = new CB.CloudCache('');
            cache.put('key', null);
            done("Added null value.");
        }catch(e){
            done();
        }
    });

    it("Should get items count", function(done){
        this.timeout(30000);
        var cache = new CB.CloudCache('student');
        cache.put('test1',{name:"Buhiire Keneth", sex:"male", age:24},{
            success: function(response){
                if(response != null){
                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
                        cache.getItemsCount({
                            success: function(response){
                               if(response === 1){
                                done();
                               }else{
                                done("Incorrect data returned.");
                               }
                            },error: function(error){
                                done(error);
                            }
                        });
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

        var cache = new CB.CloudCache('student');
        cache.put('test1',{name:"Buhiire Keneth", sex:"male", age:24},{
            success: function(response){
                if(response != null){
                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
                        cache.get('test1',{
                            success: function(response){
                                if(response != null){
                                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
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

    it("Should get all the cache items", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.put('test1',{name:"Buhiire Keneth", sex:"male", age:24},{
            success: function(response){
                if(response != null){
                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
                        cache.put('test1',{name:"sample2", sex:"male", age:24},{
                            success: function(response){
                                if(response != null){
                                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
                                         cache.getAll({
                                            success: function(response){
                                                if(response.length>1){
                                                    if(response instanceof Array){
                                                        response  = response[0];
                                                        response  = response[1];
                                                         if(response.name === "sample2" && response.sex === "male" && response.age === 24){
                                                            done();
                                                         }else{
                                                            done("Returned with Incorrect data.");
                                                         }
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

    it("Should get information about the cache", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('student');
        cache.put('test1',{name:"Buhiire Keneth", sex:"male", age:24},{
            success: function(response){
                if(response != null){
                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
                          cache.getInfo({
                                success: function(response){
                                    if(response && response instanceof CB.CloudCache){
                                        if(response.size.slice(-2,response.length) === 'kb'){
                                            done();
                                        }else{
                                            done("Got cache information but has incorrect units");
                                        }
                                    }else{
                                        done("No response for the cache info returned or didnot return the CloudCache instance back.");
                                    }
                                },error: function(error){
                                    done(error);
                                }
                           });
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

     it("Should get null when wrong cache info is requested.", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('studsdfsdffds');
        cache.getInfo({
            success: function(response){
               if(!response){
                done();
               }else{
                done("Requested null cache, got something else.");
               }
            },error: function(error){
                done(error);
            }
       });
    });

    it("Should get all the caches", function(done){
        this.timeout(3000);

        var promises = [];

        var cache = new CB.CloudCache('sample1');
        promises.push(cache.put('hello'));

        var cache1 = new CB.CloudCache('sample2');
        promises.push(cache1.put('hello'));

        CB.Promise.all(promises).then(function(){
            CB.CloudCache.getAll({
              success : function(response){
                if(response && response.length >1){
                    if(response[0] instanceof CB.CloudCache && response[0].name === 'sample1' && response[1] instanceof Cb.CloudCache && response[1].name === 'sample2'){
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
        }, function(error){
            done("Cannot put values in a cache.");
        });
       }); 

    it("Should delete a cache from an app.", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('student');
        cache.put('test1',{name:"Buhiire Keneth", sex:"male", age:24},{
            success: function(response){
                if(response != null){
                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
                        cache.delete({
                            success: function(response){
                                if(response){
                                    if(response instanceof CB.CloudCache && response.size === 0){
                                        CB.CloudCache.getAll({
                                          success : function(response){
                                            if(response && response.length === 0){
                                                done();
                                             }else{
                                                  done("Deleted Cache exists.");
                                               }
                                              },error : function(error){
                                                done(error);
                                             }
                                        });
                                    }else{
                                        done("Cache was deleted but incorrect response");
                                    }
                                }else{
                                    done("null returned.");
                                }
                            },error: function(error){
                                done(error);
                            }
                        });
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

    it("Should throw error when deleting a wrong cache", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('dafdfsdf');
       
        cache.delete({
            success: function(response){
                done("Cache which does not exist, is deleted.")
            },error: function(error){
                done();
            }
        });    
    });

     it("Should throw error when clearing a wrong cache", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('dafdfsdf');
       
        cache.clear({
            success: function(response){
                done("Cache which does not exist, is deleted.")
            },error: function(error){
                done();
            }
        });    
    });


    it("Should clear a cache from an app.", function(done){
        this.timeout(3000);

        var cache = new CB.CloudCache('student');
        cache.put('test1',{name:"Buhiire Keneth", sex:"male", age:24},{
            success: function(response){
                if(response != null){
                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
                        cache.clear({
                            success: function(response){
                                if(response){
                                    if(response instanceof CB.CloudCache && response.size === 0){
                                        cache.get('test1', {
                                            success: function(response){
                                                if(response === null){
                                                    done();
                                               }else{
                                                    done("Pushed but item was empty");
                                               }
                                            },error: function(error){
                                                done(error);
                                            }
                                        });
                                    }else{
                                        done("Cache was deleted but incorrect response");
                                    }
                                }else{
                                    done("null returned.");
                                }
                            },error: function(error){
                                done(error);
                            }
                        });
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

     it("Should delete the entire caches from an app.", function(done){
        this.timeout(30000);

        var cache = new CB.CloudCache('student');
        cache.put('test1',{name:"Buhiire Keneth", sex:"male", age:24},{
            success: function(response){
                if(response != null){
                    if(response.name === "Buhiire Keneth" && response.sex === "male" && response.age === 24){
                        CB.CloudCache.deleteAll({
                            success: function(response){
                                if(response){
                                    if(response instanceof Array){
                                        cache.get('test1', {
                                            success: function(response){
                                                done("Wrong value  returned.");
                                            },error: function(error){
                                                done();
                                            }
                                        });
                                    }else{
                                        done("Cache was deleted but incorrect response");
                                    }
                                }else{
                                    done("null returned.");
                                }
                            },error: function(error){
                                done(error);
                            }
                        });
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
});
