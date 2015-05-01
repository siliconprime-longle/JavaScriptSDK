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

    it("save a Multi-Join.", function (done) {

        this.timeout(10000);

        //create an object.
        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'Course');
        var obj1 = new CB.CloudObject('student1');
        var obj2 = new CB.CloudObject('hostel');
        var obj3 = new CB.CloudObject('Custom3');
        obj3.set('address','progress');
        obj.set('newColumn2',obj3);
        obj2.set('room',509);
        obj1.set('name', 'Vipul');
        obj1.set('expires',null);
        obj.set('newColumn7', obj1);
        obj1.set('newColumn',obj2);
        obj.save().then(function() {
            done();
        }, function () {
            throw "Relation Save error";
        });

    });

    it("should include a relation object when include is requested in a query.", function (done) {

        this.timeout(10000);

        var query = new CB.CloudQuery('Custom2');
        query.include('newColumn7');
        query.include('newColumn7.newColumn');
        query.include('newColumn2');
        query.find().then(function(list){
            if(list.length>0){
                for(var i=0;i<list.length;i++){
                    var student_obj=list[i].get('newColumn7');
                    var room=student_obj.get('newColumn');
                    var address=list[i].get('newColumn2');
                    if(!student_obj.get('name') || !room.get('room') || !address.get('address'))
                        throw "Unsuccessful Join";
                }
                done();
            }else{
                throw "Cannot retrieve a saved relation.";
            }
        }, function(error){

        })

    });

});