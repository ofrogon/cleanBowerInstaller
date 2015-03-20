"use strict";

var cbi = require("../bin/clean-bower-installer"),
	path = require("path"),
	fs = require("../node_modules/fs-extra"),
	colors = require("../node_modules/colors/safe"),
	bower = require("../node_modules/bower"),
	exec = require("child_process").exec;

var errors = [],
	errorCount = 0,
	currentTest = -1;

var defaultBowerFile = "{\n" +
	"\t\"name\": \"test1\",\n" +
	"\t\"dependencies\": {\n" +
	"\t\t\"angular\": \"~1.3.0\"\n" +
	"\t},\n" +
	"\t\"cInstall\": {\n" +
	"\t\t\"option\": {\n" +
	"\t\t\t\"default\": {\n" +
	"\t\t\t\t\"folder\": \"../temp\"\n" +
	"\t\t\t},\n" +
	"\t\t\t\"verbose\": false\n" +
	"\t\t},\n" +
	"\t\t\"folder\": {},\n" +
	"\t\t\"source\": {\n" +
	"\t\t\t\"angular\": {\n" +
	"\t\t\t\t\"angular.js\": \"angular.js\"\n" +
	"\t\t\t}\n" +
	"\t\t}\n" +
	"\t}\n" +
	"}";

/**
 * Print on the console the test output (success or error(s))
 *
 * @param name {string}
 */
function testDisplay(name) {
	errorCount += errors.length;

	if (errors.length > 0) {
		console.log(colors.yellow("The " + name + " have fail due to the next error(s):"));

		for (var i = 0; i < errors.length; i++) {
			console.log(colors.yellow("\t" + errors[i]));
		}
	} else {
		console.log(colors.cyan("The execution of " + name + " pass without error."));
	}

	errors = [];
}

/**
 * Array holding all the test to be executed
 */
var test = [
	/*API tests ----------------------------------------------------------------------*/
	/**
	 * Test file without file type folder (API)
	 * #00
	 */
		function() {
		cbi.install({cwd: "test0"}).then(
			function() {
				if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test0/bower_components"));
				} else {
					errors.push("Test" + currentTest + " error: No \"bower_components\" folder found in " + path.join(__dirname, "test0/bower_components") + ".");
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				} else {
					errors.push("Test" + currentTest + " error: The file " + path.join(__dirname, "temp/") + " have not been created.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			},
			function(err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		);
	},
	/**
	 * Test the verbose function at true (API)
	 * #01
	 */
		function() {
		cbi.install({cwd: "test1"}).then(
			function(result) {
				if (fs.existsSync(path.join(__dirname, "test1/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test1/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				}

				if (result === "clean-bower-installer execution successfully done!") {
					errors.push("Test" + currentTest + " error: No verbose answer were receive but we are waiting for one.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			},
			function(err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		);
	},
	/**
	 * Test the verbose function at false (API)
	 * #02
	 */
		function() {
		cbi.install({cwd: "test0"}).then(
			function(result) {
				if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test0/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				}

				if (result !== "clean-bower-installer execution successfully done!") {
					errors.push("Test" + currentTest + " error: A verbose answer have been receive when we don't want one.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			},
			function(err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		);
	},
	/**
	 * Test the update method (API)
	 * #03
	 */
		function() {
		// 1 Install an old library version
		// In case of a bug, you may have to change the version here for the one just before the latest
		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {save: true}, {cwd: "test0"})
			.on("end", function() {

				// 2 remove the bower folder
				if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test0/bower_components"));
				}

				// 3 restore the bower file
				if (fs.existsSync(path.join(__dirname, "test0/bower.json"))) {
					fs.removeSync(path.join(__dirname, "test0/bower.json"));
					fs.writeFileSync(path.join(__dirname, "test0/bower.json"), defaultBowerFile);
				}

				// 4 run cbi update
				cbi.install({cwd: "test0"}).then(
					function() {
						// 5 run bower update
						bower.commands
							.update([], {save: true}, {cwd: "test0"})
							.on("end", function(update) {

								// 6 if no result the lib is at the last version, so it work
								if (Object.keys(update).length !== 0) {
									errors.push("Test" + currentTest + " error: The Angular lib have been updated as if it have been updated before using cbi.update().");
								}

								if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
									fs.removeSync(path.join(__dirname, "test0/bower_components"));
								}

								if (fs.existsSync(path.join(__dirname, "temp"))) {
									fs.removeSync(path.join(__dirname, "temp"));
								}

								testDisplay("Test" + currentTest);
								runNextTest();
							});
					},
					function(err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					}
				);
			});
	},
	/**
	 * Test the run method (API)
	 * #04
	 */
		function() {
		bower.commands
			.install(["angular"], {}, {cwd: "test0"})
			.on("end", function() {
				cbi.run("test0").then(
					function() {
						if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test0/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "temp/angular.js"))) {
							fs.removeSync(path.join(__dirname, "temp"));
						} else {
							errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command run().");
						}

						testDisplay("Test" + currentTest);
						runNextTest();
					},
					function(err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					}
				);
			}
		);
	},
	/**
	 * Test the runMin method (API)
	 * #05
	 */
		function() {
		bower.commands
			.install(["angular"], {}, {cwd: "test0"})
			.on("end", function() {
				cbi.runMin("test0").then(
					function() {
						if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test0/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "temp/angular.min.js"))) {
							// Verify that the file is the minimised one using his number of line
							var i;
							var count = 0;
							fs.createReadStream(path.join(__dirname, "temp/angular.min.js"), {start: 0, end: 99})
								.on("data", function(chunk) {
									for (i = 0; i < chunk.length; ++i) {
										if (chunk[i] === 10) {
											count++;
										}
									}
								})
								.on("end", function() {
									if (count > 10) {
										errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command runMin().");
									}

									fs.removeSync(path.join(__dirname, "temp"));

									testDisplay("Test" + currentTest);
									runNextTest();
								});
						} else {
							errors.push("Test" + currentTest + " error: The angular.min.js file was not copy by the command runMin().");

							testDisplay("Test" + currentTest);
							runNextTest();
						}
					},
					function(err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					}
				);
			}
		);
	},
	/**
	 * Test the runMinR method (API)
	 * #06
	 */
		function() {
		bower.commands
			.install(["angular"], {}, {cwd: "test0"})
			.on("end", function() {
				cbi.runMinR("test0").then(
					function() {
						if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test0/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "temp/angular.js"))) {
							// Verify that the file is the minimised one using his number of line
							var i;
							var count = 0;
							fs.createReadStream(path.join(__dirname, "temp/angular.js"), {start: 0, end: 99})
								.on("data", function(chunk) {
									for (i = 0; i < chunk.length; ++i) {
										if (chunk[i] === 10) {
											count++;
										}
									}
								})
								.on("end", function() {
									if (count > 10) {
										errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command runMinR().");
									}

									fs.removeSync(path.join(__dirname, "temp"));

									testDisplay("Test" + currentTest);
									runNextTest();
								});

						} else {
							errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command runMinR().");

							testDisplay("Test" + currentTest);
							runNextTest();
						}
					},
					function(err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					}
				);
			}
		);
	},

	/*CLI tests ----------------------------------------------------------------------*/
	/**
	 * Test file without file type folder (CLI)
	 * #07
	 */
		function() {
		exec("node ../bin/clean-bower-installer -i --bower=\"../test/test0\"", function(err) {
			if (err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			} else {
				if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test0/bower_components"));
				} else {
					errors.push("Test" + currentTest + " error: No \"bower_components\" folder found in " + path.join(__dirname, "test0/bower_components") + ".");
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				} else {
					errors.push("Test" + currentTest + " error: The file " + path.join(__dirname, "temp/") + " have not been created.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		});
	},
	/**
	 * Test the verbose function at true (CLI)
	 * #08
	 */
		function() {
		exec("node ../bin/clean-bower-installer -i --bower=\"../test/test1\"", function(err, result) {
			if (err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			} else {
				if (fs.existsSync(path.join(__dirname, "test1/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test1/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				}

				if (result === "clean-bower-installer execution successfully done!") {
					errors.push("Test" + currentTest + " error: No verbose answer were receive but we are waiting for one.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		});
	},
	/**
	 * Test the verbose function at false (CLI)
	 * #09
	 */
		function() {
		exec("node ../bin/clean-bower-installer -i --bower=\"../test/test0\"", function(err, result) {
			if (err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			} else {
				if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test0/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				}

				if (result !== "clean-bower-installer execution successfully done!\n") {
					errors.push("Test" + currentTest + " error: A verbose answer have been receive when we don't want one.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		});
	},
	/**
	 * Test the update method (CLI)
	 * #10
	 */
		function() {
		// 1 Install an old library version
		// In case of a bug, you may have to change the version here for the one just before the latest
		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], {save: true}, {cwd: "test0"})
			.on("end", function() {

				// 2 remove the bower folder
				if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test0/bower_components"));
				}

				// 3 restore the bower file
				if (fs.existsSync(path.join(__dirname, "test0/bower.json"))) {
					fs.removeSync(path.join(__dirname, "test0/bower.json"));
					fs.writeFileSync(path.join(__dirname, "test0/bower.json"), defaultBowerFile);
				}

				// 4 run cbi update
				exec("node ../bin/clean-bower-installer -u --bower=\"../test/test0\"", function(err) {
					if (err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					} else {
						// 5 run bower update
						bower.commands
							.update([], {save: true}, {cwd: "test0"})
							.on("end", function(update) {

								// 6 if no result the lib is at the last version, so it work
								if (Object.keys(update).length !== 0) {
									errors.push("Test" + currentTest + " error: The Angular lib have been updated as if it have been updated before using cbi.update().");
								}

								if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
									fs.removeSync(path.join(__dirname, "test0/bower_components"));
								}

								if (fs.existsSync(path.join(__dirname, "temp"))) {
									fs.removeSync(path.join(__dirname, "temp"));
								}

								testDisplay("Test" + currentTest);
								runNextTest();
							});
					}
				});
			});
	},
	/**
	 * Test the run method (CLI)
	 * #11
	 */
		function() {
		bower.commands
			.install(["angular"], {}, {cwd: "test0"})
			.on("end", function() {

				exec("node ../bin/clean-bower-installer --bower=\"../test/test0\"", function(err) {
					if (err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					} else {
						if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test0/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "temp/angular.js"))) {
							fs.removeSync(path.join(__dirname, "temp"));
						} else {
							errors.push("Test" + currentTest + " error: The angular.js file was not copy by clean-bower-installer.");
						}

						testDisplay("Test" + currentTest);
						runNextTest();
					}
				});
			}
		);
	},
	/**
	 * Test the runMin method (CLI)
	 * #12
	 */
		function() {
		bower.commands
			.install(["angular"], {}, {cwd: "test0"})
			.on("end", function() {
				exec("node ../bin/clean-bower-installer -m --bower=\"../test/test0\"", function(err) {
					if (err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					} else {
						if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test0/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "temp/angular.min.js"))) {
							// Verify that the file is the minimised one using his number of line
							var i;
							var count = 0;
							fs.createReadStream(path.join(__dirname, "temp/angular.min.js"), {start: 0, end: 99})
								.on("data", function(chunk) {
									for (i = 0; i < chunk.length; ++i) {
										if (chunk[i] === 10) {
											count++;
										}
									}
								})
								.on("end", function() {
									if (count > 10) {
										errors.push("Test" + currentTest + " error: The angular.js file copy by the command -m wasn't the minimised one.");
									}

									fs.removeSync(path.join(__dirname, "temp"));

									testDisplay("Test" + currentTest);
									runNextTest();
								});
						} else {
							errors.push("Test" + currentTest + " error: The angular.min.js file was not copy by the command -m.");

							testDisplay("Test" + currentTest);
							runNextTest();
						}
					}
				});
			}
		);
	},
	/**
	 * Test the runMinR method (CLI)
	 * #13
	 */
		function() {
		bower.commands
			.install(["angular"], {}, {cwd: "test0"})
			.on("end", function() {
				exec("node ../bin/clean-bower-installer -M --bower=\"../test/test0\"", function(err) {
					if (err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					} else {
						if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test0/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "temp/angular.js"))) {
							// Verify that the file is the minimised one using his number of line
							var i;
							var count = 0;
							fs.createReadStream(path.join(__dirname, "temp/angular.js"), {start: 0, end: 99})
								.on("data", function(chunk) {
									for (i = 0; i < chunk.length; ++i) {
										if (chunk[i] === 10) {
											count++;
										}
									}
								})
								.on("end", function() {
									if (count > 10) {
										errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command -M.");
									}

									fs.removeSync(path.join(__dirname, "temp"));

									testDisplay("Test" + currentTest);
									runNextTest();
								});

						} else {
							errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command -M.");

							testDisplay("Test" + currentTest);
							runNextTest();
						}
					}
				});
			}
		);
	},
	/**
	 * Test the removeAfter argument (API)
	 * #14
	 */
		function() {
		cbi.install({cwd: "test2"}).then(
			function() {
				if (fs.existsSync(path.join(__dirname, "test2/bower_components"))) {
					errors.push("Test" + currentTest + " error: The \"bower_components\" folder still there as if it was suppose to be deleted byt the \"removeAfter\" argument.");
					fs.removeSync(path.join(__dirname, "test2/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				} else {
					errors.push("Test" + currentTest + " error: The file " + path.join(__dirname, "temp/") + " have not been created.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			},
			function(err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		);
	},
	/**
	 * Test the removeAfter argument (CLI)
	 * #15
	 */
		function() {

		exec("node ../bin/clean-bower-installer -ir --bower=\"../test/test0\"", function(err) {
			if (err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			} else {
				if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
					errors.push("Test" + currentTest + " error: The \"bower_components\" folder still there as if it was suppose to be deleted byt the \"removeAfter\" argument.");
					fs.removeSync(path.join(__dirname, "test0/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				} else {
					errors.push("Test" + currentTest + " error: The file " + path.join(__dirname, "temp/") + " have not been created.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		});
	},
	/**
	 * Test the verbose override (CLI)
	 * #16
	 */
		function() {
		exec("node ../bin/clean-bower-installer -iV --bower=\"../test/test0\"", function(err, result) {
			if (err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			} else {
				if (fs.existsSync(path.join(__dirname, "test0/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test0/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				}

				if (result === "clean-bower-installer execution successfully done!") {
					errors.push("Test" + currentTest + " error: No verbose answer were receive but we are waiting for one.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		});
	},
	/**
	 * Test the file ignore (API)
	 * #17
	 */
		function() {
		cbi.install({cwd: "test3"}).then(
			function() {
				if (fs.existsSync(path.join(__dirname, "test3/bower_components"))) {
					errors.push("Test" + currentTest + " error: The \"bower_components\" folder still there as if it was suppose to be deleted byt the \"removeAfter\" argument.");
					fs.removeSync(path.join(__dirname, "test3/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "temp/fonts/glyphicons-halflings-regular.svg"))) {
					errors.push("Test" + currentTest + " error: The file \"fonts/glyphicons-halflings-regular.svg\" was suppose to be ignore.");
				} else if (!fs.existsSync(path.join(__dirname, "temp/fonts/glyphicons-halflings-regular.eot"))) {
					errors.push("Test" + currentTest + " error: The file \"fonts/glyphicons-halflings-regular.eot\" wasn't suppose to be ignore.");
				}

				if (fs.existsSync(path.join(__dirname, "temp"))) {
					fs.removeSync(path.join(__dirname, "temp"));
				} else {
					errors.push("Test" + currentTest + " error: The file " + path.join(__dirname, "temp/") + " have not been created.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			},
			function(err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		);
	},
	/**
	 * Test without option (API)
	 * #18
	 */
		function() {
		cbi.install({cwd: "test4"}).then(
			function() {
				if (fs.existsSync(path.join(__dirname, "test4/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test4/bower_components"));
				} else {
					errors.push("Test" + currentTest + " error: The \"bower_components\" missing.");
				}

				if (fs.existsSync(path.join(__dirname, "test4/angular.js"))) {
					fs.removeSync(path.join(__dirname, "test4/angular.js"));
				} else {
					errors.push("Test" + currentTest + " error: The file " + path.join(__dirname, "test4/angular.js") + " have not been created.");
				}

				testDisplay("Test" + currentTest);
				runNextTest();
			},
			function(err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		);
	},
	/**
	 * Test the runMin method with default.minFolder(API)
	 * #19
	 */
		function() {
		bower.commands
			.install(["angular"], {}, {cwd: "test5"})
			.on("end", function() {
				cbi.runMin("test5").then(
					function() {
						if (fs.existsSync(path.join(__dirname, "test5/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test5/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "tempMin/angular.min.js"))) {
							// Verify that the file is the minimised one using his number of line
							var i;
							var count = 0;
							fs.createReadStream(path.join(__dirname, "tempMin/angular.min.js"), {start: 0, end: 99})
								.on("data", function(chunk) {
									for (i = 0; i < chunk.length; ++i) {
										if (chunk[i] === 10) {
											count++;
										}
									}
								})
								.on("end", function() {
									if (count > 10) {
										errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command install().");
									}

									fs.removeSync(path.join(__dirname, "tempMin"));

									testDisplay("Test" + currentTest);
									runNextTest();
								});
						} else {
							errors.push("Test" + currentTest + " error: The angular.min.js file was not copy by the command install().");

							testDisplay("Test" + currentTest);
							runNextTest();
						}
					},
					function(err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					}
				);
			}
		);
	},
	/**
	 * Test the runMinR method (CLI)
	 * #20
	 */
		function() {
		bower.commands
			.install(["angular"], {}, {cwd: "test5"})
			.on("end", function() {
				exec("node ../bin/clean-bower-installer -M --bower=\"../test/test5\"", function(err) {
					if (err) {
						errors.push("Error in test" + currentTest + ": " + err);

						testDisplay("Test" + currentTest);
						runNextTest();
					} else {
						if (fs.existsSync(path.join(__dirname, "test5/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test5/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "tempMin/angular.js"))) {
							// Verify that the file is the minimised one using his number of line
							var i;
							var count = 0;
							fs.createReadStream(path.join(__dirname, "tempMin/angular.js"), {start: 0, end: 99})
								.on("data", function(chunk) {
									for (i = 0; i < chunk.length; ++i) {
										if (chunk[i] === 10) {
											count++;
										}
									}
								})
								.on("end", function() {
									if (count > 10) {
										errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command -M.");
									}

									fs.removeSync(path.join(__dirname, "tempMin"));

									testDisplay("Test" + currentTest);
									runNextTest();
								});

						} else {
							errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command -M.");

							testDisplay("Test" + currentTest);
							runNextTest();
						}
					}
				});
			}
		);
	},
	/**
	 * Test the runMin method with default.minFolder(API)
	 * #21
	 */
		function() {
		cbi.install({cwd: "test6"}).then(
			function() {
				if (fs.existsSync(path.join(__dirname, "test6/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test6/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "tempMin/angular.min.js"))) {
					// Verify that the file is the minimised one using his number of line
					var i;
					var count = 0;
					fs.createReadStream(path.join(__dirname, "tempMin/angular.min.js"), {start: 0, end: 99})
						.on("data", function(chunk) {
							for (i = 0; i < chunk.length; ++i) {
								if (chunk[i] === 10) {
									count++;
								}
							}
						})
						.on("end", function() {
							if (count > 10) {
								errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command install().");
							}

							fs.removeSync(path.join(__dirname, "tempMin"));

							testDisplay("Test" + currentTest);
							runNextTest();
						});
				} else {
					errors.push("Test" + currentTest + " error: The angular.min.js file was not copy by the command install().");

					testDisplay("Test" + currentTest);
					runNextTest();
				}
			},
			function(err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		);
	},
	/**
	 * Test the runMin method with default.minFolder(API)
	 * #22
	 */
		function() {
		cbi.install({cwd: "test7"}).then(
			function() {
				if (fs.existsSync(path.join(__dirname, "test7/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test7/bower_components"));
				}

				if (fs.existsSync(path.join(__dirname, "tempMin/angular.js"))) {
					// Verify that the file is the minimised one using his number of line
					var i;
					var count = 0;
					fs.createReadStream(path.join(__dirname, "tempMin/angular.js"), {start: 0, end: 99})
						.on("data", function(chunk) {
							for (i = 0; i < chunk.length; ++i) {
								if (chunk[i] === 10) {
									count++;
								}
							}
						})
						.on("end", function() {
							if (count > 10) {
								errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command install().");
							}

							fs.removeSync(path.join(__dirname, "tempMin"));

							testDisplay("Test" + currentTest);
							runNextTest();
						});
				} else {
					errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command install().");

					testDisplay("Test" + currentTest);
					runNextTest();
				}
			},
			function(err) {
				errors.push("Error in test" + currentTest + ": " + err);

				testDisplay("Test" + currentTest);
				runNextTest();
			}
		);
	}
];

var testNumber = Object.keys(test).length;
/**
 * Execute the next test in the object "test"
 */
function runNextTest() {
	currentTest++;

	// Just in case a test crash
	if (fs.existsSync(path.join(__dirname, "temp"))) {
		fs.removeSync(path.join(__dirname, "temp"));
	}

	// Just in case a test crash
	if (fs.existsSync(path.join(__dirname, "tempMin"))) {
		fs.removeSync(path.join(__dirname, "tempMin"));
	}

	if (currentTest < testNumber) {
		test[currentTest]();
	} else {
		//All tests done
		if (errorCount === 0) {
			console.log(colors.green("\nAll clean-bower-installer test had pass."));
			setTimeout(function() {
				process.exit(0);
			}, 1000);
		} else {
			console.log(colors.red("\nThere had been " + errorCount + " error(s) while testing clean-bower-installer."));
			setTimeout(function() {
				process.exit(1);
			}, 2000);
		}
	}
}

runNextTest();