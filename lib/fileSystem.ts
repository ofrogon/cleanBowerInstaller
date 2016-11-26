"use strict";

import * as fs from "fs";
import * as path from "path";

/**
 * Create folder recursively (based on node-fs method)
 *
 * @param filePath {String}
 * @param callback {Function}
 * @param [position] {Number}
 */
const mkdirp = (filePath: string, callback: Function, position: number = 0) => {
	let parts = path.normalize(filePath).split(path.sep);

	if (position >= parts.length) {
		return callback();
	}

	position++;

	let directory = parts.slice(0, position).join(path.sep) || path.sep;
	fs.mkdir(directory, (err)=> {
		if (err && err.code !== "EEXIST") {
			return callback(err);
		} else {
			mkdirp(filePath, callback, position);
		}
	});
};

/**
 * Custom file copy method
 *
 * @param from {String}
 * @param to {String}
 * @param callback {Function}
 */
const copy = function (from: string, to: string, callback: Function) {
	mkdirp(path.dirname(to), (err) => {
		if (err) {
			callback(err);
		} else {
			fs.readFile(from, (err, data) => {
				if (err) {
					callback(err);
				} else {
					fs.writeFile(to, data, (err) => {
						if (err) {
							callback(err);
						} else {
							callback(null);
						}
					});
				}
			});
		}
	});
};

/**
 * Delete folder and his content
 *
 * @param dir {String}
 * @param callback {Function}
 */
const rmdirR = function (dir: string, callback?: (err?: NodeJS.ErrnoException) => void) {
	fs.readdir(dir, (err, files) => {
		if (err) {
			// Pass the error on to callback
			callback(err);
		} else {
			const wait = files.length;
			let count = 0;
			let folderDone = (err?: Error) => {
				count++;
				// If we cleaned out all the files, continue
				if (count >= wait || err) {
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
					let curPath = path.join(dir, file);
					fs.lstat(curPath, (err, stats) => {
						if (stats.isDirectory()) {
							rmdirR(curPath, folderDone);
						} else {
							fs.unlink(curPath, folderDone);
						}
					});
				});
			}
		}
	});
};

export {mkdirp, copy, rmdirR};
