var Axios = require('axios');
var csv=require('csvtojson');
var q = require('q');
describe("Export Table",function(done){
 
 before(function(){
        this.timeout(10000);
        CB.appKey = CB.masterKey;
    });
    var savedObject = [];
    it("should create a table",function(done){

        this.timeout(50000);

        var obj = new CB.CloudTable('Hospital');
        var Revenue = new CB.Column('Revenue');
        Revenue.dataType = 'Number';
        var Name = new CB.Column('Name');
        Name.dataType = 'Text';
        obj.addColumn(Revenue);
        obj.addColumn(Name);
        obj.save().then(function(res){
            done();
        },function(err){
            throw err
        });
    });



    it("should add data to table",function(done){

        this.timeout(50000);
        var obj = new CB.CloudObject('Hospital');
        obj.set('Revenue', 1234);
        obj.set('Name', 'kashish');
        obj.save({
            success : function(obj){
              savedObject.push(obj)
                done();
            },error : function(error){
                done(error);
            }
        });   
    })


    it("Export table",function(done){
        this.timeout(50000);
        Axios.post("http://localhost:4730/export/"+CB.appId+"/Hospital",{
            formatType:"csv",
            appKey:CB.appKey
        }).then(function(data){
            if(data.data){
               done();
            } else {
                done('ERROR')
            }

        },function(err){
            done(err)
        })
    })
});
       