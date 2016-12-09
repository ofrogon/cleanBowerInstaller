"use strict";

import * as fs from "fs";
import * as path from "path";
import {BowerConfiguration} from "./BowerConfiguration";

/**
 * Read the bower.json file
 *
 * @param cwd {String}
 * @param callback {Function}
 */
function getBowerJson(cwd: string, callback: Function) {
	const bp = path.join(cwd, "bower.json");

	fs.readFile(bp, 'utf8', (err, data) => {
		if (err && err.code === "EEXIST") {
			callback(`No bower.json file found in ${cwd}`, null);
		} else if (err) {
			callback(err, null);
		} else {
			callback(null, JSON.parse(data));
		}
	});
}

/**
 * Handle the multiple values key
 */
function mergeOption(option, config: BowerConfiguration) {
	if (option.hasOwnProperty("min")) {
		config.cInstall.option.min.get = true;
	}

	if (option.hasOwnProperty("renameMin")) {
		config.cInstall.option.min.get = true;
		config.cInstall.option.min.rename = true;
	}

	if (option.hasOwnProperty("verbose")) {
		config.cInstall.option.verbose = true;
	}

	if (option.hasOwnProperty("removeAfter")) {
		config.cInstall.option.removeAfter = true;
	}

	if (option.hasOwnProperty("cwd")) {
		config.cInstall.cwd = option.cwd;
	}

	return config;
}

/**
 * Read the configuration
 *
 * @param [option] {{}}
 * @param callback {Function}
 */
const read = (option, callback: Function) => {
	option = option || {};
	let cwd = option.cwd;

	const folder = (() => {
		if (cwd && path.isAbsolute(cwd)) {
			return cwd;
		} else {
			return path.join(process.cwd(), cwd);
		}
	})();

	// TODO accept bower.json file path

	getBowerJson(folder, (err, bowerJson) => {
		if (err) {
			callback(err, null);
		} else {
			if (!bowerJson.hasOwnProperty("cInstall")) {
				callback("Can't found the 'cInstall' object in the bower.json file.", null);
			} else if (Object.keys(bowerJson.cInstall).length === 0) {
				callback(null, "Nothing to do!");
			} else {
				const config = new BowerConfiguration(bowerJson);

				callback(null, mergeOption(option, config));
			}
		}
	});
};

export default read;
