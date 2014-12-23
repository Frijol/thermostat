thermostat
==========

Tessel thermostat. Reads the temperature and turns a heater on and off based on comparison of temperature to a threshold value.

You can see the threshold value by going to Tessel's IP address : the port you're listening on.

IP:port/integer will change the threshold value to the integer.

## Materials

* [Tessel](//tessel.io)
* [Relay Module](//tessel.io/modules#module-relay)
* [Climate Module](//tessel.io/modules#module-climate)
* Heater that you can hook up to a relay (ours came that way)

## Instructions

1. Clone this repo
1. `npm install` to install dependencies
1. In `index.js`, set the wifi settings to your local network and the threshold to your preferred temperature (in F).
1. `tessel run index.js` to test it out
1. `tessel push index.js` to push the code into Flash memory, disconnect from the computer, and power the Tessel ([like this](https://tessel.io/docs/untethered))
