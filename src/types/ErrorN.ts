"use strict";

class ErrorN extends Error {
    public code: string;
    public details?: string;
}

export default ErrorN;
