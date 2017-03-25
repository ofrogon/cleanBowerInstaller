"use strict";

import CbiConfig from "./CbiConfig";
import {CbiConfigOption, CbiConfigOptionDefault, CbiConfigOptionMin} from "./CbiConfigOption";

class BowerConfiguration {
    public name: string;
    public description: string;
    public version: string;
    public main: string;
    public ignore: string[];
    public dependencies: Array<object>;
    public devDependencies: Array<object>;
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
