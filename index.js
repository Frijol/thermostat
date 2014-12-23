// Ideal temperature
var threshold = 80; // degrees F (Tessel climate runs hot)

// Wifi settings
var tesselWifi = require('tessel-wifi');
var options = {
  ssid: 'BRINELY',
  password: 'Brinely2011',
};

// Get router
var router = require('tiny-router');

// Local vars
var port = 8080;
var relay;
var climate;
var on; // state variable

// Get the modules ready
require('tesselate') ({
  modules: {
    A: ['relay-mono', 'relay'],
    B: ['climate-si7020', 'climate']
  },
  development: false
}, function (tessel, m) {
  relay = m.relay;
  climate = m.climate;
  on = relay.getState(1);
});

// Start wifi connection
console.log('Connecting...');
var wifi = new tesselWifi(options);

main = function () {
  // Check whether the modules are ready
  if(!relay) {
    console.log('Waiting for modules...');
    setTimeout(function () {
      main();
    }, 1000);
  } else {
    // Start the router
    router.listen(port);
    console.log('Listening at', port);
    // Polling function
    var poll = setInterval(function loop () {
      // Read the temperature
      climate.readTemperature('f', function (err, temp) {
        console.log(temp);
        if (!on && temp < threshold) {
          // If the temperature is below the threshold, turn heater on
          relay.turnOn(1, function (err) {
            if (!err) {
              on = true;
            }
          });
        } else if (on && temp > threshold) {
          // If the temperature is above the threshold, turn heater off
          relay.turnOff(1, function (err) {
            on = false;
          });
        }
      });
    }, 3000);
  }
};

// Wifi handling

wifi.on('connect', function () {
  console.log('Connected.');
  main();
});

wifi.on('disconnect', function () {
  console.warn('Disconnected. Attempting to reconnect...');
  // Stop polling for temperature
  if (poll) {
    clearInterval(poll);
  }
  // Turn off the heater for now
  relay.turnOff(1, function (err) {
    on = false;
  });
});

// Routing
router.get('/', function (req, res) {
  res.send('Tessel temperature threshold set to', threshold + '.', 'To change threshold, go to /<new temperature>');
});

// Change temperature threshold
router.get('/{temperature}', function (req, res) {
  var temperature = parseInt(req.body.temperature);
  threshold = temperature;
  res.redirect('/');
});
