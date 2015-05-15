describe("Cloud Files", function() {
 
    it("should save a new file", function(done) {

     this.timeout(10000);
     var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
     try {
         var oMyBlob = new Blob(aFileParts, {type: "text/html"});
     } catch (e) {
         var phantom = require('phantomjs');
         console.log(phantom);
         var builder = new WebKitBlobBuilder();
         builder.append(aFileParts);
         var oMyBlob = builder.getBlob();
     }
        var file = new CB.CloudFile(descriptor);
        console.log(file);
     file.save().then(function(file) {
        if(file.url){
          done();
        }else{
          throw "Upload success. But cannot find the URL.";
        }
      }, function(err) {
         console.log(err);
        throw "Error uploading file";
      });
    });

  /*  it("should delete a file", function(done) {

     this.timeout(15000);
     var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
     try {
          var oMyBlob = new Blob(aFileParts, {type: "text/html"});
     } catch (e) {
         var builder = new WebKitBlobBuilder();
         builder.append(aFileParts);
         var oMyBlob = builder.getBlob();
     }
     var file = new CB.CloudFile(oMyBlob);

     file.save().then(function(file) {
      if(file.url){
        //received the blob's url
        file.delete().then(function(file) {
          if(file.url === null) {
            done();
          } else {
            throw "File deleted, url in SDK not deleted";
          }
        }, function(err) {
          throw "Error deleting file";
        })
      }else{
        throw "Upload success. But cannot find the URL.";
      }
    }, function(err) {
      throw "Error uploading file";
    });
   });*/

    //add ACL on CloudFiles.
    
});