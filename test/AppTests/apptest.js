describe("App Tests",function(done){

    var appId = util.makeString();
    var name = util.makeString();

    it("should create an App",function(done){

        this.timeout(100000);

        var url = CB.serviceUrl+'/user/signin';
        console.log(CB.serviceUrl);
        var params = {};
        params.email = 'a@gmail.com';
        params.password = 'abcd';
        params = JSON.stringify(params);
        CB._request('POST',url,params,true).then(function(res) {
            res = JSON.parse(res);
            console.log(res);
            url = CB.serviceUrl+'/app/create';
            params = {};
            params.appId = appId;
            params.name = name;
            params.userId = res._id;
            params = JSON.stringify(params);
            CB._request('POST',url,params,true).then(function(res){
                res = JSON.parse(res);
                CB.appId = res.appId;
                CB.appKey = res.keys.js;
                CB.masterKey = res.keys.master;
                CB.jsKey = res.keys.js;
                console.log(res);
                done();
            },function(err){
               throw "unable to create App";
            });
        },function(){
            throw "unable to create App";
        });
    });

     it("",function(done){

         this.timeout(10000);

         CB.CloudApp.init(CB.appId,CB.appKey);
         CB.appKey = CB.masterKey;
            done();
     });

    it("should create a table",function(done){

        this.timeout(50000);

        var table = new CB.CloudTable('Tests');
        table.save().then(function(){
            done();    
        },function(){
            throw "Unable to create Table";
        });    

    });

    it("",function(done){

        this.timeout(1000);

        CB.appKey = CB.jsKey;
        done();
    });


    it("should save a record",function(done){

        this.timeout(20000);

        var obj = new CB.CloudObject('Tests');
        obj.save().then(function(res){
            done();
        },function(err){
            throw "Unable to Save";
        });
    });

});