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
            xmlhttp = new xmlhttp();
        xmlhttp.open('GET','http://localhost:4730',true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == xmlhttp.DONE) {
                if (xmlhttp.status == 200) {
                    CB.appId = "sample123";
                    CB.appKey = "9SPxp6D3OPWvxj0asw5ryA==";
                    CB.masterKey = "Qopoy/kXd+6G734HsjQMqGPGOvwEJYmBG84lQawRmWM=";
                    CB.jsKey = CB.appKey;
                    CB.serverUrl = 'http://localhost:4730';
                    CB.serviceUrl = 'http://localhost:3000';
                    CB.socketIoUrl = CB.serverUrl;
                    CB.apiUrl = CB.serverUrl;
                    done();

                }
                else {
                    if(window.mochaPhantomJS){
                         console.log('RUNNING IN PHANTOM JS'); 
                         CB.serverUrl = 'http://stagingdataservices.azurewebsites.net';
                         CB.serviceUrl = 'http://stagingfrontendservice.azurewebsites.net';
                         CB.socketIoUrl = CB.serverUrl;
                         CB.apiUrl = CB.serverUrl;
                    }
                    CB.appId = 'travis123';
                    CB.appKey = '6dzZJ1e6ofDamGsdgwxLlQ==';
                    CB.jsKey = CB.appKey;
                    CB.masterKey = "Qopoy/kXd+6G734HsjQMqGPGOvwEJYmBG84lQawRmWM="
                    done();
                }
            }
        }
    });
});
