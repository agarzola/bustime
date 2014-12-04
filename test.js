var apiObj = {
  key: 'YPnQ3pHW8pP3Phk4Ru9nW5gYq',
  host: 'bustracker.gocarta.org'
}

var bustime = require('./lib/bustime')(apiObj);

var reqObj = {
  // rt: '1', // optional, not available w/vid
  // dir: '1'
  // tmres: 's' // optional, defaults to 'm'
  services: {
    validate: false
  }
}

bustime.patterns(reqObj, function (err, result) {
  err ? console.log(err) : console.log(result);
});
