var should   = require('should'),
    Joi      = require('joi'),
    sinon    = require('sinon'),
    proxyquire = require('proxyquire')
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

  var utilityObj = proxyquire('../lib/modules/utility', {
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

  // var utility = require('../lib/modules/utility')({key:'',host:'bustracker.gocarta.org'});
  // var fs = require('fs');

  it('should produce a collection of routes with embedded directions and stops', function (done) {
    this.timeout(10000);
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
          // fs.writeFileSync('./testresult.json', JSON.stringify(validated, null, 2));
          done(err);
        });
      }
    });
  });
});
