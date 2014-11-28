var should   = require('should'),
    Joi      = require('joi'),
    utility  = require('../lib/modules/utility')
    ;

describe('Utility', function () {
  it('should produce a collection of routes', function (done) {
    utility.collectRoutes(function (err, result) {
      if (err) return done(err);
      var schema = Joi.array().includes(Joi.object());
      Joi.validate(result, schema, function (err, validated) {
        done(err);
      });
    });
  });
});
