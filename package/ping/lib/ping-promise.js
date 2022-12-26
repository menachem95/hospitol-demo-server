'use strict';

/**
* LICENSE MIT
* (C) Daniel Zelisko
* http://github.com/danielzzz/node-ping
*
* a simple wrapper for ping
* Now with support of not only english Windows.
*
*/

// System library
import { format } from 'util';
import { isIPv6 } from 'net';
import { spawn } from 'child_process';
import { platform as _platform } from 'os';

// 3rd-party library
import { defer, reject } from 'q';
import { each } from 'underscore';

// Our library
import { createBuilder, getExecutablePath } from './builder/factory';
import { createParser } from './parser/factory';

/**
 * Refer to probe()
 */
function _probe(addr, config) {
    // Do not reassign function argument
    var _config = config || {};
    if (_config.v6 === undefined) {
        _config.v6 = isIPv6(addr);
    }

    // Convert callback base system command to promise base
    var deferred = defer();

    // Spawn a ping process
    var ping = null;
    var platform = _platform();
    try {
        var argumentBuilder = createBuilder(platform);
        var pingExecutablePath = getExecutablePath(
            platform, _config.v6
        );
        var pingArgs = argumentBuilder.getCommandArguments(addr, _config);
        var spawnOptions = argumentBuilder.getSpawnOptions();
        ping = spawn(pingExecutablePath, pingArgs, spawnOptions);
    } catch (err) {
        deferred.reject(err);
        return deferred.promise;
    }

    // Initial parser
    var parser = createParser(addr, platform, _config);

    // Register events from system ping
    ping.once('error', function () {
        var err = new Error(
            format(
                'ping.probe: %s. %s',
                'there was an error while executing the ping program. ',
                'Check the path or permissions...'
            )
        );
        deferred.reject(err);
    });

    // Cache all lines from the system ping
    var outstring = [];
    ping.stdout.on('data', function (data) {
        outstring.push(String(data));
    });

    // Parse lines we have on closing system ping
    ping.once('close', function () {
        // Merge lines we have and split it by \n
        var lines = outstring.join('').split('\n');

        // Parse line one by one
        each(lines, parser.eat, parser);

        // Get result
        var ret = parser.getResult();

        deferred.resolve(ret);
    });

    return deferred.promise;
}


/**
 * Class::PromisePing
 * @param {string} addr - Hostname or ip addres
 * @param {PingConfig} config - Configuration for command ping
 * @return {Promise}
 */
function probe(addr, config) {
    try {
        var probePromise = _probe(addr, config);
        return probePromise;
    } catch (error) {
        var errorPromise = reject(error);
        return errorPromise;
    }
}

const __probe = probe;
export { __probe as probe };
