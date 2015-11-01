"use strict";

var chai = require("chai"),
	expect = chai.expect,
	api = require("./../../../lib/api");

/**
 * Test /lib/api.js
 */
describe("api", function () {
	/**
	 * Test the method "automatic" from the module api.js
	 */
	describe("automatic", function () {
		/**
		 * Without Config object as configuration
		 */
		it("wrong options", function (done) {
			api.automatic("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						if (typeof err === "string" || err instanceof String) {
							expect(err).to.contain("No bower.json file found in");
						} else {
							expect(err).to.be.an.instanceof(TypeError);
						}
						done();
					} catch (e) {
						done(e);
					}
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.automatic().then(
				function() {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				},
				function(e) {
					expect(e).to.contain("No bower.json file found in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.automatic({cwd: ".temp/"}).then(
				function() {
					done();
				},
				function(e) {
					done(e);
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
		it("wrong options", function(done) {
			api.install("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						if (typeof err === "string" || err instanceof String) {
							expect(err).to.contain("No bower.json file found in");
						} else {
							expect(err).to.be.an.instanceof(TypeError);
						}
						done();
					} catch (e) {
						done(e);
					}
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.install().then(
				function() {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				},
				function(e) {
					expect(e).to.contain("No bower.json file found in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.install({cwd: ".temp/"}).then(
				function() {
					done();
				},
				function(e) {
					done(e);
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
		it("wrong options", function(done) {
			api.update("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						if (typeof err === "string" || err instanceof String) {
							expect(err).to.contain("No bower.json file found in");
						} else {
							expect(err).to.be.an.instanceof(TypeError);
						}
						done();
					} catch (e) {
						done(e);
					}
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.update().then(
				function() {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				},
				function(e) {
					expect(e).to.contain("No bower.json file found in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.update({cwd: ".temp/"}).then(
				function() {
					done();
				},
				function(e) {
					done(e);
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
		it("wrong options", function(done) {
			api.run("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						if (typeof err === "string" || err instanceof String) {
							expect(err).to.contain("No bower.json file found in");
						} else {
							expect(err).to.be.an.instanceof(TypeError);
						}
						done();
					} catch (e) {
						done(e);
					}
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.run().then(
				function() {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				},
				function(e) {
					expect(e).to.contain("No bower.json file found in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.run({cwd: ".temp/"}).then(
				function() {
					done();
				},
				function(e) {
					done(e);
				}
			);
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
			api.runMin("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						expect(err).to.be.an.instanceof(TypeError);
						done();
					} catch (e) {
						done(e);
					}
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.runMin().then(
				function() {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				},
				function(e) {
					expect(e).to.contain("No bower.json file found in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.runMin({cwd: ".temp/"}).then(
				function() {
					done();
				},
				function(e) {
					done(e);
				}
			);
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
			api.runMinR("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						expect(err).to.be.an.instanceof(TypeError);
						done();
					} catch (e) {
						done(e);
					}
				}
			);
		});

		/**
		 * Test default option (without bower.json file in the current folder)
		 */
		it("empty options", function(done) {
			api.runMinR().then(
				function() {
					done("This test is not suppose to pass, remove any bower.json file contained in the folder " + __dirname);
				},
				function(e) {
					expect(e).to.contain("No bower.json file found in");
					done();
				}
			);
		});

		/**
		 * With a bower.json file
		 */
		it("good options", function(done) {
			api.runMinR({cwd: ".temp/"}).then(
				function() {
					done();
				},
				function(e) {
					done(e);
				}
			);
		});
	});
});
