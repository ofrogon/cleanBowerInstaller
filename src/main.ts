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
        for (let i = 0, j = list.length; i < j; ++i) {
            output += `Copied '${list[i].from}' to '${list[i].to}'\n`;
        }
        return output;
    };

    cnf({cwd: program.bower}, (err, config) => {
        const exitTool = (e, message) => {
            if (e) {
                console.log(e.error);
                process.stderr.write(e.error + "\n");
                process.exit(1);
            } else {
                if (config.option.verbose) {
                    console.log(verboseCLIReturn(message));
                }
                console.log(colors.green(successMsg));
                process.exit(0);
            }
        };

        if (err) {
            exitTool(err, null);
        } else {
            if (program.verbose) {
                config.option.verbose = true;
            }

            if (program.removeAfter) {
                config.option.removeAfter = true;
            }

            // Add load of minimised file version and renaming of them if needed
            if (program.renameMin) {
                config.option.min.get = true;
                config.option.min.rename = true;
            } else if (program.min) {
                config.option.min.get = true;
                config.option.min.rename = false;
            } else {
                config.option.min.get = false;
                config.option.min.rename = false;
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
