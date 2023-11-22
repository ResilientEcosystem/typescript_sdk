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
exports.ResdbEndpoints = void 0;
/**
 * @namespace ResdbEndpoints
 */
var ResdbEndpoints;
(function (ResdbEndpoints) {
    const endpointUrlStrings = {
        transaction: '/transactions/',
        asset: '/assets/',
        output: '/outputs/',
        blocks: '/blocks/',
        metadata: '/metadata/',
    };
    /**
     * @abstract
     * @class NamespacedDriver
     * @implements Endpoints
     * Base class for all endpoint drivers
     */
    class NamespacedDriver {
        /**
         * @constructor
         * @param {string} path
         * @param {Resdb} driver
         * @returns {NamespacedDriver} Returns instance of name spaced driver upon super()
         */
        constructor(path, driver) {
            this._path = path;
            this._driver = driver;
        }
        /**
         * @method transport
         * @public
         * @returns {TransportInterface} Return the driver's tranport API
         */
        transport() {
            return this._driver.transport();
        }
        /**
         * @method api_prefix
         * @public
         * @returns {string} Returns api_prefix, the api version
         */
        api_prefix() {
            return this._driver.api_prefix;
        }
        /**
         * @method path
         * @public
         * @returns {string} returns the server path for endpint
         */
        path() {
            return this.api_prefix() + this._path;
        }
    }
    /**
     * @class TransactionsEndpoint
     * @extends NamespacedDriver
     */
    class TransactionsEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {TransactionsEndpoint} Instantiates instance of TransactionsEndpoint
         */
        constructor(driver) {
            super(endpointUrlStrings.transaction, driver);
        }
        // TODO
        // public static prepare(config: PrepareTransactionConfig) {
        // };
        // public static fulfill() {
        // };
        /**
         * @method get
         * @param {string} asset_id
         * @param {GetTransactionsEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response from transaction endpoint
         */
        get(asset_id, config) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.transport().forwardRequest('GET', this.path(), {
                    params: { asset_id, operation: config === null || config === void 0 ? void 0 : config.operation },
                    headers: config === null || config === void 0 ? void 0 : config.headers,
                });
            });
        }
        /** NOT IMPLEMENTED
         * public send_async(transaction, headers: DictionaryObject = {});
         * public send_sync(transaction, headers: DictionaryObject = {})
         */
        /**
         * @method sendCommit
         * @param {Record<string, unknown>} transaction
         * @param {AxiosHeaders} headers
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns response after send commit
         */
        sendCommit(transaction, headers) {
            return __awaiter(this, void 0, void 0, function* () {
                const path = this.path() + 'commit';
                return yield this.transport().forwardRequest('POST', path, {
                    data: transaction,
                    headers,
                });
            });
        }
        /**
         * @method retrieve
         * @param {string} txid
         * @param {AxiosHeaders} headers
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Return axios response after retriving transaction
         */
        retrieve(txid, headers) {
            return __awaiter(this, void 0, void 0, function* () {
                const path = this.path() + txid;
                return yield this.transport().forwardRequest('POST', path, {
                    headers,
                });
            });
        }
    }
    ResdbEndpoints.TransactionsEndpoint = TransactionsEndpoint;
    /**
     * @class OutputsEndpoint
     * @extends NamespacedDriver
     */
    class OutputsEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {OutputsEndpoint} - Returns instance of `OutputsEndpoint`
         */
        constructor(driver) {
            super(endpointUrlStrings.output, driver);
        }
        /**
         * @method get
         * @param {string} public_key
         * @param {GetOutputsEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling OutputsEndpoint's get route
         */
        get(public_key, config) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.transport().forwardRequest('GET', this.path(), {
                    params: { public_key, spent: config === null || config === void 0 ? void 0 : config.spent },
                    headers: config === null || config === void 0 ? void 0 : config.headers,
                });
            });
        }
    }
    ResdbEndpoints.OutputsEndpoint = OutputsEndpoint;
    /**
     * @class BlocksEndpoint
     * @extends NamespacedDriver
     */
    class BlocksEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {BlocksEndpoint} Returns instance of the BlocksEndpoint
         */
        constructor(driver) {
            super(endpointUrlStrings.blocks, driver);
        }
        /**
         * @method get
         * @param {string} txid
         * @param {GetBlocksEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling BlocksEndpoint's get route
         */
        get(txid, config) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.transport().forwardRequest('GET', this.path(), {
                    params: { transaction_id: txid },
                    headers: config === null || config === void 0 ? void 0 : config.headers,
                });
            });
        }
    }
    ResdbEndpoints.BlocksEndpoint = BlocksEndpoint;
    /**
     * @class AssetsEndpoint
     * @extends NamespacedDriver
     */
    class AssetsEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {AssetsEndpoint} Returns instance of AssetsEndpoint
         */
        constructor(driver) {
            super(endpointUrlStrings.blocks, driver);
        }
        /**
         * @method get
         * @param {string} search
         * @param {GetAssetsEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling AssetsEndpoint's get route
         */
        get(search, config) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.transport().forwardRequest('GET', this.path(), {
                    params: { search, limit: config === null || config === void 0 ? void 0 : config.limit },
                    headers: config === null || config === void 0 ? void 0 : config.headers,
                });
            });
        }
    }
    ResdbEndpoints.AssetsEndpoint = AssetsEndpoint;
    /**
     * @class OutputsEndpoint
     * @extends NamespacedDriver
     */
    class MetadataEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {MetadataEndpoint} Return instance of MetadataEndpoint
         */
        constructor(driver) {
            super(endpointUrlStrings.metadata, driver);
        }
        /**
         * @method get
         * @param {string} search
         * @param {GetMetadataEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Return axios response object after calling the MetadataEndpoint's get route
         */
        get(search, config) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.transport().forwardRequest('GET', this.path(), {
                    params: { search, limit: config === null || config === void 0 ? void 0 : config.limit },
                    headers: config === null || config === void 0 ? void 0 : config.headers,
                });
            });
        }
    }
    ResdbEndpoints.MetadataEndpoint = MetadataEndpoint;
})(ResdbEndpoints || (exports.ResdbEndpoints = ResdbEndpoints = {}));
