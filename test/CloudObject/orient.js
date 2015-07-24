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

   /* it("should save list with relation",function(done){

        this.timeout(10000);
        var obj = new CB.CloudObject('Company');
        var obj1 = new CB.CloudObject('Employee');
        obj1.set('Name','abcd');
        var obj2 = new CB.CloudObject('Employee');
        obj2.set('Name','Vipul');
        obj.set('Employee',[obj1,obj2]);
        var obj3 = new CB.CloudObject('orientrelation');
        obj3.set('Name','relation');
        obj.set('Rel',obj3);
        obj.save().then(function(nobj){
            if(obj.get('List').length === 2 && obj.get('Rel').get('Name') === 'relation')
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
        var query = new CB.CloudQuery('Orient');
        query.equalTo('Rel.Name','vipul');
        query.find().then(function(list){
            console.log(list);
            done();
        },function(err){
            console.log(err);
            throw "Unable to Save the Object";
        });
    });*/

});