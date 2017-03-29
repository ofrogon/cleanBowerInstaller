"use strict";

import * as colors from "colors";
import {install, run, update} from "./api";
import CbiConfig from "./bowerConfig/CbiConfig";

const successMsg = "clean-bower-installer execution successfully done!";

const cli = (program) => {
    /**
     * Format the verbose CLI return
     */
    const verboseCLIReturn = (list): void => {
        for (const el of list) {
            process.stdout.write(`Copied '${el.from}' to '${el.to}'\n`);
        }
    };

    const exitTool = (e, message) => {
        if (e) {
            process.stderr.write(`${e.error}\n`);
            process.exit(1);
        } else {
            if (option.option.verbose) {
                verboseCLIReturn(message);
            }
            process.stdout.write(colors.green(`${successMsg}\n`));
            process.exit(0);
        }
    };

    const option = new CbiConfig({});

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

    // Run the whole
    if (program.install) {
        install(option, exitTool);
    } else if (program.update) {
        update(option, exitTool);
    } else {
        run(option, exitTool);
    }
};

export default cli;
