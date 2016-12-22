"use strict";

const parseFolderParameters = (data) => {
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
};

class CbiConfigOptionDefault {
    public folder: string;
    public minFolder: string;

    constructor(data) {
        data = data || {};

        this.folder = data.folder || "";
        this.minFolder = data.minFolder || "";
    }
}

class CbiConfigOptionMin {
    public get: boolean;
    public rename: boolean;
    public ignoreExt: string[];

    constructor(data) {
        data = data || {};

        this.get = data.get || false;
        this.rename = data.rename || false;
        this.ignoreExt = data.ignoreExt || [];
    }
}

class CbiConfigOption {
    public default: CbiConfigOptionDefault;
    public min: CbiConfigOptionMin;
    public verbose: boolean;
    public removeAfter: boolean;

    constructor(data) {
        data = data || {};

        this.default = new CbiConfigOptionDefault(data.default = {});
        this.min = new CbiConfigOptionMin(data.min = {});
        this.verbose = data.verbose || false;
        this.removeAfter = data.removeAfter || false;
    }
}

class CbiConfig {
    public folder: Object;
    public option: CbiConfigOption;
    public source: string[][];
    public cwd: string;

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
    public name: string;
    public description: string;
    public version: string;
    public main: string;
    public ignore: string[];
    public dependencies: Object[];
    public devDependencies: Object[];
    public cInstall: CbiConfig;

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
