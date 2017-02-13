let awsIot = require('aws-iot-device-sdk');
let fs = require('fs');
let url = require('url');
let http = require('http');

let awsIotConfg = JSON.parse(fs.readFileSync('./config/aws-iot.json', 'UTF-8'));
let messagesConfig = JSON.parse(fs.readFileSync('./config/messages.json', 'UTF-8'));

console.log('starting loxprox \\o/');

let device = awsIot.device({
    keyPath: awsIotConfg.keyPath,
    certPath: awsIotConfg.certPath,
    caPath: awsIotConfg.caPath,
    clientId: awsIotConfg.clientId,
    region: awsIotConfg.region
});

device.on('connect', function() {
    console.log('connected');
    device.subscribe('messages');
    device.publish('devices', 'i am online');
});

device.on('disconnect', function() {
    console.log('diconnected');
});

device.on('message', function(topic, payload) {
    console.log(`got message on topic '${topic}':`, payload.toString());
    try {
        if (topic == 'messages') {
            let data = JSON.parse(payload.toString());
            let signal = data.signal;
            if (signal) {
                if (messagesConfig[signal]) {
                    let mUrl = messagesConfig[signal];
                    let parsedUrl = url.parse(mUrl);
                    console.log(`configured URL for signal '${signal}': ${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.path}`);
                    let options = {
                        host: parsedUrl.host,
                        port: parsedUrl.port,
                        path: parsedUrl.path,
                        auth: parsedUrl.auth,
                        method: 'GET'
                    };
                    console.log('starting request');
                    var request = http.request(options, function(response) {
                        console.log('response status code:', response.statusCode);
                    });
                    request.end();
                } else {
                    console.log('No URL configured for signal');
                }
            } else {
                console.log('message contains no signal');
            }
        }
    } catch (err) {
        console.error('Error while working on message:', err);
    }
});