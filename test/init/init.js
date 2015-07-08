describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(500000);
        CB.CloudApp.init(CB.appId, CB.appKey);
        console.log("+++++++++++++++++++ Loaded SDK +++++++++++++++++++++");
        console.log(CB);
        console.log("++++++++++++++++++++ Socket IO +++++++++++++++++++++++++++")
        console.log(CB.io);
        done();
    });
});
