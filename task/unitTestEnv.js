"use strict";

module.exports = function (grunt) {
	grunt.task.registerTask("prepareForTest", "Prepare the tempU folder.", function () {
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

		grunt.file.write(".testFolder/tempU/bower.json", JSON.stringify(fakeBowerJson));
		grunt.file.write(".testFolder/tempU/under/bower.json", JSON.stringify(fakeBowerJson2));
	});

	grunt.task.registerTask("cleanAfterTest", "Clean the tempU folder.", function () {
		grunt.file.delete(".testFolder/tempU");
	});
};
