var http        = require('http'),
    querystring = require('querystring'),
    xml2js      = require('xml2js'),
    validate    = require('./validate'),
    services    = require('./services'),
    internals   = require('./internals')
    ;

var requests = function (apiObj) {
  return {
    specialMethod: function (name, reqObj, callback) {
      var parent = this;
      // Run reqObj through the validator:
      validate[name](reqObj, function (err, validatedObj) {
        if (err) {
          // If reqObj doesn’t validate, return error to callback:
          if (typeof(callback) === 'function') callback(err, null);

        } else {
          // Make a request to BusTime API:
          parent.genericMethod('get' + name.toLowerCase(), reqObj, function (err, result) {
            if (err) {
              // If API call results in an error, return error to callback:
              if (typeof(callback) === 'function') callback(err, null);

            } else {
              // Run resulting object through services:
              services[name](reqObj, result, function (err, processedResult) {

                // Return processed result to the callback:
                if (typeof(callback) === 'function') callback(err, processedResult);
              });
            }
          });
        }
      });
    },

    genericMethod: function (requestType, reqObj, callback) {
      // Set a bunch of default variables for use in the request to the BusTracker API:
      var host        = apiObj.host,
          path        = apiObj.path || '/bustime/api/v1',
          port        = apiObj.port || 80,
          method      = 'GET',
          queryString = '',
          options     = {},
          parent      = this,
          request
          ;

      // Sometimes we might not get a reqObj, so create one:
      if (!reqObj) reqObj = {};
      reqObj.key = apiObj.key || null;
      reqObj.localestring = reqObj.localestring || apiObj.localestring || null;
      queryString = querystring.stringify(reqObj);

      options = {
        host: host,
        path: path + '/' + requestType + '?' + queryString,
        port: port,
        method: method
      }

      this.queryAPI(options, function (err, response) {
        if (err) {
          callback(err, null);
        } else {
          parent.parseResponse(response, function (err, parsedResponse) {
            if (typeof(callback) === 'function') callback(err, parsedResponse);
          });
        }
      });
    },

    queryAPI: function (options, callback) {
      // Make request to BusTime API:
      request = http.request(options, function (response) {
        var body = '';
        response.on('data', function (data) {
          body += data;
        });

        // Do something with the response from the API:
        response.on('end', function () {
          callback(null, body);
        });
      });

      // If BusTime API responds with HTTP error, return the error:
      request.on('error', function (e) {
        callback(e.message, null);
      });

      request.end();
    },

    parseResponse: function (responseBody, callback) {
      var parser = new xml2js.Parser({
            explicitArray: false,
            trim: true
          });

      parser.parseString(responseBody, function (err, parsedResponse) {
        var result = parsedResponse['bustime-response'];
        for (var key in result) {
          if (result.hasOwnProperty(key)) {
            internals.singleObjectIntoArray(result[key], function (finalResult) {
              result[key] = finalResult.slice();
            });
          }
        }
        callback(err, result);
      });
    }
  }
}

module.exports = requests;
