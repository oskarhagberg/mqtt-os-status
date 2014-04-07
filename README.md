# MQTT OS Status

[Operating-system](http://nodejs.org/api/os.html) related data, published to an
[MQTT](http://mqtt.org) broker at fixed intervals.

Example output

    $  mosquitto_sub -h 192.168.1.5 -t "+/os/#" -v
    pi1/os {"hostname":"jeeves","type":"Linux","endianness":"LE","platform":"linux","arch":"arm","release":"3.10.25+"}
    pi1/os/uptime 142.2680236
    pi1/os/loadavg [1.07421875,0.68212890625,0.271484375]
    pi1/os/mem {"totalmem":508874752,"freemem":396210176}
    pi1/os/cpus [{"model":"unknown","speed":700,"times":{"user":373600,"nice":0,"sys":203500,"idle":547300,"irq":3700}}]
    pi1/os/networkInterfaces {"lo":[{"address":"127.0.0.1","family":"IPv4","internal":true}],"eth0":[{"address":"192.168.1.5","family":"IPv4","internal":false}]}

## Install as a service on Raspberry Pi

These instructions are for Raspbian on Raspberry Pi but could easily be adapted
to most Linux distributions.

[Source](https://www.exratione.com/2013/02/nodejs-and-forever-as-a-service-simple-upstart-and-init-scripts-for-ubuntu/)

Install [forever.js](https://github.com/nodejitsu/forever)

    npm install -g forever

Install this module

    npm install -g mqtt-os-status

Copy the sample etc/init.d/mqtt-os-status file to /etc/init.d and make it
executable. Adjust the directory of your node.js installation if necessary.

    sudo su
    cp /home/pi/node-v0.10.2-linux-arm-pi/lib/node_modules/mqtt-os-status/etc/init.d/mqtt-os-status /etc/init.d/mqtt-os-status
    chmod a+x /etc/init.d/mqtt-os-status

Edit the node binary paths, app paths, username and password, and optional
adjustments to topic root and update inteval in the script as necessary

After putting the script in place, you should update the system service definitions:

    update-rc.d mqtt-os-status defaults

Run or check on the script and its process with the following commands:

    service mqtt-os-status start
    service mqtt-os-status status
    service mqtt-os-status restart
    service mqtt-os-status stop
