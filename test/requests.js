var should     = require('should'),
    proxyquire = require('proxyquire')
    ;

describe('Results', function () {
  it('should return an object', function (done) {
    var requests = require('../lib/modules/requests')(null)
    requests.should.be.an.instanceOf(Object);
    done();
  });
});
