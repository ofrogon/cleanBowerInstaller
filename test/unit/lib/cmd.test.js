"use strict";

const chai = require("chai");
const expect = chai.expect;
const path = require("path");
const cmd = require("../../../dist/lib/cmd");
const fs = require("fs-extra");

const share = require("../../share");

const longTimeOut = 5000;

class Config {
	constructor() {
		this.folder = {};
		this.option = {
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
		};
		this.source = {};
		this.cwd = process.cwd();
	}
}

/**
 * Test /lib/cmd.js
 */
describe("cmd", function() {
	before(function(done) {
		fs.outputJson(path.join(share.fakeBowerPath, "bower.json"), share.fakeBowerJson, (err) => {
			if (err) {
				done(err);
			} else {
				fs.outputJson(path.join(share.fakeBowerPath2, "bower.json"), share.fakeBowerJson2, (err) => {
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
		 * Without Config object as configuration
		 */
		it("wrong input", function(done) {
			cmd.install("this is a wrong input", (err) => {
				if(err) {
					expect(err).to.equal("The command module do not receive any configuration.");
					done();
				} else {
					done("The script is not suppose to run with a bad config format.");
				}
			});
		});

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

			config.cwd = path.join(__dirname, "../../../.testFolder/tempU");
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
		 * Without Config object as configuration
		 */
		it("wrong input", function(done) {
			cmd.update("this is a wrong input", (err) => {
				if(err) {
					expect(err).to.equal("The command module do not receive any configuration.");
					done();
				} else {
					done("The script is not suppose to run with a bad config format.");
				}
			});
		});

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

			config.cwd = path.join(__dirname, "../../../.testFolder/tempU");
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
		 * Without Config object as configuration
		 */
		it("wrong input", function(done) {
			cmd.run("this is a wrong input", (err) => {
				if(err) {
					expect(err).to.equal("The command module do not receive any configuration.");
					done();
				} else {
					done("The script is not suppose to run with a bad config format.");
				}
			});
		});

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

			config.cwd = path.join(__dirname, "../../../.testFolder/tempU");
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

			config.cwd = path.join(__dirname, "../../../.testFolder/tempU");
			config.option.min.get = true;
			config.option.min.rename = true;
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

			config.cwd = path.join(__dirname, "../../../.testFolder/tempU");
			config.option.removeAfter = true;
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
		fs.remove(share.testFolder, (err) => {
			done(err);
		});
	});
});
