"use strict";
import CbiConfigOptionDefault from "./CbiConfigOptionDefault";
import CbiConfigOptionMin from "./CbiConfigOptionMin";

class CbiConfigOption {
    public default: CbiConfigOptionDefault;
    public min: CbiConfigOptionMin;
    public verbose: boolean;
    public removeAfter: boolean;

    constructor(data) {
        data = data || {};
        data.default = data.default || {};
        data.min = data.min || {};

        this.default = new CbiConfigOptionDefault(data.default);
        this.min = new CbiConfigOptionMin(data.min);
        this.verbose = data.verbose || false;
        this.removeAfter = data.removeAfter || false;
    }
}

export {CbiConfigOption, CbiConfigOptionMin, CbiConfigOptionDefault};
