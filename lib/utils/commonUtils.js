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
exports.DataUtils = exports.NodeUtils = void 0;
const url = __importStar(require("url"));
const _ = __importStar(require("lodash"));
const luxon_1 = require("luxon");
const axios_1 = require("axios");
/**
 * @namespace NodeUtils
 * @constant {string} DEFAULT_NODE
 * @function normalize_nodes
 * @function gen_timestamp
 * @function _get_default_port
 * @function normalize_url
 * @function normalize_node
 */
var NodeUtils;
(function (NodeUtils) {
    const DEFAULT_NODE = 'http://localhost:9984';
    /**
     * @function normalize_nodes
     * @param {Node[] | string[]} nodes
     * @param {AxiosHeaders | undefined} headers
     * @returns {Node[]} - Returns list of normalized nodes
     */
    NodeUtils.normalize_nodes = (nodes, headers) => {
        if (!nodes.length) {
            return [normalize_node(DEFAULT_NODE, headers)];
        }
        return _.map(nodes, (node) => normalize_node(node, headers));
    };
    /**
     * @function gen_timestamp
     * @returns {string} - Returns DateTime in unix ms
     */
    NodeUtils.gen_timestamp = () => {
        return luxon_1.DateTime.now().toUnixInteger().toString();
    };
    /**
     * @function _get_default_port
     * @param {string} scheme
     * @returns {number} - Returns the default port depending on https
     * - https: 443
     * - other: 9984
     */
    const _get_default_port = (scheme) => {
        return scheme === 'https' ? 443 : 9984;
    };
    /**
     * @function normalize_url
     * @param {string} node
     * @returns {string} - Returns string after normalization
     */
    const normalize_url = (node) => {
        if (!node) {
            node = DEFAULT_NODE;
        }
        else if (!node.includes('://')) {
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
    const normalize_node = (node, headers) => {
        if (!headers) {
            headers = new axios_1.AxiosHeaders();
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
            headers: new axios_1.AxiosHeaders(headers),
        };
    };
})(NodeUtils || (exports.NodeUtils = NodeUtils = {}));
/**
 * @namespace DataUtils
 * @function serialize
 */
var DataUtils;
(function (DataUtils) {
    /**
     * @function serialize
     * @param {Record<string, unknown>} data
     * @returns {string} - Sorts dictionary and returns stringified dictionary
     */
    DataUtils.serialize = (data) => {
        const sortedKeys = Object.keys(data).sort();
        const sortedObject = {};
        for (const key of sortedKeys) {
            sortedObject[key] = data[key];
        }
        return JSON.stringify(sortedObject);
    };
})(DataUtils || (exports.DataUtils = DataUtils = {}));
