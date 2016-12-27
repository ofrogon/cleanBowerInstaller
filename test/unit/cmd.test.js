"use strict";

const chai = require("chai");
const expect = chai.expect;
const path = require("path");
const cmd = require("../../lib/cmd");
const fse = require("fs-extra");

const share = require("../share");

const longTimeOut = 5000;

class Config {
	constructor() {
	    this.cInstall = {
            folder: {},
            option: {
                "default": {
                    "folder": "",
                    "minFolder": ""
                },
                "min": {
                    "get": false,
                    "rename": false,
                    "ignoreExt": []
                },
                "removeAfter": false,
                "verbose": false
            },
            source: {},
            cwd :process.cwd()
        }
	}
}

/**
 * Test /lib/cmd.js
 */
describe("cmd", function() {
	before(function(done) {
		fse.outputJson(path.join(share.fakeBowerPath, "bower.json"), share.fakeBowerJson, (err) => {
			if (err) {
				done(err);
			} else {
				fse.outputJson(path.join(share.fakeBowerPath2, "bower.json"), share.fakeBowerJson2, (err) => {
					done(err);
				});
			}
		});
	});

	/**
	 * Test the method "install" from the module api.js
	 */
	describe("install", function() {
		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("no bower.json file", function(done) {
			let config = new Config();

			cmd.install(config, (err) => {
				if(err) {
					expect(err.code).to.equal("ENOENT");
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
			let config = new Config();

			config.cInstall.cwd = path.join(__dirname, "../../.testFolder/tempU");
			this.timeout(longTimeOut);

			cmd.install(config, (err) => {
				if(err) {
					done(`Suppose to found a bower.json file in: ${config.cwd}`);
				} else {
					done();
				}
			});
		});
	});

	/**
	 * Test the method "update" from the module api.js
	 */
	describe("update", function() {
		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("no bower.json file", function(done) {
			let config = new Config();

			cmd.update(config, (err) => {
				if(err) {
					expect(err.code).to.equal("ENOENT");
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
			let config = new Config();

			config.cInstall.cwd = path.join(__dirname, "../../.testFolder/tempU");
			this.timeout(longTimeOut);

			cmd.update(config, (err) => {
				if(err) {
					done("Suppose to found a bower.json file in .testFolder/tempU folder.");
				} else {
					done();
				}
			});
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
			let config = new Config();

			cmd.run(config, (err) => {
				if(err) {
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
			let config = new Config();

			config.cInstall.cwd = path.join(__dirname, "../../.testFolder/tempU");
			this.timeout(longTimeOut);

			cmd.run(config, (err) => {
				if(err) {
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
			let config = new Config();

			config.cInstall.cwd = path.join(__dirname, "../../.testFolder/tempU");
			config.cInstall.option.min.get = true;
			config.cInstall.option.min.rename = true;
			this.timeout(longTimeOut);

			cmd.run(config, (err) => {
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
			let config = new Config();

			config.cInstall.cwd = path.join(__dirname, "../../.testFolder/tempU");
			config.cInstall.option.removeAfter = true;
			this.timeout(longTimeOut);

			cmd.run(config, (err) => {
				if(err) {
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
