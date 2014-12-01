var should   = require('should'),
    Joi      = require('joi'),
    sinon    = require('sinon'),
    requests = require('../lib/modules/requests')(null),
    utility  = require('../lib/modules/utility')(null)
    ;

describe('Utility', function () {
  var fakeData = {
    route: [
      { rt: '1', rtnm: '1 ALTON PARK', rtclr: '#cc3399' },
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

  before(function () {
    sinon.stub(requests, 'specialMethod').callsArgWithAsync(2, null, fakeData);
    // this is not working; waiting on answer:
    // http://stackoverflow.com/questions/27197613/how-do-i-sinon-stub-a-nested-method-with-a-callback
  });

  it('should produce a collection of routes with embedded directions and stops', function (done) {
    // This test can take a bit of time when calling the server:
    this.timeout(4000);
    utility.collectRoutesAndStops(function (err, result) {
      if (err) return done(err);
      var schema = Joi.array().includes(Joi.object().keys({
        rt: Joi.string().required(),
        rtnm: Joi.string().required(),
        rtclr: Joi.string().required(),
        dir: Joi.array().includes(Joi.object().keys({
          id: Joi.string(),
          stops: Joi.array().includes(Joi.object()).required()
        })).required()
      }));
      Joi.validate(result.route, schema, function (err, validated) {
        done(err);
      });
    });
  });

  after(function () { requests.specialMethod.restore(); });
});
