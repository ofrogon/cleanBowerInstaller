"use strict";

var q = require("q"),
	errorMessage = "The command module do not receive any configuration.";

module.exports = {
	/**
	 * Execute the automatic
	 *
	 * @param config {object}
	 * @returns {*|promise}
	 */
	automatic: function(config) {
		var deferred = q.defer();

		if (config) {
			console.log("cmd.automatic call");

			console.dir(config);

			deferred.resolve();
		} else {
			deferred.reject(errorMessage);
		}

		return deferred.promise;
	},
	/**
	 * Execute the install
	 *
	 * @param config {object}
	 * @returns {*|promise}
	 */
	install: function(config) {
		var deferred = q.defer();

		if (config) {
			console.dir(config);

			deferred.resolve("cmd.install called");
		} else {
			deferred.reject(errorMessage);
		}

		return deferred.promise;
	},
	/**
	 * Execute the update
	 *
	 * @param config {object}
	 * @returns {*|promise}
	 */
	update: function(config) {
		var deferred = q.defer();

		if (config) {
			console.log("cmd.update call");

			console.dir(config);

			deferred.resolve();
		} else {
			deferred.reject(errorMessage);
		}

		return deferred.promise;
	},
	/**
	 * Simply run the clean-bower-installer without bower call
	 *
	 * @param config {object}
	 * @returns {*|promise}
	 */
	run: function(config) {
		var deferred = q.defer();

		if (config) {
			console.log("cmd.run call");

			console.dir(config);

			deferred.resolve();
		} else {
			deferred.reject(errorMessage);
		}

		return deferred.promise;
	}
};