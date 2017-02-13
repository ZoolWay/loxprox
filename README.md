# loxprox

> NodeJS-based proxy for AWS IoT calling WebServices (Loxone, e.g.) on LAN

Loxprox is a simple NodeJS based application which will connect itself as an
AWS IoT device to your AWS IoT hub. Its purpose is to receive configureable
message signals which trigger simple HTTP GET calls in the network loxprox
is running on.

This way, by receiving signals from a topic on the AWS IoT hub/bus, another
IoT device or AWS cloud application can call URLs on loxprox'
 **local area network** (LAN).

It was designed to enable an Alexa Skill running on AWS Lambda to call URLs
in my personal LAN to control my Loxone home automation system.

## Running

Copy `aws-iot.example.json` as `aws-iot.json` and set *device-id*, *region*
and certificate settings appropiate. You get the certs with a SDK download
from the AWS IoT page when creating a device there.

Copy `messages.example.json` as `messages.json` to configure mappings
between signals and URLs to call on loxprox' LAN.

Put all together in a NodeJS environment and auto-launch it on every boot.