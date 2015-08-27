describe("Search Bugs",function(done){

	it("search for objects",function(){

		this.timeout(10000);

		var obj = new CB.CloudObject('Student');
		obj.set('name','bull');
		obj.save().then(function(){
			var search = new CB.CloudSearch('Student');
			//search.SearchFilter = new CB.SearchFilter();
			search.SearchQuery = new CB.SearchQuery();
			
			search.search().then(function(res){
				console.log(res);
				done();
			},function(){
				throw "Unable to DO Search";
			});				
		},function(){
			throw "Unable to save Object";
		});

	})
})