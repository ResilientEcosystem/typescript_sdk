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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Pool_1 = require("../Pool");
const Connection_1 = require("../Connection");
const nodeUtils_1 = __importDefault(require("../utils/common/nodeUtils"));
const NO_TIMEOUT_BACKOFF_CAP = 10000;
class Transport {
    constructor(nodes, timeoutInMs = 0) {
        this.nodes = nodeUtils_1.default.normalize_nodes(nodes, undefined);
        this.timeoutInMs = timeoutInMs;
        this.connection_pool = new Pool_1.Pool(this.construct_endpoints());
    }
    construct_endpoints() {
        return this.nodes.map(({ headers, endpoint }) => new Connection_1.Connection(endpoint, headers));
    }
    forward_request(method, path, config) {
        return __awaiter(this, void 0, void 0, function* () {
            // do some checking with the backoff delta, ensure no errors with the pool call
            return yield this.connection_pool
                .getConnection()
                .request(method, path, NO_TIMEOUT_BACKOFF_CAP, config);
        });
    }
}
exports.default = Transport;
