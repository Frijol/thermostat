var threshold = 80; // degrees F (Tessel climate runs hot)

require('tesselate') ({
  modules: {
    A: ['relay-mono', 'relay'],
    B: ['climate-si7020', 'climate']
  },
  development: true
}, function (tessel, m) {
  var on = m.relay.getState(1);
  setInterval(function loop () {
    m.climate.readTemperature('f', function (err, temp) {
      if (!on && temp < threshold) {
        m.relay.turnOn(1, function (err) {
          if (!err) {
            on = true;
          }
        });
      } else if (on && temp > threshold) {
        m.relay.turnOff(1, function (err) {
          on = false;
        });
      }
    });
  }, 3000);
});
