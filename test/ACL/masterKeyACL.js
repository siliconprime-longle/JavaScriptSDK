describe("MasterKey ACL", function () {

     before(function(){
        CB.appKey = CB.masterKey;
      });


    it("Should save an object with master key with no ACL access.", function (done) {

        this.timeout(50000);

        var obj = new CB.CloudObject('student4');
        obj.ACL = new CB.ACL();
        obj.ACL.setPublicReadAccess(false);
        obj.ACL.setPublicWriteAccess(false);
        
        obj.save().then(function(obj) {

            if(obj.id){
                 obj.set('age',19);        
                 obj.save().then(function(obj) {
                    if(obj.id){
                        done();
                    }else{
                        done("Obj did not save.");
                    }
                }, function (error) {
                    done(error);
                });
            }else{
                done("Obj did not save.");
            }
        
        }, function (error) {
           done(error);
        });
    });

     after(function(){
        CB.appKey = CB.jsKey;
     });

});

