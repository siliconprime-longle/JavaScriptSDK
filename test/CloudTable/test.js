describe("Table Tests", function (done) {

    before(function(){
        CB.appKey = 'Qopoy/kXd+6G734HsjQMqGPGOvwEJYmBG84lQawRmWM=';
    });

    /*it("Should Give all the tables", function (done) {

        this.timeout(10000);

        CB.CloudTable.getAll().then(function(res){
           console.log(res);
            done();
        },function(){
            throw "Unable to get tables";
        });
    });*/

    it("Should Give all the tables", function (done) {

        this.timeout(10000);

        var obj = new CB.CloudTable('Sample2');
        CB.CloudTable.get(obj).then(function(res){
            for(var i=0;i<res.columns.length;i++){
                console.log(res.columns[i].name +' '+ res.columns[i].dataType +' '+ res.columns[i].relatedTo + ' unique: '+res.columns[i].unique + ' required: '+res.columns[i].required);
            }
            done();
        },function(){
            throw "Unable to get tables";
        });
    });
});