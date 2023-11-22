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

import { Resdb } from './index';

import type { AxiosHeaders, AxiosResponse } from 'axios';
import type { TransportInterface } from '../Transport/interface';
import type {
    Endpoint,
    GetAssetsEndpointConfig,
    GetBlocksEndpointConfig,
    GetMetadataEndpointConfig,
    GetOutputsEndpointConfig,
    GetTransactionsEndpointConfig,
    EndpointUrls,
    PrepareTransactionConfig,
} from './interface';

/**
 * @namespace ResdbEndpoints
 */
export namespace ResdbEndpoints {
    const endpointUrlStrings: EndpointUrls = {
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
    abstract class NamespacedDriver implements Endpoint {
        private readonly _path: string;
        private readonly _driver: Resdb;

        /**
         * @constructor
         * @param {string} path
         * @param {Resdb} driver
         * @returns {NamespacedDriver} Returns instance of name spaced driver upon super()
         */
        public constructor(path: string, driver: Resdb) {
            this._path = path;
            this._driver = driver;
        }

        /**
         * @method transport
         * @public
         * @returns {TransportInterface} Return the driver's tranport API
         */
        public transport(): TransportInterface {
            return this._driver.transport();
        }

        /**
         * @method api_prefix
         * @public
         * @returns {string} Returns api_prefix, the api version
         */
        public api_prefix(): string {
            return this._driver.api_prefix;
        }

        /**
         * @method path
         * @public
         * @returns {string} returns the server path for endpint
         */
        public path(): string {
            return this.api_prefix() + this._path;
        }

        /**
         * @method get
         * @abstract
         * @public
         * @param {unknown[]} args
         * @returns {Promise<[AxiosResponse | undefined, Error
         *  undefined]>} Template for children class get functions
         */
        abstract get(
            ...args: unknown[]
        ): Promise<[AxiosResponse | undefined, Error | undefined]>;
    }

    /**
     * @class TransactionsEndpoint
     * @extends NamespacedDriver
     */
    export class TransactionsEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {TransactionsEndpoint} Instantiates instance of TransactionsEndpoint
         */
        public constructor(driver: Resdb) {
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
        public async get(
            asset_id: string,
            config: GetTransactionsEndpointConfig
        ): Promise<[AxiosResponse | undefined, Error | undefined]> {
            return await this.transport().forwardRequest('GET', this.path(), {
                params: { asset_id, operation: config?.operation },
                headers: config?.headers,
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
        public async sendCommit(
            transaction: Record<string, unknown>,
            headers?: AxiosHeaders
        ): Promise<[AxiosResponse | undefined, Error | undefined]> {
            const path = this.path() + 'commit';
            return await this.transport().forwardRequest('POST', path, {
                data: transaction,
                headers,
            });
        }

        /**
         * @method retrieve
         * @param {string} txid
         * @param {AxiosHeaders} headers
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Return axios response after retriving transaction
         */
        public async retrieve(
            txid: string,
            headers?: AxiosHeaders
        ): Promise<[AxiosResponse | undefined, Error | undefined]> {
            const path = this.path() + txid;
            return await this.transport().forwardRequest('POST', path, {
                headers,
            });
        }
    }

    /**
     * @class OutputsEndpoint
     * @extends NamespacedDriver
     */
    export class OutputsEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {OutputsEndpoint} - Returns instance of `OutputsEndpoint`
         */
        public constructor(driver: Resdb) {
            super(endpointUrlStrings.output, driver);
        }

        /**
         * @method get
         * @param {string} public_key
         * @param {GetOutputsEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling OutputsEndpoint's get route
         */
        public async get(
            public_key: string,
            config: GetOutputsEndpointConfig
        ): Promise<[AxiosResponse | undefined, Error | undefined]> {
            return await this.transport().forwardRequest('GET', this.path(), {
                params: { public_key, spent: config?.spent },
                headers: config?.headers,
            });
        }
    }

    /**
     * @class BlocksEndpoint
     * @extends NamespacedDriver
     */
    export class BlocksEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {BlocksEndpoint} Returns instance of the BlocksEndpoint
         */
        public constructor(driver: Resdb) {
            super(endpointUrlStrings.blocks, driver);
        }

        /**
         * @method get
         * @param {string} txid
         * @param {GetBlocksEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling BlocksEndpoint's get route
         */
        public async get(
            txid: string,
            config: GetBlocksEndpointConfig
        ): Promise<[AxiosResponse | undefined, Error | undefined]> {
            return await this.transport().forwardRequest('GET', this.path(), {
                params: { transaction_id: txid },
                headers: config?.headers,
            });
        }
    }

    /**
     * @class AssetsEndpoint
     * @extends NamespacedDriver
     */
    export class AssetsEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {AssetsEndpoint} Returns instance of AssetsEndpoint
         */
        public constructor(driver: Resdb) {
            super(endpointUrlStrings.blocks, driver);
        }

        /**
         * @method get
         * @param {string} search
         * @param {GetAssetsEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling AssetsEndpoint's get route
         */
        public async get(
            search: string,
            config: GetAssetsEndpointConfig
        ): Promise<[AxiosResponse | undefined, Error | undefined]> {
            return await this.transport().forwardRequest('GET', this.path(), {
                params: { search, limit: config?.limit },
                headers: config?.headers,
            });
        }
    }

    /**
     * @class OutputsEndpoint
     * @extends NamespacedDriver
     */
    export class MetadataEndpoint extends NamespacedDriver {
        /**
         * @constructor
         * @param {Resdb} driver
         * @returns {MetadataEndpoint} Return instance of MetadataEndpoint
         */
        public constructor(driver: Resdb) {
            super(endpointUrlStrings.metadata, driver);
        }

        /**
         * @method get
         * @param {string} search
         * @param {GetMetadataEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Return axios response object after calling the MetadataEndpoint's get route
         */
        public async get(
            search: string,
            config: GetMetadataEndpointConfig
        ): Promise<[AxiosResponse | undefined, Error | undefined]> {
            return await this.transport().forwardRequest('GET', this.path(), {
                params: { search, limit: config?.limit },
                headers: config?.headers,
            });
        }
    }
}
