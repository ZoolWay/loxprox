let awsIot = require('aws-iot-device-sdk');
let fs = require('fs');
let sp = require('./signal-processor.js');
let tools = require('./tools');

let awsIotConfg = JSON.parse(fs.readFileSync('./config/aws-iot.json', 'UTF-8'));

console.log('starting loxprox \\o/');

let signalProcessor = new sp.SignalProcessor('./config/messages.json');
signalProcessor.init();

let device = awsIot.device({
    keyPath: awsIotConfg.keyPath,
    certPath: awsIotConfg.certPath,
    caPath: awsIotConfg.caPath,
    clientId: awsIotConfg.clientId,
    region: awsIotConfg.region,
    maximumReconnectTimeMs: 300000 // 300s = 5min
});

device.on('connect', function () {
    console.log('connected');
    device.subscribe(awsIotConfg.signalTopic);
});

device.on('reconnect', function () {
    console.log('reconnected');
});

device.on('close', function () {
    console.log('connection closed');
});

device.on('offline', function () {
    console.log('offline');
});

device.on('error', function () {
    console.error('cannot connect');
});

device.on('message', function (topic, payload) {
    console.log(`got message on topic '${topic}':`, payload.toString());
    try {
        if (topic == awsIotConfg.signalTopic) {
            let performedAnything = false;
            let data = JSON.parse(payload.toString());

            if (data.signal) {
                signalProcessor.process(data.signal);
                performedAnything = true;
            }

            if (data.command) {
                if (data.command == 'marco') {
                    device.publish(awsIotConfg.signalTopic, JSON.stringify({
                        command: 'polo',
                        localNetwork: tools.getIpAddresses(),
                        version: 1
                    }));
                }
                performedAnything = true;
            }

            if (!performedAnything) {
                console.log('message contains no signal and no command');
            }
        }
    } catch (err) {
        console.error('Error while working on message:', err);
    }
});