"use strict";

var fs = require("fs"),
	q = require("q"),
	path = require("path");

/**
 * Custom object merging function
 *
 * @param obj1 {Object}
 * @param obj2 {Object}
 */
function objectMerge(obj1, obj2) {
	for (var element in obj1) {
		if (obj1.hasOwnProperty(element) && obj2.hasOwnProperty(element)) {
			if (obj1[element] instanceof Object && !(obj1[element] instanceof Array)) {
				objectMerge(obj1[element], obj2[element]);
			} else {
				obj1[element] = obj2[element];
			}
		}
	}
}

/**
 * Read the bower.json file
 *
 * @param bowerFileFolder {string}
 * @returns {*|promise}
 */
function getBowerJson(bowerFileFolder) {
	bowerFileFolder = bowerFileFolder || process.cwd();

	var deferred = q.defer();

	var bp = path.join(bowerFileFolder || process.cwd(), "bower.json");

	fs.exists(bp, function(exist) {
		if (exist) {
			fs.readFile(bp, function(err, data) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve(JSON.parse(data));
				}
			});
		} else {
			deferred.reject("No bower.json file found in " + process.cwd());
		}
	});

	return deferred.promise;
}

/**
 * Read the configuration
 *
 * @param config {Object}
 * @returns {*|promise}
 */
function read(config) {
	var deferred = q.defer();

	if (config === undefined) {
		deferred.reject("Internal Error: No config object received");
	} else {
		getBowerJson(config.bowerFileFolder).then(
			function(bowerJson) {
				if (bowerJson.hasOwnProperty("cInstall")) {
					if (bowerJson.cInstall.hasOwnProperty("folder")) {
						config.folder = bowerJson.cInstall.folder;
					}

					if (bowerJson.cInstall.hasOwnProperty("option")) {
						objectMerge(config.option, bowerJson.cInstall.option);
					}

					if (bowerJson.cInstall.hasOwnProperty("source")) {
						config.source = bowerJson.cInstall.source;
					} else {
						deferred.reject("Error: No cInstall.source element in the bower.json file.");
					}

					deferred.resolve();
				} else {
					deferred.reject("Error: No cInstall element in the bower.json file.");
				}
			}, function(err) {
				deferred.reject(err);
			}
		);
	}
	return deferred.promise;
}

module.exports = {
	read: read
};