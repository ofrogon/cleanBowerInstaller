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
		mocha_istanbul: {
			coverage: {
				src: "test/unit/lib",
				options: {
					mask: "*.test.js",
					coverageFolder: "<%= setup.testDir %>/coverage"
				}
			},
			travis: {
				src: "test/unit/lib",
				options: {
					mask: "*.test.js",
					coverageFolder: "<%= setup.testDir %>/coverage",
					coverage: true
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
	// Load the plugin that provides the "mocha_istanbul" task.
	grunt.loadNpmTasks("grunt-mocha-istanbul");

	//Custom Task ---------------------
	// Run the coverage test
	grunt.registerTask("coverage", ["prepareForTest", "mocha_istanbul:coverage"]);

	// Run the unit tests
	grunt.registerTask("unit", ["prepareForTest", "mochaTest:unit"]);

	// Run JSHint to test the code quality
	grunt.registerTask("codeQualityCheckup", ["jshint:dev"]);

	// Run the useful development tests
	grunt.registerTask("test", ["run:runTests", "unit", "coverage"]);

	// Run the action to test before committing
	grunt.registerTask("preCommit", ["jshint:prod", "test"]);

	// CI actions
	grunt.registerTask("CI", ["prepareForTest", "mocha_istanbul:travis"]);

	// Event handler for Coveralls
	grunt.event.on("coverage", function(lcov, done){
		require("coveralls").handleInput(lcov, function(err){
			if (err) {
				return done(err);
			}
			done();
		});
	});
};
