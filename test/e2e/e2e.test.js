"use strict";

const chai = require("chai");
const expect = chai.expect;

const fs = require("fs-extra");
const path = require("path");
const exec = require("child_process").exec;
const crypto = require("crypto");
const bower = require("bower");

const testFolders = require("./e2eData.test");
const cbi = require("../../lib/index");
const cliPath = path.join(__dirname, "../../lib/index");
const cwd = path.join(__dirname, "..", "..", testFolders.folder);

function verifyFileExist(path) {
	try {
		fs.statSync(path);
	} catch (e) {
		console.log(`Unable to found ${path}`);
		return false;
	}

	return true;
}

function e2eTestEnvironmentCreation(testNumber, done) {
	testFolders[testNumber].bowerJson.name = testNumber;
	fs.remove(cwd, (err) => {
		if (err) {
			done(err);
		} else {
			fs.outputJson(path.join(cwd, "bower.json"), testFolders[testNumber].bowerJson, (err) => {
				done(err);
			});
		}
	});
}

describe("Test file without file type folder and verbose function at false", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test0", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}, (err, result) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
					expect(result === undefined).equal(true);

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});

	it("CLI", function (done) {
		this.timeout(10000);

		exec(`node ${cliPath} -i --bower="${cwd}"`, (err, result) => {
			if (err) {
				done(err);
			} else {
				expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
				expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
				expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
				expect(result).to.equal("clean-bower-installer execution successfully done!\n");

				done();
			}
		});
	});
});

describe("Test the verbose function at true", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test1", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}, (err, result) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
					expect(result.length).equal(1);
					expect(result[0].from).match(/.*angular\.js$/);
					expect(result[0].from).match(/.*angular\.js$/);

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});

	it("CLI", function (done) {
		this.timeout(10000);

		exec(`node ${cliPath} -i --bower="${cwd}"`, (err, result) => {
			if (err) {
				done(err);
			} else {
				expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
				expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
				expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
				expect(result).match(/.*clean-bower-installer execution successfully done!\n$/);

				done();
			}
		});
	});
});

describe("Test the update method", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test1", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {save: true}, {cwd: cwd})
			.on("end", () => {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
				} catch (e) {
					done(e);
				}

				testFolders.test0.bowerJson.name = "test0";
				fs.outputJson(path.join(cwd, "bower.json"), testFolders.test0.bowerJson, (err) => {
					if (err) {
						done(err);
					} else {
						cbi.update({cwd: cwd}, (err, result) => {
							if (err) {
								done(err);
							} else {
								bower.commands
									.update([], {save: true}, {cwd: cwd})
									.on("end", (update) => {
										try {
											expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
											expect(Object.keys(update).length).equal(0);
											expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
											expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
											expect(result).match(/.*clean-bower-installer execution successfully done!\n$/);

											done();
										} catch (e) {
											done(e);
										}
									})
									.on("error", (err) => {
										done(err);
									});
							}
						});
					}
				});
			})
			.on("error", (err) => {
				done(err);
			});
	});

	it("CLI", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {save: true}, {cwd: cwd})
			.on("end", () => {
				try {
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
				} catch (e) {
					done(e);
				}

				testFolders.test0.bowerJson.name = "test0";
				exec(`node ${cliPath} -u --bower="${cwd}"`, (err) => {
					if (err) {
						done(err);
					} else {
						bower.commands
							.update([], {save: true}, {cwd: cwd})
							.on("end", (update) => {
								try {
									expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
									expect(Object.keys(update).length).equal(0);
									expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
									expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);

									done();
								} catch (e) {
									done(e);
								}
							})
							.on("error", (err) => {
								done(err);
							});
					}
				});
			})
			.on("error", (err) => {
				done(err);
			});
	});
});

describe("Test the run method", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test1", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", () => {
				cbi.run({cwd: cwd}, (err, result) => {
					if (err) {
						done(err);
					} else {
						try {
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
							expect(result).match(/.*clean-bower-installer execution successfully done!\n$/);

							done();
						} catch (e) {
							done(e);
						}
					}
				});
			})
			.on("error", (err) => {
				done(err);
			});
	});

	it("CLI", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", () => {
				exec(`node ${cliPath} --bower="${cwd}"`, (err) => {
					if (err) {
						done(err);
					} else {
						try {
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
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
			.on("error", (err) => {
				done(err);
			});
	});
});

describe("Test the runMin method", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test1", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", () => {
				cbi.runMin({cwd: cwd}, (err) => {
					if (err) {
						done(err);
					} else {
						try {
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "dest/angular.min.js"))).equal(true);

							let minFileGated = fs.readFileSync(path.join(cwd, "dest/angular.min.js"));
							let minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

							expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

							done();
						} catch (e) {
							done(e);
						}
					}
				});
			})
			.on("error", (err) => {
				done(err);
			});
	});

	it("CLI", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", () => {
				exec(`node ${cliPath} -m --bower="${cwd}"`, (err) => {
					if (err) {
						done(err);
					} else {
						try {
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "dest/angular.min.js"))).equal(true);

							let minFileGated = fs.readFileSync(path.join(cwd, "dest/angular.min.js"));
							let minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

							expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

							done();
						} catch (e) {
							done(e);
						}
					}
				});
			})
			.on("error", (err) => {
				done(err);
			});
	});
});

describe("Test the runMinR method", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test1", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", () => {
				cbi.runMinR({cwd: cwd}, (err) => {
					if (err) {
						done(err);
					} else {
						try {
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);

							let minFileGated = fs.readFileSync(path.join(cwd, "dest/angular.js"));
							let minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

							expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

							done();
						} catch (e) {
							done(e);
						}
					}
				});
			})
			.on("error", (err) => {
				done(err);
			});
	});

	it("CLI", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", () => {
				exec(`node ${cliPath} -M --bower="${cwd}"`, (err) => {
					if (err) {
						done(err);
					} else {
						try {
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);

							let minFileGated = fs.readFileSync(path.join(cwd, "dest/angular.js"));
							let minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

							expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

							done();
						} catch (e) {
							done(e);
						}
					}
				});
			})
			.on("error", (err) => {
				done(err);
			});
	});
});

describe("Test the removeAfter argument", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test2", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}, (err) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(false);
					expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});

	it("CLI", function (done) {
		this.timeout(10000);

		exec(`node ${cliPath} -ir --bower="${cwd}"`, (err) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(false);
					expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});
});

describe("Test the verbose override", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test0", done);
	});

	it("CLI", function (done) {
		this.timeout(10000);

		exec(`node ${cliPath} -iV --bower="${cwd}"`, (err, result) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
					expect(result).match(/.*clean-bower-installer execution successfully done!\n$/);

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});
});

describe("Test the file ignore", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test3", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}, (err) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					// The "option.removeAfter" should have remove the bower_components folder
					expect(verifyFileExist(path.join(cwd, "bower_components/bootstrap"))).equal(false);
					// Test file to be ignore
					expect(verifyFileExist(path.join(cwd, "dest", "fonts/glyphicons-halflings-regular.svg"))).equal(false);
					// Test file that is suppose to be there
					expect(verifyFileExist(path.join(cwd, "dest", "fonts/glyphicons-halflings-regular.eot"))).equal(true);

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});
});

describe("Test without option", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test4", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}, (err) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "/angular.js"))).equal(true);

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});
});

describe("Test the runMin method with default.minFolder", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test6", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", () => {
				cbi.runMin({cwd: cwd}, (err) => {
					if (err) {
						done(err);
					} else {
						try {
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "dest_Min/angular.min.js"))).equal(true);

							let minFileGated = fs.readFileSync(path.join(cwd, "dest_Min/angular.min.js"));
							let minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

							expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

							done();
						} catch (e) {
							done(e);
						}
					}
				});
			})
			.on("error", (err) => {
				done(err);
			});
	});

	it("CLI", function (done) {
		this.timeout(10000);

		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {}, {cwd: cwd})
			.on("end", () => {
				exec(`node ${cliPath} -M --bower="${cwd}"`, (err) => {
					if (err) {
						done(err);
					} else {
						try {
							expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
							expect(verifyFileExist(path.join(cwd, "dest_Min/angular.js"))).equal(true);

							let minFileGated = fs.readFileSync(path.join(cwd, "dest_Min/angular.js"));
							let minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

							expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

							done();
						} catch (e) {
							done(e);
						}
					}
				});
			})
			.on("error", (err) => {
				done(err);
			});
	});
});

describe("Test the option.min.get config", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test6", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}, (err) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "dest_Min/angular.min.js"))).equal(true);

					let minFileGated = fs.readFileSync(path.join(cwd, "dest_Min/angular.min.js"));
					let minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

					expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});
});

describe("Test the option.min.get and config.min.rename config", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test7", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}, (err) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "dest_Min/angular.js"))).equal(true);

					let minFileGated = fs.readFileSync(path.join(cwd, "dest_Min/angular.js"));
					let minFileInBower = fs.readFileSync(path.join(cwd, "bower_components/angular/angular.min.js"));

					expect(crypto.createHash("sha1").update(minFileGated).digest("hex")).equal(crypto.createHash("sha1").update(minFileInBower).digest("hex"));

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});
});

describe("Test file rename, specify folder and ignore file", function () {
	beforeEach(function (done) {
		e2eTestEnvironmentCreation("test8", done);
	});

	it("API", function (done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}, (err) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/bootstrap"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/jquery"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/css/bootstrap.css"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/fonts/glyphicons-halflings-regular.eot"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/fonts/glyphicons-halflings-regular.ttf"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/fonts/glyphicons-halflings-regular.woff"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/js/vendor/banana.js"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/js/vendor/min/bootstrap.min.js"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/thisPathIsGlobal/bootstrap.min.css"))).equal(true);

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});

	it("CLI", function (done) {
		this.timeout(10000);

		exec(`node ${cliPath} -i --bower="${cwd}"`, (err) => {
			if (err) {
				done(err);
			} else {
				try {
					expect(verifyFileExist(path.join(cwd, "bower.json"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/bootstrap"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "bower_components/jquery"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/css/bootstrap.css"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/fonts/glyphicons-halflings-regular.eot"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/fonts/glyphicons-halflings-regular.ttf"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/fonts/glyphicons-halflings-regular.woff"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/js/vendor/banana.js"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/js/vendor/min/bootstrap.min.js"))).equal(true);
					expect(verifyFileExist(path.join(cwd, "public/thisPathIsGlobal/bootstrap.min.css"))).equal(true);

					done();
				} catch (e) {
					done(e);
				}
			}
		});
	});
});

after(function (done) {
	fs.remove(cwd, (err) => {
		if (err) {
			done(err);
		} else {
			done();
		}
	});
});
