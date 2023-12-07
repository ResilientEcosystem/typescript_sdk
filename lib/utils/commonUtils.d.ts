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
import { AxiosHeaders } from 'axios';
import type { Node } from '../ResDB/interface';
import { TransactionOperationType } from '../Transaction/interface';
/**
 * @namespace NodeUtils
 * @constant {string} DEFAULT_NODE
 * @function normalize_nodes
 * @function gen_timestamp
 * @function _get_default_port
 * @function normalize_url
 * @function normalize_node
 */
export declare namespace NodeUtils {
    /**
     * @function normalize_nodes
     * @param {Node[] | string[]} nodes
     * @param {AxiosHeaders | undefined} headers
     * @returns {Node[]} - Returns list of normalized nodes
     */
    const normalize_nodes: (nodes: Node[] | string[], headers: AxiosHeaders | undefined) => Node[];
    /**
     * @function gen_timestamp
     * @returns {string} - Returns DateTime in unix ms
     */
    const gen_timestamp: () => string;
}
/**
 * @namespace DataUtils
 * @function serialize
 */
export declare namespace DataUtils {
    /**
     * @function serialize
     * @param {Record<string, unknown>} data
     * @returns {string} - Sorts dictionary and returns stringified dictionary
     */
    const serialize: (data: Record<string, unknown>) => string;
}
export declare namespace TransactionUtils {
    class CreateOperation {
    }
    class TransferOperation {
    }
    function normalizeOperation(operation: TransactionOperationType): CreateOperation | TransferOperation;
}
