"use strict";

var Q = require("q"),
	cmd = require("./cmd"),
	cnf = require("./readConfig"),
	util = require("util");

/**
 * Call cmd.js command using promise
 *
 * @param promise {Promise<Q>}
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
				promise.resolve(config);
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
	 * @returns {Promise<Q>}
	 */
	automatic: util.deprecate(function (option) {
		var deferred = Q.defer();

		callCmd(deferred, cmd.automatic, option);

		return deferred.promise;
	}, "The command automatic is deprecated use 'install' instead."),
	/**
	 * Execute the install
	 *
	 * @param [option] {Object}
	 * @returns {Promise<Q>}
	 */
	install: function (option) {
		var deferred = Q.defer();

		callCmd(deferred, cmd.install, option);

		return deferred.promise;
	},
	/**
	 * Execute the update
	 *
	 * @param [option] {Object}
	 * @returns {Promise<Q>}
	 */
	update: function (option) {
		var deferred = Q.defer();

		callCmd(deferred, cmd.update, option);

		return deferred.promise;
	},
	/**
	 * Simply run the clean-bower-installer without bower call
	 *
	 * @param [option] {Object}
	 * @returns {Promise<Q>}
	 */
	run: function (option) {
		var deferred = Q.defer();

		callCmd(deferred, cmd.run, option);

		return deferred.promise;
	},
	/**
	 * Run the clean-bower-installer with the min option, without bower call
	 *
	 * @param [option] {Object}
	 * @returns {Promise<Q>}
	 */
	runMin: function (option) {
		var deferred = Q.defer();

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
	 * @returns {Promise<Q>}
	 */
	runMinR: function (option) {
		var deferred = Q.defer();

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
