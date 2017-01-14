"use strict";

import {exec} from "child_process";
import * as fs from "fs";
import * as path from "path";
import {BowerConfiguration, CbiConfig} from "./bowerConfig/BowerConfiguration";
import {moveFiles, moveFilesAndRemove} from "./fileManagement";

const errorMessage = "The command module do not receive any configuration.";

/**
 * Execute bower basic command in a second process before executing the tool
 */
const callBower = (config: CbiConfig, command: string, callback: Function) => {
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
};

/**
 * Post treatment of the error message for the bower call
 */
const bowerError = (err: string, cnf: CbiConfig): string => {
    if (err === "ENOENT") {
        return `There is no bower.json file in ${cnf.cwd}`;
    } else {
        return err;
    }
};

/**
 * Call the file management module
 */
const callFileManagement = (config: CbiConfig, callback: Function) => {
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
 * Execute the install
 */
const install = (config: BowerConfiguration, callback: Function) => {
    if (config && config.cInstall.hasOwnProperty("cwd")) {
        callBower(config.cInstall, "install", (err) => {
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

/**
 * Execute the update
 */
const update = (config: BowerConfiguration, callback: Function) => {
    if (config && config.cInstall.hasOwnProperty("cwd")) {
        callBower(config.cInstall, "update", (err) => {
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

/**
 * Simply run the clean-bower-installer without bower call
 */
const run = (config: BowerConfiguration, callback: Function) => {
    if (config && config.cInstall.hasOwnProperty("cwd")) {
        fs.stat(path.join(config.cInstall.cwd, "bower.json"), (err) => {
            if (err) {
                callback(bowerError(err.code, config.cInstall), null);
            } else {
                callFileManagement(config.cInstall, callback);
            }
        });
    } else {
        callback(errorMessage, null);
    }
};

export {install, update, run};
