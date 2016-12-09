function parseFolderParameters(data) {
	let out = {};

	for (let obj in data) {
		if (data.hasOwnProperty(obj)) {
			let objPart = obj.replace(/\s/g, "").split(",");

			for (let i = 0, j = objPart.length; i < j; ++i) {
				out[objPart[i]] = data[obj];
			}
		}
	}

	return out;
}

class CbiConfigOptionDefault {
	folder: string;
	minFolder: string;

	constructor(data) {
		data = data || {};

		this.folder = data.folder || "";
		this.minFolder = data.minFolder || "";
	}
}

class CbiConfigOptionMin {
	get: boolean;
	rename: boolean;
	ignoreExt: string[];

	constructor(data) {
		data = data || {};

		this.get = data.get || false;
		this.rename = data.rename || false;
		this.ignoreExt = data.ignoreExt || [];
	}
}

class CbiConfigOption {
	default: CbiConfigOptionDefault;
	min: CbiConfigOptionMin;
	verbose: boolean;
	removeAfter: boolean;

	constructor(data) {
		data = data || {};

		this.default = new CbiConfigOptionDefault(data.default = {});
		this.min = new CbiConfigOptionMin(data.min = {});
		this.verbose = data.verbose || false;
		this.removeAfter = data.removeAfter || false;
	}
}

class CbiConfig {
	folder: Object;
	option: CbiConfigOption;
	source: Object;
	cwd: string;

	constructor(data) {
		data = data || {};

		if (data.folder) {
			this.folder = parseFolderParameters(data.folder);
		} else {
			this.folder = {};
		}

		this.option = new CbiConfigOption(data.option = {});
		this.source = data.source || {};
		this.cwd = data.cwd || process.cwd();
	}
}

class BowerConfiguration {
	name: string;
	description: string;
	version: string;
	main: string;
	ignore: string[];
	dependencies: Object[];
	devDependencies: Object[];
	cInstall: CbiConfig;

	constructor(data) {
		data = data || {};

		this.name = data.name || "";
		this.description = data.description || "";
		this.version = data.version || "";
		this.main = data.main || "";
		this.ignore = data.ignore || [];
		this.dependencies = data.dependencies || [];
		this.devDependencies = data.devDependencies || [];
		this.cInstall = new CbiConfig(data.cInstall || {});
	}
}

export {BowerConfiguration, CbiConfig, CbiConfigOption, CbiConfigOptionMin, CbiConfigOptionDefault};
