describe("App Tests",function(done){

    it("should create an App",function(done){

        this.timeout(10000);

        var url = CB.serviceUrl+'/user/signin';
        var params = {};
        params.email = 'hotcomputerworks@hot.xyz';
        params.password = 'sample';
        params = JSON.stringify(params);
        CB._request('POST',url,params,true).then(function(res) {
            res = JSON.parse(res);
            console.log(res);
            url = CB.serviceUrl+'/app/create';
            params = {};
            params.appId = util.makeString();
            params.name = util.makeString();
            params.userId = res._id;
            params = JSON.stringify(params);
            CB._request('POST',url,params,true).then(function(res){
                console.log(res);
                done();
            },function(){
               throw "unable to create App";
            });
        },function(){
            throw "unable to create App";
        });
    });
});