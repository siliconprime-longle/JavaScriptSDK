var Axios = require('axios')
var FormData = require('form-data');
var path = require('path');


describe("Import Table",function(done){
 
 before(function(){
        this.timeout(10000);
        console.log(CB.appKey)
        CB.appKey = CB.masterKey;
        
        console.log(CB.masterKey)
    });
    it("should create a table",function(done){

        this.timeout(50000);

        var obj = new CB.CloudTable('ok');
        obj.save().then(function(res){
            done();
        },function(err){
            throw err
        });
    });


    it("Import table",function(done){
        this.timeout(50000);

        var fs = require('fs');

        var CRLF = '\r\n';
        var form = new FormData();

        var options = {
            header: '--' + form.getBoundary() +
                    CRLF + 'Content-Disposition: form-data; name="file";'+  
                            'filename="bubbles.wgt"'+
                    CRLF + 'Content-Type: application/octet-stream' +
                    CRLF + CRLF
            };
            console.log(CB.appId)
        form.append('key',CB.appKey);  
        form.append('file',fs.readFileSync(path.join(__dirname,'/misc/exportedData.csv')),options);
        form.submit({
                host: 'localhost',
                port: '4730',
                path: "/import/"+CB.appId+"/ok"
                }, function(err, res) { 
                    if (err) done(err)
                        else done()
                });

    })

     it("Check Exist",function(done){
        this.timeout(50000);

        var query = new CB.CloudQuery("ok");
        query.equalTo('add','https://www.facebook.com/');
        query.equalTo('valid',false);
        query.equalTo('email','kash@mail.com')
        query.find({
          success: function(list) {
            if(list.length > 0){ console.log(list)
                done()
            } else done('Query failed to find objects')
          },
          error: function(error) {
            done(error)
          }
        });

   })
})
