"use strict";

import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import {CbiConfig} from "./BowerConfiguration";
import * as fse from "./fileSystem";

const regex = {
    containAsterisk: new RegExp("\\*", "g"),
    containDoubleAsterisk: new RegExp("[\\*]{2}", "g"),
    containMin: new RegExp("[.]min", "g"),
    startWithSlash: new RegExp("^\/.*")
};

/**
 * Return an array of corresponding files from a array of glob patterns
 */
const arrayOfGlob = (globs: string[], bowerFileFolder: string, libName: string, callback: Function) => {
    glob(path.join(bowerFileFolder, libName, globs.pop()), (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            if (globs.length > 0) {
                arrayOfGlob(globs, bowerFileFolder, libName, (e, cData) => {
                    if (e) {
                        callback(e, null);
                    } else {
                        callback(null, data.concat(cData));
                    }
                });
            } else {
                callback(null, data);
            }
        }
    });
};

/**
 * Object for file processing
 */
class FileObj {
    /**
     * From the list that enter, remove the "to ignore" files
     *
     * @param unCleanList {{ignore: Array, move: Array}}
     * @returns {Array}
     */
    public static clean(unCleanList): string[] {
        let list = [];

        if (Object.keys(unCleanList).length >= 0) {
            const iLength = unCleanList.ignore.length;
            let mLength = unCleanList.move.length;

            for (let i = 0; i < iLength; ++i) {
                for (let j = 0; j < mLength; ++j) {
                    if (unCleanList.ignore[i].from === unCleanList.move[j].from) {
                        unCleanList.move.splice(j, 1);

                        --mLength;
                    }
                }
            }

            list = unCleanList.move;
        }

        return list;
    }

    public extToIgnore: string[];
    public bowerFileFolder: string;
    public getMin: boolean;
    public renameMin: boolean;
    public defMinFolder: string;
    public defFolder: string;
    public source: string[][];
    public extensionFolder: Object;
    public isVerbose: boolean;
    public listBackup: string[];
    public cwd: string;

    constructor(config?: CbiConfig) {
        config = config || new CbiConfig({});

        this.extToIgnore = config.option.min.ignoreExt;
        this.bowerFileFolder = path.join(config.cwd, "bower_components");
        this.getMin = config.option.min.get;
        this.renameMin = config.option.min.rename;
        this.defMinFolder = config.option.default.minFolder;
        this.defFolder = config.option.default.folder;
        this.source = config.source;
        this.extensionFolder = config.folder;
        this.isVerbose = config.option.verbose;
        this.listBackup = [];
        this.cwd = config.cwd;
    }

    /**
     * Pass all the library in the config and call enumeratePackages for each one
     *
     * @returns {Promise<Q>}
     */
    public getList(callback: Function) {
        let uncleanList = {
            ignore: [],
            move: [],
        };
        let promises = [];

        const src = this.source;

        for (let libs in src) {
            if (src.hasOwnProperty(libs)) {
                const libPart = libs.split("#");
                const libName = libPart[0];
                const libFolder = libPart[1] || "";

                promises.push(new Promise((resolve: Function, reject: Function) => {
                    this.enumeratePackages(src, libName, libFolder, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            uncleanList.ignore = uncleanList.ignore.concat(data.ignore);
                            uncleanList.move = uncleanList.move.concat(data.move);
                            resolve();
                        }
                    });
                }));

            }
        }

        Promise.all(promises).then(
            () => {
                callback(null, FileObj.clean(uncleanList));
            },
            (err) => {
                callback(err, null);
            },
        );
    }

    /**
     * Pass all the packages in the library and call enumerateFile for each one
     */
    public enumeratePackages(pkgs: string[][], libName: string, libFolder: string, callback: Function) {
        let uncleanList = {ignore: [], move: []};
        let promises = [];

        for (let pkg in pkgs) {
            if (pkgs.hasOwnProperty(pkg)) {
                try {
                    for (let x = 0, y = pkgs[pkg].length; x < y; x++) {
                        const p = pkg.split("#");
                        const fileNameAndExt = pkgs[pkg][x] || "*";
                        const fileFolder = p[1] || "";
                        const extName = path.extname(p[0]);
                        const fileName = path.basename(p[0], extName);
                        const extension = extName.substr(1);

                        if (this.extToIgnore.indexOf(extension) === -1) {
                            if (regex.containDoubleAsterisk.test(pkg)) {
                                // TODO is this useful???
                                console.error("The \"Globstar\" ** matching wan\"t support by CLEAN-BOWER-INSTALLER." +
                                    " You have to specify each folder and their destination if you really need it.");
                                console.error("Please correct the source: " + libName);
                                callback(null, []);
                            }
                        }

                        promises.push(new Promise((resolve, reject) => {
                            arrayOfGlob([fileNameAndExt], this.bowerFileFolder, libName, (err, ans) => {
                                if (err) {
                                    reject(err);
                                } else {
                                    const result = this.enumerateFile(
                                        ans.data,
                                        fileName,
                                        libFolder,
                                        fileFolder,
                                        ans === "!" ? "ignore" : "move"
                                    );

                                    uncleanList.ignore = uncleanList.ignore.concat(result.ignore);
                                    uncleanList.move = uncleanList.move.concat(result.move);

                                    resolve();
                                }
                            });
                        }));
                    }
                } catch (e) {
                    // TODO is this useful???
                    console.error(e);
                    callback(e, null);
                }
            }
        }

        Promise.all(promises).then(
            () => {
                callback(null, uncleanList);
            },
            (err) => {
                callback(err, null);
            },
        );
    }

    // TODO set better return type here
    /**
     * Pass all the files in the package and return the array of them
     */
    public enumerateFile(files: string[], fileName: string, libFolder: string, fileFolder: string, action: string) {
        let f;
        let unCleanList = {
            ignore: [],
            move: [],
        };
        let thisFile;

        for (let i = 0, length = files.length; i < length; i++) {
            f = path.normalize(files[i]);
            if (regex.containAsterisk.test(files[i]) || fileName !== "*") {
                thisFile = fileName;
            } else {
                thisFile = path.basename(f, path.extname(f));
            }

            // Try to find the min file here
            if (this.getMin && !regex.containMin.test(f)) {
                const temp = path.extname(f);
                const tempName = f.replace(temp, ".min" + temp);

                if (fs.statSync(tempName)) {
                    f = tempName;
                    if (!this.renameMin) {
                        thisFile += ".min";
                    }
                }
            }

            // Test if the link is global or relative
            if (regex.startWithSlash.test(fileFolder)) {
                // The specified file folder is global
                unCleanList[action].push({
                    from: f,
                    to: path.join(
                        this.cwd,
                        this.defFolder,
                        fileFolder.substr(1),
                        thisFile + path.extname(f)
                    )
                });
            } else if (regex.startWithSlash.test(libFolder)) {
                // The specified lib folder is global
                unCleanList[action].push({
                    from: f,
                    to: path.join(
                        this.cwd,
                        this.defFolder,
                        libFolder.substr(1),
                        fileFolder,
                        thisFile + path.extname(f)
                    )
                });
            } else {
                let df;
                // Test if redirect the file to the minDefault folder or the default folder
                if (this.getMin && this.defMinFolder !== "") {
                    df = (this.defMinFolder);
                } else if (this.defFolder !== "") {
                    df = (this.defFolder);
                } else {
                    df = "";
                }

                // None of the file or lib specified, then the folder is global
                const extFolder = this.extensionFolder[path.extname(f).substr(1)] || "";

                unCleanList[action].push({
                    from: f,
                    to: path.join(this.cwd, df, extFolder, libFolder, fileFolder, thisFile + path.extname(f)),
                });
            }
        }

        return unCleanList;
    }

    /**
     * Execute the copy of the listed files
     *
     * @returns {Promise<Q>}
     */
    public run(callback: Function) {
        this.getList((err, list) => {
            if (err) {
                callback(err, null);
            } else {
                let promises = [];

                // Backup the list of files to return them is the option verbose is set
                if (this.isVerbose) {
                    this.listBackup = list;
                }

                for (let i = 0, length = list.length; i < length; i++) {
                    promises.push(new Promise((resolve, reject) => {
                        fse.copy(list[i].from, list[i].to, (e) => {
                            if (e) {
                                reject(e);
                            } else {
                                resolve();
                            }
                        });
                    }));
                }

                Promise.all(promises).then(
                    () => {
                        if (this.isVerbose) {
                            callback(null, this.listBackup);
                        } else {
                            callback(null, null);
                        }
                    },
                    (e) => {
                        callback(e, null);
                    },
                );
            }
        });
    }

    /**
     * Execute the copy of the listed files and delete the bower_components folder after
     *
     * @returns {Promise<Q>}
     */
    public runAndRemove(callback: Function) {
        this.run((err, data) => {
            if (err) {
                fse.rmr(this.bowerFileFolder, () => {
                    callback(err, null);
                });
            } else {
                fse.rmr(this.bowerFileFolder, (e) => {
                    callback(e, data);
                });
            }
        });
    }
}

/**
 * Main method to move the files from the bower_components folder to their destination listed in the cInstall.source
 */
const moveFiles = (config: CbiConfig, callback: Function) => {
    const list = new FileObj(config);

    list.run((err, data) => {
        callback(err, data);
    });
};

/**
 * Main method to move the files from the bower_components folder to their destination listed in the cInstall.source
 * and after, delete the bower_components folder.
 */
const moveFilesAndRemove = (config: CbiConfig, callback: Function) => {
    const list = new FileObj(config);

    list.runAndRemove((err, data) => {
        callback(err, data);
    });
};

export {moveFiles, moveFilesAndRemove};
