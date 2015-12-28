describe("Cloud App", function() {
    
    it("Change the Server URL", function(done) {
        this.timeout(100000);
        var appId = util.makeString();
        var url = URL+'/server/url';
        var params = {};
        params.secureKey = SECURE_KEY;
        params.url = URL;

       $.ajax({
 
		    // The URL for the request
		    url: url,
		 
		    // The data to send (will be converted to a query string)
		    data: params,
		 
		    // Whether this is a POST or GET request
		    type: "POST",
		 
		    // The type of data we expect back
		    dataType : "json",
		 
		    // Code to run if the request succeeds;
		    // the response is passed to the function
		    success: function( json ) {
		       done();
		    },
		 
		    // Code to run if the request fails; the raw request and
		    // status codes are passed to the function
		    error: function( xhr, status, errorThrown ) {
		        done("Error thrown.");
		    },
		 
		});


    });


    it("should create the app and init the CloudApp.", function(done) {
        this.timeout(100000);
        var appId = util.makeString();
        var url = URL+'/app/'+appId;
        var params = {};
        params.secureKey = SECURE_KEY;

       $.ajax({
 
		    // The URL for the request
		    url: url,
		 
		    // The data to send (will be converted to a query string)
		    data: params,
		 
		    // Whether this is a POST or GET request
		    type: "POST",
		 
		    // The type of data we expect back
		    dataType : "json",
		 
		    // Code to run if the request succeeds;
		    // the response is passed to the function
		    success: function( json ) {
		       CB.CloudApp.init(URL, json.appId, json.keys.js);
		       CB.masterKey = json.keys.master;
		       CB.jsKey = json.keys.js;
		       done();
		    },
		 
		    // Code to run if the request fails; the raw request and
		    // status codes are passed to the function
		    error: function( xhr, status, errorThrown ) {
		        done("Error thrown.");
		    },
		 
		});


    });
});
