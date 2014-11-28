var should    = require('should'),
    Joi       = require('joi'),
    internals = require('../lib/modules/internals')
    ;

describe('Internals:', function () {
  before(function () {
    singleObj = {
      foo: 'bar'
    }
    arrayOfObj = [
      { zed: 'safe' },
      { dead: 'zone' },
      { always: 'sunny' }
    ]
  });

  describe('singleObjectIntoArray():', function () {
    it('should return an array of objects', function (done) {
      internals.singleObjectIntoArray(singleObj, function (result) {
        result.should.be.an.instanceOf(Array).and.have.lengthOf(1);
      });
      internals.singleObjectIntoArray(arrayOfObj, function (result) {
        result.should.be.an.instanceOf(Array).and.have.lengthOf(3);
      });
      done();
    });
  });

  describe('actOnArrayOrSingleItem():', function () {
    it('should perform function on a single object', function (done) {
      internals.actOnArrayOrSingleItem(singleObj, function (result) {
        done(); // The fact that done() gets called is proof enough.
      });
    });
    it('should perform function on an array of objects', function (done) {
      var counter = 0;
      internals.actOnArrayOrSingleItem(arrayOfObj, function (result) {
        counter++;
      });
      counter.should.equal(3);
      done();
    });
  });
});
