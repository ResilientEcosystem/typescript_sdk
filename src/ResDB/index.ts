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

import { Transport } from '../Transport';
import { NodeUtils } from '../utils/commonUtils';
import { ResdbEndpoints } from './endpoints';

import type { TransportInterface } from '../Transport/interface';
import type { AxiosHeaders, AxiosResponse } from 'axios';
import type { ResDBConfig, ResdbInterface } from './interface';
import type { Node } from './interface';

/**
 * @class Resdb
 * @implements {ResdbInterface}
 */
export class Resdb implements ResdbInterface {
    private _nodes: Node[];
    private _transport: TransportInterface;
    private _transaction: ResdbEndpoints.TransactionsEndpoint;
    private _outputs: ResdbEndpoints.OutputsEndpoint;
    private _assets: ResdbEndpoints.AssetsEndpoint;
    private _metadata: ResdbEndpoints.MetadataEndpoint;
    private _blocks: ResdbEndpoints.BlocksEndpoint;
    public api_prefix: string = '/v1';

    /**
     * @constructor
     * @param {string[] | Node[]} nodes
     * @param {ResDBConfig} config
     * @returns {Resdb} Return instance of Resdb
     */
    public constructor(nodes: string[] | Node[], config: ResDBConfig = {}) {
        const transportModule: typeof TransportInterface =
            config?.transportModule ?? Transport;

        this._nodes = NodeUtils.normalize_nodes(nodes, config.headers);
        this._transport = new transportModule(
            this._nodes,
            config?.timeout || 20
        );
        this._transaction = new ResdbEndpoints.TransactionsEndpoint(this);
        this._outputs = new ResdbEndpoints.OutputsEndpoint(this);
        this._assets = new ResdbEndpoints.AssetsEndpoint(this);
        this._metadata = new ResdbEndpoints.MetadataEndpoint(this);
        this._blocks = new ResdbEndpoints.BlocksEndpoint(this);
    }

    /**
     * @method nodes
     * @returns {Node[]} Returns `this._nodes`
     */
    public nodes(): Node[] {
        return this._nodes;
    }

    /**
     * @method transaction
     * @returns {ResdbEndpoints.TransactionsEndpoint} Returns `this._transaction`
     */
    public transaction(): ResdbEndpoints.TransactionsEndpoint {
        return this._transaction;
    }

    /**
     * @method outputs
     * @returns {ResdbEndpoints.OutputsEndpointEndpoint} Returns `this._outputs`
     */
    public outputs(): ResdbEndpoints.OutputsEndpoint {
        return this._outputs;
    }

    /**
     * @method asset
     * @returns {ResdbEndpoints.AssetsEndpoint} Returns `this._assets`
     */
    public asset(): ResdbEndpoints.AssetsEndpoint {
        return this._assets;
    }

    /**
     * @method metadata
     * @returns {ResdbEndpoints.MetadataEndpoint} Returns `this._metadata`
     */
    public metadata(): ResdbEndpoints.MetadataEndpoint {
        return this._metadata;
    }

    /**
     * @method transport
     * @returns {TransportInterface} Returns `this._transport`
     */
    public transport(): TransportInterface {
        return this._transport;
    }

    /**
     * @method blocks
     * @returns {ResdbEndpoints.BlocksEndpoint} Returns `this._blocks`
     */
    public blocks(): ResdbEndpoints.BlocksEndpoint {
        return this._blocks;
    }

    /**
     * @method info
     * @param {AxiosHeaders} headers
     * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling the `/` endpoint
     */
    public async info(
        headers: AxiosHeaders
    ): Promise<[AxiosResponse | undefined, Error | undefined]> {
        return this.transport().forwardRequest('GET', '/', { headers });
    }

    /**
     * @method info
     * @param {AxiosHeaders} headers
     * @returns {Promise<[AxiosResponse | undefined, Error | undefined]>} Returns axios response after calling the `/${this._api_prefix}` endpoint
     */
    public async apiInfo(
        headers: AxiosHeaders
    ): Promise<[AxiosResponse | undefined, Error | undefined]> {
        return this.transport().forwardRequest('GET', this.api_prefix, {
            headers,
        });
    }

    // TODO
    public async getTransaction(txid: string): Promise<void> {
        console.log('NOT IMPLEMENTED');
    }
}
