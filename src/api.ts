"use strict";

import {CbiConfig} from "./BowerConfiguration";
import * as cmd from "./cmd";
import cnf from "./readConfig";

/**
 * Call cmd.js command using promise
 */
const callCmd = (cmd: Function, option: CbiConfig, callback: Function) => {
    if (typeof(option) === "object") {
        option = new CbiConfig(option);

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
                    cmd(config, (e, res) => {
                        callback(e, res);
                    });
                }
            }
        });
    } else {
        callback(new Error("Wrong option type"), null);
    }
};

/**
 * Execute the install
 */
const install = (option: CbiConfig, callback: Function) => {
    callCmd(cmd.install, option, callback);
};

/**
 * Execute the update
 */
const update = (option: CbiConfig, callback: Function) => {
    callCmd(cmd.update, option, callback);
};

/**
 * Simply run the clean-bower-installer without bower call
 */
const run = (option: CbiConfig, callback: Function) => {
    callCmd(cmd.run, option, callback);
};

/**
 * Run the clean-bower-installer with the min option, without bower call
 */
const runMin = (option: CbiConfig, callback: Function) => {
    try {
        option = new CbiConfig(option);

        option.option.min.get = true;
        option.option.min.rename = false;

        callCmd(cmd.run, option, callback);
    } catch (e) {
        callback(e, null);
    }
};

/**
 * Run the clean-bower-installer with the min  and the renameMin option, without bower call
 */
const runMinR = (option: CbiConfig, callback: Function) => {
    try {
        option = new CbiConfig(option);

        option.option.min.get = true;
        option.option.min.rename = true;

        callCmd(cmd.run, option, callback);
    } catch (e) {
        callback(e, null);
    }
};

export {install, update, run, runMin, runMinR};
