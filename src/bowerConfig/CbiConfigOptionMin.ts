"use strict";

export default class CbiConfigOptionMin {
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
