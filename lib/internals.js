var internals = {
  singleObjectIntoArray: function (object, callback) {
    if (object.constructor !== Array) {
      object = [ object ];
    }
    callback(object);
  },

  actOnArrayOrSingleItem: function (object, callback) {
    if (object.constructor === Array) {
      object.forEach(function (item) {
        callback(item);
      });
    } else {
      callback(object);
    }
  }
}

module.exports = internals;
