"use strict";

var cbi = require("../bin/clean-bower-installer"),
	path = require("path"),
	fs = require("../node_modules/fs-extra"),
	colors = require("../node_modules/colors/safe"),
	bower = require("../node_modules/bower");

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

function testDisplay(name) {
	errorCount += errors.length;

	if (errors.length > 0) {
		console.log(colors.yellow("The " + name + " have fail due to the next error(s):"));

		for (var i = 0; i < errors.length; i++) {
			console.log(colors.yellow(errors[i]));
		}
	} else {
		console.log(colors.cyan("The execution of " + name + " pass without error."));
	}

	errors = [];
}

var test = [
	/**
	 * Test file without file type folder
	 */
	function () {
		cbi.install({cwd: "test0"}).then(
			function () {
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
			function (err) {
				errors.push("Error in test" + currentTest + ": " + err);
				runNextTest();
			}
		);
	},
	/**
	 * Test the verbose function at true
	 */
	function () {
		cbi.install({cwd: "test1"}).then(
			function (result) {
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
			function (err) {
				errors.push("Error in test" + currentTest + ": " + err);
				runNextTest();
			}
		);
	},
	/**
	 * Test the verbose function at false
	 */
		function () {
		cbi.install({cwd: "test2"}).then(
			function (result) {
				if (fs.existsSync(path.join(__dirname, "test2/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test2/bower_components"));
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
			function (err) {
				errors.push("Error in test" + currentTest + ": " + err);
				runNextTest();
			}
		);
	},
	/**
	 * Test the update method
	 */
		function () {
		// 1 Install an old library version
		// In case of a bug, you may have to change the version here for the one just before the latest
		bower.commands
			.install(["angular#>=1.2.3 <1.3.8"], { save: true }, {cwd: "test3"})
			.on("end", function () {

				// 2 remove the bower folder
				if (fs.existsSync(path.join(__dirname, "test3/bower_components"))) {
					fs.removeSync(path.join(__dirname, "test3/bower_components"));
				}

				// 3 restore the bower file
				if (fs.existsSync(path.join(__dirname, "test3/bower.json"))) {
					fs.removeSync(path.join(__dirname, "test3/bower.json"));
					fs.writeFileSync(path.join(__dirname, "test3/bower.json"), defaultBowerFile);
				}

				// 4 run cbi update
				cbi.install({cwd: "test3"}).then(
					function () {
						// 5 run bower update
						bower.commands
							.update([], {save: true}, {cwd: "test3"})
							.on("end", function (update) {

								// 6 if no result the lib is at the last version, so it work
								if (Object.keys(update).length !== 0) {
									errors.push("Test" + currentTest + " error: The Angular lib have been updated as if it have been updated before using cbi.update().");
								}

								if (fs.existsSync(path.join(__dirname, "test3/bower_components"))) {
									fs.removeSync(path.join(__dirname, "test3/bower_components"));
								}

								if (fs.existsSync(path.join(__dirname, "temp"))) {
									fs.removeSync(path.join(__dirname, "temp"));
								}

								testDisplay("Test" + currentTest);
								runNextTest();
							});
					},
					function (err) {
						errors.push("Error in test" + currentTest + ": " + err);
						runNextTest();
					}
				);
			});
	},
	/**
	 * Test the run method
	 */
		function () {
		bower.commands
			.install(["angular"], {}, {cwd: "test4"})
			.on("end", function () {
				cbi.run("test4").then(
					function () {
						if (fs.existsSync(path.join(__dirname, "test4/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test4/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "temp/angular.js"))) {
							fs.removeSync(path.join(__dirname, "temp"));
						} else {
							errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command run().");
						}

						testDisplay("Test" + currentTest);
						runNextTest();
					},
					function (err) {
						errors.push("Error in test" + currentTest + ": " + err);
						runNextTest();
					}
				);
			}
		);
	},
	/**
	 * Test the runMin method
	 */
		function () {
		bower.commands
			.install(["angular"], {}, {cwd: "test5"})
			.on("end", function () {
				cbi.runMin("test5").then(
					function () {
						if (fs.existsSync(path.join(__dirname, "test5/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test5/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "temp/angular.min.js"))) {
							// Verify that the file is the minimised one using his number of line
							var i;
							var count = 0;
							fs.createReadStream(path.join(__dirname, "temp/angular.min.js"), {start: 0, end: 99})
								.on('data', function (chunk) {
									for (i = 0; i < chunk.length; ++i) {
										if (chunk[i] == 10) {
											count++;
										}
									}
								})
								.on('end', function () {
									if (count > 10) {
										errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command run().");
									}

									fs.removeSync(path.join(__dirname, "temp"));

									testDisplay("Test" + currentTest);
									runNextTest();
								});
						} else {
							errors.push("Test" + currentTest + " error: The angular.min.js file was not copy by the command run().");

							testDisplay("Test" + currentTest);
							runNextTest();
						}
					},
					function (err) {
						errors.push("Error in test" + currentTest + ": " + err);
						runNextTest();
					}
				);
			}
		);
	},
	/**
	 * Test the runMinR method
	 */
		function () {
		bower.commands
			.install(["angular"], {}, {cwd: "test6"})
			.on("end", function () {
				cbi.runMinR("test6").then(
					function () {
						if (fs.existsSync(path.join(__dirname, "test6/bower_components"))) {
							fs.removeSync(path.join(__dirname, "test6/bower_components"));
						}

						if (fs.existsSync(path.join(__dirname, "temp/angular.js"))) {
							// Verify that the file is the minimised one using his number of line
							var i;
							var count = 0;
							fs.createReadStream(path.join(__dirname, "temp/angular.js"), {start: 0, end: 99})
								.on('data', function (chunk) {
									for (i = 0; i < chunk.length; ++i) {
										if (chunk[i] == 10) {
											count++;
										}
									}
								})
								.on('end', function () {
									if (count > 10) {
										errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command run().");
									}

									fs.removeSync(path.join(__dirname, "temp"));

									testDisplay("Test" + currentTest);
									runNextTest();
								});

						} else {
							errors.push("Test" + currentTest + " error: The angular.js file was not copy by the command run().");

							testDisplay("Test" + currentTest);
							runNextTest();
						}
					},
					function (err) {
						errors.push("Error in test" + currentTest + ": " + err);
						runNextTest();
					}
				);
			}
		);
	}
];

var testNumber = Object.keys(test).length;
function runNextTest() {
	currentTest++;

	// Just in case a test crash
	if (fs.existsSync(path.join(__dirname, "temp"))) {
		fs.removeSync(path.join(__dirname, "temp"));
	}

	if (currentTest < testNumber) {
		test[currentTest]();
	} else {
		//All tests done
		if (errorCount === 0) {
			console.log(colors.green("\nAll clean-bower-installer test had pass."));
		} else {
			console.log(colors.red("\nThere had been " + errorCount + " error(s) while testing clean-bower-installer."));
		}
	}
}

runNextTest();