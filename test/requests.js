var should     = require('should'),
    proxyquire = require('proxyquire').noPreserveCache(),
    sinon      = require('sinon')
    ;

describe('Requests', function () {
  it('should return an object', function (done) {
    var requests = require('../lib/requests')(null);
    requests.should.be.an.instanceOf(Object);
    done();
  });

  describe('specialMethod()', function () {
    describe('calling internal methods', function () {
      var validateCalled = false,
          servicesCalled = false,
          genericCalled = false,
          requestsObj = proxyquire('../lib/requests', {
                    './validate': {
                      bogusMethod: function (b, c) {
                        validateCalled = true;
                        c(null, 'validated');
                      }
                    },
                    './services': {
                      bogusMethod: function (a, b, c) {
                        servicesCalled = true;
                        c(null, 'serviced');
                      }
                    },
                    '@runtimeGlobal': true
                  });
      var requests = requestsObj(null);
      sinon.stub(requests, 'genericMethod', function (a, b, c) {
        genericCalled = true;
        c(null, true);
      });

      it('should call validate[method]()', function (done) {
        requests.specialMethod('bogusMethod', null, function (err, result) {
          validateCalled.should.equal(true);
          done();
        });
      });

      it('should call requests.genericMethod()', function (done) {
        requests.specialMethod('bogusMethod', null, function (err, result) {
          genericCalled.should.equal(true);
          done();
        });
      });

      it('should call services[method]()', function (done) {
        requests.specialMethod('bogusMethod', null, function (err, result) {
          servicesCalled.should.equal(true);
          done();
        });
      });
    });

    describe('returning errors', function () {
      it('should return a validation error', function (done) {
        var requestsObj = proxyquire('../lib/requests', {
                      './validate': {
                        bogusMethod: function (b, c) {
                          validateCalled = true;
                          c('validation error', null);
                        }
                      },
                      '@runtimeGlobal': true
                    });
        var requests = requestsObj(null);
        requests.specialMethod('bogusMethod', null, function (err, result) {
          err.should.equal('validation error');
          done();
        });
      });

      it('should return an http request error', function (done) {
        var requestsObj = proxyquire('../lib/requests', {
                      './validate': {
                        bogusMethod: function (b, c) {
                          validateCalled = true;
                          c(null, 'validated');
                        }
                      },
                      '@runtimeGlobal': true
                    });
        var requests = requestsObj(null);
        sinon.stub(requests, 'genericMethod', function (a, b, c) {
          genericCalled = true;
          c('http request error', null);
        });
        requests.specialMethod('bogusMethod', null, function (err, result) {
          err.should.equal('http request error');
          done();
        });
      });

      it('should return a servicing error', function (done) {
        var requestsObj = proxyquire('../lib/requests', {
                      './validate': {
                        bogusMethod: function (b, c) {
                          validateCalled = true;
                          c(null, 'validated');
                        }
                      },
                      './services': {
                        bogusMethod: function (a, b, c) {
                          servicesCalled = true;
                          c('servicing error', null);
                        }
                      },
                      '@runtimeGlobal': true
                    });
        var requests = requestsObj(null);
        sinon.stub(requests, 'genericMethod', function (a, b, c) {
          c(null, true);
        });
        requests.specialMethod('bogusMethod', null, function (err, result) {
          err.should.equal('servicing error');
          done();
        });
      });
    });
  });

  describe('genericMethod()', function () {
    var fakeAPIobj = {
      host: 'bogus.host.yay'
    }
    var requests = require('../lib/requests')(fakeAPIobj),
        fakeAPIresponse = '<bustime-response>'
                        + '<error>'
                        + '<rt>5</rt>'
                        + '<dir>\'ROUND TRIP\'</dir>'
                        + '<msg>No data found for parameters</msg>'
                        + '</error>'
                        + '</bustime-response>'
        ;

    it('should return a valid object', function (done) {
      sinon.stub(requests, 'queryAPI', function (b, c) {
        c(null, fakeAPIresponse);
      });
      requests.genericMethod('bogus', null, function (err, result) {
        result.should.be.an.instanceOf(Object);
        done();
      });
      requests.queryAPI.restore();
    });

    it('should return an error from the server', function (done) {
      sinon.stub(requests, 'queryAPI', function (b, c) {
        c('not null', null);
      });
      requests.genericMethod('bogus', null, function (err, result) {
        err.should.not.equal(null);
        done();
      });
    })
  });
});
