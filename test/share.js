"use strict";

const testFolder = ".testFolder";

module.exports = {
	fakeBowerJson: {
		"name": "unitTest",
		"cInstall": {}
	},
	fakeBowerJson2: {
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
	},
	fakeBowerPath: `${testFolder}/tempU/`,
	fakeBowerPath2: `${testFolder}/tempU/under/`,
	testFolder: testFolder
};
