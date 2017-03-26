"use strict";

import {createHash} from "crypto";
import * as fs from "fs";

const isDirectory = (folderPath: string): boolean => {
    return fs.statSync(folderPath).isDirectory();
};

const isExisting = (filePath: string): boolean => {
    return fs.existsSync(filePath);
};

const isFile = (filePath: string): boolean => {
    return fs.statSync(filePath).isFile();
};

const toSha1 = (content: Buffer): string => {
    return createHash("sha1").update(content).digest("hex");
};

export {isDirectory, isExisting, isFile, toSha1}
