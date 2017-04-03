"use strict";

export default class CbiConfigOptionDefault {
    public folder: string;
    public minFolder: string;

    constructor(data) {
        data = data || {};

        this.folder = data.folder || "";
        this.minFolder = data.minFolder || "";
    }
};
