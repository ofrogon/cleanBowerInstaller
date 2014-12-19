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

// Test 1 ------------------------- Test file without file type folder

cbi.install({cwd: "test1"});

if (fs.existsSync(path.join(__dirname, "test1/bower_components"))) {
	fs.removeSync(path.join(__dirname, "test1/bower_components"));
} else {
	errors.push("Test 1 error: No \"bower_components\" folder found in " +path.join(__dirname, "test1/bower_components") + ".");
}

if (fs.existsSync(path.join(__dirname, "temp/angular.js"))) {
	fs.removeSync(path.join(__dirname, "temp/angular.js"));
} else {
	errors.push("Test 1 error: The file " + path.join(__dirname, "temp/") + " have not been created.");
}

testDisplay("Test1");



// Test conclusion
if (errorCount === 0) {
	console.log(colors.green("\nAll clean-bower-installer test had pass."));
} else {
	console.log(colors.red("\nThere had been " + errorCount + " error(s) while testing clean-bower-installer."))
}