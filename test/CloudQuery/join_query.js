describe("CloudQuery Include", function () {



    it("save a relation.", function (done) {

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

    it("should include a relation object when include is requested in a query.", function (done) {

        this.timeout(10000);

        var query = new CB.CloudQuery('Custom4');
        query.equalTo('Custom4.name','Vipul');
        query.include('newColumn7');
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    var student_obj=list[i].get('newColumn7');
                    for(var j=0;j<student_obj.length;j++)
                    {
                        if(!student_obj[j].document.name)
                        {
                            throw "Unsuccessful Join";
                        }
                    }
                }
                done();
            }else{
                throw "Cannot retrieve a saved relation.";
            }
        }, function(error){

        })

    });


});