describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(500000);

        console.log('Invoked Init function');
        console.log(CB);

        CB.CloudApp.init(CB.appId, CB.appKey);

        console.log("+++++++++++++++++++ Loaded SDK +++++++++++++++++++++");
        console.log(CB);
        done();
    });
});
