"use strict";

import * as colors from "colors";
import {run} from "./api";
import CbiConfig from "./bowerConfig/CbiConfig";
import ErrorN from "./types/ErrorN";

const successMsg = "clean-bower-installer execution successfully done!";

const cli = (program): void => {
    const option = new CbiConfig({});

    /**
     * Format the verbose CLI return
     */
    const verboseCLIReturn = (list): void => {
        for (const el of list) {
            process.stdout.write(`Copied '${el.from}' to '${el.to}'\n`);
        }
    };

    const exitTool = (e: Error | null, message: string): void => {
        if (e) {
            process.stderr.write(`${JSON.stringify(e, null, 2)}\n`);
            process.exit(1);
        } else {
            if (option.option.verbose) {
                verboseCLIReturn(message);
            }
            process.stdout.write(colors.green(`${successMsg}\n`));
            process.exit(0);
        }
    };

    // Set configuration
    if (program.bower) {
        option.cwd = program.bower;
    }

    if (program.verbose) {
        option.option.verbose = true;
    }

    if (program.removeAfter) {
        option.option.removeAfter = true;
    }

    if (program.renameMin) {
        option.option.min.get = true;
        option.option.min.rename = true;
    } else if (program.min) {
        option.option.min.get = true;
    }

    // Execute the tool
    run(option, exitTool);
};

export default cli;
