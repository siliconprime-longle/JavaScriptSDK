describe("Server Check",function(){
    it("should check for localhost",function(done){
        CB.appId = "sample123";
        CB.appKey = "Yl90vim4+OP2y1XPUxIpyQ==";
        CB.masterKey = "moHO7IQRlec3t5pbN6xet/1a9RCrlItqbGROyZHW7fw=";
        CB.jsKey = CB.appKey;
        CB.serverUrl = 'http://localhost:4730';
        CB.serviceUrl = 'http://localhost:3000';
        CB.socketIoUrl = CB.serverUrl;
        CB.apiUrl = CB.serverUrl;
        done();
    });
});
