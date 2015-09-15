"use strict";

var q = require("q"),
	fileManagement = require("./fileManagement"),
	exec = require("child_process").exec,
	path = require("path"),
	fs = require("fs"),
	errorMessage = "The command module do not receive any configuration.";

/**
 * Execute bower basic command in a second process before executing the tool
 *
 * @param config {{}}
 * @param command (String}
 * @returns {Promise<T>}
 */
function callBower(config, command) {
	var deferred = q.defer();

	/* Bower install done the update if the file already exist so in the case of not knowing which one to use (install or update)
	 * install will do both.*/
	fs.stat(path.join(config.cwd, "bower.json"), function(err) {
		if (err) {
			deferred.reject(err.code);
		} else {
			if (command === "install" || command === "automatic") {
				exec("bower install", {cwd: config.cwd}, function(error, stdout) {
					if (error) {
						deferred.reject(error);
					} else {
						deferred.resolve(stdout);
					}
				});
			} else if (command === "update") {
				exec("bower update", {cwd: config.cwd}, function(error, stdout) {
					if (error) {
						deferred.reject(error);
					} else {
						deferred.resolve(stdout);
					}
				});
			} else {
				deferred.reject("Bower command unrecognised: " + command);
			}
		}
	});

	return deferred.promise;
}

/**
 * Post treatment of the error message for the bower call
 *
 * @param err {String}
 * @param cnf {{}}
 * @param promise {Promise<T>}
 */
function bowerError(err, cnf, promise) {
	if(err === "ENOENT") {
		promise.reject("There is no bower.json file in " + cnf.cwd);
	} else {
		promise.reject(err);
	}
}

/**
 * Call the file management module
 *
 * @param config {{}}
 * @param promise {Promise<T>}
 */
function callFileManagement(config, promise) {
	var fm;

	if (config.option.removeAfter) {
		fm = fileManagement.moveFilesAdnRemove(config);
	} else {
		fm = fileManagement.moveFiles(config);
	}

	fm.then(
		function(data) {
			promise.resolve(data);
		},
		function(err) {
			promise.reject(err);
		}
	);
}

module.exports = {
	/**
	 * Execute the automatic
	 *
	 * @returns {Promise<T>}
	 */
	automatic: function(config) {
		var deferred = q.defer();

		if (config && config.hasOwnProperty("cwd")) {
			callBower(config, "automatic").then(
				function() {
					callFileManagement(config, deferred);
				},
				function(err) {
					bowerError(err, config, deferred);
				}
			);
		} else {
			deferred.reject(errorMessage);
		}

		return deferred.promise;
	},
	/**
	 * Execute the install
	 *
	 * @returns {Promise<T>}
	 */
	install: function(config) {
		var deferred = q.defer();

		if (config && config.hasOwnProperty("cwd")) {
			callBower(config, "install").then(
				function() {
					callFileManagement(config, deferred);
				},
				function(err) {
					bowerError(err, config, deferred);
				}
			);
		} else {
			deferred.reject(errorMessage);
		}

		return deferred.promise;
	},
	/**
	 * Execute the update
	 *
	 * @returns {Promise<T>}
	 */
	update: function(config) {
		var deferred = q.defer();

		if (config && config.hasOwnProperty("cwd")) {
			callBower(config, "update").then(
				function() {
					callFileManagement(config, deferred);
				},
				function(err) {
					bowerError(err, config, deferred);
				}
			);
		} else {
			deferred.reject(errorMessage);
		}

		return deferred.promise;
	},
	/**
	 * Simply run the clean-bower-installer without bower call
	 *
	 * @returns {Promise<T>}
	 */
	run: function(config) {
		var deferred = q.defer();

		if (config && config.hasOwnProperty("cwd")) {
			fs.stat(path.join(config.cwd, "bower.json"), function(err) {
				if (err) {
					bowerError(err.code, config, deferred);
				} else {
					callFileManagement(config, deferred);
				}
			});
		} else {
			deferred.reject(errorMessage);
		}

		return deferred.promise;
	}
};
