"use strict";

import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";
import ErrorN from "./types/ErrorN";

/**
 * Create folder recursively (based on node-fse method)
 */
const mkdirp = (filePath: string, callback): void => {
    const _mkdirp = (dirFilePath: string, position: number): void => {
        const parts = path.normalize(dirFilePath).split(path.sep);

        if (position >= parts.length) {
            return callback();
        }

        ++position;

        const directory = parts.slice(0, position).join(path.sep) || path.sep;
        fs.mkdir(directory, (err: ErrorN) => {
            if (err && err.code !== "EEXIST") {
                return callback(err);
            } else {
                _mkdirp(dirFilePath, position);
            }
        });
    };

    _mkdirp(filePath, 0);
};

/**
 * Custom file copy method
 */
const copy = (from: string, to: string, callback: CallbackError): void => {
    mkdirp(path.dirname(to), (err) => {
        if (err) {
            callback(err);
        } else {
            let once = true;
            const onError = (e) => {
                if (once) {
                    once = false;
                    callback(e);
                }
            };
            const readStream = fs.createReadStream(from);
            const writeStream = fs.createWriteStream(to);

            readStream.on("error", onError);
            writeStream.on("error", onError);

            writeStream.on("open", () => {
                readStream.pipe(writeStream);
            });

            writeStream.once("finish", () => {
                if (once) {
                    once = false;
                    callback();
                }
            });
        }
    });
};

/**
 * Delete folder and his content
 */
const rmr = (dir: string, callback?: (err?: NodeJS.ErrnoException) => void): void => {
    fs.stat(dir, (err) => {
        if (err) {
            callback(err);
        } else {
            rimraf(dir, callback);
        }
    });
};

export {mkdirp, copy, rmr};
