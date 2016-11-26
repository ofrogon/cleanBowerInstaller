"use strict";

var path = require("path");
var exec = require("child_process").exec;
var fileManagement = require("./../../../dist/lib/fileManagement");
var fs = require("fs-extra");

var share = require("../../share");

/**
 * Test /lib/fileManagement.js
 */
describe("fileManagement", function() {
	before(function(done) {
		fs.outputJson(path.join(share.fakeBowerPath, "bower.json"), share.fakeBowerJson, function(err) {
			if (err) {
				done(err);
			} else {
				fs.outputJson(path.join(share.fakeBowerPath2, "bower.json"), share.fakeBowerJson2, function(err) {
					if (err) {
						done(err);
					} else {
						done();
					}
				});
			}
		});
	});

	/**
	 * Test the method "moveFiles" from the module fileManagement.js
	 */
	it("moveFiles", function(done) {
		this.timeout(15000);

		var conf = Object.assign({}, share.fakeBowerJson2, {cwd: path.join(__dirname, "../../..", share.fakeBowerPath2)});

		exec("bower install", {cwd: conf.cwd}, function(error) {
			if (error) {
				done(error);
			} else {
				fileManagement.moveFiles(conf).then(
					function() {
						done();
					},
					function(e) {
						done(e);
					}
				);
			}
		});
	});

	/**
	 * Run the method "moveFilesAndRemove" from the module fileManagement.js
	 */
	it("moveFilesAndRemove", function(done) {
		this.timeout(15000);

		var conf = Object.assign({}, share.fakeBowerJson2, {cwd: path.join(__dirname, "../../..", share.fakeBowerPath2)});

		exec("bower install", {cwd: conf.cwd}, function(error) {
			if (error) {
				done(error);
			} else {
				fileManagement.moveFilesAndRemove(conf).then(
					function() {
						done();
					},
					function(e) {
						done(e);
					}
				);
			}
		});
	});

	// after(function(done) {
	// 	fs.remove(share.testFolder, function(err) {
	// 		done(err);
	// 	});
	// });
});
