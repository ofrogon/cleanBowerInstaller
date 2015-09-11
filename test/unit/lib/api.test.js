"use strict";

var chai = require("chai"),
	path = require("path"),
	expect = chai.expect,
	api = require("./../../../lib/api");

describe("api", function () {
	describe("automatic", function () {
		it("wrong options", function (done) {
			api.automatic("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						expect(err).to.be.an.instanceof(TypeError);
					} catch (e) {
						done(e);
					}
					done();
				}
			);
		});

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

	describe("install", function() {
		it("wrong options", function(done) {
			api.install("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						expect(err).to.be.an.instanceof(TypeError);
					} catch (e) {
						done(e);
					}
					done();
				}
			);
		});

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

	describe("update", function() {
		it("wrong options", function(done) {
			api.update("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						expect(err).to.be.an.instanceof(TypeError);
					} catch (e) {
						done(e);
					}
					done();
				}
			);
		});

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

	describe("run", function() {
		it("wrong options", function(done) {
			api.run("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						expect(err).to.be.an.instanceof(TypeError);
					} catch (e) {
						done(e);
					}
					done();
				}
			);
		});

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

	describe("runMin", function() {
		it("wrong options", function(done) {
			api.runMin("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						expect(err).to.be.an.instanceof(TypeError);
					} catch (e) {
						done(e);
					}
					done();
				}
			);
		});

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

	describe("runMinR", function() {
		it("wrong options", function(done) {
			api.runMinR("this is a wrong option").then(
				function () {
					done("String pass as a accepted option but we want an object.");
				},
				function (err) {
					try {
						expect(err).to.be.an.instanceof(TypeError);
					} catch (e) {
						done(e);
					}
					done();
				}
			);
		});

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

	describe("path in cwd", function() {
		it("relative", function(done) {
			api.automatic({cwd: ".temp/"}).then(
				function() {
					done();
				},
				function(e) {
					done(e);
				}
			);
		});

		it("absolute", function(done) {
			api.automatic({cwd: path.join(__dirname, "../../..", ".temp/")}).then(
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
