"use strict";

var chai = require("chai"),
	expect = chai.expect,
	cmd = require("./../../../lib/cmd");

var longTimeOut = 5000;

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

	describe("automatic", function() {
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

		it("minimal config", function(done) {
			var config = new Config();

			config.cwd = ".temp";
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
	describe("install", function() {
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

		it("minimal config", function(done) {
			var config = new Config();

			config.cwd = ".temp";
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
	describe("update", function() {
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

		it("minimal config", function(done) {
			var config = new Config();

			config.cwd = ".temp";
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
	describe("run", function() {
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

		it("minimal config", function(done) {
			var config = new Config();

			config.cwd = ".temp";
			this.timeout(longTimeOut);

			cmd.run(config).then(
				function() {
					done();
				}, function() {
					done("Suppose to found a bower.json file in .temp folder.");
				}
			);
		});

		it("rename", function(done) {
			var config = new Config();

			config.cwd = ".temp";
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

		it("removeAfter", function(done) {
			var config = new Config();

			config.cwd = ".temp";
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
						console.log(e);
					}
				}
			);
		});
	});
});
