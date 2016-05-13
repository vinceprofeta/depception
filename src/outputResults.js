'use strict';
var _ = require('lodash');
var chalk = require('chalk');

module.exports = function (results, skippedDeps) {
    var limit = parseInt(process.argv[3], 10);
    if (!limit || limit <= 1) limit = 20;
    console.log(`\nHere are the ${limit} most recent updates from your dependency chain:\n`);

    var formattedResults = _.chain(results).toArray()
        .map(r => `${r.releaseString}   ${r.depName} ${r.latestVersion} ${chalk.dim(r.viaString)}`)
        .value()
        .sort()
        .reverse()
        .slice(0, limit)
        .join(`\n`);
    console.log(formattedResults);

    if (skippedDeps.length) console.log(`\nSkipped: ${skippedDeps.join(', ')}`);
}
