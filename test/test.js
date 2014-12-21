"use strict";

var cbi = require("../bin/clean-bower-installer"),
	path = require("path"),
	fs = require("../node_modules/fs-extra"),
	colors = require("../node_modules/colors/safe");

var errors = [],
	errorCount = 0;

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
			function (result) {
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
		)
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
		)
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
		)
	}
];

var testNumber = Object.keys(test).length;
var currentTest = 0;
function runNextTest() {
	if (currentTest < testNumber) {
		test[currentTest]();
	} else {
		//All tests done
		if (errorCount === 0) {
			console.log(colors.green("\nAll clean-bower-installer test had pass."));
		} else {
			console.log(colors.red("\nThere had been " + errorCount + " error(s) while testing clean-bower-installer."))
		}
	}
	currentTest++;
}

runNextTest();