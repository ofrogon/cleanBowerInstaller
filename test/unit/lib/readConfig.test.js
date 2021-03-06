"use strict";

var chai = require("chai"),
	expect = chai.expect,
	describe = require("mocha/lib/mocha.js").describe,
	it = require("mocha/lib/mocha.js").it,
	path = require("path"),
	config = require("./../../../lib/readConfig");

/**
 * Test /lib/readConfig.js
 */
describe("readConfig", function() {

	/**
	 * Test the different type of path to read config
	 */
	describe("path in cwd", function() {
		/**
		 * Test with a relative path
		 */
		it("relative", function(done) {
			config.read({cwd: ".testFolder/tempU/"}).then(
				function(conf) {
					expect(conf).to.equal("Nothing to do!");
					done();
				},
				function(e) {
					done(e);
				}
			);
		});

		/**
		 * Teat with a absolute path
		 */
		it("absolute", function(done) {
			config.read({cwd: path.join(__dirname, "../../..", ".testFolder/tempU")}).then(
				function(conf) {
					expect(conf).to.equal("Nothing to do!");
					done();
				},
				function(e) {
					done(e);
				}
			);
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
			config.read({cwd: ".testFolder/tempU/"}).then(
				function(conf) {
					expect(conf).to.equal("Nothing to do!");
					done();
				},
				function(e) {
					done(e);
				}
			);
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

			config.read({cwd: ".testFolder/tempU/under/"}).then(
				function(conf) {
					try {
						expect(conf).to.eql(expected);
						done();
					} catch (e) {
						done(e);
					}
				},
				function(e) {
					done(e);
				}
			);
		});
	});
});
