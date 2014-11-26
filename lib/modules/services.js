var moment = require('moment')
    ;

var services = {
  time: function (reqObj, result, callback) {
    // services: { moment: true }
    if (reqObj && reqObj.services && reqObj.services.moment && result.tm) {
      result.moment = moment(result.tm, 'YYYYMMDD HH:mm:ss');
    }

    typeof(callback) === 'function' ? callback(null, result) : false;
  },

  vehicles: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    typeof(callback) === 'function' ? callback(null, result) : false;
  },

  routes: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    typeof(callback) === 'function' ? callback(null, result) : false;
  },

  directions: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    typeof(callback) === 'function' ? callback(null, result) : false;
  },

  stops: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    typeof(callback) === 'function' ? callback(null, result) : false;
  },

  patterns: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    typeof(callback) === 'function' ? callback(null, result) : false;
  },

  predictions: function (reqObj, result, callback) {
    // services: { calculateETA: true }
    if (reqObj && reqObj.services && reqObj.services.calculateETA && result.prd) {
      if (result.prd.constructor === Array) {
        result.prd.forEach(function (prediction, index) {
          var predMoment = moment(prediction.prdtm, 'YYYYMMDD HH:mm'),
              currMoment = moment(prediction.tmstmp, 'YYYYMMDD HH:mm')
              ;
          prediction.eta = currMoment.diff(predMoment) * -1;
        });
      } else {
        var predMoment = moment(result.prd.prdtm, 'YYYYMMDD HH:mm'),
            currMoment = moment(result.prd.tmstmp, 'YYYYMMDD HH:mm')
            ;
        result.prd.eta = currMoment.diff(predMoment) * -1;
      }
    }

    typeof(callback) === 'function' ? callback(null, result) : false;
  },

  serviceBulletins: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    typeof(callback) === 'function' ? callback(null, result) : false;
  }
}

module.exports = services;
