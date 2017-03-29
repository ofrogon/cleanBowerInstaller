"use strict";

import {createHash} from "crypto";
import * as fs from "fs";

const isDirectory = (folderPath: string): boolean => {
    try {
        return fs.statSync(folderPath).isDirectory();
    } catch (e) {
        return false;
    }
};

const isExisting = (filePath: string): boolean => {
    try {
        return fs.existsSync(filePath);
    } catch (e) {
        return false;
    }
};

const isFile = (filePath: string): boolean => {
    try {
        return fs.statSync(filePath).isFile();
    } catch (e) {
        return false;
    }
};

const toSha1 = (content: Buffer): string => {
    return createHash("sha1").update(content).digest("hex");
};

export {isDirectory, isExisting, isFile, toSha1}
