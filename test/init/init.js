describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
              CB.CloudApp.init(CB.appId, CB.appKey).then(function(){
				    done();
		  }, function(error){
                  throw 'sdk init failed';
				//should.fail('SDK Init Failed');
		  }); 
    });
});


