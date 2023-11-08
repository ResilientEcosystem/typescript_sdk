"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const NodeUtils = __importStar(require("../utils/common/nodeUtils"));
const endpoints_1 = require("./endpoints");
class Resdb {
    constructor(nodes, tranport_module, config = {}) {
        this.api_prefix = process.env.RESDB_VERSION || 'v1';
        this._nodes = NodeUtils.normalize_nodes(nodes, config.headers);
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
