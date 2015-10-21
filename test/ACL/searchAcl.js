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
            if(acl.document.read.allow.user.indexOf('all') === -1) {
             var cs = new CB.CloudSearch('student4');
                cs.searchQuery = new CB.SearchQuery();
                cs.searchQuery.searchOn('age',150);
                cs.search().then(function(list){
                    if(list.length>0)
                    {
                        for(var i=0;i<list.length;i++)
                            if(list[i].get('age') && list[i].ACL.document.read.allow.user.indexOf('all') === -1)
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

