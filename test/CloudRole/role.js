describe("CloudRole", function () {
    var roleName = util.makeString();
    var role = new CB.CloudRole(roleName);
    it("Should create a role", function (done) {

        this.timeout(10000);
        console.log(role.ACL);
        role.save().then(function(list){
            console.log(list);
            if(!list)
                throw "Should retrieve the cloud role";
            done();
        },function(){
            throw "Should retrieve the cloud role";
        });
    });

    it("Should Retrieve a role", function (done) {
		
        this.timeout(10000);
        var query = new CB.CloudQuery('Role');
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
    
    it("Should not Retrieve a role", function (done) {
		
        this.timeout(10000);
        var role = new CB.CloudRole('abcd');
        CB.CloudRole.getRole(role).then(function(list){
        	console.log(list);
        	if(list)
        		throw "Should retrieve null";
            done();
        },function(){
            throw "Should retrieve the cloud role";
        });
    });


});
