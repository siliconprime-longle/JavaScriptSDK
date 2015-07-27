describe("CloudObject - Encryption", function () {

    it("should encrypt passwords", function (done) {

        this.timeout(20000);
        
        var obj = new CB.CloudObject('User');
        obj.set('username',util.makeEmail());
        obj.set('password','password');
        obj.set('email',util.makeEmail());

        obj.save().then(function(obj){
            if(obj.get('password') !== 'password')
                done();
            else
                throw "Cannot encrypt";

        }, function(){
            throw "Cannot save a CloudObject";
        });

    });

});