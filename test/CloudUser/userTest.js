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