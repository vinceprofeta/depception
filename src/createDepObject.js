'use strict';

module.exports = function (depName, parents) {
    return {
        depName: depName,
        parents: parents || ''
    }
};
