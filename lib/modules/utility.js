var utility = function (apiObj) {
  var requests  = require('./requests')(apiObj)
      ;

  return {
    collectRoutesAndStops: function (callback) {
      var parent = this;
      requests.specialMethod('routes', null, function (err, allRoutes) {
        if (err) callback(err, null);
        parent.insertDirections(allRoutes, function (err, routesWithDirections) {
          if (err) callback(err, null);
          parent.insertStops(routesWithDirections, function (err, completedRoutes) {
            if (err) callback(err, null);
            var polishedObject = completedRoutes.route.slice();
            callback(null, completedRoutes);
          });
        });
      });
    },

    insertDirections: function (allRoutes, callback) {
      var counter = 0;
      // console.log(allRoutes);
      allRoutes.route.forEach(function (thisRoute) {
        thisRoute.dir = [];
        requests.specialMethod('directions', { rt: thisRoute.rt }, function (err, directions) {
          if (err) callback(err, null);
          directions.dir.forEach(function (thisDirection, index) {
            thisRoute.dir[index] = {
              id: thisDirection,
              stops: []
            };

            counter++;
            if (counter >= allRoutes.route.length) callback(null, allRoutes);
          });
        });
      });
    },

    insertStops: function (routesWithDirections, callback) {
      var counter = 0;
      routesWithDirections.route.forEach(function (thisRoute) {
        thisRoute.dir.forEach(function (thisDirection) {
          requests.specialMethod('stops', { rt: thisRoute.rt, dir: thisDirection.id }, function (err, thisStops) {
            if (err) callback(err, null);
            if (thisStops.stop) thisDirection.stops = thisStops.stop.slice();
            counter++;
            if (counter >= routesWithDirections.route.length) callback(null, routesWithDirections);
          });
        });
      });
    }
  }
};

module.exports = utility;
