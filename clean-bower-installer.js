"use strict";

var path = require('path');
var fs = require('fs-extra');
var bower = require('bower');
var colors = require('colors/safe');
var glob = require("glob");

//Regex
var startWithSlash = new RegExp('^\/.*');
var containAsterisk = new RegExp('\\*', 'g');
var containDoubleAsterisk = new RegExp('[\\*]{2}', 'g');

//TODO find is runAsCli is important
var runAsCli = cliDetection();
var commandList = ['install', 'update'];
var bowerPath = './';
var bowerMessage;

var bowerFolder = "./bower_components";

var option = {
	"default": "",
	"min": false,
	"removeAfter": false,
	"minFolder": "",
	"copyFolder": ""
};
var folder = {};
var source = {};

// Call autoRun function at start to detect if call by cli or by script
autoRun();

/**
 * This function is call at start to detect if it will be in mode CLI or API
 */
function autoRun() {
	if (runAsCli) {
		getCommandLineArgument();
	}
}

/**
 * Detect if the script was call by cli or script
 *
 * @returns {boolean}
 */
function cliDetection() {
	// True if call by cli
	return !module.parent;
}

/**
 * Parse the arguments from the console call, execute them and call the clean-bower-install execution
 */
function getCommandLineArgument() {
	var length = process.argv.length;
	if (length > 2) {
		var argumentList = [];

		for (var i = 2; i < length; i++) {
			var toExecute = verify(process.argv[i]);
			if (toExecute !== false) {
				if (toExecute == 'bowerPath') {
					bowerPath = path.join(__dirname, process.argv[i]);
				}

				argumentList.push(toExecute);
			}
		}

		// Verify if the command 'install' and 'update' were both argument of the command
		if (argumentList.indexOf('install') !== -1 && (argumentList.indexOf('update') !== -1)) {
			throw new Error('Error: The command line don\'t accept the two command \'install\' and \'update\' at the same time.');
		} else {
			var commandLength = argumentList.length;
			for (var y = 0; y < commandLength; y++) {
				if (argumentList[y] != 'bowerPath') {
					execute(argumentList[y]);
				}
			}
		}
	} else {
		runCBI();
	}
}

/**
 * Verify that the command exist in the list
 *
 * @param command {string}
 * @returns {string|boolean}
 */
function verify(command) {
	if (command === undefined) {
		return false;
	} else if (commandList.indexOf(command) != -1) {
		return command;
	} else {
		if (testIfPathExist(command)) {
			return 'bowerPath';
		} else {
			return false;
		}
	}
}

/**
 * Execute a command
 *
 * @param command {string}
 */
function execute(command) {
	switch (command) {
		case 'install':
			if (runAsCli) {
				bower.commands.
					install(undefined, undefined, { cwd: bowerPath }).
					on('end', function(installed) {
						if (Object.keys(installed).length !== 0) {
							console.log(installed);
						}
						runCBI();
					});
			} else {
				bower.commands.
					install(undefined, undefined, { cwd: bowerPath, json: true }).
					on('end', function(installed) {
						bowerMessage = installed;
						runCBI();
					});
			}
			break;
		case 'update':
			if (runAsCli) {
				bower.commands.
					update(undefined, undefined, { cwd: bowerPath }).
					on('end', function(installed) {
						if (Object.keys(installed).length !== 0) {
							console.log(installed);
						}
						runCBI();
					});
			} else {
				bower.commands.
					update(undefined, undefined, { cwd: bowerPath, json: true }).
					on('end', function(installed) {
						bowerMessage = installed;
						runCBI();
					});
			}
			break;
		default :
			throw new Error('Error: Unrecognised command.');
	}
}


/**
 * Verify that the specified path exist
 *
 * @param path {string}
 * @returns {boolean}
 */
function testIfPathExist(path) {
	return fs.existsSync(path);
}

/* Execution */

/**
 * Clean-Bower-Install main logic function
 */
function runCBI() {
	if (testIfPathExist(bowerPath)) {
		try {
			var bowerJSON = require(bowerPath + 'bower.json');
		} catch (e) {
			console.log(colors.yellow('clean-bower-install execution can not be done because of that error: ' + e));
		}
	}

	var cInstall = bowerJSON.cInstall;

	if (cInstall !== undefined) {
		if (cInstall.option !== undefined) {
			// To add only new option specified by the user
			for (var setup in cInstall.option) {
				if (cInstall.option.hasOwnProperty(setup) && option.hasOwnProperty(setup)) {
					option[setup] = cInstall.option[setup];
				}
			}
		}

		if (cInstall.folder !== undefined) {
			folder = cInstall.folder;
			var typeInTreatment;
			for (var fileType in folder) {
				if (folder.hasOwnProperty(fileType)) {
					typeInTreatment = fileType.replace(/\s/g, '').split(',');

					// Split into multiple value comma divided chunk
					var length = typeInTreatment.length;
					if (length > 1) {
						for (var i = 0; i < length; i++) {
							folder[typeInTreatment[i]] = folder[fileType];
						}
					}
				}
			}
		}

		if (cInstall.source !== undefined) {
			source = cInstall.source;
			// TODO source option
		}

		moveFiles();

	} else {
		console.log(colors.yellow('clean-bower-install execution can not be done because no \'cInstall\' section were found in the bower.json file.'));
	}
}

/**
 * Move the files from the bower repository to their destination
 */
function moveFiles() {
	var file, length, i,
		filesToMove = generateFileList();

	if (filesToMove === false) {
		return;
	}

	filesToMove = removeDuplicate(filesToMove);

	length = filesToMove.length;
	for (i = 0; i < length; i++) {
		file = filesToMove[i];
		fs.copy(file.from, path.join(file.to, file.rename), function(err) {
			if (err) {
				return console.error(err);
			}
		});
	}
}

function generateFileList() {
	var filesToMove = [], libFolder = '', libName = '', file, fileNameAndExt, fileName, fileFolder,
		extension, temp, currLib, length, i, asteriskName;

	for (var lib in source) {
		if (source.hasOwnProperty(lib)) {
			// TODO work here
			temp = lib.split('#');
			libName = temp[0];
			libFolder = temp[1] || '';
			currLib = source[lib];

			// For each files to get in the lib
			for (file in currLib) {
				if (currLib.hasOwnProperty(file)) {
					temp = file.split('#');
					fileNameAndExt = temp[0] || '*';
					fileName = path.basename(fileNameAndExt, path.extname(fileNameAndExt));
					fileFolder = temp[1] || '';
					extension = path.extname(fileNameAndExt).substr(1);

					// Because of the rename function and the folder specification, the Globstar" ** matching of glob can't be use
					if (containDoubleAsterisk.test(currLib[file])) {
						console.error(colors.red('The "Globstar" ** matching wan\'t support by CLEAN-BOWER-INSTALLER. You have to specify each folder and their destination if you really need it.'));
						console.error(colors.red('Please correct the source: '+ libName));
						return false;
					}

					// List files who fit the
					var files = glob.sync(path.join(bowerFolder, libName, currLib[file]));

					// Add the needed folders to the Array filesToMove
					length = files.length;
					asteriskName = false;
					for (i = 0; i < length; i++) {
						if (containAsterisk.test(fileName)) {
							asteriskName = true;
						}

						if (asteriskName) {
							fileName = path.basename(files[i], path.extname(files[i]));
						}

						// Test if the link is global or relative
						if (startWithSlash.test(fileFolder)) {
							// The specified file folder is global
							filesToMove.push({
								'from': files[i],
								'to': fileFolder.substr(1),
								'rename': fileName + path.extname(files[i])
							});
						} else if (startWithSlash.test(libFolder)) {
							// The specified lib folder is global
							filesToMove.push({
								'from': files[i],
								'to': path.join(libFolder.substr(1), fileFolder),
								'rename': fileName + path.extname(files[i])
							});
						} else {
							// None of the file or lib specified folder is global
							filesToMove.push({
								'from': files[i],
								'to': path.join(option.default, folder[path.extname(files[i]).substr(1)], libFolder, fileFolder),
								'rename': fileName + path.extname(files[i])
							});
						}
					}
				}
			}
		}
	}

	return filesToMove;
}

/**
 * Remove duplicate input in a array and short it
 *
 * @param a {Array}
 * @returns {Array}
 */
function removeDuplicate(a) {
	return a.sort().filter(function(item, pos) {
		return !pos || item != a[pos - 1];
	})
}

/* API commands*/
/**
 * API command to run clean-bower-install with a bower.json in the same folder
 *
 * @param [command] {string}
 */
function run(command) {
	runAsCli = false;

	if (verify(command) !== false) {
		if (command != 'bowerPath') {
			execute(command);
		}
	}

	if (command === undefined) {
		runCBI();
	}
}

/**
 * API command to run clean-bower-install with a bower.json in a specified folder
 *
 * @param relativePath {string}
 * @param [command] {string}
 */
function runFrom(relativePath, command) {
	runAsCli = false;

	var bowerFilePath = path.join(__dirname, relativePath);

	// Error handling
	if (relativePath === undefined) {
		throw new Error('Wrong call to clean-bower-install runFrom() function: No path provided.');
	}

	if (!testIfPathExist(bowerFilePath)) {
		throw new Error('Can not find the file bower.json at the specified path.');
	}

	// Execution
	bowerPath = bowerFilePath;

	if (verify(command) !== false) {
		if (command != 'bowerPath') {
			execute(command);
		}
	}

	if (command === undefined) {
		runCBI();
	}
}

exports.run = run;
exports.runFrom = runFrom;