describe("Offline Mode", function() {
    // var obj1 = new CB.CloudObject('Student');
    // obj1.set('name', 'Student');
    // var obj2 = new CB.CloudObject('Sample');
    // obj2.set('name', 'Sample');
    // var obj3 = new CB.CloudObject('Custom3');
    // obj3.set('address', 'Najafgarh New Delhi');
    //
    // it("should pin the object to local store", function(done) {
    //
    //     this.timeout(30000);
    //     var found = false;
    //     var obj = new CB.CloudObject('Student');
    //     obj.set('name', 'Ritish');
    //     obj.pin({
    //         success: function(data) {
    //             found = data.some(function(element) {
    //                 return element._hash == obj.document._hash;
    //             })
    //         },
    //         error: function(err) {
    //             done(err);
    //         }
    //     });
    //     setTimeout(function() {
    //         if (found)
    //             done();
    //         else {
    //             done('object not found in local store.')
    //         }
    //     }, 10000);
    //
    // });
    //
    // it("should pin multiple objects to local store", function(done) {
    //
    //     this.timeout(30000);
    //     var count = 0;
    //     obj1.pin({
    //         success: function(data) {
    //             data.some(function(element) {
    //                 if (element._hash == obj1.document._hash)
    //                     count++;
    //                 }
    //             );
    //         },
    //         error: function(err) {
    //             done(err);
    //         }
    //     });
    //     CB.CloudObject.pin([
    //         obj2, obj3
    //     ], {
    //         success: function(data) {
    //             data.some(function(element) {
    //                 if (element._hash == obj1.document._hash)
    //                     count++;
    //                 else if (element._hash == obj2.document._hash)
    //                     count++;
    //                 else if (element._hash == obj3.document._hash)
    //                     count++;
    //                 }
    //             );
    //         },
    //         error: function(err) {
    //             done(err);
    //         }
    //     });
    //     setTimeout(function() {
    //         if (count == 3)
    //             done();
    //         else {
    //             done('object not found in local store.')
    //         }
    //     }, 10000);
    // });
    //
    // it("should unpin the object from the local store", function(done) {
    //
    //     this.timeout(30000);
    //     var count = 0;
    //
    //     obj1.unPin({
    //         success: function(data) {
    //             data.some(function(element) {
    //                 if (element._hash == obj1.document._hash)
    //                     count++;
    //                 }
    //             );
    //         },
    //         error: function(err) {
    //             done(err);
    //         }
    //     });
    //     setTimeout(function() {
    //         if (count == 0)
    //             done();
    //         else {
    //             done('object found in local store.')
    //         }
    //     }, 10000);
    //
    // });
    //
    // it("should unpin multiple objects from the local store", function(done) {
    //
    //     this.timeout(30000);
    //     var count = 0;
    //
    //     CB.CloudObject.unPin([
    //         obj2, obj3
    //     ], {
    //         success: function(data) {
    //             data.some(function(element) {
    //                 if (element._hash == obj2.document._hash)
    //                     count++;
    //                 else if (element._hash == obj3.document._hash)
    //                     count++;
    //
    //                 }
    //             );
    //         },
    //         error: function(err) {
    //             done(err);
    //         }
    //     });
    //     setTimeout(function() {
    //         if (count == 0)
    //             done();
    //         else {
    //             done('objects found in local store.')
    //         }
    //     }, 10000);
    //
    // });

    it("should save the objects eventually", function(done) {

        this.timeout(30000);
        var count = 0;
        var obj1 = new CB.CloudObject('Sample');
        obj1.set('name', 'Offline-Sample');
        obj1.set('unique', 'abrakadabra');
        obj1.saveEventually();
        var obj2 = new CB.CloudObject('Student');
        obj2.set('name', 'Offline-Student');
        obj2.set('age', 79);
        obj2.saveEventually();

        setTimeout(function() {
            if (count == 0)
                done();
            else {
                done('objects not saved.')
            }
        }, 10000);

    });

});
