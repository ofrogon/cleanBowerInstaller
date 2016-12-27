"use strict";

const chai = require("chai");
const expect = chai.expect;
const path = require("path");
const config = require("./../../lib/readConfig").default;
const fse = require("fs-extra");

const share = require("../share");

/**
 * Test /lib/readConfig.js
 */
describe("readConfig", function() {

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
	 * Test the different type of path to read config
	 */
	describe("path in cwd", function() {
		/**
		 * Test with a relative path
		 */
		it("relative", function(done) {
			config({cwd: share.fakeBowerPath}, (err, conf) => {
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
			config({cwd: path.join(__dirname, "../..", share.fakeBowerPath)}, (err, conf) => {
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
			config({cwd: share.fakeBowerPath}, (err, conf) => {
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
			const expected = {
				"cInstall": {
					"cwd": path.join(__dirname, "../..", ".testFolder/tempU/under/"),
					"folder": {
						"js": "js/vendor/",
						"css": "css/",
						"otf": "fonts/",
						"eot": "fonts/",
						"svg": "fonts/",
						"ttf": "fonts/",
						"woff": "fonts/"
					},
					"option": {
						"default": {
							"folder": "",
							"minFolder": ""
						},
						"min": {
							"get": false,
							"ignoreExt": [],
							"rename": false
						},
						"removeAfter": false,
						"verbose": false
					},
					"source": {
						"bootstrap": {
							"bootstrap.css": "dist/css/bootstrap.css",
							"bootstrap.js": "dist/js/bootstrap.js",
							"glyphicons-halflings-regular.*": "dist/fonts/*"
						}
					}
				},
				"dependencies": {
					"bootstrap": "~3.2.0"
				},
				"description": "",
				"devDependencies": [],
				"ignore": [],
				"main": "",
				"name": "option-test",
				"version": ""
			};

			config({cwd: share.fakeBowerPath2}, (err, conf) => {
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
		fse.remove(share.testFolder, (err) => {
			done(err);
		});
	});
});
