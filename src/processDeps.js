'use strict';

var Registry = require('./registry');
var registry = new Registry();

module.exports = function (deps, progress) {
    return Promise.all(deps.map(dep => {
        return registry.fetchForDependency(dep, progress);
    }));
};
