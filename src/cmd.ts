"use strict";

import * as fs from "fs";
import * as path from "path";
import {BowerConfiguration, CbiConfig} from "./bowerConfig/BowerConfiguration";
import createError from "./createError";
import {moveFiles, moveFilesAndRemove} from "./fileManagement";
import ErrorN from "./types/ErrorN";

const errorMessage = createError("The command module do not receive any configuration.", "ENOCONF");

/**
 * Post treatment of the error message for the bower call
 */
const bowerError = (err: ErrorN, cnf: CbiConfig): Error => {
    if (err.code === "ENOENT") {
        return createError(`There is no bower.json file in ${cnf.cwd}`, "ENOENT");
    } else {
        return err;
    }
};

/**
 * Call the file management module
 */
const callFileManagement = (config: CbiConfig, callback: CallbackDefault) => {
    const done = (err, data) => {
        callback(err, data);
    };

    if (config.option.removeAfter) {
        moveFilesAndRemove(config, done);
    } else {
        moveFiles(config, done);
    }
};

/**
 * Simply run the clean-bower-installer without bower call
 */
const run = (config: BowerConfiguration, callback: CallbackDefault) => {
    if (config && config.cInstall.hasOwnProperty("cwd")) {
        fs.stat(path.join(config.cInstall.cwd, "bower.json"), (err: ErrorN) => {
            if (err) {
                callback(bowerError(err, config.cInstall), null);
            } else {
                callFileManagement(config.cInstall, callback);
            }
        });
    } else {
        callback(errorMessage, null);
    }
};

export default run;
