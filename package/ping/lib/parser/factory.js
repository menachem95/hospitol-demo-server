'use strict';

import { format } from 'util';

import { isPlatformSupport, isWindow, isMacOS, isLinux } from '../builder/factory';
import WinParser from './win';
import MacParser from './mac';
import LinuxParser from './linux';

/**
 * A factory creates a parser for parsing output from system ping
 * @constructor
 */
function factory() {}

/**
 * Create a parser for a given platform
 * @param {string} addr - Hostname or ip addres
 * @param {string} platform - Name of the platform
 * @param {PingConfig} [config] - Config object in probe()
 * @return {object} - Parser
 * @throw if given platform is not supported
 */
factory.createParser = function (addr, platform, config) {
    // Avoid function reassignment
    var _config = config || {};

    if (!isPlatformSupport(platform)) {
        throw new Error(format('Platform |%s| is not support', platform));
    }

    var ret = null;
    if (isWindow(platform)) {
        ret = new WinParser(addr, _config);
    } else if (isMacOS(platform)) {
        ret = new MacParser(addr, _config);
    } else if (isLinux(platform)) {
        ret = new LinuxParser(addr, _config);
    }

    return ret;
};

export default factory;
