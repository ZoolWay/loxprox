let fs = require('fs');
let url = require('url');
let http = require('http');

class SignalProcessor {

    constructor(configFilename) {
        this.messagesConfig = {};
        this.configFilename = configFilename;
    }

    init() {
        this.messagesConfig = JSON.parse(fs.readFileSync('./config/messages.json', 'UTF-8'));
    }

    process(signal) {
        if (this.messagesConfig[signal]) {
            let mUrl = this.messagesConfig[signal];
            let parsedUrl = url.parse(mUrl);
            console.log(`Signal '${signal}' triggers: ${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.path}`);
            let options = {
                host: parsedUrl.host,
                port: parsedUrl.port,
                path: parsedUrl.path,
                auth: parsedUrl.auth,
                method: 'GET'
            };
            console.log('starting request');
            var request = http.request(options, function (response) {
                console.log('response status code:', response.statusCode);
            });
            request.end();
        } else {
            console.log('No URL configured for signal');
        }
    }

}

module.exports = {
    SignalProcessor: SignalProcessor
};