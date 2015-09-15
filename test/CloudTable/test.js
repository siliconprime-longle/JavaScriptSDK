describe("Table Tests", function (done) {

    before(function(){
        CB.appKey = CB.masterKey;
    });

    it("Should Give all the tables", function (done) {

        this.timeout(30000);

        CB.CloudTable.getAll().then(function(res){
            done();
        },function(){
            throw "Unable to get tables";
        });
    });

    it("Should Give specific tables", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudTable('Role');
        CB.CloudTable.get(obj).then(function(res){
            done();
        },function(){
            throw "Unable to get tables";
        });
    });

    it("Should give table with tableName",function(done){

        this.timeout(10000);

        CB.CloudTable.get('Employee').then(function(res) {
            if(res){
                done();
            }else
                throw "Unable to Get table by name";
        },function(){
           throw "unable to get table by name";
        });
    });

    it("Should wait for other tests to run",function(done){

        this.timeout(100000);

        setTimeout(function(){
            done();
        },10000);
        
    });

    after(function() {
        CB.appKey = CB.jsKey;
    });

});