"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodeUtils_1 = __importDefault(require("../utils/common/nodeUtils"));
const endpoints_1 = require("./endpoints");
class Resdb {
    constructor(nodes, tranport_module, config = {}) {
        this.api_prefix = process.env.RESDB_VERSION || '/v1';
        this._nodes = nodeUtils_1.default.normalize_nodes(nodes, config.headers);
        this._transaction = new endpoints_1.TransactionsEndpoint(this);
        this._outputs = new endpoints_1.OutputsEndpoint(this);
        this._assets = new endpoints_1.AssetsEndpoint(this);
        this._metadata = new endpoints_1.MetadataEndpoint(this);
        this._blocks = new endpoints_1.BlocksEndpoint(this);
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
}
exports.default = Resdb;
