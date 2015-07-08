describe("Server Check",function(){
    it("should check for localhost",function(done){
        this.timeout(10000);
        var xmlhttp;
        this.timeout(10000);
        var req = typeof(require) === 'function' ? require : null;
        // Load references to other dependencies
        if (typeof(XMLHttpRequest) !== 'undefined') {
            xmlhttp = XMLHttpRequest;
        } else if (typeof(require) === 'function' &&
            typeof(require.ensure) === 'undefined') {
            xmlhttp = req('xmlhttprequest').XMLHttpRequest;
        }
        CB.appId = 'sample123';
        CB.appKey = '9SPxp6D3OPWvxj0asw5ryA==';
        CB.serverUrl = 'http://stagingdataservices.azurewebsites.net';
        CB.socketIoUrl = CB.serverUrl;
        CB.apiUrl = CB.serverUrl + '/api';
        done();
    });
});
