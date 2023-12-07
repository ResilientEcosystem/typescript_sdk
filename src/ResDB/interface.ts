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

import type { AxiosHeaders, AxiosResponse } from 'axios';
import type { ResdbEndpoints } from './endpoints';
import type { TransportInterface } from '../Transport/interface';
import type {
    CreateAsset,
    InputObjectSerializable,
    TransactionOperationType,
    TransferAsset,
} from '../Transaction/interface';

/**
 * @interface Node
 * @member {string} endpoint - Connection or Node url
 * @member {AxiosHeaders} headers - Optional Axios headers
 */
export interface Node {
    endpoint: string;
    headers?: AxiosHeaders;
}

/**
 * @interface EndpointUrls
 * @member {string} transaction
 * @member {string} asset
 * @member {string} output
 * @member {string} blocks
 * @member {string} metadata
 */
export interface EndpointUrls {
    [key: string]: string;
    transaction: string;
    asset: string;
    output: string;
    blocks: string;
    metadata: string;
}

/**
 * @interface ResDBConfig
 * @member {typeof TransportInterface} transportModule - Optional
 * - Defaulted to Transport
 * @member {AxiosHeaders} headers - Optional
 * @member {number} timeout - Optional
 */
export interface ResDBConfig {
    transportModule?: typeof TransportInterface;
    headers?: AxiosHeaders;
    timeout?: number;
}

/**
 * @interface ResdbInterface
 * @member {string} api_prefix
 * @method nodes
 * @method transaction
 * @method outputs
 * @method asset
 * @method metadata
 * @method transport
 * @method blocks
 * @method info
 * @method apiInfo
 * @method getTransaction
 */

export interface ResdbInterface {
    api_prefix: string;
    nodes(): Node[];
    transaction(): ResdbEndpoints.TransactionsEndpoint;
    outputs(): ResdbEndpoints.OutputsEndpoint;
    asset(): ResdbEndpoints.AssetsEndpoint;
    metadata(): ResdbEndpoints.MetadataEndpoint;
    transport(): TransportInterface;
    blocks(): ResdbEndpoints.BlocksEndpoint;
    info(
        headers: AxiosHeaders
    ): Promise<[AxiosResponse | undefined, Error | undefined]>;
    apiInfo(
        headers: AxiosHeaders
    ): Promise<[AxiosResponse | undefined, Error | undefined]>;
    getTransaction(txid: string): Promise<void>; // NOT IMPLEMENTED
}

/**
 * @interface ResdbConstructor
 * @constructor
 */
interface ResdbConstructor {
    new (nodes: string[] | Node[], config: ResDBConfig): ResdbInterface;
}

/**
 * @interface
 * Ambient declaration for the ResdbInterface constructor
 */
export declare var ResdbInterface: ResdbConstructor;

/**
 * @interface Endpoint
 * @method get - Template function for all Endpoint implementations
 */
export interface Endpoint {
    get(
        ...args: unknown[]
    ): Promise<[AxiosResponse | undefined, Error | undefined]>;
}

/**
 * @interface GetEndpointConfig
 * @member {AxiosHeaders} headers - Optional
 */
interface GetEndpointConfig {
    headers?: AxiosHeaders;
}

/**
 * @interface GetTransactionsEndpointConfig
 * @member {string} operation - Optional
 */
export interface GetTransactionsEndpointConfig extends GetEndpointConfig {
    operation?: string;
}

/**
 * @interface GetOutputsEndpointConfig
 * @member {boolean} spent - Optional
 */
export interface GetOutputsEndpointConfig extends GetEndpointConfig {
    spent?: boolean;
}

/**
 * @interface GetBlocksEndpointConfig
 * Contains nothing. For future additions if needed
 */
export interface GetBlocksEndpointConfig extends GetEndpointConfig {}

/**
 * @interface GetAssetsEndpointConfig
 * @member {number} limit - Optional
 */
export interface GetAssetsEndpointConfig extends GetEndpointConfig {
    limit?: number;
}

/**
 * @interface GetMetadataEndpointConfig
 * @member {number} limit - Optional
 */
export interface GetMetadataEndpointConfig extends GetEndpointConfig {
    limit?: number;
}

// TODO
export interface PrepareTransactionConfig {
    operation: TransactionOperationType;
    signers: string[] | string;
    recipients?: string[] | string;
    asset?: CreateAsset | TransferAsset;
    metadata?: Record<string, unknown>;
    inputs?: InputObjectSerializable[];
}
