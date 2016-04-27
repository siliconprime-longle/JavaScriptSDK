var port;

self.addEventListener('push', function(event) {
  var obj = event.data.json();  
  fireNotification(obj, event);  
});

function fireNotification(obj, event) {
  var title = 'Subscription change';  
  var body = 'This is working'; 
  var icon = 'push-icon.png';  
  var tag = 'push';
   
  event.waitUntil(self.registration.showNotification(title, {
    body: body,  
    icon: icon,  
    tag: tag  
  }));
}
