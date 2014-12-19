var bustimeInit = function (apiObj) {
  var requests    = require('./lib/requests')(apiObj),
      validate    = require('./lib/validate'),
      services    = require('./lib/services'),
      utility     = require('./lib/utility')(apiObj)
      ;

  return {
    request: function (requestType, reqObj, callback) {
      requests.genericMethod(requestType, reqObj, callback);
    },

    time: function (reqObj, callback) {
      requests.specialMethod('time', reqObj, callback);
    },

    vehicles: function (reqObj, callback) {
      requests.specialMethod('vehicles', reqObj, callback);
    },

    routes: function (reqObj, callback) {
      requests.specialMethod('routes', reqObj, callback);
    },

    directions: function (reqObj, callback) {
      requests.specialMethod('directions', reqObj, callback);
    },

    stops: function (reqObj, callback) {
      requests.specialMethod('stops', reqObj, callback);
    },

    patterns: function (reqObj, callback) {
      requests.specialMethod('patterns', reqObj, callback);
    },

    predictions: function (reqObj, callback) {
      requests.specialMethod('predictions', reqObj, callback);
    },

    serviceBulletins: function (reqObj, callback) {
      requests.specialMethod('serviceBulletins', reqObj, callback);
    },

    collectRoutesAndStops: function(callback, config) {
      utility.collectRoutesAndStops(callback, config);
    }
  }
}

module.exports = bustimeInit;
