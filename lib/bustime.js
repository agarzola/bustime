var http        = require('http'),
    xml2js      = require('xml2js'),
    querystring = require('querystring'),
    moment      = require('moment'),
    validate    = require('./modules/validate'),
    services    = require('./modules/services')
    ;

var bustimeInit = function (apiObj) {
  var bustime = {
    request: function (requestType, reqObj, callback) {
      requestMethod(requestType, reqObj, callback);
    },

    time: function (reqObj, callback) {
      specialMethod('time', reqObj, callback);
    },

    vehicles: function (reqObj, callback) {
      specialMethod('vehicles', reqObj, callback);
    },

    routes: function (reqObj, callback) {
      specialMethod('routes', reqObj, callback);
    },

    directions: function (reqObj, callback) {
      specialMethod('directions', reqObj, callback);
    },

    stops: function (reqObj, callback) {
      specialMethod('stops', reqObj, callback);
    },

    patterns: function (reqObj, callback) {
      specialMethod('patterns', reqObj, callback);
    },

    predictions: function (reqObj, callback) {
      specialMethod('predictions', reqObj, callback);
    },

    serviceBulletins: function (reqObj, callback) {
      specialMethod('serviceBulletins', reqObj, callback);
    }
  }

  var specialMethod = function (name, reqObj, callback) {
    // Run reqObj through the validator:
    validate[name](reqObj, function (err, validatedObj) {
      if (err) {
        // If reqObj doesn’t validate, return error to callback:
        typeof(callback) === 'function' ? callback(err, null) : false;

      } else {
        // Make a request to BusTime API:
        requestMethod('get' + name.toLowerCase(), reqObj, function (err, result) {
          if (err) {
            // If API call results in an error, return error to callback:
            typeof(callback) === 'function' ? callback(err, null) : false;

          } else {
            // Run resulting object through services:
            services[name](reqObj, result, function (err, processedResult) {

              // Return processed result to the callback:
              typeof(callback) === 'function' ? callback(err, processedResult) : false;
            });
          }
        });
      }
    });
  }

  var requestMethod = function (requestType, reqObj, callback) {
    // Set a bunch of default variables for use in the request to the BusTracker API:
    var host        = apiObj.host,
        path        = apiObj.path || '/bustime/api/v1',
        port        = apiObj.port || 80,
        method      = 'GET'
        ;

    // Sometimes we might not get a reqObj, so create one:
    if (!reqObj) {
      reqObj = {};
    }

    reqObj.key = apiObj.key || null;
    reqObj.localestring = reqObj.localestring || apiObj.localestring || null;
    var queryString = querystring.stringify(reqObj);

    var options = {
      host: host,
      path: path + '/' + requestType + '?' + queryString,
      port: port,
      method: method
    }

    // Make request to BusTime API:
    var request = http.request(options, function (response) {
      var body = '';
      response.on('data', function (data) {
        body += data;
      });

      // Do something with the response from the API:
      response.on('end', function () {
        // Turn XML response into JS object and do something with the result:
        var parser = new xml2js.Parser({
          explicitArray: false,
          trim: true
        });
        parser.parseString(body, function (err, parsedResponse) {
          var result = parsedResponse['bustime-response'];
          if (callback && typeof(callback) === 'function') {
            callback(err, result);
          } else {
            return {
              error: err,
              result: result
            };
          }
        });
      });
    });

    // If BusTime API responds with HTTP error, return the error:
    request.on('error', function (e) {
      if (callback && typeof(callback) === 'function') {
        callback(e.message, null);
      } else {
        return { err: e.message };
      }
    });

    request.end();
  }

  return bustime;
}

if (typeof(module) !== 'undefined') {
  module.exports = bustimeInit;
}
