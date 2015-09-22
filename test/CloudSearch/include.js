describe("Inlcude in CloudSearch", function (done) {

    it("should include a relation on search.", function (done) {

        this.timeout(30000);

        var obj = new CB.CloudObject('Custom2');
        obj.set('newColumn1', 'text');

        var obj1 = new CB.CloudObject('student1');
        obj1.set('name', 'Vipul');
        obj.set('newColumn7', obj1);
    
        obj.save({
            success : function(obj){

                var cs = new CB.CloudSearch('Custom2');
                cs.searchFilter = new CB.SearchFilter();
                cs.searchFilter.include('newColumn7');
                cs.searchFilter.equalTo('id',obj.id);
                cs.search().then(function(  list){
                    done();
                    console.log(list);
                    if(list.length>0){
                        for(var i=0;i<list.length;i++){
                            console.log('LIST');
                            console.log(list[0]);
                            var student_obj=list[i].get('newColumn7');
                            console.log('Student');
                            console.log(student_obj);
                            if(Object.keys(student_obj.document).length >3) {
                                if (!student_obj.get('name'))
                                    throw "Unsuccessful Join";
                            } else
                                done();
                        }
                    }else{
                        throw "Cannot retrieve a saved relation.";
                    }
                }, function(error){
                    throw "Unsuccessful join"
                });
            }, error : function(error){
                throw "Cannot save a CloudObject";

            }

        });

    });
});