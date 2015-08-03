describe("Cloud Table", function(){

    it("should not create duplicate table",function(done){
        this.timeout(20000);
        var obj = new CB.CloudTable('Table');
        obj.save().then(function(){
            throw("should have create the table");
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
            throw("should have create the table");
        });
    });

    it("should get all tables from an app",function(done){
        this.timeout(20000);
        CB.CloudTable.getAll().then(function(){
            done();
        },function(){
            throw("should have create the table");
        });
    });

    it("should update new column into the table",function(done){
        this.timeout(20000);

        var obj = new CB.CloudTable('Table');
        CB.CloudTable.get(obj, {
          success: function(table){
            var column1 = new CB.Column('Name2', 'Text', true, false);
            table.addColumn(column1);
            table.save().then(function(newTable){
              var column2 = new CB.Column('Name2');
              newTable.deleteColumn(column2);
              newTable.save().then(function(){
                done();
              },function(){
                throw("should have create the table");
              });
            },function(){
              throw("should have create the table");
            });
          },
          error: function(err){
              throw("should have create the table");
          }
        });
    });
});
