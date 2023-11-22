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
import { ResdbEndpoints } from './endpoints';
import type { TransportInterface } from '../Transport/interface';
import type { AxiosHeaders, AxiosResponse } from 'axios';
import type { ResDBConfig, ResdbInterface } from './interface';
import type { Node } from './interface';
/**
 * @class Resdb
 * @implements {ResdbInterface}
 */
export declare class Resdb implements ResdbInterface {
    private _nodes;
    private _transport;
    private _transaction;
    private _outputs;
    private _assets;
    private _metadata;
    private _blocks;
    api_prefix: string;
    /**
     * @constructor
     * @param {string[] | Node[]} nodes
     * @param {ResDBConfig} config
     * @returns {Resdb} Return instance of Resdb
     */
    constructor(nodes: string[] | Node[], config?: ResDBConfig);
    /**
     * @method nodes
     * @returns {Node[]} Returns `this._nodes`
     */
    nodes(): Node[];
    /**
     * @method transaction
     * @returns {ResdbEndpoints.TransactionsEndpoint} Returns `this._transaction`
     */
    transaction(): ResdbEndpoints.TransactionsEndpoint;
    /**
     * @method outputs
     * @returns {ResdbEndpoints.OutputsEndpointEndpoint} Returns `this._outputs`
     */
    outputs(): ResdbEndpoints.OutputsEndpoint;
    /**
     * @method asset
     * @returns {ResdbEndpoints.AssetsEndpoint} Returns `this._assets`
     */
    asset(): ResdbEndpoints.AssetsEndpoint;
    /**
     * @method metadata
     * @returns {ResdbEndpoints.MetadataEndpoint} Returns `this._metadata`
     */
    metadata(): ResdbEndpoints.MetadataEndpoint;
    /**
     * @method transport
     * @returns {TransportInterface} Returns `this._transport`
     */
    transport(): TransportInterface;
    /**
     * @method blocks
     * @returns {ResdbEndpoints.BlocksEndpoint} Returns `this._blocks`
     */
    blocks(): ResdbEndpoints.BlocksEndpoint;
    /**
     * @method info
     * @param {AxiosHeaders} headers
     * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling the `/` endpoint
     */
    info(headers: AxiosHeaders): Promise<[AxiosResponse | undefined, Error | undefined]>;
    /**
     * @method info
     * @param {AxiosHeaders} headers
     * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling the `/${this._api_prefix}` endpoint
     */
    apiInfo(headers: AxiosHeaders): Promise<[AxiosResponse | undefined, Error | undefined]>;
    getTransaction(txid: string): Promise<void>;
}
