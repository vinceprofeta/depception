#! /usr/bin/env node

var fs = require('fs');
var request = require('request');
var chalk = require('chalk');

var createDepObject = function(depName, parents) {
    return {
        depName: depName,
        parents: parents || ''
    }
};

var convertDepsListToObject = function(deps, parents) {
    return deps.map(function (depName) {
        return createDepObject(depName, parents);
    });
};

try {
    var pkgJsonFilePath = process.argv[2];
    var pkgJson = JSON.parse(fs.readFileSync(pkgJsonFilePath));
    var deps = convertDepsListToObject(Object.keys(pkgJson.dependencies));
} catch (e) {
    console.error('Please provide a valid package.json file');
    return;
}

var progress = function (current, total) {
    var stream = process.stderr;
    if (current < total) {
        var width = 80;
        var widthDone = Math.floor(width * (current / total));
        var out = '';
        for (var i = 0; i < widthDone; i++) {
            out += '=';
        }
        for (var i = 0; i < width - widthDone; i++) {
            out += '-';
        }

        out += ` ${current} / ${total}`;

        stream.cursorTo(0);
        stream.write(out);
        stream.clearLine(1);
    } else {
        stream.cursorTo(0);
        stream.clearLine(1);
    }
}

var processedDepNames = [];
var results = [];
var skippedDeps = [];
var nextDep = function (currentDepIndex) {
    progress(currentDepIndex, deps.length);

    if (currentDepIndex < deps.length) {
        var dep = deps[currentDepIndex];
        request(`http://registry.npmjs.org/${dep.depName}`, { json: true }, function (error, response, body) {
            if (!error && body) {
                if (body.hasOwnProperty('time') && body.hasOwnProperty('dist-tags')) {
                    var latestDepVersion = body['dist-tags'].latest;

                    // Find the most recent release date for this dep
                    if (body.time.hasOwnProperty(latestDepVersion)) {
                        var releaseTimestamp = body.time[latestDepVersion];
                        var releaseDate = releaseTimestamp.substr(0, 10);
                        var releaseTime = releaseTimestamp.substr(11, 5);
                        var viaString = chalk.dim(dep.parents ? `(via ${dep.parents})` : '');
                        results.push(`${releaseDate} ${releaseTime}:  ${dep.depName} ${latestDepVersion} ${viaString}`)
                    }

                    if (body.versions.hasOwnProperty(latestDepVersion)) {
                        for (var subDepName in body.versions[latestDepVersion].dependencies) {
                            if (body.versions[latestDepVersion].dependencies.hasOwnProperty(subDepName)) {
                                if (processedDepNames.indexOf(subDepName) === -1) {
                                    processedDepNames.push(subDepName);
                                    deps.push(
                                        createDepObject(subDepName, (dep.parents ? dep.parents + ' > ' : '') + dep.depName)
                                    );
                                }
                            }
                        }
                    }
                }
            } else {
                skippedDeps.push(createDepObject(dep));
            }
            nextDep(currentDepIndex + 1);
        });
    } else {
        var limit = process.argv[3] || 20;
        console.log(`Here are the ${limit} most recent updates from your dependency chain:\n`);
        console.log(results.sort().reverse().slice(0, limit).join(`\n`));
        if (skippedDeps.length) {
            console.log(`Skipped: ${skippedDeps.join(', ')}`);
        }
    }
}

nextDep(0);
