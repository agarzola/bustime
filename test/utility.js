var assert   = require('assert'),
    should   = require('should'),
    utility = require('../lib/modules/utility')
    ;

describe('Utility', function () {
  it('should produce a collection of routes', function (done) {
    utility.collectRoutes(function (result) {
      if (err) return done(err);
      result.should.have.property('route');
      done();
    });
  });
});
