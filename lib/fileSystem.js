"use strict";

var fs = require("fs"),
	q = require("q"),
	path = require("path"),
	osSep = process.platform === "win32" ? "\\" : "/";

/**
 * Create folder recursively (based on node-fs method)
 *
 * @param filePath {String}
 * @param [mode] {Number}
 * @param callback {Function}
 * @param [position] {Number}
 * @returns {*}
 */
fs.mkdirp = function(filePath, mode, callback, position) {
	var parts = path.normalize(filePath).split(osSep);

	// If no mode  were specified 777 if default (0777 == 511)
	mode = mode || 511;
	position = position || 0;

	if (position >= parts.length) {
		return callback();
	}

	position++;

	var directory = parts.slice(0, position).join(osSep) || osSep;
	fs.stat(directory, function(err) {
		if (err === null) {
			fs.mkdirp(filePath, mode, callback, position);
		} else {
			fs.mkdir(directory, mode, function(err) {
				if (err && err.code !== "EEXIST") {
					return callback(err);
				} else {
					fs.mkdirp(filePath, mode, callback, position);
				}
			});
		}
	});
};

/**
 * Create folder recursively using promise
 *
 * @param dirPath {String}
 * @param mode {Number}
 */
fs.mkdirpQ = function(dirPath, mode) {
	var deferred = q.defer();

	fs.mkdirp(dirPath, mode, function(err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

/**
 * Custom file copy method
 *
 * @param from {String}
 * @param to {String}
 * @param callback {Function}
 */
fs.copy = function(from, to, callback) {
	callback = callback || function() {
		};

	fs.mkdirp(path.dirname(to), null, function(err) {
		if (err) {
			callback(err);
		} else {
			fs.readFile(from, function(err, data) {
				if (err) {
					callback(err);
				} else {
					fs.writeFile(to, data, function(err) {
						if (err) {
							callback(err);
						} else {
							callback(null);
						}
					});
				}
			});
		}
	});
};

/**
 * Custom file copy method using promise
 *
 * @param from {String}
 * @param to {String}
 * @returns {Promise}
 */
fs.copyQ = function(from, to) {
	var deferred = q.defer();

	fs.copy(from, to, function(err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

module.exports = fs;