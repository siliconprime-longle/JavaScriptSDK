describe("Cloud Queue Tests", function() {

	//Use Sample Table. 
	// -> Which has columns : 
	// name : string : required

 it("Should push data into the Queue",function(done){

     this.timeout(20000);

     var queue = new CB.CloudQueue(util.makeString());
     queue.push('sample',{
     	success : function(response){
     		if(response instanceof CB.QueueMessage && response.id){
     			done();
     		}else{
     			done("Message pushed but response is not QueueMessage");
     		}
     	},error : function(error){
     		done(error);
     	}
     });

 });

//  it("Should pull message from the queue",function(done){

//      this.timeout(20000);

//      var queue = new CB.CloudQueue(util.makeString());
//      queue.push('sample',{


//      });

// });

// it("Should not push null data into the Queue",function(done){
//      this.timeout(20000);
// });




});