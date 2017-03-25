"use strict";

import * as fs from "fs";
import * as path from "path";
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
 *
 * @param from {string}
 * @param to {string}
 * @param callback {Function}
 */
const copy = (from: string, to: string, callback: CallbackError) => {
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
 *
 * @param dir {string}
 * @param callback {Function}
 */
const rmr = (dir: string, callback?: (err?: NodeJS.ErrnoException) => void) => {
    fs.readdir(dir, (err, files) => {
        if (err) {
            // Pass the error on to callback
            callback(err);
        } else {
            const wait = files.length;
            let count = 0;
            const folderDone = (e?: Error) => {
                // If we cleaned out all the files, continue
                if (++count >= wait || e) {
                    fs.rmdir(dir, callback);
                }
            };

            // Empty directory to fail early
            if (!wait) {
                folderDone();
            } else {
                // Remove one or more trailing slash to keep from doubling up
                dir = dir.replace(/\/+$/, "");
                files.forEach((file) => {
                    const curPath = path.join(dir, file);
                    fs.unlink(curPath, (e) => {
                        if (e && (e.code === "EISDIR")) {
                            rmr(curPath, folderDone);
                        } else if (e) {
                            folderDone(e);
                        } else {
                            folderDone();
                        }
                    });
                });
            }
        }
    });
};

export {mkdirp, copy, rmr};
