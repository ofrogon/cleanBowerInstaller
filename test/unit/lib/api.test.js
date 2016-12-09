"use strict";

const chai = require("chai");
const expect = chai.expect;
const api = require("../../../dist/lib/api");
const path = require("path");
const fs = require("fs-extra");

const share = require("../../share");

/**
 * Test /lib/api.js
 */
describe("api", function() {
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
		it("wrong options", function(done) {
			api.install("this is a wrong option", (err) => {
				if(!err) {
					done("String pass as a accepted option but we want an object.");
				} else {
					try {
						expect(err instanceof Error).to.equal(true);
						done();
					} catch (e) {
						done(e);
					}
				}
			});
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.install(null, (err) => {
				if(err) {
					expect(err.code).to.equal("ENOENT");
					done();
				} else {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				}
			});
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.install({cwd: ".testFolder/tempU/"}, (err) => {
				done(err);
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
		it("wrong options", function(done) {
			api.update("this is a wrong option", (err) => {
				if(err) {
					expect(err instanceof Error).to.equal(true);
					done();
				} else {
					done("String pass as a accepted option but we want an object.");
				}
			});
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.update(null, (err) => {
				if(err) {
					expect(err.code).to.equal("ENOENT");
					done();
				} else {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				}
			});
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.update({cwd: ".testFolder/tempU/"}, (err) => {
				done(err);
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
		it("wrong options", function(done) {
			api.run("this is a wrong option", (err) => {
				if(err) {
					expect(err instanceof Error).to.equal(true);
					done();
				} else {
					done("String pass as a accepted option but we want an object.");
				}
			});
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.run(null, (err) => {
				if(err) {
					expect(err.code).to.equal("ENOENT");
					done();
				} else {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				}
			});
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.run({cwd: ".testFolder/tempU/"}, (err) => {
				done(err);
			});
		});
	});

	/**
	 * Test the method "runMin" from the module api.js
	 */
	describe("runMin", function() {
		/**
		 * Without Config object as configuration
		 */
		it("wrong options", function(done) {
			api.runMin("this is a wrong option", (err) => {
				if(err) {
					expect(err instanceof Error).to.equal(true);
					done();
				} else {
					done("String pass as a accepted option but we want an object.");
				}
			});
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.runMin(null, (err) => {
				if(err) {
					expect(err.code).to.equal("ENOENT");
					done();
				} else {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				}
			});
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.runMin({cwd: ".testFolder/tempU/"}, (err) => {
				done(err);
			});
		});
	});

	/**
	 * Test the method "runMinR" from the module api.js
	 */
	describe("runMinR", function() {
		/**
		 * Without Config object as configuration
		 */
		it("wrong options", function(done) {
			api.runMinR("this is a wrong option", (err) => {
				if(err) {
					expect(err instanceof Error).to.equal(true);
					done();
				} else {
					done("String pass as a accepted option but we want an object.");
				}
			});
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.runMinR(null, (err) => {
				if(err) {
					expect(err.code).to.equal("ENOENT");
					done();
				} else {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				}
			});
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.runMinR({cwd: ".testFolder/tempU/"}, (err) => {
				done(err);
			});
		});
	});

	after(function(done) {
		fs.remove(share.testFolder, (err) => {
			done(err);
		});
	});
});
