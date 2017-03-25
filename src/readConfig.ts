"use strict";

import * as fs from "fs";
import * as path from "path";
import {BowerConfiguration} from "./bowerConfig/BowerConfiguration";
import CbiConfig from "./bowerConfig/CbiConfig";
import createError from "./createError";

/**
 * Read the bower.json file
 */
const getBowerJson = (cwd: string, callback: CallbackDefault) => {
    fs.readFile(path.join(cwd, "bower.json"), "utf8", (err, data) => {
        if (err && err.code === "EEXIST") {
            callback(createError(`No bower.json file found in ${cwd}`, "ENOBOWER"), null);
        } else if (err) {
            callback(err, null);
        } else {
            callback(null, JSON.parse(data));
        }
    });
};

/**
 * Handle the multiple values key
 */
const mergeOption = (option: CbiConfig, config: BowerConfiguration) => {
    const overrideConf = option.option;

    if (overrideConf.hasOwnProperty("min") && overrideConf.min.hasOwnProperty("rename") && overrideConf.min.rename) {
        config.cInstall.option.min.get = true;
        config.cInstall.option.min.rename = true;
    } else if (overrideConf.hasOwnProperty("min") && overrideConf.min.hasOwnProperty("get") && overrideConf.min.get) {
        config.cInstall.option.min.get = true;
    }

    if (overrideConf.hasOwnProperty("verbose") && overrideConf.verbose) {
        config.cInstall.option.verbose = true;
    }

    if (overrideConf.hasOwnProperty("removeAfter") && overrideConf.removeAfter) {
        config.cInstall.option.removeAfter = true;
    }

    if (option.hasOwnProperty("cwd")) {
        config.cInstall.cwd = option.cwd;
    }

    return config;
};

/**
 * Read the configuration
 */
const read = (option: CbiConfig, callback: CallbackDefault) => {
    option = option || new CbiConfig({});
    const cwd = option.cwd;

    const folder = (() => {
        if (cwd && path.isAbsolute(cwd)) {
            return cwd;
        } else {
            return path.join(process.cwd(), cwd);
        }
    })();

    option.cwd = folder;

    getBowerJson(folder, (err, bowerJson) => {
        if (err) {
            callback(err, null);
        } else {
            if (!bowerJson.hasOwnProperty("cInstall")) {
                callback(createError("Can't found the 'cInstall' object in the bower.json file.", "ENOCINS"), null);
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
