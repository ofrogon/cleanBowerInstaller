"use strict";

import {CbiConfig} from "./bowerConfig/BowerConfiguration";
import cmd from "./cmd";
import createError from "./createError";
import cnf from "./readConfig";
import {CommandCBI} from "./types/CommandCBI";

/**
 * Call cmd.ts command
 */
const callCmd = (cmd: CommandCBI, option: CbiConfig, callback: CallbackDefault): void => {
    if (option instanceof CbiConfig) {
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
        callback(createError("Wrong option type", "ENOOPTION"), null);
    }
};

/**
 * Simply run the clean-bower-installer
 */
const run = (option: CbiConfig, callback: CallbackDefault): void => {
    callCmd(cmd, option, callback);
};

/**
 * Run the clean-bower-installer with the min option
 */
const runMin = (option: CbiConfig, callback: CallbackDefault): void => {
    const _option = new CbiConfig(option);

    _option.option.min.get = true;
    _option.option.min.rename = false;

    callCmd(cmd, _option, callback);
};

/**
 * Run the clean-bower-installer with the min and the renameMin option
 */
const runMinR = (option: CbiConfig, callback: CallbackDefault): void => {
    option = new CbiConfig(option);

    option.option.min.get = true;
    option.option.min.rename = true;

    callCmd(cmd, option, callback);
};

export {run, runMin, runMinR};
