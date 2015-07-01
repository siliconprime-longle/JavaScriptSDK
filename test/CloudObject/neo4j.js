describe("Cloud Object", function() {

    //Use Sample Table.
    // -> Which has columns :
    // name : string : required.
    it("save a document",function(done){
        this.timeout(10000);
        var obj = new CB.CloudObject('Custom4');
        obj.set('newColumn1','course');
        obj.save().then(function(res){
            console.log(res);
            if(obj.get('newColumn1')==='course')
                done;
            else
                throw "unable to save document";
        },function(err){
            console.log(err);
        });
    });

  /*  it("save a relation.", function (done) {

        this.timeout(10000);

        //create an object.
        var obj = new CB.CloudObject('Custom4');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        var obj2= new CB.CloudObject('student1');
        obj2.set('name', 'Nawaz');
        obje=[obj1,obj2];
        obj.set('newColumn7', obje);
        obj.save().then(function() {
            done();
        }, function () {
            throw "Relation Save error";
        });

    });
*/

});
