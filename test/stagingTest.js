var CB = require('../lib/cloudboost.js');
   var util = {
     makeString : function(){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	},	

	makeEmail : function(){
	    return this.makeString()+'@sample.com';
	}

   };

   

	
describe("Server Check",function(){
    it("should check for localhost",function(done){
        this.timeout(100000);
        var xmlhttp;
        var req = typeof(require) === 'function' ? require : null;
        // Load references to other dependencies
        if (typeof(XMLHttpRequest) !== 'undefined') {
            xmlhttp = XMLHttpRequest;
        } else if (typeof(require) === 'function' &&
            typeof(require.ensure) === 'undefined') {
            xmlhttp = req('xmlhttprequest').XMLHttpRequest;
        }
        CB.appId = 'travis123';
        CB.appKey = '6dzZJ1e6ofDamGsdgwxLlQ==';
        CB.serverUrl = 'http://stagingdataservices.azurewebsites.net';
        CB.socketIoUrl = CB.serverUrl;
        CB.apiUrl = CB.serverUrl + '/api';
        done();
    });
});

describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(500000);

        CB.CloudApp.init(CB.appId, CB.appKey);

        done();
    });
});

describe("Inlcude in CloudSearch", function (done) {

    it("should include a relation on search.", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'text');

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        obj.set('newColumn7', obj1);
    
        obj.save({
            success : function(obj){

                var cs = new CB.CloudSearch('Custom2');
                cs.searchFilter = new CB.SearchFilter();
                cs.searchFilter.include('newColumn7');
                cs.searchFilter.equalTo('id',obj.id);
                cs.search().then(function(list){

                    if(list.length>0){
                        for(var i=0;i<list.length;i++){
                            console.log('LIST');
                            console.log(list[0]);
                            var student_obj=list[i].get('newColumn7');
                            console.log('Student');
                            console.log(student_obj);
                            if(!student_obj.get('name'))
                                throw "Unsuccessful Join";
                            else
                                done();
                        }    
                    }else{
                        throw "Cannot retrieve a saved relation.";
                    }
                }, function(error){
                    throw "Unsuccessful join"
                });
            }, error : function(error){
                throw "Cannot save a CloudObject";

            }

        });

    });
});