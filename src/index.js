#! /usr/bin/env node
'use strict';

var fs = require('fs');
var convertDepsListToObject = require('./convertDepsListToObject');
var outputResults = require('./outputResults');
var processDeps = require('./processDeps');
var Progress = require('./Progress');
var dotProgress = new Progress();

try {
    var pkgJsonFilePath = process.argv[2];
    var pkgJson = JSON.parse(fs.readFileSync(pkgJsonFilePath));
    var processedDepNames = Object.keys(pkgJson.dependencies);
} catch (e) {
    console.error('Please provide a valid package.json file');
    return;
}

var dependenciesToProcess = convertDepsListToObject(processedDepNames);
var cumulativeResults = {};
var skippedDependencies = [];

var addResultIfNew = function (packageName, resultDetails) {
    if (!cumulativeResults.hasOwnProperty(packageName)) {
        cumulativeResults[packageName] = resultDetails;
    }
};

var addDependencyToProcessIfNew = function (dependecyObject) {
    if (!cumulativeResults.hasOwnProperty(dependecyObject.depName)) {
        dependenciesToProcess.push(dependecyObject);
    }
}

var processRegistryResults = function (returned) {
    dependenciesToProcess = [];
    for (var returnedItem of returned) {
        if (returnedItem.subResults && returnedItem.subResults.length) {
            for (var subResult of returnedItem.subResults) {
                var returnedResultName = subResult.depName;
                addResultIfNew(
                    returnedResultName,
                    subResult
                );
            }
        }
        if (returnedItem.newDeps && returnedItem.newDeps.length) {
            for (var newDependencyToProcess of returnedItem.newDeps) {
                addDependencyToProcessIfNew(newDependencyToProcess);
            }
        }
        if (returnedItem.skippedDep) skippedDependencies.push(returnedItem.skippedDep);
    }
    processRemainingDependencies();
}

var processRemainingDependencies = function () {
    if (dependenciesToProcess.length) {
        processDeps(dependenciesToProcess, dotProgress)
            .then(processRegistryResults)
            .catch(e => console.log(e));
    } else {
        outputResults(cumulativeResults, skippedDependencies);
    }
}

processRemainingDependencies();
