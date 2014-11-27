var assert = require('assert'),
    should = require('should'),
    validate = require('../lib/modules/validate'),
    reqObj
    ;

// VALIDATION
describe('Validation:', function () {
  describe('bogus property:', function () {
    before(function () {
      reqObj = {
        bogusProperty: '123'
      }
    });

    it('time should reject bogus property', function (done) {
      validate.time(reqObj, function (err, validatedObj) {
        should.exist(err);
        done();
      });
    });
  });

  describe('validation bypass:', function () {
    before(function () {
      reqObj = {
        bogusProperty: '123',
        services: {
          validate: false
        }
      }
    });

    it('time should ignore bogus property', function (done) {
      validate.time(reqObj, function (err, validatedObj) {
        if (err) return done(err);
        should.not.exist(err);
        done();
      });
    });
  });
});
