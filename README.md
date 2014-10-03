# clean-bower-installer
This tool permit to install bower dependencies without including the entire repo. This tool add a way to specify and take only what you really need form all the files bower get.

It also support smart file update so only the needed files be update/rewrite when you run this tool.

## Requirement
- Have node.js install

## How to install
You can install clean-bower-installer in two way

__Using it in the command line__
```
npm install -g clean-bower-installer
```

__Using the API__ **WIP**
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

| Command           | Result                                                                |
|-------------------|-----------------------------------------------------------------------|
| -i, --install     | Run the command "bower install" before execute clean-bower-installer. |
| -u, --update      | Run the command "bower update" before execute clean-bower-installer.  |
| --bower= < path > | By entering the relative path to the bower.json file you can run the command from a different folder than the one containing the bower.json file. ex.:`bower=some/fake/path`|
| -v, --version     | Display the version of the tool install on your computer.             |
| -h, --help        | Display the help and usage details.                                   |

## API
**WIP**

## Options
Theses element can be set in the cInstall>option section of the *bower.json* file.

| Element           | Value to provide                                                      |
|-------------------|-----------------------------------------------------------------------|
| default           | Path, give there the folder from where you want all your files to be copied relative to. (default value: `.`) |
| removeAfter  **(WIP)** | Boolean, if set to true, it remove the bower lib folder after execution. (default value: false ) |

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
<ul>
	<li>js/</li>
	<ul>
		<li>vendor/</li>
		<ul>
			<li><u>angular.js</u></li>
		</ul>
	</ul>
</ul>

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
			"default": "public"
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
<ul>
	<li>public/</li>
	<ul>
		<li>js/</li>
		<ul>
			<li>vendor/</li>
			<ul>
				<li><u>bootstrap.js</u></li>
			</ul>
		</ul>
		<li>css/</li>
		<ul>
			<li><u>bootstrap.css</u></li>
		</ul>
		<li>fonts/</li>
		<ul>
			<li><u>glyphicons-halflings-regular.eot</u></li>
			<li><u>glyphicons-halflings-regular.svg</u></li>
			<li><u>glyphicons-halflings-regular.ttf</u></li>
			<li><u>glyphicons-halflings-regular.woff</u></li>
		</ul>
	</ul>
</ul>

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
			"default": "public"
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
<ul>
	<li>public/</li>
	<ul>
		<li>js/</li>
		<ul>
			<li>vendor/</li>
			<ul>
				<li><u>bootstrap.js</u></li>
				<li>min/</li>
				<ul>
					<li><u>bootstrap.min.js</u></li>
				</ul>
			</ul>
		</ul>
		<li>css/</li>
		<ul>
			<li><u>bootstrap.css</u></li>
		</ul>
		<li>fonts/</li>
		<ul>
			<li><u>glyphicons-halflings-regular.eot</u></li>
			<li><u>glyphicons-halflings-regular.svg</u></li>
			<li><u>glyphicons-halflings-regular.ttf</u></li>
			<li><u>glyphicons-halflings-regular.woff</u></li>
		</ul>
	</ul>
	<li>thisPathIsGlobal/</li>
	<ul>
		<li><u>bootstrap.min.css</u></li>
	</ul>
</ul>

-----
### Real exemple (from: [uCtrl website](https://github.com/uCtrl/Website))
#### Code
```
{
	"name": "uCtrl-Website",
	"version": "0.0.1",
	"contributors": [
		"the name here <mail address here OPTIONNAL>"
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
			"default": "public"
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
				"*.less#bootstrap": "less/*.less"
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
<ul>
	<li>public/</li>
	<ul>
		<li>css/</li>
		<ul>
			<li>bootstrap/</li>
			<ul>
				<li><u>files</u></li>
			</ul>
	  		<li>bootStrapSelect/</li>
			<ul>
				<li><u>files</u></li>
			</ul>
	   		<li>fontawesome/</li>
			<ul>
				<li><u>files</u></li>
			</ul>
		</ul>
		<li>fonts/</li>
		<ul>
			<li><u>files</u></li>
		</ul>
		<li>js/</li>
		<ul>
			<li>vendor/</li>
			<ul>
				<li><u>files</u></li>
			</ul>
		</ul>
	</ul>
</ul>