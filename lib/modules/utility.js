var allRoutes = [];
    ;

var utility = {
  collectRoutes: function (callback) {
    this.routes(null, function (err, result) {
      if (err) callback(err, null);
      if (result.route && result.route.constructor === Array) {
        result.route.forEach(function (thisRoute) {
          allRoutes.push(thisRoute);
        });
      } else {
        allRoutes.push(result.route);
      }
      callback(err, allRoutes);
    });
  }
};

module.exports = utility;
