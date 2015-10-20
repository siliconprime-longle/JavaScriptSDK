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
     			if(response.message === 'sample'){
     				done();
     			}
     			else{
     				done("Pushed but incorrect data");
     			}
     		}else{
     			done("Message pushed but response is not QueueMessage");
     		}
     	},error : function(error){
     		done(error);
     	}
     });
 });

 it("Should push an array into the queue",function(done){
 	 this.timeout(20000);

     var queue = new CB.CloudQueue(util.makeString());
     queue.push(['sample','sample2'],{
     	success : function(response){
     		if(response.constructor === Array && response.length === 2 && response[0] instanceof CB.QueueMessage && response[0].id && response[1] instanceof CB.QueueMessage && response[1].id){
     			done();
     		}else{
     			done("Message pushed but response is not QueueMessage");
     		}
     	},error : function(error){
     		done(error);
     	}
     });
 });

 it("Can push multiple messages into the same queue.",function(done){
 	 this.timeout(20000);

     var queue = new CB.CloudQueue(util.makeString());
     queue.push(['sample','sample2'],{
     	success : function(response){
     		if(response.constructor === Array && response.length === 2 && response[0] instanceof CB.QueueMessage && response[0].id && response[1] instanceof CB.QueueMessage && response[1].id){
     			//push again. 
     			 queue.push(['sample','sample2'],{
			     	success : function(response){
			     		if(response.constructor === Array && response.length === 2 && response[0] instanceof CB.QueueMessage && response[0].id && response[1] instanceof CB.QueueMessage && response[1].id){
			     			//push again. 
			     			done();
			     		}else{
			     			done("Message pushed but response is not QueueMessage");
			     		}
			     	},error : function(error){
			     		done(error);
			     	}
			     });

     		}else{
     			done("Message pushed but response is not QueueMessage");
     		}
     	},error : function(error){
     		done(error);
     	}
     });
 });

it("Should not push null data into the Queue",function(done){
     this.timeout(20000);
     try{

	     var queue = new CB.CloudQueue(util.makeString());
	     queue.push(null,{
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
	     done("Null inserted");
     }catch(e){
     	done();
     }
});

it("Should not create a queue with empty name",function(done){
     this.timeout(20000);
     try{
	     var queue = new CB.CloudQueue();
	     done("Null inserted");
     }catch(e){
     	done();
     }
});




});