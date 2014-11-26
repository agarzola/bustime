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
      localestring: valid.string,
      services: Joi.object().keys({
        validate: valid.boolean,
        moment: valid.boolean
      }),
      // forbid format setting:
      format: valid.forbidden
    });

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for vehicles method:
  vehicles: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: valid.stringOrNumber, // must be a String or a Number
      vid: valid.stringOrNumber, // must be a String or a Number
      localestring: valid.string,
      tmres: valid.number,
      services: Joi.object().keys({
        validate: valid.boolean
      }),
      // forbid format setting:
      format: valid.forbidden
    }).xor('rt', 'vid'); // mutually exclusive, one must be present

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for routes method:
  routes: function (reqObj, callback) {
    var schema = Joi.object().keys({
      localestring: valid.string,
      services: Joi.object().keys({
        validate: valid.boolean
      }),
      // forbid format setting:
      format: valid.forbidden
    });

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for directions method:
  directions: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: valid.stringOrNumberRequired,
      localestring: valid.string,
      services: Joi.object().keys({
        validate: valid.boolean
      }),
      // forbid format setting:
      format: valid.forbidden
    });

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for stops method:
  stops: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: valid.stringOrNumberRequired,
      dir: valid.stringOrNumberRequired,
      localestring: valid.string,
      services: Joi.object().keys({
        validate: valid.boolean
      }),
      // forbid format setting:
      format: valid.forbidden
    });

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for patterns method:
  patterns: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: valid.stringOrNumber,
      pid: valid.stringOrNumber,
      localestring: valid.string,
      services: Joi.object().keys({
        validate: valid.boolean
      }),
      // forbid format setting:
      format: valid.forbidden
    }).xor('rt', 'pid'); // mutually exclusive, one must be present

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for predictions method:
  predictions: function (reqObj, callback) {
    var schema = Joi.object().keys({
      vid: valid.stringOrNumber,
      stpid: valid.stringOrNumber,
      rt: valid.stringOrNumber,
      top: valid.number,
      localestring: valid.string,
      tmres: valid.string,
      services: Joi.object().keys({
        validate: valid.boolean,
        calculateETA: valid.boolean
      }),
      // forbid format setting:
      format: valid.forbidden
    }).xor('stpid', 'vid').with('rt', 'stpid'); // mutually exclusive, one must be present; rt requires stpid

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  },

  // Set validation schema for serviceBulletins method:
  serviceBulletins: function (reqObj, callback) {
    var schema = Joi.object().keys({
      rt: valid.stringOrNumber,
      rtdir: valid.stringOrNumber,
      stpid: valid.stringOrNumber,
      localestring: valid.string,
      services: Joi.object().keys({
        validate: valid.boolean
      }),
      // forbid format setting:
      format: valid.forbidden
    }).or('rt', 'stpid').with('rtdir', 'rt'); // one must be present; rtdir requires rt

    // Send request and schema to be validated:
    this.validation(reqObj, schema, callback);
  }
}

var valid = {
  string: Joi.string(),
  number: Joi.number(),
  stringOrNumber: Joi.alternatives().try(Joi.string(), Joi.number()),
  stringOrNumberRequired: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  boolean: Joi.boolean(),
  forbidden: Joi.any().forbidden()
}

if (typeof(module) !== 'undefined') {
  module.exports = validate;
}
