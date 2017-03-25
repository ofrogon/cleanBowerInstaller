"use strict";

import ErrorN from "./types/ErrorN";

/**
 * Create an error Node.js style
 */
const createError = (msg: string, code: string, props?: object): ErrorN => {
    const err: ErrorN = new ErrorN(msg);
    err.code = code;

    if (props) {
        Object.assign(err, props);
    }

    return err;
};

export default createError;
