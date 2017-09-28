let fs = require('fs');
let url = require('url');
let http = require('http');

class SignalProcessor {

    constructor(configFilename, winston) {
        this.messagesConfig = {};
        this.configFilename = configFilename;
        this.winston = winston;
    }

    init() {
        this.messagesConfig = JSON.parse(fs.readFileSync(this.configFilename, 'UTF-8'));
        this.winston.info(`Initialized with ${Object.keys(this.messagesConfig).length} signals from configuration file`);
    }

    process(signal) {
        if (this.messagesConfig[signal]) {
            let mUrl = this.messagesConfig[signal];
            let parsedUrl = url.parse(mUrl);
            this.winston.verbose(`Signal '${signal}' triggers: ${parsedUrl.protocol}//${parsedUrl.host}${parsedUrl.path}`);
            let options = {
                host: parsedUrl.host,
                port: parsedUrl.port,
                path: parsedUrl.path,
                auth: parsedUrl.auth,
                method: 'GET'
            };
            this.winston.debug('starting request');
            var me = this;
            var request = http.request(options, function (response) {
                me.winston.debug('response status code:', response.statusCode);
            });
            request.end();
        } else {
            this.winston.warn('No URL configured for signal');
        }
    }

}

module.exports = {
    SignalProcessor: SignalProcessor
};