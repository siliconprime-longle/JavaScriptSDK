describe("Cloud Queue Tests", function() {

	//Use Sample Table. 
	// -> Which has columns : 
	// name : string : required

 it("Should push data into the Queue",function(done){

     this.timeout(30000);

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

 it("Should create the Queue",function(done){

     this.timeout(30000);
     var name = util.makeString();
     var queue = new CB.CloudQueue(name);
     queue.create({
          success : function(response){
               if(response instanceof CB.CloudQueue && response.name){
                    if(response.name === name && response.createdAt && response.updatedAt){
                         done();
                    }
                    else{
                         done("Incorrect data");
                    }
               }else{
                    done("Didnot create queue");
               }
          },error : function(error){
               done(error);
          }
     });
 });

 it("Should push an array into the queue",function(done){
 	 this.timeout(30000);

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
 	 this.timeout(30000);

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
     this.timeout(30000);
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
     this.timeout(30000);
     try{
	     var queue = new CB.CloudQueue();
	     done("Null inserted");
     }catch(e){
     	done();
     }
});

it("Should push and pull data from the queue.",function(done){

     this.timeout(30000);

     var queue = new CB.CloudQueue(util.makeString());
     var message = new CB.QueueMessage('sample');
     //message.delay = 3000;
     queue.push(message,{
          success : function(response){
               if(response instanceof CB.QueueMessage && response.id){
                    if(response.message === 'sample'){
                         //now pull it. 
                         queue.pull({
                              success : function(message){
                                   if(message.message === 'sample'){
                                        done();
                                   }
                              }, error : function(error){
                                   done(error);
                              }
                         });
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

it("Should peek.",function(done){

     this.timeout(30000);

     var queue = new CB.CloudQueue(util.makeString());
     var message = new CB.QueueMessage('sample');
     //message.delay = 3000;
     queue.push(message,{
          success : function(response){
               if(response instanceof CB.QueueMessage && response.id){
                    if(response.message === 'sample'){
                         //now pull it. 
                         queue.peek({
                              success : function(message){
                                   if(message.message === 'sample'){
                                       //peek again. 
                                       queue.peek({
                                             success : function(message){
                                                  if(message.message === 'sample'){
                                                      done();
                                                  }
                                             }, error : function(error){
                                                  done(error);
                                             }
                                        });
                                   }
                              }, error : function(error){
                                   done(error);
                              }
                         });
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

it("Should get the messages in FIFO",function(done){

     this.timeout(30000);

     var queue = new CB.CloudQueue(util.makeString());
     var message = new CB.QueueMessage('sample1');
     //message.delay = 3000;
     queue.push(message,{
          success : function(response){
               if(response instanceof CB.QueueMessage && response.id){
                    if(response.message === 'sample1'){
                         var message = new CB.QueueMessage('sample2');
                         //message.delay = 3000;
                         queue.push(message,{
                              success : function(response){
                                   if(response instanceof CB.QueueMessage && response.id){
                                        if(response.message === 'sample2'){
                                             //now pull it. 
                                             queue.pull({
                                                  success : function(message){
                                                       if(message.message === 'sample1'){
                                                            queue.pull({
                                                                 success : function(message){
                                                                      if(message.message === 'sample2'){
                                                                           done();
                                                                      }
                                                                 }, error : function(error){
                                                                      done(error);
                                                                 }
                                                            });
                                                       }
                                                  }, error : function(error){
                                                       done(error);
                                                  }
                                             });
                                            
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

it("Should peek 2 messages at the same time.",function(done){

     this.timeout(30000);

     var queue = new CB.CloudQueue(util.makeString());
     var message = new CB.QueueMessage('sample1');
     //message.delay = 3000;
     queue.push(message,{
          success : function(response){
               if(response instanceof CB.QueueMessage && response.id){
                    if(response.message === 'sample1'){
                         var message = new CB.QueueMessage('sample2');
                         //message.delay = 3000;
                         queue.push(message,{
                              success : function(response){
                                   if(response instanceof CB.QueueMessage && response.id){
                                        if(response.message === 'sample2'){
                                             //now pull it. 
                                             queue.peek(2, {
                                                  success : function(messages){
                                                      if(messages.length ===2 && messages[0].id && messages[1].id){
                                                            done();
                                                      }
                                                  }, error : function(error){
                                                       done(error);
                                                  }
                                             });
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


it("Should pull 2 messages at the same time.",function(done){

     this.timeout(30000);

     var queue = new CB.CloudQueue(util.makeString());
     var message = new CB.QueueMessage('sample1');
     //message.delay = 3000;
     queue.push(message,{
          success : function(response){
               if(response instanceof CB.QueueMessage && response.id){
                    if(response.message === 'sample1'){
                         var message = new CB.QueueMessage('sample2');
                         //message.delay = 3000;
                         queue.push(message,{
                              success : function(response){
                                   if(response instanceof CB.QueueMessage && response.id){
                                        if(response.message === 'sample2'){
                                             //now pull it. 
                                             queue.pull(2, {
                                                  success : function(messages){
                                                      if(messages.length ===2 && messages[0].id && messages[1].id){
                                                            done();
                                                      }
                                                  }, error : function(error){
                                                       done(error);
                                                  }
                                             });
                                            
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



it("Should not pull message with the delay ",function(done){

     this.timeout(30000);

     var queue = new CB.CloudQueue(util.makeString());
     var message = new CB.QueueMessage('sample');
     message.delay = 3000;
     queue.push(message,{
          success : function(response){
               if(response instanceof CB.QueueMessage && response.id){
                    if(response.message === 'sample'){
                         //now pull it. 
                         queue.pull({
                              success : function(message){
                                   if(!message){
                                        done();
                                   }
                                   else{
                                        done("Got the message inspite of the delay");
                                   }
                              }, error : function(error){
                                   done(error);
                              }
                         });
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

     it("should give an error if queue doesnot exists.",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var message = new CB.QueueMessage('sample');
          //message.delay = 3000;
          queue.pull({
               success : function(message){
                   done("Got the message");
               }, error : function(error){
                    done();
               }
          });
     });


     it("should not pull the same message twice. ",function(done){
         this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var message = new CB.QueueMessage('sample');
          queue.push(message,{
               success : function(response){
                    if(response instanceof CB.QueueMessage && response.id){
                         if(response.message === 'sample'){
                              //now pull it. 
                              queue.pull({
                                   success : function(message){
                                        if(message){
                                              queue.pull({
                                                  success : function(message){
                                                       if(!message){
                                                           done(); 
                                                       }else{
                                                            done("Got a message.")
                                                       }
                                                  }, error : function(error){
                                                       done(error);
                                                  }
                                             });
                                        }else{
                                             done("Cannot pull the message.")
                                        }
                                   }, error : function(error){
                                        done(error);
                                   }
                              });
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

     it("should be able to pull message after the timeout.",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var message = new CB.QueueMessage('sample');
          message.timeout =3; //1 sec
          queue.push(message,{
               success : function(response){
                    if(response instanceof CB.QueueMessage && response.id){
                         if(response.message === 'sample'){
                              //now pull it. 

                               queue.pull({
                                        success : function(message){
                                             if(message.message = 'sample'){
                                                  //pull it again.
                                                  setTimeout(function(){
                                                       queue.pull({
                                                            success : function(message){
                                                                 if(!message){
                                                                      done("Message is null");
                                                                 }
                                                                 if(message.message = 'sample'){
                                                                      done();
                                                                 }else{
                                                                      done("Cannot get the message");
                                                                 }
                                                            }, error : function(error){
                                                                 done(error);
                                                            }
                                                       });
                                                  },7000);
                                             }else{
                                                  done("Cannot get the message");
                                             }
                                        }, error : function(error){
                                             done(error);
                                        }
                                   });
                              
                             
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

     it("Should be able to pull messages after the delay.",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var message = new CB.QueueMessage('sample');
          message.delay =1; //1 sec
          queue.push(message,{
               success : function(response){
                    if(response instanceof CB.QueueMessage && response.id){
                         if(response.message === 'sample'){
                              //now pull it. 
                              setTimeout(function(){
                                   queue.pull({
                                        success : function(message){
                                             if(message.message = 'sample'){
                                                  done();
                                             }else{
                                                  done("Cannot get the message");
                                             }
                                        }, error : function(error){
                                             done(error);
                                        }
                                   });
                              },2000);
                             
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


     it("Should be able to get message with an id",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var message = new CB.QueueMessage('sample');
          message.delay =1; //1 sec
          queue.push(message,{
               success : function(response){
                    if(response instanceof CB.QueueMessage && response.id){
                         if(response.message === 'sample'){
                              //now pull it. 
                              
                              queue.getMessageById(response.id,{
                                   success : function(message){
                                        if(message.message = 'sample'){
                                             done();
                                        }else{
                                             done("Cannot get the message");
                                        }
                                   }, error : function(error){
                                        done(error);
                                   }
                              });
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

     it("Should get null when invalid message id is requested.",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var message = new CB.QueueMessage('sample');
          message.delay =1; //1 sec
          queue.push(message,{
               success : function(response){
                    if(response instanceof CB.QueueMessage && response.id){
                         if(response.message === 'sample'){
                              //now pull it. 
                              
                              queue.getMessageById("sample",{
                                   success : function(message){
                                        if(!message){
                                             done();
                                        }else{
                                             done("Got the wrong message");
                                        }
                                   }, error : function(error){
                                        done(error);
                                   }
                              });
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

     it("Should delete message with message id.",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var message = new CB.QueueMessage('sample');
          message.delay =1; //1 sec
          queue.push(message,{
               success : function(response){
                    if(response instanceof CB.QueueMessage && response.id){
                         if(response.message === 'sample'){
                              //now pull it. 
                              
                              queue.deleteMessage(response.id,{
                                   success : function(message){
                                        if(message!=null && message.id === response.id){
                                             done();
                                        }else{
                                             done("Error, Null  or wrong message returned.")
                                        }

                                   }, error : function(error){
                                        done(error);
                                   }
                              });
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

     it("Should delete message by passing queueMessage to the function",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var message = new CB.QueueMessage('sample');
          message.delay =1; //1 sec
          queue.push(message,{
               success : function(response){
                    if(response instanceof CB.QueueMessage && response.id){
                         if(response.message === 'sample'){
                              //now pull it. 
                              
                              queue.deleteMessage(response,{
                                   success : function(message){
                                        if(message!=null && message.id === response.id){
                                             done();
                                        }else{
                                             done("Error, Null  or wrong message returned.")
                                        }

                                   }, error : function(error){
                                        done(error);
                                   }
                              });
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

     it("Should not get the message after it was deleted",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var message = new CB.QueueMessage('sample');
          message.delay =1; //1 sec
          queue.push(message,{
               success : function(response){
                    if(response instanceof CB.QueueMessage && response.id){
                         if(response.message === 'sample'){
                              //now pull it. 
                              
                              queue.deleteMessage(response,{
                                   success : function(message){
                                        if(message!=null && message.id === response.id){
                                             
                                             queue.getMessageById(response.id, {
                                                  success : function(message){
                                                      if(!message)
                                                        done();
                                                       else
                                                        done("Received the message after it was deleted.");
                                                  }, error : function(error){
                                                       done(error);
                                                  }
                                             });

                                        }else{
                                             done("Error, Null  or wrong message returned.")
                                        }

                                   }, error : function(error){
                                        done(error);
                                   }
                              });
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

     it("Should add subscriber to the queue.",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var url = "http://sample.sample.com";
          queue.addSubscriber(url,{
               success : function(response){
                    if(response.subscribers.indexOf(url)>=0){
                         done();
                    }else{
                         done("subscribers not added to the queue");
                    }
               },error : function(error){
                    done(error);
               }
          });
     });

     it("Should multiple subscribers to the queue.",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var url = ["http://sample.sample.com","http://sample1.cloudapp.net"];
          queue.addSubscriber(url,{
               success : function(response){
                    for(var i=0;i<url.length;i++){
                         if(response.subscribers.indexOf(url[i])===-1){
                              done("Subscribers not added.");
                         }
                    }
                    done();
               },error : function(error){
                    done(error);
               }
          });
     });

     it("Should remove subscriber from the queue.",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var url ="http://sample1.cloudapp.net";
          queue.removeSubscriber(url,{
               success : function(response){
                    if(response.subscribers.indexOf(url)===-1){
                         done();
                    }else{
                         done("subscribers not added to the queue");
                    }
               },error : function(error){
                    done(error);
               }
          });
     });

     it("Should remove multiple subscriber from the queue.",function(done){
          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          var url =["http://sample1.cloudapp.net","http://sample2.cloudapp.net"];
          queue.removeSubscriber(url,{
               success : function(response){
                    for(var i=0;i<url.length;i++){
                         if(response.subscribers.indexOf(url[i])>=0){
                              done("Subscribers not removed.");
                         }
                    }
                    done();
               },error : function(error){
                    done(error);
               }
          });
     });

     it("Should not add subscriber with invalid URL.",function(done){
          this.timeout(30000);
          var queue = new CB.CloudQueue(util.makeString());
          var url = "sample.sample";
          queue.addSubscriber(url,{
               success : function(response){
                   done("Success called with invalid URL");
               },error : function(error){
                   done();
               }
          });
     });

     it("Should add a subscriber and then remove a subscriber from the queue.",function(done){
          this.timeout(30000);
          var queue = new CB.CloudQueue(util.makeString());
          var url = "https://sample.sample.com";
          queue.addSubscriber(url,{
               success : function(response){
                   if(queue.subscribers.length === 1){

                         queue.removeSubscriber(url,{
                              success : function(response){
                                  if(queue.subscribers.length === 0){
                                        done();
                                  }
                              },error : function(error){
                                  done("Failed to remove a subscriber");
                              }
                         });

                   }
               },error : function(error){
                   done("Failed to add a subscriber");
               }
          });
     });


     it("Should delete the queue.",function(done){
          this.timeout(30000);
          var queue = new CB.CloudQueue(util.makeString());
          queue.push("sample",{
               success : function(response){
                   if(response.id){
                       //now delete the queue. 
                       queue.delete({
                              success : function(response){
                                  if(response.name){
                                        //pull message from the queue. 
                                        queue.pull({
                                             success : function(response){
                                                 if(response.id){
                                                      done("Pulled message from the queue which is deleted.");
                                                 }else{     
                                                    done("Pulled message from deleted queue.");
                                                 }
                                             },error : function(error){
                                                 done();
                                             }
                                        });
                                  }else{     
                                     done("Failed to delete the queue.");
                                  }
                              },error : function(error){
                                  done("Failed to add a subscriber");
                              }
                         });
                   }else{
                      done("Failed to add the message.");
                   }
               },error : function(error){
                   done("Failed to add a subscriber");
               }
          });
     });

     it("Should clear the queue.",function(done){
          this.timeout(30000);
          var queue = new CB.CloudQueue(util.makeString());
          queue.push("sample",{
               success : function(response){
                   if(response.id){
                       //now delete the queue. 
                       queue.clear({
                              success : function(response){
                                  if(response.name){
                                        //pull message from the queue. 
                                        queue.pull({
                                             success : function(response){
                                                 if(response){
                                                      done("Pulled message from the queue which is deleted.");
                                                 }else{     
                                                    done();
                                                 }
                                             },error : function(error){
                                                 done("Error getting data");
                                             }
                                        });
                                  }else{     
                                     done("Failed to delete the queue.");
                                  }
                              },error : function(error){
                                  done("Failed to clear a message.");
                              }
                         });
                   }else{
                      done("Failed to add a message");
                   }
               },error : function(error){
                   done("Failed to add a message");
               }
          });
     });

     it("Should get the queue.",function(done){
          this.timeout(30000);
          var queue = new CB.CloudQueue(util.makeString());
          queue.push("sample",{
               success : function(response){
                   if(response.id){
                       //now delete the queue. 
                       queue.get({
                              success : function(response){
                                  if(response.id){
                                        //pull message from the queue. 
                                       done();
                                  }else{     
                                     done("Failed to get the queue.");
                                  }
                              },error : function(error){
                                  done("Failed to get the message.");
                              }
                         });
                   }else{
                      done("Failed to add  a message");
                   }
               },error : function(error){
                   done("Failed to add a message");
               }
          });
     });

      it("Should get the queue.",function(done){
          this.timeout(30000);
          var name = util.makeString();
          var queue = new CB.CloudQueue(name);
          queue.push("sample",{
               success : function(response){
                   if(response.id){
                       //now delete the queue. 
                       CB.CloudQueue.get(name,{
                              success : function(response){
                                  if(response.id){
                                        //pull message from the queue. 
                                       done();
                                  }else{     
                                     done("Failed to get the queue.");
                                  }
                              },error : function(error){
                                  done("Failed to get the message.");
                              }
                         });
                   }else{
                      done("Failed to add  a message");
                   }
               },error : function(error){
                   done("Failed to add a message");
               }
          });
     });

     it("Should not get the queue with null name", function(done){
          this.timeout(30000);
          var name = util.makeString();
          var queue = new CB.CloudQueue(name);
          queue.push("sample",{
               success : function(response){
                   if(response.id){
                    try{
                       //now delete the queue. 
                       CB.CloudQueue.get(null,{
                              success : function(response){
                                  if(response.id){
                                        //pull message from the queue. 
                                       done();
                                  }else{     
                                     done("Failed to get the queue.");
                                  }
                              },error : function(error){
                                  done("Failed to get the message.");
                              }
                         });
                       done("Error.")
                  }catch(e){
                    done();
                  }

                   }else{
                      done("Failed to add  a message");
                   }
               },error : function(error){
                   done("Failed to add a message");
               }
          });
     });

     it("Should get All Queues", function(done){
          this.timeout(30000);
          
          CB.CloudQueue.getAll({
               success : function(response){
                  if(response.length>0){
                    done();
                  }else{
                    done("Error getting queues.");
                  }
               },error : function(error){
                   done("Failed to add a message");
               }
          });
     });



     it("Should not get the queue which does not exist",function(done){
          this.timeout(30000);
          var queue = new CB.CloudQueue(util.makeString());
             queue.get({
                    success : function(response){
                       done("Got the queue which does not exist");
                    },error : function(error){
                        done();
                    }
               });
          });


     it("Should refresh message timeout with timeout specified. ",function(done){
          this.timeout(30000);
              var queue = new CB.CloudQueue(util.makeString());
              queue.push('sample',{
                 success : function(response){
                      if(response instanceof CB.QueueMessage && response.id){
                           if(response.message === 'sample'){
                                queue.refreshMessageTimeout(response,3600,{
                                success : function(response){
                                     if(response instanceof CB.QueueMessage && response.id){
                                          if(response.timeout === 3600){
                                               done();
                                          }
                                          else{
                                               done("Refreshed the timeout but didnot return the data.");
                                          }
                                     }else{
                                          done("Message pushed but response is not QueueMessage");
                                     }
                                },error : function(error){
                                     done(error);
                                }
                             });
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

     it("Should refresh message timeout wiht timeout NOT specified. ",function(done){
         this.timeout(30000);
         var queue = new CB.CloudQueue(util.makeString());
              queue.push('sample',{
                 success : function(response){
                      if(response instanceof CB.QueueMessage && response.id){
                           if(response.message === 'sample'){
                                queue.refreshMessageTimeout(response,{
                                success : function(response){
                                     if(response instanceof CB.QueueMessage && response.id){
                                          if(response.timeout === 1800){
                                               done();
                                          }
                                          else{
                                               done("Refreshed the timeout but didnot return the data.");
                                          }
                                     }else{
                                          done("Message pushed but response is not QueueMessage");
                                     }
                                },error : function(error){
                                     done(error);
                                }
                             });
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

     it("Should not refresh message timeout when message is pulled form the queue.",function(done){
            this.timeout(30000);
         var queue = new CB.CloudQueue(util.makeString());
              queue.push('sample',{
                 success : function(response){
                      if(response instanceof CB.QueueMessage && response.id){
                           if(response.message === 'sample'){
                              queue.pull({
                                     success : function(response){
                                          if(response instanceof CB.QueueMessage && response.id){
                                               queue.refreshMessageTimeout(response,{
                                                    success : function(response){
                                                         done("Error, Success called.")
                                                    },error : function(error){
                                                         done()
                                                    }
                                                 });
                                          }else{
                                               done("Message cant be pulled out of the queue.");
                                          }
                                     },error : function(error){
                                          done(error);
                                     }
                                  });
                                
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

     it("Should update the queue.",function(done){

          this.timeout(30000);

          var queue = new CB.CloudQueue(util.makeString());
          queue.push('sample',{
            success : function(response){
                 if(response instanceof CB.QueueMessage && response.id){
                      if(response.message === 'sample'){
                           //now change the type of the queue to push. 
                           queue.addSubscriber("https://www.google.com", {
                              success : function(){
                                   queue.type = "push";
                                     queue.update({
                                          success : function(response){
                                               if(response.type === "push"){
                                                  done();
                                               }else{
                                                   done("Error. Didnot update the queue.")
                                               }
                                          },error : function(error){
                                               done(error);
                                          }
                                        });
                              }, error : function(){
                                   done("Canot add subscriber to the queue");
                              }
                           });
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

     after(function(){
        CB.appKey = CB.jsKey;
     });
});