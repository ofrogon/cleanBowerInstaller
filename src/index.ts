#!/usr/bin/env node
"use strict";

import * as program from "commander";
import * as fs from "fs";
import * as path from "path";
import cli from "./cli";

const errorFct = (err: Error) => {
    console.error(err);
    process.exit(1);
};

/**
 * Parse the path pass to it's absolute form
 */
const parsePath = (element?: string): string => {
    if (element) {
        element = element.replace(/^(?:(?:'(.*)')|(?:"(.*)"))$/, "$1$2");

        if (path.isAbsolute(element)) {
            return element;
        } else {
            return path.join(process.cwd(), element);
        }
    } else {
        return process.cwd();
    }
};

fs.readFile(path.join(__dirname, "..", "..", "package.json"), "utf8", (err?: Error, data?: string): void => {
    if (err) {
        errorFct(err);
    } else {
        try {
            const pkg = JSON.parse(data);

            program
                .version(pkg.version, "-v, --version")
                .option("-b, --bower [path]", "Input the bower.json file path.", parsePath, null)
                .option("-m, --min", "Try to get .min file version first.", null, null)
                .option("-M, --renameMin", "Try to get .min file version first and rename them.", null, null)
                .option("-V, --verbose", "Get more information from the tool.", null, null)
                .option("-r, --removeAfter", "Remove the bower_components folder after execution.", null, null)
                .parse(process.argv);

            cli(program);
        } catch (e) {
            errorFct(e);
        }
    }
});
