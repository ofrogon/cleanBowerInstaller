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
 * Handle the multiple values key
 *
 * @param obj {{}}
 * @param key {String}
 * @param value {String}
 */
function arrayKeyParser(obj, key, value) {
	key = key.replace(/ /g, "");

	var keys = key.split(",");

	for (var i = 0, length = keys.length; i < length; i++) {
		obj[keys[i]] = value;
	}
}

/**
 * Read the bower.json file
 *
 * @param cwd {string}
 * @returns {*|promise}
 */
function getBowerJson(cwd) {
	var deferred = q.defer();

	var bp = path.join(cwd, "bower.json");

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
 * @param [cwd] {String}
 * @returns {*|promise}
 */
function read(cwd) {
	var deferred = q.defer();

	cwd = cwd || "";

	getBowerJson(path.join(process.cwd(), cwd)).then(
		function(bowerJson) {
			var config = {
				folder: {},
				option: {
					"default": {
						"folder": "",
						"minFolder": ""
					},
					"min": {
						"get": false,
						"rename": false,
						"ignoreExt": []
					},
					"removeAfter": false,
					"verbose": false
				},
				source: {},
				cwd: cwd
			};

			if (bowerJson.hasOwnProperty("cInstall")) {
				if (bowerJson.cInstall.hasOwnProperty("folder")) {
					for (var el in bowerJson.cInstall.folder) {
						if (bowerJson.cInstall.folder.hasOwnProperty(el)) {
							arrayKeyParser(config.folder, el, bowerJson.cInstall.folder[el]);
						}
					}
				}

				if (bowerJson.cInstall.hasOwnProperty("option")) {
					objectMerge(config.option, bowerJson.cInstall.option);
				}

				if (bowerJson.cInstall.hasOwnProperty("source")) {
					config.source = bowerJson.cInstall.source;
				} else {
					deferred.reject("Error: No cInstall.source element in the bower.json file.");
				}

				deferred.resolve(config);
			} else {
				deferred.reject("Error: No cInstall element in the bower.json file.");
			}
		}, function(err) {
			deferred.reject(err);
		}
	);

	return deferred.promise;
}

module.exports = {
	read: read
};