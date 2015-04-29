/*
 CloudFiles
 */

CB.CloudFile = CB.CloudFile || function(file) {

    if(!file)
        throw "File is null.";

    if (Object.prototype.toString.call(file) === '[object File]' || Object.prototype.toString.call(file) === '[object Blob]' ) {

        this.fileObj = file;

        this.document = {
            _type: 'file',
            name: (file && file.name && file.name !== "") ? file.name : 'unknown',
            size: file.size,
            url: '',
            contentType : (typeof file.type !== "undefined" && file.type !== "") ? file.type : 'unknown'
        };

    } else if(typeof file === "string") {
        if (file.match(/(((http|ftp|https):\/\/)|www\.)[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#!]*[\w\-\@?^=%&/~\+#])?/g)) {
            this.document = {
                _type: 'file',
                name: '',
                size: '',
                url: file,
                contentType : ''
            };
        } else {
            throw "Invalid File. It should be of type file or blob";
        }
    }
    else{
        throw "Invalid File. It should be of type file or blob";
    }
};

Object.defineProperty(CB.CloudFile.prototype, 'type', {
    get: function() {
        return this.document.contentType;
    },
    set: function(type) {
        this.document.contentType = type;
    }
});

Object.defineProperty(CB.CloudFile.prototype, 'url', {
    get: function() {
        return this.document.url;
    },
    set: function(url) {
        this.document.url = url;
    }
});

Object.defineProperty(CB.CloudFile.prototype, 'size', {
    get: function() {
        return this.document.size;
    },
    set: function(size) {
        this.document.size = size;
    }
});

Object.defineProperty(CB.CloudFile.prototype, 'name', {
    get: function() {
        return this.document.name;
    },
    set: function(name) {
        this.document.name = name;
    }
});

CB.CloudFile.prototype.save = function(callback) {

    var def;

    if (!callback) {
        def = new CB.Promise();
    }


    var thisObj = this;
    var formdata = new FormData();

    if(!this.fileObj)
        throw "You cannot save a file which is null";

    formdata.append("fileToUpload", this.fileObj);
    formdata.append("key", CB.appKey);

    var xmlhttp = CB._loadXml();
    var params=formdata;
    url = CB.serverUrl+'/file/' + CB.appId + '/upload' ;

    xmlhttp.open('POST',url,true);
    //  xmlhttp.setRequestHeader('Content-type','multipart/form-data');
    xmlhttp.send(params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                thisObj.url = JSON.parse(xmlhttp.responseText)._url;
                if (callback) {
                    callback.success(thisObj);
                } else {
                    def.resolve(thisObj);
                }
            } else {
                if (callback) {
                    callback.error(xmlhttp.responseText);
                } else {
                    def.reject(xmlhttp.responseText);
                }
            }
        }
    }


    if (!callback) {
        return def;
    }
}

CB.CloudFile.prototype.delete = function(callback) {

    var def;

    if(!this.url) {
        throw "You cannot delete a file which does not have an URL";
    }
    if (!callback) {
        def = new CB.Promise();
    }
    var thisObj = this;

    var xmlhttp= CB._loadXml();
    var params=JSON.stringify({
        url: thisObj.url,
        key: CB.appKey
    });
    url = CB.serverUrl+'/file/' + CB.appId + '/delete' ;

    xmlhttp.open('POST',url,true);
    xmlhttp.setRequestHeader('Content-type','application/json');
    xmlhttp.send(params);

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            if (xmlhttp.status == 200) {
                thisObj.url = null;
                if (callback) {
                    callback.success(thisObj);
                } else {
                    def.resolve(thisObj);
                }
            } else {
                if (callback) {
                    callback.error(xmlhttp.responseText);
                } else {
                    def.reject(xmlhttp.responseText);
                }
            }
        }
    }



    if (!callback) {
        return def;
    }
}
