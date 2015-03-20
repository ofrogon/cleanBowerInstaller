"use strict";

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
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
						"test/test.js"
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
		run: {
			runTests: {
				options: {
					cwd: "./test"
				},
				command: "node",
				args: ["test.js"]
			}
		}
	});

	// Load the plugin that provides the "jshint" task.
	grunt.loadNpmTasks("grunt-contrib-jshint");
	// Load the plugin that provides the "run" task.
	grunt.loadNpmTasks("grunt-run");

	//Custom Task
	grunt.registerTask("codeQualityCheckup", ["jshint:dev"]);
	grunt.registerTask("test", ["run:runTests"]);
	grunt.registerTask("preCommit", ["jshint:prod", "test"]);
};