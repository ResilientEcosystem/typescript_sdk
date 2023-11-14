"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pool_1 = require("../Pool");
const Connection_1 = require("../Connection");
const NO_TIMEOUT_BACKOFF_CAP = 10000;
class Transport {
    constructor(nodes, timeoutInMs = 0) {
        this.nodes = nodes;
        this.timeoutInMs = timeoutInMs;
        this.connectionPool = new Pool_1.Pool(this.constructEndpoints());
    }
    constructEndpoints() {
        return this.nodes.map(({ headers, endpoint }) => new Connection_1.Connection(endpoint, headers));
    }
    forwardRequest(method, path, axiosConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            // do some checking with the backoff delta, ensure no errors with the pool call
            return yield this.connectionPool
                .getConnection()
                .request(method, path, {
                backoffCap: NO_TIMEOUT_BACKOFF_CAP,
                axiosConfig,
            });
        });
    }
}
exports.default = Transport;
