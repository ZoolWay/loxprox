let awsIot = require('aws-iot-device-sdk');
let fs = require('fs');
let sp = require('./signal-processor.js');
let tools = require('./tools');
let winston = require('winston');
winston.configure({
    level: 'debug',
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return new Date().toISOString();
            },
            formatter: function (options) {
                // - Return string will be passed to logger.
                // - Optionally, use options.colorize(options.level, <string>) to
                //   colorize output based on the log level.
                return options.timestamp() + ' ' +
                    winston.config.colorize(options.level, options.level.toUpperCase()) + ' ' +
                    (options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            }
        })
    ]
})

let awsIotConfg = JSON.parse(fs.readFileSync('./config/aws-iot.json', 'UTF-8'));

winston.info('starting loxprox \\o/');

let signalProcessor = new sp.SignalProcessor('./config/messages.json', winston);
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
    winston.info('connected');
    device.subscribe(awsIotConfg.signalTopic);
});

device.on('reconnect', function () {
    winston.info('reconnected');
});

device.on('close', function () {
    winston.info('connection closed');
});

device.on('offline', function () {
    winston.info('offline');
});

device.on('error', function () {
    winston.error('cannot connect');
});

device.on('message', function (topic, payload) {
    winston.debug(`got message on topic '${topic}':`, payload.toString());
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
                winston.warn('message contains no signal and no command');
            }
        }
    } catch (err) {
        winston.error('Error while working on message:', err);
    }
});