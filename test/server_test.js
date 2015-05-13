describe("Server Check",function(){
    it("should check for localhost",function(done){
        var xmlhttp;
        this.timeout(10000);
        if(window.XMLHttpRequest){
          xmlhttp=new XMLHttpRequest();
        }
        else {
            xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
        }
        xmlhttp.open('GET','http://localhost:4730',true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == xmlhttp.DONE) {
                if (xmlhttp.status == 200) {
                    CB.appId = devappkey;
                    CB.appKey = '9SPxp6D3OPWvxj0asw5ryA==';
                    CB.serverUrl = 'http://localhost:4730';
                    CB.apiUrl = CB.serverUrl + '/api';
                    done();
                }
                else {
                    CB.appId = 'travis123';
                    CB.appKey = '6dzZJ1e6ofDamGsdgwxLlQ==';
                    done();

                }
            }
        }
    });
});