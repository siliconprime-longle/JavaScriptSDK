describe("Table Tests", function (done) {

    before(function(){
        CB.appKey = 'Qopoy/kXd+6G734HsjQMqGPGOvwEJYmBG84lQawRmWM=';
    });

    it("Should Give all the tables", function (done) {

        this.timeout(10000);

        CB.CloudTable.getAll().then(function(res){
           console.log(res);
            done();
        },function(){
            throw "Unable to get tables";
        });
    });

    it("Should Give all the tables", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudTable('Role');
        CB.CloudTable.get(obj).then(function(res){
            console.log(res);
            done();
        },function(){
            throw "Unable to get tables";
        });
    });

    after(function() {
        CB.appKey = '9SPxp6D3OPWvxj0asw5ryA==';
    });
});