describe("Query on Cloud Object Notifications ", function() {

	//Use Sample Table. 
	// -> Which has columns : 
	// name : string : required. 

    it("notification should work on equalTo Columns",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.equalTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample');
        obj.save();

    });

    it("should work on equalTo Columns : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.equalTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample1');
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);
    });


    it("should work on notEqualTo Columns : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notEqualTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample1');
        obj.save();

    });


     it("should work on notEqualTo Columns : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notEqualTo('name','Sample');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Sample');
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);
    });


    it("greaterThan : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("greaterThan : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });


    it("lessThan : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();
    });


    it("lessThan : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThan('age', 10);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });

    it("Exists : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.exists('age');

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("Exists : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.exists('name');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });

    it("doesNotExist : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.doesNotExists('name');

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("doesNotExist : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.doesNotExists('age');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });

    it("GTE : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThanEqualTo('age',11);

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("GTE : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.greaterThanEqualTo('age',9);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',8);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });


    it("LTE : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThanEqualTo('age',11);

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("LTE : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.lessThanEqualTo('age',9);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });

    it("containedIn : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containedIn('age',[11]);

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });

    it("containedIn : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containedIn('age',[9]);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });

    it("notContainedIn : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notContainedIn('age',[10]);

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });

    it("notContainedIn : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.notContainedIn('age',[9]);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });   

    it("containsAll : 1",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containsAll('age',[11]);

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',11);
        obj.save();
    });


    it("containsAll : 2",function(done){
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.containsAll('age',[8]);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });


    it("or : 1",function(done){
        
        this.timeout(30000);
        //create the query. 
        var query1 = new CB.CloudQuery('Student');
        query1.equalTo('age',8);

        var query2 = new CB.CloudQuery('Student');
        query2.equalTo('name','Nawaz');

        var query = CB.CloudQuery.or(query1, query2);

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',8);
        obj.save();
    });       

    it("or : 2",function(done){
        
        this.timeout(30000);
        //create the query. 
        var query1 = new CB.CloudQuery('Student');
        query1.equalTo('age',8);

        var query2 = new CB.CloudQuery('Student');
        query2.equalTo('name','Nawaz');

        var query = CB.CloudQuery.or(query1, query2);

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('age',9);
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });

    it("startsWith : 1",function(done){
        
        this.timeout(30000);
        //create the query. 
        var query = new CB.CloudQuery('Student');
        query.startsWith('name','N');       

        CB.CloudObject.on('Student', 'created', query, function(){
           done();
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','Nawaz');
        obj.save();
    });       

    it("startsWith : 2",function(done){
        
        this.timeout(30000);
      
        var query = new CB.CloudQuery('Student');
        query.startsWith('name','N');

        CB.CloudObject.on('Student', 'created', query, function(){
            CB.CloudObject.off('Student','created');
            done("Fired a wrong event");
        });

        //attach it to the event. 
        var obj = new CB.CloudObject('Student');
        obj.set('name','x');
        obj.save();

        setTimeout(function(){
            done();
        }, 10000);

    });                     
});