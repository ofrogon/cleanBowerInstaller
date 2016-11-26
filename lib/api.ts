"use strict";

import * as cmd from "./cmd";
import cnf from "./readConfig";
import {CbiConfig} from "./BowerConfiguration";

/**
 * Call cmd.js command using promise
 *
 * @param cmd {Function}
 * @param option {Object}
 * @param callback {Function}
 */
function callCmd(cmd: Function, option, callback: Function) {
	option = option || {};

	if (!option.hasOwnProperty("cwd")) {
		option.cwd = process.cwd();
	}

	cnf(option, (err, config) => {
		if (err) {
			callback(err, null);
		} else {
			if (config === "Nothing to do!") {
				callback(null, config);
			} else {
				cmd(config, (err, res) => {
					callback(err, res);
				});
			}
		}
	});
}

/**
 * Execute the install
 *
 * @param [option] {Object}
 * @param callback {Function}
 */
const install = (option, callback: Function) => {
	callCmd(cmd.install, option, callback);
};

/**
 * Execute the update
 *
 * @param [option] {Object}
 * @param callback {Function}
 */
const update = (option, callback: Function) => {
	callCmd(cmd.update, option, callback);
};

/**
 * Simply run the clean-bower-installer without bower call
 *
 * @param [option] {Object}
 * @param callback {Function}
 */
const run = (option, callback) => {
	callCmd(cmd.run, option, callback);
};

/**
 * Run the clean-bower-installer with the min option, without bower call
 *
 * @param [option] {Object}
 * @param callback {Function}
 */
const runMin = (option: CbiConfig, callback) => {
	try {
		option = option || new CbiConfig();

		option.option.min.get = true;
		option.option.min.rename = false;
	} catch (e) {
		callback(e, null);
	}

	callCmd(cmd.run, option, callback);
};

/**
 * Run the clean-bower-installer with the min  and the renameMin option, without bower call
 *
 * @param [option] {Object}
 * @param callback {Function}
 */
const runMinR = (option: CbiConfig, callback) => {
	try {
		option = option || new CbiConfig();

		option.option.min.get = true;
		option.option.min.rename = true;
	} catch (e) {
		callback(e, null);
	}

	callCmd(cmd.run, option, callback);
};

export {install, update, run, runMin, runMinR};
