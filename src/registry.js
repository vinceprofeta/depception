'use strict';

var request = require('request');
var createDepObject = require('./createDepObject');

var Registry = function () {};

Registry.prototype.fetchForDependency = function (dep, progress) {
    return new Promise(resolve => {
        request(`https://registry.npmjs.org/${dep.depName}`, { json: true }, function (error, response, body) {
            progress.tick();
            if (!error && body) {
                if (body.hasOwnProperty('time') && body.hasOwnProperty('dist-tags')) {
                    var latestDepVersion = body['dist-tags'].latest;

                    var subResults = [];
                    var newDeps = [];

                    // Find the most recent release date for this dep
                    if (body.time.hasOwnProperty(latestDepVersion)) {
                        var releaseTimestamp = body.time[latestDepVersion];
                        var releaseDate = releaseTimestamp.substr(0, 10);
                        var releaseTime = releaseTimestamp.substr(11, 5);
                        var viaString = dep.parents ? `(via ${dep.parents})` : '';
                        console.log({
                            depName: dep.depName,
                            releaseString: `${releaseDate} ${releaseTime}`,
                            latestVersion: latestDepVersion,
                            viaString: viaString,
                            releaseTimestamp
                        })
                        subResults.push({
                            depName: dep.depName,
                            releaseString: `${releaseDate} ${releaseTime}`,
                            latestVersion: latestDepVersion,
                            viaString: viaString
                        });
                    }

                    if (body.versions.hasOwnProperty(latestDepVersion)) {
                        for (var subDepName in body.versions[latestDepVersion].dependencies) {
                            if (body.versions[latestDepVersion].dependencies.hasOwnProperty(subDepName)) {
                                newDeps.push(
                                    createDepObject(subDepName, (dep.parents ? dep.parents + ' > ' : '') + dep.depName)
                                );
                            }
                        }
                    }
                    
                    console.log('START SUB', subResults, 'END SUB')
                    console.log('NEW SUB', newDeps, 'NEW SUB')

                    resolve({
                        subResults: subResults,
                        newDeps: newDeps
                    });
                } else {
                    resolve({
                        skippedDep: dep.depName
                    });
                }
            } else {
                resolve({
                    skippedDep: dep.depName
                });
            }
        });
    });
}

module.exports = Registry;
