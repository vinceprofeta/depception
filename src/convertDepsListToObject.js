'use strict';

var createDepObject = require('./createDepObject');

module.exports = function (deps, parents) {
    return deps.map(function (depName) {
        return createDepObject(depName, parents);
    });
};
