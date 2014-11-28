var allRoutes = [];
    ;

var utility = function (apiObj) {
  var requests = require('./requests')
      ;

  return {
    collectRoutesAndStops: function (callback) {
      requests.specialMethod('routes', null, function (err, result) {
        if (err) callback(err, null);

        callback(err, allRoutes);
      });
    }
  }
};

module.exports = utility;
