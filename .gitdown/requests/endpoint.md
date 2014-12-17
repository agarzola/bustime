### 1. Endpoint-specific methods
Below are the methods dedicated to specific endpoints on the BusTime API. Each has its own request object requirements. This object (sans the `services` property pertaining to `bustime`’s services) is translated directly to the querystring in the request to the API. See the [BusTime Developer API Guide](http://bustracker.gocarta.org/bustime/apidoc/v1/DeveloperAPIGuide.pdf) for more information on each parameter.

**A note on validation:** Each endpoint-specific method below validates your `reqObj` object by default. When your object fails validation, an error is returned to your callback and the request to the BusTime API is aborted. To turn off validation (not that you’d ever want to), include a `validate` property set to `false` within the `services` property of your request object, like so:
```javascript
var reqObj = {
  // ... your other properties ... //
  services: {
    validate: false
  }
}
```

I’ve omitted the `validate` property from the descriptions below for the sake of being succinct. Just know that it’s available in each of these endpoint-specific methods.

---

#### .time(reqObj, callback)
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

Services available:
- `moment`: Boolean, defaults to false. If true, includes the time as a [moment.js](http://momentjs.com/) object in `result.moment`.

`result` is an object with a `tm` property containing the API’s time in YYYYMMDD HH:MM:SS format, and an `error` property containing an array of errors. Like so:

```javascript
{ tm: '20141127 10:07:30',
  moment:
   { _isAMomentObject: true,
     _i: '20141127 10:07:30',
     _f: 'YYYYMMDD HH:mm:ss',
     _isUTC: false,
     _pf:
      { empty: false,
        unusedTokens: [],
        unusedInput: [],
        overflow: -1,
        charsLeftOver: 0,
        nullInput: false,
        invalidMonth: null,
        invalidFormat: false,
        userInvalidated: false,
        iso: false },
     _locale:
      { _ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: [Function],
        _abbr: 'en',
        _ordinalParseLenient: /\d{1,2}(th|st|nd|rd)|\d{1,2}/ },
     _d: Thu Nov 27 2014 10:07:30 GMT-0500 (EST) } }
```

---
#### .vehicles(reqObj, callback)
```javascript
var reqObj = {
  rt: route_number, // optional, not available w/vid
  vid: vehicle_id,  // optional, not available w/rt
  tmres: resolution // optional, defaults to 'm'
}

bustime.vehicles(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `vehicle` property containing an array of vehicle objects, and an `error` property containing an array of error objects.

Request object properties are:
- `rt`: route number(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'4,9'`)
- `vid`: vehicle ID(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'128,506'`)
- `tmres`: time stamp resolution. Set to `'s'` to get time resolution to the second. Set to `'m'` to get time resolution to the minute. Defaults to `'m'`.

---
#### .routes(reqObj, callback)
```javascript
bustime.routes(null, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `route` property containing an array of route objects, and an `error` property containing an array of error objects.

---
#### .directions(reqObj, callback)
```javascript
var reqObj = {
  rt: route_number // required
}

bustime.directions(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `dir` property containing an array of route direction strings, and an `error` property containing an array of error objects.

Request object properties are:

- `rt`: route number(s). Can be an Integer or String. May only be one route number.

---
#### .stops(reqObj, callback)
```javascript
var reqObj = {
  rt: route_number, // required
  dir: direction    // required
}

bustime.stops(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `stop` property containing an array of stop objects, and an `error` property containing an array of error objects.

Request object properties are:

- `rt`: route number(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'33,34'`)
- `dir`: direction(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'0,1'`)

---
#### .patterns(reqObj, callback)
```javascript
var reqObj = {
  rt: route_number, // optional, not available w/pid
  pid: direction    // optional, not available w/rt
}

bustime.patterns(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `ptr` property containing an array of pattern objects, and an `error` property containing an array of error objects.

Request object properties are:

- `rt`: route number(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'33,34'`)
- `pid`: pattern ID(s). Can be an Integer or String. May include multiple, comma-delimited pattern ID numbers as a string (e.g. `'897,899'`)

---
#### .predictions(reqObj, callback)
```javascript
var reqObj = {
  stpid: stop_id,       // optional, not available w/vid
  rt: route_number,     // optional, requires stpid
  vid: vehicle_id,      // optional, not available w/stpid
  top: max_predictions, // optional, max number of predictions
  tmres: resolution     // optional, defaults to 'm'
  services: {
    calculateETA: true  // optional, defaults to false
  }
}

bustime.predictions(reqObj, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `prd` property containing an array of prediction objects, and an `error` property containing an array of errors. It may contain both properties, particularly when multiple routes or stops are sent in the query.

Request object properties are:
- `stpid`: stop ID(s). Can be an Integer or String. May include multiple, comma-delimited stop numbers as a string (e.g. `'897,899'`)
- `rt`: route number(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'33,34'`)
- `vid`: vehicle ID(s). Can be an Integer or String. May include multiple, comma-delimited vehicle numbers as a string (e.g. `'452,191'`)
- `top`: max number of predictions. Must be an Integer
- `tmres`: time stamp resolution. Set to `'s'` to get time resolution to the second. Set to `'m'` to get time resolution to the minute. Defaults to `'m'`. _(This option is not documented in the BusTime documentation for the `/getpredictions` endpoint, but seems to work anyway.)_

Services available:
- `calculateETA`: Boolean, defaults to false. If true, calculates the estimated time of arrival of each prediction in milliseconds and includes it in that prediction’s `eta` property. _(This option works best when `tmres` is set to `'s'`.)_

---
#### .serviceBulletins(reqObj, callback)
```javascript
var reqObj = {
  rt: route_number,     // required if stpid not specified
  rtdir: route_dir,     // optional, requires rt property
  stpid: stop_id        // required if rt not specified
}

bustime.serviceBulletins(reqObj, function (err, result) {
  console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `sb` property containing an array of bulletin objects, and an `error` property containing an array of errors.
