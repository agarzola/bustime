## Usage
Before you require `bustime`, you should create an object with at least your API key and the host. This object is then passed as an argument of require, like so:
```javascript
var bustime = require('bustime');

var apiObj = {
    key: 'your_api_key',       // required
    host: 'your_api_host.com', // required
    localestring: 'lang',      // optional, default is whatever the BusTime ↵
                               // API you’re accessing is set to
    port: 80,                  // optional, default is 80
    path: '/path/to/api'       // optional, default is '/bustime/api/v1'
}

var bustime = require('bustime')(apiObj);
```
