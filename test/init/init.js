describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(100000);

        CB.CloudApp.init(CB.appId, CB.appKey);
            done();
    });
});
