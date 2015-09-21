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
					captureFile: "<%= setup.testDir %>/unitResults.txt", // Optionally capture the reporter output to a file
					quiet: false, // Optionally suppress output to standard out (defaults to false)
					clearRequireCache: false // Optionally clear the require cache before running tests (defaults to false)
				},
				src: ["test/unit/**/*.js"]
			},
			coverage: {
				options: {
					reporter: "html-cov",
					quiet: true,
					captureFile: "<%= setup.testDir %>/coverage.html",
					require: "blanket",
					clearRequireCache: true // Optionally clear the require cache before running tests (defaults to false)
				},
				src: ["test/unit/**/*.js"]
			},
			lcov: {
				options: {
					reporter: "mocha-lcov-reporter",
					quiet: true,
					captureFile: "<%= setup.testDir %>/coverage.lcov",
					require: "blanket"
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
				src: '<%= setup.testDir %>/coverage.lcov',
				force: false
			}
		}
	});

	//
	grunt.task.registerTask("coverage", "Prepare the temp folder and run the coverage tests.", function() {
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

		grunt.task.run("mochaTest:coverage");
	});

	grunt.task.registerTask("unit", "Prepare the temp folder and run the coverage tests.", function() {
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

		grunt.task.run("mochaTest:unit");
	});

	// Load the plugin that provides the "jshint" task.
	grunt.loadNpmTasks("grunt-contrib-jshint");
	// Load the plugin that provides the "run" task.
	grunt.loadNpmTasks("grunt-run");
	// Load the plugin that provides the "mocha" task.
	grunt.loadNpmTasks("grunt-mocha-test");
	// Load the plugin that provides the "coveralls" task.
	grunt.loadNpmTasks('grunt-coveralls');

	//Custom Task
	grunt.registerTask("codeQualityCheckup", ["jshint:dev"]);
	grunt.registerTask("test", ["unit"]);
	grunt.registerTask("postTest", ["mochaTest:lcov", "coveralls"]);
	grunt.registerTask("testAll", ["run:runTests", "test"]);
	grunt.registerTask("preCommit", ["jshint:prod", "testAll"]);
};
