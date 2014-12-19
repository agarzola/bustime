<!--
This file has been generated using Gitdown (https://github.com/gajus/gitdown).
Direct edits to this will be be overwritten. Look for Gitdown markup file under ./.gitdown/ path.
-->
bustime [![NPM version](http://img.shields.io/npm/v/bustime.svg?style=flat)](https://www.npmjs.org/package/bustime) [![Code Climate](https://codeclimate.com/github/agarzola/bustime/badges/gpa.svg)](https://codeclimate.com/github/agarzola/bustime) [![Code Climate](https://codeclimate.com/github/agarzola/bustime/badges/coverage.svg)](https://codeclimate.com/github/agarzola/bustime) [![Travis build status](http://img.shields.io/travis/agarzola/bustime/master.svg?style=flat)](https://travis-ci.org/agarzola/bustime)
============

An abstraction of the Clever Devices [BusTime API](http://bustracker.gocarta.org/bustime/apidoc/v1/DeveloperAPIGuide.pdf), used by transit authorities across the U.S. `bustime` takes parameter values as a JavaScript object and returns the API’s response also as an object. You need not worry about generating query parameters or parsing XML responses! Yay!

Now with [utility methods](#utility-methods) to help you mine data from your API!

**::::::::::::::: Probably not production ready! (But it’s close!) :::::::::::::::**


Contents
============

* [Installation](#installation)
* [Usage](#usage)
* [Request methods](#request-methods)
    * [1. Endpoint-specific methods](#request-methods-1-endpoint-specific-methods)
        * [.time(reqObj, callback)](#request-methods-1-endpoint-specific-methods--time-reqobj-callback-)
        * [.vehicles(reqObj, callback)](#request-methods-1-endpoint-specific-methods--vehicles-reqobj-callback-)
        * [.routes(reqObj, callback)](#request-methods-1-endpoint-specific-methods--routes-reqobj-callback-)
        * [.directions(reqObj, callback)](#request-methods-1-endpoint-specific-methods--directions-reqobj-callback-)
        * [.stops(reqObj, callback)](#request-methods-1-endpoint-specific-methods--stops-reqobj-callback-)
        * [.patterns(reqObj, callback)](#request-methods-1-endpoint-specific-methods--patterns-reqobj-callback-)
        * [.predictions(reqObj, callback)](#request-methods-1-endpoint-specific-methods--predictions-reqobj-callback-)
        * [.serviceBulletins(reqObj, callback)](#request-methods-1-endpoint-specific-methods--servicebulletins-reqobj-callback-)
    * [2. Generic request method](#request-methods-2-generic-request-method)
        * [.request(requestType, reqObj, callback)](#request-methods-2-generic-request-method--request-requesttype-reqobj-callback-)
* [Utility methods](#utility-methods)
    * [.collectRoutesAndStops(callback[, config])](#utility-methods--collectroutesandstops-callback-config-)
* [What about the browser?](#what-about-the-browser-)


---

<h2 id="installation">Installation</h2>
```bash
$ npm install bustime
```
_(You probably want to `--save` it as a dependency, but I ain’t the boss of you.)_


<h2 id="usage">Usage</h2>
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


<h2 id="request-methods">Request methods</h2>
There are two ways to make requests to the API using this library:

1. **Using an endpoint-specific method:** This is the preferred way if you’d like to use the added services that `bustime` offers for each. For example, all endpoint-specific methods validate your request parameter object by default according to the needs of that endpoint, to avoid faulty requests made to the API (this can be turned off by on a per-method basis). Additionally, some of the methods offer special services that you can choose to turn on.
2. **Using the generic `.request()` method:** This method makes a request to the API and converts the XML response into a JavaScript object. It offers nothing more than that. This is the method that each of the dedicated methods described above use to make requests between validating and performing additional services on the resulting data.


---

<h3 id="request-methods-1-endpoint-specific-methods">1. Endpoint-specific methods</h3>
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

<h4 id="request-methods-1-endpoint-specific-methods--time-reqobj-callback-">.time(reqObj, callback)</h4>
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
<h4 id="request-methods-1-endpoint-specific-methods--vehicles-reqobj-callback-">.vehicles(reqObj, callback)</h4>
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
<h4 id="request-methods-1-endpoint-specific-methods--routes-reqobj-callback-">.routes(reqObj, callback)</h4>
```javascript
bustime.routes(null, function (err, result) {
    console.log(JSON.stringify(result, null, 2));
});
```
Where `result` is an object with a `route` property containing an array of route objects, and an `error` property containing an array of error objects.

---
<h4 id="request-methods-1-endpoint-specific-methods--directions-reqobj-callback-">.directions(reqObj, callback)</h4>
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
<h4 id="request-methods-1-endpoint-specific-methods--stops-reqobj-callback-">.stops(reqObj, callback)</h4>
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
<h4 id="request-methods-1-endpoint-specific-methods--patterns-reqobj-callback-">.patterns(reqObj, callback)</h4>
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
<h4 id="request-methods-1-endpoint-specific-methods--predictions-reqobj-callback-">.predictions(reqObj, callback)</h4>
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
Where `result` is an object with a `prd` property containing an array of prediction objects, and an `error` property containing an array of error objects. It may contain both properties, particularly when multiple routes or stops are sent in the query.

Request object properties are:
- `stpid`: stop ID(s). Can be an Integer or String. May include multiple, comma-delimited stop numbers as a string (e.g. `'897,899'`)
- `rt`: route number(s). Can be an Integer or String. May include multiple, comma-delimited route numbers as a string (e.g. `'33,34'`)
- `vid`: vehicle ID(s). Can be an Integer or String. May include multiple, comma-delimited vehicle numbers as a string (e.g. `'452,191'`)
- `top`: max number of predictions. Must be an Integer
- `tmres`: time stamp resolution. Set to `'s'` to get time resolution to the second. Set to `'m'` to get time resolution to the minute. Defaults to `'m'`. _(This option is not documented in the BusTime documentation for the `/getpredictions` endpoint, but seems to work anyway.)_

Services available:
- `calculateETA`: Boolean, defaults to false. If true, calculates the estimated time of arrival of each prediction in milliseconds and includes it in that prediction’s `eta` property. _(This option works best when `tmres` is set to `'s'`.)_

---
<h4 id="request-methods-1-endpoint-specific-methods--servicebulletins-reqobj-callback-">.serviceBulletins(reqObj, callback)</h4>
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
Where `result` is an object with a `sb` property containing an array of bulletin objects, and an `error` property containing an array of error objects.


---

<h3 id="request-methods-2-generic-request-method">2. Generic request method</h3>
The generic request method offers a barebones API request and no special services. It is up to you to set the request type as a string in the first argument. Like the endpoint-specific methods, it responds with a JavaScript object.

The generic `.request()` method might come in handy if you write your own BusTime-related methods and want to make them available for more than one API request type (as opposed to limiting your method to, for example, only _predictions_ or only _stops_, for example). It could also be useful if a future version of BusTime adds endpoints that this library doesn’t yet cover.

<h4 id="request-methods-2-generic-request-method--request-requesttype-reqobj-callback-">.request(requestType, reqObj, callback)</h4>
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


---

<h2 id="utility-methods">Utility methods</h2>
`bustime` also offers a method for collecting data from the BusTracker API to store in memory or commit to a file for later use in your app. There is only one such method at the moment, but more may be added in the future. [Open an issue](https://github.com/agarzola/bustime/issues) if there’s a specific utility you’d like to see implemented.


<h3 id="utility-methods--collectroutesandstops-callback-config-">.collectRoutesAndStops(callback[, config])</h3>
This method builds a comprehensive object which includes all available routes, their directions, and every stop served by each direction in each route. This can be useful if our application needs to check whether a specific stop (or group thereof) is served by a route, or rule out a stop depending on which direction a bus is going. All information associated with routes and stops is included and left intact to make the object as useful as possible.

By default, this method provides an array of route objects. That array looks like this:

```javascript
[
  { rt: '1',
    rtnm: '1 ALTON PARK',
    rtclr: '#cc3399',
    dir: [
      { id: '0',
        stops: [
          { stpid: '1581',
            stpnm: '33RD + CHATTEM',
            lat: '35.017467535463',
            lon: '-85.321669578552'
          },
          { ... }
        ]
      },
      { id: '1',
        stops: [
          { ... },
          { ... }
        ]
      }
    ]
  },
  {
    rt: '2',
    ...
  }
]
```

The direction `id` is set to whatever is returned by your BusTracker API. It can be a number, but also something like `'Inbound'`. This depends on how your BusTracker API is set up to identify route directions.

Alternatively, you could pass a config object as a second argument setting the format to 'object'. This config argument and the resulting object look like this:

``` javascript
var config = {
  format: 'object'
}

// Produces a slightly different object:
{
  '1': {
    rt: '1',
    rtnm: '1 ALTON PARK',
    rtclr: '#cc3399',
    dir: [ 
      { ... },
      { ... }
    ]
  }
}
```
Note the `key:value` pairs, making it easy to reference a specific route’s data by using the route number as the key. Other than this one feature, each route’s object is identical to the ones in the array format. This formatting option just gives you a different way of referencing the reulting object.

**Please note:** In either case, this operation can take a while to complete (up to a few seconds, depending on your API server’s load), so it’s recommended that you run this once while booting up your app (to store in memory) or as part of a data collection script (from which you can commit it to a text file or database for later consumption). Otherwise, you risk performance issues in your application.


---

<h2 id="what-about-the-browser-">What about the browser?</h2>
I’ll be working on making this work in the browser as well. No idea when, though. For the time being, [browserify](http://browserify.org/) might do the trick (untested). Pull requests are welcome!
