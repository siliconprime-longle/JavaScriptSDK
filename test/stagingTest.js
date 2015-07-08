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
        this.timeout(10000);
        var xmlhttp;
        this.timeout(10000);
        var req = typeof(require) === 'function' ? require : null;
        // Load references to other dependencies
        if (typeof(XMLHttpRequest) !== 'undefined') {
            xmlhttp = XMLHttpRequest;
        } else if (typeof(require) === 'function' &&
            typeof(require.ensure) === 'undefined') {
            xmlhttp = req('xmlhttprequest').XMLHttpRequest;
        }
        CB.appId = 'sample123';
        CB.appKey = '9SPxp6D3OPWvxj0asw5ryA==';
        CB.serverUrl = 'http://stagingdataservices.azurewebsites.net';
        CB.socketIoUrl = CB.serverUrl;
        CB.apiUrl = CB.serverUrl + '/api';
        done();
    });
});

describe("Cloud App", function() {
    it("should init the CloudApp and SDK.", function(done) {
        this.timeout(100000);
        CB.CloudApp.init(CB.appId, CB.appKey);
            done();
    });
});

describe("CloudObjectExpires", function () {



    it("should save a CloudObject after expire is set", function (done) {

        this.timeout(10000);
        var obj = new CB.CloudObject('student1');
        obj.set('name', 'vipul');
        obj.set('age', 10);
        obj.expires=new Date().getTime();
        obj.isSearchable=true;
        obj.save().then(function() {
            done();
        }, function () {
            throw "Cannot save an object after expire is set";
        });

    });

    it("objects expired should not show up in query", function (done) {

        this.timeout(10000);
        var curr=new Date().getTime();
        var query1 = new CB.CloudQuery('student1');
        query1.equalTo('name','vipul');
        var query2 = new CB.CloudQuery('student1');
        query2.lessThan('age',12);
        var query =  CB.CloudQuery.or(query1,query2);
        delete query.query.$include;
        delete query.query.$or[0].$include;
        delete query.query.$or[1].$include;
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    if(list[i]._expires>curr || !list[i]._expires){
                            break;
                        }
                    else{
                        throw "Expired Object Retrieved";
                    }
                }
                done();
                }else{
                    done();
            }

        }, function(error){

        })

    });


    it("objects expired should not show up in Search", function (done) {

        this.timeout(10000);
        var curr=new Date().getTime();
        var query1 = new CB.CloudSearch('student1');
        query1.equalTo('name','vipul');
       var query2 = new CB.CloudSearch('student1');
        query2.lessThan('age',12);
        var query = CB.CloudSearch.or(query1,query2);
        query.search({
            success:function(list){
            if(list.length>0) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i]._expires > curr || !list[i]._expires) {
                        break;
                    }
                    else {
                        throw "expired object retrieved in Search";
                    }
                }
                done();
            }else{ done();
            }
            },error: function(error){
                throw "should not show expired objects";
            }
            });

    });
});