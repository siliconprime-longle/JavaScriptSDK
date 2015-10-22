describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(500000);
        CB.CloudApp.init(CB.appId, CB.appKey);
        console.log("Service URL :"+CB.serviceUrl);
        console.log("API URL :"+CB.apiUrl);	
        console.log("App ID : "+CB.appId);
        console.log("App Key : "+ CB.appKey);
        done();
    });
});
