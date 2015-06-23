describe("FindOne", function () {

    it("Save a cloud object.", function (done) {

        this.timeout(10000);

        //create an object.
        var obj = new CB.CloudObject('Custom');
        obj.set('newColumn1','abcd');
        obj.save().then(function () {
            done();
        }, function () {
            throw "Relation Expire error";
        });

    });

    it("run a find one query",function(done){

        this.timeout(10000);

        var query = new CB.CloudQuery('Custom');
        query.equalTo('newColumn1','abcd');
        query.findOne().then(function(list){
            console.log(list);
            done();
        }, function (err) {
            console.log(err);
            throw "should return object";
        })
    });
});