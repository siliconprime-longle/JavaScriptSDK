var Axios = require('axios');
var csv=require('csvtojson');
var q = require('q');
describe("Export Table",function(done){
 
 before(function(){
        this.timeout(10000);
        CB.appKey = CB.masterKey;
    });

    function convertToJSON(data){
        var def = q.defer()
        arr =[]; 

          csv()
       .fromString(data)
       .on('json', (json) => {
           arr.push(json)
       })
       .on('done',(error)=>{
           if(error) def.reject(error)
           def.resolve(arr)
       })

       return def.promise  
    }
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
                
               // convertToJSON(data.data).then(function(csvObject){
               
               // csvObject = csvObject[0]
               // savedObject= savedObject[0].document;

               // var csvObjectKeys = Object.keys(csvObject);
               // var savedObjectKeys = Object.keys(savedObject)
               // var objectsEqual = true;
               // if(savedObjectKeys.length !== csvObjectKeys.length)
               // {
               //   objectsEqual = false;
               // }
               // if(null=='')
               // {
               // console.log('f')
               // }

               // console.log(savedObject)
               // console.log('================================================')
               // console.log(csvObject)
               //console.log(csvObject[csvObjectKeys[0]])
               // for(let j =0;j<csvObjectKeys.length;j++)
               // { var csvKey = csvObjectKeys[j];
               //   var savedKey = savedObjectKeys[j];


               //   // if(csvObject[csvKey] !== savedObject[savedKey])
               //   // {
               //   //    objectsEqual = false;
               //   // }
               //   console.log(savedObject[savedKey])
                
               // }
              //for()
                
              // if( JSON.stringify(csvObject) === JSON.stringify(savedObject) )
              //   {console.log(csvObject) ;
              //       done()
              //   }
               done();
            //}
                
                // },function(error){
                //     done('ERROR')
                // })
            } else {
                done('ERROR')
            }

        },function(err){
            done(err)
        })
    })
});
       