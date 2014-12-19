var should   = require('should'),
    Joi      = require('joi'),
    proxyquire = require('proxyquire').noPreserveCache()
    ;

describe('Utility', function () {
  var fakeData = {
    route: [
      { rt: '7', rtnm: '1 ALTON PARK', rtclr: '#cc3399' },
      { rt: '2', rtnm: '2 NORTH CHATTANOOGA', rtclr: '#ff6699' },
      { rt: '4', rtnm: '4 EASTGATE/HAMILTON PL', rtclr: '#cc0033' }
    ],
    dir: ['0', '1'],
    stop: [
      { stpid: '276',
        stpnm: '3RD + CENTRAL',
        lat: '35.046800967885',
        lon: '-85.287814736366' },
      { stpid: '287',
        stpnm: '3RD + CHERRY',
        lat: '35.053585954057',
        lon: '-85.308424830437' },
      { stpid: '280',
        stpnm: '3RD + COLLINS',
        lat: '35.04952820483',
        lon: '-85.294343233109' }
    ]
  }

  describe('collectRoutesAndStops()', function () {
    it('should produce an array of routes with embedded directions and stops', function (done) {
      this.timeout(10000);
      var utilityObj = proxyquire('../lib/utility', {
                      './requests': function () {
                        return {
                          specialMethod: function (a, b, c) {
                            c(null, fakeData);
                          }
                        }
                      },
                      '@runtimeGlobal': true
                    });

      var utility = utilityObj(null);
      utility.collectRoutesAndStops(function (err, result) {
        if (err) {
          return done(err);
        } else {
          var schema = Joi.array().includes(Joi.object().keys({
            rt: Joi.string().required(),
            rtnm: Joi.string().required(),
            rtclr: Joi.string().required(),
            dir: Joi.array().includes(Joi.object().keys({
              id: Joi.string(),
              stops: Joi.array().includes(Joi.object()).required()
            })).required()
          }));
          Joi.validate(result, schema, function (err, validated) {
            done(err);
          });
        }
      });
    });

    it('should produce an object of routes with embedded directions and stops', function (done) {
      this.timeout(10000);
      var utilityObj = proxyquire('../lib/utility', {
                      './requests': function () {
                        return {
                          specialMethod: function (a, b, c) {
                            c(null, fakeData);
                          }
                        }
                      },
                      '@runtimeGlobal': true
                    });

      var utility = utilityObj(null);
      utility.collectRoutesAndStops(function (err, result) {
        if (err) {
          return done(err);
        } else {
          var schema = Joi.object().keys({
            '7': Joi.object().keys({
              rt: Joi.string().required(),
              rtnm: Joi.string().required(),
              rtclr: Joi.string().required(),
              dir: Joi.array().includes(Joi.object().keys({
                id: Joi.string(),
                stops: Joi.array().includes(Joi.object()).required()
              })).required()
            }),
            '2': Joi.object().keys({
              rt: Joi.string().required(),
              rtnm: Joi.string().required(),
              rtclr: Joi.string().required(),
              dir: Joi.array().includes(Joi.object().keys({
                id: Joi.string(),
                stops: Joi.array().includes(Joi.object()).required()
              })).required()
            }),
            '4': Joi.object().keys({
              rt: Joi.string().required(),
              rtnm: Joi.string().required(),
              rtclr: Joi.string().required(),
              dir: Joi.array().includes(Joi.object().keys({
                id: Joi.string(),
                stops: Joi.array().includes(Joi.object()).required()
              })).required()
            }),
          });
          Joi.validate(result, schema, function (err, validated) {
            done(err);
          });
        }
      }, { format: 'object' });
    });

    it('should return an error if specialMethod() results in error', function (done) {
      var utilityObj = proxyquire('../lib/utility', {
                      './requests': function () {
                        return {
                          specialMethod: function (a, b, c) {
                            c('not null', null);
                          }
                        }
                      },
                      '@runtimeGlobal': true
                    });

      var utility = utilityObj(null);
      utility.collectRoutesAndStops(function (err, result) {
        err.should.not.equal(null);
        done();
      });
    });
  });

  describe('insertDirections()', function () {
    it('should return an error if specialMethod() results in error', function (done) {
      var utilityObj = proxyquire('../lib/utility', {
                      './requests': function () {
                        return {
                          specialMethod: function (a, b, c) {
                            c('not null', null);
                          }
                        }
                      },
                      '@runtimeGlobal': true
                    });

      var utility = utilityObj(null);
      utility.insertDirections({ route: ['rt1', 'rt2'] }, function (err, result) {
        err.should.not.equal(null);
      });
      done();
    });
  });

  describe('insertStops()', function () {
    it('should return an error if specialMethod() results in error', function (done) {
      var utilityObj = proxyquire('../lib/utility', {
                      './requests': function () {
                        return {
                          specialMethod: function (a, b, c) {
                            c('not null', null);
                          }
                        }
                      },
                      '@runtimeGlobal': true
                    });

      var utility = utilityObj(null);
      utility.insertStops({ route: [{ dir: ['0', '1'] }, { dir: ['0', '1'] }] }, function (err, result) {
        err.should.not.equal(null);
      });
      done();
    });

    it('should return an empty stops array when specialMethod() returns no stops', function (done) {
      var fakeData = { error: [] };
      var utilityObj = proxyquire('../lib/utility', {
                      './requests': function () {
                        return {
                          specialMethod: function (a, b, c) {
                            c(null, fakeData);
                          }
                        }
                      },
                      '@runtimeGlobal': true
                    });

      var utility = utilityObj(null);
      utility.insertStops({ route: [{ dir: [{id: '0', stops: []}] }]}, function (err, result) {
        result.route[0].dir[0].stops.should.be.an.instanceOf(Array);
        result.route[0].dir[0].stops.length.should.equal(0);
        done();
      });
    });
  });
});
