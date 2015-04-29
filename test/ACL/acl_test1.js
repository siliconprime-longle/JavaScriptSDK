describe("ACL", function () {

    it("Should set the public write access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicWriteAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.length === 0) {
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

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.length === 0)
                done();
            else
                throw "public read access set error"
        }, function () {
            throw "public read access save error";
        });

    });

    it("Should set the user write access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setUserWriteAccess("553903db6aafe5c41dc69732",true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.indexOf("553903db6aafe5c41dc69732") >= 0) {
                var user = new CB.CloudUser();
                user.set('username', 'vipul');
                user.set('password', 'abcd');
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

    });

    it("Should set the user read access", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setUserReadAccess("553903db6aafe5c41dc69732",true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.indexOf("553903db6aafe5c41dc69732") >= 0)
                done();
            else
                throw "user read access set error"
        }, function () {
            throw "user read access save error";
        });

    });

    it("Should allow users of role to write", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setRoleWriteAccess("553e194ac0cc01201658142e",true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.write.indexOf("553e194ac0cc01201658142e")>=0)
                done();
            else
                throw "user role write access set error"
        }, function () {
            throw "user role write access save error";
        });

    });

    it("Should allow users of role to read", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudObject('student4');
        obj.ACL.setRoleReadAccess("553e194ac0cc01201658142e",true);
        obj.save().then(function(list) {
            acl=list.get('ACL');
            if(acl.read.indexOf("553e194ac0cc01201658142e")>=0)
                done();
            else
                throw "user role read access set error"
        }, function () {
            throw "user role read access save error";
        });

    });
});

