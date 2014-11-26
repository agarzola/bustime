var Joi = require('joi')
    ;

var validate = {
  validation: function (reqObj, schema, callback) {
    if (reqObj && reqObj.services && reqObj.services.validate === false) {
      typeof(callback) === 'function' ? callback(null, reqObj) : false;
    } else {
      Joi.validate(reqObj, schema, function (err, result) {
        typeof(callback) === 'function' ? callback(err, result) : false;
      });
    }
  },

  // Set validation schema for time method:
  time: function (reqObj, callback) {
    var schema = Joi.object().keys({
      localestring: Joi.string(),
      services: Joi.object().keys({
        validate: Joi.boolean(),
        moment: Joi.boolean()
      }),
      // forbid format setting:
      format: Joi.any().forbidden()
    });

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for vehicles method:
  vehicles: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: Joi.alternatives().try(Joi.string(), Joi.number()), // must be a String or a Number
      vid: Joi.alternatives().try(Joi.string(), Joi.number()), // must be a String or a Number
      localestring: Joi.string(),
      tmres: Joi.string(),
      services: Joi.object().keys({
        validate: Joi.boolean()
      }),
      // forbid format setting:
      format: Joi.any().forbidden()
    }).xor('rt','vid'); // mutually exclusive, one must be present

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for routes method:
  routes: function (reqObj, callback) {
    var schema = Joi.object().keys({
      localestring: Joi.string(),
      services: Joi.object().keys({
        validate: Joi.boolean()
      }),
      // forbid format setting:
      format: Joi.any().forbidden()
    });

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for directions method:
  directions: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      localestring: Joi.string(),
      services: Joi.object().keys({
        validate: Joi.boolean()
      }),
      // forbid format setting:
      format: Joi.any().forbidden()
    });

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for stops method:
  stops: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      dir: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
      localestring: Joi.string(),
      services: Joi.object().keys({
        validate: Joi.boolean()
      }),
      // forbid format setting:
      format: Joi.any().forbidden()
    });

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for patterns method:
  patterns: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: Joi.alternatives().try(Joi.string(), Joi.number()),
      pid: Joi.alternatives().try(Joi.string(), Joi.number()),
      localestring: Joi.string(),
      services: Joi.object().keys({
        validate: Joi.boolean()
      }),
      // forbid format setting:
      format: Joi.any().forbidden()
    }).xor('rt','pid'); // mutually exclusive, one must be present

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for predictions method:
  predictions: function (reqObj, callback) {
    var schema = Joi.object().keys({
      vid: Joi.alternatives().try(Joi.string(), Joi.number()),
      stpid: Joi.alternatives().try(Joi.string(), Joi.number()),
      rt: Joi.alternatives().try(Joi.string(), Joi.number()),
      top: Joi.number(),
      localestring: Joi.string(),
      tmres: Joi.string(),
      services: Joi.object().keys({
        validate: Joi.boolean(),
        calculateETA: Joi.boolean()
      }),
      // forbid format setting:
      format: Joi.any().forbidden()
    }).xor('stpid','vid').with('rt', 'stpid'); // mutually exclusive, one must be present; rt requires stpid

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for serviceBulletins method:
  serviceBulletins: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: Joi.alternatives().try(Joi.string(), Joi.number()),
      rtdir: Joi.alternatives().try(Joi.string(), Joi.number()),
      stpid: Joi.alternatives().try(Joi.string(), Joi.number()),
      localestring: Joi.string(),
      services: Joi.object().keys({
        validate: Joi.boolean()
      }),
      // forbid format setting:
      format: Joi.any().forbidden()
    }).or('rt','stpid').with('rtdir', 'rt'); // one must be present; rtdir requires rt

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  }
}

if (typeof(module) !== 'undefined') {
  module.exports = validate;
}
