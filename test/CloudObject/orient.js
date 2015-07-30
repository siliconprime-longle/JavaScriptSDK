describe("Graph DB",function(done){

    it("Should Create node",function(done){

        this.timeout(10000);

        var obj = new CB.CloudObject('Company');
        obj.set('Name','Progress');
        obj.save().then(function(nobj){
            if(nobj)
                done();
            else
                throw "unable to save";
        },function(err){
            console.log(err);
            throw "unable to save the object";
        });
    });
    it("should save a relation",function(done){

        this.timeout(10000);

        var obj = new CB.CloudObject('Employee');
        obj.set('Name','Anurag');
        var obj1 = new CB.CloudObject('Company');
        obj1.set('Name','CloudBoost');
        obj.set('Company',obj1);
        obj.save().then(function(nobj){
            if(nobj.get('Company').get('Name') === 'CloudBoost')
                done();
            else
                throw "Unable to save relation";
        },function(err){
            console.log(err);
            throw "Unable to save data";
        })
    });

    it("should save list of data",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Company');
        obj.set('Name',"CloudBoost");
        var obj1 = new CB.CloudObject('Employee');
        obj1.set('Name','Ravi');
        var obj2 = new CB.CloudObject('Employee');
        obj2.set('Name','Ranjeet');
        obj.set('Employee',[obj1,obj2]);
        obj.save().then(function(nobj){
            if(obj.get('Employee').length === 2)
                done();
            else
                throw "Unable to Save Object";
        },function(err){
            console.log(err);
            throw "Unable to save data";
        });

    });

    it("Should update a saved Record",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Employee');
        obj.set('Name','Save');
        obj.save().then(function(nobj){
            nobj.set('Name','Update');
            nobj.save().then(function(nnobj){
                if(nnobj.get('Name') === 'Update')
                    done();
                else
                    throw "Object saved but not updated";
            },function(){
               throw "unable to update the document";
            });
        },function(){
            throw "Unable to save the record";
        })

    });

    it("should update a relation",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Employee');
        obj.set('Name','Anurag');
        var obj1 = new CB.CloudObject('Company');
        obj1.set('Name','CloudBoost');
        obj.set('Company',obj1);
        obj.save().then(function(nobj){
            if(nobj.get('Company').get('Name') === 'CloudBoost') {
                nobj.set('Company',null);
                nobj.save().then(function(fobj){
                    if(fobj.get('Company') === null)
                        done();
                },function(){
                    throw "Unable to save object";
                });
            }else
                throw "Unable to save relation";
        },function(err){
            console.log(err);
            throw "Unable to save data";
        })
    });

    it("should update the list of relation",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Company');
        var obj1 = new CB.CloudObject('Employee');
        obj1.set('Name','abcd');
        var obj2 = new CB.CloudObject('Employee');
        obj2.set('Name','Vipul');
        obj.set('Employee',[obj1,obj2]);
        var emp = [];
        emp.push(obj.get('Employee')[0]);
        obj.set('Employee',emp);
        obj.save().then(function(nobj){
            if(nobj.get('Employee').length === 1 && nobj.get('Employee')[0].get('Name') === 'abcd')
                done();
            else
                throw "Unable to Save Object";
        },function(err){
            console.log(err);
            throw "Unable to save data";
        });

    });

    it("Should query over relation",function(done){

        this.timeout(10000);
        var query = new CB.CloudQuery('Employee');
        query.equalTo('Company.Name','Progress');
        query.find().then(function(list){
            console.log(list);
            done();
        },function(err){
            console.log(err);
            throw "Unable to Save the Object";
        });
    });

});