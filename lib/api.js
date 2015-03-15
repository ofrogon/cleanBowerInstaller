"use strict";

var q = require("q");
var config;

module.exports = {
	/**
	 * *
	 * @param [value] {object}
	 * @returns {object}
	 */
	config: function(value) {
		if (value) {
			config = value;
		} else {
			return config;
		}
	},
	automatic: function(bowerCustomConfig) {
		var deferred = q.defer();

		bowerCustomConfig = bowerCustomConfig || {};

		console.log("API.automatic call");

		console.dir(bowerCustomConfig);

		return deferred.promise;
	},
	install: function(bowerCustomConfig) {
		var deferred = q.defer();

		bowerCustomConfig = bowerCustomConfig || {};

		console.log("API.install call");

		console.dir(bowerCustomConfig);

		return deferred.promise;
	},
	update: function(bowerCustomConfig) {
		var deferred = q.defer();

		bowerCustomConfig = bowerCustomConfig || {};

		console.log("API.update call");

		console.dir(bowerCustomConfig);

		return deferred.promise;
	},
	run: function(filePath, min, rename) {
		var deferred = q.defer();

		filePath = filePath || "";
		min = min || false;
		rename = rename || false;

		console.log("API.run call");
		return deferred.promise;
	}
};