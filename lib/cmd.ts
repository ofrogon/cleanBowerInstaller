"use strict";

import {moveFiles, moveFilesAndRemove} from "./fileManagement";
import {exec} from "child_process";
import * as path from "path";
import * as fs from "fs";

const errorMessage = "The command module do not receive any configuration.";

/**
 * Execute bower basic command in a second process before executing the tool
 *
 * @param config {{}}
 * @param command (String}
 * @param callback
 */
function callBower(config, command: string, callback: Function) {
	/* Bower install done the update if the file already exist so in the case of not knowing which one to use (install or update)
	 * install will do both.*/
	fs.stat(path.join(config.cwd, "bower.json"), (err) => {
		if (err) {
			callback(err, null);
		} else {
			if (command === "install") {
				exec("bower install", {cwd: config.cwd}, (error, stdout) => {
					callback(error, stdout);
				});
			} else if (command === "update" || command === "automatic") {
				exec("bower update", {cwd: config.cwd}, (error, stdout) => {
					callback(error, stdout);
				});
			} else {
				callback(new Error(`Bower command unrecognised: ${command}`), null);
			}
		}
	});
}

/**
 * Post treatment of the error message for the bower call
 *
 * @param err {String}
 * @param cnf {{}}
 */
function bowerError(err: string, cnf): string {
	if (err === "ENOENT") {
		return `There is no bower.json file in ${cnf.cwd}`;
	} else {
		return err;
	}
}

/**
 * Call the file management module
 *
 * @param config {{}}
 * @param callback {Function}
 */
function callFileManagement(config, callback: Function) {
	const done = (err, data) => {
		callback(err, data);
	};

	if (config.option.removeAfter) {
		moveFilesAndRemove(config, done);
	} else {
		moveFiles(config, done);
	}
}

/**
 * Execute the install
 *
 * @param config {{}}
 * @param callback {Function}
 */
const install = (config, callback: Function) => {
	if (config && config.hasOwnProperty("cwd")) {
		callBower(config, "install", (err) => {
			if (err) {
				callback(bowerError(err, config), null);
			} else {
				callFileManagement(config, callback);
			}
		});
	} else {
		callback(errorMessage, null);
	}
};

/**
 * Execute the update
 *
 * @param config {{}}
 * @param callback {Function}
 */
const update = (config, callback: Function) => {
	if (config && config.hasOwnProperty("cwd")) {
		callBower(config, "update", (err) => {
			if (err) {
				callback(bowerError(err, config), null);
			} else {
				callFileManagement(config, callback);
			}
		});
	} else {
		callback(errorMessage, null);
	}
};

/**
 * Simply run the clean-bower-installer without bower call
 *
 * @param config {{}}
 * @param callback {Function}
 */
const run = (config, callback: Function) => {
	if (config && config.hasOwnProperty("cwd")) {
		fs.stat(path.join(config.cwd, "bower.json"), (err) => {
			if (err) {
				callback(bowerError(err.code, config), null);
			} else {
				callFileManagement(config, callback);
			}
		});
	} else {
		callback(errorMessage, null);
	}
};

export {install, update, run};
