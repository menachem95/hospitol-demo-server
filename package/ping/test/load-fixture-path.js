'use strict';

import { dirname as _dirname, posix } from 'path';
import { sync } from 'glob';

/**
 * Check out linux platform
 */
function isLinux(p) {
    var platforms = [
        'aix',
        'android',
        'linux',
    ];

    return platforms.indexOf(p) >= 0;
}

/**
 * Check out macos platform
 */
function isMacOS(p) {
    var platforms = [
        'darwin',
        'freebsd',
    ];

    return platforms.indexOf(p) >= 0;
}

/**
 * Check out window platform
 */
function isWindow(p) {
    return p && p.match(/^win/) !== null;
}

export default function (platform) {
    var dirname = null;

    if (isLinux(platform)) {
        dirname = 'linux';
    } else if (isMacOS(platform)) {
        dirname = 'macos';
    } else if (isWindow(platform)) {
        dirname = 'window';
    }

    var currentDirectory = _dirname(__filename);

    var targetDirectory = [currentDirectory, 'fixture'];
    if (dirname) {
        targetDirectory.push(dirname);
    }
    targetDirectory = targetDirectory.concat([
        '**',
        '*.txt',
    ]);
    targetDirectory = posix.join.apply(posix, targetDirectory);

    return sync(targetDirectory);
};
