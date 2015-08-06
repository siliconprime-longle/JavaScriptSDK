describe("Cloud Table", function(){

    it("should not create duplicate table",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table');
        obj.save().then(function(){
            throw("should not create duplicate table");
        },function(){
            done();
        });
    });

    it("should first create a table and then delete that table",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table3');
        obj.save().then(function(){
          CB.CloudTable.delete(obj).then(function(){
              done();
          },function(){
              throw("should have delete the table");
          });
        },function(){
            throw("should have create the table");
        });

    });

    it("should get a table information",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Address');
        CB.CloudTable.get(obj).then(function(){
            done();
        },function(){
            throw("should fetch the table");
        });
    });

    it("should get all tables from an app",function(done){
        this.timeout(20000);
        CB.CloudTable.getAll().then(function(){
            done();
        },function(){
            throw("should get the all table");
        });
    });

    it("should update new column into the table",function(done){
        this.timeout(20000);

        var obj = new CB.CloudTable('Table12');
        CB.CloudTable.get(obj, {
          success: function(table){
            var column1 = new CB.Column('Name11', 'Relation', true, false);
            column1.relatedTo = 'Table2';
            table.addColumn(column1);
            table.save().then(function(newTable){
              var column2 = new CB.Column('Name11');
              newTable.deleteColumn(column2);
              newTable.save().then(function(){
                done();
              },function(){
                throw("should save the table");
              });
            },function(){
              throw("should save the table");
            });
          },
          error: function(err){
              throw("should fetch the table");
          }
        });
    });

    it("should not rename a table",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          table.name = "NewName";
          table.save().then(function(newTable){
              throw "should not renamed the table";
          }, function(){
              done();
          });
      },function(){
          throw("should fetch the table");
      });
    });

    it("should not change type of table",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          table.type = "NewType";
          table.save().then(function(newTable){
              throw "should not change the type of a table";
          },function(){
              done();
          });
      },function(){
          throw("should fetch the table");
      });
    });

    it("should not rename a column",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table12');
        CB.CloudTable.get(obj).then(function(table){
            table.columns[0].name = "abcd";
            table.save().then(function(){
                throw("should not update the column name");
            },function(){
                done();
            });
        },function(){
            throw("should fetch the table");
        });
    });

    it("should not change data type of a column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[0].dataType = "abcd";
          table.save().then(function(){
              throw("should not update the column dataType");
          },function(){
              done();
          });
      },function(){
          throw("should fetch the table");
      });
    });

    it("should not change unique property of a default column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[0].unique = false;
          table.save().then(function(){
              throw("should not change unique property of a default column");
          },function(){
              done();
          });
      },function(){
          throw("should fetch the table");
      });
    });

    it("should not change required property of a default column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[0].required = false;
          table.save().then(function(){
              throw("should not change required property of a default column");
          },function(){
              done();
          });
      },function(){
          throw("should fetch the table");
      });
    });

    it("should change unique property of a user defined column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          if(table.columns[5].unique)
            table.columns[5].unique = false;
          else
            table.columns[5].unique = true;
          table.save().then(function(newTable){
              if(newTable.columns[5].unique == table.columns[5].unique)
                done();
              else
                throw("shouldchange unique property of a user defined column");
          },function(){
              throw("shouldchange unique property of a user defined column");
          });
      },function(){
          throw("should fetch the table");
      });
    });

    it("should change required property of a user defined column",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          if(table.columns[5].required)
            table.columns[5].required = false;
          else
            table.columns[5].required = true;

          table.save().then(function(newTable){
              if(newTable.columns[5].required == table.columns[5].required)
                done();
              else
                throw("should change required property of a user defined column");
          },function(){
              throw("should change required property of a user defined column");

          });
      },function(){
          throw("should fetch the table");
      });
    });

    it("should not delete a default column of a table",function(done){
      this.timeout(20000);
      var obj = new CB.CloudTable('Table12');
      CB.CloudTable.get(obj).then(function(table){
          table.columns[2] = "";
          table.save().then(function(newTable){
              if(newTable.columns[2] != "createdAt")
                throw("should change required property of a user defined column");
          },function(){
              done();
          });
      });
    });

});
