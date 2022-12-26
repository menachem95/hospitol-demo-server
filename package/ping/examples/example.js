// -------- example -----------------------

'use strict';

import { sys } from '../index';

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];
hosts.forEach(function (host) {
    // Running with default config
    sys.probe(host, function (isAlive) {
        var msg = isAlive ?
            'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    });

    // Running with custom config
    sys.probe(host, function (isAlive) {
        var msg = isAlive ?
            'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    }, {extra: ['-i', '2']});

    // Running ping with some default argument gone
    sys.probe(host, function (isAlive) {
        var msg = isAlive ?
            'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    }, {extra: ['-i', '2'], timeout: false});
});

