describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
              CB.CloudApp.init('sample123', '9SPxp6D3OPWvxj0asw5ryA==').then(function(){
				    done();
		  }, function(error){
                  throw 'sdk init failed';
				//should.fail('SDK Init Failed');
		  }); 
    });
});


