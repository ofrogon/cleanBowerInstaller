"use strict";

var fs = require("fs"),
	q = require("q"),
	path = require("path"),
	glob = require("glob"),
	regex = {
		startWithSlash: new RegExp("^\/.*"),
		containAsterisk: new RegExp("\\*", "g"),
		containDoubleAsterisk: new RegExp("[\\*]{2}", "g"),
		containMin: new RegExp("[.]min", "g")
	};

/**
 * Custom file copy method
 *
 * @param from {string}
 * @param to {string}
 * @returns {promise}
 */
function fileCopy(from, to) {
	var deferred = q.defer();

	fs.readFile(from, function (err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			fs.writeFile(to, data, function (err) {
				if (err) {
					deferred.reject(err);
				} else {
					deferred.resolve();
				}
			});
		}
	});

	return deferred.promise;
}

/**
 * Return an array of corresponding files from a array of glob patterns
 *
 * @param globs {Array}
 * @param bowerFileFolder {string}
 * @param libName {string}
 * @param [depth] {number}
 * @param [localCache] {{}}
 * @returns {promise.promise|jQuery.promise|Q.defer.promise|promise|Deferred.promise|Pending.promise|*}
 */
function arrayOfGlob(globs, bowerFileFolder, libName, depth, localCache) {
	var deferred = q.defer();

	var length = globs.length;

	depth = depth || 0;

	if (depth < length) {
		glob(path.join(bowerFileFolder, libName, globs[depth]), function(err, data) {
			if (!err) {
				depth++;

				arrayOfGlob(globs, bowerFileFolder, libName, depth).then(
					function(data2) {
						data = data.concat(data2);

						deferred.resolve(data, localCache);
					},
					function(err) {
						deferred.reject(err);
					}
				);
			} else {
				deferred.reject(err);
			}
		});
	} else {
		deferred.resolve([]);
	}

	return deferred.promise;
}

/**
 *
 * @param config {{}}
 * @constructor
 */
function FileObj(config) {
	// Local variables
	// Private
	var extToIgnore = config.option.min.ignoreExt || [],
		bowerFileFolder = config.bowerFileFolder || ".",
		getMin = config.option.min.get || false,
		renameMin = config.option.min.renameMin || false,
		defMinFolder = config.option.default.minFolder || "",
		defFolder = config.option.default.folder || "",
		source = config.source,
		extensionFolder = config.folder || {};

	// Public

	// Functions
	// Private
	/**
	 * Pass all the library in the config and call enumeratePackages for each one
	 *
	 * @returns {Array}
	 */
	function enumerateLibraries() {
		var uncleanList = [],
			defer = q.defer(),
			promises = [];

		for (var libs in source) {
			if (source.hasOwnProperty(libs)) {
				var libPart= libs.split("#"),
					libName = libPart[0],
					libFolder = libPart[1] || "",
					currLib = source[libs];

				promises.push(enumeratePackages(currLib[libs], libName, libFolder));
			}
		}

		q.all(promises).then(
			function() {
				// TODO concat all result
				defer.resolve(clean(uncleanList));
			},
			function(err) {
				defer.reject(err);
			}
		);

		return defer;
	}

	/**
	 * Pass all the packages in the library and call enumerateFile for each one
	 *
	 * @param pkgs {Array|String}
	 * @param libName {String}
	 * @param libFolder {String}
	 * @returns {Array}
	 */
	function enumeratePackages(pkgs, libName, libFolder) {
		var uncleanList = [],
			defer = q.defer(),
			promises = [];

		for (var pkg in pkgs) {
			if (pkgs.hasOwnProperty(pkg)) {
				var pkgPart = pkgs.split("#"),
					fileNameAndExt = pkgPart[0] || "*",
					fileFolder = pkgPart[1] || "",
					extName = path.extname(fileNameAndExt),
					fileName = path.basename(fileNameAndExt, extName),
					extension = extName.substr(1);

				if (extToIgnore.indexOf(extension) === -1) {
					if (regex.containDoubleAsterisk.test(pkg)) {
						console.error("The \"Globstar\" ** matching wan\"t support by CLEAN-BOWER-INSTALLER." +
						" You have to specify each folder and their destination if you really need it.");
						console.error("Please correct the source: " + libName);
						return [];
					}
				}

				if (!pkgs instanceof Array) {
					pkgs = [pkgs];
				}

				var localCache = {
					fileName: fileName,
					fileFolder: fileFolder,
					pkg: pkg
				};

				// TODO faire avec les promesses et .all
				promises.push(arrayOfGlob(pkgs, bowerFileFolder, libName, 0, localCache).then(
					function(pkgList, lc) {
						enumerateFile(pkgList, lc.fileName, libFolder, lc.fileFolder, lc.pkg === "!" ? "ignore" : "move");
					}
				));
			}
		}

		q.all(promises).then(
			function() {
				defer.resolve(uncleanList);
			},
			function(err) {
				defer.reject(err);
			}
		);
		return defer;
	}

	/**
	 * Pass all the files in the package and return the array of them
	 *
	 * @param files {Array}
	 * @param fileName {string}
	 * @param libFolder {string}
	 * @param fileFolder {string}
	 * @param action {string}
	 * @returns {*}
	 */
	function enumerateFile(files, fileName, libFolder, fileFolder, action) {
		var length = files.length,
			asteriskName = false,
			f,
			unCleanList = [];

		for (var i = 0; i < length; i++) {
			f = files[i];

			if (regex.containAsterisk.test(fileName)) {
				asteriskName = true;
			}

			// Use the name of the file to replace the * (asterisk) name
			if (asteriskName) {
				fileName = path.basename(f, path.extname(f));
			}

			// Try to find the min file here
			if (getMin && !regex.containMin.test(f)) {
				var temp = path.extname(f),
					tempName = f.replace(temp, ".min" + temp);
				if (fs.existsSync(tempName)) {
					f = tempName;
					if (!renameMin) {
						fileName += ".min";
					}
				}
			}

			// Test if the link is global or relative
			if (regex.startWithSlash.test(fileFolder)) {
				// The specified file folder is global
				unCleanList[action].push({
					"from": f,
					"to": path.join(bowerFileFolder, fileFolder.substr(1)),
					"rename": fileName + path.extname(f)
				});
			} else if (regex.startWithSlash.test(libFolder)) {
				// The specified lib folder is global
				unCleanList[action].push({
					"from": f,
					"to": path.join(bowerFileFolder, libFolder.substr(1), fileFolder),
					"rename": fileName + path.extname(f)
				});
			} else {
				var df;
				// Test if redirect the file to the minDefault folder or the default folder
				if (getMin && defMinFolder !== "") {
					df = (defMinFolder);
				} else if (defFolder !== "") {
					df = (defFolder);
				} else {
					df = "";
				}

				// None of the file or lib specified, then the folder is global
				var extFolder = extensionFolder[path.extname(f).substr(1)] || "";
				unCleanList[action].push({
					"from": f,
					"to": path.join(bowerFileFolder, df, extFolder, libFolder, fileFolder),
					"rename": fileName + path.extname(f)
				});
			}
		}

		return unCleanList;
	}

	/**
	 * From the list that enter, remove the "to ignore" files
	 *
	 * @param unCleanList {Array}
	 * @returns {Array}
	 */
	function clean(unCleanList) {
		var list = [];

		if (unCleanList.length >= 0) {
			var length = unCleanList.ignore.length,
				length2 = unCleanList.move.length;

			for (var i = 0; i < length; i++) {
				for (var j = 0; j < length2; j++) {
					if (unCleanList.ignore[i].from === unCleanList.move[j].from) {
						unCleanList.move.splice(j, 1);

						length2--;
					}
				}
			}

			list = unCleanList.move;
		}

		return list;
	}

	/**
	 * Allow recursive folder deletion
	 *
	 * @param position {string}
	 * @param top {boolean}
	 * @returns {promise}
	 */
	function deleteFolder(position, top) {
		var deferred = q.defer();

		top = top || false;

		fs.exists(position, function (exist) {
			if (exist) {
				fs.readdir(position, function (err, files) {
					if (err) {
						deferred.reject(err);
					} else {
						for (var file in files) {
							if (files.hasOwnProperty(file)) {
								deleteFile(file, deferred, position, top);
							}
						}
					}
				});
			}
		});

		return deferred.promise;
	}

	/**
	 * Allow recursive file deletion
	 *
	 * @param file {string}
	 * @param deferred {promise}
	 * @param position {string}
	 * @param top {boolean}
	 */
	function deleteFile(file, deferred, position, top) {
		var curPosition = path.join(position, file);

		fs.lstat(curPosition, function (err, stat, curPosition) {
			if (err) {
				deferred.reject(err);
			} else {
				if (stat.isDirectory()) {
					deleteFolder(curPosition);
				} else {
					fs.unlink(curPosition, function (err) {
						if (err) {
							deferred.reject(err);
						} else if (top) {
							deferred.resolve();
						}
					});
				}
			}
		});
	}

	/**
	 * Method to delete the bower_components folder
	 *
	 * @returns {promise}
	 */
	this.deleteBowerComponents = function() {
		var deferred = q.defer();

		deleteFolder(path.join(bowerFileFolder, "bower_components"), true).then(
			// Pass
			function () {
				deferred.resolve();
			},
			// Fail
			function (err) {
				// Make the error go up
				deferred.reject(err);
			}
		);

		return deferred.promise;
	};

	// Public
	/**
	 * Get the list of files covered by the config
	 *
	 * @returns {Array}
	 */
	this.getList = function () {
		return enumerateLibraries();
	};

	/**
	 * Execute the copy of the listed files
	 */
	this.run = function () {
		var list = this.getList(),
			length = list.length;

		for (var i = 0; i < length; i++) {
			fileCopy(list[i].from, list[i].to);
		}
	};

	/**
	 * Execute the copy of the listed files and delete the bower_components folder after
	 */
	this.runAndRemove = function () {
		this.run();
		this.deleteBowerComponents();
	};
}

/**
 * Main method to move the files from the bower_components folder to their destination listed in the cInstall.source
 *
 * @param config {{}}
 * @returns {promise}
 */
function moveFiles(config) {
	var deferred = q.defer();

	// Call the listing object
	var list = new FileObj(config);
	list.run();

	return deferred.promise;
}

/**
 * Main method to move the files from the bower_components folder to their destination listed in the cInstall.source
 * and after, delete the bower_components folder.
 *
 * @param config
 * @returns {*}
 */
function moveFilesAndRemove(config) {
	var deferred = q.defer();

	// Call the listing object
	var list = new FileObj(config);
	list.runAndRemove();

	return deferred.promise;
}

module.exports = {
	moveFiles: moveFiles,
	moveFilesAdnRemove: moveFilesAndRemove
};
