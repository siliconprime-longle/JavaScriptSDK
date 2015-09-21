describe("Fyipe",function(done){

    it("should save",function(done){

        this.timeout(10000);
        CB.appId = 'fyipeprod';
        CB.appKey = 'yKAl1o8JHr8h+wu8S17dFPzEcQMJ7Y8F1rMkkVECeWk=';
        var noticeObj = new CB.CloudQuery('Notification');
        var userObj = new CB.CloudObject('User', 'oVlsLWiy');
        noticeObj.include('post');
        noticeObj.include('groupPost');
        noticeObj.equalTo('user', userObj);
        noticeObj.setLimit(50);
        noticeObj.orderByDesc('createdAt');
        noticeObj.find({
            success: function(obj){
                console.log(obj);
                done();
            },error:function(obj){
                throw "Unable";
            }
        });
    });
});