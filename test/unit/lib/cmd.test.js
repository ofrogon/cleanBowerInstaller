"use strict";

var chai = require("chai"),
	expect = chai.expect,
	path = require("path"),
	cmd = require("./../../../lib/cmd");

var longTimeOut = 5000;

/**
 * Test /lib/cmd.js
 */
describe("cmd", function() {
	function Config() {
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

	/**
	 * Test the method "automatic" from the module cmd.js
	 */
	describe("automatic", function() {
		/**
		 * Without Config object as configuration
		 */
		it("wrong input", function(done) {
			cmd.automatic("this is a wrong input").then(
				function() {
					done("The script is not suppose to run with a bad config format.");
				}, function(e) {
					expect(e).to.equal("The command module do not receive any configuration.");
					done();
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("no bower.json file", function(done) {
			var config = new Config();

			cmd.automatic(config).then(
				function() {
					done("The script is not suppose to run with no bower.json file.");
				}, function(e) {
					expect(e).to.contain("There is no bower.json file in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("minimal config", function(done) {
			var config = new Config();

			config.cwd = path.join(__dirname, "../../../.temp");
			this.timeout(longTimeOut);

			cmd.automatic(config).then(
				function() {
					done();
				}, function() {
					done("Suppose to found a bower.json file in .temp folder.");
				}
			);
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
			cmd.install("this is a wrong input").then(
				function() {
					done("The script is not suppose to run with a bad config format.");
				}, function(e) {
					expect(e).to.equal("The command module do not receive any configuration.");
					done();
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("no bower.json file", function(done) {
			var config = new Config();

			cmd.install(config).then(
				function() {
					done("The script is not suppose to run with no bower.json file.");
				}, function(e) {
					expect(e).to.contain("There is no bower.json file in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("minimal config", function(done) {
			var config = new Config();

			config.cwd = path.join(__dirname, "../../../.temp");
			this.timeout(longTimeOut);

			cmd.install(config).then(
				function() {
					done();
				}, function() {
					done("Suppose to found a bower.json file in .temp folder.");
				}
			);
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
			cmd.update("this is a wrong input").then(
				function() {
					done("The script is not suppose to run with a bad config format.");
				}, function(e) {
					expect(e).to.equal("The command module do not receive any configuration.");
					done();
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("no bower.json file", function(done) {
			var config = new Config();

			cmd.update(config).then(
				function() {
					done("The script is not suppose to run with no bower.json file.");
				}, function(e) {
					expect(e).to.contain("There is no bower.json file in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("minimal config", function(done) {
			var config = new Config();

			config.cwd = path.join(__dirname, "../../../.temp");
			this.timeout(longTimeOut);

			cmd.update(config).then(
				function() {
					done();
				}, function() {
					done("Suppose to found a bower.json file in .temp folder.");
				}
			);
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
			cmd.run("this is a wrong input").then(
				function() {
					done("The script is not suppose to run with a bad config format.");
				}, function(e) {
					expect(e).to.equal("The command module do not receive any configuration.");
					done();
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("no bower.json file", function(done) {
			var config = new Config();

			cmd.run(config).then(
				function() {
					done("The script is not suppose to run with no bower.json file.");
				}, function(e) {
					expect(e).to.contain("There is no bower.json file in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("minimal config", function(done) {
			var config = new Config();

			config.cwd = path.join(__dirname, "../../../.temp");
			this.timeout(longTimeOut);

			cmd.run(config).then(
				function() {
					done();
				}, function() {
					done("Suppose to found a bower.json file in .temp folder.");
				}
			);
		});

		/**
		 * With a bower.json file and the option to get minimised file and rename then
		 */
		it("rename", function(done) {
			var config = new Config();

			config.cwd = path.join(__dirname, "../../../.temp");
			config.option.min.get = true;
			config.option.min.rename = true;
			this.timeout(longTimeOut);

			cmd.run(config).then(
				function() {
					done();
				}, function() {
					done("Suppose to found a bower.json file in .temp folder.");
				}
			);
		});

		/**
		 * With a bower.json file and the option delete the bower_component file after
		 */
		it("removeAfter", function(done) {
			var config = new Config();

			config.cwd = path.join(__dirname, "../../../.temp");
			config.option.removeAfter = true;
			this.timeout(longTimeOut);

			cmd.run(config).then(
				function() {
					done("This is not suppose to pass because it missing bower dependence in the bower.json file.");
				}, function(e) {
					try {
						expect(e.code).to.equal("ENOENT");

						done();
					} catch (e) {
						done(e);
					}
				}
			);
		});
	});
});
