"use strict";

import {expect} from "chai";
import * as  fse from "fs-extra";
import * as path from "path";
import {run, runMin, runMinR} from "../../src/api";
import CbiConfig from "../../src/bowerConfig/CbiConfig";
import ErrorN from "../../src/types/ErrorN";
import * as share from "../share";

/**
 * Test /lib/api.js
 */
describe("api", function() {
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
         * Without Config object as configuration
         */
        // it("wrong options", function(done) {
        //     run("wrong option", (err) => {
        //         if (err) {
        //             expect(err instanceof Error).to.equal(true);
        //             done();
        //         } else {
        //             done("string pass as a accepted option but we want an object.");
        //         }
        //     });
        // });

        /**
         * Test default option (without bower.json file in the current folder)
         */
        it("empty options", function(done) {
            run(null, (err: ErrorN) => {
                if (err) {
                    expect(err.code).to.equal("ENOOPTION");
                    done();
                } else {
                    done(`This test is not suppose to pass, remove any bower.json contained in folder ${__dirname}`);
                }
            });
        });

        /**
         * With a bower.json file
         */
        it("good options", function(done) {
            run(new CbiConfig({cwd: ".testFolder/tempU/"}), (err) => {
                done(err);
            });
        });
    });

    /**
     * Test the method "runMin" from the module api.js
     */
    describe("runMin", function() {
        /**
         * Without Config object as configuration
         */
        // it("wrong options", function(done) {
        //     runMin("wrong option", (err) => {
        //         if (err) {
        //             expect(err instanceof Error).to.equal(true);
        //             done();
        //         } else {
        //             done("string pass as a accepted option but we want an object.");
        //         }
        //     });
        // });

        /**
         * Test default option (without bower.json file in the current folder)
         */
        it("empty options", function(done) {
            runMin(null, (err: ErrorN) => {
                if (err) {
                    expect(err.code).to.equal("ENOENT");
                    done();
                } else {
                    done(`This test is not suppose to pass, remove any bower.json contained in folder ${__dirname}`);
                }
            });
        });

        /**
         * With a bower.json file
         */
        it("good options", function(done) {
            runMin(new CbiConfig({cwd: ".testFolder/tempU/"}), (err) => {
                done(err);
            });
        });
    });

    /**
     * Test the method "runMinR" from the module api.js
     */
    describe("runMinR", function() {
        /**
         * Without Config object as configuration
         */
        // it("wrong options", function(done) {
        //     runMinR("wrong option", (err) => {
        //         if (err) {
        //             expect(err instanceof Error).to.equal(true);
        //             done();
        //         } else {
        //             done("string pass as a accepted option but we want an object.");
        //         }
        //     });
        // });

        /**
         * Test default option (without bower.json file in the current folder)
         */
        it("empty options", function(done) {
            runMinR(null, (err: ErrorN) => {
                if (err) {
                    expect(err.code).to.equal("ENOENT");
                    done();
                } else {
                    done(`This test is not suppose to pass, remove any bower.json contained in folder ${__dirname}`);
                }
            });
        });

        /**
         * With a bower.json file
         */
        it("good options", function(done) {
            runMinR(new CbiConfig({cwd: ".testFolder/tempU/"}), (err) => {
                done(err);
            });
        });
    });

    after(function(done) {
        fse.remove(share.testFolder, (err) => {
            done(err);
        });
    });
});
