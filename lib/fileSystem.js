"use strict";

var fs = require("fs"),
	Q = require("q"),
	path = require("path"),
	osSep = process.platform === "win32" ? "\\" : "/";

/**
 * Create folder recursively (based on node-fs method)
 *
 * @param filePath {String}
 * @param [mode] {Number}
 * @param callback {Function}
 * @param [position] {Number}
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
 * @returns {Promise<Q>}
 */
fs.mkdirpQ = function(dirPath, mode) {
	var deferred = Q.defer();

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
 * @returns {Promise<Q>}
 */
fs.copyQ = function(from, to) {
	var deferred = Q.defer();

	fs.copy(from, to, function(err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

/**
 * Delete folder and his content
 *
 * @param path {String}
 * @param callback {Function}
 */
fs.rmdirR = function(path, callback) {
	fs.readdir(path, function(err, files) {
		if (err) {
			// Pass the error on to callback
			callback(err, []);
			return;
		}
		var wait = files.length,
			count = 0,
			folderDone = function(err) {
				count++;
				// If we cleaned out all the files, continue
				if (count >= wait || err) {
					fs.rmdir(path, callback);
				}
			};
		// Empty directory to bail early
		if (!wait) {
			folderDone();
			return;
		}

		// Remove one or more trailing slash to keep from doubling up
		path = path.replace(/\/+$/, "");
		files.forEach(function(file) {
			var curPath = path + "/" + file;
			fs.lstat(curPath, function(err, stats) {
				if (err) {
					callback(err, []);
					return;
				}
				if (stats.isDirectory()) {
					fs.rmdirR(curPath, folderDone);
				} else {
					fs.unlink(curPath, folderDone);
				}
			});
		});
	});
};

/**
 * Delete folder and his content using promise
 *
 * @param path {String}
 * @returns {Promise<Q>}
 */
fs.rmdirRQ = function(path) {
	var deferred = Q.defer();

	fs.rmdirR(path, function(err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve();
		}
	});

	return deferred.promise;
};

module.exports = fs;
