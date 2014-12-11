### 2. Generic request method
The generic request method offers a barebones API request and no special services. It is up to you to set the request type as a string in the first argument. Like the endpoint-specific methods, it responds with a JavaScript object.

The generic `.request()` method might come in handy if you write your own BusTime-related methods and want to make them available for more than one API request type (as opposed to limiting your method to, for example, only _predictions_ or only _stops_, for example). It could also be useful if a future version of BusTime adds endpoints that this library doesn’t yet cover.

#### .request(requestType, reqObj, callback(err, result))
```javascript
var reqObj = {}; // The contents of this object will depend on the type ↵
                 // of request you’ll be making to the BusTime API.

var requestType = 'getpredictions'; // requires one of the BusTime request types

bustime.request(requestType, reqObj, function (err, result) {
  console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object like the one you would get from any of the endpoint-specific methods described above.

Options for `requestType` are: `'gettime'`, `'getvehicles'`, `'getroutes'`, `'getdirections'`, `'getstops'`, `'getpatterns'`, `'getpredictions'`, `'getservicebulletins'`.
