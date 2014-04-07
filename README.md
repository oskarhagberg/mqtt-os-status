# MQTT OS Status

[Operating-system](http://nodejs.org/api/os.html) related data, published to an [MQTT](http://mqtt.org) broker at fixed intervals.

## Install as a service on Raspberry Pi

These instructions are for Raspbian on Raspberry Pi but could easily be adapted to most Linux distributions.

[Source](https://www.exratione.com/2013/02/nodejs-and-forever-as-a-service-simple-upstart-and-init-scripts-for-ubuntu/)

Install [forever.js](https://github.com/nodejitsu/forever)

    npm install -g forever

Copy etc/init.d/mqtt-os-status to /etc/init.d and make it executable

    sudo su
    cp etc/init.d/mqtt-os-status /etc/init.d/mqtt-os-status
    chmod a+x /etc/init.d/mqtt-os-status

Edit the node binary paths and app paths in the script is necessary

After putting the script in place, you should update the system service definitions:

    update-rc.d mqtt-os-status defaults

Run or check on the script and its process with the following commands:

    service mqtt-os-status start
    service mqtt-os-status status
    service mqtt-os-status restart
    service mqtt-os-status stop
