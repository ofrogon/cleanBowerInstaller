"use strict";

import {expect} from "chai";
import * as  fse from "fs-extra";
import * as path from "path";
import read from "../../src/readConfig";
import * as share from "../share";

/**
 * Test /lib/readConfig.js
 */
describe("readConfig", function() {

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
     * Test the different type of path to read config
     */
    describe("path in cwd", function() {
        /**
         * Test with a relative path
         */
        it("relative", function(done) {
            read({cwd: share.fakeBowerPath}, (err, conf) => {
                if (err) {
                    done(err);
                } else {
                    expect(conf).to.equal("Nothing to do!");
                    done();
                }
            });
        });

        /**
         * Teat with a absolute path
         */
        it("absolute", function(done) {
            read({cwd: path.join(__dirname, "../..", share.fakeBowerPath)}, (err, conf) => {
                if (err) {
                    done(err);
                } else {
                    expect(conf).to.equal("Nothing to do!");
                    done();
                }
            });
        });
    });

    /**
     * Test the reading of the config file
     */
    describe("read", function() {
        /**
         * A file without data in it
         */
        it("bower.json file without config", function(done) {
            read({cwd: share.fakeBowerPath}, (err, conf) => {
                if (err) {
                    done(err);
                } else {
                    expect(conf).to.equal("Nothing to do!");
                    done();
                }
            });
        });

        /**
         * A file with some data in it
         */
        it("bower.json file with config", function(done) {
            const expected = {
                cInstall: {
                    cwd: path.join(__dirname, "../..", ".testFolder/tempU/under/"),
                    folder: {
                        css: "css/",
                        eot: "fonts/",
                        js: "js/vendor/",
                        otf: "fonts/",
                        svg: "fonts/",
                        ttf: "fonts/",
                        woff: "fonts/"
                    },
                    option: {
                        default: {
                            folder: "public",
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
                    source: {
                        bootstrap: {
                            "bootstrap.css": "dist/css/bootstrap.css",
                            "bootstrap.js": "dist/js/bootstrap.js",
                            "glyphicons-halflings-regular.*": "dist/fonts/*"
                        }
                    }
                },
                dependencies: {
                    bootstrap: "~3.2.0"
                },
                description: "",
                devDependencies: [],
                ignore: [],
                main: "",
                name: "option-test",
                version: ""
            };

            read({cwd: share.fakeBowerPath2}, (err, conf) => {
                if (err) {
                    done(err);
                } else {
                    expect(conf).to.eql(expected);
                    done();
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
