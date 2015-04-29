describe("CloudQuery", function () {

    it("should index object for search", function () {
        var obj = new CB.CloudObject('Custom1');
        obj.set('description', 'wi-fi');
        obj.isSearchable = true;
        obj.save({
            success : function(obj){
                //now search on this object.
                console.log('Indexed Object for Search');
                done();
            },error : function(error){
                throw "should index cloud object";
            }
        });
    });

    it("should search indexed object", function () {
        var cs = new CB.CloudSearch('Custom1');
        cs.searchOn('description', 'wi-fi');
        cs.search({
            success : function(list){
                if(list.length>0){
                    done();
                }else{
                    throw "should search for indexed object";
                }
            },error : function(error){
                throw "should search for indexed object";
            }
        });
    });

    it("should search indexed object", function () {
        var cs = new CB.CloudSearch('Custom1');
        cs.searchOn('description', 'wi-fi');
        cs.search({
            success : function(list){
                if(list.length>0){
                    console.log('Searched Object Complete');
                    console.log(list);
                    incrementTestPassed();
                }else{
                    console.log('Error : Cloud Search Query : Cannot search for object');
                    incrementTestFailed();
                }
            },error : function(error){
                console.log('Error : Query for Cloud Search');
                console.log(error);
                incrementTestFailed();
            }
        });
    });

    it("should index test data",function(){
        var obj = new CB.CloudObject('Student');
        obj.set('description', 'This is nawaz');
        obj.set('age', 19);
        obj.set('name', 'Nawaz Dhandala');
        obj.set('class', 'Java');
        obj.isSearchable = true;
        obj.save({
            success : function(obj){
                //now search on this object.
                var obj = new CB.CloudObject('Student');
                obj.set('description', 'This is gautam singh');
                obj.set('age', 19);
                obj.set('name', 'Gautam Singh');
                obj.set('class', 'C#');
                obj.isSearchable = true;
                obj.save({
                    success : function(obj){
                        var obj = new CB.CloudObject('Student');
                        obj.set('description', 'This is ravi');
                        obj.set('age', 40);
                        obj.set('name', 'Ravi');
                        obj.set('class', 'C#');
                        obj.isSearchable = true;

                        obj.save({
                            success : function(obj){
                                //now search on this object.
                                done();

                                equalToTest();
                                notEqualToTest();
                                skipTest();
                                limitTest();
                                sortByAsc();
                                sortByDesc();
                                exists();
                                doesNotExist();

                                rangeTest();
                                rangeTest1();
                                rangeTest2();

                                orTest();
                                finalTest();
                            },error : function(error){
                                throw "should index data for search";
                            }
                        });
                    },error : function(error){
                        throw "index data error";
                    }
                });


            },error : function(error){
                throw "index data error";
            }
        });

    });
});