"use strict";

var describe = require("mocha/lib/mocha.js").describe,
	it = require("mocha/lib/mocha.js").it,
	path = require("path"),
	exec = require("child_process").exec,
	config = require("./../../../lib/readConfig"),
	fileManagement = require("./../../../lib/fileManagement");

/**
 * Test /lib/fileManagement.js
 */
describe("fileManagement", function() {
	/**
	 * Test the method "moveFiles" from the module fileManagement.js
	 */
	it("moveFiles", function(done) {
		this.timeout(15000);

		config.read({cwd: path.join(__dirname, "../../../.temp/under")}).then(
			function(conf) {
				exec("bower install", {cwd: conf.cwd}, function(error) {
					if (error) {
						done(error);
					} else {
						fileManagement.moveFiles(conf).then(
							function() {
								done();
							}, function(e) {
								done(e);
							}
						);
					}
				});
			},
			function(e) {
				done(e);
			}
		);
	});

	/**
	 * Run the method "moveFilesAndRemove" from the module fileManagement.js
	 */
	it("moveFilesAndRemove", function(done) {
		this.timeout(15000);

		config.read({cwd: path.join(__dirname, "../../../.temp/under")}).then(
			function(conf) {
				exec("bower install", {cwd: conf.cwd}, function(error) {
					if (error) {
						done(error);
					} else {
						fileManagement.moveFilesAdnRemove(conf).then(
							function() {
								done();
							}, function(e) {
								done(e);
							}
						);
					}
				});
			},
			function(e) {
				done(e);
			}
		);
	});
});
