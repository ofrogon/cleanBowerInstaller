"use strict";

var chai = require("chai");
var expect = chai.expect;
var path = require("path");
var config = require("./../../../dist/lib/readConfig").default;
var fs = require("fs-extra");

var share = require("../../share");

/**
 * Test /lib/readConfig.js
 */
describe("readConfig", function() {

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
	 * Test the different type of path to read config
	 */
	describe("path in cwd", function() {
		/**
		 * Test with a relative path
		 */
		it("relative", function(done) {
			config({cwd: share.fakeBowerPath}, function(err, conf) {
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
			config({cwd: path.join(__dirname, "../../..", share.fakeBowerPath)}, function(err, conf) {
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
			config({cwd: share.fakeBowerPath}, function(err, conf) {
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
			var expected = {
				"folder": {
					"js": "js/vendor/",
					"css": "css/",
					"otf, eot, svg, ttf, woff": "fonts/",
					"otf": "fonts/",
					"eot": "fonts/",
					"svg": "fonts/",
					"ttf": "fonts/",
					"woff": "fonts/"
				},
				"option": {
					"default": {"folder": "public", "minFolder": ""},
					"min": {"get": false, "rename": false, "ignoreExt": []},
					"removeAfter": false,
					"verbose": false
				},
				"source": {
					"bootstrap": {
						"glyphicons-halflings-regular.*": "dist/fonts/*",
						"bootstrap.js": "dist/js/bootstrap.js",
						"bootstrap.css": "dist/css/bootstrap.css"
					}
				},
				"cwd": ".testFolder/tempU/under/"
			};

			config({cwd: share.fakeBowerPath2}, function(err, conf) {
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
		fs.remove(share.testFolder, function(err) {
			done(err);
		});
	});
});
