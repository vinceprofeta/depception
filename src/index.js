#! /usr/bin/env node

var fs = require('fs');
var request = require('request');
var chalk = require('chalk');
// var progress = require('./progress');

var createDepObject = function (depName, parents) {
    return {
        depName: depName,
        parents: parents || ''
    }
};

console.time('execution');

var convertDepsListToObject = function (deps, parents) {
    return deps.map(function (depName) {
        return createDepObject(depName, parents);
    });
};

try {
    var pkgJsonFilePath = process.argv[2];
    var pkgJson = JSON.parse(fs.readFileSync(pkgJsonFilePath));
    var processedDepNames = Object.keys(pkgJson.dependencies);
    var deps = convertDepsListToObject(processedDepNames);
} catch (e) {
    console.error('Please provide a valid package.json file');
    return;
}

var results = [];
var skippedDeps = [];
var nextDep = function () {
    // progress(currentDepIndex, deps.length);

    if (deps.length) {

        var allDepsPromise = deps.map(dep => {
            return new Promise(resolve => {
                request(`https://registry.npmjs.org/${dep.depName}`, { json: true }, function (error, response, body) {
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
                                var viaString = chalk.dim(dep.parents ? `(via ${dep.parents})` : '');
                                subResults.push(`${releaseDate} ${releaseTime}:  ${dep.depName} ${latestDepVersion} ${viaString}`)
                            }

                            if (body.versions.hasOwnProperty(latestDepVersion)) {
                                for (var subDepName in body.versions[latestDepVersion].dependencies) {
                                    if (body.versions[latestDepVersion].dependencies.hasOwnProperty(subDepName)) {
                                        if (processedDepNames.indexOf(subDepName) === -1) {
                                            processedDepNames.push(subDepName);
                                            newDeps.push(
                                                createDepObject(subDepName, (dep.parents ? dep.parents + ' > ' : '') + dep.depName)
                                            );
                                        }
                                    }
                                }
                            }

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
        });

        Promise.all(allDepsPromise).catch(e => console.log(e)).then(returned => {
            deps = [];
            for (var returnedItem of returned) {
                try {
                    if (returnedItem.subResults && returnedItem.subResults.length) results.push(returnedItem.subResults);
                    if (returnedItem.newDeps && returnedItem.newDeps.length) deps = deps.concat(returnedItem.newDeps);
                    if (returnedItem.skippedDep) skippedDeps.push(returnedItem.skippedDep);
                } catch (e) {
                    console.log(e);
                }
            }
            nextDep();
        }).catch(e => console.log(e));
    } else {
        var limit = process.argv[3] || 20;
        console.log(`Here are the ${limit} most recent updates from your dependency chain:\n`);
        console.log(results.sort().reverse().slice(0, limit).join(`\n`));
        if (skippedDeps.length) {
            console.log(`Skipped: ${skippedDeps.join(', ')}`);
        }
        console.timeEnd('execution');
    }
}

nextDep();
