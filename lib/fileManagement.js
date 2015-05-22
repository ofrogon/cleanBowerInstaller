"use strict";

var fs = require("./fileSystem"),
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
 * Return an array of corresponding files from a array of glob patterns
 *
 * @param globs {Array}
 * @param bowerFileFolder {String}
 * @param libName {String}
 * @param [depth] {number}
 * @param [localCache] {Array}
 * @returns {Promise}
 */
function arrayOfGlob(globs, bowerFileFolder, libName, depth, localCache) {
	var deferred = q.defer(),
		length = globs.length;

	depth = depth || 0;

	if (depth < length) {
		glob(path.join(bowerFileFolder, libName, globs[depth]), function(err, data) {
			if (!err) {
				depth++;

				arrayOfGlob(globs, bowerFileFolder, libName, depth, data).then(
					function(ans) {
						data = data.concat(ans.data);

						deferred.resolve({data: data, localCache: localCache});
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
		deferred.resolve({data: [], localCache: localCache});
	}

	return deferred.promise;
}

/**
 * Object for file processing
 *
 * @param config {{option: {}}}
 * @constructor
 */
function FileObj(config) {
	config.option = config.option || {min: {}, default: {}};

	this.extToIgnore = config.option.min.ignoreExt || [];
	this.bowerFileFolder = path.join(config.cwd, "bower_components");
	this.getMin = config.option.min.get || false;
	this.renameMin = config.option.min.rename || false;
	this.defMinFolder = config.option.default.minFolder || "";
	this.defFolder = config.option.default.folder || "";
	this.source = config.source;
	this.extensionFolder = config.folder || {};
	this.isVerbose = config.option.verbose|| false;
	this.listBackup = [];
}

FileObj.prototype = {
	/**
	 * Old the promises outside of their own method to get them out of loop
	 */
	promise: {
		/**
		 * Promise section for the getList method
		 *
		 * @param libs {String}
		 * @param libName {String}
		 * @param libFolder {String}
		 * @param uncleanList {{ignore: Array, move: Array}}
		 * @param that {FileObj}
		 * @returns {Promise}
		 */
		getList: function(libs, libName, libFolder, uncleanList, that) {
			return that.enumeratePackages(libs, libName, libFolder).then(
				function(data) {
					uncleanList.ignore = uncleanList.ignore.concat(data.ignore);
					uncleanList.move = uncleanList.move.concat(data.move);
				}
			);
		},

		/**
		 * Promise section for the enumeratePackages method
		 *
		 * @param fileNameAndExt {String}
		 * @param libName {String}
		 * @param localCache {{}}
		 * @param libFolder {String}
		 * @param uncleanList {{ignore: Array, move: Array}}
		 * @param that {FileObj}
		 * @returns {Promise}
		 */
		enumeratePackages: function(fileNameAndExt, libName, localCache, libFolder, uncleanList, that) {
			return arrayOfGlob([fileNameAndExt], that.bowerFileFolder, libName, 0, localCache).then(
				function(ans) {
					var lc = ans.localCache;
					var result = that.enumerateFile(ans.data, lc.fileName, libFolder, lc.fileFolder, lc.pkg === "!" ? "ignore" : "move");

					uncleanList.ignore = uncleanList.ignore.concat(result.ignore);
					uncleanList.move = uncleanList.move.concat(result.move);
				},
				function(err) {
					console.warn(err);
				}
			);
		}
	},

	/**
	 * Pass all the library in the config and call enumeratePackages for each one
	 *
	 * @returns {Array}
	 */
	getList: function() {
		var uncleanList = {
				ignore: [],
				move: []
			},
			defer = q.defer(),
			promises = [],
			src = this.source,
			that = this,
			promise = this.promise;

		for (var libs in src) {
			if (src.hasOwnProperty(libs)) {
				var libPart = libs.split("#"),
					libName = libPart[0],
					libFolder = libPart[1] || "";

				promises.push(promise.getList(src[libs], libName, libFolder, uncleanList, that));
			}
		}

		q.all(promises).then(
			function() {
				defer.resolve(that.clean(uncleanList));
			},
			function(err) {
				defer.reject(err);
			}
		);

		return defer.promise;
	},

	/**
	 * Pass all the packages in the library and call enumerateFile for each one
	 *
	 * @param pkgs {Array|String}
	 * @param libName {String}
	 * @param libFolder {String}
	 * @returns {Array}
	 */
	enumeratePackages: function(pkgs, libName, libFolder) {
		var uncleanList = {ignore: [], move: []},
			defer = q.defer(),
			promises = [],
			promise = this.promise;

		for (var pkg in pkgs) {
			if (pkgs.hasOwnProperty(pkg)) {
				var pkgPart = pkgs[pkg].split("#"),
					fileNameAndExt = pkgPart[0] || "*",
					fileFolder = pkgPart[1] || "",
					extName = path.extname(fileNameAndExt),
					fileName = path.basename(fileNameAndExt, extName),
					extension = extName.substr(1);

				if (this.extToIgnore.indexOf(extension) === -1) {
					if (regex.containDoubleAsterisk.test(pkg)) {
						console.error("The \"Globstar\" ** matching wan\"t support by CLEAN-BOWER-INSTALLER." +
						" You have to specify each folder and their destination if you really need it.");
						console.error("Please correct the source: " + libName);
						return [];
					}
				}

				var localCache = {
					fileName: fileName,
					fileFolder: fileFolder,
					pkg: pkg
				};

				promises.push(promise.enumeratePackages(fileNameAndExt, libName, localCache, libFolder, uncleanList, this));
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
		return defer.promise;
	},

	/**
	 * Pass all the files in the package and return the array of them
	 *
	 * @param files {Array}
	 * @param fileName {String}
	 * @param libFolder {String}
	 * @param fileFolder {String}
	 * @param action {String}
	 * @returns {{ignore: Array, move: Array}}
	 */
	enumerateFile: function(files, fileName, libFolder, fileFolder, action) {
		var asteriskName = false,
			f,
			unCleanList = {
				ignore: [],
				move: []
			};

		for (var i = 0, length = files.length; i < length; i++) {
			f = path.normalize(files[i]);

			if (regex.containAsterisk.test(fileName)) {
				asteriskName = true;
			}

			// Use the name of the file to replace the * (asterisk) name
			if (asteriskName) {
				fileName = path.basename(f, path.extname(f));
			}

			// Try to find the min file here
			if (this.getMin && !regex.containMin.test(f)) {
				var temp = path.extname(f),
					tempName = f.replace(temp, ".min" + temp);
				if (fs.existsSync(tempName)) {
					f = tempName;
					if (!this.renameMin) {
						fileName += ".min";
					}
				}
			}

			// Test if the link is global or relative
			if (regex.startWithSlash.test(fileFolder)) {
				// The specified file folder is global
				unCleanList[action].push({
					"from": f,
					"to": path.join(process.cwd(), fileFolder.substr(1), fileName + path.extname(f))
				});
			} else if (regex.startWithSlash.test(libFolder)) {
				// The specified lib folder is global
				unCleanList[action].push({
					"from": f,
					"to": path.join(process.cwd(), libFolder.substr(1), fileFolder, fileName + path.extname(f))
				});
			} else {
				var df;
				// Test if redirect the file to the minDefault folder or the default folder
				if (this.getMin && this.defMinFolder !== "") {
					df = (this.defMinFolder);
				} else if (this.defFolder !== "") {
					df = (this.defFolder);
				} else {
					df = "";
				}

				// None of the file or lib specified, then the folder is global
				var extFolder = this.extensionFolder[path.extname(f).substr(1)] || "";
				unCleanList[action].push({
					"from": f,
					"to": path.join(process.cwd(), df, extFolder, libFolder, fileFolder, fileName + path.extname(f))
				});
			}
		}

		return unCleanList;
	},

	/**
	 * From the list that enter, remove the "to ignore" files
	 *
	 * @param unCleanList {{ignore: Array, move: Array}}
	 * @returns {Array}
	 */
	clean: function(unCleanList) {
		var list = [];

		if (Object.keys(unCleanList).length >= 0) {
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
	},

	/**
	 * Allow recursive folder deletion
	 *
	 * @param position {String}
	 * @param [top] {boolean}
	 * @returns {Promise}
	 */
	deleteFolder: function(position, top) {
		var deferred = q.defer(),
			promises = [];

		top = top || false;

		fs.exists(position, function(exist) {
			if (exist) {
				fs.readdir(position, function(err, files) {
					if (err) {
						deferred.reject(err);
					} else {
						for (var file in files) {
							if (files.hasOwnProperty(file)) {
								promises.push(this.deleteFile(file, position, top));
							}
						}
					}
				});
			}
		});

		q.all(promises).then(
			function() {
				deferred.resolve();
			},
			function(err) {
				deferred.reject(err);
			}
		);

		return deferred.promise;
	},

	/**
	 * Allow recursive file deletion
	 *
	 * @param file {String}
	 * @param position {String}
	 * @param top {boolean}
	 */
	deleteFile: function(file, position, top) {
		var curPosition = path.join(position, file),
			deferred = q.defer();

		fs.lstat(curPosition, function(err, stat, curPosition) {
			if (err) {
				deferred.reject(err);
			} else {
				if (stat.isDirectory()) {
					this.deleteFolder(curPosition);
				} else {
					fs.unlink(curPosition, function(err) {
						if (err) {
							deferred.reject(err);
						} else if (top) {
							deferred.resolve();
						}
					});
				}
			}
		});

		return deferred.promise;
	},

	/**
	 * Method to delete the bower_components folder
	 *
	 * @returns {Promise}
	 */
	deleteBowerComponents: function() {
		var deferred = q.defer();

		this.deleteFolder(path.join(this.bowerFileFolder, "bower_components"), true).then(
			// Pass
			function() {
				deferred.resolve();
			},
			// Fail
			function(err) {
				// Make the error go up
				deferred.reject(err);
			}
		);

		return deferred.promise;
	},

	/**
	 * Execute the copy of the listed files
	 *
	 * @returns {Promise}
	 */
	run: function() {
		var deferred = q.defer(),
			that = this;

		this.getList().then(
			function(list) {
				var promises = [];

				// Backup the list of files to return them is the option verbose is set
				if (that.isVerbose) {
					that.listBackup = list;
				}

				for (var i = 0, length = list.length; i < length; i++) {
					promises.push(fs.copyQ(list[i].from, list[i].to));
				}

				q.all(promises).then(
					function() {
						if (that.isVerbose) {
							deferred.resolve(that.listBackup);
						} else {
							deferred.resolve(null);
						}
					},
					function(err) {
						deferred.reject(err);
					}
				);
			}, function(err) {
				deferred.reject(err);
			}
		);

		return deferred.promise;
	},

	/**
	 * Execute the copy of the listed files and delete the bower_components folder after
	 *
	 * @returns {Promise}
	 */
	runAndRemove: function() {
		var deferred = q.defer(),
			pointer = this;

		this.run().then(
			function(data) {
				pointer.deleteBowerComponents().then(
					function() {
						deferred.resolve(data);
					},
					function(err) {
						deferred.reject(err);
					}
				);
			},
			function(err) {
				pointer.deleteBowerComponents().finally(
					function() {
						deferred.reject(err);
					}
				);
			}
		);

		return deferred.promise;
	}
};

/**
 * Main method to move the files from the bower_components folder to their destination listed in the cInstall.source
 *
 * @param config {{}}
 * @returns {Promise}
 */
function moveFiles(config) {
	var deferred = q.defer(),
		list = new FileObj(config);

	list.run().then(
		function(message) {
			deferred.resolve(message);
		},
		function(err) {
			deferred.reject(err);
		}
	);

	return deferred.promise;
}

/**
 * Main method to move the files from the bower_components folder to their destination listed in the cInstall.source
 * and after, delete the bower_components folder.
 *
 * @param config {{}}
 * @returns {Promise}
 */
function moveFilesAndRemove(config) {
	var deferred = q.defer(),
		list = new FileObj(config);

	list.runAndRemove().then(
		function(data) {
			deferred.resolve(data);
		},
		function(err) {
			deferred.reject(err);
		}
	);

	return deferred.promise;
}

module.exports = {
	moveFiles: moveFiles,
	moveFilesAdnRemove: moveFilesAndRemove
};