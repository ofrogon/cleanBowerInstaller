"use strict";

var q = require("q"),
	cmd = require("./cmd"),
	cnf = require("./readConfig"),
	path = require("path");

/**
 *
 * @param promise
 * @param cmd
 * @param option
 */
function callCmd(promise, cmd, option) {
	option = option || {};

	if (!option.hasOwnProperty("cwd")) {
		option.cwd = process.cwd();
	}

	cnf.read(option.cwd).then(
		function(config) {
			cmd(config).then(
				function(res) {
					if (config.option.verbose) {
						promise.resolve(res);
					} else {
						promise.resolve();
					}
				},
				function(err) {
					promise.reject(err);
				}
			);
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
	 * @param [option] {object}
	 * @returns {Promise}
	 */
	automatic: function(option) {
		var deferred = q.defer();

		callCmd(deferred, cmd.automatic, option);

		return deferred.promise;
	},
	/**
	 * Execute the install
	 *
	 * @param [option] {object}
	 * @returns {Promise}
	 */
	install: function(option) {
		var deferred = q.defer();

		callCmd(deferred, cmd.install, option);

		return deferred.promise;
	},
	/**
	 * Execute the update
	 *
	 * @param [option] {object}
	 * @returns {Promise}
	 */
	update: function(option) {
		var deferred = q.defer();

		callCmd(deferred, cmd.update, option);

		return deferred.promise;
	},
	/**
	 * Simply run the clean-bower-installer without bower call
	 *
	 * @param [option] {object}
	 * @returns {Promise}
	 */
	run: function(option) {
		var deferred = q.defer();

		callCmd(deferred, cmd.run, option);

		return deferred.promise;
	},
	runMin: function(option) {
		var deferred = q.defer();

		option = option || {};

		if (!option.hasOwnProperty("min")) {
			option.min = {};
		}

		option.min.get = true;
		option.min.rename = false;

		callCmd(deferred, cmd.run, option);

		return deferred.promise;
	},
	runMinR: function(option) {
		var deferred = q.defer();

		option = option || {};

		if (!option.hasOwnProperty("min")) {
			option.min = {};
		}

		option.min.get = true;
		option.min.rename = true;

		callCmd(deferred, cmd.run, option);

		return deferred.promise;
	}
};
