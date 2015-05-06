describe("Server Check",function(){
    it("should check for localhost",function(done){
        var xmlhttp;
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
                    CB.serverUrl = 'http://localhost:4730';
                    CB.apiUrl = CB.serverUrl+'/api';
                 done();
                }
                 else
                    done();
            }
        }
    });
});