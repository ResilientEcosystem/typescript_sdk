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
const Transport_1 = require("../Transport");
const nodeUtils_1 = __importDefault(require("../utils/common/nodeUtils"));
const endpoints_1 = require("./endpoints");
class Resdb {
    constructor(nodes, config = {}) {
        var _a;
        this.api_prefix = process.env.RESDB_VERSION || '/v1';
        const transportModule = (_a = config === null || config === void 0 ? void 0 : config.transportModule) !== null && _a !== void 0 ? _a : Transport_1.Transport;
        this._nodes = nodeUtils_1.default.normalize_nodes(nodes, config.headers);
        this._transport = new transportModule(this._nodes, (config === null || config === void 0 ? void 0 : config.timeout) || 20);
        this._transaction = new endpoints_1.ResdbEndpoints.TransactionsEndpoint(this);
        this._outputs = new endpoints_1.ResdbEndpoints.OutputsEndpoint(this);
        this._assets = new endpoints_1.ResdbEndpoints.AssetsEndpoint(this);
        this._metadata = new endpoints_1.ResdbEndpoints.MetadataEndpoint(this);
        this._blocks = new endpoints_1.ResdbEndpoints.BlocksEndpoint(this);
    }
    nodes() {
        return this._nodes;
    }
    transaction() {
        return this._transaction;
    }
    outputs() {
        return this._outputs;
    }
    asset() {
        return this._assets;
    }
    metadata() {
        return this._metadata;
    }
    transport() {
        return this._transport;
    }
    blocks() {
        return this._blocks;
    }
    info(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport().forwardRequest('GET', '/', { headers });
        });
    }
}
exports.default = Resdb;
