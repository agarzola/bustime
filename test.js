var apiObj = {
  key: '',
  host: 'bustracker.gocarta.org'
}

var bustime = require('./index')(apiObj);

var reqObj = {
  // rt: '1', // optional, not available w/vid
  // dir: '1'
  // tmres: 's' // optional, defaults to 'm'
  services: {
    validate: true
  }
}

bustime.collectRoutesAndStops(function (err, result) {
  err ? console.trace(err) : console.trace(result);
});
