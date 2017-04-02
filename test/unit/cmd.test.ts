"use strict";

import {expect} from "chai";
import * as  fse from "fs-extra";
import * as path from "path";
import {BowerConfiguration} from "../../src/bowerConfig/BowerConfiguration";
import run from "../../src/cmd";
import ErrorN from "../../src/types/ErrorN";
import * as share from "../share";

const longTimeOut = 5000;

const cnf = {
    cInstall: {
        cwd: process.cwd(),
        folder: {},
        option: {
            default: {
                folder: "",
                minFolder: ""
            },
            min: {
                get: false,
                ignoreExt: [],
                rename: false
            },
            removeAfter: false,
            verbose: false
        },
        source: {},
    }
};

/**
 * Test /lib/cmd.js
 */
describe("cmd", function() {
    before(function(done) {
        fse.outputJson(path.join(share.fakeBowerPath, "bower.json"), share.fakeBowerJson, (err) => {
            if (err) {
                done(err);
            } else {
                fse.outputJson(path.join(share.fakeBowerPath2, "bower.json"), share.fakeBowerJson2, (e) => {
                    done(e);
                });
            }
        });
    });

    /**
     * Test the method "run" from the module api.js
     */
    describe("run", function() {
        /**
         * Test default option (without bower.json file in the current folder)
         */
        it("no bower.json file", function(done) {
            const config = new BowerConfiguration(cnf);

            run(config, (err) => {
                if (err) {
                    expect(err).to.match(/There is no bower\.json file in.*/);
                    done();
                } else {
                    done("The script is not suppose to run with no bower.json file.");
                }
            });
        });

        /**
         * With a bower.json file
         */
        it("minimal config", function(done) {
            const config = new BowerConfiguration(cnf);

            config.cInstall.cwd = path.join(__dirname, "../../.testFolder/tempU");
            this.timeout(longTimeOut);

            run(config, (err) => {
                if (err) {
                    done("Suppose to found a bower.json file in .testFolder/tempU folder.");
                } else {
                    done();
                }
            });
        });

        /**
         * With a bower.json file and the option to get minimised file and rename then
         */
        it("rename", function(done) {
            const config = new BowerConfiguration(cnf);

            config.cInstall.cwd = path.join(__dirname, "../../.testFolder/tempU");
            config.cInstall.option.min.get = true;
            config.cInstall.option.min.rename = true;
            this.timeout(longTimeOut);

            run(config, (err) => {
                if (err) {
                    done("Suppose to found a bower.json file in .testFolder/tempU folder.");
                } else {
                    done();
                }
            });
        });

        /**
         * With a bower.json file and the option delete the bower_component file after
         */
        it("removeAfter", function(done) {
            const config = new BowerConfiguration(cnf);

            config.cInstall.cwd = path.join(__dirname, "../../.testFolder/tempU");
            config.cInstall.option.removeAfter = true;
            this.timeout(longTimeOut);

            run(config, (err: ErrorN) => {
                if (err) {
                    expect(err.code).to.equal("ENOENT");
                    done();
                } else {
                    done("This is not suppose to pass because it missing bower dependence in the bower.json file.");
                }
            });
        });
    });

    after(function(done) {
        fse.remove(share.testFolder, (err) => {
            done(err);
        });
    });
});
