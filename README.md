# clean-bower-installer
This tool allows you to install bower dependencies without including the entire repo. It also adds a way to specify and take only what you really need from all the files bower download.

[![Build Status](https://img.shields.io/travis/ofrogon/cleanBowerInstaller/master.svg?style=flat)](https://travis-ci.org/ofrogon/cleanBowerInstaller)
[![Dependency Status](https://david-dm.org/ofrogon/cleanBowerInstaller.svg?style=flat)](https://david-dm.org/ofrogon/cleanBowerInstaller)

## How to install
You can install clean-bower-installer in two ways:

__Using the command line__
```
npm install -g clean-bower-installer
```

__Using the API__
```
npm install clean-bower-installer
```

## CLI use

### How to run it
From the folder where your bower.json file is, run this command:
```
clean-bower-installer [OPTIONS] [ARGS]
```

### List of option

| Command            | Result                                                                |
|--------------------|-----------------------------------------------------------------------|
| `-i`, `--install`  | Run the command "bower install" before execute clean-bower-installer. |
| `-u`, `--update`   | Run the command "bower update" before execute clean-bower-installer.  |
| `--bower=`"path"   | By entering the relative path to the bower.json file you can run the command from a different folder than the one containing the bower.json file. ex.:`bower=some/fake/path`|
| `-m`, `--min`      | Copy .min file version first, if it don't exist it copy the standard version. |
| `-M`, `--renameMin`| Copy .min file version first, if it don't exist it copy the standard version **and** rename the file as specified in the bower.json file (can be used to remove the .min extension). |
| `-v`, `--version`  | Display the version of the tool install on your computer.             |
| `-h`, `--help`     | Display the help and usage details.                                   |

## API
| Element            | Value to provide                                                      |
|--------------------|-----------------------------------------------------------------------|
| `commands.automatic({[Object]})` | Shortcut for `bower.commands.install()` or `bower.commands.update()` then `commands.run()`, see [the bower programmatic-api documentation](http://bower.io/docs/api/#programmatic-api) for more detail.<br/> You can pass as argument an object containing some bower custom configuration also here see [the bower configuration documentation](http://bower.io/docs/config/#bowerrc-specification) for more detail.|
| `commands.install({[Object]})` | Shortcut for `bower.commands.install()` then `commands.run()`, see [the bower programmatic-api documentation](http://bower.io/docs/api/#programmatic-api) for more detail. <br/> You can pass as argument an object containing some bower custom configuration also here see [the bower configuration documentation](http://bower.io/docs/config/#bowerrc-specification) for more detail.|
| `commands.update({[Object]})`  | Shortcut for `bower.commands.update()` then `commands.run()`, see [the bower programmatic-api documentation](http://bower.io/docs/api/#programmatic-api) for more detail.<br/>You can pass as argument an object containing some bower custom configuration also here see [the bower configuration documentation](http://bower.io/docs/config/#bowerrc-specification) for more detail. |
| `commands.run()`     | Execute the clean-bower-installer action.                             |

Then, for example, you can use it like this:
```
var cbi = require('clean-bower-installer').commands;

// This function will be useful in the next examples
function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}

/* Ex. 1: Run clean-bower-installer automatic command */
cbi.automatic();

/* Ex. 2: Run clean-bower-installer update command */
cbi.update();

/* Ex. 3: Run clean-bower-installer install command */
cbi.install();

/* Ex. 4: Run bower libs update */
cbi.run();
```

## Options
These elements can be set in the cInstall>option section of the *bower.json* file.

| Element           | Value to provide                                                      |
|-------------------|-----------------------------------------------------------------------|
| `default`         | Object. <br/> **Option 1**: `folder`, string, give there the folder from where you want all your files to be copied relative to. (default value: `.`)<br/> **Option 2**: `minFolder`, string, write here where you want all your minimized files version to be copied relative to. This folder will be use only if the module was executed with the `min > get` option at true.<br/>Ex: `option: {"folder": "public", "minFolder": "packages/prod/public"}` |
| `min`             | Object. <br/> **Option 1**: `get`, boolean, if true get the minimise file version. <br/>**Option 2**: `rename`, boolean, if true rename the file as specified in the bower.json file. If `get` value is false, the value of `rename` will be ignored.<br/>**Option 3**: `ignoreExt`, array of string, each extensions list in this array will be ignored when the `min` option is use.<br/>*By default these two values are false.* <br/>Ex 1: `"min": {"get": true, "rename": false}` is the equivalent of the CLI `clean-bower-installer -m`<br/>Ex 2: `"min": {"get": true, "rename": true}` is the equivalent of the CLI `clean-bower-installer -M`<br/>Ex 3: `"min": {"ignoreExt": ["less"]}` can be use to ignore all less files when you use the `min` option.|

## Ignore files

To ignore some files that a pattern include, you can specify the files you want to ignore in the library file listing the `!` symbol and pass him a *string* or a *Array* with the files (or pattern) you want to be ignore.

**Important**: To ignore files, you can either list the paths to the ignored files, or you can use a pattern, like `**/file.ext`.

For example, see [Specifying files to ignore](#SFTI) in the Examples section.

## Examples

### Simple use
```
{
    "name": "simple-test",
    "dependencies": {
        "angular": "~1.2.0"
    },
    "cInstall": {
        "folder": {
            "js": "js/vendor/"
        },
        "source": {
            "angular": {
                "angular.js": "angular.js"
            }
        }
    }
}
```
#### Result
```
js
└── vendor
   └── angular.js
```

-----
### With some option
```
{
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
}
```
#### Result
```
public
├── js
|   └── vendor
|       └── bootstrap.js
├── css
|   └── bootstrap.css
└── fonts
    ├── glyphicons-halflings-regular.eot
    ├── glyphicons-halflings-regular.svg
    ├── glyphicons-halflings-regular.ttf
    └── glyphicons-halflings-regular.woff
```

-----
### Specifying some global and relative path
```
{
    "name": "simple-test",
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
                "bootstrap.min.js#min": "dist/js/bootstrap.min.js",
                "bootstrap.css": "dist/css/bootstrap.css",
                "bootstrap.min.css"#/thisPathIsGlobal: "dist/css/bootstrap.min.css"
            }
        }
    }
}
```
#### Result
```
public
├── js
|   └── vendor
|       ├── bootstrap.js
|       └── min
|           └── bootstrap.min.js
├── css
|   └── bootstrap.css
├── fonts
|   ├── glyphicons-halflings-regular.eot
|   ├── glyphicons-halflings-regular.svg
|   ├── glyphicons-halflings-regular.ttf
|   └── glyphicons-halflings-regular.woff
└── thisPathIsGlobal
    └── bootstrap.min.css
```
-----
### <a name="SFTI"></a>Specifying files to ignore
```
{
    "name": "simple-test",
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
                "!": ["dist/fonts/*.svg"],
                "glyphicons-halflings-regular.*": "dist/fonts/*",
                "bootstrap.js": "dist/js/bootstrap.js",
                "bootstrap.min.js#min": "dist/js/bootstrap.min.js",
                "bootstrap.css": "dist/css/bootstrap.css",
                "bootstrap.min.css"#/thisPathIsGlobal: "dist/css/bootstrap.min.css"
            }
        }
    }
}
```
#### Result
```
public
├── js
|   └── vendor
|       ├── bootstrap.js
|       └── min
|           └── bootstrap.min.js
├── css
|   └── bootstrap.css
├── fonts
|   ├── glyphicons-halflings-regular.eot
|   ├── glyphicons-halflings-regular.ttf
|   └── glyphicons-halflings-regular.woff
└── thisPathIsGlobal
    └── bootstrap.min.css
```

-----
### Real example (from: [uCtrl website](https://github.com/uCtrl/Website))
#### Code
```
{
    "name": "uCtrl-Website",
    "version": "0.0.1",
    "contributors": [
        "the name here <mail address here OPTIONAL>"
    ],
    "description": "Website and portal for the uCtrl web division",
    "keywords": [
        "uCtrl",
        "Automation"
    ],
    "license": "MIT",
    "homepage": "https://github.com/uCtrl/Website",
    "private": true,
    "dependencies": {
        "angular": "~1.2.23",
        "angular-bootstrap": "~0.11.0",
        "angular-translate": "~2.4.0",
        "bootstrap": "~3.2.0",
        "bootstrap-select": "~1.6.2",
        "fontawesome": "^4.2.0",
        "jquery": "~1.11.1",
        "jquery.scrollTo": "~1.4.13",
        "ui-router": "~0.2.11",
        "validator-js": "~3.18.0"
    },
    "cInstall": {
        "folder": {
            "js": "js/vendor/",
            "less": "css/less/",
            "otf, eot, svg, ttf, woff": "fonts/"
        },
        "option": {
            "default": {
                "folder": "public"
            }
        },
        "source": {
            "angular": {
                "angular.js": "angular.js"
            },
            "angular-bootstrap": {
                "ui-bootstrap.js": "ui-bootstrap.js",
                "ui-bootstrap-tpls.js": "ui-bootstrap-tpls.js"
            },
            "angular-translate": {
                "angular-translate.js": "angular-translate.js"
            },
            "bootstrap": {
                "glyphicons-halflings-regular.*": "dist/fonts/*",
                "bootstrap.js": "dist/js/bootstrap.js",
                "*.less#bootstrap": "less/*.less",
                "*.less#bootstrap/mixins": "less/mixins/*.less"
            },
            "bootstrap-select": {
                "bootstrap-select.less#bootstrapSelect": "less/bootstrap-select.less",
                "bootstrap-select.js": "dist/js/bootstrap-select.js"
            },
            "fontawesome": {
                "FontAwesome.otf": "fonts/FontAwesome.otf",
                "fontawesome-webfont.*": "fonts/fontawesome-webfont.*",
                "*.less#fontawesome": "less/*.less"
            },
            "jquery": {
                "jquery.js": "dist/jquery.js"
            },
            "jquery.scrollTo": {
                "jquery.scrollTo.js": "jquery.scrollTo.js"
            },
            "ui-router": {
                "angular-ui-router.js": "release/angular-ui-router.js"
            },
            "validator-js": {
                "validator.js": "validator.js"
            }
        }
    }
}
```
#### Result (folder hierarchy only)
```
public
├── js
|   └── vendor
|       └── [files]
├── css
|   ├── bootstrap
|   |   ├── mixins
|   |   |   └── [files]
|   |   └── [files]
|   ├── bootStrapSelect
|   |   └── [files]
|   └── fontawesome
|       └── [files]
└── fonts
    └── [files]
```

## Version notes
### 0.0.1 - Alpha 1
* First module release.

### 0.0.2 - Alpha 2
* Add API.
* Remove error message when rewriting file.
* Mac compatibility restoration.
* Various bug fixes.

### 0.0.3 - Alpha 3
* Add option to get minimised version of bower dependencies.
* Add option to set a default folder for minimized files.
* Repair the CLI commands call. Before the CLI section was call as soon as we require the clean-bower-installer module, now it not (as intended).

### 0.0.4 - Alpha 4
* Add way to ignore file.
* Repair documentation (missing documentation to use the `default` option in it's new way).

### 0.0.5 - Alpha 5
* Add new command `automatic` to let clean-bower-installer automatically select between update or install action to ask bower to do.
* Now the API commands `automatically`, `install` and `update` no more return a output but execute the `run` command automatically.
* Now you can specify extension(s) to ignore when you call the `min` option.

## Incoming
* Option to set a default action, for example, you will be able to always specify the execution of bower update or install when executing the module (Target version: 0.0.6)
* Option to remove the bower folder after use. (Target version: 0.0.7)
* Add test in the lib (Target version: 0.1.0)
* Write the Wiki (Target version: 0.1.0)
