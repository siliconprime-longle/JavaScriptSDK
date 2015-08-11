describe("Cloud Table", function(){
	
	before(function(){
    	CB.appKey = 'Qopoy/kXd+6G734HsjQMqGPGOvwEJYmBG84lQawRmWM=';
  	});
  	
    it("should not create duplicate table",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table');
        obj.save().then(function(){
            done("should not create duplicate table");
        },function(){
            done();
        });
    });

    it("should first create a table and then delete that table",function(done){
        this.timeout(20000);
        var tableName = util.makeString();
        var obj = new CB.CloudTable(tableName);
        obj.save().then(function(newTable){
          CB.CloudTable.delete(newTable).then(function(){
              done();
          },function(){
              done("should have delete the table");
          });
        },function(){
            done("should have create the table");
        });

    });
	
	/*it("should add a column to an existing table",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table2');
        CB.CloudTable.get(obj).then(function(table){
        	var column1 = new CB.Column('city', 'Text', true, false);
		    table.addColumn(column1);
		    table.save().then(function(table){
		          done();
		    });
        },function(){
            done("should fetch the table");
        });
        
    });*/
    
	it("should add a column to the table after save.",function(done){
        this.timeout(20000);
        var tableName = util.makeString();
        var table = new CB.CloudTable(tableName);
        table.save().then(function(table){
            var column1 = new CB.Column('Name11', 'Text', true, false);
            table.addColumn(column1);
            table.save().then(function(newTable){
              done();
              CB.CloudTable.delete(newTable);
            });
        });
    });
    
    it("should get a table information",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Address');
        CB.CloudTable.get(obj).then(function(){
            done();
        },function(){
            done("should fetch the table");
        });
    });

    it("should get all tables from an app",function(done){
        this.timeout(20000);
        CB.CloudTable.getAll().then(function(table){
            done();
        },function(){
            done("should get the all table");
        });
    });

    it("should update new column into the table",function(done){
        this.timeout(20000);
		var tableName =  util.makeString();
        var obj = new CB.CloudTable(tableName);
       
        var column1 = new CB.Column('Name11', 'Relation', true, false);
        column1.relatedTo = 'Table2';
        obj.addColumn(column1);
        obj.save().then(function(newTable){
        	var column2 = new CB.Column('Name11');
        	newTable.deleteColumn(column2);
            newTable.save().then(function(table){
               done();
               CB.CloudTable.delete(table);
            },function(){
                done("should save the table");
              });
            },function(){
              done("should save the table");
        });
    });

    it("should not rename a table",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.name = "NewName";
          table.save().then(function(newTable){
              done( "should not renamed the table");
          }, function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not change type of table",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          table.type = "NewType";
          table.save().then(function(newTable){
              done( "should not change the type of a table");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not rename a column",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table2');
        CB.CloudTable.get(obj).then(function(table){
            table.columns[0].name = "abcd";
            table.save().then(function(){
                done("should not update the column name");
            },function(){
                done();
            });
        },function(){
            done("should fetch the table");
        });
    });

    it("should not change data type of a column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[0].dataType = "abcd";
          table.save().then(function(){
              done("should not update the column dataType");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not change unique property of a default column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[0].unique = false;
          table.save().then(function(){
              done("should not change unique property of a default column");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not change required property of a default column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[0].required = false;
          table.save().then(function(){
              done("should not change required property of a default column");
          },function(){
              done();
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should change unique property of a user defined column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          if(table.columns[5].unique)
            table.columns[5].unique = false;
          else
            table.columns[5].unique = true;
          table.save().then(function(newTable){
              if(newTable.columns[5].unique == table.columns[5].unique)
                done();
              else
                done("shouldchange unique property of a user defined column");
          },function(){
              done("shouldchange unique property of a user defined column");
          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should change required property of a user defined column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          if(table.columns[5].required)
            table.columns[5].required = false;
          else
            table.columns[5].required = true;

          table.save().then(function(newTable){
              if(newTable.columns[5].required == table.columns[5].required)
                done();
              else
                done("should change required property of a user defined column");
          },function(){
              done("should change required property of a user defined column");

          });
      },function(){
          done("should fetch the table");
      });
    });

    it("should not delete a default column of a table",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table2');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[2] = "";
          table.save().then(function(newTable){
              if(newTable.columns[2] != "createdAt")
                done("should change required property of a user defined column");
          },function(){
              done();
          });
      });
    });
    
    after(function() {
    	CB.appKey = '9SPxp6D3OPWvxj0asw5ryA==';
  	});

});
