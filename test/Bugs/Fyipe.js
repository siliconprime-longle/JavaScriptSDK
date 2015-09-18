describe("Fyipe",function(done){

    it("should save",function(done){

        this.timeout(10000);
        CB.appId = 'fyipeprod';
        CB.appKey = 'yKAl1o8JHr8h+wu8S17dFPzEcQMJ7Y8F1rMkkVECeWk=';
        var table = new CB.CloudTable('withdrawalRequest');
        table.save().then(function(res){
            done();
        },function(err){
            throw "Unable to Create table";
        });
    });
});