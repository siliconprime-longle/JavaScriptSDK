describe("Inlcude in CloudSearch", function (done) {

    it("should include a relation on search.", function (done) {

        this.timeout(35000);

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

                //Wait for elastic search to index
                setTimeout(function(){ 

                    cs.search().then(function(list){ 

                        if(list && list.length>0){

                            var isSuccessfullJoin=true;

                            for(var i=0;i<list.length;i++){

                                var student_obj=list[i].get('newColumn7');

                                if(Object.keys(student_obj.document).length >3) {
                                    if (!student_obj.get('name')){
                                        isSuccessfullJoin=false;
                                        break;
                                    }
                                } else{
                                    isSuccessfullJoin=true;
                                }
                            }

                            if(isSuccessfullJoin){
                                done();
                            }else{
                                done("Unsuccessful Join");
                            }

                        }else{
                            done("Cannot retrieve a saved relation.");
                        }

                    }, function(error){
                        done(error);                    
                    });

                }, 4000);

            }, error : function(error){
                done(error);
            }

        });

    });
});