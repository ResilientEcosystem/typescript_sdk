"use strict";
/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
exports.Resdb = void 0;
const Transport_1 = require("../Transport");
const commonUtils_1 = require("../utils/commonUtils");
const endpoints_1 = require("./endpoints");
/**
 * @class Resdb
 * @implements {ResdbInterface}
 */
class Resdb {
    /**
     * @constructor
     * @param {string[] | Node[]} nodes
     * @param {ResDBConfig} config
     * @returns {Resdb} Return instance of Resdb
     */
    constructor(nodes, config = {}) {
        var _a;
        this.api_prefix = '/v1';
        const transportModule = (_a = config === null || config === void 0 ? void 0 : config.transportModule) !== null && _a !== void 0 ? _a : Transport_1.Transport;
        this._nodes = commonUtils_1.NodeUtils.normalize_nodes(nodes, config.headers);
        this._transport = new transportModule(this._nodes, (config === null || config === void 0 ? void 0 : config.timeout) || 20);
        this._transaction = new endpoints_1.ResdbEndpoints.TransactionsEndpoint(this);
        this._outputs = new endpoints_1.ResdbEndpoints.OutputsEndpoint(this);
        this._assets = new endpoints_1.ResdbEndpoints.AssetsEndpoint(this);
        this._metadata = new endpoints_1.ResdbEndpoints.MetadataEndpoint(this);
        this._blocks = new endpoints_1.ResdbEndpoints.BlocksEndpoint(this);
    }
    /**
     * @method nodes
     * @returns {Node[]} Returns `this._nodes`
     */
    nodes() {
        return this._nodes;
    }
    /**
     * @method transaction
     * @returns {ResdbEndpoints.TransactionsEndpoint} Returns `this._transaction`
     */
    transaction() {
        return this._transaction;
    }
    /**
     * @method outputs
     * @returns {ResdbEndpoints.OutputsEndpointEndpoint} Returns `this._outputs`
     */
    outputs() {
        return this._outputs;
    }
    /**
     * @method asset
     * @returns {ResdbEndpoints.AssetsEndpoint} Returns `this._assets`
     */
    asset() {
        return this._assets;
    }
    /**
     * @method metadata
     * @returns {ResdbEndpoints.MetadataEndpoint} Returns `this._metadata`
     */
    metadata() {
        return this._metadata;
    }
    /**
     * @method transport
     * @returns {TransportInterface} Returns `this._transport`
     */
    transport() {
        return this._transport;
    }
    /**
     * @method blocks
     * @returns {ResdbEndpoints.BlocksEndpoint} Returns `this._blocks`
     */
    blocks() {
        return this._blocks;
    }
    /**
     * @method info
     * @param {AxiosHeaders} headers
     * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling the `/` endpoint
     */
    info(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport().forwardRequest('GET', '/', { headers });
        });
    }
    /**
     * @method info
     * @param {AxiosHeaders} headers
     * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling the `/${this._api_prefix}` endpoint
     */
    apiInfo(headers) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transport().forwardRequest('GET', this.api_prefix, {
                headers,
            });
        });
    }
    // TODO
    getTransaction(txid) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('NOT IMPLEMENTED');
        });
    }
}
exports.Resdb = Resdb;
