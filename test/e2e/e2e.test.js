var chai = require("chai"),
	expect = chai.expect,
	describe = require("mocha/lib/mocha.js").describe,
	it = require("mocha/lib/mocha.js").it,
	beforeEach = require("mocha/lib/mocha.js").beforeEach,
	fs = require("fs-extra"),
	path = require("path"),
	assert = require('assert'),
	testFolders = require("./e2eData.test"),
	exec = require("child_process").exec,
	crypto = require("crypto"),
	bower = require("bower");

var cbi = require("../../.");

function verifyFileExist(path) {
	try {
		fs.statSync(path);
	} catch (e) {
		return false;
	}

	return true;
}

function verifyFileContent(path, content) {
	if (verifyFileExist(path)) {
		return fs.readFileSync(file, {encoding: "UTF8"}) === content;
	} else {
		return false;
	}
}

function verifyFileContentJSON(path, content) {
	if (verifyFileExist(path)) {
		return assert.deepEqual(JSON.parse(fs.readFileSync(file, {encoding: "UTF8"})), content);
	} else {
		return false;
	}
}

function e2eTestEnvironmentCreation(testNumber, done) {
	testFolders[testNumber].bowerJson.name = testNumber;
	fs.remove(cwd, function(err) {
		if (err) {
			done(err);
		} else {
			fs.ensureDir(cwd, function(err) {
				if (err) {
					done(err);
				} else {
					fs.writeFile(path.join(cwd, "bower.json"), JSON.stringify(testFolders[testNumber].bowerJson), function(err) {
						done(err);
					});
				}
			});
		}
	});
}

var cwd = path.join(__dirname, "..", "..", testFolders.folder);

describe("Test file without file type folder and verbose function at false", function() {
	beforeEach(function(done) {
		e2eTestEnvironmentCreation("test0", done);
	});

	// TODO old test #00 and #02
	it("API", function(done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}).then(
			function(result) {
				try {
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
					expect(result).to.be.undefined;
					done();
				} catch (e) {
					done(e);
				}
			},
			function(err) {
				done(err);
			}
		);
	});

	// TODO old test #07 and #09
	it("CLI", function(done) {
		this.timeout(10000);

		exec("node ../../bin/clean-bower-installer -i --bower=\"../../.testFolder/tmp\"", function(err, result) {
			if (err) {
				done(err);
			} else {
				expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
				expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
				expect(result).to.equal("clean-bower-installer execution successfully done!\n");
				done();
			}
		});
	});
});

describe("Test the verbose function at true", function() {
	beforeEach(function(done) {
		e2eTestEnvironmentCreation("test1", done);
	});

	// TODO old test #01
	it("API", function(done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}).then(
			function(result) {
				try {
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
					expect(result.length).equal(1);
					expect(result[0].from).match(/.*angular\.js$/);
					expect(result[0].from).match(/.*angular\.js$/);
					done();
				} catch (e) {
					done(e);
				}
			},
			function(err) {
				done(err);
			}
		);
	});

	// TODO old test #08
	it("CLI", function(done) {
		this.timeout(10000);

		exec("node ../../bin/clean-bower-installer -i --bower=\"../../.testFolder/tmp\"", function(err, result) {
			if (err) {
				done(err);
			} else {
				expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
				expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
				expect(result).match(/.*clean-bower-installer execution successfully done!\n$/);
				done();
			}
		});
	});
});

describe("Test the update method", function() {
	beforeEach(function(done) {
		e2eTestEnvironmentCreation("test1", done);
	});

	// TODO old test #03
	it("API", function(done) {
		this.timeout(30000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {save: true}, {cwd: cwd})
			.on("end", function() {
				try {
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
				} catch (e) {
					done(e);
				}

				testFolders.test0.bowerJson.name = "test0";
				fs.writeFile(path.join(cwd, "bower.json"), JSON.stringify(testFolders.test0.bowerJson), function(err) {
					if (err) {
						done(err);
					} else {
						cbi.update({cwd: cwd}).then(
							function() {
								bower.commands
									.update([], {save: true}, {cwd: cwd})
									.on("end", function(update) {
										try {
											expect(Object.keys(update).length).equal(0);
											expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
											expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
											done();
										} catch (e) {
											done(e);
										}
									});
							},
							function(err) {
								done(err);
							}
						);
					}
				});
			})
			.on("error", function(err) {
				done(err);
			});
	});

	// TODO old test #10
	it("CLI", function(done) {
		this.timeout(30000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {save: true}, {cwd: cwd})
			.on("end", function() {
				try {
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
				} catch (e) {
					done(e);
				}

				testFolders.test0.bowerJson.name = "test0";
				exec("node ../../bin/clean-bower-installer -u --bower=\"" + cwd + "\"", function(err) {
					if (err) {
						done(err);
					} else {
						bower.commands
							.update([], {save: true}, {cwd: cwd})
							.on("end", function(update) {
								try {
									expect(Object.keys(update).length).equal(0);
									expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
									expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
									done();
								} catch (e) {
									done(e);
								}
							});
					}
				});
			});
	});
});

describe("Test the run method", function() {
	beforeEach(function(done) {
		e2eTestEnvironmentCreation("test1", done);
	});

	// TODO old test 4
	it("API", function(done) {
		this.timeout(30000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", function() {
					cbi.run({cwd: cwd}).then(
						function() {
							try {
								expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
								expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
								expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
								done();
							} catch (e) {
								done(e);
							}
						},
						function(err) {
							done(err);
						}
					);
				}
			).on("error", function(err) {
			done(err);
		});
	});

	// TODO old test 11 verify this test
	it("CLI", function(done) {
		this.timeout(30000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", function() {
				exec("node ../../bin/clean-bower-installer --bower=\"" + cwd + "\"", function(err) {
					if (err) {
						done(err);
					} else {
						try {
							expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
							done();
						} catch (e) {
							done(e);
						}
					}
				});
			})
			.on("error", function(err) {
				done(err);
			});
	});
});

describe("Test the runMin method", function() {
	beforeEach(function(done) {
		e2eTestEnvironmentCreation("test1", done);
	});

	// TODO old test 5
	it("API", function(done) {
		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", function() {
					cbi.runMin({cwd: cwd}).then(
						function() {
							try {
								expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
								expect(verifyFileExist(path.join(cwd, "dest/angular.min.js"))).equal(true);

								var minFileGated = fs.readFileSync(path.join(cwd, "dest/angular.min.js")),
									minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

								expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

								done();
							} catch (e) {
								done(e);
							}
						},
						function(err) {
							done(err);
						}
					);
				}
			);
	});

	// TODO old test 12
	it("CLI", function(done) {
		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", function() {
					exec("node ../../bin/clean-bower-installer -m --bower=\"" + cwd + "\"", function(err) {
						if (err) {
							done(err);
						} else {
							try {
								expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
								expect(verifyFileExist(path.join(cwd, "dest/angular.min.js"))).equal(true);

								var minFileGated = fs.readFileSync(path.join(cwd, "dest/angular.min.js")),
									minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

								expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

								done();
							} catch (e) {
								done(e);
							}
						}
					});
				}
			);
	});
});

// describe("Test the runMinR method", function() {
// 	beforeEach(function(done) {
// 		e2eTestEnvironmentCreation("test1", done);
// 	});
// 	it("API", function() {
//
// 	});
//
// 	it("CLI", function() {
//
// 	});
// });

//describe("Test the removeAfter argument", function() {
//	it("API", function() {
//
//	});
//
//	it("CLI", function() {
//
//	});
//});
//
//describe("Test the verbose override", function() {
//	//it("", function(){
//	//
//	//});
//
//	it("CLI", function() {
//
//	});
//});
//
//describe("Test the file ignore", function() {
//	it("API", function() {
//
//	});
//
//	//it("", function(){
//	//
//	//});
//});
//
//describe("Test without option", function() {
//	it("API", function() {
//
//	});
//
//	//it("", function(){
//	//
//	//});
//});
//
//describe("Test the runMin method with default.minFolder", function() {
//	it("API", function() {
//
//	});
//
//	//it("", function(){
//	//
//	//});
//});
//
//describe("Test the runMinR method", function() {
//	//it("", function(){
//	//
//	//});
//
//	it("CLI", function() {
//
//	});
//});
//
//describe("Test the runMin method with default.minFolder", function() {
//	it("API", function() {
//
//	});
//
//	//it("", function(){
//	//
//	//});
//});
//
////describe("", function() {
////	it("", function(){
////
////	});
////
////	it("", function(){
////
////	});
////});
