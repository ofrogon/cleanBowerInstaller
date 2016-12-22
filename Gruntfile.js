"use strict";

module.exports = (grunt) => {
	// Time the Grunt execution
	require("time-grunt")(grunt);

	// Load additional Grunt tasks
	grunt.loadTasks("./task");

	grunt.config.init({
		pkg: grunt.file.readJSON("package.json"),
		setup: {
			"testDir": ".testFolder"
		},
		eslint: {
			all: [
				"Gruntfile.js",
				"bin/clean-bower-installer",
				"lib/*.js",
				"test/e2e/*.js",
				"test/unit/**/*.test.js"
			]
		},
		"mocha_istanbul": {
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
				src: ["test/unit/**/*.test.js"]
			},
			e2e: {
				options: {
					reporter: "spec",
					captureFile: "<%= setup.testDir %>/unitResults.txt",
					quiet: false,
					clearRequireCache: false
				},
				src: ["test/e2e/**/*.test.js"]
			}
		}
	});

	// Load the plugin that provides the "eslint" task.
	grunt.loadNpmTasks("grunt-eslint");
	// Load the plugin that provides the "mocha" task.
	grunt.loadNpmTasks("grunt-mocha-test");
	// Load the plugin that provides the "mocha_istanbul" task.
	grunt.loadNpmTasks("grunt-mocha-istanbul");

	//Custom Task ---------------------
	// Run the coverage test
	grunt.registerTask("coverage", ["mocha_istanbul:coverage"]);

	// Run the unit tests
	grunt.registerTask("unit", ["mochaTest:unit"]);

	// Run the useful development tests
	grunt.registerTask("test", ["mochaTest:e2e", "coverage", "eslint:all"]);

	// CI actions
	grunt.registerTask("CI", ["mocha_istanbul:travis"]);

	// Event handler for Coveralls
	grunt.event.on("coverage", (lcov, done) => {
		require("coveralls").handleInput(lcov, (err) => {
			done(err);
		});
	});
};
