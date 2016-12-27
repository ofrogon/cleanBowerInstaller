"use strict";

const chai = require("chai");
const expect = chai.expect;

const path = require("path");
const exec = require("child_process").exec;
const fileManagement = require("./../../lib/fileManagement");
const fse = require("fs-extra");

const share = require("../share");
const BC = require("../../lib/BowerConfiguration").BowerConfiguration;

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

		const conf = new BC(share.fakeBowerJson2);

		conf.cInstall.cwd = cwd;

		exec("bower install", {cwd: cwd}, (error) => {
			if (error) {
				done(error);
			} else {
				fileManagement.moveFiles(conf.cInstall, (err, msg) => {
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

		const conf = new BC(share.fakeBowerJson2);

		conf.cInstall.cwd = cwd;

		exec("bower install", {cwd: cwd}, (error) => {
			if (error) {
				done(error);
			} else {
				fileManagement.moveFilesAndRemove(conf.cInstall, (err, msg) => {
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
