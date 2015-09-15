describe("Fyipe",function(done){

    it("should save",function(done){

        this.timeout(10000);
        CB.appId = 'fyipeprod';
        CB.appKey = 'yKAl1o8JHr8h+wu8S17dFPzEcQMJ7Y8F1rMkkVECeWk=';
        var user = new CB.CloudUser();
        var location = new CB.CloudObject('Location');
        var group = new CB.CloudObject('Group');
        user.username = util.makeString();
        user.email = util.makeEmail();
        user.password = 'pass';
        location.set('city',util.makeString());
        group.set('location',location);
        group.set('members',[user]);
        group.save().then(function(res){
            console.log(res);
            done();
        },function(err){
            console.log(err);
            throw "Unable to Save";
        });
    });
});