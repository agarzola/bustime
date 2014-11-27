var moment = require('moment')
    ;

var services = {
  time: function (reqObj, result, callback) {
    // services: { moment: true }
    if (reqObj && reqObj.services && reqObj.services.moment && result.tm) {
      insertMoment(result, function () {
        callback(null, result);
      });
    }
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
    if (reqObj && reqObj.services && reqObj.services.calculateETA && result.prd) {
      calculateETA(result, function (err, calculatedResult) {
        if (err) callback(err, null);
        callback(null, calculatedResult);
      });
    }
  },

  serviceBulletins: function (reqObj, result, callback) {
    // No services yet, so pipe right into the callback:
    typeof(callback) === 'function' ? callback(null, result) : false;
  }
}

var insertMoment = function (result, callback) {
  result.moment = moment(result.tm, 'YYYYMMDD HH:mm:ss');
  callback(null, result);
}

var calculateETA = function (result, callback) {
  actOnArrayOrSingleItem(result.prd, function (object) {
    var predMoment = moment(object.prdtm, 'YYYYMMDD HH:mm'),
        currMoment = moment(object.tmstmp, 'YYYYMMDD HH:mm')
        ;
    object.eta = currMoment.diff(predMoment) * -1;
  });

  if (typeof(callback) === 'function') callback(null, result)
}

var actOnArrayOrSingleItem = function (object, callback) {
  if (object.constructor === Array) {
    object.forEach(function (item) {
      callback(item);
    });
  } else {
    callback(object);
  }
}

module.exports = services;
