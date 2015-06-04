    describe("Search_ACL", function () {

    var obj = new CB.CloudObject('student4');
    obj.isSearchable = true;
    obj.set('age',150);

        var username = util.makeString();
        var passwd = "abcd";
        var user = new CB.CloudUser();
        it("Should create new user", function (done) {

            this.timeout(10000);
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

        this.timeout(10000);

        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.length === 0) {
             var cs = new CB.CloudSearch('student4');
                cs.searchOn('age',150);
                cs.search().then(function(list){
                    if(list.length>0)
                    {
                        for(var i=0;i<list.length;i++)
                            if(list[i].get('age'))
                                throw "should not return items";
                    }
                    else
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

   /*it("Should search object with user read access", function (done) {

        this.timeout(10000);
        obj.ACL = new CB.ACL();
        obj.ACL.setUserReadAccess(user.document._id,true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
           // if(acl.read.indexOf("55530158532abda015defe3c") >= 0) {
                var user = new CB.CloudUser();
                user.set('username', username);
                user.set('password', passwd);
                user.logIn().then(function(){
                    var cs = new CB.CloudSearch('student4');
                    cs.searchOn('age',15);
                    cs.search().then(function(){
                        done();
                    },function(){
                        throw "should retrieve object with user read access";
                    });
                },function(){
                    throw "should login";
                });
         //  }
          //  else {
           //     throw "user read access set error";
           // }
        }, function () {
            throw "user read access save error";
        });

    });


    it("Should allow users of role to read", function (done) {

        this.timeout(10000);

        obj.ACL.setRoleWriteAccess("553e194ac0cc01201658142e",true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.indexOf("553e194ac0cc01201658142e")>=0) {
                var user = new CB.CloudUser();
                user.set('username', 'Xjy9g');
                user.set('password', 'abcd');
                user.logIn().then(function(){
                    var cs = new CB.CloudSearch('student4');
                    cs.searchOn('age',15);
                    cs.search().then(function(){
                        done();
                    },function(){
                        throw "should search object with user role read access";
                    });
                },function(){
                    throw "should login";
                });
            }
            else
                throw "user role read access set error"
        }, function () {
            throw "user role read access save error";
        });

    });*/
});

