"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestError = void 0;
class RequestError {
    constructor(message) {
        this.name = "RequestError";
        this.message = message;
    }
}
exports.RequestError = RequestError;
