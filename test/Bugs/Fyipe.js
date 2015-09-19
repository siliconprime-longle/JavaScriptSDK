describe("Fyipe",function(done){

    it("should save",function(done){

        this.timeout(10000);
        CB.appId = 'fyipeprod';
        CB.appKey = 'yKAl1o8JHr8h+wu8S17dFPzEcQMJ7Y8F1rMkkVECeWk=';
        var obj = new CB.CloudQuery('Location');
        obj.find().then(function(res){
            console.log(res);
            done();
        },function(){
            throw "Unable to Get Data"
        });
    });
});