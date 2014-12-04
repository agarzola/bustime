var moment = require('moment'),
    internals = require('./internals')
    ;

var services = {
  time: function (reqObj, result, callback) {
    // services: { moment: true }
    if (reqObj && reqObj.services && reqObj.services.moment && result.tm) {
      insertMoment(result, function () {
        callback(null, result);
      });
    } else {
      callback(null, result);
    }
  },

  vehicles: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    callback(null, result);
  },

  routes: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    callback(null, result);
  },

  directions: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    callback(null, result);
  },

  stops: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    callback(null, result);
  },

  patterns: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    callback(null, result);
  },

  predictions: function (reqObj, result, callback) {
    if (reqObj && reqObj.services && reqObj.services.calculateETA && result.prd) {
      calculateETA(result, function (err, calculatedResult) {
        callback(null, calculatedResult);
      });
    } else {
      callback(null, result);
    }
  },

  serviceBulletins: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    callback(null, result);
  }
}

var insertMoment = function (result, callback) {
  result.moment = moment(result.tm, 'YYYYMMDD HH:mm:ss');
  callback(null, result);
}

var calculateETA = function (result, callback) {
  internals.actOnArrayOrSingleItem(result.prd, function (object) {
    var predMoment = moment(object.prdtm, 'YYYYMMDD HH:mm'),
        currMoment = moment(object.tmstmp, 'YYYYMMDD HH:mm')
        ;
    object.eta = currMoment.diff(predMoment) * -1;
  });

  callback(null, result);
}

module.exports = services;
