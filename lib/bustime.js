var http        = require('http'),
    xml2js      = require('xml2js'),
    querystring = require('querystring')
    ;

var bustimeInit = function (apiObj) {
  return {
    predictions: function (reqObj, callback) {
      var requestType = '/getpredictions';

      this.request(requestType, reqObj, function (err, result) {
        if (callback && typeof(callback) === 'function') {
          callback(err, result);
        } else {
          return {
            err: err,
            result: result
          };
        }
      });
    },

    request: function (requestType, reqObj, callback) {
      // Set a bunch of default variables for use in the request to the CARTA API:
      var host        = apiObj.host,
          path        = apiObj.path || '/bustime/api/v1',
          port        = apiObj.port || 80,
          method      = 'GET'
          ;

      reqObj.key  = apiObj.key || null;
      var queryString = querystring.stringify(reqObj);

      var options = {
        host: host,
        path: path + requestType + '?' + queryString,
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
                err: err,
                result: result
              };
            }
          });
        });
      });

      // If BusTime API responds with HTTP error, log it to the console:
      request.on('error', function (e) {
        if (callback && typeof(callback) === 'function') {
          callback(e.message, null);
        } else {
          return { err: e.message };
        }
      });

      request.end();
    }
  }
}

if (typeof(module) !== 'undefined') {
  module.exports = bustimeInit;
}
