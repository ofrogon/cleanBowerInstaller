"use strict";

import {CbiConfigOption} from "./CbiConfigOption";

const parseFolderParameters = (data): object => {
    const out = {};

    for (const obj in data) {
        if (data.hasOwnProperty(obj)) {
            const objPart = obj.replace(/\s/g, "").split(",");

            for (const i of objPart) {
                out[i] = data[obj];
            }
        }
    }

    return out;
};

export default class CbiConfig {
    public folder: object;
    public option: CbiConfigOption;
    public source: {
        [name: string]: {
            [name: string]: string
        }
    };
    public cwd: string;

    constructor(data) {
        data = data || {};
        data.option = data.option || {};

        if (data.folder) {
            this.folder = parseFolderParameters(data.folder);
        } else {
            this.folder = {};
        }

        this.option = new CbiConfigOption(data.option);
        this.source = data.source;

        this.cwd = data.cwd || process.cwd();
    }
};
