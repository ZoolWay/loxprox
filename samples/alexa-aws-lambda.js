/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This skill utilizes AWS IoT.
 **/

'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

var config = {};
config.IOT_BROKER_ENDPOINT = "CUSTOM.iot.eu-central-1.amazonaws.com".toLowerCase();
config.IOT_BROKER_REGION = "eu-central-1";
config.IOT_THING_NAME = "loxprox";

AWS.config.region = config.IOT_BROKER_REGION;
var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'LaunchRequest': function() {
      this.emit(':tell', 'Willkommen bei Loxone');
    },
    'LightOn': function () {
        var payload = {
            signal: 'light-on'
        };
        var params = {
          topic: 'messages',
          qos: 0,
          payload: JSON.stringify(payload)
        };
        iotData.publish(params);
        this.emit(':tell', 'Licht eingeschaltet');
    },
    'LightOff': function () {
        var payload = {
            signal: 'light-off'
        };
        var params = {
          topic: 'messages',
          qos: 0,
          payload: JSON.stringify(payload)
        };
        iotData.publish(params);
        this.emit(':tell', 'Licht eingeschaltet');
    },    
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Auf Wiedersehen!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Auf Wiedersehen!');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', 'Auf Wiedersehen!');
    },
    'Unhandled': function () {
        this.emit(':tell', 'Es ist ein Fehler aufgetreten!');
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
