describe("CloudObjectExpires", function () {

    it("should save a CloudObject after expire is set", function (done) {

        this.timeout(10000);
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.expires=new Date().getTime();
        obj.isSearchable=true;
        obj.save().then(function(obj1) {
            if(obj1.get('expires'))
                done();
        }, function (err) {
            console.log(err);
            throw "Cannot save an object after expire is set";
        });

    });

    it("objects expired should not show up in query", function (done) {

        this.timeout(10000);
        var curr=new Date().getTime();
        var query1 = new CB.CloudQuery('student1');
        query1.equalTo('name','vipul');
        var query2 = new CB.CloudQuery('student1');
        query2.lessThan('age',12);
        var query =  CB.CloudQuery.or(query1,query2);
        delete query.query.$include;
        delete query.query.$or[0].$include;
        delete query.query.$or[1].$include;
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    if(list[i]._expires>curr || !list[i]._expires){
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

        })

    });


    it("objects expired should not show up in Search", function (done) {

        this.timeout(10000);
        var curr=new Date().getTime();
        var query1 = new CB.CloudSearch('student1');
        query1.equalTo('name','vipul');
       var query2 = new CB.CloudSearch('student1');
        query2.lessThan('age',12);
        var query = CB.CloudSearch.or(query1,query2);
        query.search({
            success:function(list){
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i]._expires > curr || !list[i]._expires) {
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