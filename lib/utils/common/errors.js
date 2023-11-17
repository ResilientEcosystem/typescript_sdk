"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = void 0;
;
class TimeoutError {
    constructor(origin, errorTrace) {
        this.name = "TimeoutError";
        this.message = `Timeout Error in module ${origin}`;
        this.errorTrace = errorTrace;
    }
}
exports.TimeoutError = TimeoutError;
