describe("CloudRole", function () {

    it("Should Retrieve new user", function (done) {

        this.timeout(10000);
        var role = new CB.CloudRole('admin');
        CB.CloudRole.getRole(role).then(function(list){
            done();
        },function(){
            throw "Should retrieve the cloud role";
        });
    });



});