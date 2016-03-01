describe("CloudObjectExpires", function () {

    it("should save a CloudObject after expire is set", function (done) {

        this.timeout(20000);
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.save().then(function(obj1) {
            done();
        }, function (err) {
            console.log(err);
            throw "Cannot save an object after expire is set";
        });

    });

    it("objects expired should not show up in query", function (done) {


        this.timeout(20000);
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.save().then(function(obj1) {
            done();
        }, function (err) {
            console.log(err);
            throw "Cannot save an object after expire is set";
        });
        var curr=new Date().getTime();
        var query1 = new CB.CloudQuery('student1');
        query1.equalTo('name','vipul');
        var query2 = new CB.CloudQuery('student1');
        query2.lessThan('age',12);
        var query =  CB.CloudQuery.or(query1,query2);
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    if(list[i].expires > curr || !list[i].expires){
                            break;
                        }
                    else{
                        throw "Expired Object Retrieved";
                    }
                }
                done();
                }else{
                    done();
            }

        }, function(error){
            done(error);
        })

    });

     it("objects should show up in query if expires is set at a future date.", function (done) {

        this.timeout(20000);

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 10);
        
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.expires = tomorrow;
        obj.save().then(function(obj1) {
            var query = new CB.CloudQuery('student1');
            query.findById(obj1.id).then(function(obj){
               if(obj){
                done("Object found");
               }else{
                done();
               }
            }, function(error){
                done(error);
            });
        }, function (err) {
            done(err);
        });        

    });


    it("objects expired should not show up in Search", function (done) {

        this.timeout(20000);
        var curr=new Date().getTime();
        var query = new CB.CloudSearch('student1');
        
        var searchFilter1 = new CB.SearchFilter();
        searchFilter1.equalTo('name','vipul');

        var searchFilter2 = new CB.SearchFilter();
        searchFilter2.lessThan('age',12);

        var searchFilter = new CB.SearchFilter();
        searchFilter.or(searchFilter1);
        searchFilter.or(searchFilter2);

        query.searchFilter = searchFilter;
        
        query.search({
            success:function(list){
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].expires > curr || !list[i].expires) {
                        break;
                    }
                    else {
                        throw "expired object retrieved in Search";
                    }
                }
                done();
            }else{ done();
            }
            },error: function(error){
                throw "should not show expired objects";
            }
            });

    });
});