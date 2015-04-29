describe("Cloud Objects Files", function() {
  
	var obj = new CB.CloudObject('Student');

     it("should save a file inside of an object", function(done) {

     this.timeout(10000);

       //save file first. 
      var afileparts = ['<a id="a"><b id="b">hey!</b></a>'];
      var omyblob = new Blob(afileparts, {type : 'text/html'}); // the blob

      var file = new CB.CloudFile(omyblob);

      file.save().then(function(file) {
         if(file.url){
          
           //create a new object.
           var obj = new CB.CloudObject('Sample');
           obj.set('name', 'sample');
           obj.set('file', file);

           obj.save().then(function(newobj){
             if(newobj.get('file') instanceof CB.CloudFile && newobj.get('file').url){
               done();
             }else{
               throw "object saved but didnot return file.";
             }
           }, function(error){
             throw "error saving an object.";
           });

         }else{
           throw "upload success. but cannot find the url.";
         }
       }, function(err) {
         console.log(err);
         throw "error uploading file";
       });

     });

    it("should save an array of files.", function(done) {
     this.timeout(10000);
     //save file first. 
     var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
     var oMyBlob = new Blob(aFileParts, {type : 'text/html'}); // the blob

     var file = new CB.CloudFile(oMyBlob);

     file.save().then(function(file) {
        if(file.url){
          
         var aFileParts = ['<a id="a"><b id="b">hey!</b></a>'];
         var oMyBlob = new Blob(aFileParts, {type : 'text/html'}); // the blob

         var file1 = new CB.CloudFile(oMyBlob);

         file1.save().then(function(file1) {
            if(file1.url){
              
              //create a new object.
              var obj = new CB.CloudObject('Sample');
              obj.set('name', 'sample');
              obj.set('fileList', [file, file1]);

              obj.save().then(function(newObj){
                  done();
              }, function(error){
                throw "Error Saving an object.";
              });

            }else{
              throw "Upload success. But cannot find the URL.";
            }
          }, function(err) {
            console.log(err);
            throw "Error uploading file";
          });

        }else{
          throw "Upload success. But cannot find the URL.";
        }
      }, function(err) {
        console.log(err);
        throw "Error uploading file";
      });
    });

    it("should save an object with unsaved file.", function(done) {
      done();
    });

   

});