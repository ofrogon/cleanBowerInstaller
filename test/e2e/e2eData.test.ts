"use strict";

const angularBower = {
    cInstall: {
        folder: {},
        option: {
            default: {
                folder: "dest"
            },
            verbose: false
        },
        source: {
            angular: {
                "angular.js": "angular.js"
            }
        }
    },
    dependencies: {
        angular: "~1.3.20"
    },
    name: ""
};

const angularBower2 = {
    cInstall: {
        folder: {},
        option: {
            default: {
                folder: "dest"
            },
            verbose: true
        },
        source: {
            angular: {
                "angular.js": "angular.js"
            }
        }
    },
    dependencies: {
        angular: "~1.3.0"
    },
    name: ""
};

const angularBower3 = {
    cInstall: {
        option: {
            default: {
                folder: "dest"
            },
            removeAfter: true
        },
        source: {
            angular: {
                "angular.js": "angular.js"
            }
        }
    },
    dependencies: {
        angular: "~1.3.0"
    },
    name: ""
};

const angularBower4 = {
    cInstall: {
        source: {
            angular: {
                "angular.js": "angular.js"
            }
        }
    },
    dependencies: {
        angular: "~1.3.0"
    },
    name: ""
};

const angularBower5 = {
    cInstall: {
        option: {
            default: {
                folder: "dest_Min"
            }
        },
        source: {
            angular: {
                "angular.js": "angular.js"
            }
        }
    },
    dependencies: {
        angular: "~1.3.0"
    },
    name: ""
};

const angularBower6 = {
    cInstall: {
        option: {
            default: {
                folder: "dest_Min"
            },
            min: {
                get: true,
                rename: false
            }
        },
        source: {
            angular: {
                "angular.js": "angular.js"
            }
        }
    },
    dependencies: {
        angular: "~1.3.0"
    },
    name: ""
};

const angularBower7 = {
    cInstall: {
        option: {
            default: {
                folder: "dest_Min"
            },
            min: {
                get: true,
                rename: true
            }
        },
        source: {
            angular: {
                "angular.js": "angular.js"
            }
        }
    },
    dependencies: {
        angular: "~1.3.0"
    },
    name: ""
};

const bootstrapBower = {
    cInstall: {
        folder: {
            "css": "css/",
            "js": "js/vendor/",
            "otf, eot, svg, ttf, woff": "fonts/"
        },
        option: {
            default: {
                folder: "dest"
            },
            removeAfter: true
        },
        source: {
            bootstrap: {
                "!": [
                    "dist/fonts/*.svg"
                ],
                "bootstrap.css": "dist/css/bootstrap.css",
                "bootstrap.js": "dist/js/bootstrap.js",
                "bootstrap.min.css": "dist/css/bootstrap.min.css",
                "glyphicons-halflings-regular.*": "dist/fonts/*"
            }
        }
    },
    dependencies: {
        bootstrap: "~3.2.0"
    },
    name: ""
};

const renamingFolderAndFileIgnore = {
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
                "!": ["dist/fonts/*.svg"],
                "banana.js": "dist/js/bootstrap.js",
                "bootstrap.css": "dist/css/bootstrap.css",
                "bootstrap.min.css#/thisPathIsGlobal": "dist/css/bootstrap.min.css",
                "bootstrap.min.js#min": "dist/js/bootstrap.min.js",
                "glyphicons-halflings-regular.*": "dist/fonts/*"
            }
        }
    },
    dependencies: {
        bootstrap: "~3.2.0"
    },
    name: ""
};

const testFolders = {
    "folder": ".testFolder/tmp",
    "test0": {
        bowerJson: angularBower
    },
    "test1": {
        bowerJson: angularBower2
    },
    "test2": {
        bowerJson: angularBower3
    },
    "test3": {
        bowerJson: bootstrapBower
    },
    "test4": {
        bowerJson: angularBower4
    },
    "test5": {
        bowerJson: angularBower5
    },
    "test6": {
        bowerJson: angularBower6
    },
    "test7": {
        bowerJson: angularBower7
    },
    "test8": {
        bowerJson: renamingFolderAndFileIgnore
    }
};

export default testFolders;
