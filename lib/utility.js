var utility = function (apiObj) {
  var requests  = require('./requests')(apiObj),
      async     = require('async')
      ;

  return {
    collectRoutesAndStops: function (callback, config) {
      var defaults = {
        format: 'array'
      }

      config = config ? config : defaults;

      var parent = this;
      requests.specialMethod('routes', null, function (err, allRoutes) {
        if (err) return callback(err, null);
        async.waterfall([
          function (asyncCallback) {
            parent.insertDirections(allRoutes, function (err, routesWithDirections) {
              if (err) return callback(err, null);
              asyncCallback(err, routesWithDirections);
            });
          },
          function (routesWithDirections, asyncCallback) {
            parent.insertStops(routesWithDirections, function (err, completedRoutes) {
              if (err) return callback(err, null);
              asyncCallback(err, completedRoutes);
            });
          }
        ], function (err, completedRoutes) {
          if (err) return callback(err, null);
          var polishedObject;

          if (config.format === 'object') {
            polishedObject = {};
            completedRoutes.route.forEach(function (route) {
              polishedObject[route.rt] = route;
            });
          } else {
            polishedObject = completedRoutes.route.slice();
          }

          callback(err, polishedObject);
        });
      });
    },

    insertDirections: function (allRoutes, callback) {
      var masterErr = [];
      allRoutes.route.forEach(function (thisRoute, index) {
        thisRoute.dir = [];
        requests.specialMethod('directions', { rt: thisRoute.rt }, function (err, directions) {
          if (err) return masterErr.push(err);
          directions.dir.forEach(function (thisDirection, index) {
            thisRoute.dir[index] = {
              id: thisDirection,
              stops: []
            };
          });
          if (index === allRoutes.route.length -1) {
            if (masterErr.length === 0) { masterErr = null }
            callback(masterErr, allRoutes);
          }
        });
      });
    },

    insertStops: function (routesWithDirections, callback) {
      var masterErr = [];
      routesWithDirections.route.forEach(function (thisRoute, rtIndex) {
        var staticRtIndex = rtIndex;
        thisRoute.dir.forEach(function (thisDirection, dirIndex) {
          var staticDirIndex = dirIndex;
          requests.specialMethod('stops', { rt: thisRoute.rt, dir: thisDirection.id }, function (err, thisStops) {
            if (err) return masterErr.push(err);
            if (thisStops.stop) {
              routesWithDirections.route[staticRtIndex].dir[staticDirIndex].stops = thisStops.stop.slice();
            }
            if (staticRtIndex === routesWithDirections.route.length -1  && staticDirIndex === thisRoute.dir.length -1) {
              if (masterErr.length === 0) { masterErr = null }
              callback(masterErr, routesWithDirections);
            }
          });
        });
      });
    }
  }
};

module.exports = utility;
