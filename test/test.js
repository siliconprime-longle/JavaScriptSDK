var CB = require('../lib/cloudboost.js');
   var util = {
     makeString : function(){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	},	

	makeEmail : function(){
	    return this.makeString()+'@sample.com';
	}

   };

   

	
describe("Server Check",function(){
    it("should check for localhost",function(done){
    	this.timeout(10000);
        var xmlhttp;
        this.timeout(10000);
        var req = typeof(require) === 'function' ? require : null;
        // Load references to other dependencies
        if (typeof(XMLHttpRequest) !== 'undefined') {
             xmlhttp = XMLHttpRequest;
            } else if (typeof(require) === 'function' &&
                typeof(require.ensure) === 'undefined') {
                xmlhttp = req('xmlhttprequest').XMLHttpRequest;
            }
            xmlhttp = new xmlhttp();
        xmlhttp.open('GET','http://localhost:4730',true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == xmlhttp.DONE) {
                if (xmlhttp.status == 200) {
                    CB.appId = 'sample123';
                    CB.appKey = 'Qopoy/kXd+6G734HsjQMqGPGOvwEJYmBG84lQawRmWM=';
                    CB.serverUrl = 'http://localhost:4730';
                    CB.serviceUrl = 'http://localhost:3000';
                    CB.socketIoUrl = CB.serverUrl;
                    CB.apiUrl = CB.serverUrl + '/api';
                    done();
                }
                else {

                    if(window.mochaPhantomJS){
                         console.log('RUNNING IN PHANTOM JS'); 
                         CB.serverUrl = 'http://stagingdataservices.azurewebsites.net';
                         CB.socketIoUrl = CB.serverUrl;
                         CB.apiUrl = CB.serverUrl + '/api';
                    }

                    CB.appId = 'travis123';
                    CB.appKey = '6dzZJ1e6ofDamGsdgwxLlQ==';
                    done();

                }
            }
        }
    });
});

describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(500000);

        CB.CloudApp.init(CB.appId, CB.appKey);

        done();
    });
});

describe("ACL", function () {

    it("Should set the public write access", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicWriteAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.deny.user.length === 0) {
                obj.set('age',15);
                obj.save().then(function(){
                    throw "Should not save object with no right access";
                },function(){
                    done();
                });
            }
            else
                throw "public write access set error"
        }, function () {
            throw "public write access save error";
        });
    });

    it("Should set the public read access", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.deny.user.length === 0)
                done();
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });
    var username = util.makeString();
    var passwd = "abcd";
    var userObj = new CB.CloudUser();

    it("Should create new user", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    it("Should set the user read access", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setUserReadAccess(userObj.get('id'),true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.indexOf(userObj.get('id')) >= 0)
                done();
            else
                throw "user read access set error"
        }, function () {
            throw "user read access save error";
        });

    });

    it("Should allow users of role to write", function (done) {
        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }


        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setRoleWriteAccess(userObj.get('id'),true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.allow.role.indexOf(userObj.get('id'))>=0)
                done();
            else
                throw "user role write access set error"
        }, function () {
            throw "user role write access save error";
        });

    });

    it("Should allow users of role to read", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
        }

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.ACL.setRoleReadAccess(userObj.get('id'),true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.role.indexOf(userObj.get('id'))>=0)
                done();
            else
                throw "user role read access set error"
        }, function () {
            throw "user role read access save error";
        });

    });
});


describe("ACL on CloudObject Notifications", function () {

    it("Should create new user and listen to CloudNotification events.", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        var isDone = false;

        this.timeout(20000);

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(){
                CB.CloudObject.off('User','created');
                if(!isDone){
                    isDone=true;
                    done();
                }
                
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.save();
           
        }, function (error) {
            done("user create error");
        });

    });

    it("Should NOT receieve a  notification when public read access is false;", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        var isDone = false;

        this.timeout(30000);

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(data){
                CB.CloudObject.off('User','created');
                if(!isDone){
                    isDone=true;
                     done("Sent notification when set public read access is false");
                }
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.ACL = new CB.ACL();
            userObj.ACL.setPublicReadAccess(false);

            userObj.save();

            setTimeout(function(){ 
                console.log('Done!');
                if(!isDone){
                    isDone=true;
                    done();
                }

            }, 1000); //wait for sometime and done! 
           
        }, function (error) {
            throw "user create error";
        });

    });

    it("Should NOT receivee an event when user read access is false;", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(){
                CB.CloudObject.off('User','created');
                if(!isDone){
                    isDone=true;
                     done("Sent notification when set public read access is false");
                }
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.ACL = new CB.ACL();
            userObj.ACL.setUserReadAccess(user.id, false);

            userObj.save();

            setTimeout(function(){ 
               if(!isDone){
                    isDone=true;
                    done();
                }
            }, 10000); //wait for sometime and done! 
           
        }, function (error) {
            done("user create error");
        });

    });

    it("Should NOT receieve a  notification when public read access is true but user is false;", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(){
                CB.CloudObject.off('User','created');
                if(!isDone){
                    isDone=true;
                     done("Sent notification when set public read access is false");
                }
               
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.ACL = new CB.ACL();
            userObj.ACL.setPublicReadAccess(true);
            userObj.ACL.setUserReadAccess(user.id, false);

            userObj.save();

            setTimeout(function(){ 
                if(!isDone){
                    isDone=true;
                    done();
                }
             }, 10000); //wait for sometime and done! 
           
        }, function (error) {
            done("user create error");
        });

    });


    it("Should receieve a notification when public read access is false but user is true;", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('User', 'created', function(){
               CB.CloudObject.off('User','created');
               if(!isDone){
                    isDone=true;
                    done();
                }
            });

            var username = util.makeString();
            var passwd = "abcd";
            var userObj = new CB.CloudUser();

            userObj.set('username', username);
            userObj.set('password',passwd);
            userObj.set('email',util.makeEmail());

            userObj.ACL = new CB.ACL();
            userObj.ACL.setPublicReadAccess(false);
            userObj.ACL.setUserReadAccess(user.id, true);

            userObj.save();

        }, function (error) {
            done("user create error");
        });

    });

    it("Should NOT receieve a notification when user is logged out.", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('Custom1', 'created', function(){
               CB.CloudObject.off('Custom1','created');
               if(!isDone){
                    isDone=true;
                    done("Wrong event fired");
                }
            });

            var obj = new CB.CloudObject('Custom1'); 
            obj.set('newColumn', 'Sample');
            obj.ACL = new CB.ACL();
            obj.ACL.setPublicReadAccess(false);
            obj.ACL.setPublicWriteAccess(true);
            obj.ACL.setUserReadAccess(user.id, true);

            user.logOut({
                success: function(user){

                    obj.save();

                    setTimeout(function(){ 
                        if(!isDone){
                            isDone=true;
                            done();
                        }
                     }, 10000); //wait for sometime and done! 

                }, error : function(error){
                    done("Error");
                }
            });

        }, function (error) {
            done("user create error");
        });

    });

    it("Should receieve a notification when user is logged out and logged back in.", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(30000);

        var isDone = false;

        var username = util.makeString();
        var passwd = "abcd";
        var userObj = new CB.CloudUser();

        userObj.set('username', username);
        userObj.set('password',passwd);
        userObj.set('email',util.makeEmail());
        userObj.signUp().then(function(user) {
            
            CB.CloudObject.on('Custom1', 'created', function(){
               CB.CloudObject.off('Custom1','created');
               if(!isDone){
                    isDone=true;
                    done();
                }
            });

            var obj = new CB.CloudObject('Custom1'); 
            obj.set('newColumn', 'Sample');
            obj.ACL = new CB.ACL();
            obj.ACL.setPublicReadAccess(false);
            obj.ACL.setPublicWriteAccess(true);
            obj.ACL.setUserReadAccess(user.id, true);

            user.logOut({
                success: function(user){
                console.log(user);
                    user.set("password",passwd);
                    user.logIn({
                        success : function(){
                             obj.save();

                        }, error: function(){
                            done("Failed to login a user");
                        }
                    });

                   

                }, error : function(error){
                    done("Error");
                }
            });

        }, function (error) {
            done("user create error");
        });

    });
});


describe("Query_ACL", function () {

    var obj = new CB.CloudObject('student4');
    obj.isSearchable = true;
    obj.set('age',55);

    var username = util.makeString();
    var passwd = "abcd";
    var user = new CB.CloudUser();
    it("Should create new user", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);
        user.set('username', username);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    it("Should set the public read access", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }


        this.timeout(20000);

        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.length === 0) {
                var cq = new CB.CloudQuery('student4');
                cq. equalTo('age',55);
                cq.find().then(function(list){
                    if(list.length>0)
                    {
                        throw "should not return items";
                    }
                    else
                        done();
                },function(){
                    throw "should perform the query";
                });
            }
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });

    var obj1 = new CB.CloudObject('student4');
    obj1.isSearchable = true;
    obj1.set('age',60);
    it("Should search object with user read access", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);
        obj1.ACL = new CB.ACL();
        obj1.ACL.setUserReadAccess(user.document._id,false);
        obj1.save().then(function(list) {
            acl=list.get('ACL');
           // if(acl.read.indexOf(user.document._id) >= 0) {
                var user = new CB.CloudUser();
                user.set('username', username);
                user.set('password', passwd);
                user.logIn().then(function(){
                    var cq = new CB.CloudQuery('student4');
                    cq.equalTo('age',60);
                    cq.find().then(function(){
                        done();
                    },function(){
                        throw "should retrieve object with user read access";
                    });
                },function(){
                    throw "should login";
                });
        }, function () {
            throw "user read access save error";
        });

    });



});


    describe("Search_ACL", function () {

    var obj = new CB.CloudObject('student4');
    obj.set('age',150);

        var username = util.makeString();
        var passwd = "abcd";
        var user = new CB.CloudUser();
        it("Should create new user", function (done) {

            if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

            this.timeout(20000);
            user.set('username', username);
            user.set('password',passwd);
            user.set('email',util.makeEmail());
            user.signUp().then(function(list) {
                if(list.get('username') === username)
                    done();
                else
                    throw "create user error"
            }, function () {
                throw "user create error";
            });

        });


   it("Should set the public read access to false", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
        }

        this.timeout(20000);

        obj.ACL = new CB.ACL();
        CB.CloudUser.current.logOut();
        obj.ACL.setUserReadAccess(CB.CloudUser.current.id,true);
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.indexOf('all') === -1) {
             var cs = new CB.CloudSearch('student4');
                cs.searchQuery = new CB.SearchQuery();
                cs.searchQuery.searchOn('age',150);
                cs.search().then(function(list){
                    if(list.length>0)
                    {
                        for(var i=0;i<list.length;i++)
                            if(list[i].get('age') && list[i].ACL.read.allow.user.indexOf('all') === -1)
                                throw "should not return items";
                    }
                    
                    done();
                },function(){
                    done();
                });
            }
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });

   it("Should search object with user read access", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
        }

        this.timeout(20000);
       var user = new CB.CloudUser();
       user.set('username', username);
       user.set('password', passwd);
       user.logIn().then(function(){
            obj.ACL = new CB.ACL();
            obj.save().then(function(list) {
                acl=list.get('ACL');
                    var cs = new CB.CloudSearch('student4');
                     cs.searchQuery = new CB.SearchQuery();
                    cs.searchQuery.searchOn('age',15);

                    cs.search().then(function(){
                        done();
                    },function(){
                        throw "should retrieve object with user read access";
                    });
            }, function () {
                throw "user read access save error";
            });
       },function(){
           throw "should login";
       });

    });

});


describe("Cloud Files", function(done) {

    it("Should Save a file with file data and name",function(done){

        this.timeout(10000);

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

        this.timeout(10000);

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
                throw 'ún able to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });

    try {

        if (window) {
            it("should save a new file", function (done) {

                this.timeout(20000);
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

                this.timeout(200000);
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
        }
    }catch(e){
        console.log('In node');
    }
    //add ACL on CloudFiles.
    
});

describe("CloudObject - Encryption", function () {

    it("should encrypt passwords", function (done) {

        this.timeout(20000);
        
        var obj = new CB.CloudObject('User');
        obj.set('username',util.makeEmail());
        obj.set('password','password');
        obj.set('email',util.makeEmail());

        obj.save().then(function(obj){
            if(obj.get('password') !== 'password')
                done();
            else
                throw "Cannot encrypt";

        }, function(){
            throw "Cannot save a CloudObject";
        });

    });

});
describe("CloudObjectExpires", function () {

    it("should save a CloudObject after expire is set", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.expires=new Date().getTime();
        obj.isSearchable=true;
        obj.save().then(function(obj1) {
            if(obj1.get('expires'))
                done();
        }, function (err) {
            console.log(err);
            throw "Cannot save an object after expire is set";
        });

    });

    it("objects expired should not show up in query", function (done) {

        this.timeout(20000);
        var curr=new Date().getTime();
        var query1 = new CB.CloudQuery('student1');
        query1.equalTo('name','vipul');
        var query2 = new CB.CloudQuery('student1');
        query2.lessThan('age',12);
        var query =  CB.CloudQuery.or(query1,query2);
        delete query.query.$include;
        delete query.query.$or[0].$include;
        delete query.query.$or[1].$include;
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    if(list[i]._expires>curr || !list[i]._expires){
                            break;
                        }
                    else{
                        throw "Expired Object Retrieved";
                    }
                }
                done();
                }else{
                    done();
            }

        }, function(error){

        })

    });


    it("objects expired should not show up in Search", function (done) {

        this.timeout(20000);
        var curr=new Date().getTime();
        var query = new CB.CloudSearch('student1');
        
        var searchFilter1 = new CB.SearchFilter();
        searchFilter1.equalTo('name','vipul');

        var searchFilter2 = new CB.SearchFilter();
        searchFilter2.lessThan('age',12);

        var searchFilter = new CB.SearchFilter();
        searchFilter.or(searchFilter1);
        searchFilter.or(searchFilter2);

        query.searchFilter = searchFilter;
        
        query.search({
            success:function(list){
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i]._expires > curr || !list[i]._expires) {
                        break;
                    }
                    else {
                        throw "expired object retrieved in Search";
                    }
                }
                done();
            }else{ done();
            }
            },error: function(error){
                throw "should not show expired objects";
            }
            });

    });
});
describe("Cloud Objects Files", function() {

    try {
        if(window) {
            var obj = new CB.CloudObject('Student');

            it("should save a file inside of an object", function (done) {

                this.timeout(20000);

                //save file first.
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
                        console.log(file);
                        //create a new object.
                        var obj = new CB.CloudObject('Sample');
                        obj.set('name', 'sample');
                        obj.set('file', file);

                        obj.save().then(function (newobj) {
                            if (newobj.get('file') instanceof CB.CloudFile && newobj.get('file').url) {
                                done();
                            } else {
                                throw "object saved but didnot return file.";
                            }
                        }, function (error) {
                            throw "error saving an object.";
                        });

                    } else {
                        throw "upload success. but cannot find the url.";
                    }
                }, function (err) {
                    throw "error uploading file";
                });

            });

            it("should save an array of files.", function (done) {
                this.timeout(200000);
                //save file first.
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

                        var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                        try {
                            var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                        } catch (e) {
                            var builder = new WebKitBlobBuilder();
                            builder.append(aFileParts);
                            var oMyBlob = builder.getBlob();
                        }
                        var file1 = new CB.CloudFile(oMyBlob);

                        file1.save().then(function (file1) {
                            if (file1.url) {

                                //create a new object.
                                var obj = new CB.CloudObject('Sample');
                                obj.set('name', 'sample');
                                obj.set('fileList', [file, file1]);

                                obj.save().then(function (newObj) {
                                    done();
                                }, function (error) {
                                    throw "Error Saving an object.";
                                });

                            } else {
                                throw "Upload success. But cannot find the URL.";
                            }
                        }, function (err) {
                            throw "Error uploading file";
                        });

                    } else {
                        throw "Upload success. But cannot find the URL.";
                    }
                }, function (err) {
                    throw "Error uploading file";
                });
            });

            it("should save an object with unsaved file.", function (done) {
                done();
            });
        }
    }catch(e){
        console.log("Not in Browser");
    }

});
describe("Cloud Objects Notification", function() {
  
	var obj = new CB.CloudObject('Student');
    var obj1 = new CB.CloudObject('student4');
  it("should alert when the object is created.", function(done) {

      this.timeout(20000);

      CB.CloudObject.on('Student', 'created', function(data){
       if(data.get('name') === 'sample') {
           done();
           CB.CloudObject.off('Student','created',{success:function(){},error:function(){}});
       }
       else
        throw "Wrong data received.";
      }, {
      	success : function(){
      		obj.set('name', 'sample');
      		obj.save().then(function(newObj){
      			obj = newObj;
      		});
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });

   it("should throw an error when wrong event type is entered. ", function(done) {

       this.timeout(20000);
     	try{
     	  CB.CloudObject.on('Student', 'wrongtype', function(data){
	      	throw 'Fired event to wrong type.';
	      });

	      throw 'Listening to wrong event type.';
     	}catch(e){
     		done();
     	}     

    });

    it("should alert when the object is updated.", function(done) {

      this.timeout(20000);
      CB.CloudObject.on('student4', 'updated', function(data){
        done();
          CB.CloudObject.off('student4','updated',{success:function(){},error:function(){}});
      }, {
      	success : function(){
            obj1.save().then(function(){
      		    obj1.set('age', 15);
      		    obj1.save().then(function(newObj){
      			    obj1 = newObj;
      		    }, function(){
      			    throw 'Error Saving an object.';
      		    });
            },function(){
                throw 'Error Saving an object.'
            });
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}

      });
    });

    it("should alert when the object is deleted.", function(done) {

      this.timeout(50000);

      CB.CloudObject.on('Student', 'deleted', function(data){
      	if(data instanceof CB.CloudObject) {
            done();
            CB.CloudObject.off('Student','deleted',{success:function(){},error:function(){}});
        }
        else
          throw "Wrong data received.";
      }, {
      	success : function(){
      		obj.set('name', 'sample');
      		obj.delete();
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });

    it("should alert when multiple events are passed.", function(done) {
      this.timeout(20000);
      var cloudObject = new CB.CloudObject('Student');
      var count = 0;
      CB.CloudObject.on('Student', ['created', 'deleted'], function(data){
      	count++;
      	if(count === 2){
      		done();
      	}
      }, {
      	success : function(){
      		cloudObject.set('name', 'sample');
      		cloudObject.save({
      			success: function(newObj){
      				cloudObject = newObj;
      				cloudObject.set('name', 'sample1');
      				cloudObject.save();
      				cloudObject.delete();
      			}
      		});

      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });

    it("should alert when all three events are passed", function(done) {

      this.timeout(20000);
       
      var cloudObject = new CB.CloudObject('Student');
      var count = 0;
      CB.CloudObject.on('Student', ['created', 'deleted', 'updated'], function(data){
      	count++;
      	if(count === 3){
      		done();
      	}
      }, {
      	success : function(){
      		cloudObject.set('name', 'sample');
      		cloudObject.save({
      			success : function(newObj){
      				cloudObject = newObj; 
      				cloudObject.set('name', 'sample1');
      				cloudObject.save({success : function(newObj){
	      				cloudObject = newObj; 
	      				cloudObject.delete();
	      			}
	      			});
      			}
      		});
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });

    it("should stop listening.", function(done) {

     this.timeout(20000);
      
      var cloudObject = new CB.CloudObject('Student');
      var count = 0;
      CB.CloudObject.on('Student', ['created','updated','deleted'], function(data){
          count++;
      }, {
      	success : function(){
      		CB.CloudObject.off('Student', ['created','updated','deleted'], {
		      	success : function(){
		      		cloudObject.save();
		      	}, error : function(error){
		      		throw 'Error on stopping listening to an event.';
		      	}
		      });
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });

      setTimeout(function(){
      	if(count ===  0){
      		done();
      	}else{
      		throw 'Listening to events even if its stopped.';
      	}

      }, 5000);
    });

});
describe("Query on Cloud Object Notifications ", function() {

	//Use Sample Table. 
	// -> Which has columns : 
	// name : string : required. 

    it("limit : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.limit = 2;   

        var count = 0;

        CB.CloudObject.on('Student', 'created', query, function(){
           ++count;
        });

        for(var i=0;i<3;i++){
            //attach it to the event. 
            var obj = new CB.CloudObject('Student');
            obj.set('name','Nawaz');
            obj.save();
        }

        setTimeout(function(){
            if(count === 2){
                 if(!isDone){
                    isDone=true;
                    done();
                 };
            }else{
                 if(!isDone){
                    isDone=true;
                    done("Limit Error");
                 };
            }
        }, 30000)

    });    

    it("skip : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.skip = 1;   

        var count = 0;

        CB.CloudObject.on('Student', 'created', query, function(data){
           ++count;
        });

        for(var i=0;i<3;i++){
            //attach it to the event. 
            var obj = new CB.CloudObject('Student');
            obj.set('name','Nawaz');
            obj.save();
        }

        setTimeout(function(){
            if(count === 2){
                 if(!isDone){
                    isDone=true;
                    done();
                 };
            }else{
                 if(!isDone){
                    isDone=true;
                    done("Limit Error");
                 };
            }
        }, 20000);

    });
  

    it("notification should work on equalTo Columns",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.equalTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done();
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample');
        obj.save();

    });

    it("should work on equalTo Columns : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.equalTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample1');
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                }
        }, 10000);
    });


    it("should work on notEqualTo Columns : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notEqualTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample1');
        obj.save();

    });


     it("should work on notEqualTo Columns : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notEqualTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample');
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);
    });


    it("greaterThan : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("greaterThan : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });


    it("lessThan : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();
    });


    it("lessThan : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("Exists : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.exists('age');

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("Exists : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.exists('name');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("doesNotExist : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.doesNotExists('name');

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("doesNotExist : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.doesNotExists('age');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("GTE : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThanEqualTo('age',11);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("GTE : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThanEqualTo('age',9);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',8);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });


    it("LTE : 1",function(done){

        var isDone = false;
        
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThanEqualTo('age',11);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("LTE : 2",function(done){

        var isDone = false; 

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThanEqualTo('age',9);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("containedIn : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containedIn('age',[11]);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });

    it("containedIn : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containedIn('age',[9]);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("notContainedIn : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notContainedIn('age',[10]);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });

    it("notContainedIn : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notContainedIn('age',[9]);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });   

    it("containsAll : 1",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containsAll('age',[11]);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("containsAll : 2",function(done){

        var isDone = false;

        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containsAll('age',[8]);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });


    it("or : 1",function(done){

        var isDone = false;
        
        this.timeout(30000);
        //create the query. 
        var query1 = new CB.CloudQuery('Student');
        query1.equalTo('age',8);

        var query2 = new CB.CloudQuery('Student');
        query2.equalTo('name','Nawaz');

        var query = CB.CloudQuery.or(query1, query2);

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',8);
        obj.save();
    });       

    it("or : 2",function(done){

        var isDone = false;
        
        this.timeout(30000);
        //create the query. 
        var query1 = new CB.CloudQuery('Student');
        query1.equalTo('age',8);

        var query2 = new CB.CloudQuery('Student');
        query2.equalTo('name','Nawaz');

        var query = CB.CloudQuery.or(query1, query2);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });

    it("startsWith : 1",function(done){

        var isDone = false;
        
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.startsWith('name','N');       

        CB.CloudObject.on('Student', 'created', query, function(){
           if(!isDone){
                    isDone=true;
                    done();
                };
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Nawaz');
        obj.save();
    });       

    it("startsWith : 2",function(done){

        var isDone = false;
        
        this.timeout(30000);
      
        var query = new CB.CloudQuery('Student');
        query.startsWith('name','N');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            if(!isDone){
                    isDone=true;
                    done("Fired a wrong event");
                }
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','x');
        obj.save();

        setTimeout(function(){
            if(!isDone){
                    isDone=true;
                    done();
                };
        }, 10000);

    });


    it("EqualTo over CloudObjects : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');
        child.save({
            success : function(child){
               
                //create the query. 
                var query = new CB.CloudQuery('Custom2');
                query.equalTo('newColumn7', child);

                CB.CloudObject.on('Custom2', 'created', query, function(data){
                   if(!isDone){
                        isDone=true;
                        done();
                    }
                });

                var obj = new CB.CloudObject('Custom2');
                obj.set('newColumn7',child);
                obj.save();

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("EqualTo over CloudObjects : 2",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');

        child.save({
            success : function(child){
                var child2 = new CB.CloudObject('student1');
        
                child2.save({
                    success : function(child2){
                        //create the query. 
                        var query = new CB.CloudQuery('Custom2');
                        query.equalTo('newColumn7', child2);

                        CB.CloudObject.on('Custom2', 'created', query, function(data){
                            if(!isDone){
                                isDone=true;
                                done("Wrong event fired");
                            }
                        });

                        var obj = new CB.CloudObject('Custom2');
                        obj.set('newColumn7',child);
                        obj.save();

                        setTimeout(function(){
                            if(!isDone){
                                    isDone=true;
                                    done();
                                };
                        }, 10000);
                    }, error : function(error){
                     done("Object cannot be saved");
                }
            });

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });

    it("ContainedIn : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');
        child.save({
            success : function(child){
               
                //create the query. 
                var query = new CB.CloudQuery('Custom4');
                query.containedIn('newColumn7', [child]);

                CB.CloudObject.on('Custom4', 'created', query, function(data){
                   if(!isDone){
                        isDone=true;
                        done();
                    }
                });

                var obj = new CB.CloudObject('Custom4');
                obj.set('newColumn7',[child]);
                obj.save();

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("ContainedIn : 2",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');

        child.save({
            success : function(child){
                var child2 = new CB.CloudObject('student1');
        
                child2.save({
                    success : function(child2){
                        //create the query. 
                        var query = new CB.CloudQuery('Custom4');
                        query.containedIn('newColumn7', [child2]);

                        CB.CloudObject.on('Custom4', 'created', query, function(data){
                            if(!isDone){
                                isDone=true;
                                done("Wrong event fired");
                            }
                        });

                        var obj = new CB.CloudObject('Custom4');
                        obj.set('newColumn7',[child]);
                        obj.save();

                        setTimeout(function(){
                            if(!isDone){
                                    isDone=true;
                                    done();
                                };
                        }, 10000);
                    }, error : function(error){
                     done("Object cannot be saved");
                }
            });

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("ContainsAll : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');
        child.save({
            success : function(child){
               
                //create the query. 
                var query = new CB.CloudQuery('Custom4');
                query.containsAll('newColumn7', [child]);

                CB.CloudObject.on('Custom4', 'created', query, function(data){
                   if(!isDone){
                        isDone=true;
                        done();
                    }
                });

                var obj = new CB.CloudObject('Custom4');
                obj.set('newColumn7',[child]);
                obj.save();

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("ContainsAll : 2",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');

        child.save({
            success : function(child){
                var child2 = new CB.CloudObject('student1');
        
                child2.save({
                    success : function(child2){
                        //create the query. 
                        var query = new CB.CloudQuery('Custom4');
                        query.containsAll('newColumn7', [child2]);

                        CB.CloudObject.on('Custom4', 'created', query, function(data){
                            if(!isDone){
                                isDone=true;
                                done("Wrong event fired");
                            }
                        });

                        var obj = new CB.CloudObject('Custom4');
                        obj.set('newColumn7',[child]);
                        obj.save();

                        setTimeout(function(){
                            if(!isDone){
                                    isDone=true;
                                    done();
                                };
                        }, 10000);
                    }, error : function(error){
                     done("Object cannot be saved");
                }
            });

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });

    it("notContainedIn : 1",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');
        child.save({
            success : function(child){
               
                //create the query. 
                var query = new CB.CloudQuery('Custom4');
                query.notContainedIn('newColumn7', [child]);

                CB.CloudObject.on('Custom4', 'created', query, function(data){
                   if(!isDone){
                        isDone=true;
                        done("Wrong event fired");
                    }
                });

                var obj = new CB.CloudObject('Custom4');
                obj.set('newColumn7',[child]);
                obj.save();

<<<<<<< HEAD
                 setTimeout(function(){
                            if(!isDone){
                                    isDone=true;
                                    done();
                                };
                }, 10000);
=======
                module.exports = function (arr, obj) {
                    if (indexOf) return arr.indexOf(obj);
                    for (var i = 0; i < arr.length; ++i) {
                        if (arr[i] === obj) return i;
                    }
                    return -1;
                };
            }, {}],
            41: [function (_dereq_, module, exports) {

                /**
                 * HOP ref.
                 */

                var has = Object.prototype.hasOwnProperty;

                /**
                 * Return own keys in `obj`.
                 *
                 * @param {Object} obj
                 * @return {Array}
                 * @api public
                 */

                exports.keys = Object.keys || function (obj) {
                    var keys = [];
                    for (var key in obj) {
                        if (has.call(obj, key)) {
                            keys.push(key);
                        }
                    }
                    return keys;
                };

                /**
                 * Return own values in `obj`.
                 *
                 * @param {Object} obj
                 * @return {Array}
                 * @api public
                 */

                exports.values = function (obj) {
                    var vals = [];
                    for (var key in obj) {
                        if (has.call(obj, key)) {
                            vals.push(obj[key]);
                        }
                    }
                    return vals;
                };

                /**
                 * Merge `b` into `a`.
                 *
                 * @param {Object} a
                 * @param {Object} b
                 * @return {Object} a
                 * @api public
                 */

                exports.merge = function (a, b) {
                    for (var key in b) {
                        if (has.call(b, key)) {
                            a[key] = b[key];
                        }
                    }
                    return a;
                };

                /**
                 * Return length of `obj`.
                 *
                 * @param {Object} obj
                 * @return {Number}
                 * @api public
                 */

                exports.length = function (obj) {
                    return exports.keys(obj).length;
                };

                /**
                 * Check if `obj` is empty.
                 *
                 * @param {Object} obj
                 * @return {Boolean}
                 * @api public
                 */

                exports.isEmpty = function (obj) {
                    return 0 == exports.length(obj);
                };
            }, {}],
            42: [function (_dereq_, module, exports) {
                /**
                 * Parses an URI
                 *
                 * @author Steven Levithan <stevenlevithan.com> (MIT license)
                 * @api private
                 */

                var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

                var parts = [
                    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host'
                    , 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
                ];

                module.exports = function parseuri(str) {
                    var m = re.exec(str || '')
                        , uri = {}
                        , i = 14;

                    while (i--) {
                        uri[parts[i]] = m[i] || '';
                    }

                    return uri;
                };

            }, {}],
            43: [function (_dereq_, module, exports) {
                (function (global) {
                    /*global Blob,File*/

                    /**
                     * Module requirements
                     */

                    var isArray = _dereq_('isarray');
                    var isBuf = _dereq_('./is-buffer');

                    /**
                     * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
                     * Anything with blobs or files should be fed through removeBlobs before coming
                     * here.
                     *
                     * @param {Object} packet - socket.io event packet
                     * @return {Object} with deconstructed packet and list of buffers
                     * @api public
                     */

                    exports.deconstructPacket = function (packet) {
                        var buffers = [];
                        var packetData = packet.data;

                        function _deconstructPacket(data) {
                            if (!data) return data;

                            if (isBuf(data)) {
                                var placeholder = {_placeholder: true, num: buffers.length};
                                buffers.push(data);
                                return placeholder;
                            } else if (isArray(data)) {
                                var newData = new Array(data.length);
                                for (var i = 0; i < data.length; i++) {
                                    newData[i] = _deconstructPacket(data[i]);
                                }
                                return newData;
                            } else if ('object' == typeof data && !(data instanceof Date)) {
                                var newData = {};
                                for (var key in data) {
                                    newData[key] = _deconstructPacket(data[key]);
                                }
                                return newData;
                            }
                            return data;
                        }

                        var pack = packet;
                        pack.data = _deconstructPacket(packetData);
                        pack.attachments = buffers.length; // number of binary 'attachments'
                        return {packet: pack, buffers: buffers};
                    };

                    /**
                     * Reconstructs a binary packet from its placeholder packet and buffers
                     *
                     * @param {Object} packet - event packet with placeholders
                     * @param {Array} buffers - binary buffers to put in placeholder positions
                     * @return {Object} reconstructed packet
                     * @api public
                     */

                    exports.reconstructPacket = function (packet, buffers) {
                        var curPlaceHolder = 0;

                        function _reconstructPacket(data) {
                            if (data && data._placeholder) {
                                var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
                                return buf;
                            } else if (isArray(data)) {
                                for (var i = 0; i < data.length; i++) {
                                    data[i] = _reconstructPacket(data[i]);
                                }
                                return data;
                            } else if (data && 'object' == typeof data) {
                                for (var key in data) {
                                    data[key] = _reconstructPacket(data[key]);
                                }
                                return data;
                            }
                            return data;
                        }

                        packet.data = _reconstructPacket(packet.data);
                        packet.attachments = undefined; // no longer useful
                        return packet;
                    };

                    /**
                     * Asynchronously removes Blobs or Files from data via
                     * FileReader's readAsArrayBuffer method. Used before encoding
                     * data as msgpack. Calls callback with the blobless data.
                     *
                     * @param {Object} data
                     * @param {Function} callback
                     * @api private
                     */

                    exports.removeBlobs = function (data, callback) {
                        function _removeBlobs(obj, curKey, containingObject) {
                            if (!obj) return obj;

                            // convert any blob
                            if ((global.Blob && obj instanceof Blob) ||
                                (global.File && obj instanceof File)) {
                                pendingBlobs++;

                                // async filereader
                                var fileReader = new FileReader();
                                fileReader.onload = function () { // this.result == arraybuffer
                                    if (containingObject) {
                                        containingObject[curKey] = this.result;
                                    }
                                    else {
                                        bloblessData = this.result;
                                    }

                                    // if nothing pending its callback time
                                    if (!--pendingBlobs) {
                                        callback(bloblessData);
                                    }
                                };

                                fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
                            } else if (isArray(obj)) { // handle array
                                for (var i = 0; i < obj.length; i++) {
                                    _removeBlobs(obj[i], i, obj);
                                }
                            } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
                                for (var key in obj) {
                                    _removeBlobs(obj[key], key, obj);
                                }
                            }
                        }

                        var pendingBlobs = 0;
                        var bloblessData = data;
                        _removeBlobs(bloblessData);
                        if (!pendingBlobs) {
                            callback(bloblessData);
                        }
                    };

                }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
            }, {"./is-buffer": 45, "isarray": 46}],
            44: [function (_dereq_, module, exports) {

                /**
                 * Module dependencies.
                 */

                var debug = _dereq_('debug')('socket.io-parser');
                var json = _dereq_('json3');
                var isArray = _dereq_('isarray');
                var Emitter = _dereq_('component-emitter');
                var binary = _dereq_('./binary');
                var isBuf = _dereq_('./is-buffer');

                /**
                 * Protocol version.
                 *
                 * @api public
                 */

                exports.protocol = 4;

                /**
                 * Packet types.
                 *
                 * @api public
                 */

                exports.types = [
                    'CONNECT',
                    'DISCONNECT',
                    'EVENT',
                    'BINARY_EVENT',
                    'ACK',
                    'BINARY_ACK',
                    'ERROR'
                ];

                /**
                 * Packet type `connect`.
                 *
                 * @api public
                 */

                exports.CONNECT = 0;

                /**
                 * Packet type `disconnect`.
                 *
                 * @api public
                 */

                exports.DISCONNECT = 1;

                /**
                 * Packet type `event`.
                 *
                 * @api public
                 */

                exports.EVENT = 2;

                /**
                 * Packet type `ack`.
                 *
                 * @api public
                 */

                exports.ACK = 3;

                /**
                 * Packet type `error`.
                 *
                 * @api public
                 */

                exports.ERROR = 4;

                /**
                 * Packet type 'binary event'
                 *
                 * @api public
                 */

                exports.BINARY_EVENT = 5;

                /**
                 * Packet type `binary ack`. For acks with binary arguments.
                 *
                 * @api public
                 */

                exports.BINARY_ACK = 6;

                /**
                 * Encoder constructor.
                 *
                 * @api public
                 */

                exports.Encoder = Encoder;

                /**
                 * Decoder constructor.
                 *
                 * @api public
                 */

                exports.Decoder = Decoder;

                /**
                 * A socket.io Encoder instance
                 *
                 * @api public
                 */

                function Encoder() {
                }

                /**
                 * Encode a packet as a single string if non-binary, or as a
                 * buffer sequence, depending on packet type.
                 *
                 * @param {Object} obj - packet object
                 * @param {Function} callback - function to handle encodings (likely engine.write)
                 * @return Calls callback with Array of encodings
                 * @api public
                 */

                Encoder.prototype.encode = function (obj, callback) {
                    debug('encoding packet %j', obj);

                    if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
                        encodeAsBinary(obj, callback);
                    }
                    else {
                        var encoding = encodeAsString(obj);
                        callback([encoding]);
                    }
                };

                /**
                 * Encode packet as string.
                 *
                 * @param {Object} packet
                 * @return {String} encoded
                 * @api private
                 */

                function encodeAsString(obj) {
                    var str = '';
                    var nsp = false;

                    // first is type
                    str += obj.type;

                    // attachments if we have them
                    if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
                        str += obj.attachments;
                        str += '-';
                    }

                    // if we have a namespace other than `/`
                    // we append it followed by a comma `,`
                    if (obj.nsp && '/' != obj.nsp) {
                        nsp = true;
                        str += obj.nsp;
                    }

                    // immediately followed by the id
                    if (null != obj.id) {
                        if (nsp) {
                            str += ',';
                            nsp = false;
                        }
                        str += obj.id;
                    }

                    // json data
                    if (null != obj.data) {
                        if (nsp) str += ',';
                        str += json.stringify(obj.data);
                    }

                    debug('encoded %j as %s', obj, str);
                    return str;
                }

                /**
                 * Encode packet as 'buffer sequence' by removing blobs, and
                 * deconstructing packet into object with placeholders and
                 * a list of buffers.
                 *
                 * @param {Object} packet
                 * @return {Buffer} encoded
                 * @api private
                 */

                function encodeAsBinary(obj, callback) {

                    function writeEncoding(bloblessData) {
                        var deconstruction = binary.deconstructPacket(bloblessData);
                        var pack = encodeAsString(deconstruction.packet);
                        var buffers = deconstruction.buffers;

                        buffers.unshift(pack); // add packet info to beginning of data list
                        callback(buffers); // write all the buffers
                    }

                    binary.removeBlobs(obj, writeEncoding);
                }

                /**
                 * A socket.io Decoder instance
                 *
                 * @return {Object} decoder
                 * @api public
                 */

                function Decoder() {
                    this.reconstructor = null;
                }

                /**
                 * Mix in `Emitter` with Decoder.
                 */

                Emitter(Decoder.prototype);

                /**
                 * Decodes an ecoded packet string into packet JSON.
                 *
                 * @param {String} obj - encoded packet
                 * @return {Object} packet
                 * @api public
                 */

                Decoder.prototype.add = function (obj) {
                    var packet;
                    if ('string' == typeof obj) {
                        packet = decodeString(obj);
                        if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
                            this.reconstructor = new BinaryReconstructor(packet);

                            // no attachments, labeled binary but no binary data to follow
                            if (this.reconstructor.reconPack.attachments == 0) {
                                this.emit('decoded', packet);
                            }
                        } else { // non-binary full packet
                            this.emit('decoded', packet);
                        }
                    }
                    else if (isBuf(obj) || obj.base64) { // raw binary data
                        if (!this.reconstructor) {
                            throw new Error('got binary data when not reconstructing a packet');
                        } else {
                            packet = this.reconstructor.takeBinaryData(obj);
                            if (packet) { // received final buffer
                                this.reconstructor = null;
                                this.emit('decoded', packet);
                            }
                        }
                    }
                    else {
                        throw new Error('Unknown type: ' + obj);
                    }
                };

                /**
                 * Decode a packet String (JSON data)
                 *
                 * @param {String} str
                 * @return {Object} packet
                 * @api private
                 */

                function decodeString(str) {
                    var p = {};
                    var i = 0;

                    // look up type
                    p.type = Number(str.charAt(0));
                    if (null == exports.types[p.type]) return error();

                    // look up attachments if type binary
                    if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
                        p.attachments = '';
                        while (str.charAt(++i) != '-') {
                            p.attachments += str.charAt(i);
                        }
                        p.attachments = Number(p.attachments);
                    }

                    // look up namespace (if any)
                    if ('/' == str.charAt(i + 1)) {
                        p.nsp = '';
                        while (++i) {
                            var c = str.charAt(i);
                            if (',' == c) break;
                            p.nsp += c;
                            if (i + 1 == str.length) break;
                        }
                    } else {
                        p.nsp = '/';
                    }

                    // look up id
                    var next = str.charAt(i + 1);
                    if ('' != next && Number(next) == next) {
                        p.id = '';
                        while (++i) {
                            var c = str.charAt(i);
                            if (null == c || Number(c) != c) {
                                --i;
                                break;
                            }
                            p.id += str.charAt(i);
                            if (i + 1 == str.length) break;
                        }
                        p.id = Number(p.id);
                    }

                    // look up json data
                    if (str.charAt(++i)) {
                        try {
                            p.data = json.parse(str.substr(i));
                        } catch (e) {
                            return error();
                        }
                    }

                    debug('decoded %s as %j', str, p);
                    return p;
                }

                /**
                 * Deallocates a parser's resources
                 *
                 * @api public
                 */

                Decoder.prototype.destroy = function () {
                    if (this.reconstructor) {
                        this.reconstructor.finishedReconstruction();
                    }
                };

                /**
                 * A manager of a binary event's 'buffer sequence'. Should
                 * be constructed whenever a packet of type BINARY_EVENT is
                 * decoded.
                 *
                 * @param {Object} packet
                 * @return {BinaryReconstructor} initialized reconstructor
                 * @api private
                 */

                function BinaryReconstructor(packet) {
                    this.reconPack = packet;
                    this.buffers = [];
                }

                /**
                 * Method to be called when binary data received from connection
                 * after a BINARY_EVENT packet.
                 *
                 * @param {Buffer | ArrayBuffer} binData - the raw binary data received
                 * @return {null | Object} returns null if more binary data is expected or
                 *   a reconstructed packet object if all buffers have been received.
                 * @api private
                 */

                BinaryReconstructor.prototype.takeBinaryData = function (binData) {
                    this.buffers.push(binData);
                    if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
                        var packet = binary.reconstructPacket(this.reconPack, this.buffers);
                        this.finishedReconstruction();
                        return packet;
                    }
                    return null;
                };

                /**
                 * Cleans up binary packet reconstruction variables.
                 *
                 * @api private
                 */

                BinaryReconstructor.prototype.finishedReconstruction = function () {
                    this.reconPack = null;
                    this.buffers = [];
                };

                function error(data) {
                    return {
                        type: exports.ERROR,
                        data: 'parser error'
                    };
                }

            }, {"./binary": 43, "./is-buffer": 45, "component-emitter": 9, "debug": 10, "isarray": 46, "json3": 47}],
            45: [function (_dereq_, module, exports) {
                (function (global) {

                    module.exports = isBuf;

                    /**
                     * Returns true if obj is a buffer or an arraybuffer.
                     *
                     * @api private
                     */

                    function isBuf(obj) {
                        return (global.Buffer && global.Buffer.isBuffer(obj)) ||
                            (global.ArrayBuffer && obj instanceof ArrayBuffer);
                    }

                }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
            }, {}],
            46: [function (_dereq_, module, exports) {
                module.exports = _dereq_(37)
            }, {}],
            47: [function (_dereq_, module, exports) {
                /*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
                ;
                (function (window) {
                    // Convenience aliases.
                    var getClass = {}.toString, isProperty, forEach, undef;

                    // Detect the `define` function exposed by asynchronous module loaders. The
                    // strict `define` check is necessary for compatibility with `r.js`.
                    var isLoader = typeof define === "function" && define.amd;

                    // Detect native implementations.
                    var nativeJSON = typeof JSON == "object" && JSON;

                    // Set up the JSON 3 namespace, preferring the CommonJS `exports` object if
                    // available.
                    var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;

                    if (JSON3 && nativeJSON) {
                        // Explicitly delegate to the native `stringify` and `parse`
                        // implementations in CommonJS environments.
                        JSON3.stringify = nativeJSON.stringify;
                        JSON3.parse = nativeJSON.parse;
                    } else {
                        // Export for web browsers, JavaScript engines, and asynchronous module
                        // loaders, using the global `JSON` object if available.
                        JSON3 = window.JSON = nativeJSON || {};
                    }

                    // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
                    var isExtended = new Date(-3509827334573292);
                    try {
                        // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
                        // results for certain dates in Opera >= 10.53.
                        isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
                            // Safari < 2.0.2 stores the internal millisecond time value correctly,
                            // but clips the values returned by the date methods to the range of
                            // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
                        isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
                    } catch (exception) {
                    }

                    // Internal: Determines whether the native `JSON.stringify` and `parse`
                    // implementations are spec-compliant. Based on work by Ken Snyder.
                    function has(name) {
                        if (has[name] !== undef) {
                            // Return cached feature test result.
                            return has[name];
                        }

                        var isSupported;
                        if (name == "bug-string-char-index") {
                            // IE <= 7 doesn't support accessing string characters using square
                            // bracket notation. IE 8 only supports this for primitives.
                            isSupported = "a"[0] != "a";
                        } else if (name == "json") {
                            // Indicates whether both `JSON.stringify` and `JSON.parse` are
                            // supported.
                            isSupported = has("json-stringify") && has("json-parse");
                        } else {
                            var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                            // Test `JSON.stringify`.
                            if (name == "json-stringify") {
                                var stringify = JSON3.stringify, stringifySupported = typeof stringify == "function" && isExtended;
                                if (stringifySupported) {
                                    // A test function object with a custom `toJSON` method.
                                    (value = function () {
                                        return 1;
                                    }).toJSON = value;
                                    try {
                                        stringifySupported =
                                            // Firefox 3.1b1 and b2 serialize string, number, and boolean
                                            // primitives as object literals.
                                            stringify(0) === "0" &&
                                                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                                                // literals.
                                            stringify(new Number()) === "0" &&
                                            stringify(new String()) == '""' &&
                                                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                                                // does not define a canonical JSON representation (this applies to
                                                // objects with `toJSON` properties as well, *unless* they are nested
                                                // within an object or array).
                                            stringify(getClass) === undef &&
                                                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                                                // FF 3.1b3 pass this test.
                                            stringify(undef) === undef &&
                                                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                                                // respectively, if the value is omitted entirely.
                                            stringify() === undef &&
                                                // FF 3.1b1, 2 throw an error if the given value is not a number,
                                                // string, array, object, Boolean, or `null` literal. This applies to
                                                // objects with custom `toJSON` methods as well, unless they are nested
                                                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                                                // methods entirely.
                                            stringify(value) === "1" &&
                                            stringify([value]) == "[1]" &&
                                                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                                                // `"[null]"`.
                                            stringify([undef]) == "[null]" &&
                                                // YUI 3.0.0b1 fails to serialize `null` literals.
                                            stringify(null) == "null" &&
                                                // FF 3.1b1, 2 halts serialization if an array contains a function:
                                                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                                                // elides non-JSON values from objects and arrays, unless they
                                                // define custom `toJSON` methods.
                                            stringify([undef, getClass, null]) == "[null,null,null]" &&
                                                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                                                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                                            stringify({"a": [value, true, false, null, "\x00\b\n\f\r\t"]}) == serialized &&
                                                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                                            stringify(null, value) === "1" &&
                                            stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                                                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                                                // serialize extended years.
                                            stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                                                // The milliseconds are optional in ES 5, but required in 5.1.
                                            stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                                                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                                                // four-digit years instead of six-digit years. Credits: @Yaffle.
                                            stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                                                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                                                // values less than 1000. Credits: @Yaffle.
                                            stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                                    } catch (exception) {
                                        stringifySupported = false;
                                    }
                                }
                                isSupported = stringifySupported;
                            }
                            // Test `JSON.parse`.
                            if (name == "json-parse") {
                                var parse = JSON3.parse;
                                if (typeof parse == "function") {
                                    try {
                                        // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                                        // Conforming implementations should also coerce the initial argument to
                                        // a string prior to parsing.
                                        if (parse("0") === 0 && !parse(false)) {
                                            // Simple parsing test.
                                            value = parse(serialized);
                                            var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                                            if (parseSupported) {
                                                try {
                                                    // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                                                    parseSupported = !parse('"\t"');
                                                } catch (exception) {
                                                }
                                                if (parseSupported) {
                                                    try {
                                                        // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                                                        // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                                                        // certain octal literals.
                                                        parseSupported = parse("01") !== 1;
                                                    } catch (exception) {
                                                    }
                                                }
                                                if (parseSupported) {
                                                    try {
                                                        // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                                                        // points. These environments, along with FF 3.1b1 and 2,
                                                        // also allow trailing commas in JSON objects and arrays.
                                                        parseSupported = parse("1.") !== 1;
                                                    } catch (exception) {
                                                    }
                                                }
                                            }
                                        }
                                    } catch (exception) {
                                        parseSupported = false;
                                    }
                                }
                                isSupported = parseSupported;
                            }
                        }
                        return has[name] = !!isSupported;
                    }

                    if (!has("json")) {
                        // Common `[[Class]]` name aliases.
                        var functionClass = "[object Function]";
                        var dateClass = "[object Date]";
                        var numberClass = "[object Number]";
                        var stringClass = "[object String]";
                        var arrayClass = "[object Array]";
                        var booleanClass = "[object Boolean]";

                        // Detect incomplete support for accessing string characters by index.
                        var charIndexBuggy = has("bug-string-char-index");

                        // Define additional utility methods if the `Date` methods are buggy.
                        if (!isExtended) {
                            var floor = Math.floor;
                            // A mapping between the months of the year and the number of days between
                            // January 1st and the first of the respective month.
                            var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                            // Internal: Calculates the number of days between the Unix epoch and the
                            // first day of the given month.
                            var getDay = function (year, month) {
                                return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
                            };
                        }

                        // Internal: Determines if a property is a direct property of the given
                        // object. Delegates to the native `Object#hasOwnProperty` method.
                        if (!(isProperty = {}.hasOwnProperty)) {
                            isProperty = function (property) {
                                var members = {}, constructor;
                                if ((members.__proto__ = null, members.__proto__ = {
                                        // The *proto* property cannot be set multiple times in recent
                                        // versions of Firefox and SeaMonkey.
                                        "toString": 1
                                    }, members).toString != getClass) {
                                    // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
                                    // supports the mutable *proto* property.
                                    isProperty = function (property) {
                                        // Capture and break the object's prototype chain (see section 8.6.2
                                        // of the ES 5.1 spec). The parenthesized expression prevents an
                                        // unsafe transformation by the Closure Compiler.
                                        var original = this.__proto__, result = property in (this.__proto__ = null, this);
                                        // Restore the original prototype chain.
                                        this.__proto__ = original;
                                        return result;
                                    };
                                } else {
                                    // Capture a reference to the top-level `Object` constructor.
                                    constructor = members.constructor;
                                    // Use the `constructor` property to simulate `Object#hasOwnProperty` in
                                    // other environments.
                                    isProperty = function (property) {
                                        var parent = (this.constructor || constructor).prototype;
                                        return property in this && !(property in parent && this[property] === parent[property]);
                                    };
                                }
                                members = null;
                                return isProperty.call(this, property);
                            };
                        }

                        // Internal: A set of primitive types used by `isHostType`.
                        var PrimitiveTypes = {
                            'boolean': 1,
                            'number': 1,
                            'string': 1,
                            'undefined': 1
                        };

                        // Internal: Determines if the given object `property` value is a
                        // non-primitive.
                        var isHostType = function (object, property) {
                            var type = typeof object[property];
                            return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
                        };

                        // Internal: Normalizes the `for...in` iteration algorithm across
                        // environments. Each enumerated key is yielded to a `callback` function.
                        forEach = function (object, callback) {
                            var size = 0, Properties, members, property;

                            // Tests for bugs in the current environment's `for...in` algorithm. The
                            // `valueOf` property inherits the non-enumerable flag from
                            // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
                            (Properties = function () {
                                this.valueOf = 0;
                            }).prototype.valueOf = 0;

                            // Iterate over a new instance of the `Properties` class.
                            members = new Properties();
                            for (property in members) {
                                // Ignore all properties inherited from `Object.prototype`.
                                if (isProperty.call(members, property)) {
                                    size++;
                                }
                            }
                            Properties = members = null;

                            // Normalize the iteration algorithm.
                            if (!size) {
                                // A list of non-enumerable properties inherited from `Object.prototype`.
                                members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                                // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
                                // properties.
                                forEach = function (object, callback) {
                                    var isFunction = getClass.call(object) == functionClass, property, length;
                                    var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
                                    for (property in object) {
                                        // Gecko <= 1.0 enumerates the `prototype` property of functions under
                                        // certain conditions; IE does not.
                                        if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                                            callback(property);
                                        }
                                    }
                                    // Manually invoke the callback for each non-enumerable property.
                                    for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
                                };
                            } else if (size == 2) {
                                // Safari <= 2.0.4 enumerates shadowed properties twice.
                                forEach = function (object, callback) {
                                    // Create a set of iterated properties.
                                    var members = {}, isFunction = getClass.call(object) == functionClass, property;
                                    for (property in object) {
                                        // Store each property name to prevent double enumeration. The
                                        // `prototype` property of functions is not enumerated due to cross-
                                        // environment inconsistencies.
                                        if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                                            callback(property);
                                        }
                                    }
                                };
                            } else {
                                // No bugs detected; use the standard `for...in` algorithm.
                                forEach = function (object, callback) {
                                    var isFunction = getClass.call(object) == functionClass, property, isConstructor;
                                    for (property in object) {
                                        if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                                            callback(property);
                                        }
                                    }
                                    // Manually invoke the callback for the `constructor` property due to
                                    // cross-environment inconsistencies.
                                    if (isConstructor || isProperty.call(object, (property = "constructor"))) {
                                        callback(property);
                                    }
                                };
                            }
                            return forEach(object, callback);
                        };

                        // Public: Serializes a JavaScript `value` as a JSON string. The optional
                        // `filter` argument may specify either a function that alters how object and
                        // array members are serialized, or an array of strings and numbers that
                        // indicates which properties should be serialized. The optional `width`
                        // argument may be either a string or number that specifies the indentation
                        // level of the output.
                        if (!has("json-stringify")) {
                            // Internal: A map of control characters and their escaped equivalents.
                            var Escapes = {
                                92: "\\\\",
                                34: '\\"',
                                8: "\\b",
                                12: "\\f",
                                10: "\\n",
                                13: "\\r",
                                9: "\\t"
                            };

                            // Internal: Converts `value` into a zero-padded string such that its
                            // length is at least equal to `width`. The `width` must be <= 6.
                            var leadingZeroes = "000000";
                            var toPaddedString = function (width, value) {
                                // The `|| 0` expression is necessary to work around a bug in
                                // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
                                return (leadingZeroes + (value || 0)).slice(-width);
                            };

                            // Internal: Double-quotes a string `value`, replacing all ASCII control
                            // characters (characters with code unit values between 0 and 31) with
                            // their escaped equivalents. This is an implementation of the
                            // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
                            var unicodePrefix = "\\u00";
                            var quote = function (value) {
                                var result = '"', index = 0, length = value.length, isLarge = length > 10 && charIndexBuggy, symbols;
                                if (isLarge) {
                                    symbols = value.split("");
                                }
                                for (; index < length; index++) {
                                    var charCode = value.charCodeAt(index);
                                    // If the character is a control character, append its Unicode or
                                    // shorthand escape sequence; otherwise, append the character as-is.
                                    switch (charCode) {
                                        case 8:
                                        case 9:
                                        case 10:
                                        case 12:
                                        case 13:
                                        case 34:
                                        case 92:
                                            result += Escapes[charCode];
                                            break;
                                        default:
                                            if (charCode < 32) {
                                                result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                                                break;
                                            }
                                            result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
                                    }
                                }
                                return result + '"';
                            };

                            // Internal: Recursively serializes an object. Implements the
                            // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
                            var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
                                var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
                                try {
                                    // Necessary for host object support.
                                    value = object[property];
                                } catch (exception) {
                                }
                                if (typeof value == "object" && value) {
                                    className = getClass.call(value);
                                    if (className == dateClass && !isProperty.call(value, "toJSON")) {
                                        if (value > -1 / 0 && value < 1 / 0) {
                                            // Dates are serialized according to the `Date#toJSON` method
                                            // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                                            // for the ISO 8601 date time string format.
                                            if (getDay) {
                                                // Manually compute the year, month, date, hours, minutes,
                                                // seconds, and milliseconds if the `getUTC*` methods are
                                                // buggy. Adapted from @Yaffle's `date-shim` project.
                                                date = floor(value / 864e5);
                                                for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                                                for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                                                date = 1 + date - getDay(year, month);
                                                // The `time` value specifies the time within the day (see ES
                                                // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                                                // to compute `A modulo B`, as the `%` operator does not
                                                // correspond to the `modulo` operation for negative numbers.
                                                time = (value % 864e5 + 864e5) % 864e5;
                                                // The hours, minutes, seconds, and milliseconds are obtained by
                                                // decomposing the time within the day. See section 15.9.1.10.
                                                hours = floor(time / 36e5) % 24;
                                                minutes = floor(time / 6e4) % 60;
                                                seconds = floor(time / 1e3) % 60;
                                                milliseconds = time % 1e3;
                                            } else {
                                                year = value.getUTCFullYear();
                                                month = value.getUTCMonth();
                                                date = value.getUTCDate();
                                                hours = value.getUTCHours();
                                                minutes = value.getUTCMinutes();
                                                seconds = value.getUTCSeconds();
                                                milliseconds = value.getUTCMilliseconds();
                                            }
                                            // Serialize extended years correctly.
                                            value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                                            "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                                                // Months, dates, hours, minutes, and seconds should have two
                                                // digits; milliseconds should have three.
                                            "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                                                // Milliseconds are optional in ES 5.0, but required in 5.1.
                                            "." + toPaddedString(3, milliseconds) + "Z";
                                        } else {
                                            value = null;
                                        }
                                    } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
                                        // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
                                        // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
                                        // ignores all `toJSON` methods on these objects unless they are
                                        // defined directly on an instance.
                                        value = value.toJSON(property);
                                    }
                                }
                                if (callback) {
                                    // If a replacement function was provided, call it to obtain the value
                                    // for serialization.
                                    value = callback.call(object, property, value);
                                }
                                if (value === null) {
                                    return "null";
                                }
                                className = getClass.call(value);
                                if (className == booleanClass) {
                                    // Booleans are represented literally.
                                    return "" + value;
                                } else if (className == numberClass) {
                                    // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                                    // `"null"`.
                                    return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                                } else if (className == stringClass) {
                                    // Strings are double-quoted and escaped.
                                    return quote("" + value);
                                }
                                // Recursively serialize objects and arrays.
                                if (typeof value == "object") {
                                    // Check for cyclic structures. This is a linear search; performance
                                    // is inversely proportional to the number of unique nested objects.
                                    for (length = stack.length; length--;) {
                                        if (stack[length] === value) {
                                            // Cyclic structures cannot be serialized by `JSON.stringify`.
                                            throw TypeError();
                                        }
                                    }
                                    // Add the object to the stack of traversed objects.
                                    stack.push(value);
                                    results = [];
                                    // Save the current indentation level and indent one additional level.
                                    prefix = indentation;
                                    indentation += whitespace;
                                    if (className == arrayClass) {
                                        // Recursively serialize array elements.
                                        for (index = 0, length = value.length; index < length; index++) {
                                            element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                                            results.push(element === undef ? "null" : element);
                                        }
                                        result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
                                    } else {
                                        // Recursively serialize object members. Members are selected from
                                        // either a user-specified list of property names, or the object
                                        // itself.
                                        forEach(properties || value, function (property) {
                                            var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                                            if (element !== undef) {
                                                // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                                                // is not the empty string, let `member` {quote(property) + ":"}
                                                // be the concatenation of `member` and the `space` character."
                                                // The "`space` character" refers to the literal space
                                                // character, not the `space` {width} argument provided to
                                                // `JSON.stringify`.
                                                results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                                            }
                                        });
                                        result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
                                    }
                                    // Remove the object from the traversed object stack.
                                    stack.pop();
                                    return result;
                                }
                            };

                            // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
                            JSON3.stringify = function (source, filter, width) {
                                var whitespace, callback, properties, className;
                                if (typeof filter == "function" || typeof filter == "object" && filter) {
                                    if ((className = getClass.call(filter)) == functionClass) {
                                        callback = filter;
                                    } else if (className == arrayClass) {
                                        // Convert the property names array into a makeshift set.
                                        properties = {};
                                        for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
                                    }
                                }
                                if (width) {
                                    if ((className = getClass.call(width)) == numberClass) {
                                        // Convert the `width` to an integer and create a string containing
                                        // `width` number of space characters.
                                        if ((width -= width % 1) > 0) {
                                            for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
                                        }
                                    } else if (className == stringClass) {
                                        whitespace = width.length <= 10 ? width : width.slice(0, 10);
                                    }
                                }
                                // Opera <= 7.54u2 discards the values associated with empty string keys
                                // (`""`) only if they are used directly within an object member list
                                // (e.g., `!("" in { "": 1})`).
                                return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
                            };
                        }

                        // Public: Parses a JSON source string.
                        if (!has("json-parse")) {
                            var fromCharCode = String.fromCharCode;

                            // Internal: A map of escaped control characters and their unescaped
                            // equivalents.
                            var Unescapes = {
                                92: "\\",
                                34: '"',
                                47: "/",
                                98: "\b",
                                116: "\t",
                                110: "\n",
                                102: "\f",
                                114: "\r"
                            };

                            // Internal: Stores the parser state.
                            var Index, Source;

                            // Internal: Resets the parser state and throws a `SyntaxError`.
                            var abort = function () {
                                Index = Source = null;
                                throw SyntaxError();
                            };

                            // Internal: Returns the next token, or `"$"` if the parser has reached
                            // the end of the source string. A token may be a string, number, `null`
                            // literal, or Boolean literal.
                            var lex = function () {
                                var source = Source, length = source.length, value, begin, position, isSigned, charCode;
                                while (Index < length) {
                                    charCode = source.charCodeAt(Index);
                                    switch (charCode) {
                                        case 9:
                                        case 10:
                                        case 13:
                                        case 32:
                                            // Skip whitespace tokens, including tabs, carriage returns, line
                                            // feeds, and space characters.
                                            Index++;
                                            break;
                                        case 123:
                                        case 125:
                                        case 91:
                                        case 93:
                                        case 58:
                                        case 44:
                                            // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                                            // the current position.
                                            value = charIndexBuggy ? source.charAt(Index) : source[Index];
                                            Index++;
                                            return value;
                                        case 34:
                                            // `"` delimits a JSON string; advance to the next character and
                                            // begin parsing the string. String tokens are prefixed with the
                                            // sentinel `@` character to distinguish them from punctuators and
                                            // end-of-string tokens.
                                            for (value = "@", Index++; Index < length;) {
                                                charCode = source.charCodeAt(Index);
                                                if (charCode < 32) {
                                                    // Unescaped ASCII control characters (those with a code unit
                                                    // less than the space character) are not permitted.
                                                    abort();
                                                } else if (charCode == 92) {
                                                    // A reverse solidus (`\`) marks the beginning of an escaped
                                                    // control character (including `"`, `\`, and `/`) or Unicode
                                                    // escape sequence.
                                                    charCode = source.charCodeAt(++Index);
                                                    switch (charCode) {
                                                        case 92:
                                                        case 34:
                                                        case 47:
                                                        case 98:
                                                        case 116:
                                                        case 110:
                                                        case 102:
                                                        case 114:
                                                            // Revive escaped control characters.
                                                            value += Unescapes[charCode];
                                                            Index++;
                                                            break;
                                                        case 117:
                                                            // `\u` marks the beginning of a Unicode escape sequence.
                                                            // Advance to the first character and validate the
                                                            // four-digit code point.
                                                            begin = ++Index;
                                                            for (position = Index + 4; Index < position; Index++) {
                                                                charCode = source.charCodeAt(Index);
                                                                // A valid sequence comprises four hexdigits (case-
                                                                // insensitive) that form a single hexadecimal value.
                                                                if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                                                                    // Invalid Unicode escape sequence.
                                                                    abort();
                                                                }
                                                            }
                                                            // Revive the escaped character.
                                                            value += fromCharCode("0x" + source.slice(begin, Index));
                                                            break;
                                                        default:
                                                            // Invalid escape sequence.
                                                            abort();
                                                    }
                                                } else {
                                                    if (charCode == 34) {
                                                        // An unescaped double-quote character marks the end of the
                                                        // string.
                                                        break;
                                                    }
                                                    charCode = source.charCodeAt(Index);
                                                    begin = Index;
                                                    // Optimize for the common case where a string is valid.
                                                    while (charCode >= 32 && charCode != 92 && charCode != 34) {
                                                        charCode = source.charCodeAt(++Index);
                                                    }
                                                    // Append the string as-is.
                                                    value += source.slice(begin, Index);
                                                }
                                            }
                                            if (source.charCodeAt(Index) == 34) {
                                                // Advance to the next character and return the revived string.
                                                Index++;
                                                return value;
                                            }
                                            // Unterminated string.
                                            abort();
                                        default:
                                            // Parse numbers and literals.
                                            begin = Index;
                                            // Advance past the negative sign, if one is specified.
                                            if (charCode == 45) {
                                                isSigned = true;
                                                charCode = source.charCodeAt(++Index);
                                            }
                                            // Parse an integer or floating-point value.
                                            if (charCode >= 48 && charCode <= 57) {
                                                // Leading zeroes are interpreted as octal literals.
                                                if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                                                    // Illegal octal literal.
                                                    abort();
                                                }
                                                isSigned = false;
                                                // Parse the integer component.
                                                for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                                                // Floats cannot contain a leading decimal point; however, this
                                                // case is already accounted for by the parser.
                                                if (source.charCodeAt(Index) == 46) {
                                                    position = ++Index;
                                                    // Parse the decimal component.
                                                    for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                                                    if (position == Index) {
                                                        // Illegal trailing decimal.
                                                        abort();
                                                    }
                                                    Index = position;
                                                }
                                                // Parse exponents. The `e` denoting the exponent is
                                                // case-insensitive.
                                                charCode = source.charCodeAt(Index);
                                                if (charCode == 101 || charCode == 69) {
                                                    charCode = source.charCodeAt(++Index);
                                                    // Skip past the sign following the exponent, if one is
                                                    // specified.
                                                    if (charCode == 43 || charCode == 45) {
                                                        Index++;
                                                    }
                                                    // Parse the exponential component.
                                                    for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                                                    if (position == Index) {
                                                        // Illegal empty exponent.
                                                        abort();
                                                    }
                                                    Index = position;
                                                }
                                                // Coerce the parsed value to a JavaScript number.
                                                return +source.slice(begin, Index);
                                            }
                                            // A negative sign may only precede numbers.
                                            if (isSigned) {
                                                abort();
                                            }
                                            // `true`, `false`, and `null` literals.
                                            if (source.slice(Index, Index + 4) == "true") {
                                                Index += 4;
                                                return true;
                                            } else if (source.slice(Index, Index + 5) == "false") {
                                                Index += 5;
                                                return false;
                                            } else if (source.slice(Index, Index + 4) == "null") {
                                                Index += 4;
                                                return null;
                                            }
                                            // Unrecognized token.
                                            abort();
                                    }
                                }
                                // Return the sentinel `$` character if the parser has reached the end
                                // of the source string.
                                return "$";
                            };

                            // Internal: Parses a JSON `value` token.
                            var get = function (value) {
                                var results, hasMembers;
                                if (value == "$") {
                                    // Unexpected end of input.
                                    abort();
                                }
                                if (typeof value == "string") {
                                    if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                                        // Remove the sentinel `@` character.
                                        return value.slice(1);
                                    }
                                    // Parse object and array literals.
                                    if (value == "[") {
                                        // Parses a JSON array, returning a new JavaScript array.
                                        results = [];
                                        for (; ; hasMembers || (hasMembers = true)) {
                                            value = lex();
                                            // A closing square bracket marks the end of the array literal.
                                            if (value == "]") {
                                                break;
                                            }
                                            // If the array literal contains elements, the current token
                                            // should be a comma separating the previous element from the
                                            // next.
                                            if (hasMembers) {
                                                if (value == ",") {
                                                    value = lex();
                                                    if (value == "]") {
                                                        // Unexpected trailing `,` in array literal.
                                                        abort();
                                                    }
                                                } else {
                                                    // A `,` must separate each array element.
                                                    abort();
                                                }
                                            }
                                            // Elisions and leading commas are not permitted.
                                            if (value == ",") {
                                                abort();
                                            }
                                            results.push(get(value));
                                        }
                                        return results;
                                    } else if (value == "{") {
                                        // Parses a JSON object, returning a new JavaScript object.
                                        results = {};
                                        for (; ; hasMembers || (hasMembers = true)) {
                                            value = lex();
                                            // A closing curly brace marks the end of the object literal.
                                            if (value == "}") {
                                                break;
                                            }
                                            // If the object literal contains members, the current token
                                            // should be a comma separator.
                                            if (hasMembers) {
                                                if (value == ",") {
                                                    value = lex();
                                                    if (value == "}") {
                                                        // Unexpected trailing `,` in object literal.
                                                        abort();
                                                    }
                                                } else {
                                                    // A `,` must separate each object member.
                                                    abort();
                                                }
                                            }
                                            // Leading commas are not permitted, object property names must be
                                            // double-quoted strings, and a `:` must separate each property
                                            // name and value.
                                            if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                                                abort();
                                            }
                                            results[value.slice(1)] = get(lex());
                                        }
                                        return results;
                                    }
                                    // Unexpected token encountered.
                                    abort();
                                }
                                return value;
                            };

                            // Internal: Updates a traversed object member.
                            var update = function (source, property, callback) {
                                var element = walk(source, property, callback);
                                if (element === undef) {
                                    delete source[property];
                                } else {
                                    source[property] = element;
                                }
                            };

                            // Internal: Recursively traverses a parsed JSON object, invoking the
                            // `callback` function for each value. This is an implementation of the
                            // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
                            var walk = function (source, property, callback) {
                                var value = source[property], length;
                                if (typeof value == "object" && value) {
                                    // `forEach` can't be used to traverse an array in Opera <= 8.54
                                    // because its `Object#hasOwnProperty` implementation returns `false`
                                    // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
                                    if (getClass.call(value) == arrayClass) {
                                        for (length = value.length; length--;) {
                                            update(value, length, callback);
                                        }
                                    } else {
                                        forEach(value, function (property) {
                                            update(value, property, callback);
                                        });
                                    }
                                }
                                return callback.call(source, property, value);
                            };

                            // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
                            JSON3.parse = function (source, callback) {
                                var result, value;
                                Index = 0;
                                Source = "" + source;
                                result = get(lex());
                                // If a JSON string contains multiple tokens, it is invalid.
                                if (lex() != "$") {
                                    abort();
                                }
                                // Reset the parser state.
                                Index = Source = null;
                                return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
                            };
                        }
                    }

                    // Export for asynchronous module loaders.
                    if (isLoader) {
                        define(function () {
                            return JSON3;
                        });
                    }
                }(this));

            }, {}],
            48: [function (_dereq_, module, exports) {
                module.exports = toArray

                function toArray(list, index) {
                    var array = []

                    index = index || 0

                    for (var i = index || 0; i < list.length; i++) {
                        array[i - index] = list[i]
                    }

                    return array
                }

            }, {}]
        }, {}, [1])
        (1)
    });
}

/*
 CloudApp
 */
CB.CloudApp = CB.CloudApp || {};

CB.CloudApp.init = function(serverUrl,applicationId, applicationKey) { //static function for initialisation of the app
    if(!applicationKey)
    {
        applicationKey=applicationId;
        applicationId=serverUrl;
    }else {
        CB.serverUrl=serverUrl;
        CB.socketIoUrl=serverUrl;
    }
    CB.appId = applicationId;
    CB.appKey = applicationKey;
    //load socket.io.
    if(CB._isNode)
    {
        CB.io = require('socket.io-client');
    }
    else {
        CB.io = io;
    }
    CB.Socket = CB.io(CB.socketIoUrl);
};

CB.ACL = function() { //constructor for ACL class
    this['read'] = {"allow":{"user":['all'],"role":[]},"deny":{"user":[],"role":[]}}; //by default allow read access to "all"
    this['write'] = {"allow":{"user":['all'],"role":[]},"deny":{"user":[],"role":[]}}; //by default allow write access to "all"
};
CB.ACL.prototype.setPublicWriteAccess = function(value) { //for setting the public write access
    if (value) { //If asked to allow public write access
        this['write']['allow']['user'] = ['all'];
    } else {
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1); //remove the "all" value from the "write" array of "this" object
        }
    }
};
CB.ACL.prototype.setPublicReadAccess = function(value) { //for setting the public read access

    if (value) { //If asked to allow public read access
        this['read']['allow']['user'] = ['all'];
    } else {
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1); //remove the "all" value from the "read" array of "this" object
        }
    }
};
CB.ACL.prototype.setUserWriteAccess = function(userId, value) { //for setting the user write access

    if (value) { //If asked to allow user write access
        //remove public write access.
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1);
        }
        if (this['write']['allow']['user'].indexOf(userId) === -1) {
            this['write']['allow']['user'].push(userId);
        }
    } else {
        var index = this['write']['allow']['user'].indexOf(userId);
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1); //remove the "userId" value from the "write" array of "this" object
        }
        this['write']['deny']['user'].push(userId);
    }
};
CB.ACL.prototype.setUserReadAccess = function(userId, value) { //for setting the user read access

    if (value) { //If asked to allow user read access
        //remove public write access.
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1);
        }
        if (this['read']['allow']['user'].indexOf(userId) === -1) {
            this['read']['allow']['user'].push(userId);
        }
    } else {
        var index = this['read']['allow']['user'].indexOf(userId);
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1); //remove the "userId" value from the "read" array of "this" object
        }
        this['read']['deny']['user'].push(userId);
    }
};
CB.ACL.prototype.setRoleWriteAccess = function(roleId, value) {

    if (value) {
        //remove public write access.
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1);
        }
        if (this['write']['allow']['role'].indexOf(roleId) === -1) {
            this['write']['allow']['role'].push(roleId);
        }
    } else {
        var index = this['write']['allow']['role'].indexOf(roleId);
        if (index > -1) {
            this['write']['allow']['role'].splice(index, 1);
        }
        var index = this['write']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['write']['allow']['user'].splice(index, 1);
        }

        this['write']['deny']['role'].push(roleId);
    }
};
CB.ACL.prototype.setRoleReadAccess = function(roleId, value) {

    if (value) {
        //remove public write access.
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1);
        }
        if (this['read']['allow']['role'].indexOf(roleId) === -1) {
            this['read']['allow']['role'].push(roleId);
        }
    } else {
        var index = this['read']['allow']['role'].indexOf(roleId);
        if (index > -1) {
            this['read']['allow']['role'].splice(index, 1);
        }
        var index = this['read']['allow']['user'].indexOf('all');
        if (index > -1) {
            this['read']['allow']['user'].splice(index, 1);
        }
        this['read']['deny']['role'].push(roleId);
    }
};

/* CloudNotificiation */

CB.CloudNotification = CB.CloudNotification || {};

CB.CloudNotification.on = function(channelName, callback, done) {

    CB._validate();

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    CB.Socket.emit('join-custom-channel',CB.appId+channelName);
    CB.Socket.on(CB.appId+channelName, function(data){ //listen to events in custom channel.
        callback(data);
    });

    if(done && done.success)
        done.success();
    else
        def.resolve();

    if (!done) {
        return def;
    }

};

CB.CloudNotification.off = function(channelName, done) {

    CB._validate();

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    CB.Socket.emit('leave-custom-channel',CB.appId+channelName);
    CB.Socket.removeAllListeners(CB.appId+channelName);
    if(done && done.success)
        done.success();
    else
        def.resolve();

    if (!done) {
        return def;
    }

};

CB.CloudNotification.publish = function(channelName, data, done) {

    CB._validate();

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    CB.Socket.emit('publish-custom-channel',{channel:CB.appId+channelName,data : data});
    if(done && done.success)
        done.success();
    else
        def.resolve();

    if (!done) {
        return def;
    }

};

/*
 CloudObject
 */

CB.CloudObject = function(tableName, id) { //object for documents
    
    this.document = {};
    this.document._tableName = tableName; //the document object
    this.document.ACL = new CB.ACL(); //ACL(s) of the document
    this.document._type = 'custom';

    if(!id){
        this.document._modifiedColumns = ['createdAt','updatedAt','ACL'];
        this.document._isModified = true;
    }
    else{
        this.document._modifiedColumns = [];
        this.document._isModified = false;
        this.document._id = id;
    }
};

Object.defineProperty(CB.CloudObject.prototype, 'ACL', {
    get: function() {
        return this.document.ACL;
    },
    set: function(ACL) {
        this.document.ACL = ACL;
        CB._modified(this,'ACL');
    }
});

Object.defineProperty(CB.CloudObject.prototype, 'id', {
    get: function() {
        return this.document._id;
    }
});

Object.defineProperty(CB.CloudObject.prototype, 'createdAt', {
    get: function() {
        return this.document.createdAt;
    },
    set: function(createdAt) {
        this.document.createdAt = createdAt;
        CB._modified(this,'createdAt');
    }
});

Object.defineProperty(CB.CloudObject.prototype, 'updatedAt', {
    get: function() {
        return this.document.updatedAt;
    },
    set: function(updatedAt) {
        this.document.updatedAt = updatedAt;
        CB._modified(this,'updatedAt');
    }
});


/* For Expire of objects */
Object.defineProperty(CB.CloudObject.prototype, 'expires', {
    get: function() {
        return this.document._expires;
    },
    set: function(expires) {
        this.document._expires = expires;
        CB._modified(this,'_expires');
    }
});

/* This is Real time implementation of CloudObjects */
CB.CloudObject.on = function(tableName, eventType, callback, done) {

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    tableName = tableName.toLowerCase();

    if (eventType instanceof Array) {
        //if event type is an array.
        for(var i=0;i<eventType.length;i++){
            CB.CloudObject.on(tableName, eventType[i], callback);
            if(done && done.success)
                done.success();
            else
                def.resolve();
        }
    } else {
        eventType = eventType.toLowerCase();
        if(eventType==='created' || eventType === 'updated' || eventType === 'deleted'){
            CB.Socket.emit('join-object-channel',(CB.appId+'table'+tableName+eventType).toLowerCase());
            CB.Socket.on((CB.appId+'table'+tableName+eventType).toLowerCase(), function(data){ //listen to events in custom channel.
                callback(CB.fromJSON(data));
            });

            if(done && done.success)
                done.success();
            else
                def.resolve();
        }else{
            throw 'created, updated, deleted are supported notification types.';
        }
    }

    if (!done) {
        return def;
    }
};

CB.CloudObject.off = function(tableName, eventType, done) {

    var def;

    if (!done) {
        def = new CB.Promise();
    }

    tableName = tableName.toLowerCase();

    if (eventType instanceof Array) {
        //if event type is an array.
        for(var i=0;i<eventType.length;i++){
            CB.CloudObject.off(tableName, eventType[i]);
            if(done && done.success)
                done.success();
            else
                def.resolve();
        }
    } else {

        eventType = eventType.toLowerCase();

        if(eventType==='created' || eventType === 'updated' || eventType === 'deleted'){
            CB.Socket.emit('leave-object-channel',(CB.appId+'table'+tableName+eventType).toLowerCase());
            CB.Socket.removeAllListeners((CB.appId+'table'+tableName+eventType).toLowerCase());
            if(done && done.success)
                done.success();
            else
                def.resolve();
        }else{
            throw 'created, updated, deleted are supported notification types.';
        }
    }

    if (!done) {
        return def;
    }
};

/* RealTime implementation ends here.  */

CB.CloudObject.prototype.set = function(columnName, data) { //for setting data for a particular column

    var keywords = ['_tableName', '_type', 'operator'];

    if(columnName=== 'id' || columnName === '_id')
        throw "You cannot set the id of a CloudObject";

    if (columnName === 'id' ||  columnName === 'expires')
        columnName = '_' + columnName;

    if (keywords.indexOf(columnName) > -1) {
        throw columnName + " is a keyword. Please choose a different column name.";
    }
    this.document[columnName] = data;
    CB._modified(this,columnName);
};


CB.CloudObject.prototype.relate = function(columnName, objectTableName, objectId) { //for setting data for a particular column

    var keywords = ['_tableName', '_type', 'operator'];

    if(columnName=== 'id' || columnName === '_id')
        throw "You cannot set the id of a CloudObject";

    if (columnName === 'id' ||  columnName === 'expires')
        throw "You cannot link an object to this column";

    if (keywords.indexOf(columnName) > -1) {
        throw columnName + " is a keyword. Please choose a different column name.";
    }

    this.document[columnName] = new CB.CloudObject(objectTableName,objectId);
    CB._modified(this,columnName);
};


CB.CloudObject.prototype.get = function(columnName) { //for getting data of a particular column

    if (columnName === 'id' ||  columnName === 'expires')
        columnName = '_' + columnName;

    return this.document[columnName];

};

CB.CloudObject.prototype.unset = function(columnName) { //to unset the data of the column
    this.document[columnName] = null;
    CB._modified(this,columnName);
};

CB.CloudObject.prototype.save = function(callback) { //save the document to the db
    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    CB._validate();

    var thisObj = this;
    var xmlhttp = CB._loadXml();
    var params=JSON.stringify({
        document: CB.toJSON(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/save";
    //console.log(params);
    CB._request('POST',url,params).then(function(response){
        CB.fromJSON(JSON.parse(response),thisObj);
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }
};

CB.CloudObject.prototype.fetch = function(callback) { //fetch the document from the db
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (this.id) {
        this.document['_id'] = this.id;
    } else {
        throw "Can't fetch an object which is not saved."
    }
    if (this.ACL) {
        this.document['ACL'] = this.ACL;
    }
    thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    // var xmlhttp=CB._loadXml();
    var params=JSON.stringify({
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + thisObj.document._tableName + "/get/" + thisObj.document['_id'];

    CB._request('POST',url,params).then(function(response){
        CB.fromJSON(JSON.parse(response),thisObj);
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }

};

CB.CloudObject.prototype.delete = function(callback) { //delete an object matching the objectId
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.document._id) {
        throw "You cannot delete an object which is not saved."
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    var params=JSON.stringify({
        key: CB.appKey,
        document: CB.toJSON(thisObj)
    });
    url = CB.apiUrl + "/" + CB.appId +"/delete/";

    CB._request('POST',url,params).then(function(response){
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }
};
/*
 CloudQuery
 */
CB.CloudQuery = function(tableName) { //constructor for the class CloudQuery
    this.tableName = tableName;
    this.query = {};
    this.query.$include = [];
    this.select = {};
    this.sort = {};
    this.skip = 0;
    this.limit = 10; //default limit is 10
};

// Logical operations
CB.CloudQuery.or = function(obj1, obj2) {
    if (!obj1.tableName === obj2.tableName) {
        throw "Table names are not same";
    }
    var obj = new CB.CloudQuery(obj1.tableName);
    obj.query["$or"] = [obj1.query, obj2.query];
    return obj;
}


CB.CloudQuery.prototype.equalTo = function(columnName, data) {

    if (columnName === 'id' ||  columnName === 'expires')
        columnName = '_' + columnName;

    if(data !== null){
        if( data.constructor === CB.CloudObject){
            columnName = columnName+'._id';
            data = data.get('id');
        }

        this.query[columnName] = data;
    }else{

        //This is for people who code : obj.equalTo('column', null);
        this.doesNotExists(columnName);
    }

    return this;
};

CB.CloudQuery.prototype.include = function (columnName, data) {
    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    this.query.$include.push(columnName);

    return this;
};

CB.CloudQuery.prototype.notEqualTo = function(columnName, data) {
    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if(data !== null){

        if(data.constructor === CB.CloudObject){
            columnName = columnName+'._id';
            data = data.get('id');
        }

        this.query[columnName] = {
            $ne: data
        };
    }else{
        //This is for people who code : obj.notEqualTo('column', null);
        this.exists(columnName); 
    }

    return this;
};
CB.CloudQuery.prototype.greaterThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$gt"] = data;

    return this;
};
CB.CloudQuery.prototype.greaterThanEqualTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$gte"] = data;

    return this;
};
CB.CloudQuery.prototype.lessThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;


    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$lt"] = data;

    return this;
};
CB.CloudQuery.prototype.lessThanEqualTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;


    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$lte"] = data;

    return this;
};
//Sorting
CB.CloudQuery.prototype.orderByAsc = function(columnName) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    this.sort[columnName] = 1;

    return this;
};
CB.CloudQuery.prototype.orderByDesc = function(columnName) {

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    this.sort[columnName] = -1;

    return this;
};
//Limit and skip
CB.CloudQuery.prototype.setLimit = function(data) {

    this.limit = data;
    return this;
};
CB.CloudQuery.prototype.setSkip = function(data) {
    this.skip = data;
    return this;
};

//select/deselect columns to show
CB.CloudQuery.prototype.selectColumn = function(columnNames) {

    if(Object.keys(this.select).length === 0){
        this.select = {
            _id : 1,
            createdAt : 1,
            updatedAt : 1,
            ACL : 1,
            _type : 1,
            _tableName : 1
        }
    }

    if (Object.prototype.toString.call(columnNames) === '[object Object]') {
        this.select = columnNames;
    } else if (Object.prototype.toString.call(columnNames) === '[object Array]') {
        for (var i = 0; i < columnNames.length; i++) {
            this.select[columnNames[i]] = 1;
        }
    } else {
        this.select[columnNames] = 1;
    }

    return this;
};
CB.CloudQuery.prototype.doNotSelectColumn = function(columnNames) {
    if (Object.prototype.toString.call(columnNames) === '[object Object]') {
        this.select = columnNames;
    } else if (Object.prototype.toString.call(columnNames) === '[object Array]') {
        for (var i = 0; i < columnNames.length; i++) {
            this.select[columnNames[i]] = 0;
        }
    } else {
        this.select[columnNames] = 0;
    }

    return this;
};
CB.CloudQuery.prototype.containedIn = function(columnName, data) {

    var isCloudObject = false;

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

   
    

    if (Object.prototype.toString.call(data) === '[object Object]' && !data instanceof CB.CloudObject) { //if object is passed as an argument
        throw 'Array or string expected as an argument';
    }

    
    if (Object.prototype.toString.call(data) === '[object Array]') { //if array is passed, then replace the whole

        for(var i=0; i<data.length; i++){
             if(data[i] instanceof CB.CloudObject){
                isCloudObject = true;
                if(!data[i].id){
                    throw "CloudObject passed should be saved and should have an id before being passed to containedIn";
                }

                data[i] = data[i].id;
            }
        }

        if(isCloudObject){
            columnName = columnName+'._id';
        }
        

        if (!this.query[columnName]) {
                    this.query[columnName] = {};
        }

        this.query[columnName]["$in"] = data;
        thisObj = this;
        if (typeof this.query[columnName]["$nin"] !== 'undefined') { //for removing dublicates
            data.forEach(function(val) {
                if ((index = thisObj.query[columnName]["$nin"].indexOf(val)) >= 0) {
                    thisObj.query[columnName]["$nin"].splice(index, 1);
                }
            });
        }
    } else { //if the argument is a string then push if it is not present already


        if(data instanceof CB.CloudObject){

            if(!data.id){
                throw "CloudObject passed should be saved and should have an id before being passed to containedIn";
            }

            columnName = columnName+'._id';
            data = data.id;
        }

        if (!this.query[columnName]) {
                this.query[columnName] = {};
        }


        if (!this.query[columnName]["$in"]) {
            this.query[columnName]["$in"] = [];
        }
        if (this.query[columnName]["$in"].indexOf(data) === -1) {
            this.query[columnName]["$in"].push(data);
        }
        if (typeof this.query[columnName]["$nin"] !== 'undefined') {
            if ((index = this.query[columnName]["$nin"].indexOf(data)) >= 0) {
                this.query[columnName]["$nin"].splice(index, 1);
            }
        }
    }
    

    return this;
}

CB.CloudQuery.prototype.notContainedIn = function(columnName, data) {

    var isCloudObject = false;

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (Object.prototype.toString.call(data) === '[object Object]' && !data instanceof CB.CloudObject) { //if object is passed as an argument
        throw 'Array or string expected as an argument';
    }

    if (Object.prototype.toString.call(data) === '[object Array]') { //if array is passed, then replace the whole

        for(var i=0; i<data.length; i++){
             if(data[i] instanceof CB.CloudObject){
                isCloudObject = true;
                if(!data[i].id){
                    throw "CloudObject passed should be saved and should have an id before being passed to notContainedIn";
                }

                data[i] = data[i].id;           
            }
        }

        if(isCloudObject){
            columnName = columnName+'._id';
        }
           

         if (!this.query[columnName]) {
            this.query[columnName] = {};
         }

        this.query[columnName]["$nin"] = data;
        if (typeof this.query[columnName]["$in"] !== 'undefined') { //for removing dublicates
            thisObj = this;
            data.forEach(function(val) {
                if ((index = thisObj.query[columnName]["$in"].indexOf(val)) >= 0) {
                    thisObj.query[columnName]["$in"].splice(index, 1);
                }
            });
        }
    } else { //if the argument is a string then push if it is not present already

        if(data instanceof CB.CloudObject){

            if(!data.id){
                throw "CloudObject passed should be saved and should have an id before being passed to notContainedIn";
            }

            columnName = columnName+'._id';
            data = data.id;
        }

        if (!this.query[columnName]) {
            this.query[columnName] = {};
        }


        if (!this.query[columnName]["$nin"]) {
            this.query[columnName]["$nin"] = [];
        }
        if (this.query[columnName]["$nin"].indexOf(data) === -1) {
            this.query[columnName]["$nin"].push(data);
        }
        if (typeof this.query[columnName]["$in"] !== 'undefined') {
            if ((index = this.query[columnName]["$in"].indexOf(data)) >= 0) {
                this.query[columnName]["$in"].splice(index, 1);
            }
        }
    }

    return this;
}

CB.CloudQuery.prototype.exists = function(columnName) {
    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$exists"] = true;

    return this;
}

CB.CloudQuery.prototype.doesNotExists = function(columnName) {
    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (!this.query[columnName]) {
        this.query[columnName] = {};
    }
    this.query[columnName]["$exists"] = false;

    return this;
}

CB.CloudQuery.prototype.containsAll = function(columnName, data) {

    var isCloudObject = false;

    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    if (Object.prototype.toString.call(data) === '[object Object]' && !data instanceof CB.CloudObject) { //if object is passed as an argument
        throw 'Array or string expected as an argument';
    }

    if (Object.prototype.toString.call(data) === '[object Array]') { //if array is passed, then replace the whole



        for(var i=0; i<data.length; i++){
             if(data[i] instanceof CB.CloudObject){
                
                isCloudObject = true;

                if(!data[i].id){
                    throw "CloudObject passed should be saved and should have an id before being passed to containsAll";
                }

                data[i] = data[i].id;           
            }
        }

        if(isCloudObject){
            columnName = columnName+'._id';
        }

        if (!this.query[columnName]) {
            this.query[columnName] = {};
         }

        this.query[columnName]["$all"] = data;
        
    } else { //if the argument is a string then push if it is not present already

        if(data instanceof CB.CloudObject){

            if(!data.id){
                throw "CloudObject passed should be saved and should have an id before being passed to containsAll";
            }

            columnName = columnName+'._id';
            data = data.id;
        }

        if (!this.query[columnName]) {
            this.query[columnName] = {};
        }


        if (!this.query[columnName]["$all"]) {
            this.query[columnName]["$all"] = [];
        }
        if (this.query[columnName]["$all"].indexOf(data) === -1) {
            this.query[columnName]["$all"].push(data);
        }
        
    }

    return this;
}

CB.CloudQuery.prototype.startsWith = function(columnName, value) {
    if (columnName === 'id' || columnName === 'expires')
        columnName = '_' + columnName;

    var regex = '^' + value;
    if (!this.query[columnName]) {
        this.query[columnName] = {
            $regex: regex,
            $options: "im"
        }
    } else {
        this.query[columnName]["$regex"] = regex;
        this.query[columnName]["$options"] = 'im';
    }

    return this;
}

//GeoPoint near query
CB.CloudQuery.prototype.near = function(columnName, geoPoint, maxDistance, minDistance){
    if(!this.query[columnName]){
        this.query[columnName] = {};
        this.query[columnName]['$near'] = {
            '$geometry': { coordinates: geoPoint['document'].coordinates, type:'Point'},
            '$maxDistance': maxDistance,
            '$minDistance': minDistance
        };
    }
};

//GeoPoint geoWithin query
CB.CloudQuery.prototype.geoWithin = function(columnName, geoPoint, radius){

    if(!radius){
        var coordinates = [];
        //extracting coordinates from each CloudGeoPoint Object
        if (Object.prototype.toString.call(geoPoint) === '[object Array]') {
            for(i=0; i < geoPoint.length; i++){
                if (geoPoint[i]['document'].hasOwnProperty('coordinates')) {
                    coordinates[i] = geoPoint[i]['document']['coordinates'];
                }
            }
        }else{
            throw 'Invalid Parameter, coordinates should be an array of CloudGeoPoint Object';
        }
        //2dSphere needs first and last coordinates to be same for polygon type
        //eg. for Triangle four coordinates need to pass, three points of triangle and fourth one should be same as first one
        coordinates[coordinates.length] = coordinates[0];
        var type = 'Polygon';
        if(!this.query[columnName]){
            this.query[columnName] = {};
            this.query[columnName]['$geoWithin'] = {};
            this.query[columnName]['$geoWithin']['$geometry'] = {
                'type': type,
                'coordinates': [ coordinates ]
            };
        }
    }else{
        if(!this.query[columnName]){
            this.query[columnName] = {};
            this.query[columnName]['$geoWithin'] = {
                '$centerSphere': [ geoPoint['document']['coordinates'], radius/3963.2 ]
            };
        }
    }
};

CB.CloudQuery.prototype.count = function(callback) {
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;
    var params=JSON.stringify({
        query: thisObj.query,
        limit: thisObj.limit,
        skip: thisObj.skip,
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + thisObj.tableName + '/count';

    CB._request('POST',url,params).then(function(response){
        response = parseInt(response);
        if (callback) {
            callback.success(response);
        } else {
            def.resolve(response);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }


};

CB.CloudQuery.prototype.distinct = function(keys, callback) {


    if(keys === 'id'){
        keys = '_id';
    }

    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    if (Object.prototype.toString.call(keys) !== '[object Array]' && keys.length <= 0) {
        throw "keys should be array";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    var thisObj = this;
    
    var params=JSON.stringify({
        onKey: keys,
        query: thisObj.query,
        select: thisObj.select,
        sort: thisObj.sort,
        limit: thisObj.limit,
        skip: thisObj.skip,
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + thisObj.tableName + '/distinct';

    CB._request('POST',url,params).then(function(response){
        var object = CB.fromJSON(JSON.parse(response));
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }
};

CB.CloudQuery.prototype.find = function(callback) { //find the document(s) matching the given query
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    var thisObj = this;

    var xmlhttp=CB._loadXml();
    var params=JSON.stringify({
        query: thisObj.query,
        select: thisObj.select,
        sort: thisObj.sort,
        limit: thisObj.limit,
        skip: thisObj.skip,
        key: CB.appKey
    });

    url = CB.apiUrl + "/" + CB.appId + "/" + thisObj.tableName + '/find';

    CB._request('POST',url,params).then(function(response){
        var object = CB.fromJSON(JSON.parse(response));
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });


    if (!callback) {
        return def;
    }
};

CB.CloudQuery.prototype.get = function(objectId,callback){
    var query = new CB.CloudQuery(this.tableName);
    return query.findById(objectId,callback);
};

CB.CloudQuery.prototype.findById = function(objectId, callback) { //find the document(s) matching the given query
    
    var thisObj = this;

    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    if(thisObj.skip && !thisObj.skip !== 0){
        throw "You cannot use skip and find object by Id in the same query";
    }

    if(thisObj.limit && thisObj.limit === 0){
        throw "You cannot use limit and find object by Id in the same query";
    }

    if(thisObj.sort && Object.getOwnPropertyNames(thisObj.sort).length > 0){
        throw "You cannot use sort and find object by Id in the same query";
    }

    thisObj.equalTo('id',objectId);

    var params=JSON.stringify({
        query: thisObj.query,
        select: thisObj.select,
        key: CB.appKey,
        limit : 1,
        skip : 0,
        sort : {}
    });

    url = CB.apiUrl + "/" + CB.appId + "/" + thisObj.tableName + '/find';

    CB._request('POST',url,params).then(function(response){
        response = JSON.parse(response);
        if (Object.prototype.toString.call(response) === '[object Array]') {
            response = response[0];
        }
        if (callback) {
            callback.success(CB.fromJSON(response));
        } else {
            def.resolve(CB.fromJSON(response));
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }
};
CB.CloudQuery.prototype.findOne = function(callback) { //find a single document matching the given query
    if (!CB.appId) {
        throw "CB.appId is null.";
    }
    if (!this.tableName) {
        throw "TableName is null.";
    }
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    var params=JSON.stringify({
        query: this.query,
        select: this.select,
        sort: this.sort,
        skip: this.skip,
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/" + this.tableName + '/findOne';

    CB._request('POST',url,params).then(function(response){
        var object = CB.fromJSON(JSON.parse(response));
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }
};


CB.SearchFilter = function(){

    this.bool = {};
    this.bool.must = []; //and
    this.bool.should = []; //or
    this.bool.must_not = []; //not
};


CB.SearchFilter.prototype.notEqualTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    //data can bean array too!
    var term = {};
    if (data instanceof Array) {
        term.terms = {};
        term.terms[columnName] = data;
    } else {
        term.term = {};
        term.term[columnName] = data;
    }

    this.bool.must_not.push(term);

    return this;

};

CB.SearchFilter.prototype.equalTo = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var term = {};
    if (data instanceof Array) {
        term.terms = {};
        term.terms[columnName] = data;
    } else {
        term.term = {};
        term.term[columnName] = data;
    }

    this.bool.must.push(term);

    return this;
};

CB.SearchFilter.prototype.exists = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.exists = {};
    obj.exists.field = columnName;

    this.bool.must.push(obj);

    return this;
};

CB.SearchFilter.prototype.doesNotExist = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.missing = {};
    obj.missing.field = columnName;

    this.bool.must.push(obj);

    return this;
};

CB.SearchFilter.prototype.greaterThanOrEqual = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['gte'] = data;

    this.bool.must.push(obj);

    return this;
};

CB.SearchFilter.prototype.greaterThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['gt'] = data;

    this.bool.must.push(obj);

    return this;
};

CB.SearchFilter.prototype.lessThan = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['lt'] = data;

    this.bool.must.push(obj);

    return this;
};

CB.SearchFilter.prototype.lessthanOrEqual = function(columnName, data) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;
    var obj = {};
    obj.range = {};
    obj.range[columnName] = {};
    obj.range[columnName]['lte'] = data;

    this.bool.must.push(obj);

    return this;
};


//And logical function. 
CB.SearchFilter.prototype.and = function(searchFilter) {

    if(!searchFilter instanceof CB.SearchFilter){
        throw "data should be of type CB.SearchFilter";
    }

    this.bool.must.push(searchFilter);
};

//OR Logical function
CB.SearchFilter.prototype.or = function(searchFilter) {

   if(!searchFilter instanceof CB.SearchFilter){
        throw "data should be of type CB.SearchFilter";
    }

    this.bool.should.push(searchFilter);
};


//NOT logical function
CB.SearchFilter.prototype.not = function(searchFilter) {

   if(!searchFilter instanceof CB.SearchFilter){
        throw "data should be of type CB.SearchFilter";
    }

    this.bool.must_not.push(searchFilter);
};


/* This is Search Query*/

CB.SearchQuery = function(){
    this.bool = {};
    this.bool.must = []; //and
    this.bool.should = []; //or
    this.bool.must_not = []; //not
};

CB.SearchQuery.prototype._buildSearchPhrase = function(columns, query, slop, boost) {

    var obj = this._buildSearchOn(columns, query, null, null,null,boost);

     if (columns instanceof Array) {
        obj.multi_match.type = 'phrase';
        if(slop){
            obj.multi_match.slop = slop;
        }
     } else {
        obj.match[columns].type = 'phrase';
        if(slop){
            obj.match[columns].slop = slop;
        }
     }

     return obj;

}


CB.SearchQuery.prototype._buildBestColumns = function(columns, query, fuzziness, operator, match_percent, boost) {

    var obj = this._buildSearchOn(columns, query, fuzziness, operator, match_percent, boost);

     if (columns instanceof Array) {
        obj.multi_match.type = 'best_fields';
     } else {
        obj.match[columns].type = 'best_fields';
     }

     return obj;
};

CB.SearchQuery.prototype._buildMostColumns = function(columns, query, fuzziness,  operator, match_percent, boost) {

    var obj = this._buildSearchOn(columns, query, fuzziness, operator, match_percent, boost);

     if (columns instanceof Array) {
        obj.multi_match.type = 'most_fields';
     } else {
        obj.match[columns].type = 'most_fields';
     }

     return obj;
};

CB.SearchQuery.prototype._buildSearchOn = function(columns, query, fuzziness, operator, match_percent, boost) {

    var obj = {};

        if (columns instanceof Array) {
            //if columns is an array.
            obj.multi_match = {};
            obj.multi_match.query = query;
            obj.multi_match.fields = columns;
            
            if (operator) {
                obj.multi_match.operator = operator;
            } 

            if(match_percent){
                obj.multi_match.minimum_should_match = match_percent;
            }
            
            if(boost){
                obj.multi_match.boost = boost;
            }

            if(fuzziness){
                obj.multi_match.fuzziness = fuzziness;
            }

        } else {

            obj.match = {};
            obj.match[columns] = {};
            obj.match[columns].query = query;
            
            if (operator) {
                obj.match[columns].operator = operator;
            }

            if(match_percent){
                obj.match[columns].minimum_should_match = match_percent;
            }

            if(boost){
                obj.match[columns].boost = boost;
            }

            if(fuzziness){
                obj.match[columns].fuzziness = fuzziness;
            }
        }

        return obj;

}

CB.SearchQuery.prototype.searchOn = function(columns, query, fuzziness, all_words, match_percent, priority) {

    //this is actually 'operator'
    if(all_words){
        all_words='and';
    }
        
    var obj = this._buildSearchOn(columns,query, fuzziness,all_words,match_percent,priority);
    //save in query 'and' clause.
    this.bool.should.push(obj); 

    return this;
    
};

CB.SearchQuery.prototype.phrase = function(columns, query,fuzziness, priority) {

        
    var obj = this._buildSearchPhrase(columns, query,fuzziness, priority);
    //save in query 'and' clause.
    this.bool.should.push(obj); 

    return this;
};

CB.SearchQuery.prototype.bestColumns = function(columns, query, fuzziness, all_words, match_percent, priority) {

    if(!columns instanceof Array || columns.length<2)
           throw "There should be more than one columns in-order to use this function";

    if(all_words){
        all_words='and';
    }

    var obj = this._buildBestColumns(columns, query, fuzziness, all_words, match_percent, priority);
    //save in query 'and' clause.
    this.bool.should.push(obj); 

    return this;
};

CB.SearchQuery.prototype.mostColumns = function(columns, query, fuzziness, all_words, match_percent, priority) {

    if(!columns instanceof Array || columns.length<2)
           throw "There should be more than one columns in-order to use this function";

    if(all_words){
        all_words='and';
    }

    var obj = this._buildMostColumns(columns, query, fuzziness, all_words, match_percent, priority);
    //save in query 'and' clause.
    this.bool.should.push(obj); 

    return this;
};

CB.SearchQuery.prototype.startsWith = function(column, value, priority) {

    var obj = {};
    obj.prefix = {};
    obj.prefix[column] = {};
    obj.prefix[column].value = value;
    
    if(priority){
        obj.prefix[column].boost = priority;
    }

    this.bool.must.push(obj);
};

CB.SearchQuery.prototype.wildcard = function(column, value, priority) {

    var obj = {};
    obj.wildcard = {};
    obj.wildcard[column] = {};
    obj.wildcard[column].value = value;
    
    if(priority){
        obj.wildcard[column].boost = priority;
    }

    this.bool.should.push(obj);
};



CB.SearchQuery.prototype.regexp = function(column, value, priority) {

    var obj = {};
    obj.regexp = {};
    obj.regexp[column] = {};
    obj.regexp[column].value = value;
    
    if(priority){
        obj.regexp[column].boost = priority;
    }

    this.bool.must.push(obj);
};

//And logical function. 
CB.SearchQuery.prototype.and = function(searchQuery) {

    if(!searchQuery instanceof CB.SearchQuery){
        throw "data should be of type CB.SearchQuery";
    }

    this.bool.must.push(searchQuery);
};

//OR Logical function
CB.SearchQuery.prototype.or = function(searchQuery) {

    if(!searchQuery instanceof CB.SearchQuery){
        throw "data should be of type CB.SearchQuery";
    }

    this.bool.should.push(searchQuery);
};


//NOT logical function
CB.SearchQuery.prototype.not = function(searchQuery) {

    if(!searchQuery instanceof CB.SearchQuery){
        throw "data should be of type CB.SearchQuery";
    }

    this.bool.must_not.push(searchQuery);
};


/* This is CloudSearch Function, 

Params : 
CollectionNames : string or string[] of collection names. (Required)
SearchQuery : CB.SearchQuery Object (optional)
SearchFilter : CB.SearchFilter Object (optional)
*/

CB.CloudSearch = function(collectionNames, searchQuery, searchFilter) {

    this.collectionNames = collectionNames;
    //make a filterd query in elastic search.

    this.query = {};
    this.query.filtered = {};
    
    
    if(searchQuery){
        this.query.filtered.query = searchQuery;
    }else{
        this.query.filtered.query = {};
    }

    if(searchFilter){
        this.query.filtered.filter = searchFilter;
    }else{
        this.query.filtered.filter = {};
    }

    this.from = 0; //this is skip in usual terms.
    this.size = 10; //this is take in usual terms.
    this.sort = [];
};

Object.defineProperty(CB.CloudSearch.prototype, 'searchFilter', {
    get: function() {
        return this.query.filtered.filter;
    },
    set: function(searchFilter) {
        this.query.filtered.filter = searchFilter;
    }
});


Object.defineProperty(CB.CloudSearch.prototype, 'searchQuery', {
    get: function() {
        return this.query.filtered.query;
    },
    set: function(searchQuery) {
        this.query.filtered.query = searchQuery;
    }
});

CB.CloudSearch.prototype.setSkip = function(data) {
    this.from = data;
    return this;
};

CB.CloudSearch.prototype.setLimit = function(data) {
    this.size = data;
    return this;
};

CB.CloudSearch.prototype.orderByAsc = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    var obj = {};
    obj[columnName] = {};
    obj[columnName]['order'] = 'asc';
    this.sort.push(obj);

    return this;
};

CB.CloudSearch.prototype.orderByDesc = function(columnName) {

    if (columnName === 'id' || columnName === 'isSearchable' || columnName === 'expires')
        columnName = '_' + columnName;

    var obj = {};
    obj[columnName] = {};
    obj[columnName]['order'] = 'desc';
    this.sort.push(obj);

    return this;
};


CB.CloudSearch.prototype.search = function(callback) {

    CB._validate();

    var collectionName = null;

    var def;
    if (!callback) {
        def = new CB.Promise();
    }

    if (this.collectionNames instanceof Array) {
        collectionName = this.collectionNames.join(',');
    } else {
        collectionName = this.collectionNames;
    }


    var params=JSON.stringify({
        collectionName: collectionName,
        query: this.query,
        sort: this.sort,
        limit: this.size,
        skip: this.from,
        key: CB.appKey
    });

    url = CB.apiUrl + "/" + CB.appId + "/search" ;

    CB._request('POST',url,params).then(function(response){
        var object = CB.fromJSON(JSON.parse(response));
        if (callback) {
            callback.success(object);
        } else {
            def.resolve(object);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });
    if(!callback) {
        return def;
    }
};

/*
 CloudUser
 */
CB.CloudUser = CB.CloudUser || function() {
    if (!this.document) this.document = {};
    this.document._tableName = 'User';
    this.document._type = 'user';
    this.document.ACL = new CB.ACL();
    this.document._isModified = true;
    this.document._modifiedColumns = ['createdAt','updatedAt','ACL'];
};
CB.CloudUser.prototype = Object.create(CB.CloudObject.prototype);
Object.defineProperty(CB.CloudUser.prototype, 'username', {
    get: function() {
        return this.document.username;
    },
    set: function(username) {
        this.document.username = username;
        CB._modified(this,'username');
    }
});
Object.defineProperty(CB.CloudUser.prototype, 'password', {
    get: function() {
        return this.document.password;
    },
    set: function(password) {
        this.document.password = password;
        CB._modified(this,'password');
    }
});
Object.defineProperty(CB.CloudUser.prototype, 'email', {
    get: function() {
        return this.document.email;
    },
    set: function(email) {
        this.document.email = email;
        CB._modified(this,'email');
    }
});
CB.CloudUser.current = new CB.CloudUser();
CB.CloudUser.prototype.signUp = function(callback) {
    if (!this.document.username) {
        throw "Username is not set.";
    }
    if (!this.document.password) {
        throw "Password is not set.";
    }
    if (!this.document.email) {
        throw "Email is not set.";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //now call the signup API.
    var params=JSON.stringify({
        document: CB.toJSON(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/signup" ;

    CB._request('POST',url,params).then(function(response){
        CB.fromJSON(JSON.parse(response),thisObj);
        CB.CloudUser.current = thisObj;
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });


    if (!callback) {
        return def;
    }
};
CB.CloudUser.prototype.logIn = function(callback) {
    if (!this.document.username) {
        throw "Username is not set.";
    }
    if (!this.document.password) {
        throw "Password is not set.";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //now call the signup API.
    var params=JSON.stringify({
        document: CB.toJSON(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/login" ;

    CB._request('POST',url,params).then(function(response){
        CB.fromJSON(JSON.parse(response),thisObj);
        CB.CloudUser.current = thisObj;
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }
};
CB.CloudUser.prototype.logOut = function(callback) {
    if (!this.document.username) {
        throw "Username is not set.";
    }
    if (!this.document.password) {
        throw "Password is not set.";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //now call the logout API.
    var params=JSON.stringify({
        document: CB.toJSON(thisObj),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/logout" ;

    CB._request('POST',url,params).then(function(response){
        CB.fromJSON(JSON.parse(response),thisObj);
        CB.CloudUser.current = null;
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });


    if (!callback) {
        return def;
    }
};
CB.CloudUser.prototype.addToRole = function(role, callback) {
    if (!role) {
        throw "Role is null";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //Call the addToRole API
    var params=JSON.stringify({
        user: CB.toJSON(thisObj),
        role: CB.toJSON(role),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/addToRole" ;

    CB._request('PUT',url,params).then(function(response){
        CB.fromJSON(JSON.parse(response),thisObj);
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }
};
CB.CloudUser.prototype.isInRole = function(role) {
    if (!role) {
        throw "role is null";
    }
    return (this.get('roles').indexOf(role.document._id) >= 0);
};
CB.CloudUser.prototype.removeFromRole = function(role, callback) {
    if (!role) {
        throw "Role is null";
    }
    var thisObj = this;
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    //now call the removeFromRole API.
    var params=JSON.stringify({
        user: CB.toJSON(thisObj),
        role: CB.toJSON(role),
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/user/removeFromRole" ;

    CB._request('PUT',url,params).then(function(response){
        CB.fromJSON(JSON.parse(response),thisObj);
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }
};
/*
 CloudRole
 */
CB.CloudRole = CB.CloudRole || function(roleName) { //calling the constructor.
    if (!this.document) this.document = {};
    this.document._tableName = 'Role';
    this.document._type = 'role';
    this.document.name = roleName;
    this.document.ACL = new CB.ACL();
    this.document._isModified = true;
    this.document._modifiedColumns = ['createdAt','updatedAt','ACL','name'];
};

CB.CloudRole.prototype = Object.create(CB.CloudObject.prototype);

Object.defineProperty(CB.CloudRole.prototype, 'name', {
    get: function() {
        return this.document.name;
    },
    set: function(name) {
        this.document.name = name;
        CB._modified(this,name);
    }
});

CB.CloudRole.getRole = function(role, callback) {
    var def;
    if (!callback) {
        def = new CB.Promise();
    }
    var roleName = role.document.name;
    var params=JSON.stringify({
        key: CB.appKey
    });
    url = CB.apiUrl + "/" + CB.appId + "/role/getRole/" + roleName ;

    CB._request('POST',url,params).then(function(response){
        var thisObj = CB.fromJSON((JSON.parse(response)));
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });

    if (!callback) {
        return def;
    }
};

/*
 CloudFiles
 */

CB.CloudFile = CB.CloudFile || function(file,data,type) {

    if(!file)
        throw "File is null.";

    if (Object.prototype.toString.call(file) === '[object File]' || Object.prototype.toString.call(file) === '[object Blob]' ) {

        this.fileObj = file;

        this.document = {
            _type: 'file',
            name: (file && file.name && file.name !== "") ? file.name : 'unknown',
            size: file.size,
            url: '',
            contentType : (typeof file.type !== "undefined" && file.type !== "") ? file.type : 'unknown'
        };

    } else if(typeof file === "string") {

        var regexp = RegExp("https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}");
        if (regexp.test(file)) {
            this.document = {
                _type: 'file',
                name: '',
                size: '',
                url: file,
                contentType : ''
            };
        } else{
            if(data){
                this.data = data;
                if(!type){
                    type = file.split('.')[file.split('.').length-1];
                }
                this.document = {
                    _type: 'file',
                    name: file,
                    size: '',
                    url: '',
                    contentType : type
                };
            }else{
                throw "Invalid File. It should be of type file or blob";
            }
        }
    }
    else{
        throw "Invalid File. It should be of type file or blob";
    }
};

Object.defineProperty(CB.CloudFile.prototype, 'type', {
    get: function() {
        return this.document.contentType;
    },
    set: function(type) {
        this.document.contentType = type;
    }
});

Object.defineProperty(CB.CloudFile.prototype, 'url', {
    get: function() {
        return this.document.url;
    },
    set: function(url) {
        this.document.url = url;
    }
});

Object.defineProperty(CB.CloudFile.prototype, 'size', {
    get: function() {
        return this.document.size;
    },
    set: function(size) {
        this.document.size = size;
    }
});

Object.defineProperty(CB.CloudFile.prototype, 'name', {
    get: function() {
        return this.document.name;
    },
    set: function(name) {
        this.document.name = name;
    }
});

CB.CloudFile.prototype.save = function(callback) {

    var def;

    if (!callback) {
        def = new CB.Promise();
    }


    var thisObj = this;


    if(!this.fileObj && !this.data)
        throw "You cannot save a file which is null";

    if(!this.data) {
        var formdata = new FormData();
        formdata.append("fileToUpload", this.fileObj);
        formdata.append("key", CB.appKey);

        var xmlhttp = CB._loadXml();
        var params = formdata;
        url = CB.serverUrl + '/file/' + CB.appId + '/upload';
        xmlhttp.open('POST', url, true);
        if (CB._isNode) {
            var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('./scratch');
            xmlhttp.setRequestHeader("User-Agent",
                "CB/" + CB.version +
                " (NodeJS " + process.versions.node + ")");
        }
        var ssid = localStorage.getItem('sessionID');
        if (ssid != null)
            xmlhttp.setRequestHeader('sessionID', ssid);
        xmlhttp.send(params);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == xmlhttp.DONE) {
                if (xmlhttp.status == 200) {
                    thisObj.url = JSON.parse(xmlhttp.responseText)._url;
                    var sessionID = xmlhttp.getResponseHeader('sessionID');
                    if (sessionID)
                        localStorage.setItem('sessionID', sessionID);
                    else
                        localStorage.removeItem('sessionID');
                    if (callback) {
                        callback.success(thisObj);
                    } else {
                        def.resolve(thisObj);
                    }
                } else {
                    if (callback) {
                        callback.error(xmlhttp.responseText);
                    } else {
                        def.reject(xmlhttp.responseText);
                    }
                }
            }
        }
    }else{
        var xmlhttp = CB._loadXml();
        var params=JSON.stringify({
            data: this.data,
            key: CB.appKey
        });
        url = CB.serverUrl + '/file/' + CB.appId + '/upload';
        //console.log(params);
        CB._request('POST',url,params).then(function(response){
            thisObj.url = JSON.parse(response)._url;
            delete thisObj.data;
            if (callback) {
                callback.success(thisObj);
            } else {
                def.resolve(thisObj);
            }
        },function(err){
            if(callback){
                callback.error(err);
            }else {
                def.reject(err);
            }
        });
    }


    if (!callback) {
        return def;
    }
}

CB.CloudFile.prototype.delete = function(callback) {
    var def;

    if(!this.url) {
        throw "You cannot delete a file which does not have an URL";
    }
    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;

    var params=JSON.stringify({
        url: thisObj.url,
        key: CB.appKey
    });
    url = CB.serverUrl+'/file/' + CB.appId + '/delete' ;

    CB._request('POST',url,params).then(function(response){
        thisObj.url = null;
        if (callback) {
            callback.success(thisObj);
        } else {
            def.resolve(thisObj);
        }
    },function(err){
        if(callback){
            callback.error(err);
        }else {
            def.reject(err);
        }
    });


    if (!callback) {
        return def;
    }
}
/*
 *CloudGeoPoint
 */

CB.CloudGeoPoint = CB.CloudGeoPoint || function(latitude , longitude) {
    if(!latitude || !longitude)
        throw "Latitude or Longitude is empty.";

    if(isNaN(latitude))
        throw "Latitude "+ latitude +" is not a number type.";

    if(isNaN(longitude))
        throw "Longitude "+ longitude+" is not a number type.";

    this.document = {};
    this.document._type = "point";
    this.document._isModified = true;
    //The default datum for an earth-like sphere is WGS84. Coordinate-axis order is longitude, latitude.
    if((Number(latitude)>= -90 && Number(latitude)<=90)&&(Number(longitude)>= -180 && Number(longitude)<=180)) {
        this.document.coordinates = [Number(longitude), Number(latitude)];
        this.document.latitude = Number(longitude);
        this.document.longitude = Number(latitude);
    }
    else
        throw "latitude and longitudes are not in range";
};

Object.defineProperty(CB.CloudGeoPoint.prototype, 'latitude', {
    get: function() {
        return this.document.coordinates[1];
    },
    set: function(latitude) {
        if(Number(latitude)>= -90 && Number(latitude)<=90) {
            this.document.longitude = Number(latitude);
            this.document.coordinates[1] = Number(latitude);
            this.document._isModified = true;
        }
        else
            throw "Latitude is not in Range";
    }
});

Object.defineProperty(CB.CloudGeoPoint.prototype, 'longitude', {
    get: function() {
        return this.document.coordinates[0];
    },
    set: function(longitude) {
        if(Number(longitude)>= -180 && Number(longitude)<=180) {
            this.document.latitude = Number(longitude);
            this.document.coordinates[0] = Number(longitude);
            this.document._isModified = true;
        }
        else
            throw "Longitude is not in Range";
    }
});

CB.CloudGeoPoint.prototype.get = function(name) { //for getting data of a particular column

    if(name === 'latitude')
        return this.document.longitude;
    else
        return this.document.latitude;

};

CB.CloudGeoPoint.prototype.set = function(name,value) { //for getting data of a particular column

    if(name === 'latitude') {
        if(Number(value)>= -90 && Number(value)<=90) {
            this.document.longitude = Number(value);
            this.document.coordinates[1] = Number(value);
            this.document._isModified = true;
        }
        else
            throw "Latitude is not in Range";
    }
    else {
        if(Number(value)>= -180 && Number(value)<=180) {
            this.document.latitude = Number(value);
            this.document.coordinates[0] = Number(value);
            this.document._isModified = true;
        }
        else
            throw "Latitude is not in Range";
    }
};
CB.CloudGeoPoint.prototype.distanceInKMs = function(point) {

    var earthRedius = 6371; //in Kilometer
    return earthRedius * greatCircleFormula(this, point);
};

CB.CloudGeoPoint.prototype.distanceInMiles = function(point){

    var earthRedius = 3959 // in Miles
    return earthRedius * greatCircleFormula(this, point);

};

CB.CloudGeoPoint.prototype.distanceInRadians = function(point){

    return greatCircleFormula(this, point);
};

function greatCircleFormula(thisObj, point){

    var dLat =(thisObj.document.coordinates[1] - point.document.coordinates[1]).toRad();
    var dLon = (thisObj.document.coordinates[0] - point.document.coordinates[0]).toRad();
    var lat1 = (point.document.coordinates[1]).toRad();
    var lat2 = (thisObj.document.coordinates[1]).toRad();
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return c;
}

if (typeof(Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
}

/*
  CloudTable
 */

CB.CloudTable = function(tableName){  //new table constructor

  CB._tableValidation(tableName);
  this.name = tableName;
  this.appId = CB.appId;

  if(tableName.toLowerCase() == "user")
    this.type = "user";
  else if(tableName.toLowerCase() == "role")
    this.type = "role";
  else
    this.type = "custom";

  this.columns = CB._defaultColumns(this.type);
}

CB.CloudTable.prototype.addColumn = function(column){
  if (Object.prototype.toString.call(column) === '[object Object]') {
    if(CB._columnValidation(column, this))
      this.columns.push(column);

  } else if (Object.prototype.toString.call(column) === '[object Array]') {
      for(var i=0; i<column.length; i++){
        if(CB._columnValidation(column[i], this))
          this.columns.push(column[i]);
      }
  }
}

CB.CloudTable.prototype.deleteColumn = function(column){
  if (Object.prototype.toString.call(column) === '[object Object]') {
        if(CB._columnValidation(column, this)){
          this.columns = this.columns.filter(function(index){return index.name != column.name });
        }

  } else if (Object.prototype.toString.call(column) === '[object Array]') {
      //yet to test
      for(var i=0; i<column.length; i++){
        if(CB._columnValidation(column[i], this)){
          this.columns = this.columns.filter(function(index){return index.name != column[i].name });
        }
      }
  }
}

//CloudTable static functions
CB.CloudTable.getAll = function(callback){
  if (!CB.appId) {
      throw "CB.appId is null.";
  }

  var def;
  if (!callback) {
      def = new CB.Promise();
  }

  var params=JSON.stringify({
      key: CB.appKey
  });

  url = CB.serviceUrl + "/table/get/" + CB.appId;
  CB._request('PUT',url,params).then(function(response){
    response = JSON.parse(response);
    var objArray = [];
    for(var i=0; i<response.length; i++){
      if(response[i].name){
        var obj = new CB.CloudTable(response[i].name);
        obj.columns = response.columns;
        obj.id = response.id;
        obj._id = response._id;
        objArray.push(obj);
      }
    }
    if (callback) {
        callback.success(objArray);
    } else {
        def.resolve(objArray);
    }
  },function(err){
      if(callback){
          callback.error(err);
      }else {
          def.reject(err);
      }
  });
  if (!callback) {
      return def;
  }
}

CB.CloudTable.get = function(table, callback){
  if (Object.prototype.toString.call(table) === '[object Object]') {
    if(table.type == "user"){
      throw "cannot delete user table";
    }else if(table.type == "role"){
      throw "cannot delete role table";
    }else{
      if (!CB.appId) {
          throw "CB.appId is null.";
      }

      var def;
      if (!callback) {
          def = new CB.Promise();
      }

      var params=JSON.stringify({
          key: CB.appKey,
          appId: CB.appId
      });

      url = CB.serviceUrl + "/table/"+table.name;
      CB._request('PUT',url,params).then(function(response){
          response = JSON.parse(response);
          var obj = new CB.CloudTable(response.name);
          obj.columns = response.columns;
          obj.id = response.id;
          obj._id = response._id;
          if (callback) {
              callback.success(obj);
          } else {
              def.resolve(obj);
          }
      },function(err){
          if(callback){
              callback.error(err);
          }else {
              def.reject(err);
          }
      });
      if (!callback) {
          return def;
      }

    }
  } else if (Object.prototype.toString.call(table) === '[object Array]') {
    throw "cannot fetch array of tables";
  }
}

CB.CloudTable.delete = function(table, callback){
  if (Object.prototype.toString.call(table) === '[object Object]') {
      if (!CB.appId) {
          throw "CB.appId is null.";
      }

      var def;
      if (!callback) {
          def = new CB.Promise();
      }

      var params=JSON.stringify({
          key: CB.appKey,
          name: table.name
      });

      url = CB.serviceUrl + "/table/delete/" + CB.appId;
      CB._request('PUT',url,params).then(function(response){
        response = JSON.parse(response);

        if (callback) {
            callback.success(response);
        } else {
            def.resolve(response);
        }
      },function(err){
          if(callback){
              callback.error(err);
          }else {
              def.reject(err);
          }
      });
      if (!callback) {
          return def;
      }
  } else if (Object.prototype.toString.call(table) === '[object Array]') {
    throw "cannot delete array of tables";
  }
}

//CloudTable save function
CB.CloudTable.prototype.save = function(callback){
  var def;
  if (!callback) {
      def = new CB.Promise();
  }
  CB._validate();
  var thisObj = this;
  var params=JSON.stringify({
      columns:thisObj.columns,
      name: thisObj.name,
      type: thisObj.type,
      id: thisObj.id,
      key:CB.appKey,
      _id:thisObj._id
  });

  url = CB.serviceUrl + "/table/create/" + CB.appId;
  CB._request('PUT',url,params).then(function(response){
      response = JSON.parse(response);
      var obj = new CB.CloudTable(response.name);
      obj.columns = response.columns;
      obj.id = response.id;
      obj._id = response._id;
      if (callback) {
          callback.success(obj);
      } else {
          def.resolve(obj);
      }
  },function(err){
      if(callback){
          callback.error(err);
      }else {
          def.reject(err);
      }
  });

  if (!callback) {
      return def;
  }
}




/*
 Column.js
 */

 CB.Column = function(columnName, dataType, required, unique){
   if(columnName){
     CB._columnNameValidation(columnName);
     this.name = columnName;
   }

   if(dataType){
     CB._columnDataTypeValidation(dataType);
     this.dataType = dataType;
   }else{
     this.dataType = "Text";
   }

   if(typeof(required) === 'boolean')
     this.required = required;
   else
     this.required = false;

   if(typeof(unique) === 'boolean')
     this.unique = unique;
   else
     this.unique = false;
   this.relatedTo = null;
   this.relationType = null;
   this.isDeletable = true;
   this.isEditable = true;
   this.isRenamable = true;
}

/* PRIVATE METHODS */
CB.toJSON = function(thisObj) {

    var url=null;
    if(thisObj instanceof  CB.CloudFile)
        url=thisObj.document.url;

    var obj= CB._clone(thisObj,url);

    if (!obj instanceof CB.CloudObject || !obj instanceof CB.CloudFile || !obj instanceof CB.CloudGeoPoint) {
        throw "Data passed is not an instance of CloudObject or CloudFile or CloudGeoPoint";
    }

    if(obj instanceof CB.CloudFile)
        return obj.document;

    if(obj instanceof CB.CloudGeoPoint)
        return obj.document;

    var doc = obj.document;

    for (var key in doc) {
        if (doc[key] instanceof CB.CloudObject || doc[key] instanceof CB.CloudFile || doc[key] instanceof CB.CloudGeoPoint) {
            //if something is a relation.
            doc[key] = CB.toJSON(doc[key]); //serialize this object.
        } else if (key === 'ACL') {
            //if this is an ACL, then. Convert this from CB.ACL object to JSON - to strip all the ACL Methods.
            var acl = {
                write: doc[key].write,
                read: doc[key].read
            };
            doc[key] = acl;
        } else if (doc[key] instanceof Array) {
            //if this is an array.
            //then check if this is an array of CloudObjects, if yes, then serialize every CloudObject.
            if (doc[key][0] && (doc[key][0] instanceof CB.CloudObject || doc[key][0] instanceof CB.CloudFile || doc[key][0] instanceof CB.CloudGeoPoint )) {
                var arr = [];
                for (var i = 0; i < doc[key].length; i++) {
                    arr.push(CB.toJSON(doc[key][i]));
                }
                doc[key] = arr;
            }
        }
    }

    return doc;
};

CB.fromJSON = function(data, thisObj) {

    //prevObj : is a copy of object before update.
    //this is to deserialize JSON to a document which can be shoved into CloudObject. :)
    //if data is a list it will return a list of CloudObjects.

    if (!data)
        return null;

    if (data instanceof Array) {

        if (data[0] && data[0] instanceof Object) {

            var arr = [];

            for (var i = 0; i < data.length; i++) {
                obj = CB.fromJSON(data[i]);
                arr.push(obj);
            }

            return arr;

        } else {
            //this is just a normal array, not an array of CloudObjects.
            return data;
        }
    } else if (data instanceof Object && data._type) {

        //if this is a CloudObject.
        var document = {};
        //different types of classes.

        for (var key in data) {
            if(data[key] instanceof Array) {
                document[key]=CB.fromJSON(data[key]);
            }else if (data[key] instanceof Object) {
                if (key === 'ACL') {
                    //this is an ACL.
                    document[key] = new CB.ACL();
                    document[key].write = data[key].write;
                    document[key].read = data[key].read;

                } else if(data[key]._type) {
                    if(thisObj)
                        document[key] = CB.fromJSON(data[key], thisObj.get(key));
                    else
                        document[key] = CB.fromJSON(data[key]);
                }else{
                    document[key] = data[key];
                }
            }else {
                document[key] = data[key];
            }
        }

        if(!thisObj){
            var url=null;
            var latitude = null;
            var longitude = null;
            if(document._type === "file")
                url=document.url;
            if(document._type === "point"){
                latitude = document.longitude;
                longitude = document.latitude;
            }
            var obj = CB._getObjectByType(document._type,url,latitude,longitude);
            obj.document = document;
            return obj;
        }else{
            thisObj.document = document;
            return thisObj;
        }

    }else {
        //if this is plain json.
        return data;
    }
};

CB._getObjectByType = function(type,url,latitude,longitude){

    var obj = null;

    if (type === 'custom') {
        obj = new CB.CloudObject();
    }

    if (type === 'role') {
        obj = new CB.CloudRole();
    }

    if (type === 'user') {
        obj = new CB.CloudUser();
    }

    if (type === 'file') {
        obj = new CB.CloudFile(url);
    }

    if(type === 'point'){
        obj = new CB.CloudGeoPoint(latitude,longitude);
    }
    return obj;
};


CB._validate = function() {
    if (!CB.appId) {
        throw "AppID is null. Please use CB.CLoudApp.init to initialize your app.";
    }

    if(!CB.appKey){
        throw "AppKey is null. Please use CB.CLoudApp.init to initialize your app.";
    }
};


//to check if its running under node, If yes - then export CB.
(function () {
    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this;
    // Create a reference to this
    var _ = new Object();
})();

function _all(arrayOfPromises) {
    //this is simplilar to Q.all for jQuery promises.
    return jQuery.when.apply(jQuery, arrayOfPromises).then(function() {
        return Array.prototype.slice.call(arguments, 0);
    });
};

if(CB._isNode){
    module.exports = {};
    module.exports = CB;
}


CB._clone=function(obj,url){
    var n_obj = null;
    if(obj.document._type && obj.document._type != 'point') {
        n_obj = CB._getObjectByType(obj.document._type,url);
        var doc=obj.document;
        var doc2={};
        for (var key in doc) {
            if(doc[key] instanceof CB.CloudObject)
                doc2[key]=CB._clone(doc[key],null);
            else if(doc[key] instanceof CB.CloudFile){
                doc2[key]=CB._clone(doc[key],doc[key].document.url);
            }else if(doc[key] instanceof CB.CloudGeoPoint){
                doc2[key]=CB._clone(doc[key], null);
            }
            else
                doc2[key]=doc[key];
        }
    }else if(obj instanceof CB.CloudGeoPoint){
        n_obj = new CB.CloudGeoPoint(obj.get('latitude'),obj.get('longitude'));
        return n_obj;
    }
    n_obj.document=doc2;
    return n_obj;
};

CB._request=function(method,url,params)
{
    var def = new CB.Promise();
    var xmlhttp= CB._loadXml();
    if (CB._isNode) {
        var LocalStorage = require('node-localstorage').LocalStorage;
        localStorage = new LocalStorage('./scratch');
    }
    xmlhttp.open(method,url,true);
    xmlhttp.setRequestHeader('Content-Type','text/plain');
    var ssid = localStorage.getItem('sessionID');
    if(ssid != null)
        xmlhttp.setRequestHeader('sessionID', ssid);
    if(CB._isNode)
        xmlhttp.setRequestHeader("User-Agent",
            "CB/" + CB.version +
            " (NodeJS " + process.versions.node + ")");
    xmlhttp.send(params);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                var sessionID = xmlhttp.getResponseHeader('sessionID');
                if(sessionID)
                    localStorage.setItem('sessionID', sessionID);
                else
                    localStorage.removeItem('sessionID');
                def.resolve(xmlhttp.responseText);
            } else {
                console.log(xmlhttp.status);
                def.reject(xmlhttp.responseText);
            }
        }
    }
    return def;
};

CB._columnValidation = function(column, cloudtable){
  var defaultColumn = ['id', 'issearchable', 'createdat', 'updatedat', 'acl'];
  if(cloudtable.type == 'user'){
    defaultColumn.concat(['username', 'email', 'password', 'roles']);
  }else if(cloudtable.type == 'role'){
    defaultColumn.push('name');
  }

  var index = defaultColumn.indexOf(column.name.toLowerCase());
  if(index < 0)
    return true;
  else
    return false;
};

CB._tableValidation = function(tableName){

  if(!tableName) //if table name is empty
    throw "table name cannot be empty";

  if(!isNaN(tableName[0]))
    throw "table name should not start with a number";

  if(!tableName.match(/^\S+$/))
    throw "table name should not contain spaces";

  var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
  if(pattern.test(tableName))
    throw "table not shoul not contain special characters";
};

CB._modified = function(thisObj,columnName){
    thisObj.document._isModified = true;
    if(thisObj.document._modifiedColumns) {
        if (thisObj.document._modifiedColumns.indexOf(columnName) === -1) {
            thisObj.document._modifiedColumns.push(columnName);
        }
    }else{
        thisObj.document._modifiedColumns = [];
        thisObj.document._modifiedColumns.push(columnName);
    }
};

CB._columnNameValidation = function(columnName){

  var defaultColumn = ['id', 'issearchable', 'createdat', 'updatedat', 'acl'];

  if(!columnName) //if table name is empty
    throw "table name cannot be empty";

  var index = defaultColumn.indexOf(columnName.toLowerCase());
  if(index >= 0)
    throw "this columnname is already in use";

  if(!isNaN(columnName[0]))
    throw "table name should not start with a number";

  if(!columnName.match(/^\S+$/))
    throw "table name should not contain spaces";

  var pattern = new RegExp(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/);
  if(pattern.test(columnName))
    throw "table not should not contain special characters";
};

CB._columnDataTypeValidation = function(dataType){

  if(!dataType)
    throw "data type cannot be empty";

  var dataTypeList = ['Text', 'Email', 'URL', 'Number', 'Boolean', 'DateTime', 'GeoPoint', 'File', 'List', 'Relation', 'Object'];
  var index = dataTypeList.indexOf(dataType);
  if(index < 0)
    throw "invalid data type";

};

CB._defaultColumns = function(type){
  if(type == "custom")
     return [{
                  name: 'id',
                  dataType: 'Id',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'isSearchable',
                  dataType: 'Boolean',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: false,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'createdAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'updatedAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'ACL',
                  dataType: 'ACL',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              }];

   if(type == "user")
      return  [{
                  name: 'id',
                  dataType: 'Id',
                  
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'username',
                  dataType: 'Text',
                  relatedTo: null,
                  
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'email',
                  dataType: 'Email',
                  relatedTo: null,
                  
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'password',
                  dataType: 'Password',
                  
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'roles',
                  dataType: 'List',
                  relatedTo:null,
                  relatedToType :'role',
                  relationType: 'table',
                  required: false,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'isSearchable',
                  dataType: 'Boolean',
                  relatedTo: null,
                 
                  relatedToType :null,
                  relationType: null,
                  required: false,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'createdAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'updatedAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'ACL',
                  dataType: 'ACL',
                  relatedTo: null,
                 
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              }];

   if(type == "role")
      return [{
                  name: 'id',
                  dataType: 'Id',
                  relatedTo: null,
                  relatedToType :null,
                  
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'name',
                  dataType: 'Text',
                  relatedTo: null,
                  relatedToType :null,
                 
                  relationType: null,
                  required: true,
                  unique: true,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'isSearchable',
                  dataType: 'Boolean',
                  relatedTo: null,
                  relatedToType :null,
                  
                  relationType: null,
                  required: false,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'createdAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                 
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'updatedAt',
                  dataType: 'DateTime',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              },
              {
                  name: 'ACL',
                  dataType: 'ACL',
                  relatedTo: null,
                  relatedToType :null,
                  relationType: null,
                  required: true,
                  unique: false,
                  isRenamable: false,
                  isEditable: false,
                  isDeletable: false,
              }];
};

   var util = {
     makeString : function(){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return 'x'+text;
	},	

	makeEmail : function(){
	    return this.makeString()+'@sample.com';
	}

   };

   

	

describe("Server Check",function(){
    it("should check for localhost",function(done){
    	this.timeout(10000);
        var xmlhttp;
        this.timeout(10000);
        var req = typeof(require) === 'function' ? require : null;
        // Load references to other dependencies
        if (typeof(XMLHttpRequest) !== 'undefined') {
             xmlhttp = XMLHttpRequest;
            } else if (typeof(require) === 'function' &&
                typeof(require.ensure) === 'undefined') {
                xmlhttp = req('xmlhttprequest').XMLHttpRequest;
            }
            xmlhttp = new xmlhttp();
        xmlhttp.open('GET','http://localhost:4730',true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == xmlhttp.DONE) {
                if (xmlhttp.status == 200) {
                    CB.appId = 'sample123';
                    CB.appKey = '9SPxp6D3OPWvxj0asw5ryA==';
                    CB.serverUrl = 'http://localhost:4730';
                    CB.serviceUrl = 'http://localhost:3000';
                    CB.socketIoUrl = CB.serverUrl;
                    CB.apiUrl = CB.serverUrl + '/api';
                    done();
                }
                else {
                    CB.appId = 'travis123';
                    CB.appKey = '6dzZJ1e6ofDamGsdgwxLlQ==';
                    done();

                }
            }
        }
    });
});

describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(500000);

        CB.CloudApp.init(CB.appId, CB.appKey);

        done();
    });
});

describe("Cloud Files", function(done) {

    it("Should Save a file with file data and name",function(done){

        this.timeout(10000);

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

        this.timeout(10000);

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
                throw 'ún able to get the url';
            }
        },function(err){
            throw "Unable to save file";
        });
    });

    try {

        if (window) {
            it("should save a new file", function (done) {

                this.timeout(20000);
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

                this.timeout(200000);
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
        }
    }catch(e){
        console.log('In node');
    }
    //add ACL on CloudFiles.
    
});

describe("CloudObject - Encryption", function () {

    it("should encrypt passwords", function (done) {

        this.timeout(20000);
        
        var obj = new CB.CloudObject('User');
        obj.set('username',util.makeEmail());
        obj.set('password','password');
        obj.set('email',util.makeEmail());

        obj.save().then(function(obj){
            if(obj.get('password') !== 'password')
                done();
            else
                throw "Cannot encrypt";

        }, function(){
            throw "Cannot save a CloudObject";
        });

    });

});
describe("CloudObjectExpires", function () {

    it("should save a CloudObject after expire is set", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.expires=new Date().getTime();
        obj.isSearchable=true;
        obj.save().then(function(obj1) {
            if(obj1.get('expires'))
                done();
        }, function (err) {
            console.log(err);
            throw "Cannot save an object after expire is set";
        });

    });

    it("objects expired should not show up in query", function (done) {

        this.timeout(20000);
        var curr=new Date().getTime();
        var query1 = new CB.CloudQuery('student1');
        query1.equalTo('name','vipul');
        var query2 = new CB.CloudQuery('student1');
        query2.lessThan('age',12);
        var query =  CB.CloudQuery.or(query1,query2);
        delete query.query.$include;
        delete query.query.$or[0].$include;
        delete query.query.$or[1].$include;
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    if(list[i]._expires>curr || !list[i]._expires){
                            break;
                        }
                    else{
                        throw "Expired Object Retrieved";
                    }
                }
                done();
                }else{
                    done();
            }

        }, function(error){

        })

    });


    it("objects expired should not show up in Search", function (done) {

        this.timeout(20000);
        var curr=new Date().getTime();
        var query = new CB.CloudSearch('student1');
        
        var searchFilter1 = new CB.SearchFilter();
        searchFilter1.equalTo('name','vipul');

        var searchFilter2 = new CB.SearchFilter();
        searchFilter2.lessThan('age',12);

        var searchFilter = new CB.SearchFilter();
        searchFilter.or(searchFilter1);
        searchFilter.or(searchFilter2);

        query.searchFilter = searchFilter;
        
        query.search({
            success:function(list){
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i]._expires > curr || !list[i]._expires) {
                        break;
                    }
                    else {
                        throw "expired object retrieved in Search";
                    }
                }
                done();
            }else{ done();
            }
            },error: function(error){
                throw "should not show expired objects";
            }
            });

    });
});
describe("Cloud Objects Files", function() {

    try {
        if(window) {
            var obj = new CB.CloudObject('Student');

            it("should save a file inside of an object", function (done) {

                this.timeout(20000);

                //save file first.
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
                        console.log(file);
                        //create a new object.
                        var obj = new CB.CloudObject('Sample');
                        obj.set('name', 'sample');
                        obj.set('file', file);

                        obj.save().then(function (newobj) {
                            if (newobj.get('file') instanceof CB.CloudFile && newobj.get('file').url) {
                                done();
                            } else {
                                throw "object saved but didnot return file.";
                            }
                        }, function (error) {
                            throw "error saving an object.";
                        });

                    } else {
                        throw "upload success. but cannot find the url.";
                    }
                }, function (err) {
                    throw "error uploading file";
                });

            });

            it("should save an array of files.", function (done) {
                this.timeout(200000);
                //save file first.
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

                        var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
                        try {
                            var oMyBlob = new Blob(aFileParts, {type: "text/html"});
                        } catch (e) {
                            var builder = new WebKitBlobBuilder();
                            builder.append(aFileParts);
                            var oMyBlob = builder.getBlob();
                        }
                        var file1 = new CB.CloudFile(oMyBlob);

                        file1.save().then(function (file1) {
                            if (file1.url) {

                                //create a new object.
                                var obj = new CB.CloudObject('Sample');
                                obj.set('name', 'sample');
                                obj.set('fileList', [file, file1]);

                                obj.save().then(function (newObj) {
                                    done();
                                }, function (error) {
                                    throw "Error Saving an object.";
                                });

                            } else {
                                throw "Upload success. But cannot find the URL.";
                            }
                        }, function (err) {
                            throw "Error uploading file";
                        });

                    } else {
                        throw "Upload success. But cannot find the URL.";
                    }
                }, function (err) {
                    throw "Error uploading file";
                });
            });

            it("should save an object with unsaved file.", function (done) {
                done();
            });
        }
    }catch(e){
        console.log("Not in Browser");
    }

});
describe("Cloud Objects Notification", function() {
  
	var obj = new CB.CloudObject('Student');
    var obj1 = new CB.CloudObject('student4');
  it("should alert when the object is created.", function(done) {

      this.timeout(20000);

      CB.CloudObject.on('Student', 'created', function(data){
       if(data.get('name') === 'sample') {
           done();
           CB.CloudObject.off('Student','created',{success:function(){},error:function(){}});
       }
       else
        throw "Wrong data received.";
      }, {
      	success : function(){
      		obj.set('name', 'sample');
      		obj.save().then(function(newObj){
      			obj = newObj;
      		});
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });

   it("should throw an error when wrong event type is entered. ", function(done) {

       this.timeout(20000);
     	try{
     	  CB.CloudObject.on('Student', 'wrongtype', function(data){
	      	throw 'Fired event to wrong type.';
	      });

	      throw 'Listening to wrong event type.';
     	}catch(e){
     		done();
     	}     

    });

    it("should alert when the object is updated.", function(done) {

      this.timeout(20000);
      CB.CloudObject.on('student4', 'updated', function(data){
        done();
          CB.CloudObject.off('student4','updated',{success:function(){},error:function(){}});
      }, {
      	success : function(){
            obj1.save().then(function(){
      		    obj1.set('age', 15);
      		    obj1.save().then(function(newObj){
      			    obj1 = newObj;
      		    }, function(){
      			    throw 'Error Saving an object.';
      		    });
            },function(){
                throw 'Error Saving an object.'
            });
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}

      });
    });

    it("should alert when the object is deleted.", function(done) {

      this.timeout(50000);

      CB.CloudObject.on('Student', 'deleted', function(data){
      	if(data instanceof CB.CloudObject) {
            done();
            CB.CloudObject.off('Student','deleted',{success:function(){},error:function(){}});
        }
        else
          throw "Wrong data received.";
      }, {
      	success : function(){
      		obj.set('name', 'sample');
      		obj.delete();
      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });

    it("should alert when multiple events are passed.", function(done) {
      this.timeout(20000);
      var cloudObject = new CB.CloudObject('Student');
      var count = 0;
      CB.CloudObject.on('Student', ['created', 'deleted'], function(data){
      	count++;
      	if(count === 2){
      		done();
      	}
      }, {
      	success : function(){
      		cloudObject.set('name', 'sample');
      		cloudObject.save({
      			success: function(newObj){
      				cloudObject = newObj;
      				cloudObject.set('name', 'sample1');
      				cloudObject.save();
      				cloudObject.delete();
      			}
      		});

      	}, error : function(error){
      		throw 'Error listening to an event.';
      	}
      });
    });
>>>>>>> feature_cbtables


            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });


    it("notContainedIn : 2",function(done){

        var isDone = false;
        
        this.timeout(40000);

        var child = new CB.CloudObject('student1');

        child.save({
            success : function(child){
                var child2 = new CB.CloudObject('student1');
        
                child2.save({
                    success : function(child2){
                        //create the query. 
                        var query = new CB.CloudQuery('Custom4');
                        query.notContainedIn('newColumn7', [child2]);

                        CB.CloudObject.on('Custom4', 'created', query, function(data){
                            if(!isDone){
                                isDone=true;
                                done();
                            }
                        });

                        var obj = new CB.CloudObject('Custom4');
                        obj.set('newColumn7',[child]);
                        obj.save();

                       
                    }, error : function(error){
                     done("Object cannot be saved");
                }
            });

            }, error : function(error){
                done("Object cannot be saved");
            }
        });
    });                              
});
describe("Cloud Object", function() {

	//Use Sample Table. 
	// -> Which has columns : 
	// name : string : required. 

    it("should not save a string into date column",function(done){

        this.timeout(20000);
        var obj = new CB.CloudObject('Sample');
        obj.set('createdAt','abcd');
        obj.set('name', 'sample');
        obj.save().then(function(){
            throw("should not have saved string in datetime field");
        },function(){
            done();
        });
    });

    it("should not set the id",function(done){

        try{
            this.timeout(20000);
            var obj = new CB.CloudObject('Sample');
            obj.set('id', '123');
            throw "CLoudObject can set the id";
        }catch(e){
            done();
        }
    
    });

    it("should save.", function(done) {

    	this.timeout('20000');

     	var obj = new CB.CloudObject('Sample');
     	obj.set('name', 'sample');
     	obj.save({
     		success : function(newObj){
     			if(obj.get('name') !== 'sample'){
     				throw 'name is not equal to what was saved.';
     			}
     			if(!obj.id){
     				throw 'id is not updated after save.';
     			}

     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
    });


   it("should update the object after save and update.", function(done) {
        this.timeout('20000');

     	var obj = new CB.CloudObject('Sample');
     	obj.set('name', 'sample');
     	obj.save({
     		success : function(newObj){

     			var oldId = newObj.id;

     			if(obj.get('name') !== 'sample'){
     				throw 'name is not equal to what was saved.';
     			}

     			if(!obj.id){
     				throw 'id is not updated after save.';
     			}

     			obj.set('name','sample1');
     			obj.save({
		     		success : function(newObj){

		     			if(obj.get('name') !== 'sample1'){
		     				throw 'name is not equal to what was saved.';
		     			}

		     			if(!obj.id){
		     				throw 'id is not updated after save.';
		     			}
		     			
		     			if(obj.id !== oldId){
		     				throw "did not update the object, but saved.";
		     			}

		     			done();
		     		}, error : function(error){
		     			throw 'Error updating the object';
		     		}
     			});

     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
    });

    it("should update a saved CloudObject",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('student1');
        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',8787);
        obj1.save().then(function(res){
            console.log(res);
            obj1 = res;
            obj.set('name','vipul');
            obj.save().then(function(res){
                console.log(res);
                obj = res;
                obj.set('newColumn',obj1);
                obj.save().then(function(res){
                    console.log(res);
                    done();
                },function(err){
                    console.log(err);
                    throw "Should save";
                });
            },function(){
                throw "Error while saving";
            });
        },function(){
            throw "Error";
        });
    });

    it("should delete an object after save.", function(done) {

    	this.timeout('20000');
        
        var obj = new CB.CloudObject('Sample');
     	obj.set('name', 'sample');
     	obj.save({
     		success : function(newObj){
     			obj.delete({
		     		success : function(obj){
		     			done();
		     		}, error : function(error){
		     			throw 'Error deleting the object';
		     		}
     			});
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
    });

    it("should not save an object which has required column which is missing. ", function(done) {
        this.timeout('20000');

     	var obj = new CB.CloudObject('Sample');
   		//name is required which is missing.
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object even when required is missing.";
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save an object with wrong dataType.", function(done) {
       this.timeout('20000');

     	var obj = new CB.CloudObject('Sample');
   		//name is string and we have a wrong datatype here.
   		obj.set('name', 10); //number instead of string.
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object even when required is missing.";
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save an object with duplicate values in unique fields.", function(done) {

    	this.timeout('20000');
        
        var text = util.makeString();

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('unique', text);
   
     	obj.save({
     		success : function(newObj){
     			var obj = new CB.CloudObject('Sample');
		        obj.set('name','sample');
		        obj.set('unique', text); //saving with sample text
		     	obj.save({
		     		success : function(newObj){
		     			throw "Saved an object violated unique constraint.";
		     		}, error : function(error){
		     			done();
		     		}
		     	});

     		}, error : function(error){
     			throw "Saved Error";
     		}
     	});
    });

    it("should save an array.", function(done) {

    	this.timeout('20000');

        var text = util.makeString();

		var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('stringArray', [text,text]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw "Error saving object. ";
     		}
     	});
    });

    it("should not save wrong datatype in an  array.", function(done) {
       	
       	this.timeout(20000);

		var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('stringArray', [10,20]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			throw 'Wrong datatype in an array saved.';
     		}, error : function(error){
     			done();
     		}
     	});
    });


    it("should not allow multiple dataTypes in an array. ", function(done) {

        this.timeout(20000);

    	var text = util.makeString();

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('stringArray', [text,20]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			throw 'Multiple datatype in an array saved.';
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should save an array with JSON objects. ", function(done) {

    	this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');
        obj.set('objectArray', [{sample : 'sample'},
        						{sample : 'sample'}
        					]); //saving with sample text
     	obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw "Error saving object. ";
     		}
     	});
    });

    it("should save a CloudObject as a relation. ", function(done) {
       	this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        obj.set('sameRelation', obj1); //saving with sample text

     	obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw "Error saving object. ";
     		}
     	});
    });

    it("should save a CloudObject as a relation with relate function. ", function(done) {
        this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');
        obj1.save({
            success : function(newObj){
                obj.relate('sameRelation', 'Sample', newObj.id); //saving with sample text

                obj.save({
                    success : function(newObj){
                        done();
                    }, error : function(error){
                        throw "Error saving object. ";
                    }
                });
            }, error : function(error){
                throw "Error saving object. ";
            }
        });

        
    });


    it("should keep relations intact.", function(done) {
        this.timeout(20000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn2',new CB.CloudObject('Custom3'));

        obj.set('newColumn7',new CB.CloudObject('student1'));
        
        obj.save({
            success : function(newObj){

               if(newObj.get('newColumn2').document._tableName === 'Custom3' &&  newObj.get('newColumn7').document._tableName === 'student1')
               {
                    done();
               }

               throw "Wrong Relationship retrieved.";

            }, error : function(error){
                throw "Error saving object. ";
            }
        });

        
    });




     it("should not save a a wrong relation.", function(done) {
       this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Student');
        obj1.set('name','sample');

        obj.set('sameRelation', obj1); //saving with sample text
        
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object with a wrong relation."
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save a CloudObject Relation when the schema of a related object is wrong. ", function(done) {
       this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        //name is required , which means the schema is wrong. 

        obj.set('sameRelation', obj1); //saving with sample text
        
     	obj.save({
     		success : function(newObj){
     			throw "Saved an object in a relation with an invalid schema.";
     		}, error : function(error){
     			done();
     		}
     	});
    });

    it("should not save a duplicate relation in unique fields. ", function(done) {

       this.timeout(20000);

       var obj = new CB.CloudObject('Sample');
       obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        obj.set('uniqueRelation', obj1); //saving with sample text
        
     	obj.save({
     		success : function(newObj){
     			var obj2 = new CB.CloudObject('Sample');
       			obj2.set('name','sample');
       			obj2.set('uniqueRelation', obj1);
       			obj2.save({success : function(newObj){
       				throw "Saved a duplicate relation on a unique field.";
       			}, error : function(error){
       				done();
       			}	
       		});


     		}, error : function(error){
     			throw "Cannot save an object";
     		}
     	});
    });

    it("should save an array of CloudObject with an empty array", function(done) {
        this.timeout(20000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
        obj2.set('name','sample');
        obj2.set('relationArray', []);


        obj.save({
            success : function(newObj){

                obj2.save({success : function(newObj){
                    done();
                }, error : function(error){
                    throw "Cannot save an object in a relation.";
                }
                });
            }});
    });


    it("should save an array of CloudObject.", function(done) {
       this.timeout(20000);

       var obj = new CB.CloudObject('Sample');
       obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
		obj2.set('name','sample');
		obj2.set('relationArray', [obj1, obj]);

        
     	obj.save({
     		success : function(newObj){

       			obj2.save({success : function(newObj){
       				done();
       			}, error : function(error){
       				throw "Cannot save an object in a relation.";
       			}	
       		});
    	}});
    });

     it("should modify the list relation of a saved CloudObject.", function(done) {
        this.timeout(30000);

        var obj = new CB.CloudObject('Sample');
        obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
        obj2.set('name','sample');
        obj2.set('relationArray', [obj1, obj]);


        obj.save({
        success : function(newObj){
            obj2.save({success : function(Obj3){
                var relationArray = Obj3.get('relationArray');
                if(relationArray.length !== 2)
                    throw "unable to save relation properly";
                relationArray.splice(1);
                Obj3.set('relationArray',relationArray);
                Obj3.save().then(function(Obj4){
                    if(relationArray.length === 1)
                        done();
                },function(){
                    throw "should save";
                });
            }, error : function(error){
                throw "Cannot save an object in a relation.";
            }
            });
        }});
     });

    it("should save an array of CloudObject with some objects saved and others unsaved.", function(done) {
       this.timeout(20000);

       var obj = new CB.CloudObject('Sample');
       obj.set('name','sample');

       obj.save({

     		success : function(newObj){

     			var obj1 = new CB.CloudObject('Sample');
		        obj1.set('name','sample');

		        var obj2 = new CB.CloudObject('Sample');
				obj2.set('name','sample');
				obj2.set('relationArray', [obj1, obj]);

       			obj2.save({success : function(newObj){
	       				done();
	       			}, error : function(error){
	       				throw "Cannot save an object in a relation.";
	       			}	
       			});
       			
    	}});

    });

    it("should not save an array of different CloudObjects.", function(done) {
        this.timeout(20000);

       var obj = new CB.CloudObject('Student');
       obj.set('name','sample');

        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name','sample');

        var obj2 = new CB.CloudObject('Sample');
		obj2.set('name','sample');
		obj2.set('relationArray', [obj1, obj]);

        
     	obj.save({
     		success : function(newObj){

       			obj2.save({success : function(newObj){
       				throw "Saved different types of CloudObject in a single list";
       			}, error : function(error){
       				done();
       			}	
       		});
    	}, error : function(error){
                throw "Cannot save obj";
            }});
    });

 // Test for error of getting duplicate objects while saving a object after updating
    it("Should not duplicate the values in a list after updating",function(done){
        this.timeout(20000);
        var obj = new CB.CloudObject('student1');
        obj.set('age',5);
        obj.set('name','abcd');
        var obj1 = new CB.CloudObject('Custom4');
        obj1.set('newColumn7',[obj,obj]);
        obj1.save().then(function(list){
            nc7=list.get('newColumn7');
            nc7.push(obj);
            obj1.set('newColumn7',nc7);
            obj1.save().then(function(list){
                if(list.get('newColumn7').length === 3)
                    done();
                else
                    throw "should not save duplicate objects";
            },function(){
                throw "should save cloud object ";
            });
        },function(err){
            throw "should save cloud object";
        });
    });

// Test Case for error saving an object in a column
    it("should save a JSON object in a column",function(done){
        this.timeout(20000);
        var json= {"name":"vipul","location":"uoh","age":10};
        var obj = new CB.CloudObject('Custom');
        obj.set('newColumn6',json);
        obj.save().then(function(list){
            var obje=list.get('newColumn6');
            if(obje.name === 'vipul' && obje.location === 'uoh' && obje.age === 10)
                done();
            else
                throw "error in saving json object";
        },function(){
            throw "should save JSON object in cloud";
        });
    });

    it("should save list of numbers",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Custom14');
        obj.set('List_Number',[1,2,3]);
        obj.save().then(function(list){
            console.log(list);
           done();
        },function(){
            throw "should save the list of numbers";
        });
    });

    it("should save a list of GeoPoint",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Custom14');
        var GP1 = new CB.CloudGeoPoint(17,89);
        var GP2 = new CB.CloudGeoPoint(66,78);
        obj.set('List_GeoPoint',[GP1,GP2]);
        obj.save().then(function(list){
           console.log(list);
            done();
        },function(){
            throw "should save list of geopoint";
        });
    });

    it("should save the relation",function(done){

        this.timeout(20000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',123);
        obj1.save().then(function(obj){
            if(obj){
                obj1 = obj;
            }else{
                throw "should save the object";
            }
            obj = new CB.CloudObject('student1');
            obj2 = new CB.CloudObject('hostel',obj1.get('id'));
            obj.set('newColumn',obj2);
            obj.save().then(function(list){
                console.log(list);
                    done();
            },function(){
                throw "should save the object";
            });
        },function(){
            throw "should save the object";
        });
    });

    it("should display correct error message when you save a string in a number field. ", function(done) {
        
        this.timeout(20000);

        var obj = new CB.CloudObject('Custom7');
        obj.set('requiredNumber','sample');
       
        obj.save({
            success : function(newObj){
                throw 'Wrong datatype in an array saved.';
            }, error : function(error){
                console.log(error);
                done();
            }
        });
    });

     it("should unset the field. ", function(done) {
        
        this.timeout(20000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',123);
        obj1.save().then(function(obj){
            
            if(obj.get('room')===123){
                obj.unset('room');
                obj1.save().then(function(obj){
                    if(!obj.get('room')){
                        done();
                    }else
                        throw "Didnot unset the data from an object";

                },function(){
                    throw "should save the object";
                });
            }else
                throw "Didnot set the data to an object";

        },function(){
            throw "should save the object";
        });
    });


     it("should add multiple relations to CLoudObject -> save -> should maintain the order of those relations. ", function(done) {
        
        this.timeout(20000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',123);
        obj1.save().then(function(obj){
            
            if(obj.get('room')===123){
                obj.unset('room');
                obj1.save().then(function(obj){
                    if(!obj.get('room')){
                        done();
                    }else
                        throw "Didnot unset the data from an object";

                },function(){
                    throw "should save the object";
                });
            }else
                throw "Didnot set the data to an object";

        },function(){
            throw "should save the object";
        });
    });


     it("should save a required number with 0.", function(done) {
        
        this.timeout(20000);

        var obj1 = new CB.CloudObject('Custom18');
        obj1.set('number',0);
        obj1.save().then(function(obj){
            done();
        },function(){
            throw "should save the object";
        });
    });
});
describe("Version Test",function(done){

    it("should set the Modified array",function(done){
        var obj = new CB.CloudObject('sample');
        obj.set('expires',0);
        obj.set('name','vipul');
        if(obj.get('_modifiedColumns').length > 0) {
            done();
        }else{
            throw "Unable to set Modified Array";
        }
    });

    var obj = new CB.CloudObject('Sample');

    it("should save.", function(done) {

        this.timeout(20000);
        obj.set('name', 'sample');
        obj.save({
            success : function(newObj){
                if(obj.get('name') !== 'sample'){
                    throw 'name is not equal to what was saved.';
                }
                if(!obj.id){
                    throw 'id is not updated after save.';
                }
                done();
            }, error : function(error){
                throw 'Error saving the object';
            }
        });
    });

    it("should get the saved CO with version",function(done){
        this.timeout(20000);
        var query = new CB.CloudQuery('Sample');
        query.findById(obj.get('id')).then(function(list){
            var version = list.get('_version');
            if(version>=0){
                done();
            }else{
                throw "unable to get Version";
            }
        },function(){
            throw "unable to find saved object";
        });
    });


    it("should update the version of a saved object", function (done) {
        this.timeout(15000);
        var query = new CB.CloudQuery('Sample');
        query.equalTo('id',obj.get('id'));
        query.find().then(function(list){
            console.log(list);
            list[0].set('name','abcd');
            list[0].save().then(function(){
                var query1 = new CB.CloudQuery('Sample');
                query1.equalTo('id',obj.get('id'));
                query1.find().then(function(list){
                    if(list[0].get('_version') === 1){
                        done();
                    }else{
                        throw "version number should update";
                    }
                },function(){
                    throw "unable to find saved object";
                })
            }, function () {
                throw "unable to save object";
            })
        },function(){
            throw "unable to find saved object";
        })
    });

    var username = util.makeString();
    var passwd = "abcd";
    var user = new CB.CloudUser();
    it("Should create new user with version", function (done) {

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }

        this.timeout(20000);

        user.set('username', username);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === username && list.get('_version')>=0){
                done();
            }
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    var roleName = util.makeString();

    it("Should create a role with version", function (done) {

        this.timeout(20000);
        var role = new CB.CloudRole(roleName);
        role.save().then(function (list) {
            if (!list)
                throw "Should retrieve the cloud role";
            if (list.get('_version') >= 0)
                done();
            else
                throw "Unable to save version number with CloudRole";
        }, function () {
            throw "Should retrieve the cloud role";
        });
    });

    var parent = new CB.CloudObject('Custom4');
    var child = new CB.CloudObject('student1');

    it("Should Store a relation with version",function(done){

        this.timeout(20000);
        child.set('name','vipul');
        parent.set('newColumn7',[child]);
        parent.save().then(function(list){
            if(list)
            done();
        },function(err){
            throw "should save the relation";
        });

    });
    it("Should retrieve a saved user object",function(done){

        if(CB._isNode){
            console.log('Skipped, Not meant for NodeJS');
            done();
            return;
         }
         
        this.timeout(20000);
        var query = new CB.CloudQuery('User');
        query.get(user.get('id')).then(function (user) {
            if(user.get('username') === username)
                done();
        }, function () {
            throw "unable to get a doc";
        });
    });

    it("Should save object with a relation and don't have a child object",function(done){

        this.timeout(20000);
        var obj = new CB.CloudObject('Sample');
        obj.set('name','vipul');
        obj.save().then(function(obj1){
            if(obj1.get('name') === 'vipul')
                done();
            else
                throw "unable to save the object";
        },function(){
            throw "unable to save object";
        });
    });
});
describe("CloudExpire", function () {

    it("Sets Expire in Cloud Object.", function (done) {

        this.timeout(10000);
        //create an object.
        var obj = new CB.CloudObject('Custom');
        obj.set('newColumn1', 'abcd');
        obj.save().then(function(obj1) {
            if(obj1)
                done();
            else
                throw "unable to save expires";
        }, function (err) {
            console.log(err);
            throw "Relation Expire error";
        });

    });

    it("Checks if the expired object shows up in the search or not", function (done) {

        this.timeout(10000);
        var curr=new Date().getTime();
        var query = new CB.CloudQuery('Custom');
        query.find().then(function(list){
            if(list.length>0){
                var __success = false;
                for(var i=0;i<list.length;i++){
                    if(list[i].get('expires')>curr || !list[i].get('expires')){
                           __success = true;
                            done();
                            break;
                        }
                    else{
                        throw "Expired Values also shown Up";
                    }
                    }
                }else{
                done();
            }

        }, function(error){

        })

    });


});
describe("CloudNotification", function() {
 
    it("should subscribe to a channel", function(done) {
      this.timeout(20000);
        CB.CloudNotification.on('sample',
      function(data){
      }, 
      {
      	success : function(){
      		done();
      	}, 
      	error : function(){
      		throw 'Error subscribing to a CloudNotification.';
      	}
      });
    });

    it("should publish data to the channel.", function(done) {

        this.timeout(20000);
        CB.CloudNotification.on('sample',
      function(data){
      	if(data === 'data'){
      		done();
      	}else{
      		throw 'Error wrong data received.';
      	}
      }, 
      {
      	success : function(){
      		//publish to a channel. 
      		CB.CloudNotification.publish('sample', 'data',{
				success : function(){
					//succesfully published. //do nothing. 
				},
				error : function(err){
					//error
					throw 'Error publishing to a channel in CloudNotification.';
				}
				});
      	}, 
      	error : function(){
      		throw 'Error subscribing to a CloudNotification.';
      	}

      });
    });


    it("should stop listening to a channel", function(done) {

    	this.timeout(20000);

     	CB.CloudNotification.on('sample', 
	      function(data){
	      	throw 'stopped listening, but still receiving data.';
	      }, 
	      {
	      	success : function(){
	      		//stop listening to a channel. 
	      		CB.CloudNotification.off('sample', {
					success : function(){
						//succesfully stopped listening.
						//now try to publish. 
						CB.CloudNotification.publish('sample', 'data',{
							success : function(){
								//succesfully published.
								//wait for 5 seconds.
								setTimeout(function(){ 
									done();
								}, 5000);
							},
							error : function(err){
								//error
								throw 'Error publishing to a channel.';
							}
						});
					},
					error : function(err){
						//error
						throw 'error in sop listening.';
					}
				});
	      	}, 
	      	error : function(){
	      		throw 'Error subscribing to a CloudNotification.';
	      	}
	      });


    });

});
describe("Cloud GeoPoint Test", function() {
  	
	it("should save a latitude and longitude when passing data are number type", function(done) {
        this.timeout(30000);
		var obj = new CB.CloudObject('Custom5');
     	var loc = new CB.CloudGeoPoint(17.7,78.9);
		obj.set("location", loc);
        obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
	});

	it("should save a latitude and longitude when passing a valid numeric data as string type", function(done) {
		this.timeout(10000);
        var obj = new CB.CloudObject('Custom5');
     	var loc = new CB.CloudGeoPoint("18.19","79.3");
		loc.latitude = 78;
        loc.longitude = 17;
        obj.set("location", loc);
		obj.save({
     		success : function(newObj){
     			done();
     		}, error : function(error){
     			throw 'Error saving the object';
     		}
     	});
	});


	it("should get data from server for near function", function(done) {
     	this.timeout(20000);
        var loc = new CB.CloudGeoPoint("17.7","80.3");
        var query = new CB.CloudQuery('Custom5');
		query.near("location", loc, 100000);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});
	
	it("should get list of CloudGeoPoint Object from server Polygon type geoWithin", function(done) {
     	this.timeout(10000);
        var loc1 = new CB.CloudGeoPoint(18.4,78.9);
     	var loc2 = new CB.CloudGeoPoint(17.4,78.4);
     	var loc3 = new CB.CloudGeoPoint(17.7,80.4);
        var query = new CB.CloudQuery('Custom5');
		query.geoWithin("location", [loc1, loc2, loc3]);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                	//display data
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});
	
	it("should get list of CloudGeoPoint Object from server Polygon type geoWithin + equal to + limit", function(done) {
     	this.timeout(10000);
        var loc1 = new CB.CloudGeoPoint(18.4,78.9);
     	var loc2 = new CB.CloudGeoPoint(17.4,78.4);
     	var loc3 = new CB.CloudGeoPoint(17.7,80.4);
        var query = new CB.CloudQuery('Custom5');
        query.setLimit(4);
		query.geoWithin("location", [loc1, loc2, loc3]);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                	//display data
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});
	
	it("should get list of CloudGeoPoint Object from server for Circle type geoWithin", function(done) {
     	this.timeout(10000);
        var loc = new CB.CloudGeoPoint(17.3, 78.3);
        var query = new CB.CloudQuery('Custom5');
		query.geoWithin("location", loc, 1000);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                	//display data
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});
	
	it("should get list of CloudGeoPoint Object from server for Circle type geoWithin + equal to + limit", function(done) {
     	this.timeout(10000);
        var loc = new CB.CloudGeoPoint(17.3, 78.3);
        var query = new CB.CloudQuery('Custom5');
		query.geoWithin("location", loc, 1000);
		query.setLimit(4);
		query.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                	//display data
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        })
	});

    it("should update a saved GeoPoint", function(done) {
        this.timeout(30000);
        var obj = new CB.CloudObject('Custom5');
        var loc = new CB.CloudGeoPoint(17.9,79.6);
        obj.set("location", loc);
        obj.save({
            success : function(newObj){
                obj = newObj;
                obj.get('location').set('latitude',55);
                obj.save().then(function(obj1){
                    console.log(obj1);
                    done()
                },function(){
                    throw "";
                });
            }, error : function(error){
                throw 'Error saving the object';
            }
        });
    });

    it("should take latitude in range",function(done){

        this.timeout(10000);

        var obj = new CB.CloudGeoPoint(10,20);
        try{
            obj.set('latitude',-100);
            throw "should take latitude in range";
        }catch(err){
            done();
        }
    });

    it("should take longitude in range",function(done){

        this.timeout(10000);

        var obj = new CB.CloudGeoPoint(10,20);
        try{
            obj.set('longitude',-200);
            throw "should take longitude in range";
        }catch(err){
            done();
        }
    });
});

describe("CloudQuery - Encryption", function () {

    it("should get encrypted passwords", function (done) {

        this.timeout(20000);
         
        var username = util.makeEmail();

        var obj = new CB.CloudObject('User');
        obj.set('username',username);
        obj.set('password','password');
        obj.set('email',util.makeEmail());

        obj.save().then(function(obj){
            if(obj.get('password') !== 'password'){
                //now run CloudQuery. 
                var query = new CB.CloudQuery('User');
                query.equalTo('password','password');
                query.equalTo('username',username);
                query.find({
                    success : function(list){
                        if(list.length>0){
                            done();
                        }
                        else{
                            throw "Cannot get items.";
                        }
                    }, error : function(query){
                        //cannot query. 
                        throw "Cannot query over encrypted type";
                    }
                })
            }

            else
                throw "Cannot encrypt";

        }, function(){
            throw "Cannot save a CloudObject";
        });

    });




     it("should get encrypted passwords over OR query", function (done) {

        this.timeout(20000);
         
        var username = util.makeEmail();

        var obj = new CB.CloudObject('User');
        obj.set('username',username);
        obj.set('password','password');
        obj.set('email',util.makeEmail());

        obj.save().then(function(obj){
            if(obj.get('password') !== 'password'){
                //now run CloudQuery. 
                var query1 = new CB.CloudQuery('User');
                query1.equalTo('password','password');

                 var query2 = new CB.CloudQuery('User');
                query2.equalTo('password','password1');

                var query = new CB.CloudQuery.or(query1, query2);
                query.equalTo('username',username);
                query.find({
                    success : function(list){
                        if(list.length>0){
                            done();
                        }
                        else{
                            throw "Cannot get items.";
                        }
                    }, error : function(query){
                        //cannot query. 
                        throw "Cannot query over encrypted type";
                    }
                })
            }

            else
                throw "Cannot encrypt";

        }, function(){
            throw "Cannot save a CloudObject";
        });

    });

});
describe("CloudQuery Include", function (done) {
    
   
    
    it("save a relation.", function (done) {
        
        this.timeout(30000);

        //create an object. 
        var obj = new CB.CloudObject('Custom4');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        var obj2= new CB.CloudObject('student1');
        obj2.set('name', 'Nawaz');
        obje=[obj1,obj2];
        obj.set('newColumn7', obje);
        obj.save().then(function() {
            done();
        }, function () { 
            throw "Relation Save error";
        });

    });

    it("save a Multi-Join.", function (done) {

        this.timeout(30000);

        //create an object.
        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        var obj2 = new CB.CloudObject('hostel');
        var obj3 = new CB.CloudObject('Custom3');
        obj3.set('address','progress');
        obj.set('newColumn2',obj3);
        obj2.set('room',509);
        obj1.set('name', 'Vipul');
        obj1.set('expires',null);
        obj.set('newColumn7', obj1);
        obj1.set('newColumn',obj2);
        obj.save().then(function() {
            done();
        }, function () {
            throw "Relation Save error";
        });

    });

    it("should include a relation object when include is requested in a query.", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        var obj2 = new CB.CloudObject('hostel');
        var obj3 = new CB.CloudObject('Custom3');
        obj3.set('address','progress');
        obj.set('newColumn2',obj3);
        obj2.set('room',509);
        obj1.set('name', 'Vipul');
        obj1.set('expires',null);
        obj.set('newColumn7', obj1);
        obj1.set('newColumn',obj2);
        obj.save().then(function(obj) {

            var query = new CB.CloudQuery('Custom2');
            query.include('newColumn7');
            query.include('newColumn7.newColumn');
            query.include('newColumn2');
            query.equalTo('id',obj.id);
            query.find().then(function(list){
                if(list.length>0){
                    for(var i=0;i<list.length;i++){
                        var student_obj=list[i].get('newColumn7');
                        var room=student_obj.get('newColumn');
                        var address=list[i].get('newColumn2');
                        if(!student_obj.get('name') || !room.get('room') || !address.get('address'))
                            throw "Unsuccessful Join";
                    }
                    done();
                }else{
                    throw "Cannot retrieve a saved relation.";
                }
            }, function(error){
                    throw "Cannot find";
            });
            
        }, function () { 
            throw "Relation Save error";
        });



       

    });


    it("should include a relation on distinct.", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'text');

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        obj.set('newColumn7', obj1);
    
        obj.save({
            success : function(obj){
                var query = new CB.CloudQuery('Custom2');
                query.include('newColumn7');
                query.distinct('newColumn1').then(function(list){
                    if(list.length>0){
                        for(var i=0;i<list.length;i++){
                            var student_obj=list[i].get('newColumn7');
                            if(!student_obj.get('name'))
                                throw "Unsuccessful Join";
                            else
                                done();
                        }    
                    }else{
                        throw "Cannot retrieve a saved relation.";
                    }
                }, function(error){
                    throw "Unsuccessful join"
                });
            }, error : function(error){
                throw "Cannot save a CloudObject";

            }

        })

       

    });

    it("should query over a linked column if a object is passed in equalTo",function(done){
            this.timeout(300000);

            var hostel = new CB.CloudObject('hostel');
            var student = new CB.CloudObject('student1');
            hostel.set('room',789);
            student.set('newColumn',hostel);
            student.save().then(function(list){
                var query1 = new CB.CloudQuery('student1');
                var temp = list.get('newColumn');
                query1.equalTo('newColumn',temp);
                query1.find().then(function(obj){
                    console.log(obj);
                    done();
                }, function () {
                    throw "";
                })
                console.log(list);
            },function(){
                throw "unable to save data";
            })
    });


    it("should run containedIn over list of CloudObjects",function(done){

            this.timeout(300000);

            var obj = new CB.CloudObject('Custom');
            var obj1 = new CB.CloudObject('Custom');

            var obj2 = new CB.CloudObject('Custom');

            obj.set('newColumn7', [obj2,obj1]);

            obj.save().then(function(obj){
                var query = new CB.CloudQuery('Custom');
                query.containedIn('newColumn7', obj.get('newColumn7')[0]);
                query.find().then(function(list){
                    if(list.length>0){
                        done();
                    }else{
                        throw "Cannot query";
                    }
                }, function(error){
                    throw "Cannot query";
                });
            }, function(error){
                throw "Cannot save an object";
            });

            
    });


     it("should run containedIn over list of CloudObjects by passing a list of CloudObjects",function(done){

            this.timeout(300000);

            var obj = new CB.CloudObject('Custom');
            var obj1 = new CB.CloudObject('Custom');

            var obj2 = new CB.CloudObject('Custom');

            obj.set('newColumn7', [obj2,obj1]);

            obj.save().then(function(obj){
                var query = new CB.CloudQuery('Custom');
                query.containedIn('newColumn7', obj.get('newColumn7'));
                query.find().then(function(list){
                    if(list.length>0){
                        done();
                    }else{
                        throw "Cannot query";
                    }
                }, function(error){
                    throw "Cannot query";
                });
            }, function(error){
                throw "Cannot save an object";
            });

            
    });

    it("should inclue with findById",function(done){

            this.timeout(300000);

            var obj = new CB.CloudObject('Custom');
            var obj1 = new CB.CloudObject('Custom');


            var obj2 = new CB.CloudObject('Custom');
            obj2.set('newColumn1','sample');
            obj.set('newColumn7', [obj2,obj1]);

            obj.save().then(function(obj){
                var query = new CB.CloudQuery('Custom');
                query.include('newColumn7');
                query.findById(obj.id).then(function(obj){
                   if(obj.get('newColumn7').length>0){
                     if(obj.get('newColumn7')[0].get('newColumn1') === 'sample'){
                        done();
                     }else{
                        throw "did not include sub documents";
                     }
                   }else{
                        throw "Cannot get the list";
                   }
                }, function(error){
                    throw "Cannot query";
                });
            }, function(error){
                throw "Cannot save an object";
            });

            
    });

});
describe("CloudQuery", function () {

    var obj = new CB.CloudObject('student1');

   it("Should save data with a particular value.", function (done) {

        this.timeout(20000);

        obj.set('name', 'vipul');
        obj.save().then(function(list) {
            if(list.get('name') === 'vipul')
                done();
            else
                throw "object could not saved properly";
        }, function () {
            throw "data Save error";
        });

    });

   it("select column should work on find",function(done){
            this.timeout(20000);
            var obj1 = new CB.CloudObject('Custom1');
            obj1.set('newColumn','sample');
            obj1.set('description','sample2');
            obj1.save().then(function(obj){
                var cbQuery = new CB.CloudQuery('Custom1');
                cbQuery.equalTo('id', obj.id);
                cbQuery.selectColumn('newColumn');
                
                cbQuery.find({
                  success: function(objList){
                    if(objList.length>0)
                        if(!objList[0].get('description'))
                            done();
                        else
                            throw "Select doesn't work";
                    else
                        throw "Cannot query over select ";
                  },
                  error: function(err){
                     throw "Error querying object.";
                  }
                });
               
            },function(){
               throw "should save the object";
            });
        });

        it("select column should work on distinct",function(done){
            this.timeout(20000);
            var obj1 = new CB.CloudObject('Custom1');
            obj1.set('newColumn','sample');
            obj1.set('description','sample2');
            obj1.save().then(function(obj){
                var cbQuery = new CB.CloudQuery('Custom1');
                cbQuery.equalTo('id', obj.id);
                cbQuery.selectColumn('newColumn');
                cbQuery.distinct('id',{
                  success: function(objList){
                    if(objList.length>0)
                        if(!objList[0].get('description'))
                            done();
                        else
                            throw "Select doesn't work";
                    else
                        throw "Cannot query over select ";
                  },
                  error: function(err){
                     throw "Error querying object.";
                  }
                });
               
            },function(){
               throw "should save the object";
            });
        });

     it("should retrieve items when column name is null (from equalTo function)",function(done){
        this.timeout(20000);

        var obj = new CB.CloudObject('student1');
        obj.save().then(function(obj){
            var query = new CB.CloudQuery('student1');
            query.equalTo('name',null);
            query.find().then(function(list){

                //check all the objects returned. 
                for(var i=0;i<list.length;i++){
                    if(list[i].get('name')){
                        throw "Name exists";
                    }
                }

                console.log(list);

                if(list.length>0)
                    done();
                else
                    throw "object could not queried properly";
            },function(err){
                console.log(err);
            });
        }, function(error){
            throw "object could not saved properly";
        });

       
    });


    it("should retrieve items when column name is NOT null (from NotEqualTo function)",function(done){
        this.timeout(20000);

        var obj = new CB.CloudObject('student1');
        obj.set('name','sampleName');
        obj.save().then(function(obj){
            var query = new CB.CloudQuery('student1');
            query.notEqualTo('name',null);
            query.find().then(function(list){

                //check all the objects returned. 
                for(var i=0;i<list.length;i++){
                    if(!list[i].get('name')){
                        throw "Name does not exists";
                    }
                }

                console.log(list);

                if(list.length>0)
                    done();
                else
                    throw "object could not queried properly";
            },function(err){
                console.log(err);
            });
        }, function(error){
            throw "object could not saved properly";
        });

       
    });

     it("should retrieve items when column name is not null (from notEqualTo function)",function(done){
        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('id',obj.get('id'));
        query.find().then(function(list){
            if(list.length>0)
                done();
            else
                throw "object could not saved properly";
        },function(err){
            console.log(err);
        });
    });

    it("should find data with id",function(done){

        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.equalTo("id",obj.get('id'));
        query.find().then(function(list){
            if(list.length>0){
                done();
            }else{
                throw "unable to retrive data";
            }
        },function(err){
           throw "unable to retrieve data";
        });

    });

     it("should return count as an integer",function(done){

        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.count({
            success: function(count){
                //count is the count of data which belongs to the query
                if (count === parseInt(count, 10))
                    done();
                else
                   throw "Count returned is not of type integer.";
            },
            error: function(err) {
                //Error in retrieving the data.
                throw "Error getting count.";
            }
        });

    });

    it("should find item by id",function(done){
        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('id',obj.get('id'));
        query.find().then(function(list){
            if(list.length>0)
                done();
            else
                throw "object could not saved properly";
        },function(err){
            console.log(err);
        });
    });

    it("should run a find one query",function(done){

        this.timeout(20000);

        var query = new CB.CloudQuery('student1');
        query.equalTo('name','vipul');
        query.findOne().then(function(list){
            if(list.get('name') === 'vipul')
                done();
            else
                throw "unable to get";
        }, function (err) {
            console.log(err);
            throw "should return object";
        })
    });

    it("Should retrieve data with a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student1');
        obj.equalTo('name','vipul');
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name') != 'vipul')
                        throw "should retrieve saved data with particular value ";
                }
            } else{
                throw "should retrieve saved data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should save list with in column", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['java','python']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "list Save error";
        });

    });

    it("Should retrieve list matching with several different values", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudObject('student4');
        obj.set('subject',['java','python']);
        obj.save().then(function() {
            var obj = new CB.CloudQuery('student4');
            obj.containsAll('subject',['java','python']);
            obj.find().then(function(list) {
                if(list.length>0){
                    for(var i=0;i<list.length;i++)
                    {
                        var subject=list[i].get('subject');
                        for(var j=0;j<subject.length;j++) {
                            if (subject[j] != 'java' && subject[j] != 'python')
                                throw "should retrieve saved data with particular value ";
                        }
                    }
                } else{
                    throw "should retrieve data matching a set of values ";
                }
            done();
        }, function () {
            throw "find data error";
        });
        }, function () {
            throw "list Save error";
        });


        

    });

    it("Should retrieve data where column name starts which a given string", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student1');
        obj.startsWith('name','v');
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name')[0] != 'v' && list[i].get('name')[0]!='V')
                        throw "should retrieve saved data with particular value ";
                }
            } else{
                throw "should retrieve data matching a set of values ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should save list with in column", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.set('subject', ['C#','python']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "list Save error";
        });

    });

    it("Should not retrieve data with a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student1');
        obj.notEqualTo('name','vipul');
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('name') === 'vipul')
                        throw "should not retrieve data with particular value ";
                }
            } else{
                throw "should not retrieve data with particular value ";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should not retrieve data including a set of different values", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.notContainedIn('subject',['java','python']);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('subject')) {
                        var subject = list[i].get('subject');
                        for (var j = 0; j < subject.length; j++) {
                            if (subject[j] === 'java' || subject[j] === 'python')
                                throw "should retrieve saved data with particular value ";

                        }
                    }
                }
            } else{
                done();
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should save data with a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudObject('student4');
        obj.set('age', 15);
        obj.set('subject', ['C#','C']);
        obj.save().then(function() {
            done();
        }, function () {
            throw "data Save error";
        });

    });

    it("Should retrieve data which is greater that a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.greaterThan('age',10);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') <= 10 )
                        throw "received value less than the required value";
                }
            } else{
                throw "received value less than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data which is greater equal to a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.greaterThanEqualTo('age',15);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') < 10)
                        throw "received value less than the required value";
                }
            } else{
                throw "received value less than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data which is less than a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.lessThan('age',20);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') >= 20)
                        throw "received value greater than the required value";
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data which is less or equal to a particular value.", function (done) {

        this.timeout(20000);

        var obj = new CB.CloudQuery('student4');
        obj.lessThanEqualTo('age',15);
        obj.find().then(function(list) {
            if(list.length>0){
                for(var i=0;i<list.length;i++)
                {
                    if(list[i].get('age') > 15)
                        throw "received value greater than the required value";
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data with a particular value.", function (done) {

        this.timeout(20000);

        var obj1 = new CB.CloudQuery('student4');
        obj1.equalTo('subject',['java','python']);
        var obj2 = new CB.CloudQuery('student4');
        obj2.equalTo('age',12);
        var obj = new CB.CloudQuery.or(obj1,obj2);
        obj.find().then(function(list) {
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age') === 12) {
                        continue;
                    }else {
                        var subject = list[i].get('subject');
                        for (var j = 0; j < subject.length; j++) {
                            if (subject[j] === 'java' || subject[j] === 'python') {
                                continue;
                            }
                            else
                            {
                                throw "should retrieve saved data with particular value ";
                            }
                        }
                    }
                    continue;
                }
            }
            else
                throw "should return data";
            done();
        }, function () {
            throw "find data error";
        });

    });

   it("Should retrieve data in ascending order", function (done) {

        this.timeout(20000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.orderByAsc('age');
        obj.find().then(function(list) {
            if(list.length>0){
                age=list[0].get('age');
                for(var i=1;i<list.length;i++)
                {
                    if(age>list[i].get('age'))
                        throw "received value greater than the required value";
                    age=list[i].get('age');
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should retrieve data in descending order", function (done) {

        this.timeout(20000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.orderByDesc('age');
        obj.find().then(function(list) {
            if(list.length>0){
                age=list[0].get('age');
                for(var i=1;i<list.length;i++)
                {
                    if(age<list[i].get('age'))
                        throw "received value greater than the required value";
                    age=list[i].get('age');
                }
            } else{
                throw "received value greater than the required value";
            }
            done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should limit the number of data items received", function (done) {

        this.timeout(20000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.setLimit(5);
        obj.find().then(function(list) {
            if(list.length>5)
                throw "received number of items are greater than the required value";
            else
                done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should limit the number of data items received to one", function (done) {

        this.timeout(20000);
        var age=null;
        var obj = new CB.CloudQuery('student4');
        obj.findOne().then(function(list) {
            if(list.length > 1)
                throw "received number of items are greater than the required value";
            else
                done();
        }, function () {
            throw "find data error";
        });

    });

    it("Should give distinct elements", function (done) {

        this.timeout(20000);
        var age=[];
        var obj = new CB.CloudQuery('student4');
        obj.distinct('age').then(function(list) {
            if(list.length>0)
            {
                for(var i=0;i<list.length;i++) {
                    if (list[i].get('age')) {
                        if (age.indexOf(list[i].get('age')) > 0)
                            throw "received item with duplicate age";
                        else
                            age.push(list[i].get('age'));
                    }
                }
                done();
            }
        }, function () {
            throw "find data error";
        });

    });

    var getidobj = new CB.CloudObject('student1');

    it("Should save data with a particular value.", function (done) {

        this.timeout(20000);
        getidobj.set('name', 'abcd');
        getidobj.save().then(function() {
            done();
        }, function () {
            throw "data Save error";
        });

    });

    it("Should get element with a given id", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudQuery('student1');
        obj.get(getidobj.get('id')).then(function(list) {
            if(list.length>0) {
                throw "received number of items are greater than the required value";
            }
            else{
                if(list.get('name')==='abcd')
                    done();
                else
                    throw "received wrong data";
            }
        }, function () {
            throw "find data error";
        });

    });

    it("Should get element having a given column name", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudQuery('student4');
        obj.exists('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (!list[i].get('age'))
                        throw "received wrong data";
                }
                done();
            }
            else{
                throw "data not received"
            }
        }, function () {
            throw "find data error";
        });

    });

    it("Should get element not having a given column name", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudQuery('student4');
        var obj = new CB.CloudQuery('student4');
        obj.doesNotExists('age');
        obj.find().then(function(list) {
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].get('age'))
                        throw "received wrong data";
                }
                done();
            }
            else{
                throw "data not received"
            }
        }, function () {
            throw "find data error";
        });

    });

    it("Should not give element with a given relation",function(done){

        this.timeout(20000);

        var obj1 = new CB.CloudObject('hostel');
        obj1.set('room',123);
        obj1.save().then(function(obj){
            if(obj){
                obj1 = obj;
            }else{
                throw "should save the object";
            }
            obj = new CB.CloudObject('student1');
            obj.set('newColumn',obj1);
            obj.save().then(function(list){
                console.log(list)
                var query = new CB.CloudQuery('student1');
                query.notEqualTo('newColumn',obj1);
                query.find().then(function (list) {
                    for(var i=0;i<list.length;i++){
                        if(list[i].get('newColumn')) {
                            if (list[i].get('newColumn').get('id') === obj1.get('id'))
                                throw "Should not get the id in not equal to";
                        }
                    }
                    done();
                }, function () {
                    throw "should do query";
                });
            },function(){
                throw "should save the object";
            });
        },function(){
           throw "should save the object";
        });
    });

    it("Should query over boolean dataType",function(done){
            this.timeout(20000);
            var obj1 = new CB.CloudObject('Custom1');
            obj1.set('newColumn1',false);
            obj1.save().then(function(obj){
                var cbQuery = new CB.CloudQuery('Custom1');
                cbQuery.equalTo('newColumn1', false);
                cbQuery.find({
                  success: function(objList){
                    if(objList.length>0)
                        done();
                    else
                        throw "Cannot query over boolean datatype ";
                  },
                  error: function(err){
                     throw "Error querying object.";
                  }
                });
               
            },function(){
               throw "should save the object";
            });
        });

    
});
describe("CloudSearch", function (done) {


    it("should index object for search", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom1');
        obj.set('description', 'wi-fi');
        obj.save({
            success : function(obj){
                done();
            },error : function(error){
                throw "should index cloud object";
            }
        });
    });

    it("should search indexed object", function (done) {

        this.timeout(30000);

        var cs = new CB.CloudSearch('Custom1');
        cs.searchQuery = new CB.SearchQuery();
        cs.searchQuery.searchOn('description', 'wi-fi');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for indexed object";
                }
            },error : function(error){
                throw "should search for indexed object";
            }
        });
    });

   
    it("should index test data",function(done){

        this.timeout(50000);

        var obj = new CB.CloudObject('Student');
        obj.set('description', 'This is nawaz');
        obj.set('age', 19);
        obj.set('name', 'Nawaz Dhandala');
        obj.set('class', 'Java');
       
        obj.save({
            success : function(obj){
                //now search on this object.
                var obj = new CB.CloudObject('Student');
                obj.set('description', 'This is gautam singh');
                obj.set('age', 19);
               // obj.expires=new Date().getTime();
                obj.set('name', 'Gautam Singh');
                obj.set('class', 'C#');
                
                obj.save({
                    success : function(obj){
                        var obj = new CB.CloudObject('Student');
                        obj.set('description', 'This is ravi');
                        obj.set('age', 40);
                   //     obj.expires=new Date().getTime();
                        obj.set('name', 'Ravi');
                        obj.set('class', 'C#');
                       

                        obj.save({
                            success : function(obj){
                                //now search on this object.
                                done();
                            },error : function(error){
                                throw "should index data for search";
                            }
                        });
                    },error : function(error){
                        throw "index data error";
                    }
                });


            },error : function(error){
                throw "index data error";
            }
        });

    });

    it("should search for object for a given value",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();

        cs.searchFilter .equalTo('age', 19);
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search indexed object";
                }
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });


    it("should search for object with a phrase",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.phrase('name', 'Gautam Singh');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search indexed object";
                }
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });

    it("should search for object with a wildcard",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.wildcard('name', 'G*');
        cs.search({
            success : function(list){
               
                    done();
               
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });


    it("should search for object with a startsWith",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.startsWith('name', 'G');
        cs.search({
            success : function(list){
               
                    done();
               
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });

     it("should search for object with a mostcolumns",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.mostColumns(['name','description'], 'G');
        cs.search({
            success : function(list){
               
                    done();
              
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });

    it("should search for object with a bestColumns",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchQuery = new CB.SearchQuery();

        cs.searchQuery.bestColumns(['name','description'], 'G');
        cs.search({
            success : function(list){
              
                    done();
               
            },error : function(error){
                throw "should search indexed object";
            }
        });
    });


    it("should search values which are not equal to a given value",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.notEqualTo('age', 19);

        cs.search({
            success : function(list){
                
                    done();
               
            },error : function(error){
                throw "should search values which are not equal to a given value";
            }
        });
    });

    it("should limit the number of search results",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.notEqualTo('age', 19);
        cs.setLimit(0);
        cs.search({
            success : function(list){
                if(list.length===0){
                    done();
                }else{
                    throw "should limit the number of results";
                }
            },error : function(error){
                throw "should search for results";
            }
        });
    });

    it("should skip elements",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.notEqualTo('age', 19);
        cs.setSkip(9999999);
        cs.search({
            success : function(list){
                if(list.length===0){
                    var cs = new CB.CloudSearch('Student');
                    cs.searchFilter = new CB.SearchFilter();
                    cs.searchFilter.notEqualTo('age', 19);
                    cs.setSkip(1);
                    cs.search({
                        success : function(list){
                            if(list.length>0){
                                done();
                            }else{
                                throw "should skip elements";
                            }
                        },error : function(error){
                            throw "should skip elements"
                        }
                    });
                }else{
                    throw "should search for elements";
                }
            },error : function(error){
                throw "should search for elements"
            }
        });
    });

    it("should sort the results in ascending order",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.orderByAsc('age');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for elements in ascending order";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should sort elements in descending order",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.orderByDesc('age');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for elements in ascending order";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should give elements in which a particular column exists",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.exists('name');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for elements with a particular column";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should search for records which do not have a certain column",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.doesNotExist('expire');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should give records which do not have a specified column";
                }
            },error : function(error){
                throw "should search for elements";
            }
        });
    });

    it("should give records within a certain range",function(done){

        this.timeout(30000);

        var cs = new CB.CloudSearch('Student');
        cs.searchFilter = new CB.SearchFilter();
        cs.searchFilter.greaterThan('age',19);
        cs.searchFilter.lessThan('age',50);
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should give elements within a certain range";
                }
            },error : function(error){
               throw "should search for elements";
            }
        });
    });


    it("OR should work between tables",function(done){

        this.timeout(30000);


        var obj = new CB.CloudObject('Student');
        obj.set('name', 'RAVI');

         var obj1 = new CB.CloudObject('hostel');
         obj1.set('room', 509);

         obj.save().then(function(obj){
            obj1.save().then(function(obj1){
                
                var tableNames = ['Student','hostel'];

                
                var sq = new CB.SearchQuery();
                sq.searchOn('name','ravi');

                var sq1 = new CB.SearchQuery();
                sq1.searchOn('room',509);

                var cs = new CB.CloudSearch(tableNames);
                cs.searchQuery = new CB.SearchQuery();
                cs.searchQuery.or(sq);
                cs.searchQuery.or(sq1);

                cs.setLimit(9999);

                cs.search({
                    success : function(list){
                        for(var i=0;i<list.length;i++){
                            if(list[i].document._tableName){
                                if(tableNames.indexOf(list[i].document._tableName)>-1){
                                    tableNames.splice(tableNames.indexOf(list[i].document._tableName),1);
                                }
                            }
                        }


                        if(tableNames.length===0){
                            //test passed. 
                            done();
                        }else{
                            throw "Search on both tables with OR failed.";
                        }

                    }, error: function(error){
                        console.log(error);
                        throw "Error while search.";
                    }
                })


             }, function(error){
                throw "Cannot save an object";
             });
         }, function(error){
            throw "Cannot save an object";
         });

       

        
        
    });



    it("should run operator (precision) queries",function(done){

         this.timeout(30000);


        var obj = new CB.CloudObject('Student');
        obj.set('name', 'RAVI');

         

         obj.save().then(function(obj){
           
                
                var tableNames = ['Student'];

               
                var cs = new CB.CloudSearch(['Student']);
                cs.searchQuery = new CB.SearchQuery();

                
                cs.searchQuery.searchOn('name','ravi',null,'and'); //Precision search.

                cs.setLimit(9999);

                cs.search({
                    success : function(list){
                        for(var i=0;i<list.length;i++){
                            if(list[i].document._tableName){
                                if(tableNames.indexOf(list[i].document._tableName)>-1){
                                    tableNames.splice(tableNames.indexOf(list[i].document._tableName),1);
                                }
                            }
                        }

                        if(tableNames.length===0){
                            //test passed. 
                            done();
                        }else{
                            throw "Search with precision passed.";
                        }

                    }, error: function(error){
                        console.log(error);
                        throw "Error while search.";
                    }
                });
         }, function(error){
            throw "Cannot save an object";
         });
        
        });


    it("should run minimum percent (precision) queries",function(done){

         this.timeout(30000);


        var obj = new CB.CloudObject('Student');
        obj.set('name', 'RAVI');

         obj.save().then(function(obj){
           
                
                var tableNames = ['Student'];

               
                var cs = new CB.CloudSearch(['Student']);
                cs.searchQuery = new CB.SearchQuery();
                cs.searchQuery.searchOn('name','ravi',null, null,'75%'); //Precision search.

                cs.setLimit(9999);

                cs.search({
                    success : function(list){
                        for(var i=0;i<list.length;i++){
                            if(list[i].document._tableName){
                                if(tableNames.indexOf(list[i].document._tableName)>-1){
                                    tableNames.splice(tableNames.indexOf(list[i].document._tableName),1);
                                }
                            }
                        }

                        if(tableNames.length===0){
                            //test passed. 
                            done();
                        }else{
                            throw "Search with precision passed.";
                        }

                    }, error: function(error){
                        console.log(error);
                        throw "Error while search.";
                    }
                });
         }, function(error){
            throw "Cannot save an object";
         });
        
        });


        it("multi table search",function(done){

         this.timeout(30000);


        var obj = new CB.CloudObject('Student');
        obj.set('name', 'RAVI');

         var obj1 = new CB.CloudObject('hostel');
         obj1.set('name', 'ravi');

         obj.save().then(function(obj){
            obj1.save().then(function(obj1){
                
                var tableNames = ['Student','hostel'];

               
                var cs = new CB.CloudSearch(['Student','hostel']);
                cs.searchQuery = new CB.SearchQuery();
                cs.searchQuery.searchOn('name','ravi');

                cs.setLimit(9999);

                cs.search({
                    success : function(list){
                        for(var i=0;i<list.length;i++){
                            if(list[i].document._tableName){
                                if(tableNames.indexOf(list[i].document._tableName)>-1){
                                    tableNames.splice(tableNames.indexOf(list[i].document._tableName),1);
                                }
                            }
                        }


                        if(tableNames.length===0){
                            //test passed. 
                            done();
                        }else{
                            throw "Search on multi tables failed.";
                        }

                    }, error: function(error){
                        console.log(error);
                        throw "Error while search.";
                    }
                })


             }, function(error){
                throw "Cannot save an object";
             });
         }, function(error){
            throw "Cannot save an object";
         });

    
    });

});
describe("Inlcude in CloudSearch", function (done) {

    it("should include a relation on search.", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'text');

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        obj.set('newColumn7', obj1);
    
        obj.save({
            success : function(obj){

                var cs = new CB.CloudSearch('Custom2');
                cs.searchFilter = new CB.SearchFilter();
                cs.searchFilter.include('newColumn7');
                cs.searchFilter.equalTo('id',obj.id);
                cs.search().then(function(list){

                    if(list.length>0){
                        for(var i=0;i<list.length;i++){
                            console.log('LIST');
                            console.log(list[0]);
                            var student_obj=list[i].get('newColumn7');
                            console.log('Student');
                            console.log(student_obj);
                            if(!student_obj.get('name'))
                                throw "Unsuccessful Join";
                            else
                                done();
                        }    
                    }else{
                        throw "Cannot retrieve a saved relation.";
                    }
                }, function(error){
                    throw "Unsuccessful join"
                });
            }, error : function(error){
                throw "Cannot save a CloudObject";

            }

        });

    });
});
describe("CloudUser", function () {
    var username = util.makeString();
    var passwd = "abcd";

    

   it("Should create new user", function (done) {
         if(CB._isNode){
            done();
            return;
         }

         this.timeout(100000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.set('email',util.makeEmail());
        obj.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function (error) {
            throw error;
        });

    });

    it('should logout the user',function (done){

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(10000);
        CB.CloudUser.current.logOut().then(function(){
            done();
        },function(){
            throw "err";
        });
    });

    it("Should create a user and get version",function(done){

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(10000);
        var user = new CB.CloudUser();
        var usrname = util.makeString();
        var passwd = "abcd";
        user.set('username', usrname);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === usrname && list.get('_version')>=0){
                done();
            }
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });
    });

    it("should do a query on user",function(done){


        if(CB._isNode){
            done();
            return;
         }


        this.timeout(10000);
        var user = new CB.CloudUser();
        var usrname = util.makeString();
        var passwd = "abcd";
        user.set('username', usrname);
        user.set('password',passwd);
        user.set('email',util.makeEmail());
        user.signUp().then(function(list) {
            if(list.get('username') === usrname && list.get('_version')>=0){
                var query = new CB.CloudQuery('User');
                query.findById(user.get('id')).then(function(obj){
                    console.log(obj);
                    done();
                },function(err){
                    console.log(err);
                });
            }
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });

    it('should logout the user',function (done){

        if(CB._isNode){
            done();
            return;
         }


        this.timeout(10000);
        CB.CloudUser.current.logOut().then(function(){
            done();
        },function(){
            throw "err";
        });
    });


     it("Should login user", function (done) {

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(10000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            if(list.get("username") === username)
                done();
        }, function () {
            throw "user login error";
        });

    });

    var rolename = util.makeString();
    var role = new CB.CloudRole(rolename);
    role.set('name',rolename);
    it("Should create a role ", function (done) {

        this.timeout(10000);

        //var role = new CB.CloudRole('admin');
        role.save().then(function(list){
                done();
            },function(){
                throw "role create error";
            });

    });


   it("Should assign role to user", function (done) {

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(100000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role.save().then(function(role){
                list.addToRole(role).then(function(list){
                    done();
                },function(error){
                    throw error;
                });
            }, function (error) {
                throw error;
            });
        },function(){
            throw "role create error";
        })

    });

    it("Should remove role assigned role to user", function (done) {

         if(CB._isNode){
            done();
            return;
         }
         

        this.timeout(1000000);

        var obj = new CB.CloudUser();
        rolename = util.makeString();
        var role = new CB.CloudRole(rolename);
        role.set('name',rolename);
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role.save().then(function(role){
                list.addToRole(role).then(function(list){
                    CB.CloudUser.current.removeFromRole(role).then(function(){
                        done();
                    },function(){
                        throw "Should remove the role";
                    });
                },function(){
                    throw "user role set error";
                });
            }, function () {
                throw "user role assign error";
            });
        },function(){
            throw "user login error";
        });

    });
     


     it('should encrypt user password',function (done){
        
        this.timeout(100000);

        var pass = passwd;

        var obj = new CB.CloudUser();
        obj.set('username', util.makeString());
        obj.set('password',pass);
        obj.set('email',util.makeEmail());
        obj.save().then(function(obj) {
            if(obj.get('password') === pass)
                throw "Password is not encrypted.";
            else
               done();
        }, function () {
            throw "user create error";
        });

    });


  


});
describe("CloudRole", function (done) {
    var roleName = util.makeString();
    var role = new CB.CloudRole(roleName);
    it("Should create a role", function (done) {

        this.timeout(20000);
        console.log(role.ACL);
        role.save().then(function(list){
            console.log(list);
            if(!list)
                throw "Should retrieve the cloud role";
            done();
        },function(){
            throw "Should retrieve the cloud role";
        });
    });

    it("Should Retrieve a role", function (done) {
		
        this.timeout(20000);
        var query = new CB.CloudQuery('Role');
        query.equalTo('id',role.get('id'));
        query.find().then(function(list){
        	console.log(list);
        	if(!list)
        		throw "Should retrieve the cloud role";
            done();
        },function(){
            throw "Should retrieve the cloud role";
        });
    });
});

describe("CloudApp Socket Test", function () {

    it("Should fire an event when disconnect", function (done) {
       this.timeout(40000);

       CB.CloudApp.onDisconnect(function(){
        done();
       });

       CB.CloudApp.disconnect();

    });

    it("Should fire an event when connect.", function (done) {

       this.timeout(30000);

       CB.CloudApp.disconnect();

       CB.CloudApp.onConnect(function(){
        done();
       });

       CB.CloudApp.connect();

    });


});
describe("Cloud Table", function(){
<<<<<<< HEAD

    // it("should not create duplicate table",function(done){
    //     this.timeout(20000);
    //     var obj = new CB.CloudTable('Table');
    //     obj.save().then(function(){
    //         throw("should not create duplicate table");
    //     },function(){
    //         done();
    //     });
    // });
=======
	
	before(function(){
    	CB.appKey = 'Qopoy/kXd+6G734HsjQMqGPGOvwEJYmBG84lQawRmWM=';
  	});
    it("should not create duplicate table",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table');
        obj.save().then(function(){
            done("should not create duplicate table");
        },function(){
            done();
        });
    });
>>>>>>> feature_cbtables

    it("should first create a table and then delete that table",function(done){
        this.timeout(20000);
        var tableName = util.makeString();
        var obj = new CB.CloudTable(tableName);
        obj.save().then(function(newTable){
          CB.CloudTable.delete(newTable).then(function(){
              done();
          },function(){
              done("should have delete the table");
          });
        },function(){
            done("should have create the table");
        });

    });
<<<<<<< HEAD

    // it("should get a table information",function(done){
    //     this.timeout(20000);
    //     var obj = new CB.CloudTable('Address');
    //     CB.CloudTable.get(obj).then(function(){
    //         done();
    //     },function(){
    //         throw("should fetch the table");
    //     });
    // });

    // it("should get all tables from an app",function(done){
    //     this.timeout(20000);
    //     CB.CloudTable.getAll().then(function(){
    //         done();
    //     },function(){
    //         throw("should get the all table");
    //     });
    // });

    // it("should update new column into the table",function(done){
    //     this.timeout(20000);

    //     var obj = new CB.CloudTable('Table12');
    //     CB.CloudTable.get(obj, {
    //       success: function(table){
    //         var column1 = new CB.Column('Name11', 'Relation', true, false);
    //         column1.relatedTo = 'Table2';
    //         table.addColumn(column1);
    //         table.save().then(function(newTable){
    //           var column2 = new CB.Column('Name11');
    //           newTable.deleteColumn(column2);
    //           newTable.save().then(function(){
    //             done();
    //           },function(){
    //             throw("should save the table");
    //           });
    //         },function(){
    //           throw("should save the table");
    //         });
    //       },
    //       error: function(err){
    //           throw("should fetch the table");
    //       }
    //     });
    // });

    // it("should not rename a table",function(done){
    //   this.timeout(20000);
    //   var obj = new CB.CloudTable('Table12');
    //   CB.CloudTable.get(obj).then(function(table){
    //       table.name = "NewName";
    //       table.save().then(function(newTable){
    //           throw "should not renamed the table";
    //       }, function(){
    //           done();
    //       });
    //   },function(){
    //       throw("should fetch the table");
    //   });
    // });

    // it("should not change type of table",function(done){
    //   this.timeout(20000);
    //   var obj = new CB.CloudTable('Table12');
    //   CB.CloudTable.get(obj).then(function(table){
    //       table.type = "NewType";
    //       table.save().then(function(newTable){
    //           throw "should not change the type of a table";
    //       },function(){
    //           done();
    //       });
    //   },function(){
    //       throw("should fetch the table");
    //   });
    // });

    // it("should not rename a column",function(done){
    //     this.timeout(20000);
    //     var obj = new CB.CloudTable('Table12');
    //     CB.CloudTable.get(obj).then(function(table){
    //         table.columns[0].name = "abcd";
    //         table.save().then(function(){
    //             throw("should not update the column name");
    //         },function(){
    //             done();
    //         });
    //     },function(){
    //         throw("should fetch the table");
    //     });
    // });

    // it("should not change data type of a column",function(done){
    //   this.timeout(20000);
    //   var obj = new CB.CloudTable('Table12');
    //   CB.CloudTable.get(obj).then(function(table){
    //       table.columns[0].dataType = "abcd";
    //       table.save().then(function(){
    //           throw("should not update the column dataType");
    //       },function(){
    //           done();
    //       });
    //   },function(){
    //       throw("should fetch the table");
    //   });
    // });

    // it("should not change unique property of a default column",function(done){
    //   this.timeout(20000);
    //   var obj = new CB.CloudTable('Table12');
    //   CB.CloudTable.get(obj).then(function(table){
    //       table.columns[0].unique = false;
    //       table.save().then(function(){
    //           throw("should not change unique property of a default column");
    //       },function(){
    //           done();
    //       });
    //   },function(){
    //       throw("should fetch the table");
    //   });
    // });

    // it("should not change required property of a default column",function(done){
    //   this.timeout(20000);
    //   var obj = new CB.CloudTable('Table12');
    //   CB.CloudTable.get(obj).then(function(table){
    //       table.columns[0].required = false;
    //       table.save().then(function(){
    //           throw("should not change required property of a default column");
    //       },function(){
    //           done();
    //       });
    //   },function(){
    //       throw("should fetch the table");
    //   });
    // });

    // it("should change unique property of a user defined column",function(done){
    //   this.timeout(20000);
    //   var obj = new CB.CloudTable('Table12');
    //   CB.CloudTable.get(obj).then(function(table){
    //       if(table.columns[5].unique)
    //         table.columns[5].unique = false;
    //       else
    //         table.columns[5].unique = true;
    //       table.save().then(function(newTable){
    //           if(newTable.columns[5].unique == table.columns[5].unique)
    //             done();
    //           else
    //             throw("shouldchange unique property of a user defined column");
    //       },function(){
    //           throw("shouldchange unique property of a user defined column");
    //       });
    //   },function(){
    //       throw("should fetch the table");
    //   });
    // });

    // it("should change required property of a user defined column",function(done){
    //   this.timeout(20000);
    //   var obj = new CB.CloudTable('Table12');
    //   CB.CloudTable.get(obj).then(function(table){
    //       if(table.columns[5].required)
    //         table.columns[5].required = false;
    //       else
    //         table.columns[5].required = true;

    //       table.save().then(function(newTable){
    //           if(newTable.columns[5].required == table.columns[5].required)
    //             done();
    //           else
    //             throw("should change required property of a user defined column");
    //       },function(){
    //           throw("should change required property of a user defined column");

    //       });
    //   },function(){
    //       throw("should fetch the table");
    //   });
    // });

    // it("should not delete a default column of a table",function(done){
    //   this.timeout(20000);
    //   var obj = new CB.CloudTable('Table12');
    //   CB.CloudTable.get(obj).then(function(table){
    //       table.columns[2] = "";
    //       table.save().then(function(newTable){
    //           if(newTable.columns[2] != "createdAt")
    //             throw("should change required property of a user defined column");
    //       },function(){
    //           done();
    //       });
    //   });
    // });

=======
	
	/*it("should add a column to an existing table",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table2');
        CB.CloudTable.get(obj).then(function(table){
        	var column1 = new CB.Column('city', 'Text', true, false);
		    table.addColumn(column1);
		    table.save().then(function(table){
		          done();
		    });
        },function(){
            done("should fetch the table");
        });
        
    });*/
    
	it("should add a column to the table after save.",function(done){
        this.timeout(20000);
        var tableName = util.makeString();
        var table = new CB.CloudTable(tableName);
        table.save().then(function(table){
            var column1 = new CB.Column('Name11', 'Text', true, false);
            table.addColumn(column1);
            table.save().then(function(newTable){
              done();
              CB.CloudTable.delete(newTable);
            });
        });
    });
    
    it("should get a table information",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Address');
        CB.CloudTable.get(obj).then(function(){
            done();
        },function(){
            done("should fetch the table");
        });
    });

    it("should get all tables from an app",function(done){
        this.timeout(20000);
        CB.CloudTable.getAll().then(function(){
            done();
        },function(){
            done("should get the all table");
        });
    });

    it("should update new column into the table",function(done){
        this.timeout(20000);
		var tableName =  util.makeString();
        var obj = new CB.CloudTable(tableName);
       
        var column1 = new CB.Column('Name11', 'Relation', true, false);
        column1.relatedTo = 'Table2';
        obj.addColumn(column1);
        obj.save().then(function(newTable){
        	var column2 = new CB.Column('Name11');
        	newTable.deleteColumn(column2);
            newTable.save().then(function(table){
               done();
               CB.CloudTable.delete(table);
            },function(){
                done("should save the table");
              });
            },function(){
              done("should save the table");
        });
    });

    it("should not rename a table",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.name = "NewName";
          table.save().then(function(newTable){
              done( "should not renamed the table");
          }, function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not change type of table",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          table.type = "NewType";
          table.save().then(function(newTable){
              done( "should not change the type of a table");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not rename a column",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table2');
        CB.CloudTable.get(obj).then(function(table){
            table.columns[0].name = "abcd";
            table.save().then(function(){
                done("should not update the column name");
            },function(){
                done();
            });
        },function(){
            done("should fetch the table");
        });
    });

    it("should not change data type of a column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[0].dataType = "abcd";
          table.save().then(function(){
              done("should not update the column dataType");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not change unique property of a default column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[0].unique = false;
          table.save().then(function(){
              done("should not change unique property of a default column");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not change required property of a default column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[0].required = false;
          table.save().then(function(){
              done("should not change required property of a default column");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should change unique property of a user defined column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          if(table.columns[5].unique)
            table.columns[5].unique = false;
          else
            table.columns[5].unique = true;
          table.save().then(function(newTable){
              if(newTable.columns[5].unique == table.columns[5].unique)
                done();
              else
                done("shouldchange unique property of a user defined column");
          },function(){
              done("shouldchange unique property of a user defined column");
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should change required property of a user defined column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          if(table.columns[5].required)
            table.columns[5].required = false;
          else
            table.columns[5].required = true;

          table.save().then(function(newTable){
              if(newTable.columns[5].required == table.columns[5].required)
                done();
              else
                done("should change required property of a user defined column");
          },function(){
              done("should change required property of a user defined column");

          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not delete a default column of a table",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[2] = "";
          table.save().then(function(newTable){
              if(newTable.columns[2] != "createdAt")
                done("should change required property of a user defined column");
          },function(){
              done();
          });
      });
    });
    
    after(function() {
    	CB.appKey = '9SPxp6D3OPWvxj0asw5ryA==';
  	});

>>>>>>> feature_cbtables
});
