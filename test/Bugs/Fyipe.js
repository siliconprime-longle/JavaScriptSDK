describe("Fyipe",function(done){

    it("should save",function(done){

        this.timeout(10000);

        var seller = new CB.CloudQuery('User');
        seller.findById('qs5Q69v2').then(function(seller){
            var buyer = new CB.CloudQuery('User');
            buyer.findById('SGAFjEfm').then(function(buyer){
                if(!seller.get('closed'))
                    seller.set('closed',0);
                if(!buyer.get('accepted'))
                    buyer.set('accepted',0);
                seller.set('closed',seller.get('closed')+1);
                buyer.set('accepted',buyer.get('accepted')+1);
               seller.save().then(function(){
                 buyer.save().then(function(){
                    done();
                 },function(){
                     throw "unable to save buyer";
                 })
               },function(){
                   throw "unable to save Seller";
               })
            },function(){
                throw "";
            });
        },function(){
            throw "";
        });
    });
});