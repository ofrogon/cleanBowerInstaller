"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		setup: {
			"testDir": ".testFolder"
		},
		jshint: {
			options: {
				jshintrc: true
			},
			dev: {
				files: {
					src: [
						"Gruntfile.js",
						"bin/clean-bower-installer",
						"lib/*",
						"test/e2e/test.js",
						"test/unit/**/*.test.js"
					]
				}
			},
			prod: {
				files: {
					src: [
						"Gruntfile.js",
						"bin/clean-bower-installer",
						"lib/*"
					]
				}
			}
		},
		mochaTest: {
			unit: {
				options: {
					reporter: "spec",
					captureFile: "<%= setup.testDir %>/unitResults.txt",
					quiet: false,
					clearRequireCache: false
				},
				src: ["test/unit/**/*.js"]
			},
			coverage: {
				options: {
					reporter: "html-cov",
					quiet: true,
					captureFile: "<%= setup.testDir %>/coverage.html",
					require: "blanket",
					clearRequireCache: true
				},
				src: ["test/unit/**/*.js"]
			},
			lcov: {
				options: {
					reporter: "mocha-lcov-reporter",
					quiet: true,
					captureFile: "<%= setup.testDir %>/coverage.lcov",
					require: "blanket",
					clearRequireCache: true
				},
				src: ["test/unit/**/*.js"]
			}
		},
		run: {
			runTests: {
				options: {
					cwd: "./test/e2e/"
				},
				command: "node",
				args: ["test.js"]
			}
		},
		coveralls: {
			options: {
				force: false
			},
			travis: {
				src: "<%= setup.testDir %>/coverage.lcov"
			}
		}
	});

	grunt.task.registerTask("prepareForTest", "Prepare the temp folder.", function() {
		var fakeBowerJson = {
				"name": "unitTest",
				"cInstall": {}
			},
			fakeBowerJson2 = {
				"name": "option-test",
				"dependencies": {
					"bootstrap": "~3.2.0"
				},
				"cInstall": {
					"folder": {
						"js": "js/vendor/",
						"css": "css/",
						"otf, eot, svg, ttf, woff": "fonts/"
					},
					"option": {
						"default": {
							"folder": "public"
						}
					},
					"source": {
						"bootstrap": {
							"glyphicons-halflings-regular.*": "dist/fonts/*",
							"bootstrap.js": "dist/js/bootstrap.js",
							"bootstrap.css": "dist/css/bootstrap.css"
						}
					}
				}
			};

		grunt.file.write(".temp/bower.json", JSON.stringify(fakeBowerJson));
		grunt.file.write(".temp/under/bower.json", JSON.stringify(fakeBowerJson2));
	});

	// Load the plugin that provides the "jshint" task.
	grunt.loadNpmTasks("grunt-contrib-jshint");
	// Load the plugin that provides the "run" task.
	grunt.loadNpmTasks("grunt-run");
	// Load the plugin that provides the "mocha" task.
	grunt.loadNpmTasks("grunt-mocha-test");
	// Load the plugin that provides the "coveralls" task.
	grunt.loadNpmTasks("grunt-coveralls");

	//Custom Task ---------------------
	// Run the coverage test
	grunt.registerTask("coverage", ["prepareForTest", "mochaTest:coverage"]);

	// Run the unit tests
	grunt.registerTask("unit", ["prepareForTest", "mochaTest:unit"]);

	// Run JSHint to test the code quality
	grunt.registerTask("codeQualityCheckup", ["jshint:dev"]);

	// run tests and output all to a format that coveralls.io understand
	grunt.registerTask("coverallsReport", ["prepareForTest", "mochaTest:lcov", "coveralls:travis"]);

	// Run the useful development tests
	grunt.registerTask("testAll", ["run:runTests", "test", "coverage"]);

	// Run the action to test before committing
	grunt.registerTask("preCommit", ["jshint:prod", "testAll"]);

	// CI actions
	grunt.registerTask("CI", ["unit", "coverallsReport"]);
};
