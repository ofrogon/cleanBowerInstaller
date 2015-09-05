"use strict";

var q = require("q"),
	cmd = require("./cmd"),
	cnf = require("./readConfig");

/**
 * Call cmd.js command using promise
 *
 * @param promise {Promise<T>}
 * @param cmd {Function}
 * @param option {Object}
 */
function callCmd(promise, cmd, option) {
	option = option || {};


	if (!option.hasOwnProperty("cwd")) {
		try {
			option.cwd = process.cwd();
		} catch (e) {
			promise.reject(e);
		}
	}

	cnf.read(option).then(
		function (config) {
			if (config === "Nothing to do!") {
				promise.resolve("Nothing to do!");
			} else {
				cmd(config).then(
					function (res) {
						if (config.option.verbose) {
							promise.resolve(res);
						} else {
							promise.resolve();
						}
					},
					function (err) {
						promise.reject(err);
					}
				);
			}
		},
		function (err) {
			promise.reject(err);
		}
	);
}

module.exports = {
	/**
	 * Execute the automatic
	 *
	 * @param [option] {Object}
	 * @returns {Promise<T>}
	 */
	automatic: function (option) {
		var deferred = q.defer();

		callCmd(deferred, cmd.automatic, option);

		return deferred.promise;
	},
	/**
	 * Execute the install
	 *
	 * @param [option] {Object}
	 * @returns {Promise<T>}
	 */
	install: function (option) {
		var deferred = q.defer();

		callCmd(deferred, cmd.install, option);

		return deferred.promise;
	},
	/**
	 * Execute the update
	 *
	 * @param [option] {Object}
	 * @returns {Promise<T>}
	 */
	update: function (option) {
		var deferred = q.defer();

		callCmd(deferred, cmd.update, option);

		return deferred.promise;
	},
	/**
	 * Simply run the clean-bower-installer without bower call
	 *
	 * @param [option] {Object}
	 * @returns {Promise<T>}
	 */
	run: function (option) {
		var deferred = q.defer();

		callCmd(deferred, cmd.run, option);

		return deferred.promise;
	},
	/**
	 * Run the clean-bower-installer with the min option, without bower call
	 *
	 * @param [option] {Object}
	 * @returns {Promise<T>}
	 */
	runMin: function (option) {
		var deferred = q.defer();

		try {
			option = option || {option: {min: {}}};
			option.option = option.option || {};
			option.option.min = option.option.min || {};

			option.option.min.get = true;
			option.option.min.rename = false;
		} catch (e) {
			deferred.reject(e);
		}

		callCmd(deferred, cmd.run, option);

		return deferred.promise;
	},
	/**
	 * Run the clean-bower-installer with the min  and the renameMin option, without bower call
	 *
	 * @param [option] {Object}
	 * @returns {Promise<T>}
	 */
	runMinR: function (option) {
		var deferred = q.defer();

		try {
			option = option || {option: {}};
			option.option = option.option || {};
			option.option.min = option.option.min || {};

			option.option.min.get = true;
			option.option.min.rename = true;
		} catch (e) {
			deferred.reject(e);
		}

		callCmd(deferred, cmd.run, option);

		return deferred.promise;
	}
};
