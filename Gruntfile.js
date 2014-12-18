"use strict";

module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		jshint: {
			options: {
				jshintrc: true
			},
			all: ["Gruntfile.js", "bin/clean-bower-installer", "test/**/*.js"]
		}
	});

	// Load the plugin that provides the "jshint" task.
	grunt.loadNpmTasks("grunt-contrib-jshint");

	//Custom Task
	grunt.registerTask("codeQualityCheckup", ["jshint"]);
};