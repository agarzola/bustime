var should   = require('should'),
    Joi      = require('joi'),
    validate = require('../lib/validate'),
    methods  = [ 'time', 'vehicles', 'routes', 'directions',
                'stops', 'patterns', 'predictions', 'serviceBulletins' ],
    schema   = Joi.object().keys({ notBogusProperty: Joi.any() }),
    reqObj, reqObjBypass, schema
    ;

// VALIDATION
describe('Validation:', function () {

  before(function () {
    reqObj = {
      bogusProperty: '123'
    }
    reqObjBypass = {
      bogusProperty: '123',
      services: {
        validate: false
      }
    }
  });

  describe('general validation:',function () {
    // All validation methods delegate to generic .validation() method
    it('validate.validation() should reject bogus property', function (done) {
      validate.validation(reqObj, schema, function (err, validatedObj) {
        should.exist(err);
        done();
      });
    });

    // All validation methods delegate to generic .validation() method
    it('validate.validation() method should ignore bogus property', function (done) {
      validate.validation(reqObjBypass, schema, function (err, validatedObj) {
        if (err) return done(err);
        should.not.exist(err);
        done();
      });
    });
  });

  describe('forbidden properties:', function () {

    before(function () {
      reqObj['format'] = 'json';
    });

    methods.forEach(function (method) {
      it('validate.' + method + '() should reject forbidden `format` property', function (done) {
        validate[method](reqObj, function (err, validatedObj) {
          should.exist(err);
          done();
        });
      });
    });

  });

});
