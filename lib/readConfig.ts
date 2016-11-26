"use strict";

import * as fs from "fs";
import * as path from "path";
import {
	BowerConfiguration,
	CbiConfig,
	CbiConfigOption,
	CbiConfigOptionMin,
	CbiConfigOptionDefault
} from "./BowerConfiguration";

// TODO create singleton

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
 *
 * @param obj {{}}
 * @param key {String}
 * @param value {String}
 */
function arrayKeyParser(obj, key, value) {
	key = key.replace(/ /g, "");

	const keys = key.split(",");

	for (let i = 0, length = keys.length; i < length; ++i) {
		obj[keys[i]] = value;
	}
}


class Config {
	public folder: Object;
	public option: CbiConfigOption;
	public source: Object;
	public cwd: string;

	constructor() {
		const bcI = new BowerConfiguration().cInstall;

		console.dir(bcI);

		this.folder = bcI.folder;
		this.option = bcI.option;
		this.source = bcI.source;
		this.cwd = bcI.cwd;
	}

	/**
	 * Set the configuration values by overwriting with the new elements
	 *
	 * @param obj {{folder: {}, option: {default: {folder: String, minFolder: String}, min: {get: Boolean, rename: Boolean, ignoreExt: Array}, removeAfter: Boolean, verbose: Boolean}, source: {}, cwd: String, [hasOwnProperty]: Function}}
	 */
	set(obj: CbiConfig) {
		// Verify that all minimal value exist
		if (!obj.hasOwnProperty("option")) {
			obj.option = new CbiConfigOption();
		} else {
			if (!obj.option.hasOwnProperty("default")) {
				obj.option.default = new CbiConfigOptionDefault();
			}

			if (!obj.option.hasOwnProperty("min")) {
				obj.option.min = new CbiConfigOptionMin();
			}
		}

		console.dir(obj);

		if (obj.hasOwnProperty("folder")) {
			for (let el in obj.folder) {
				if (obj.folder.hasOwnProperty(el)) {
					arrayKeyParser(obj.folder, el, obj.folder[el]);
				}
			}
		}

		// Set the object
		this.folder = obj.folder || this.folder;
		this.option = {
			"default": {
				"folder": obj.option.default.folder || this.option.default.folder,
				"minFolder": obj.option.default.minFolder || this.option.default.minFolder
			},
			"min": {
				"get": obj.option.min.get || this.option.min.get,
				"rename": obj.option.min.rename || this.option.min.rename,
				"ignoreExt": obj.option.min.ignoreExt || this.option.min.ignoreExt
			},
			"removeAfter": obj.option.removeAfter || this.option.removeAfter,
			"verbose": obj.option.verbose || this.option.verbose
		};
		this.source = obj.source || this.source;
		this.cwd = obj.cwd || this.cwd;
	}
}

/**
 * Read the configuration
 *
 * @param [option] {{}}
 * @param callback {Function}
 */
const read = (option, callback: Function) => {
	option = option || {};
	const cwd = option.cwd || "";

	const folder = (()=> {
		if (path.isAbsolute(cwd)) {
			return cwd;
		} else {
			return path.join(process.cwd(), cwd);
		}
	})();

	getBowerJson(folder, (err, bowerJson) => {
		if (err) {
			callback(err, null);
		} else {
			if (!bowerJson.hasOwnProperty("cInstall")) {
				callback("Can't found the 'cInstall' object in the bower.json file.", null);
			} else if (Object.keys(bowerJson.cInstall).length === 0) {
				callback(null, "Nothing to do!");
			} else {
				const readConfig = new Config();

				console.dir(bowerJson.cInstall);
				console.dir(option);

				readConfig.set(bowerJson.cInstall);
				readConfig.set(option);

				callback(null, {
					folder: readConfig.folder,
					option: readConfig.option,
					source: readConfig.source,
					cwd: readConfig.cwd
				});
			}
		}
	});
};

export default read;
