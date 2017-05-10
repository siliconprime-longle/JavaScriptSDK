
describe("Export Table",function(){
 
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
              savedObject.push(obj.document)
                done();
            },error : function(error){
                done(error);
            }
        });   
    })
    it("should add data to table",function(done){

        this.timeout(50000);
        var obj = new CB.CloudObject('Hospital');
        obj.set('Revenue', 3453);
        obj.set('Name', 'kash');
        obj.save({
            success : function(obj){ 
              savedObject.push(obj.document)
                done();
            },error : function(error){
                done(error);
            }
        });   
    })


     it("Export table",function(done){
        this.timeout(50000);
        var url = CB.apiUrl+ "/export/"+CB.appId+"/Hospital"; 
        CB._request('POST',url,{exportType:"json",key:CB.appKey}).then(function(data){
            
            data = JSON.parse(data).data
            if(data.length !== savedObject.length)
            {
                return done('ERROR')
            }
            var flag = false;
            for(let i in savedObject)
            {        
                delete savedObject[i].ACL;
                delete data[i].ACL;
                if(equal(data[i],savedObject[i])){
                    flag = true;
                }
                if(!flag){
                    done('ERROR');
                    break;
                }
            }
            if(flag){
                done();
            }
        },function(err){
            done(err)
        })
    })   
});
       