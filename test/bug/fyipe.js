describe("Fyipe bug tests",function(done){

    var username = util.makeString();
    var passwd = "abcd";
    var user = new CB.CloudUser();

    it("Should create a user",function(done){
        this.timeout(10000);

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

    it("should do a query on user",function(done){

        this.timeout(10000);

        var query = new CB.CloudQuery('User');
        query.findById(user.get('id')).then(function(obj){
            console.log(obj);
            done();
        },function(err){
            console.log(err);
        });
    });

    it("should do a query on user",function(done){

        this.timeout(10000);

        var query = new CB.CloudQuery('User');
        query.equalTo('id',user.get('id'));
        query.find().then(function(obj){
            console.log(obj);
            done();
        },function(err){
            console.log(err);
        });
    });

    it("should do a query on user",function(done){

        this.timeout(10000);

        var query = new CB.CloudQuery('User');
        query.equalTo('username',user.get('username'));
        query.find().then(function(obj){
            console.log(obj);
            done();
        },function(err){
            console.log(err);
        });
    });


    it("should get records back from the table",function(done){
        this.timeout(10000);
        var obj = new CB.CloudObject('Custom6');
        obj.set('newColumn','name');
        obj.save().then(function(list){
            console.log(list);
            done();
        },function(){

        });
    });
    it("should get records back from the table",function(done){
        this.timeout(10000);
        var query = new CB.CloudQuery('Custom6');
        query.find().then(function(list){
            console.log(list);
            done();
        },function(){

        });
    });
});