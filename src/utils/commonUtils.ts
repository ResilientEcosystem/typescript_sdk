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

import * as url from 'url';
import * as _ from 'lodash';
import { DateTime } from 'luxon';
import { AxiosHeaders } from 'axios';
import type { Node } from '../ResDB/interface';
import { TransactionOperationType } from '../Transaction/interface';
import { ValueError } from './errors';

/**
 * @namespace NodeUtils
 * @constant {string} DEFAULT_NODE
 * @function normalize_nodes
 * @function gen_timestamp
 * @function _get_default_port
 * @function normalize_url
 * @function normalize_node
 */
export namespace NodeUtils {
    const DEFAULT_NODE: string = 'http://localhost:9984';

    /**
     * @function normalize_nodes
     * @param {Node[] | string[]} nodes
     * @param {AxiosHeaders | undefined} headers
     * @returns {Node[]} - Returns list of normalized nodes
     */
    export const normalize_nodes = (
        nodes: Node[] | string[],
        headers: AxiosHeaders | undefined
    ): Node[] => {
        if (!nodes.length) {
            return [normalize_node(DEFAULT_NODE, headers)];
        }
        return _.map<Node | string, Node>(nodes, (node) =>
            normalize_node(node, headers)
        );
    };

    /**
     * @function gen_timestamp
     * @returns {string} - Returns DateTime in unix ms
     */
    export const gen_timestamp = (): string => {
        return DateTime.now().toUnixInteger().toString();
    };

    /**
     * @function _get_default_port
     * @param {string} scheme
     * @returns {number} - Returns the default port depending on https
     * - https: 443
     * - other: 9984
     */
    const _get_default_port = (scheme: string): number => {
        return scheme === 'https' ? 443 : 9984;
    };

    /**
     * @function normalize_url
     * @param {string} node
     * @returns {string} - Returns string after normalization
     */
    const normalize_url = (node: string): string => {
        if (!node) {
            node = DEFAULT_NODE;
        } else if (!node.includes('://')) {
            node = `//${node}`;
        }
        const parts = url.parse(node, true);
        const port = parts.port
            ? parts.port.toString()
            : _get_default_port(parts.protocol || '');
        const netloc = `${parts.hostname || ''}:${port}`;
        const modifiedURL = url.format({
            protocol: parts.protocol || 'http:',
            host: netloc,
            pathname: parts.pathname || '/',
        });

        return modifiedURL;
    };

    /**
     * @function normalize_node
     * @param {string | Node} node
     * @param {AxiosHeaders | undefined} headers
     * @returns {Node} - Returns normalized node
     */
    const normalize_node = (
        node: string | Node,
        headers: AxiosHeaders | undefined
    ): Node => {
        if (!headers) {
            headers = new AxiosHeaders();
        }
        let url;
        if (typeof node === 'string') {
            url = normalize_url(node);
            return { endpoint: url, headers: headers };
        }
        url = normalize_url(node['endpoint']);

        // MAKE SURE THIS IS NOT NEEDED

        // const node_headers = {...headers}
        return {
            endpoint: url,
            headers: new AxiosHeaders(headers),
        };
    };
}

/**
 * @namespace DataUtils
 * @function serialize
 */
export namespace DataUtils {
    /**
     * @function serialize
     * @param {Record<string, unknown>} data
     * @returns {string} - Sorts dictionary and returns stringified dictionary
     */
    export const serialize = (data: Record<string, unknown>): string => {
        const sortedKeys: string[] = Object.keys(data).sort();
        const sortedObject: Object = {};

        for (const key of sortedKeys) {
            sortedObject[key] = data[key];
        }
        return JSON.stringify(sortedObject);
    };
}

export namespace TransactionUtils {
    export class CreateOperation {
        // Class representing the 'CREATE' transaction operation.
    }

    export class TransferOperation {
        // Class representing the 'TRANSFER' transaction operation.
    }

    const opsMap: {
        [key: string]: new () => CreateOperation | TransferOperation;
    } = {
        CREATE: CreateOperation,
        TRANSFER: TransferOperation,
    };

    export function normalizeOperation(
        operation: TransactionOperationType
    ): CreateOperation | TransferOperation {
        return new opsMap[operation]();
    }
}
