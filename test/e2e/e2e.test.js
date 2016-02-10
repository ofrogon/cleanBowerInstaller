var chai = require("chai"),
	expect = chai.expect,
	describe = require("mocha/lib/mocha.js").describe,
	it = require("mocha/lib/mocha.js").it,
	beforeEach = require("mocha/lib/mocha.js").beforeEach,
	fs = require("fs-extra"),
	path = require("path"),
	assert = require('assert'),
	testFolders = require("./e2eData.test"),
	exec = require("child_process").exec;

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

function e2eTestEnvironmentCreation(obj) {
	//Create Folders
	for (var folder in obj) {
		if (obj.hasOwnProperty(folder)) {
			if (!verifyFileExist(path.join(__dirname, folder))) {
				console.log("Create folder " + folder);
				fs.mkdirSync(path.join(__dirname, folder));
			}

			for (var file in obj[folder]) {
				if (obj[folder].hasOwnProperty(file)) {
					if (file === "bower.json") {
						obj[folder][file].name = folder;
						if (!verifyFileExist(path.join(__dirname, folder, file))) {
							console.log("Create file " + file + " in " + folder);
							fs.writeFileSync(path.join(__dirname, folder, file), JSON.stringify(obj[folder][file].content));
						}
					} else {
						if (!verifyFileExist(path.join(__dirname, folder, file))) {
							console.log("Create file " + file + " in " + folder);
							fs.mkdirSync(path.join(__dirname, folder, file));
						}
					}
				}
			}
		}
	}
}

var cwd = path.join(__dirname, "..", "..", testFolders.folder);

describe("Test file without file type folder", function() {
	beforeEach(function(done) {
		testFolders.test0.bowerJson.name = "test0";
		fs.remove(cwd, function(err) {
			if (err) {
				done(err);
			} else {
				fs.ensureDir(cwd, function(err) {
					if (err) {
						done(err);
					} else {
						fs.writeFile(path.join(cwd, "bower.json"), JSON.stringify(testFolders.test0.bowerJson), function(err) {
							done(err);
						});
					}
				});
			}
		});
	});

	// TODO old test #00
	it("API", function(done) {
		this.timeout(10000);

		cbi.install({cwd: cwd}).then(
			function() {
				expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
				expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
				done();
			},
			function(err) {
				done(err);
			}
		);
	});

	// TODO old test #07
	it("CLI", function(done) {
		this.timeout(10000);

		exec("node ../../bin/clean-bower-installer -i --bower=\"../../.testFolder/tmp\"", function(err) {
			if (err) {
				done(err);
			} else {
				expect(verifyFileExist(path.join(cwd, "bower_components/angular"))).equal(true);
				expect(verifyFileExist(path.join(cwd, "dest/angular.js"))).equal(true);
				done();
			}
		});
	});
});

//describe("Test the verbose function at true", function() {
//	beforeEach(function(done) {
//		fs.remove(cwd, function(err) {
//			if (err) {
//				done(err);
//			} else {
//				fs.write(path.join(cwd, "bower.json"), testFolders.test1["bower.json"], function(err){
//					done(err);
//				});
//			}
//		});
//	});
//
//	it("API", function() {
//		//TODO TEST that!
//	});
//
//	it("CLI", function() {
//
//	});
//});
//
//describe("Test the verbose function at false", function() {
//	it("API", function() {
//
//	});
//
//	it("CLI", function() {
//
//	});
//});
//
//describe("Test the update method", function() {
//	it("API", function() {
//
//	});
//
//	it("CLI", function() {
//
//	});
//});
//
//describe("Test the run method", function() {
//	it("API", function() {
//
//	});
//
//	it("CLI", function() {
//
//	});
//});
//
//describe("Test the runMin method", function() {
//	it("API", function() {
//
//	});
//
//	it("CLI", function() {
//
//	});
//});
//
//describe("Test the runMinR method", function() {
//	it("API", function() {
//
//	});
//
//	it("CLI", function() {
//
//	});
//});
//
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
