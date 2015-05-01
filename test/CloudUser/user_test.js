describe("CloudUser", function () {

   it("Should create new user", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudUser();
        var username = util.makeString();
        obj.set('username', username);
        obj.set('password','abcd');
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

    it('should logout the user',function (done){
        this.timeout(10000);
        CB.CloudUser.current.logOut().then(function(){
            done();
        },function(){
            throw "err";
        });
    });
   it("Should login user", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudUser();
        obj.set('username', 'vipul');
        obj.set('password','abcd');
        obj.logIn().then(function(list) {
            if(list.get("username") === "vipul")
                done();
        }, function () {
            throw "user login error";
        });

    });

   /*it("Should logout current user", function (done) {

        this.timeout(10000);
       CB.CloudUser.current.logOut().then(function(list){
                done();
                },function(){
                throw "user logout error";
            });
    });*/
    var role = new CB.CloudRole('admin');
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

        this.timeout(100000);

        var obj = new CB.CloudUser();
        var role = new CB.CloudRole('admin');
        obj.set('username', 'vipul');
        obj.set('password','abcd');
        obj.logIn().then(function(list) {
            role.save().then(function(role){
                list.addToRole(role).then(function(list){
                    done();
                },function(){
                    throw "user role set error";
                });
            }, function () {
                throw "user role error";
            });
        },function(){
            throw "role create error";
        })

    });

    it("Should check if role is assigned to user", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudUser();
        obj.set('username', 'vipul');
        obj.set('password','abcd');
        obj.logIn().then(function(list) {
            if(list.get('roles').length>0) {
                if (CB.CloudUser.current.isInRole(role)) {
                    done();
                }
                done();
            }else{
                throw "role assigned is not checked";

            }
        },function(){
            throw "role create error";
        });

    });

    it("Should remove role assigned role to user", function (done) {

        this.timeout(1000000);

        var obj = new CB.CloudUser();
        var role = new CB.CloudRole('admin');
        obj.set('username', 'vipul');
        obj.set('password','abcd');
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



});