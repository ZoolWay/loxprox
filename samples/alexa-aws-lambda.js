/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This skill utilizes AWS IoT.
 **/

'use strict';

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

var config = {};
config.IOT_BROKER_ENDPOINT = "<CUSTOM>.iot.<REGION>.amazonaws.com".toLowerCase(); //e.g. region = eu-west-1
config.IOT_BROKER_REGION = "<REGION>";
config.IOT_THING_NAME = "loxprox";
config.IOT_TOPIC = "messages";

AWS.config.region = config.IOT_BROKER_REGION;
var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

function publishSignal(signal, cbOkay, cbError) {
    console.log(`Publishing signal '${signal}' to topic '${config.IOT_TOPIC}'`);
    let payload = {
      signal: signal  
    };
    let params = {
        topic: config.IOT_TOPIC,
        qos: 0,
        payload: JSON.stringify(payload)
    };
    let request = iotData.publish(params, function(err, data) {
        if (err) {
            console.error('Failed to publish to IoT:', err);
            if (cbError) cbError();
        } else {
            if (cbOkay) cbOkay();
        }
    });
}

const handlers = {
    'LaunchRequest': function() {
      this.emit(':tell', 'Willkommen bei Loxone');
    },
    'LightOnIntent': function () {
        publishSignal('light-on', () => this.emit(':tell', 'Licht eingeschaltet'), () => this.emit(':tell', 'Verbindung nicht möglich'));
    },
    'LightOffIntent': function () {
        publishSignal('light-off', () => this.emit(':tell', 'Licht ausgeschaltet'), () => this.emit(':tell', 'Verbindung nicht möglich'));
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