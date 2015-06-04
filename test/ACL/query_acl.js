describe("Query_ACL", function () {

    var obj = new CB.CloudObject('student4');
    obj.isSearchable = true;
    obj.set('age',55);

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

        this.timeout(10000);
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
          //  }
         //   else
           //     throw "user read access set error"
        }, function () {
            throw "user read access save error";
        });

    });

    var obj3 = new CB.CloudObject('student4');
    obj3.isSearchable = true;
    obj3.set('age',25);

    /*it("Should allow users of role to read", function (done) {

        this.timeout(10000);

        obj3.ACL.setRoleWriteAccess("553e194ac0cc01201658142e",true);
        obj3.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.indexOf("553e194ac0cc01201658142e")>=0) {
                var user = new CB.CloudUser();
                user.set('username', username);
                user.set('password', passwd);
                user.logIn().then(function(){
                    var cq = new CB.CloudQuery('student4');
                    cq.equalTo('age',25);
                    cq.find().then(function(){
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

