var should   = require('should'),
    Joi      = require('joi'),
    utility  = require('../lib/modules/utility')
    ;

describe('Utility', function () {
  it('should produce a collection of routes', function (done) {
    utility.collectRoutesAndStops(function (err, result) {
      if (err) return done(err);
      var schema = Joi.array().includes(Joi.object().keys({
        rt: Joi.string().required(),
        rtnm: Joi.string().required(),
        rtclr: Joi.string().required(),
        dir: Joi.array().includes(Joi.object().keys({
          stops: Joi.array().includes(Joi.string()).required()
        })).required()
      }));
      Joi.validate(result, schema, function (err, validated) {
        done(err);
      });
    });
  });
});
