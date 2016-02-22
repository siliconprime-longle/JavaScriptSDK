describe("CloudUser", function () {
    var username = util.makeString();
    var passwd = "abcd";

    
   it("Should create new user", function (done) {
        if(CB._isNode){
           done();
           return;
        }

        this.timeout(300000);

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

    it("Should create new user and change the password.", function (done) {
        if(CB._isNode){
           done();
           return;
        }

        this.timeout(300000);

        var oldPassword = passwd;

        var obj = new CB.CloudUser();
        obj.set('username', username+"1");
        obj.set('password',oldPassword);
        obj.set('email',util.makeEmail());
        obj.signUp().then(function(list) {
            if(list.get('username'))
                CB.CloudUser.current.changePassword(oldPassword, 'newPassword', {
                    success : function(user){
                        done();
                    }, error : function(error){
                        done(error);
                    }
                });
            else
               done("create user error");
        }, function (error) {
            throw error;
        });

    });


    it("Should not reset the password when old password is wrong.", function (done) {
        if(CB._isNode){
           done();
           return;
        }

        this.timeout(300000);

        var oldPassword = passwd;

        var obj = new CB.CloudUser();
        obj.set('username', username+"2");
        obj.set('password',oldPassword);
        obj.set('email',util.makeEmail());
        obj.signUp().then(function(list) {
            if(list.get('username'))
                CB.CloudUser.current.changePassword("sample", 'newPassword', {
                    success : function(user){
                        done("Password reset with old password is wrong.");
                    }, error : function(error){
                        done();
                    }
                });
            else
               done("create user error");
        }, function (error) {
            throw error;
        });

    });


    it("Should not reset the password when user is logged in.", function (done) {
        if(CB._isNode){
           done();
           return;
        }

        this.timeout(300000);

        CB.CloudUser.current.logOut({
            success : function(){
                try{
                    CB.CloudUser.current.changePassword("sample", 'newPassword', {
                        success : function(user){
                            done("Password reset when user is not logged in.");
                        }, error : function(error){
                            done();
                        }
                    });
                    }catch(e){
                        done();
                    }
            }, error : function(error){
                done("Failed to log out a user. ")
            }
        });
    });

   it("Should not reset Password when user is logged in.", function (done) {
         if(CB._isNode){
            done();
            return;
         }

         this.timeout(300000);

        var obj = new CB.CloudUser();
        obj.set('username', "911@cloudboost.io");
        obj.set('password',passwd);
        obj.set('email',"911@cloudboost.io");
        obj.signUp().then(function(list) {
            if(list.get('username') === "911@cloudboost.io")
               CB.CloudUser.resetPassword("911@cloudboost.io",{
                    success : function(){
                        CB.CloudUser.current.logOut({
                            success : function(){
                                done("Reset password called when the user is logged in.");
                            }, error : function(){
                                done("Reset password called when the user is logged in.");
                            }
                        });
                        done("Reset password when the user is logged in.");
                    }, error : function(error){
                         CB.CloudUser.current.logOut({
                            success : function(){
                                done();
                            }, error : function(){
                                done("Failed to log out.");
                            }
                        });
                    }
               });
            else
                throw "create user error"
        }, function (error) {
            throw error;
        });

    });

    it("Should reset Password", function (done) {
        if(CB._isNode){
           done();
           return;
        }

        this.timeout(300000);
        CB.CloudUser.resetPassword("911@cloudboost.io",{
            success : function(){
               done()
            }, error : function(error){
                 done();
            }
        });
    });

    it("Should create a user and get version",function(done){

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(30000);
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


        this.timeout(30000);
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


        this.timeout(30000);
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

        this.timeout(30000);

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

    var roleName2 = util.makeString();
    var role1 = new CB.CloudRole(roleName2);
    role1.set('name',roleName2);

   it("Should assign role to user", function (done) {

        if(CB._isNode){
            done();
            return;
         }

        this.timeout(300000);

        var obj = new CB.CloudUser();
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role1.save().then(function(role){
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
         

        this.timeout(3000000);

        var obj = new CB.CloudUser();
        var roleName3 = util.makeString();
        var role2 = new CB.CloudRole(roleName3);
        role2.set('name',roleName3);
        obj.set('username', username);
        obj.set('password',passwd);
        obj.logIn().then(function(list) {
            role2.save().then(function(role2){
                list.addToRole(role2).then(function(list){
                    CB.CloudUser.current.removeFromRole(role2).then(function(){
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
        
        this.timeout(300000);

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
        }, function (err) {
            throw "user create error";
        });

    });

    it("Should Create a New User",function(done){

        this.timeout(30000);

        var obj = new CB.CloudUser();
        obj.set('username',util.makeString());
        obj.set('email',util.makeEmail());
        obj.set('password','pass');
        obj.save().then(function(res){
            var query = new CB.CloudQuery('User');
            query.get(res.get('id')).then(function (res1) {
                if(res1){
                    done();
                }else{
                    throw "Unable to retrieve User";
                }
            }, function () {
                throw "Unable to Get User By ID";
            })
        },function(err){
           throw "Unable to Create User";
        });
    });

    it("Should Create a New User",function(done){

        this.timeout(30000);

        var obj = new CB.CloudUser();
        obj.set('username',util.makeString());
        obj.set('email',util.makeEmail());
        obj.set('password','pass');
        obj.save().then(function(res){
            var query = new CB.CloudQuery('User');
            query.get(res.get('id')).then(function (res1) {
                if(res1){
                    done();
                }else{
                    throw "Unable to retrieve User";
                }
            }, function () {
                throw "Unable to Get User By ID";
            })
        },function(err){
            throw "Unable to Create User";
        });
    });

    it("Should Create a New User",function(done){

        this.timeout(30000);

        var obj = new CB.CloudUser();
        obj.set('username',util.makeString());
        obj.set('email',util.makeEmail());
        obj.set('password','pass');
        obj.save().then(function(res){
            var query = new CB.CloudQuery('User');
            query.get(res.get('id')).then(function (res1) {
                if(res1){
                    done();
                }else{
                    throw "Unable to retrieve User";
                }
            }, function () {
                throw "Unable to Get User By ID";
            })
        },function(err){
            throw "Unable to Create User";
        });
    });



});