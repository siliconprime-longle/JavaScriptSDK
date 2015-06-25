describe("ACL", function () {
    var username = util.makeString();
    var passwd = "abcd";
    it("Should create new user", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.set('email',util.makeEmail());
        obj.signUp().then(function(list) {
            if(list.get('username') === username)
                done();
            else
                throw "create user error"
        }, function () {
            throw "user create error";
        });

    });
    var rolename =  util.makeString();
    var role = new CB.CloudRole(rolename);
    it("Should create a role", function (done) {

        this.timeout(10000);
        role.save().then(function(role){
            console.log(role);
            if(!role)
                throw "Should retrieve the cloud role";
            done();
        },function(){
            throw "Should retrieve the cloud role";
        });
    });



    it("Should set the public write access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicWriteAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.allow.user.length === 0) {
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

    it("Should unset the public read access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        CB.CloudUser.current.logOut();
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.length == 0) {
                //run a find query here
                var query = new CB.CloudQuery('student4');
                query.get(list.id).then(function(list){
                    if(list) {
                        if (list.length > 0)
                            throw "should not return document without public read access.";
                        else
                            done();
                    }else
                        done();
                },function(err){
                        throw "error while finding the object";
                });
            }
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });

    it("Should set the public read access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.length>0) {
                //run a find query here
                var query = new CB.CloudQuery('student4');
                query.get(list.id).then(function(list){
                    if(list) {
                        if (list.id)
                            done();
                        else
                            throw "should not return document without public read access.";
                    }else
                        throw "should not return document without public read access.";
                },function(err){
                    throw "error while finding the object";
                });
            }
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });

    it("Should set the user write access", function (done) {

        this.timeout(10000);
        var user = new CB.CloudUser();
        user.set('username', username);
        user.set('password', passwd);
        user.logIn({
            success: function(user) {
                var obj = new CB.CloudObject('student4');
                 obj.ACL = new CB.ACL();
                obj.ACL.setUserWriteAccess(CB.CloudUser.current.id,true);
                obj.save().then(function(list) {
                    acl=list.get('ACL');
                    if(acl.write.allow.user.indexOf(CB.CloudUser.current.id) >= 0) {
                        var user = new CB.CloudUser();
                        user.set('username', username);
                        user.set('password', passwd);
                        user.logIn().then(function(){
                            obj.set('age',15);
                            obj.save().then(function(){
                                done();
                            },function(){
                                throw "should save object with write access";
                            });
                        },function(){
                            throw "should login";
                        });
                    }
                    else
                         throw "user write access set error"
                }, function () {
                    throw "user write access save error";
                });
            },
            error: function(err) {
                throw "Could not login user";
            }
        });

    });

    it("Should allow only the user with write access to modify", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setUserWriteAccess(CB.CloudUser.current.id,true);
        obj.save().then(function(list) {
            CB.CloudUser.current.logOut();
            acl=list.get('ACL');
            if(acl.write.allow.user.indexOf(CB.CloudUser.current.id) >= 0) {
                    obj.set('age',15);
                    obj.save().then(function(){
                        done();
                    },function(){
                        throw "should save object with write access";
                    });
            }
            else
                throw "user write access set error"
        }, function () {
            throw "user write access save error";
        });

    });

    it("should login the user",function(done){
        this.timeout(10000);

        var user = new CB.CloudUser();
        user.set('username', username);
        user.set('password', passwd);
        user.logIn({
            success: function(user) {
                done();
            },
            error: function(err) {
                throw "Could not login user";
            }
        });
    });

    it("Should set the user read access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setUserReadAccess(CB.CloudUser.current.id,true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.user.indexOf(CB.CloudUser.current.id) >= 0)
            //write a find query as well
                done();
            else
                throw "user read access set error"
        }, function () {
            throw "user read access save error";
        });

    });

    it("Should allow users of role to write", function (done) {

        this.timeout(10000);
        CB.CloudUser.current.addToRole(role).then(function(user){
            done();
        },function(err){
            throw "error while assigning role";
        });
    });

    it("Should update object with role access given to user", function (done) {

        this.timeout(10000);
        CB.CloudUser.current.logOut();
        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setRoleWriteAccess(role.id,true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.allow.role.indexOf(role.id)>=0) {
                var user = new CB.CloudUser();
                user.set('username', username);
                user.set('password', passwd);
                user.logIn({
                    success: function (user) {
                        obj.save().then(function(){
                            done();
                        },function(){
                            throw "should save the object with allowed role";
                        });
                    },
                    error: function (err) {
                        throw "Could not login user";
                    }
                });
            }else
                throw "user role write access set error"
        }, function () {
            throw "user role write access save error";
        });

    });
    var obj = new CB.CloudObject('student4');
    it("Should not update object without role access to user", function (done) {

        this.timeout(10000);
        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setUserWriteAccess(CB.CloudUser.current.id,true);
        CB.CloudUser.current.logOut();
        obj.ACL.setRoleWriteAccess(role.id,false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.deny.role.indexOf(role.id)>=0) {
                var user = new CB.CloudUser();
                user.set('username', username);
                user.set('password', passwd);
                user.logIn({
                    success: function (user) {
                        obj.save().then(function(list){
                            done();
                        },function(){
                            throw "should save";
                        });
                    },
                    error: function (err) {
                        throw "Could not login user";
                    }
                });
            }else
                throw "user role write access set error"
        }, function () {
            throw "user role write access save error";
        });

    });

    it("should allow the user with permission and role denied",function(done){

        this.timeout(10000);

        obj.save().then(function(){
            done();
        },function(){
            throw "should be allowed to update with user write access";

        });
    });

    it("Should allow users of role to read", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL.setRoleReadAccess(role.id,true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.allow.role.indexOf(role.id)>=0)
                done();
            else
                throw "user role read access set error"
        }, function () {
            throw "user role read access save error";
        });

    });
});

