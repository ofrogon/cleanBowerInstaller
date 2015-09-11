"use strict";

var fs = require("fs"),
	q = require("q"),
	path = require("path");

/**
 * Read the bower.json file
 *
 * @param cwd {String}
 * @returns {Promise<T>}
 */
function getBowerJson(cwd) {
	var deferred = q.defer(),
		bp = path.join(cwd, "bower.json");

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
 * Configuration object
 *
 * @constructor
 */
function Config() {
	this.folder = {};
	this.option = {
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
	};
	this.source = {};
	this.cwd = process.cwd();
}

/**
 * Configuration prototype
 *
 * @type {{set: Function}}
 */
Config.prototype = {
	/**
	 *  Set the configuration values by overwriting with the new elements
	 *
	 * @param obj {{folder: {}, option: {default: {folder: String, minFolder: String}, min: {get: Boolean, rename: Boolean, ignoreExt: Array}, removeAfter: Boolean, verbose: Boolean}, source: {}, cwd: String, [hasOwnProperty]: Function}}
	 */
	set: function(obj) {
		// Verify that all minimal value exist
		if (!obj.hasOwnProperty("option")) {
			obj.option = {};
			obj.option.default = {};
			obj.option.min = {};
		} else {
			if (!obj.option.hasOwnProperty("default")) {
				obj.option.default = {};
			}

			if (!obj.option.hasOwnProperty("min")) {
				obj.option.min = {};
			}
		}

		if (obj.hasOwnProperty("folder")) {
			for (var el in obj.folder) {
				if (obj.folder.hasOwnProperty(el)) {
					arrayKeyParser(obj.folder, el, obj.folder[el]);
				}
			}
		}

		// Set the object
		this.folder = obj.folder || this.folder;
		this.option = {
			"default": {
				"folder": obj.option.default.folder || this.option.default.folder,
				"minFolder": obj.option.default.minFolder || this.option.default.minFolder
			},
			"min": {
				"get": obj.option.min.get || this.option.min.get,
				"rename": obj.option.min.rename || this.option.min.rename,
				"ignoreExt": obj.option.min.ignoreExt || this.option.min.ignoreExt
			},
			"removeAfter": obj.option.removeAfter || this.option.removeAfter,
			"verbose": obj.option.verbose || this.option.verbose
		};
		this.source = obj.source || this.source;
		this.cwd = obj.cwd || this.cwd;
	},
	/**
	 * Read the configuration values
	 *
	 * @returns {{folder: String, option: {}, source: {}, cwd: String}}
	 */
	get: function() {
		return {
			folder: this.folder,
			option: this.option,
			source: this.source,
			cwd: this.cwd
		};
	}
};

/**
 * Read the configuration
 *
 * @param [option] {{}}
 * @returns {Promise<T>}
 */
function read(option) {
	option = option || {};
	var cwd = option.cwd || "",
		deferred = q.defer();

	var folder = path.join(process.cwd(), cwd);

	if (path.isAbsolute(cwd)) {
		folder = cwd;
	}

	getBowerJson(folder).then(
		function(bowerJson) {
			if (!bowerJson.hasOwnProperty("cInstall")) {
				deferred.reject("Can't found the 'cInstall' object in the bower.json file.");
			}

			// Done to remove Intellij warning
			bowerJson.cInstall = bowerJson.cInstall || {};

			if (Object.keys(bowerJson.cInstall).length === 0) {
				deferred.resolve("Nothing to do!");
			}

			var readConfig = new Config();
			readConfig.set(bowerJson.cInstall);
			readConfig.set(option);

			deferred.resolve(readConfig.get());
		}, function(err) {
			deferred.reject(err);
		}
	);

	return deferred.promise;
}

module.exports = {
	read: read
};
