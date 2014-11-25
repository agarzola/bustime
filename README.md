bustime.js
============

An abstraction of the Clever Devices [BusTime API](http://bustracker.gocarta.org/bustime/apidoc/v1/DeveloperAPIGuide.pdf), used by transit authorities across the U.S. _bustime.js_ takes parameter values as a JavaScript object and returns the API’s response also as an object. You need not worry about generating query parameters or parsing XML responses! Yay!

**::::::::::::::: Probably not production ready! :::::::::::::::**

---

## Usage
bustime.js provides a simple abstraction of the BusTime API’s various endpoints. There are two ways to make requests to the API using this library:

1. **Using a request type-specific method:** This is the preferred way if you’d like to use some of the added services that bustime.js offers for each. For example, the `bustime.predictions()` method could optionally calculate the ETA of each prediction for you and include that in a new `eta` property within each prediction. Not all methods will necessarily offer special services like that, but all request types have a dedicated method for the sake of consistency.
2. **Using the `.request()` method:** This method makes a request to the API and converts the XML response into a JavaScript object. It offers nothing more than that. This is the method that each of the dedicated methods use to make requests before performing additional services.

### Requiring in your node.js application
Before you require bustime.js, you should create an object with at least your API key and the host. This object is then passed as an argument of require, like so:
```javascript
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

---
### Request-specific methods
Below are the methods dedicated to specific request types. Each has its own object property requirements. This object (sans special properties pertaining to bustime.js’ services) is translated directly to the querystring in the request to the API. See the [BusTime Developer API Guide](http://bustracker.gocarta.org/bustime/apidoc/v1/DeveloperAPIGuide.pdf) for more information on each parameter.

#### .time(reqObj, callback(err, result))
```javascript
var reqObj = {
  services: {
    moment: true // optional
  }
}

bustime.time(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `tm` property containing the API’s time in YYYYMMDD HH:MM:SS format, and an `error` property containing an array of errors.

Special object properties:
- `moment`: Boolean, defaults to false. If true, includes the time as a [moment.js](http://momentjs.com/) object in `result.moment`.

---
#### .vehicles(reqObj, callback(err, result))
```javascript
var reqObj = {
  rt: route_number, // optional, not available w/vid
  vid: vehicle_id,  // optional, not available w/rt
  tmres: resolution // optional, defaults to 'm'
}

bustime.predictions(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `vehicle` property containing an array of vehicle objects, and an `error` property containing an array of errors. If only one vehicle object is returned, it is a direct child of the `vehicle` property (i.e. not an array).

Request object properties are:
- `rt`: route number(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'4,9'`)
- `vid`: vehicle ID(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'128,506'`)
- `tmres`: time stamp resolution. Set to `'s'` to get time resolution to the second. Set to `'m'` to get time resolution to the minute. Defaults to `'m'`.

---
#### .routes(reqObj, callback(err, result))
```javascript
bustime.routes(null, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `route` property containing an array of route objects, and an `error` property containing an array of errors. If only one route object is returned, it is a direct child of the `route` property (i.e. not an array).

---
#### .directions(reqObj, callback(err, result))
```javascript
var reqObj = {
  rt: route_number // required
}

bustime.directions(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `dir` property containing an array of route direction strings, and an `error` property containing an array of errors. If only one direction string is returned, it is a direct child of the `dir` property (i.e. not an array).

Request object properties are:

- `rt`: route number(s). Can be an Integer or String. May only be one route number.

---
#### .stops()
```javascript
var reqObj = {
  rt: route_number, // required
  dir: direction    // required
}

bustime.stops(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `stop` property containing an array of stop objects, and an `error` property containing an array of errors. If only one pattern object is returned, it is a direct child of the `stop` property (i.e. not an array).

Request object properties are:

- `rt`: route number(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'33,34'`)
- `dir`: direction(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'0,1'`)

---
#### .patterns()
```javascript
var reqObj = {
  rt: route_number, // optional, not available w/pid
  pid: direction    // optional, not available w/rt
}

bustime.stops(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `ptr` property containing an array of pattern objects, and an `error` property containing an array of errors. If only one pattern object is returned, it is a direct child of the `ptr` property (i.e. not an array).

Request object properties are:

- `rt`: route number(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'33,34'`)
- `pid`: pattern ID(s). Can be an Integer or String. May include multiple, comma-delimited pattern ID numbers as a string (e.g. `'897,899'`)

---
#### .predictions(reqObj, callback(err, result))
```javascript
var reqObj = {
  rt: route_number,     // required
  stpid: stop_id,       // required
  services: {
    calculateETA: false // optional, defaults to false
  }
}

bustime.predictions(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `prd` property containing an array of predictions, and an `error` property containing an array of errors. It may contain both properties, particularly when multiple routes or stops are sent in the query. If only one prediction or error object is returned, it is a direct child of the `prd` or `error` property (i.e. not an array).

Request object properties are:
- `rt`: route number(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'33,34'`)
- `stpid`: stop ID(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'897,899'`)

Special object properties are:
- `calculateETA`: Boolean, defaults to false. If true, calculates the ETA of each prediction in milliseconds and includes it in each prediction’s `eta` property.

---
#### .serviceBulletins(reqObj, callback(err, result))
```javascript
var reqObj = {
  rt: route_number,     // required if stpid not specified
  rtdir: route_dir,     // optional, requires rt property
  stpid: stop_id,       // required if rt not specified
  services: {
    calculateETA: false // optional, defaults to false
  }
}

bustime.serviceBulletins(reqObj, function (err, result) {
  console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `sb` property containing an array of bulletins, and an `error` property containing an array of errors. If only one bulletin or error object is returned, it is a direct child of the `sb` or `error` property (i.e. not an array).

---
#### .request(requestType, reqObj, callback(err, result))
The generic request method offers a barebones API request and no special services. It is up to you to set the request type as a string in the first argument. Like the request type-specific methods, it responds with a JavaScript object.

The generic `.request()` method might come in handy if you ever write your own BusTime-related methods and want to make them available for any request type (as opposed to limiting your method to, for example, only _predictions_ or only _stops_, for example). It might also come in handy if a future version of BusTime adds endpoints that this library doesn’t yet cover.

```javascript
var reqObj = {}; // The contents of this object will depend on the type ↵
                 // of request you’ll be making to the BusTime API.

var requestType = 'getpredictions'; // requires one of the BusTime request types

bustime.request(requestType, reqObj, function (err, result) {
  console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object like the one you would get from any of the request type-specific methods described above.

Options for `requestType` are: `'gettime'`, `'getvehicles'`, `'getroutes'`, `'getdirections'`, `'getstops'`, `'getpatterns'`, `'getpredictions'`, `'getservicebulletins'`.

---

### What about the browser?
I’ll be working on making this work in the browser as well. No word yet on when. For the time being, [browserify](http://browserify.org/) might do the trick (untested, though).
