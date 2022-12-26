var ping = {};

ping.sys = require('./lib/ping-sys');
//ping.pcap = require('./lib/ping-pcap');
ping.promise = require("./lib/ping-promise");

export default ping;
