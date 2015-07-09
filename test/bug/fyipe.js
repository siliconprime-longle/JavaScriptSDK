describe("Fyipe bug tests",function(done){

    var username = util.makeString();
    var passwd = "abcd";
    var user = new CB.CloudUser();

    /*it("Should create a user",function(done){
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

    it("should save",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('User');
        query.findById('dS0OgRAF').then(function(obj){
            console.log(obj);
            var obj1 = new CB.CloudObject('Feed');
            obj1.set('user',obj);
            obj1.set('information','akjdsad');
            obj1.set('free',null);
            obj1.set('profession',obj.get('profession'));
            obj1.set('location',obj.get('location'));
            obj1.set('price',5);
            obj1.save().then(function(obj2){
                console.log(obj2);
                done();
            },function(){
                console.log("err");
            })

        },function(){
            console.log(err);
        })
    });*/

    it("should get the relation",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Location');
        query.find().then(function(list){
            var query1 = new CB.CloudQuery('Group');
            var temp = {};
            temp._type = list[0]._type;
            temp._tableName = list[0]._tableName;
            temp._id = list[0]._id;
            query1.equalTo('Location',temp);
            query1.find().then(function(obj){
                console.log(obj);
                done();
            },function(){
                throw "unable to get the relation";
            })
        },function(){
           throw "should have get the relation back";
        });
    });
});