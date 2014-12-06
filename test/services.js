var should = require('should'),
    services = require('../lib/services'),
    result, reqObj
    ;

// SERVICES
describe('Services:', function () {
  before(function () {
    mockResult = {
      tm: '20141201 10:58',
      prd:{
        tmstmp: '20141201 10:58',
        prdtm: '20141201 11:01'
      }
    }
    reqObj = {
      services: {
        calculateETA: true,
        moment: true
      }
    }
  });

  it('should return the callback when no services are requested', function (done) {
    var count = 0;
    for (key in services) {
      if (services.hasOwnProperty(key)) {
        services[key](null, mockResult, function (err, processed) {
          count++;
        });
      }
    }
    count.should.equal(Object.keys(services).length);
    done();
  });

  describe('calculateETA:', function () {
    it('should produce an `eta` property', function (done) {
      services.predictions(reqObj, mockResult, function (err, processed) {
        if (err) done(err);
        processed.prd.should.have.property('eta');
        done();
      });
    });

    it('should calculate 3m in milliseconds (180000)', function (done) {
      services.predictions(reqObj, mockResult, function (err, processed) {
        if (err) done(err);
        processed.prd.eta.should.equal(180000);
        done();
      });
    });
  });

  describe('moment:', function () {
    it('should produce a `moment` property', function (done) {
      services.time(reqObj, mockResult, function (err, processed) {
        if (err) done(err);
        processed.should.have.property('moment');
        done();
      });
    });
  });
});
