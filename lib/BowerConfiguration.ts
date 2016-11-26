class CbiConfigOptionDefault {
	folder: string = "";
	minFolder: string = "";
}

class CbiConfigOptionMin {
	get: boolean = false;
	rename: boolean = false;
	ignoreExt: string[] = [];
}

class CbiConfigOption {
	default: CbiConfigOptionDefault;
	min: CbiConfigOptionMin;
	verbose: boolean = false;
	removeAfter: boolean = false;
}

class CbiConfig {
	folder: Object = {};
	option: CbiConfigOption;
	source: Object = {};
	cwd: string = process.cwd();
}

class BowerConfiguration {
	name: string;
	description: string;
	version: string;
	main: string;
	ignore: string[];
	dependencies: Object[];
	devDependencies: Object[];
	cInstall: CbiConfig = new CbiConfig;
}

export {BowerConfiguration, CbiConfig, CbiConfigOption, CbiConfigOptionMin, CbiConfigOptionDefault};
