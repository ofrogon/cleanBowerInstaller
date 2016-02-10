var angularBower = {
	"name": "",
	"dependencies": {
		"angular": "~1.3.20"
	},
	"cInstall": {
		"option": {
			"default": {
				"folder": "dest"
			},
			"verbose": false
		},
		"folder": {},
		"source": {
			"angular": {
				"angular.js": "angular.js"
			}
		}
	}
};

var angularBower2 = {
	"name": "",
	"dependencies": {
		"angular": "~1.3.0"
	},
	"cInstall": {
		"option": {
			"default": {
				"folder": "temp"
			},
			"verbose": true
		},
		"folder": {},
		"source": {
			"angular": {
				"angular.js": "angular.js"
			}
		}
	}
};

var angularBower3 = {
	"name": "",
	"dependencies": {
		"angular": "~1.3.0"
	},
	"cInstall": {
		"option": {
			"default": {
				"folder": "dest"
			},
			"removeAfter": true
		},
		"source": {
			"angular": {
				"angular.js": "angular.js"
			}
		}
	}
};

var angularBower4 = {
	"name": "",
	"dependencies": {
		"angular": "~1.3.0"
	},
	"cInstall": {
		"source": {
			"angular": {
				"angular.js": "angular.js"
			}
		}
	}
};

var angularBower5 = {
	"name": "",
	"dependencies": {
		"angular": "~1.3.0"
	},
	"cInstall": {
		"option": {
			"default": {
				"folder": "dest_Min"
			}
		},
		"source": {
			"angular": {
				"angular.js": "angular.js"
			}
		}
	}
};

var angularBower6 = {
	"name": "",
	"dependencies": {
		"angular": "~1.3.0"
	},
	"cInstall": {
		"option": {
			"default": {
				"folder": "dest_Min"
			},
			"min": {
				"get": true,
				"rename": false
			}
		},
		"source": {
			"angular": {
				"angular.js": "angular.js"
			}
		}
	}
};

var angularBower7 = {
	"name": "",
	"dependencies": {
		"angular": "~1.3.0"
	},
	"cInstall": {
		"option": {
			"default": {
				"folder": "dest_Min"
			},
			"min": {
				"get": true,
				"rename": true
			}
		},
		"source": {
			"angular": {
				"angular.js": "angular.js"
			}
		}
	}
};

var bootstrapBower = {
	"name": "",
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
				"folder": "dest"
			},
			"removeAfter": true
		},
		"source": {
			"bootstrap": {
				"!": [
					"dist/fonts/*.svg"
				],
				"glyphicons-halflings-regular.*": "dist/fonts/*",
				"bootstrap.js": "dist/js/bootstrap.js",
				"bootstrap.css": "dist/css/bootstrap.css",
				"bootstrap.min.css": "dist/css/bootstrap.min.css"
			}
		}
	}
};

var testFolders = {
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
	folder: ".testFolder/tmp"
};

module.exports = testFolders;
