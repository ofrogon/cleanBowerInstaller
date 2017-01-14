"use strict";

import * as colors from "colors";
import {install, run, update} from "./cmd";
import cnf from "./readConfig";

const successMsg = "clean-bower-installer execution successfully done!";

const cli = (program) => {
    /**
     * Format the verbose CLI return
     *
     * @param list {Array}
     * @returns {string}
     */
    const verboseCLIReturn = (list): string => {
        let output = "";
        for (const i of list) {
            output += `Copied '${list[i].from}' to '${list[i].to}'\n`;
        }
        return output;
    };

    cnf({cwd: program.bower}, (err, config) => {
        const exitTool = (e, message) => {
            if (e) {
                process.stderr.write(`${e.error}\n`);
                process.exit(1);
            } else {
                if (config.cInstall.option.verbose) {
                    process.stdout.write(verboseCLIReturn(message));
                }
                process.stdout.write(colors.green(`${successMsg}\n`));
                process.exit(0);
            }
        };

        if (err) {
            exitTool(err, null);
        } else {
            if (program.verbose) {
                config.cInstall.option.verbose = true;
            }

            if (program.removeAfter) {
                config.cInstall.option.removeAfter = true;
            }

            // Add load of minimised file version and renaming of them if needed
            if (program.renameMin) {
                config.cInstall.option.min.get = true;
                config.cInstall.option.min.rename = true;
            } else if (program.min) {
                config.cInstall.option.min.get = true;
                config.cInstall.option.min.rename = false;
            } else {
                config.cInstall.option.min.get = false;
                config.cInstall.option.min.rename = false;
            }

            // Actions
            if (program.install) {
                install(config, exitTool);
            } else if (program.update) {
                update(config, exitTool);
            } else {
                run(config, exitTool);
            }
        }
    });
};

export {cli};
