"use strict";

var q = require("q"),
	fileManagement = require("./fileManagement"),
	exec = require("child_process").exec,
	errorMessage = "The command module do not receive any configuration.";

/**
 * Execute bower basic command in a second process before executing the tool
 *
 * @param config {{}}
 * @param command (String}
 * @returns {Promise}
 */
function callBower(config, command) {
	var deferred = q.defer(),
		noBowerRegex = /^'?bower'?/,
		noBowerError = "You need to have bower install in your global/project path to be able to call clean-bower-installer with the option -i, -u or -a.";

	// The command automatic were not suppose to be use anymore since it duplicate install
	if (command === "automatic") {
		console.log("The automatic command call for bower is deprecated, please use 'install' instead.".warn);
	}

	/* Bower install done the update if the file already exist so in the case of not knowing wich one to use (install or update)
	 * install will do both.*/
	if (command === "install" || command === "automatic") {
		exec("bower install", {cwd: config.bowerFileFolder}, function(error, stdout, stderr) {
			if (error && noBowerRegex.test(stderr)) {
				deferred.reject(noBowerError);
			} else if (error) {
				console.log(error);
				deferred.reject(stderr);
			} else {
				deferred.resolve(stdout);
			}
		});
	} else if (command === "update") {
		exec("bower update", {cwd: config.bowerFileFolder}, function(error, stdout, stderr) {
			if (error && noBowerRegex.test(stderr)) {
				deferred.reject(noBowerError);
			} else if (error) {
				deferred.reject(stderr);
			} else {
				deferred.resolve(stdout);
			}
		});
	} else {
		deferred.reject("Bower command unrecognised: " + command);
	}

	return deferred.promise;
}

/**
 * Call the file management module
 *
 * @param config {{}}
 * @param promise {Promise}
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
	 * @param config {object}
	 * @returns {Promise}
	 */
	automatic: function(config) {
		var deferred = q.defer();

		if (config) {
			callBower(config, "automatic").then(
				function() {
					callFileManagement(config, deferred);
				},
				function(err) {
					deferred.reject(err);
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
	 * @param config {object}
	 * @returns {Promise}
	 */
	install: function(config) {
		var deferred = q.defer();

		if (config) {
			callBower(config, "install").then(
				function() {
					callFileManagement(config, deferred);
				},
				function(err) {
					deferred.reject(err);
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
	 * @param config {object}
	 * @returns {Promise}
	 */
	update: function(config) {
		var deferred = q.defer();

		if (config) {
			callBower(config, "update").then(
				function() {
					callFileManagement(config, deferred);
				},
				function(err) {
					deferred.reject(err);
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
	 * @param config {object}
	 * @returns {Promise}
	 */
	run: function(config) {
		var deferred = q.defer();

		if (config) {
			callFileManagement(config, deferred);
		} else {
			deferred.reject(errorMessage);
		}

		return deferred.promise;
	}
};