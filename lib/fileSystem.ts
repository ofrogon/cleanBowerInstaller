"use strict";

import * as fs from "fs";
import * as path from "path";

/**
 * Create folder recursively (based on node-fse method)
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
	fs.mkdir(directory, (err) => {
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
			let once = true;
			const onError = (err) => {
				if (once) {
					once = false;
					callback(err);
				}
			};
			const readStream = fs.createReadStream(from);
			const writeStream = fs.createWriteStream(to);

			readStream.on('error', onError);
			writeStream.on('error', onError);

			writeStream.on('open', function () {
				readStream.pipe(writeStream);
			});

			writeStream.once('finish', function () {
				callback();
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
const rmr = function (dir: string, callback?: (err?: NodeJS.ErrnoException) => void) {
	fs.readdir(dir, (err, files) => {
		if (err) {
			// Pass the error on to callback
			callback(err);
		} else {
			const wait = files.length;
			let count = 0;
			let folderDone = (err?: Error) => {
				// If we cleaned out all the files, continue
				if (++count >= wait || err) {
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
					fs.unlink(curPath, (err) => {
						if (err && (err.code === "EISDIR")) {
							rmr(curPath, folderDone);
						} else if (err) {
							folderDone(err);
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
