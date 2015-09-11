describe("CloudRole", function (done) {
    var roleName = util.makeString();
    var role = new CB.CloudRole(roleName);
    it("Should create a role", function (done) {

        this.timeout(20000);

        role.save().then(function(list){
            console.log(list);
            if(!list)
                throw "Should create a role";
            done();
        },function(){
            throw "unable to create a role.";
        });
    });

    it("Should Retrieve a role", function (done) {
		
        this.timeout(20000);

        var query = new CB.CloudQuery('Role');
        if(!role.get('id')){
            done();
        }
        query.equalTo('id',role.get('id'));
        query.find().then(function(list){
        	console.log(list);
        	if(!list)
        		throw "Should retrieve the cloud role";
            done();
        },function(){
            throw "Should retrieve the cloud role";
        });
    });
});
