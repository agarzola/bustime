var http        = require('http'),
    xml2js      = require('xml2js'),
    querystring = require('querystring')
    ;

var bustimeInit = function (apiObj) {
  return {
    request: function (requestType, reqObj, callback) {
      // Set a bunch of default variables for use in the request to the BusTracker API:
      var host        = apiObj.host,
          path        = apiObj.path || '/bustime/api/v1',
          port        = apiObj.port || 80,
          method      = 'GET'
          ;

      if (!reqObj) {
        reqObj = {};
      }

      reqObj.key  = apiObj.key || null;
      reqObj.localestring  = apiObj.localestring || null;
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

      // If BusTime API responds with HTTP error, return the error:
      request.on('error', function (e) {
        if (callback && typeof(callback) === 'function') {
          callback(e.message, null);
        } else {
          return { err: e.message };
        }
      });

      request.end();
    },

    time: function (reqObj, callback) {
      this.request('/gettime', reqObj, function (err, result) {
        if (reqObj.services && reqObj.services.moment && result.tm) {
          result.moment = moment(result.tm, 'YYYYMMDD HH:mm:ss');
        }

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

    vehicles: function (reqObj, callback) {
      this.request('/getvehicles', reqObj, function (err, result) {
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

    routes: function (reqObj, callback) {
      this.request('/getroutes', reqObj, function (err, result) {
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

    directions: function (reqObj, callback) {
      this.request('/getdirections', reqObj, function (err, result) {
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

    stops: function (reqObj, callback) {
      this.request('/getstops', reqObj, function (err, result) {
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

    patterns: function (reqObj, callback) {
      this.request('/getpatterns', reqObj, function (err, result) {
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

    predictions: function (reqObj, callback) {
      this.request('/getpredictions', reqObj, function (err, result) {
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

    serviceBulletins: function (reqObj, callback) {
      this.request('/getservicebulletins', reqObj, function (err, result) {
        if (callback && typeof(callback) === 'function') {
          callback(err, result);
        } else {
          return {
            err: err,
            result: result
          };
        }
      });
    }
  }
}

if (typeof(module) !== 'undefined') {
  module.exports = bustimeInit;
}
