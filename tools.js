let os = require('os');

function getIpAddresses() {

    let ifList = [];
    let ifaces = os.networkInterfaces();

    Object.keys(ifaces).forEach(function (ifname) {
        let alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                ifList.push(`${ifname}:${alias} ${iface.address}`);
            } else {
                // this interface has only one ipv4 adress
                ifList.push(`${ifname} ${iface.address}`);
            }
            ++alias;
        });
    });

    return ifList;
}

module.exports = {
    getIpAddresses: getIpAddresses
}