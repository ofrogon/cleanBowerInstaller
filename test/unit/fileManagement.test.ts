"use strict";

import {expect} from "chai";
import {exec} from "child_process";
import * as  fse from "fs-extra";
import * as path from "path";
import {BowerConfiguration} from "../../src/bowerConfig/BowerConfiguration";
import {moveFiles, moveFilesAndRemove} from "../../src/fileManagement";
import * as share from "../share";

/**
 * Test /lib/fileManagement.js
 */
describe("fileManagement", function() {
    const cwd = path.join(__dirname, "../..", share.fakeBowerPath2);

    beforeEach(function(done) {
        fse.outputJson(path.join(share.fakeBowerPath2, "bower.json"), share.fakeBowerJson2, (err) => {
            done(err);
        });
    });

    /**
     * Test the method "moveFiles" from the module fileManagement.js
     */
    it("moveFiles", function(done) {
        this.timeout(15000);

        const conf = new BowerConfiguration(share.fakeBowerJson2);

        conf.cInstall.cwd = cwd;

        exec("bower install", {cwd}, (error) => {
            if (error) {
                done(error);
            } else {
                moveFiles(conf.cInstall, (err, msg) => {
                    expect(msg).to.be.null;
                    done(err);
                });
            }
        });
    });

    /**
     * Run the method "moveFilesAndRemove" from the module fileManagement.js
     */
    it("moveFilesAndRemove", function(done) {
        this.timeout(15000);

        const conf = new BowerConfiguration(share.fakeBowerJson2);

        conf.cInstall.cwd = cwd;

        exec("bower install", {cwd}, (error) => {
            if (error) {
                done(error);
            } else {
                moveFilesAndRemove(conf.cInstall, (err, msg) => {
                    expect(msg).to.be.null;
                    done(err);
                });
            }
        });
    });

    afterEach(function(done) {
        fse.remove(share.testFolder, (err) => {
            done(err);
        });
    });
});
