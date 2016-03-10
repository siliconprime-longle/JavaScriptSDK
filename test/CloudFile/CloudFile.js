describe("Cloud Files", function(done) {

    it("Should Save a file with file data and name",function(done){

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);
        fileObj.save().then(function(file){
            console.log(file);
            if(file.url) {
               
              if(!window){
                //Lets configure and request
                request({
                        url: file.url, //URL to hit
                        method: 'GET',
                    }, function(error, response, body){
                        if(error) {
                            done(error);
                        } else {
                           done();
                        }
                    });
                }else{
                    $.ajax({
                        // The URL for the request
                        url: file.url,
                        // Whether this is a POST or GET request
                        type: "GET",
                        // Code to run if the request succeeds;
                        // the response is passed to the function
                        success: function(text) {
                           done();
                        },
                        // Code to run if the request fails; the raw request and
                        // status codes are passed to the function
                        error: function( xhr, status, errorThrown ) {
                            done("Error thrown.");
                        },
                    });
                }
            }else{
                throw 'únable to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });


    it("Should return the file with CloudObject",function(done){

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);
        fileObj.save().then(function(file){
            if(file.url) {
                var obj = new CB.CloudObject('Company');
                obj.set('File',file);
                obj.save({
                    success : function(obj){
                        if(obj.get('File').url){
                            done();
                        }else{
                            done("Did not get the file object back.");
                        }
                    }, error : function(error){
                        done(error);
                    }
                });

            }else{
                throw 'ún able to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });

     it("Should count progress bar",function(done){

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);
        fileObj.save({uploadProgress : function(progress){
            done();
        }, success : function(){

        }, error : function(){

        }});
    });


    it("Should return the fileList with CloudObject",function(done){

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);

        var promises = [];
        promises.push(fileObj.save());

        var data = 'DFSAF';
        var name = 'aDSbc.txt';
        var type = 'txt';
        var fileObj2 = new CB.CloudFile(name,data,type);

        promises.push(fileObj2.save());

        CB.Promise.all(promises).then(function(files){
            if(files.length>0) {
                var obj = new CB.CloudObject('Sample');
                obj.set('name','sample');
                obj.set('fileList',files);
                obj.save({
                    success : function(obj){
                        if(obj.get('fileList').length>0){
                            if(obj.get('fileList')[0].url && obj.get('fileList')[1].url){
                                done();
                            }else{
                                done("Did not get the URL's back");
                            }
                        }else{
                            done("Didnot get the file object back.");
                        }
                    }, error : function(error){
                        done(error);
                    }
                });

            }else{
                throw 'ún able to get the url';
            }
        }, function(error){
            done(error);
        });
    });

    it("Should return the fileList with findById",function(done){

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);

        var promises = [];
        promises.push(fileObj.save());

        var data = 'DFSAF';
        var name = 'aDSbc.txt';
        var type = 'txt';
        var fileObj2 = new CB.CloudFile(name,data,type);

        promises.push(fileObj2.save());

        CB.Promise.all(promises).then(function(files){
            if(files.length>0) {
                var obj = new CB.CloudObject('Sample');
                obj.set('name','sample');
                obj.set('fileList',files);
                obj.save({
                    success : function(obj){
                        var query = new CB.CloudQuery("Sample");
                        query.include('fileList');
                        query.findById(obj.id,{
                            success : function(newObj){
                                if(newObj.get('fileList').length>0){
                                    if(newObj.get('fileList')[0].url && newObj.get('fileList')[1].url){
                                        done();
                                    }else{
                                        done("Did not get the URL's back");
                                    }
                                }else{
                                    done("Didnot get the file object back.");
                                }
                            },error : function(error){
                                done(error);
                            }
                        });
                        
                    }, error : function(error){
                        done(error);
                    }
                });

            }else{
                throw 'ún able to get the url';
            }
        }, function(error){
            done(error);
        });
    });


    it("Should Save a file and give the url",function(done){

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);
        fileObj.save().then(function(file){
            if(file.url) {
                console.log(file);
                console.log("Saved file");
                done();
            }else{
                throw 'ún able to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });

    it("Should delete a file with file data and name",function(done){

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);
        fileObj.save().then(function(file){
            if(file.url) {
                file.delete().then(function(file){
                    console.log(file);
                    if(file.url === null)
                        done();
                    else
                        throw "file delete error"
                },function(err){
                    throw "unable to delete file";
                });
            }else{
                throw 'unable to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });

    try {

        if (window) {
            it("should save a new file", function (done) {

                this.timeout(30000);
                var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                try {
                    var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                } catch (e) {
                    var builder = new WebKitBlobBuilder();
                    builder.append(aFileParts);
                    var oMyBlob = builder.getBlob();
                }
                var file = new CB.CloudFile(oMyBlob);

                file.save().then(function (file) {
                    if (file.url) {
                        done();
                    } else {
                        throw "Upload success. But cannot find the URL.";
                    }
                }, function (err) {
                    throw "Error uploading file";
                });

            });
            
            it("should delete a file", function (done) {

                this.timeout(30000);
                var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                try {
                    var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                } catch (e) {
                    var builder = new WebKitBlobBuilder();
                    builder.append(aFileParts);
                    var oMyBlob = builder.getBlob();
                }
                var file = new CB.CloudFile(oMyBlob);

                file.save().then(function (file) {
                    if (file.url) {
                        //received the blob's url
                        console.log(file.url);
                        file.delete().then(function (file) {
                            if (file.url === null) {
                                done();
                            } else {
                                throw "File deleted, url in SDK not deleted";
                            }
                        }, function (err) {
                            throw "Error deleting file";
                        })
                    } else {
                        throw "Upload success. But cannot find the URL.";
                    }
                }, function (err) {
                    throw "Error uploading file";
                });
            });
            it("should save a new file", function (done) {

                this.timeout(30000);
                var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                try {
                    var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                } catch (e) {
                    var builder = new WebKitBlobBuilder();
                    builder.append(aFileParts);
                    var oMyBlob = builder.getBlob();
                }
                var file = new CB.CloudFile(oMyBlob);
                var file1 = new CB.CloudFile(oMyBlob);

                var obj = new CB.CloudObject('Sample');
                obj.set('fileList', [file, file1]);
                obj.set('name', 'abcd');
                obj.save().then(function (file) {
                    if (file.get('fileList')[0].get('id') && file.get('fileList')[1].get('id')) {
                        done();
                    } else {
                        throw "Upload success. But cannot find the URL.";
                    }
                }, function (err) {
                    throw "Error uploading file";
                });

            });
        }
    }catch(e){
        console.log('In node');
    }

   it("Should Save a file file data and name then fetch it",function(done){

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name,data,type);
        fileObj.save().then(function(file){
            console.log(file);
            if(file.url) {
                file.fetch().then(function(res){
                    res.getFileContent().then(function(res){
                        console.log(res);
                        done();
                    },function(){
                        throw "Unable to Fetch File";
                    });
                },function(){
                    throw "Unable to Fetch File";
                });
            }else{
                throw 'ún able to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });


    it("Include Over File",function(done) {

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name, data, type);
        var obj = new CB.CloudObject('Sample');
        obj.set('file',fileObj);
        obj.set('name','abcd');
        obj.save().then(function(res){
            console.log(res);
            var id = res.get('id');
            var query = new CB.CloudQuery('Sample');
            query.equalTo('id',id);
            query.include('file');
            query.find().then(function(res){
                console.log(res);
                done();
            },function(){
                throw "Unable to Find";
            });
        },function(err){
            throw "unable to save object";
        });
    });


    it("Should Save a file file data and name then fetch it",function(done) {

        this.timeout(30000);

        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name, data, type);
        var obj = new CB.CloudObject('Sample');
        obj.set('file',fileObj);
        obj.set('name','abcd');
        obj.save().then(function(res){
            console.log(res);
            var file = res.get('file');
            file.fetch().then(function(res){
                console.log(res);
                if(res.get('url'))
                    done();
                throw "Unable to fetch the file";
            },function(err){
                throw "Unable to fetch file";
            });
        },function(err){
            throw "unable to save object";
        });
    });

    it("should save a file and get from a relation",function(done){

        this.timeout(300000);

        var obj1 = new CB.CloudObject('Employee');
        var obj2 = new CB.CloudObject('Company');
        obj1.set('Name','abcd');
        obj2.set('Name','pqrs');
        var data = 'akldaskdhklahdasldhd';
        var name = 'abc.txt';
        var type = 'txt';
        var fileObj = new CB.CloudFile(name, data, type);
        fileObj.save().then(function(res){
            obj2.set('File',res);
            obj1.set('Company',obj2);
            obj1.save().then(function(res){
                var query = new CB.CloudQuery('Employee');
                query.include('Company.File');
                query.equalTo('id',res.get('id'));
                query.find().then(function(res){
                    console.log(res);
                    done();
                },function(err){
                    throw "Unable to query";
                });
            },function(){
                throw "Unable to Save Cloud Object";
            });
        },function(err){
           throw "Unable to Save file";
        });

    });

    // it("Should get the image",function(done){

    //     this.timeout(20000);
    //     var url = "http://localhost:4730/file/sample123/youthempowerment.jpg";
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.onreadystatechange = getImage;
    //     xhttp.open('GET', url, true);
    //     xhttp.onload = function(e){
    //         if(xhttp.readyState === 4){
    //             if(xhttp.status === 200){
    //                 done();
    //             }else{
    //                 throw "Failed to get the image";
    //             }
    //         };
    //         xhttp.onerror = function(e){
    //             throw "Error"
    //         }

    //     };

    //     function getImage(){
    //         console.log(xhttp.responseType);
    //     }

    //     xhttp.send(null);

    // });

    // it("Should resize the image",function(done){

    //     this.timeout(20000);
    //     var url = "http://localhost:4730/file/sample123/youthempowerment.jpg?resizeWidth=100&resizeHeight=100";
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.onreadystatechange = resizeImage;
    //     xhttp.open('GET', url, true);
    //     xhttp.onload = function(e){
    //         if(xhttp.readyState === 4){
    //             if(xhttp.status === 200){
    //                 done();
    //             }else{
    //                 throw "Failed to resize the image";
    //             }
    //         };
    //         xhttp.onerror = function(e){
    //             throw "Error"
    //         }

    //     };
    //       function resizeImage(){
    //         console.log(xhttp.responseType);
    //       }
    //     xhttp.send(null);

    //     });
    // it("Should crop the image",function(done){

    //     this.timeout(30000);
    //     var url = "http://localhost:4730/file/sample123/youthempowerment.jpg?cropX=50&cropY=50&cropW=50&cropH=50";
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open('GET', url, true);
    //     xhttp.onload = function(e){
    //         if(xhttp.readyState === 4){
    //             if(xhttp.status === 200){
    //                 done();
    //             }else{
    //                 throw "Failed to crop the image";
    //             }
    //         };
    //         xhttp.onerror = function(e){
    //             throw "Error"
    //         }

    //     };

    //     xhttp.send(null);

    //     });

    // it("Should change the quality of the image",function(done){

    //     this.timeout(30000);
    //     var url = "http://localhost:4730/file/sample123/youthempowerment.jpg?quality=2";
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open('GET', url, true);
    //     xhttp.onload = function(e){
    //         if(xhttp.readyState === 4){
    //             if(xhttp.status === 200){
    //                 done();
    //             }else{
    //                 throw "Failed to change the quality of the image";
    //             }
    //         };
    //         xhttp.onerror = function(e){
    //             throw "Error"
    //         }

    //     };

    //     xhttp.send(null);

    //     });

    // it("Should change the opacity of the image",function(done){

    //     this.timeout(30000);
    //     var url = "http://localhost:4730/file/sample123/youthempowerment.jpg?opacity=0.4";
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open('GET', url, true);
    //     xhttp.onload = function(e){
    //         if(xhttp.readyState === 4){
    //             if(xhttp.status === 200){
    //                 done();
    //             }else{
    //                 throw "Failed to change the opacity of the image";
    //             }
    //         };
    //         xhttp.onerror = function(e){
    //             throw "Error"
    //         }

    //     };

    //     xhttp.send(null);

    //     });

    // it("Should scale the image",function(done){

    //     this.timeout(30000);
    //     var url = "http://localhost:4730/file/sample123/youthempowerment.jpg?scale=2";
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open('GET', url, true);
    //     xhttp.onload = function(e){
    //         if(xhttp.readyState === 4){
    //             if(xhttp.status === 200){
    //                 done();
    //             }else{
    //                 throw "Failed to scale the image";
    //             }
    //         };
    //         xhttp.onerror = function(e){
    //             throw "Error"
    //         }

    //     };

    //     xhttp.send(null);

    //     });
    // it("Should contain the image",function(done){

    //     this.timeout(30000);
    //     var url = "http://localhost:4730/file/sample123/youthempowerment.jpg?containWidth=100&containHeight=100";
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open('GET', url, true);
    //     xhttp.onload = function(e){
    //         if(xhttp.readyState === 4){
    //             if(xhttp.status === 200){
    //                 done();
    //             }else{
    //                 throw "Failed to contain the image";
    //             }
    //         };
    //         xhttp.onerror = function(e){
    //             throw "Error"
    //         }

    //     };

    //     xhttp.send(null);

    //     });

    // it("Should rotate the image",function(done){

    //     this.timeout(30000);
    //     var url = "http://localhost:4730/file/sample123/youthempowerment.jpg?rDegs=0.45";
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open('GET', url, true);
    //     xhttp.onload = function(e){
    //         if(xhttp.readyState === 4){
    //             if(xhttp.status === 200){
    //                 done();
    //             }else{
    //                 throw "Failed to rotate the image";
    //             }
    //         };
    //         xhttp.onerror = function(e){
    //             throw "Error"
    //         }

    //     };

    //     xhttp.send(null);

    //     });

    // it("Should blur the image",function(done){

    //     this.timeout(30000);
    //     var url = "http://localhost:4730/file/sample123/youthempowerment.jpg?bSigma";
    //     var xhttp = new XMLHttpRequest();
    //     xhttp.open('GET', url, true);
    //     xhttp.onload = function(e){
    //         if(xhttp.readyState === 4){
    //             if(xhttp.status === 200){
    //                 done();
    //             }else{
    //                 throw "Failed to blur the image";
    //             }
    //         };
    //         xhttp.onerror = function(e){
    //             throw "Error"
    //         }

    //     };

    //     xhttp.send(null);

    //     });

});
