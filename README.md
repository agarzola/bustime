bustime.js
============

An abstraction of the Clever Devices [BusTime API](http://bustracker.gocarta.org/bustime/apidoc/v1/DeveloperAPIGuide.pdf), used by transit authorities across the US.

**Not production ready**

---

## Usage
Currently only supporting the `/getpredictions` request type. Other request types to the BusTime API are on the roadmap.

### Requiring on node.js
Before you require bustime.js, you should create an object with at least your API key and the host. This object is then passed as an argument of require, like so:
```javascript
var apiObj = {
    key: 'your_api_key',       // required
    host: 'your_api_host.com', // required
    port: 80,                  // optional, default is 80
    path: '/path/to/api'       // optional, default is '/bustime/api/v1'
}

var bustime = require('bustime')(apiObj);
```

### In the browser
Include bustime.js in your project, then:
```javascript
var apiObj = {
    key: 'your_api_key',       // required
    host: 'your_api_host.com', // required
    port: 80,                  // optional, default is 80
    path: '/path/to/api'       // optional, default is '/bustime/api/v1'
}

var bustime = bustimeInit(apiObj);
```

### Making requests
```javascript
var reqObj = {
    rt: route_number, // required
    stpid: stop_id    // required
}

bustime.predictions(reqObj, function (err, result) {
    console.log(JSON.stringify(result));
});
```
Where `result` is an object containing predictions, errors, or both.
