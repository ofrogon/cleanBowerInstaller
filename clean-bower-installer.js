"use strict";

var path = require('path');
var fs = require('fs');
var mkdirp = require('mkdirp');
var bower = require('bower');
var colors = require('colors');

//TODO find is runAsCli is important
var runAsCli = cliDetection();
var commandList = ['install', 'update'];
var bowerPath = './bower.json';
var bowerMessage;

var option = {
	"default": "",
	"min": false,
	"removeAfter": false,
	"minFolder": "",
	"copyFolder": ""
};

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
						console.log(installed);
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
						console.log(installed)
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
	if (!fs.existsSync(path)) {
		throw new Error('Can not find the file bower.json at the specified path.');
	} else {
		return true;
	}
}

/* Execution */

/**
 * Clean-Bower-Install main logic function
 */
function runCBI() {
	if (testIfPathExist(bowerPath)) {
		try {
			var bowerJSON = require(bowerPath);
		} catch (e) {
			console.log('clean-bower-install execution can not be done because of that error: '.yellow + e.yellow);
		}
	}

	var cInstall = bowerJSON.cInstall;

	if (cInstall !== undefined) {
		// TODO all logic here
		if (cInstall.option !== undefined) {
			option = cInstall.option;
			if (option.default !== undefined) {
				if (testIfPathExist(option.default)) {
					// TODO set default path
				}
			}

			if (option.min !== undefined) {
				if (option.min) {
					// TODO val true so take min version in priority
				}
			}

			if (option.removeAfter !== undefined) {
				if (option.removeAfter) {
					// TODO val true so clear bower folder
				}
			}

			if (option.minFolder !== undefined) {
				if (option.min !== undefined) {
					console.error('You need to specify the option min to true to use this option too.'.red);
				} else if (testIfPathExist(option.minFolder)) {
					// TODO set min folder destination
				} else {
					// TODO create folder
				}
			}

			if (option.copyFolder !== undefined) {
				if (testIfPathExist(option.copyFolder)) {
					// TODO set the copy folder
				} else {
					// TODO create folder
				}
			}
		}

		if (cInstall.folder !== undefined) {
			// TODO folder option
		}

		if (cInstall.source !== undefined) {
			// TODO source option
		}

	} else {
		console.log('clean-bower-install execution can not be done because no \'cInstall\' section were found in the bower.json file.'.yellow);
	}
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

	var filePath = path.join(__dirname, relativePath);

	// Error handling
	if (relativePath === undefined) {
		throw new Error('Wrong call to clean-bower-install runFrom() function: No path provided.');
	}
	testIfPathExist(filePath);

	// Execution
	bowerPath = filePath;

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