"use strict";

const fakeBowerJson = {
    cInstall: {},
    name: "unitTest"
};

const fakeBowerJson2 = {
    cInstall: {
        folder: {
            "css": "css/",
            "js": "js/vendor/",
            "otf, eot, svg, ttf, woff": "fonts/"
        },
        option: {
            default: {
                folder: "public"
            }
        },
        source: {
            bootstrap: {
                "bootstrap.css": "dist/css/bootstrap.css",
                "bootstrap.js": "dist/js/bootstrap.js",
                "glyphicons-halflings-regular.*": "dist/fonts/*"
            }
        }
    },
    dependencies: {
        bootstrap: "~3.2.0"
    },
    name: "option-test"
};

const testFolder = ".testFolder";

const fakeBowerPath = `${testFolder}/tempU/`;

const fakeBowerPath2 = `${testFolder}/tempU/under/`;

export {
    fakeBowerJson,
    fakeBowerJson2,
    testFolder,
    fakeBowerPath,
    fakeBowerPath2
};
