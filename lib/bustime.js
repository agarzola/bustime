var http        = require('http'),
    xml2js      = require('xml2js'),
    querystring = require('querystring'),
    moment      = require('moment'),
    validate    = require('./modules/validate')
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
    },

    time: function (reqObj, callback) {
      var parent = this;
      validate.time(reqObj, function (err, validatedObj) {
        if (!err) {
          parent.request('gettime', reqObj, function (err, result) {
            // This should probably get outsourced to a services submodule:
            if (reqObj && reqObj.services && reqObj.services.moment && result.tm) {
              result.moment = moment(result.tm, 'YYYYMMDD HH:mm:ss');
            }
            typeof(callback) === 'function' ? callback(err, result) : false;
          });
        } else {
          typeof(callback) === 'function' ? callback(err, null) : false;
        }
      });
    },

    vehicles: function (reqObj, callback) {
      var parent = this;
      validate.vehicles(reqObj, function (err, validatedObj) {
        if (!err) {
          parent.request('getvehicles', validatedObj, function (err, result) {
            typeof(callback) === 'function' ? callback(err, result) : false;
          });
        } else {
          typeof(callback) === 'function' ? callback(err, null) : false;
        }
      });
    },

    routes: function (reqObj, callback) {
      var parent = this;
      validate.routes(reqObj, function (err, validatedObj) {
        if (!err) {
          parent.request('getroutes', reqObj, function (err, result) {
            typeof(callback) === 'function' ? callback(err, result) : false;
          });
        } else {
          typeof(callback) === 'function' ? callback(err, null) : false;
        }
      });
    },

    directions: function (reqObj, callback) {
      var parent = this;
      validate.directions(reqObj, function (err, validatedObj) {
        if (!err) {
          parent.request('getdirections', reqObj, function (err, result) {
            typeof(callback) === 'function' ? callback(err, result) : false;
          });
        } else {
          typeof(callback) === 'function' ? callback(err, null) : false;
        }
      });
    },

    stops: function (reqObj, callback) {
      var parent = this;
      validate.stops(reqObj, function (err, validatedObj) {
        if (!err) {
          parent.request('getstops', reqObj, function (err, result) {
            typeof(callback) === 'function' ? callback(err, result) : false;
          });
        } else {
          typeof(callback) === 'function' ? callback(err, null) : false;
        }
      });
    },

    patterns: function (reqObj, callback) {
      var parent = this;
      validate.patterns(reqObj, function (err, validatedObj) {
        if (!err) {
          parent.request('getpatterns', reqObj, function (err, result) {
            typeof(callback) === 'function' ? callback(err, result) : false;
          });
        } else {
          typeof(callback) === 'function' ? callback(err, null) : false;
        }
      });
    },

    predictions: function (reqObj, callback) {
      var parent = this;
      validate.predictions(reqObj, function (err, validatedObj) {
        if (!err) {
          parent.request('getpredictions', reqObj, function (err, result) {
            // This should probably get outsourced to a services submodule:
            if (reqObj && reqObj.services && reqObj.services.calculateETA && result.prd) {
              var timeObj = {
                services: {
                  moment: true
                }
              }
              if (result.prd.constructor === Array) {
                result.prd.forEach(function (prediction, index) {
                  var predMoment = moment(prediction.prdtm, 'YYYYMMDD HH:mm');
                  var currMoment = moment(prediction.tmstmp, 'YYYYMMDD HH:mm')
                  prediction.eta = currMoment.diff(predMoment) * -1;
                });
              } else {
                var predMoment = moment(result.prd.prdtm, 'YYYYMMDD HH:mm');
                var currMoment = moment(result.prd.tmstmp, 'YYYYMMDD HH:mm')
                result.prd.eta = currMoment.diff(predMoment) * -1;
              }
            }

            typeof(callback) === 'function' ? callback(err, result) : false;
          });
        } else {
          typeof(callback) === 'function' ? callback(err, null) : false;
        }
      });
    },

    serviceBulletins: function (reqObj, callback) {
      var parent = this;
      validate.serviceBulletins(reqObj, function (err, validatedObj) {
        if (!err) {
          parent.request('getservicebulletins', reqObj, function (err, result) {
            typeof(callback) === 'function' ? callback(err, result) : false;
          });
        } else {
          typeof(callback) === 'function' ? callback(err, null) : false;
        }
      });
    }
  }
}

if (typeof(module) !== 'undefined') {
  module.exports = bustimeInit;
}
