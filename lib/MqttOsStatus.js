"use strict"

/**
 * Module dependencies.
 */

var os        = require('os');
var program   = require('commander');
var Mqtt      = require('mqtt');
var pkg       = require('../package.json');
var version   = pkg.version;

// CLI

program
  .version(version)
  .usage('[options] [dir]')
  .option('-h, --host [host]', 'MQTT Broker [host]', '127.0.0.1')
  .option('-p, --port [port]', 'MQTT Broker [port]', 1883)
  .option('-u, --username [username]', 'MQTT [username]')
  .option('-P, --pwd [pwd]', 'MQTT [password]')
  .option('-t, --topicRoot [topicRoot]', 'A topic root to prepend to publishing topic.')
  .option('-d, --delay [delay]', 'Delay between each publishing in seconds', 60)
  .parse(process.argv);

/**
 * :topicRoot/:hostname/os
 * :topicRoot/:hostname/os/uptime
 * :topicRoot/:hostname/os/loadavg
 * :topicRoot/:hostname/os/mem
 * :topicRoot/:hostname/os/cpus
 * :topicRoot/:hostname/os/networkInterfaces
 * :topicRoot/:hostname/os/_presence
 */


var root = (program.topicRoot !== undefined ? (program.topicRoot + '/') : '') + os.hostname() + '/os';

process.on('exit', function(){
  console.log('quitting');
});

/**
 * Exit with the given `str`.
 *
 * @param {String} str
 */

function abort(str) {
  console.error(str);
  process.exit(1);
}

console.log('Connecting to mqtt broker at ' + program.host + ':' + program.port);
var mqttOptions = {};
if(program.username !== undefined) {
  mqttOptions.username = program.username;
}
if(program.pwd !== undefined) {
  mqttOptions.password = program.pwd;
}
mqttOptions.will = {
  topic: root + '/_presence',
  payload: '0',
  qos: 2,
  retain: true
};

var mqttClient = Mqtt.createClient(program.port, program.host, mqttOptions);

mqttClient.publish(root + '/_presence', '1', {retain: true});

function staticInfo() 
{
  return {
    hostname: os.hostname(),
    type: os.type(),
    endianness: os.endianness(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release()
  }
}

function publish() {
  console.log('publishing...');
  mqttClient.publish(root, JSON.stringify({
    hostname: os.hostname(),
    type: os.type(),
    endianness: os.endianness(),
    platform: os.platform(),
    arch: os.arch(),
    release: os.release()
  }), {retain: true});
  mqttClient.publish(root + '/uptime', JSON.stringify(os.uptime()), {retain: true});
  mqttClient.publish(root + '/loadavg', JSON.stringify(os.loadavg()), {retain: true});
  mqttClient.publish(root + '/mem', JSON.stringify({ totalmem: os.totalmem(), freemem: os.freemem() }), {retain: true});
  mqttClient.publish(root + '/cpus', JSON.stringify(os.cpus()), {retain: true});
  mqttClient.publish(root + '/networkInterfaces', JSON.stringify(os.networkInterfaces()), {retain: true});
};
publish();
setInterval(publish, program.delay * 1000);

