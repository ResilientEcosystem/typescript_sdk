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
import type { Endpoint, GetAssetsEndpointConfig, GetBlocksEndpointConfig, GetMetadataEndpointConfig, GetOutputsEndpointConfig, GetTransactionsEndpointConfig, PrepareTransactionConfig } from './interface';
import { TransactionSerializable } from '../Transaction/interface';
/**
 * @namespace ResdbEndpoints
 */
export declare namespace ResdbEndpoints {
    /**
     * @abstract
     * @class NamespacedDriver
     * @implements Endpoints
     * Base class for all endpoint drivers
     */
    abstract class NamespacedDriver implements Endpoint {
        private readonly _path;
        private readonly _driver;
        /**
         * @constructor
         * @param {string} path
         * @param {Resdb} driver
         * @returns {NamespacedDriver} Returns instance of name spaced driver upon super()
         */
        constructor(path: string, driver: Resdb);
        /**
         * @method transport
         * @public
         * @returns {TransportInterface} Return the driver's tranport API
         */
        transport(): TransportInterface;
        /**
         * @method api_prefix
         * @public
         * @returns {string} Returns api_prefix, the api version
         */
        api_prefix(): string;
        /**
         * @method path
         * @public
         * @returns {string} returns the server path for endpint
         */
        path(): string;
        /**
         * @method get
         * @abstract
         * @public
         * @param {unknown[]} args
         * @returns {Promise<[AxiosResponse | undefined, Error
         *  undefined]>} Template for children class get functions
         */
        abstract get(...args: unknown[]): Promise<[AxiosResponse | undefined, Error | undefined]>;
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
        constructor(driver: Resdb);
        static prepare(config: PrepareTransactionConfig): TransactionSerializable;
        static fulfill(transaction: TransactionSerializable, privateKeys: string | string[]): TransactionSerializable;
        /**
         * @method get
         * @param {string} asset_id
         * @param {GetTransactionsEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response from transaction endpoint
         */
        get(asset_id: string, config: GetTransactionsEndpointConfig): Promise<[AxiosResponse | undefined, Error | undefined]>;
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
        sendCommit(transaction: Record<string, unknown>, headers?: AxiosHeaders): Promise<[AxiosResponse | undefined, Error | undefined]>;
        /**
         * @method retrieve
         * @param {string} txid
         * @param {AxiosHeaders} headers
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Return axios response after retriving transaction
         */
        retrieve(txid: string, headers?: AxiosHeaders): Promise<[AxiosResponse | undefined, Error | undefined]>;
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
        constructor(driver: Resdb);
        /**
         * @method get
         * @param {string} public_key
         * @param {GetOutputsEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling OutputsEndpoint's get route
         */
        get(public_key: string, config: GetOutputsEndpointConfig): Promise<[AxiosResponse | undefined, Error | undefined]>;
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
        constructor(driver: Resdb);
        /**
         * @method get
         * @param {string} txid
         * @param {GetBlocksEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling BlocksEndpoint's get route
         */
        get(txid: string, config: GetBlocksEndpointConfig): Promise<[AxiosResponse | undefined, Error | undefined]>;
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
        constructor(driver: Resdb);
        /**
         * @method get
         * @param {string} search
         * @param {GetAssetsEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling AssetsEndpoint's get route
         */
        get(search: string, config: GetAssetsEndpointConfig): Promise<[AxiosResponse | undefined, Error | undefined]>;
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
        constructor(driver: Resdb);
        /**
         * @method get
         * @param {string} search
         * @param {GetMetadataEndpointConfig} config
         * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Return axios response object after calling the MetadataEndpoint's get route
         */
        get(search: string, config: GetMetadataEndpointConfig): Promise<[AxiosResponse | undefined, Error | undefined]>;
    }
    export {};
}
